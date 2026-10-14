import { FormEvent, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp'
import StyleDivider from '../shared/StyleDivider'
import { useAuth } from '@/context/auth-context'

const roleLabels: Record<string, string> = {
  seller: 'فروشنده',
  admin: 'مدیر',
}

function emptyToNull(value: string): string | null {
  const trimmed = value.trim()
  return trimmed === '' ? null : trimmed
}

const UserProfile = () => {
  const { user, isLoading, updateProfile } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!user) return
    setName(user.name ?? '')
    setEmail(user.email ?? '')
    setPhone(user.phone ?? '')
  }, [user])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setFieldErrors({})
    setSuccess(false)

    const trimmedName = name.trim()
    const nextEmail = emptyToNull(email)
    const nextPhone = emptyToNull(phone)

    if (trimmedName.length < 2) {
      setFieldErrors({ name: 'نام باید حداقل ۲ کاراکتر باشد.' })
      return
    }

    if (!nextEmail && !nextPhone) {
      setFieldErrors({ email: 'حداقل یکی از ایمیل یا تلفن لازم است.' })
      return
    }

    setIsSubmitting(true)
    try {
      await updateProfile({
        name: trimmedName,
        email: nextEmail,
        phone: nextPhone,
      })
      setSuccess(true)
    } catch (err) {
      const apiError = err as Error & {
        status?: number
        body?: { errors?: Record<string, string[]> }
      }
      const errors = apiError.body?.errors
      if (apiError.status === 422 && errors) {
        const mapped: Record<string, string> = {}
        if (errors.name?.[0]) mapped.name = 'نام معتبر نیست.'
        if (errors.email?.[0]) {
          mapped.email =
            errors.email[0].includes('required') ||
            errors.email[0].includes('At least')
              ? 'حداقل یکی از ایمیل یا تلفن لازم است.'
              : 'این ایمیل قبلاً ثبت شده یا معتبر نیست.'
        }
        if (errors.phone?.[0]) {
          mapped.phone = 'این شماره تلفن قبلاً ثبت شده یا معتبر نیست.'
        }
        setFieldErrors(mapped)
        setError('لطفاً خطاهای فرم را بررسی کنید.')
      } else {
        setError('ذخیره پروفایل ناموفق بود. دوباره تلاش کنید.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading || !user) {
    return (
      <div className="flex flex-col p-px bg-border gap-px">
        <BreadcrumbComp title="پروفایل" />
        <StyleDivider />
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">در حال بارگذاری…</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col p-px bg-border gap-px">
      <BreadcrumbComp title="پروفایل" />
      <StyleDivider />
      <Card className="p-6 max-w-xl">
        <div className="mb-6 space-y-1">
          <h2 className="text-lg font-semibold">اطلاعات حساب</h2>
          <p className="text-sm text-muted-foreground">
            نام، ایمیل و تلفن خود را به‌روز کنید.
          </p>
          <p className="text-sm">
            <span className="text-muted-foreground">نقش: </span>
            <span className="font-medium">
              {roleLabels[user.role] ?? user.role}
            </span>
          </p>
        </div>

        <form className="space-y-5" onSubmit={(e) => void handleSubmit(e)}>
          <div className="space-y-2">
            <Label htmlFor="profile-name">نام</Label>
            <Input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="نام و نام خانوادگی"
              autoComplete="name"
            />
            {fieldErrors.name ? (
              <p className="text-sm text-destructive">{fieldErrors.name}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-email">ایمیل</Label>
            <Input
              id="profile-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seller@pricing.local"
              dir="ltr"
              className="text-start"
              autoComplete="email"
            />
            {fieldErrors.email ? (
              <p className="text-sm text-destructive">{fieldErrors.email}</p>
            ) : (
              <p className="text-xs text-muted-foreground">
                اختیاری است اگر شماره تلفن داشته باشید.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-phone">تلفن</Label>
            <Input
              id="profile-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="09121234567"
              dir="ltr"
              className="text-start"
              autoComplete="tel"
            />
            {fieldErrors.phone ? (
              <p className="text-sm text-destructive">{fieldErrors.phone}</p>
            ) : (
              <p className="text-xs text-muted-foreground">
                اختیاری است اگر ایمیل داشته باشید. فرمت: 09XXXXXXXXX
              </p>
            )}
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          {success ? (
            <p className="text-sm text-green-700 dark:text-green-400">
              پروفایل ذخیره شد.
            </p>
          ) : null}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'در حال ذخیره…' : 'ذخیره پروفایل'}
          </Button>
        </form>
      </Card>
    </div>
  )
}

export default UserProfile
