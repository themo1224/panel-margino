import { FormEvent, useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { EmptyState } from '@/components/shared/EmptyState'
import { GuidanceStatusChip } from '@/components/guidance/GuidanceStatusChip'
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp'
import StyleDivider from '@/components/shared/StyleDivider'
import {
  acceptGuidanceRequest,
  fetchMyGuidanceRequests,
  type GuidanceRequestItem,
} from '@/api/guidance'

function toLocalInputValue(iso?: string | null): string {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function formatMeeting(iso?: string | null): string {
  if (!iso) return '—'
  try {
    return new Intl.DateTimeFormat('fa-IR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

export default function AssignedRequestsPage() {
  const [items, setItems] = useState<GuidanceRequestItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [meetingById, setMeetingById] = useState<Record<number, string>>({})
  const [acceptingId, setAcceptingId] = useState<number | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchMyGuidanceRequests()
      setItems(data)
      const defaults: Record<number, string> = {}
      for (const item of data) {
        if (item.status === 'assigned') {
          const tomorrow = new Date()
          tomorrow.setDate(tomorrow.getDate() + 1)
          tomorrow.setMinutes(0, 0, 0)
          defaults[item.id] = toLocalInputValue(tomorrow.toISOString())
        }
      }
      setMeetingById((prev) => ({ ...defaults, ...prev }))
    } catch {
      setError('بارگذاری درخواست‌ها ناموفق بود.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  async function handleAccept(event: FormEvent, requestId: number) {
    event.preventDefault()
    const localValue = meetingById[requestId]
    if (!localValue) {
      setError('زمان جلسه را انتخاب کنید.')
      return
    }

    const meetingAt = new Date(localValue).toISOString()
    setAcceptingId(requestId)
    setError(null)
    try {
      const updated = await acceptGuidanceRequest(requestId, meetingAt)
      setItems((prev) =>
        prev.map((item) => (item.id === requestId ? updated : item))
      )
    } catch (err) {
      const apiError = err as Error & {
        status?: number
        body?: { errors?: Record<string, string[]> }
      }
      if (apiError.status === 422) {
        setError(
          apiError.body?.errors?.meeting_at?.[0] ??
            'زمان جلسه معتبر نیست.'
        )
      } else {
        setError('پذیرش درخواست ناموفق بود.')
      }
    } finally {
      setAcceptingId(null)
    }
  }

  const pending = items.filter((item) => item.status === 'assigned')
  const accepted = items.filter((item) => item.status === 'accepted')

  return (
    <div className="flex flex-col p-px bg-border gap-px">
      <BreadcrumbComp title="درخواست‌های محول‌شده" />
      <StyleDivider />
      <Card className="p-6">
        <div className="mb-6 space-y-1">
          <h2 className="text-lg font-semibold">پذیرش و تعیین زمان</h2>
          <p className="text-sm text-muted-foreground">
            درخواست‌های محول‌شده را بپذیرید و زمان جلسه را ثبت کنید.
          </p>
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground">در حال بارگذاری…</p>
        ) : null}
        {error ? <p className="mb-4 text-sm text-destructive">{error}</p> : null}

        {!loading && pending.length === 0 && accepted.length === 0 ? (
          <EmptyState
            title="هنوز درخواستی محول نشده"
            description="پس از تخصیص ادمین، اینجا نمایش داده می‌شود."
          />
        ) : null}

        {pending.length > 0 ? (
          <div className="mb-8 space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground">
              در انتظار پذیرش
            </h3>
            <ul className="space-y-3">
              {pending.map((item) => (
                <li
                  key={item.id}
                  className="rounded-xl border border-border/70 bg-background p-4"
                >
                  <div className="mb-4 space-y-2">
                    <h4 className="font-medium">{item.topic}</h4>
                    <p className="text-sm text-muted-foreground">
                      دانشجو: {item.student?.name ?? item.contact_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      دسته: {item.category?.name ?? '—'}
                    </p>
                    <GuidanceStatusChip status={item.status} showHint />
                  </div>
                  <form
                    className="flex flex-col gap-3 sm:flex-row sm:items-end"
                    onSubmit={(e) => void handleAccept(e, item.id)}
                  >
                    <div className="space-y-2 flex-1">
                      <Label htmlFor={`meeting-${item.id}`}>زمان جلسه</Label>
                      <Input
                        id={`meeting-${item.id}`}
                        type="datetime-local"
                        dir="ltr"
                        className="text-start"
                        value={meetingById[item.id] ?? ''}
                        onChange={(e) =>
                          setMeetingById((prev) => ({
                            ...prev,
                            [item.id]: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={acceptingId === item.id}
                    >
                      {acceptingId === item.id
                        ? 'در حال ثبت…'
                        : 'پذیرش و تعیین زمان'}
                    </Button>
                  </form>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {accepted.length > 0 ? (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground">
              پذیرفته‌شده
            </h3>
            <ul className="space-y-3">
              {accepted.map((item) => (
                <li
                  key={item.id}
                  className="rounded-xl border border-border/70 bg-background p-4"
                >
                  <div className="space-y-2">
                    <h4 className="font-medium">{item.topic}</h4>
                    <p className="text-sm text-muted-foreground">
                      دانشجو: {item.student?.name ?? item.contact_name}
                    </p>
                    <GuidanceStatusChip status={item.status} showHint />
                    <p className="text-sm font-medium">
                      زمان جلسه: {formatMeeting(item.meeting_at)}
                    </p>
                    {item.meeting_url ? (
                      <p>
                        <a
                          href={item.meeting_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                          dir="ltr"
                        >
                          ورود به جلسه
                        </a>
                      </p>
                    ) : null}
                    {item.chat_room_id ? (
                      <p>
                        <Link
                          to={`/chat/${item.chat_room_id}`}
                          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                        >
                          گفتگو
                        </Link>
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Card>
    </div>
  )
}
