import { useState } from 'react'
import useSWR, { mutate } from 'swr'
import { toast } from 'sonner'
import type { BillingCycle, PlanTier, PlanTierConfig } from '@/types/apps/pricing'
import { fetchPlanUsage, PLAN_KEY, upgradePlan } from '@/api/pricing/pricing-api'
import { formatToman } from '@/api/pricing/pricing-data'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Check,
  X,
  Sparkles,
  Zap,
  ShieldCheck,
  Building2,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface PlanUpgradeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpgraded?: () => void
}

export const PLAN_TIERS: PlanTierConfig[] = [
  {
    id: 'starter',
    name: 'طرح پایه',
    nameEn: 'Starter',
    monthlyPrice: 390_000,
    yearlyPrice: 3_900_000,
    productLimit: 50,
    features: [
      '۵۰ محصول در کاتالوگ',
      'رصد روزانه قیمت رقبا (ترب و اسنپ)',
      'اتصال ۱ فروشگاه ووکامرس',
      'محاسبه هوشمند کف هزینه امن',
      'پشتیبانی تیکتی استاندارد',
    ],
    unavailableFeatures: [
      'اعمال خودکار قیمت‌ها در ووکامرس',
      'هشدارهای پیامکی و ایمیلی فوری',
      'رصد ساعتی رقبا',
    ],
  },
  {
    id: 'pro',
    name: 'طرح حرفه‌ای',
    nameEn: 'Pro',
    badge: 'پیشنهادی و محبوب',
    isPopular: true,
    monthlyPrice: 890_000,
    yearlyPrice: 8_900_000,
    productLimit: 500,
    features: [
      '۵۰۰ محصول در کاتالوگ',
      'رصد هوشمند ساعتی قیمت رقبا در ترب و اسنپ',
      'اعمال خودکار و دسته‌ای قیمت‌ها در ووکامرس',
      'هشدارهای پیامکی و ایمیلی فوری (کاهش سود یا تغییر رقیب)',
      'تحلیل پیشرفته تاریخچه قیمت و رقبا',
      'پشتیبانی با اولویت بالا',
    ],
  },
  {
    id: 'business',
    name: 'طرح تجاری',
    nameEn: 'Business',
    badge: 'سازمانی',
    monthlyPrice: 1_890_000,
    yearlyPrice: 18_900_000,
    productLimit: 2500,
    features: [
      '۲,۵۰۰+ محصول در کاتالوگ',
      'رصد اختصاصی و فوری در صف اولویت ترب (Priority)',
      'اتصال نامحدود چند فروشگاه',
      'دسترسی زودهنگام به کلید API اختصاصی',
      'مدیر حساب اختصاصی و پشتیبانی تلفنی',
    ],
  },
]

