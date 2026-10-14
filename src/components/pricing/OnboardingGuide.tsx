import { useState } from 'react'
import { Link } from 'react-router'
import {
  ArrowLeft,
  Calculator,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  KeyRound,
  PackageSearch,
  RefreshCw,
  Sparkles,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

export interface OnboardingGuideProps {
  hasApiKey: boolean
  costProfileComplete: boolean
  productsTotal: number
  productsWithRivals: number
  findingCount?: number
  className?: string
}

export function OnboardingGuide({
  hasApiKey,
  costProfileComplete,
  productsTotal,
  productsWithRivals,
  findingCount = 0,
  className,
}: OnboardingGuideProps) {
  const [collapsed, setCollapsed] = useState(false)

  const hasProducts = productsTotal > 0
  const hasRivals = productsWithRivals > 0 || findingCount > 0

  const steps = [
    {
      id: 1,
      title: 'ساخت کلید API و اتصال افزونه ووکامرس',
      description:
        'کلید اتصال را از تب کلیدهای API بسازید و در تنظیمات افزونه Pricing ووکامرس قرار دهید.',
      done: hasApiKey,
      to: '/api-keys',
      cta: 'دریافت کلید API',
      icon: KeyRound,
    },
    {
      id: 2,
      title: 'تنظیم فرمول هزینه و حاشیه سود امن',
      description:
        'درصد خرید تأمین‌کننده، نوسان دلار، و حاشیه سود هدف را مشخص کنید تا کف هزینه امن محاسبه شود.',
      done: costProfileComplete,
      to: '/costs',
      cta: 'تنظیم پروفایل هزینه',
      icon: Calculator,
    },
    {
      id: 3,
      title: 'همگام‌سازی کاتالوگ محصولات فروشگاه',
      description: hasProducts
        ? `تعداد ${productsTotal.toLocaleString('fa-IR')} محصول با موفقیت از فروشگاه شما همگام شد.`
        : 'در پیشخوان وردپرس روی دکمه همگام‌سازی کلیک کنید تا محصولات وارد پنل شوند.',
      done: hasProducts,
      to: '/products',
      cta: 'مشاهده محصولات',
      icon: RefreshCw,
    },
    {
      id: 4,
      title: 'مشاهده تحلیل رقبا و اعمال اولین قیمت امن',
      description: hasRivals
        ? 'تحلیل رقبا در ترب انجام شد! اولین پیشنهاد قیمت را روی محصولات بررسی و اعمال کنید.'
        : 'سیستم پس از همگام‌سازی، به صورت خودکار رقبای محصولات شما را در ترب پیدا می‌کند.',
      done: hasRivals,
      to: '/products',
      cta: 'بررسی رقبا و پیشنهادها',
      icon: PackageSearch,
    },
  ]

  const completedSteps = steps.filter((s) => s.done).length
  const progressPercent = Math.round((completedSteps / steps.length) * 100)
  const isAllComplete = completedSteps === steps.length

  return (
    <section
      aria-labelledby="onboarding-guide-heading"
      className={cn(
        'overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm transition-all',
        className
      )}
    >
      {/* Header Banner */}
      <div className="flex flex-col gap-4 border-b border-border/80 bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {isAllComplete ? (
              <Sparkles className="size-5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <KeyRound className="size-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2
                id="onboarding-guide-heading"
                className="text-base font-semibold text-foreground"
              >
                راهنمای شروع سریع و راه‌اندازی
              </h2>
              {isAllComplete ? (
                <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 text-[11px] dark:text-emerald-400">
                  تکمیل شد
                </Badge>
              ) : (
                <Badge variant="outline" className="text-[11px]">
                  {completedSteps.toLocaleString('fa-IR')} از ۴ مرحله
                </Badge>
              )}
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {isAllComplete
                ? 'فروشگاه شما به طور کامل آماده رصد رقبا و قیمت‌گذاری هوشمند است.'
                : 'برای فعال‌سازی کامل نظارت بر رقبا و پیشنهاد قیمت هوشمند، مراحل زیر را طی کنید.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-36 space-y-1 sm:w-44">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
              <span>پیشرفت راه‌اندازی</span>
              <span className="tabular-nums font-bold text-foreground">
                {progressPercent.toLocaleString('fa-IR')}٪
              </span>
            </div>
            <Progress value={progressPercent} className="h-1.5" />
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed((c) => !c)}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            aria-label={collapsed ? 'نمایش مراحل' : 'بستن مراحل'}
          >
            {collapsed ? (
              <ChevronDown className="size-4" />
            ) : (
              <ChevronUp className="size-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Steps List */}
      {!collapsed ? (
        <div className="divide-y divide-border/60">
          {steps.map((step) => {
            return (
              <div
                key={step.id}
                className={cn(
                  'flex flex-col gap-3 p-4 transition-colors sm:flex-row sm:items-center sm:justify-between sm:px-5',
                  step.done
                    ? 'bg-muted/10'
                    : 'bg-card hover:bg-muted/20'
                )}
              >
                <div className="flex items-start gap-3.5">
                  <div className="mt-0.5 shrink-0">
                    {step.done ? (
                      <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Circle className="size-5 text-muted-foreground/50" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="flex size-5 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-muted-foreground tabular-nums">
                        {step.id.toLocaleString('fa-IR')}
                      </span>
                      <h3
                        className={cn(
                          'text-sm font-semibold',
                          step.done ? 'text-muted-foreground line-through decoration-muted-foreground/40' : 'text-foreground'
                        )}
                      >
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-xs leading-5 text-muted-foreground max-w-2xl">
                      {step.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end shrink-0 pt-1 sm:pt-0">
                  {step.done ? (
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      انجام شد
                    </span>
                  ) : (
                    <Link
                      to={step.to}
                      className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground shadow-xs transition-opacity hover:opacity-90"
                    >
                      <span>{step.cta}</span>
                      <ArrowLeft className="size-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : null}
    </section>
  )
}
