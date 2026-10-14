import { formatToman } from '@/api/pricing/pricing-data'
import type { RivalSource, RivalStatus } from '@/types/apps/pricing'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const sourceLabel: Record<RivalSource, string> = {
  torob: 'ترب',
  snapp: 'اسنپ',
}

function deltaLabel(pct: number | null): string {
  if (pct === null) return 'مقایسه در دسترس نیست'
  if (pct > 0.5) return `${pct.toLocaleString('fa-IR')}٪ گران‌تر`
  if (pct < -0.5) return `${Math.abs(pct).toLocaleString('fa-IR')}٪ ارزان‌تر`
  return 'هم‌تراز رقیب'
}

function markerLeft(value: number, min: number, max: number): number {
  if (max <= min) return 50
  const pct = ((value - min) / (max - min)) * 100
  return Math.min(94, Math.max(6, pct))
}

export interface RivalCompareProps {
  storePrice: number
  rivalCheapest: number | null
  vsStorePct: number | null
  source: RivalSource | null
  rivalCount: number
  status: RivalStatus
  className?: string
}

/**
 * Compact store vs cheapest-rival comparison bar.
 * Top row: source badge + rival count + delta label
 * Middle: segmented track — rival portion (amber) + store portion (primary)
 * Bottom: two price labels under their respective dots
 */
export function RivalCompare({
  storePrice,
  rivalCheapest,
  vsStorePct,
  source,
  rivalCount,
  status,
  className,
}: RivalCompareProps) {
  if (status === 'finding' || rivalCheapest == null) {
    return null
  }

  const min = Math.min(storePrice, rivalCheapest)
  const max = Math.max(storePrice, rivalCheapest)
  const storeLeft = markerLeft(storePrice, min, max)
  const rivalLeft = markerLeft(rivalCheapest, min, max)
  const delta = deltaLabel(vsStorePct)

  // Colour semantics: store > rival = warn (amber), store < rival = good (primary/green)
  const storeIsAbove = vsStorePct != null && vsStorePct > 0.5
  const storeIsBelow = vsStorePct != null && vsStorePct < -0.5

  const deltaColor = storeIsAbove
    ? 'text-amber-600 dark:text-amber-400'
    : storeIsBelow
      ? 'text-emerald-600 dark:text-emerald-400'
      : 'text-muted-foreground'

  // Fill segment between the two dots
  const fillStart = Math.min(storeLeft, rivalLeft)
  const fillWidth = Math.abs(storeLeft - rivalLeft)

  const aria = [
    `قیمت فروشگاه ${formatToman(storePrice)}`,
    `ارزان‌ترین رقیب ${formatToman(rivalCheapest)}`,
    delta,
    source ? `منبع ${sourceLabel[source]}` : null,
    rivalCount > 0 ? `${rivalCount} رقیب` : null,
  ]
    .filter(Boolean)
    .join('، ')

  return (
    <div className={cn('select-none space-y-1.5', className)} role="img" aria-label={aria}>

      {/* Top row: badges + gap label */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {source ? (
            <Badge
              variant="outline"
              className="h-5 border-border bg-muted/60 px-1.5 text-[10px] font-medium text-foreground"
            >
              {sourceLabel[source]}
            </Badge>
          ) : null}
          {rivalCount > 0 ? (
            <span className="text-[10px] text-muted-foreground tabular-nums">
              {rivalCount.toLocaleString('fa-IR')} رقیب
            </span>
          ) : null}
          {status === 'stale' ? (
            <Badge
              variant="outline"
              className="h-5 border-amber-500/40 bg-amber-500/8 px-1.5 text-[10px] font-medium text-amber-600 dark:text-amber-400"
            >
              منقضی
            </Badge>
          ) : null}
        </div>
        <span className={cn('text-[11px] font-semibold tabular-nums', deltaColor)}>
          {delta}
        </span>
      </div>

      {/* Track */}
      <div className="relative h-4">
        {/* Background rail */}
        <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-border/70" />

        {/* Colored fill between the two dots */}
        <div
          className={cn(
            'absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full',
            storeIsAbove ? 'bg-amber-400/60' : 'bg-emerald-400/60'
          )}
          style={{ left: `${fillStart}%`, width: `${fillWidth}%` }}
          aria-hidden
        />

        {/* Rival dot — amber */}
        <div
          className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-amber-500 bg-amber-100 dark:bg-amber-900 shadow-sm"
          style={{ left: `${rivalLeft}%` }}
          title="ارزان‌ترین رقیب"
          aria-hidden
        />

        {/* Store dot — primary green */}
        <div
          className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-card shadow-sm"
          style={{ left: `${storeLeft}%` }}
          title="قیمت فروشگاه"
          aria-hidden
        />
      </div>

      {/* Bottom labels aligned under dots */}
      <div className="relative h-4">
        {/* Rival price — pinned to rival dot */}
        <span
          className="absolute -translate-x-1/2 text-[10px] text-muted-foreground tabular-nums whitespace-nowrap"
          style={{ left: `${rivalLeft}%` }}
        >
          {formatToman(rivalCheapest)}
        </span>
        {/* Store price — pinned to store dot */}
        <span
          className="absolute -translate-x-1/2 text-[10px] font-medium text-foreground tabular-nums whitespace-nowrap"
          style={{ left: `${storeLeft}%` }}
        >
          {formatToman(storePrice)}
        </span>
      </div>

    </div>
  )
}
