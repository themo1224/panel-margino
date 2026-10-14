import { useState } from 'react'
import useSWR from 'swr'
import { Camera, Rocket, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { fetchPlanUsage, PLAN_KEY } from '@/api/pricing/pricing-api'
import { PlanUpgradeDialog } from '@/components/pricing/PlanUpgradeDialog'
import { cn } from '@/lib/utils'

/** Seller plan + coming-soon chips (Instagram / public API per STRATEGY). */
export function NavSecondary() {
  const { data } = useSWR(PLAN_KEY, fetchPlanUsage)
  const plan = data?.data
  const [upgradeOpen, setUpgradeOpen] = useState(false)

  const used = plan?.productsUsed ?? 48
  const limit = plan?.productsLimit ?? 50
  const pct = Math.min(Math.round((used / limit) * 100), 100)
  const isFull = pct >= 100
  const isWarning = pct >= 80 && !isFull

  return (
    <>
      <div className="-mx-4 border-t border-b border-sidebar-border px-5 py-5">
        <div className="flex flex-col gap-3.5">
          {/* Plan Header & Quota Fraction */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Rocket className="size-4 shrink-0 text-primary" />
                <span className="font-semibold text-xs text-sidebar-foreground">
                  {plan?.tierLabel ?? 'طرح پایه'}
                </span>
              </div>
              <span className="text-xs font-bold tabular-nums text-sidebar-foreground">
                {used.toLocaleString('fa-IR')} / {limit.toLocaleString('fa-IR')}
              </span>
            </div>

            {/* Quota Progress Bar */}
            <div className="w-full h-1.5 rounded-full bg-sidebar-foreground/10 overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-300',
                  isFull
                    ? 'bg-rose-500'
                    : isWarning
                    ? 'bg-amber-500'
                    : 'bg-primary'
                )}
                style={{ width: `${pct}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-sidebar-foreground/70">
              <span>{pct.toLocaleString('fa-IR')}٪ از ظرفیت استفاده شده</span>
              {isFull ? (
                <span className="text-rose-600 dark:text-rose-400 font-semibold">تکمیل سقف!</span>
              ) : isWarning ? (
                <span className="text-amber-600 dark:text-amber-400 font-semibold">نزدیک به سقف</span>
              ) : null}
            </div>
          </div>

          {/* Upgrade Plan Action Button */}
          <Button
            type="button"
            size="sm"
            onClick={() => setUpgradeOpen(true)}
            className="w-full h-8 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold gap-1.5 border border-primary/20 shadow-none"
          >
            <Sparkles className="size-3.5" />
            <span>ارتقای پلن و ظرفیت</span>
          </Button>

          {/* Coming Soon Badges */}
          <div className="flex flex-wrap gap-1.5 justify-center pt-1 border-t border-sidebar-border/60">
            <Badge
              variant="secondary"
              className="gap-1 bg-[var(--accent-soft)] text-accent-foreground border-0 text-[10px] py-0 px-2"
            >
              <Camera className="size-3" />
              اینستاگرام — به‌زودی
            </Badge>
            <Badge
              variant="outline"
              className="border-sidebar-border text-sidebar-foreground/70 text-[10px] py-0 px-2"
            >
              API عمومی — به‌زودی
            </Badge>
          </div>
        </div>
      </div>

      {/* Upgrade Dialog */}
      <PlanUpgradeDialog open={upgradeOpen} onOpenChange={setUpgradeOpen} />
    </>
  )
}

