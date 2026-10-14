import type { ReactNode } from 'react'
import { Link } from 'react-router'
import useSWR from 'swr'
import { formatToman } from '@/api/pricing/pricing-data'
import {
  fetchOverview,
  OVERVIEW_KEY,
} from '@/api/pricing/pricing-api'
import type { OverviewData } from '@/types/apps/pricing'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { OnboardingGuide } from '@/components/pricing/OnboardingGuide'
import {
  ArrowLeft,
  CircleAlert,
  PackageSearch,
  ShieldCheck,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const insightTone: Record<
  OverviewData['insights'][number]['kind'],
  string
> = {
  above_rivals: 'border-s-accent bg-[var(--accent-soft)]/35',
  below_cost: 'border-s-destructive bg-destructive/5',
  stale: 'border-s-warning bg-warning/10',
  ok: 'border-s-primary bg-[var(--primary-soft)]',
}

function MetricCell({
  icon,
  iconClassName,
  label,
  value,
  hint,
  badge,
}: {
  icon: ReactNode
  iconClassName: string
  label: string
  value: ReactNode
  hint?: string
  badge?: ReactNode
}) {
  return (
    <div className="flex items-start gap-3 px-4 py-4 sm:px-5">
      <div
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-xl border border-border',
          iconClassName
        )}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className="text-xl font-semibold tracking-tight text-foreground tabular-nums sm:text-2xl">
          {value}
        </div>
        {hint ? (
          <p className="text-xs leading-5 text-muted-foreground">{hint}</p>
        ) : null}
        {badge}
      </div>
    </div>
  )
}


