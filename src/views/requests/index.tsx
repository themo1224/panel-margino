import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { EmptyState } from '@/components/shared/EmptyState'
import { GuidanceStatusChip } from '@/components/guidance/GuidanceStatusChip'
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp'
import StyleDivider from '@/components/shared/StyleDivider'
import {
  fetchMyGuidanceRequests,
  type GuidanceRequestItem,
} from '@/api/guidance'

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

export default function MyGuidanceRequestsPage() {
  const [items, setItems] = useState<GuidanceRequestItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await fetchMyGuidanceRequests()
        if (!cancelled) {
          setItems(data)
        }
      } catch {
        if (!cancelled) {
          setError('بارگذاری درخواست‌ها ناموفق بود.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="flex flex-col p-px bg-border gap-px">
      <BreadcrumbComp title="درخواست‌های من" />
      <StyleDivider />
      <div className="flex flex-col gap-px bg-border">
        <Card className="p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">درخواست‌های راهنمایی</h2>
              <p className="text-sm text-muted-foreground">
                وضعیت درخواست‌های ثبت‌شده شما
              </p>
            </div>
            <Link to="/requests/new">
              <Button type="button">درخواست جدید</Button>
            </Link>
          </div>

          {loading ? (
            <p className="text-sm text-muted-foreground">در حال بارگذاری…</p>
          ) : null}
          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          {!loading && !error && items.length === 0 ? (
            <EmptyState
              title="هنوز درخواستی ندارید"
              description="برای شروع، یک درخواست راهنمایی ثبت کنید."
            >
              <Link to="/requests/new">
                <Button type="button">درخواست جدید</Button>
              </Link>
            </EmptyState>
          ) : null}

          {!loading && items.length > 0 ? (
            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="rounded-xl border border-border/70 bg-background p-4"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2 min-w-0">
                      <h3 className="font-medium">{item.topic}</h3>
                      <p className="text-sm text-muted-foreground">
                        دسته: {item.category?.name ?? '—'}
                      </p>
                      <GuidanceStatusChip status={item.status} showHint />
                      {item.meeting_at ? (
                        <p className="text-sm font-medium">
                          زمان جلسه: {formatMeeting(item.meeting_at)}
                        </p>
                      ) : null}
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
                      {item.status === 'accepted' && item.chat_room_id ? (
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
                    <p className="text-xs text-muted-foreground shrink-0" dir="ltr">
                      {item.contact_email ?? item.contact_phone ?? ''}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
        </Card>
      </div>
    </div>
  )
}
