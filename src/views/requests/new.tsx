import { FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp'
import StyleDivider from '@/components/shared/StyleDivider'
import { useAuth } from '@/context/auth-context'
import {
  createGuidanceRequest,
  fetchCategories,
  type Category,
} from '@/api/guidance'

function emptyToNull(value: string): string | null {
  const trimmed = value.trim()
  return trimmed === '' ? null : trimmed
}

export default function NewGuidanceRequestPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryId, setCategoryId] = useState('')
  const [topic, setTopic] = useState('')
  const [contactName, setContactName] = useState(user?.name ?? '')
  const [contactEmail, setContactEmail] = useState(user?.email ?? '')
  const [contactPhone, setContactPhone] = useState(user?.phone ?? '')
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const items = await fetchCategories()
        if (!cancelled) {
          setCategories(items)
        }
      } catch {
        if (!cancelled) {
          setError('بارگذاری دسته‌ها ناموفق بود.')
        }
      } finally {
        if (!cancelled) {
          setLoadingCategories(false)
        }
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!user) return
    setContactName((prev) => prev || user.name || '')
    setContactEmail((prev) => prev || user.email || '')
    setContactPhone((prev) => prev || user.phone || '')
  }, [user])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setFieldErrors({})

    const nextEmail = emptyToNull(contactEmail)
    const nextPhone = emptyToNull(contactPhone)
    const nextTopic = topic.trim()
    const nextName = contactName.trim()

    if (!categoryId) {
      setFieldErrors({ category_id: 'لطفاً یک دسته انتخاب کنید.' })
      return
    }
    if (nextTopic.length < 3) {
      setFieldErrors({ topic: 'موضوع باید حداقل ۳ کاراکتر باشد.' })
      return
    }
    if (nextName.length < 2) {
      setFieldErrors({ contact_name: 'نام تماس را وارد کنید.' })
      return
    }
    if (!nextEmail && !nextPhone) {
      setFieldErrors({ contact_email: 'حداقل یکی از ایمیل یا تلفن لازم است.' })
      return
    }

    setSubmitting(true)
    try {
      await createGuidanceRequest({
        category_id: Number(categoryId),
        topic: nextTopic,
        contact_name: nextName,
        contact_email: nextEmail,
        contact_phone: nextPhone,
      })
      navigate('/requests', { replace: true })
    } catch (err) {
      const apiError = err as Error & {
        status?: number
        body?: { errors?: Record<string, string[]> }
      }
      if (apiError.status === 422 && apiError.body?.errors) {
        const mapped: Record<string, string> = {}
        for (const [key, messages] of Object.entries(apiError.body.errors)) {
          if (messages[0]) mapped[key] = messages[0]
        }
        setFieldErrors(mapped)
        setError('لطفاً خطاهای فرم را بررسی کنید.')
      } else {
        setError('ثبت درخواست ناموفق بود. دوباره تلاش کنید.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col p-px bg-border gap-px">
      <BreadcrumbComp title="درخواست جدید" />
      <StyleDivider />
      <Card className="p-6 max-w-xl">
        <div className="mb-6 space-y-1">
          <h2 className="text-lg font-semibold">ثبت درخواست راهنمایی</h2>
          <p className="text-sm text-muted-foreground">
            موضوع، دسته و اطلاعات تماس را وارد کنید.
          </p>
        </div>

        <form className="space-y-5" onSubmit={(e) => void handleSubmit(e)}>
          <div className="space-y-2">
            <Label htmlFor="category">دسته</Label>
            <select
              id="category"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={loadingCategories}
            >
              <option value="">انتخاب کنید…</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {fieldErrors.category_id ? (
              <p className="text-sm text-destructive">{fieldErrors.category_id}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic">موضوع جلسه</Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="مثلاً انتخاب رشته برای کنکور"
            />
            {fieldErrors.topic ? (
              <p className="text-sm text-destructive">{fieldErrors.topic}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_name">نام تماس</Label>
            <Input
              id="contact_name"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
            />
            {fieldErrors.contact_name ? (
              <p className="text-sm text-destructive">{fieldErrors.contact_name}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_email">ایمیل تماس</Label>
            <Input
              id="contact_email"
              type="email"
              dir="ltr"
              className="text-start"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
            />
            {fieldErrors.contact_email ? (
              <p className="text-sm text-destructive">{fieldErrors.contact_email}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_phone">تلفن تماس</Label>
            <Input
              id="contact_phone"
              type="tel"
              dir="ltr"
              className="text-start"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="09121234567"
            />
            {fieldErrors.contact_phone ? (
              <p className="text-sm text-destructive">{fieldErrors.contact_phone}</p>
            ) : null}
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={submitting || loadingCategories}>
              {submitting ? 'در حال ثبت…' : 'ثبت درخواست'}
            </Button>
            <Link
              to="/requests"
              className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent"
            >
              انصراف
            </Link>
          </div>
        </form>
      </Card>
    </div>
  )
}