export default function HomePage() {
  const { data, isLoading, error } = useSWR(OVERVIEW_KEY, fetchOverview)
  const overview = data?.data

  if (isLoading) {
    return (
      <div className="flex flex-col gap-0 overflow-hidden rounded-xl border border-border bg-card">
        <Skeleton className="h-20 w-full rounded-none border-b border-border" />
        <Skeleton className="h-28 w-full rounded-none border-b border-border" />
        <div className="grid sm:grid-cols-3">
          <Skeleton className="h-28 rounded-none border-b border-border sm:border-b-0 sm:border-e" />
          <Skeleton className="h-28 rounded-none border-b border-border sm:border-b-0 sm:border-e" />
          <Skeleton className="h-28 rounded-none" />
        </div>
      </div>
    )
  }

  if (error || !overview) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
        بارگذاری خانه ناموفق بود. صفحه را تازه کنید.
      </div>
    )
  }

  const hasKey = overview.hasActiveApiKey === true

  return (
    <div className="flex flex-col gap-5 pb-8">
      <header className="flex flex-col gap-4 border-b border-border pb-5 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1.5">
          <p className="text-sm text-muted-foreground">{overview.shopName}</p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            خانه
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            هزینه، پیشنهاد قیمت امن، و تحلیل رقبا — نه فقط یک عدد.
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-primary bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          محصولات و رقبا
          <ArrowLeft className="size-4" aria-hidden />
        </Link>
      </header>

      <OnboardingGuide
        hasApiKey={hasKey}
        costProfileComplete={overview.costProfileComplete}
        productsTotal={overview.productsTotal}
        productsWithRivals={overview.productsWithRivals}
        findingCount={overview.findingCount}
      />

      <section
        aria-labelledby="rival-insight-heading"
        className="overflow-hidden rounded-xl border border-border bg-card"
      >
        <div className="flex flex-wrap items-center gap-2 border-b border-border bg-[var(--primary-soft)]/60 px-4 py-3 sm:px-5">
          <PackageSearch className="size-5 text-primary" aria-hidden />
          <h2
            id="rival-insight-heading"
            className="text-base font-semibold text-foreground"
          >
            بینش رقبا
          </h2>
          <Badge className="border border-accent/40 bg-accent text-accent-foreground">
            ویژگی کلیدی
          </Badge>
        </div>
        <div className="space-y-3 px-4 py-4 sm:px-5 sm:py-5">
          <p className="text-base font-medium leading-7 text-foreground">
            {overview.rivalHeadline}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-border pt-3 text-sm text-muted-foreground">
            <span>
              {overview.productsWithRivals.toLocaleString('fa-IR')} از{' '}
              {overview.productsTotal.toLocaleString('fa-IR')} محصول با تحلیل
              رقیب
            </span>
            <span className="hidden text-border sm:inline" aria-hidden>
              |
            </span>
            <span>
              {overview.staleCount.toLocaleString('fa-IR')} مورد منقضی
            </span>
            {(overview.findingCount ?? 0) > 0 ? (
              <>
                <span className="hidden text-border sm:inline" aria-hidden>
                  |
                </span>
                <span>
                  {(overview.findingCount ?? 0).toLocaleString('fa-IR')} در حال
                  پیدا کردن
                </span>
              </>
            ) : null}
          </div>
        </div>
      </section>

      <section
        aria-label="شاخص‌های فروشگاه"
        className="overflow-hidden rounded-xl border border-border bg-card"
      >
        <div className="border-b border-border px-4 py-2.5 sm:px-5">
          <p className="text-xs font-medium tracking-wide text-muted-foreground">
            وضعیت فروشگاه
          </p>
        </div>
        <div className="grid sm:grid-cols-3">
          <div className="border-b border-border sm:border-b-0 sm:border-e sm:border-border">
            <MetricCell
              icon={<Wallet className="size-5" aria-hidden />}
              iconClassName="bg-[var(--primary-soft)] text-primary"
              label="وضعیت هزینه"
              value={overview.costProfileLabel}
              badge={
                <Badge
                  variant="outline"
                  className={cn(
                    'mt-1.5 border',
                    overview.costProfileComplete
                      ? 'border-primary/30 bg-[var(--primary-soft)] text-primary'
                      : 'border-border text-muted-foreground'
                  )}
                >
                  {overview.costProfileComplete ? 'کامل' : 'ناقص'}
                </Badge>
              }
            />
          </div>
          <div className="border-b border-border sm:border-b-0 sm:border-e sm:border-border">
            <MetricCell
              icon={<ShieldCheck className="size-5" aria-hidden />}
              iconClassName="bg-[var(--accent-soft)]/50 text-accent-foreground"
              label="پیشنهاد امن"
              value={overview.recommendCount.toLocaleString('fa-IR')}
              hint="محصول با پیشنهاد فعال"
            />
          </div>
          <div>
            <MetricCell
              icon={<TrendingUp className="size-5" aria-hidden />}
              iconClassName="border-destructive/20 bg-destructive/10 text-destructive"
              label="بالاتر از رقبا"
              value={overview.aboveRivalsCount.toLocaleString('fa-IR')}
              hint="نیاز به بازبینی قیمت فروشگاه"
            />
          </div>
        </div>
      </section>

      <section
        aria-labelledby="insights-heading"
        className="overflow-hidden rounded-xl border border-border bg-card"
      >
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
          <h2
            id="insights-heading"
            className="text-base font-semibold text-foreground"
          >
            آخرین تحلیل‌های رقیب
          </h2>
          <Link
            to="/products"
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            همه محصولات
          </Link>
        </div>
        {overview.insights.length === 0 ? (
          <p className="px-4 py-4 text-sm text-muted-foreground sm:px-5">
            هنوز تحلیلی نیست. بعد از همگام‌سازی و پیدا شدن رقبا اینجا می‌آید.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {overview.insights.map((item) => (
              <li key={item.id}>
                <div
                  className={cn(
                    'flex items-start gap-3 border-s-4 px-4 py-3.5 sm:px-5',
                    insightTone[item.kind]
                  )}
                >
                  <CircleAlert
                    className="mt-0.5 size-4 shrink-0 text-foreground/65"
                    aria-hidden
                  />
                  <div className="min-w-0 space-y-0.5">
                    <p className="text-sm font-medium text-foreground">
                      {item.productName}
                    </p>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {item.message}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        {overview.productsWithRivals > 0 ? (
          <div className="border-t border-border bg-muted/40 px-4 py-2.5 sm:px-5">
            <p className="text-xs leading-5 text-muted-foreground">
              نمونه: ارزان‌ترین رقیب برای محصولات همگام‌شده در جدول محصولات قابل
              دیدن است (مثلاً {formatToman(4_320_000)}).
            </p>
          </div>
        ) : null}
      </section>
    </div>
  )
}
