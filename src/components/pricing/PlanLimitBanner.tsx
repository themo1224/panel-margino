import type { PlanUsage } from '@/types/apps/pricing'
import { Button } from '@/components/ui/button'
import { AlertTriangle, AlertOctagon, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PlanLimitBannerProps {
  plan?: PlanUsage | null
  onUpgradeClick: () => void
  className?: string
}

export function PlanLimitBanner({
  plan,
  onUpgradeClick,
  className,
}: PlanLimitBannerProps) {
  if (!plan) return null

  const pct = Math.round((plan.productsUsed / plan.productsLimit) * 100)
  if (pct < 80) return null

  const isFull = pct >= 100

  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl border transition-all',
        isFull
          ? 'border-rose-500/40 bg-rose-500/10 text-rose-950 dark:text-rose-200'
          : 'border-amber-500/40 bg-amber-500/10 text-amber-950 dark:text-amber-200',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'flex size-9 items-center justify-center rounded-xl shrink-0 mt-0.5',
            isFull
              ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
              : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
          )}
        >
          {isFull ? (
            <AlertOctagon className="size-5" />
          ) : (
            <AlertTriangle className="size-5" />
          )}
        </div>

        <div className="space-y-0.5">
          <h4 className="text-xs font-bold leading-tight">
            {isFull
              ? 'سقف ظرفیت کاتالوگ تکمیل شده است'
              : 'نزدیک به سقف ظرفیت کاتالوگ'}
          </h4>
          <p className="text-xs opacity-90 leading-relaxed">
            {isFull ? (
              <span>
                شما به حداکثر سقف{' '}
                <strong className="font-bold tabular-nums">
                  {plan.productsLimit.toLocaleString('fa-IR')}
                </strong>{' '}
                محصول در {plan.tierLabel} رسیده‌اید. برای تحلیل و رصد رقبا روی محصولات جدید، پلن خود را ارتقا دهید.
              </span>
            ) : (
              <span>
                شما از{' '}
                <strong className="font-bold tabular-nums">
                  {plan.productsUsed.toLocaleString('fa-IR')}
                </strong>{' '}
                از سقف{' '}
                <strong className="font-bold tabular-nums">
                  {plan.productsLimit.toLocaleString('fa-IR')}
                </strong>{' '}
                محصول ({pct.toLocaleString('fa-IR')}٪) در {plan.tierLabel} استفاده کرده‌اید.
              </span>
            )}
          </p>
        </div>
      </div>

      <Button
        type="button"
        size="sm"
        onClick={onUpgradeClick}
        className={cn(
          'h-8 px-3 rounded-xl text-xs font-semibold shrink-0 gap-1.5 shadow-xs w-full sm:w-auto',
          isFull
            ? 'bg-rose-600 hover:bg-rose-700 text-white'
            : 'bg-amber-600 hover:bg-amber-700 text-white'
        )}
      >
        <Sparkles className="size-3.5" />
        <span>{isFull ? 'ارتقای فوری پلن' : 'ارتقای پلن'}</span>
      </Button>
    </div>
  )
}
