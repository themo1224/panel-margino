import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { CalendarClock, ChevronLeft } from 'lucide-react'
import {
  fetchMyGuidanceRequests,
  type GuidanceRequestItem,
} from '@/api/guidance'

/**
 * Primary queue — assigned requests waiting for mentor accept + time.
 */
export default function PendingAssignments() {
  const [items, setItems] = useState<GuidanceRequestItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await fetchMyGuidanceRequests()
        if (!cancelled) {
          setItems(
            data.filter((item) => item.status === 'assigned').slice(0, 5)
          )
        }
      } catch {
        if (!cancelled) {
          setItems([])
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
    <section className="flex h-full flex-col gap-2.5">
      <div className="flex items-baseline justify-between gap-3 px-1">
        <div className="min-w-0">
          <h2 className="text-[20px] font-semibold tracking-[-0.015em] text-foreground">
            صف اقدام فوری
          </h2>
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            پذیرش و تعیین زمان جلسه
          </p>
        </div>
        <Link
          to="/assigned-requests"
          className="inline-flex shrink-0 items-center gap-0.5 text-[15px] font-semibold text-primary hover:opacity-80"
        >
          همه
          <ChevronLeft className="size-4" />
        </Link>
      </div>

      {loading ? (
        <div className="flex flex-1 items-center justify-center rounded-2xl bg-card px-5 py-16 text-center ring-1 ring-foreground/10">
          <p className="text-[15px] text-muted-foreground">در حال بارگذاری…</p>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-2xl bg-card px-5 py-16 text-center ring-1 ring-foreground/10">
          <div>
            <p className="text-[17px] font-semibold text-foreground">
              درخواستی در صف نیست
            </p>
            <p className="mt-1 text-[15px] text-muted-foreground">
              وقتی ادمین درخواست جدیدی محول کند، اینجا نمایش داده می‌شود.
            </p>
          </div>
        </div>
      ) : (
        <ul className="overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_3px_rgba(255,255,255,0.04)_inset,0_8px_32px_rgba(0,0,0,0.35)]">
          {items.map((item, index) => (
            <li
              key={item.id}
              className={index > 0 ? 'border-t border-border/70' : undefined}
            >
              <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:gap-5 md:p-5">
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-start gap-2">
                    <p className="min-w-0 flex-1 text-[17px] font-semibold leading-snug tracking-[-0.01em] text-foreground">
                      {item.topic}
                    </p>
                    <span className="shrink-0 rounded-full bg-accent/15 px-2.5 py-1 text-[12px] font-semibold text-accent">
                      در انتظار پذیرش
                    </span>
                  </div>
                  <p className="text-[15px] text-muted-foreground">
                    {item.student?.name ?? item.contact_name}
                    <span className="mx-1.5 text-border">·</span>
                    {item.category?.name ?? '—'}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-muted-foreground">
                    <span
                      dir="ltr"
                      className="font-mono text-[13px] text-foreground/80"
                    >
                      {item.contact_email ?? item.contact_phone ?? '—'}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <CalendarClock className="size-3.5 opacity-70" />
                      محول‌شده
                    </span>
                  </div>
                </div>

                <Link
                  to="/assigned-requests"
                  className="inline-flex h-11 w-full shrink-0 items-center justify-center rounded-xl bg-primary px-5 text-[15px] font-semibold text-primary-foreground transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] active:scale-[0.97] hover:bg-primary/90 md:w-auto md:min-w-[11rem]"
                >
                  پذیرش و تعیین زمان
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