export function PlanUpgradeDialog({
  open,
  onOpenChange,
  onUpgraded,
}: PlanUpgradeDialogProps) {
  const { data } = useSWR(PLAN_KEY, fetchPlanUsage)
  const currentPlan = data?.data
  const currentTier = currentPlan?.tier ?? 'starter'

  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly')
  const [upgradingTier, setUpgradingTier] = useState<PlanTier | null>(null)

  async function handleSelectPlan(tier: PlanTier) {
    if (tier === currentTier) return

    setUpgradingTier(tier)
    try {
      const res = await upgradePlan(tier, billingCycle)
      await mutate(PLAN_KEY, { data: res.data }, false)
      const targetConfig = PLAN_TIERS.find((p) => p.id === tier)
      toast.success(
        `اشتراک شما با موفقیت به «${targetConfig?.name ?? tier}» ارتقا یافت!`
      )
      onUpgraded?.()
      onOpenChange(false)
    } catch {
      toast.error('خطا در ارتقای پلن. لطفاً مجدداً تلاش نمایید.')
    } finally {
      setUpgradingTier(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-6 rounded-3xl bg-card border border-border shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center sm:text-center space-y-2">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Sparkles className="size-6" />
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            ارتقای پلن و ظرفیت کاتالوگ
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
            محصولات بیشتری را تحت نظر بگیرید، قیمت رقبا را ساعتی رصد کنید و اجازه دهید پیشنهادهای امن به صورت خودکار در فروشگاه اعمال شوند.
          </DialogDescription>
        </DialogHeader>

        {/* Billing Cycle Toggle */}
        <div className="flex items-center justify-center gap-3 my-2">
          <div className="inline-flex items-center rounded-2xl border border-border bg-muted/40 p-1">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={cn(
                'rounded-xl px-4 py-1.5 text-xs font-semibold transition-all',
                billingCycle === 'monthly'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              پرداخت ماهانه
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('yearly')}
              className={cn(
                'flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-semibold transition-all',
                billingCycle === 'yearly'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <span>پرداخت سالانه</span>
              <Badge
                variant="secondary"
                className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-0 text-[10px] px-1.5 py-0 font-bold"
              >
                ۲ ماه رایگان
              </Badge>
            </button>
          </div>
        </div>

        {/* 3 Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {PLAN_TIERS.map((tier) => {
            const isCurrent = currentTier === tier.id
            const isPro = tier.isPopular
            const price =
              billingCycle === 'yearly' ? tier.yearlyPrice : tier.monthlyPrice
            const periodLabel = billingCycle === 'yearly' ? 'سالانه' : 'ماهانه'

            return (
              <div
                key={tier.id}
                className={cn(
                  'relative flex flex-col justify-between rounded-2xl border p-5 transition-all',
                  isPro
                    ? 'border-primary bg-primary/[0.03] shadow-lg ring-1 ring-primary/30 dark:bg-primary/[0.05]'
                    : 'border-border bg-card/60 shadow-xs hover:border-border/80',
                  isCurrent && 'ring-2 ring-emerald-500/50'
                )}
              >
                {/* Popular or Current Badge */}
                {tier.badge && (
                  <div className="absolute -top-3 start-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground text-[10px] font-bold px-3 py-0.5 rounded-full shadow-sm">
                      <Zap className="size-3 me-1" />
                      {tier.badge}
                    </Badge>
                  </div>
                )}
                {isCurrent && !tier.badge && (
                  <div className="absolute -top-3 start-1/2 -translate-x-1/2">
                    <Badge className="bg-emerald-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full shadow-sm">
                      پلن فعلی شما
                    </Badge>
                  </div>
                )}

                <div>
                  {/* Tier Title & Description */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-base text-foreground">
                        {tier.name}
                      </h3>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        {tier.nameEn}
                      </span>
                    </div>
                    <div className="size-9 rounded-xl bg-muted/60 flex items-center justify-center text-muted-foreground">
                      {tier.id === 'starter' ? (
                        <ShieldCheck className="size-4 text-muted-foreground" />
                      ) : tier.id === 'pro' ? (
                        <Sparkles className="size-4 text-primary" />
                      ) : (
                        <Building2 className="size-4 text-foreground" />
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mt-4 pb-4 border-b border-border/70">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-extrabold tabular-nums text-foreground">
                        {formatToman(price)}
                      </span>
                    </div>
                    <span className="text-[11px] text-muted-foreground block mt-0.5">
                      پرداخت {periodLabel}
                      {billingCycle === 'yearly' && (
                        <span className="text-emerald-600 dark:text-emerald-400 ms-1 font-semibold">
                          (معادل ۱۰ ماه)
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Features List */}
                  <ul className="mt-4 space-y-2.5 text-xs text-muted-foreground">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-foreground/90 leading-tight">
                        <Check className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                    {tier.unavailableFeatures?.map((unfeat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-muted-foreground/50 leading-tight">
                        <X className="size-3.5 shrink-0 text-muted-foreground/40 mt-0.5" />
                        <span>{unfeat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action CTA */}
                <div className="mt-6 pt-4 border-t border-border/70">
                  {isCurrent ? (
                    <Button
                      type="button"
                      variant="outline"
                      disabled
                      className="w-full h-9 rounded-xl text-xs font-semibold gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                    >
                      <CheckCircle2 className="size-3.5" />
                      پلن فعال شما
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      disabled={upgradingTier !== null}
                      onClick={() => handleSelectPlan(tier.id)}
                      className={cn(
                        'w-full h-9 rounded-xl text-xs font-semibold transition-all shadow-xs gap-1.5',
                        isPro
                          ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                          : 'bg-muted/80 hover:bg-muted text-foreground'
                      )}
                    >
                      {upgradingTier === tier.id ? (
                        <span>در حال ارتقا...</span>
                      ) : (
                        <>
                          <Sparkles className="size-3.5" />
                          <span>ارتقا به {tier.name}</span>
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
