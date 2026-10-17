import { useEffect, useState } from 'react'
import useSWR from 'swr'
import {
  ALERTS_KEY,
  AUTO_APPLY_KEY,
  fetchAlertPrefs,
  fetchAutoApplySettings,
  runAutoApplyNow,
  saveAlertPrefs,
  saveAutoApplySettings,
} from '@/api/pricing/pricing-api'
import type { AlertPrefs, AutoApplySettings } from '@/types/apps/pricing'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { PlanUpgradeDialog } from '@/components/pricing/PlanUpgradeDialog'
import {
  CheckCircle2,
  Lock,
  Play,
  RotateCw,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react'

export default function AlertsPage() {
  const { data, isLoading, error, mutate } = useSWR(ALERTS_KEY, fetchAlertPrefs)
  const {
    data: autoApplyData,
    isLoading: isAutoApplyLoading,
    error: autoApplyError,
    mutate: mutateAutoApply,
  } = useSWR(AUTO_APPLY_KEY, fetchAutoApplySettings)

  const [prefs, setPrefs] = useState<AlertPrefs | null>(null)
  const [autoSettings, setAutoSettings] = useState<AutoApplySettings | null>(null)

  const [savingAlerts, setSavingAlerts] = useState(false)
  const [savedAlerts, setSavedAlerts] = useState(false)
  const [saveAlertsError, setSaveAlertsError] = useState(false)

  const [savingAuto, setSavingAuto] = useState(false)
  const [savedAuto, setSavedAuto] = useState(false)
  const [saveAutoError, setSaveAutoError] = useState<string | null>(null)

  const [runningNow, setRunningNow] = useState(false)
  const [runResult, setRunResult] = useState<string | null>(null)
  const [upgradeOpen, setUpgradeOpen] = useState(false)

  useEffect(() => {
    if (data?.data) setPrefs(data.data)
  }, [data])

  useEffect(() => {
    if (autoApplyData?.data) setAutoSettings(autoApplyData.data)
  }, [autoApplyData])

  async function handleSaveAlerts() {
    if (!prefs) return
    setSavingAlerts(true)
    setSavedAlerts(false)
    setSaveAlertsError(false)
    try {
      const res = await saveAlertPrefs(prefs)
      await mutate(res, { revalidate: false })
      setSavedAlerts(true)
    } catch {
      setSaveAlertsError(true)
    } finally {
      setSavingAlerts(false)
    }
  }

  async function handleSaveAutoApply() {
    if (!autoSettings) return
    setSavingAuto(true)
    setSavedAuto(false)
    setSaveAutoError(null)
    try {
      const res = await saveAutoApplySettings(autoSettings)
      await mutateAutoApply(res, { revalidate: false })
      setSavedAuto(true)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'خطا در ذخیره تنظیمات'
      setSaveAutoError(msg)
    } finally {
      setSavingAuto(false)
    }
  }

  async function handleRunNow() {
    if (!autoSettings?.planAllowed) {
      setUpgradeOpen(true)
      return
    }
    setRunningNow(true)
    setRunResult(null)
    try {
      const res = await runAutoApplyNow()
      setRunResult(
        `چرخه اعمال شد: ${res.data.applied_count} محصول به‌روزرسانی شدند (${res.data.skipped_count} رد شده به دلیل احتیاط ایمنی).`
      )
      await mutateAutoApply()
    } catch {
      setRunResult('اجرای چرخه با خطا مواجه شد.')
    } finally {
      setRunningNow(false)
    }
  }

  function handleAutoApplyToggle(checked: boolean) {
    if (!autoSettings) return
    if (checked && !autoSettings.planAllowed) {
      setUpgradeOpen(true)
      return
    }
    setAutoSettings({ ...autoSettings, enabled: checked })
  }

  function row(
    key: keyof AlertPrefs,
    title: string,
    description: string,
    disabled = false
  ) {
    if (!prefs) return null
    return (
      <div className="flex items-start justify-between gap-4 py-3 border-b border-border last:border-0">
        <div className="space-y-1">
          <Label htmlFor={key} className="text-sm font-medium">
            {title}
          </Label>
          <p className="text-xs text-muted-foreground max-w-md">{description}</p>
        </div>
        <Switch
          id={key}
          checked={Boolean(prefs[key])}
          disabled={disabled}
          onCheckedChange={(checked) =>
            setPrefs({ ...prefs, [key]: checked })
          }
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-1 pb-12 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold">تنظیمات هوشمند و هشدارها</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          قوانین اعمال خودکار قیمت‌ها و شرایط ارسال اعلان‌ها برای فروشگاه شما.
        </p>
      </div>

      {/* 1. Auto-Apply Card (Pro Feature) */}
      {isAutoApplyLoading || !autoSettings ? (
        <Skeleton className="h-72 w-full rounded-2xl" />
      ) : autoApplyError ? (
        <p className="text-sm text-destructive">بارگذاری تنظیمات اعمال خودکار ناموفق بود.</p>
      ) : (
        <Card className="border-border/80 shadow-xs rounded-2xl overflow-hidden">
          <CardHeader className="bg-muted/30 pb-4 border-b border-border/60">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Zap className="size-4" />
                </div>
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    اعمال خودکار قیمت‌ها (Auto-Apply)
                  </CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    به‌روزرسانی مستقیم کاتالوگ ووکامرس بر اساس تحلیل رقبا و سقف سود امن.
                  </CardDescription>
                </div>
              </div>

              {autoSettings.planAllowed ? (
                <Badge
                  variant="outline"
                  className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 gap-1 text-xs py-1"
                >
                  <Sparkles className="size-3" />
                  پلن حرفه‌ای (فعال)
                </Badge>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setUpgradeOpen(true)}
                  className="h-7 text-xs gap-1 border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20"
                >
                  <Lock className="size-3" />
                  ویژه پلن حرفه‌ای (ارتقا)
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="pt-5 space-y-5">
            {/* Master Switch */}
            <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-border bg-card">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Label htmlFor="autoApplyEnabled" className="text-sm font-semibold cursor-pointer">
                    فعال‌سازی بازقیمت‌گذاری خودکار در فروشگاه
                  </Label>
                  {!autoSettings.planAllowed && (
                    <Badge variant="secondary" className="text-[10px]">
                      نیازمند Pro
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-lg">
                  هر زمان رصد رقبا انجام شود، در صورت ایمن بودن پیشنهاد (بالاتر از کف هزینه + حاشیه سود)، قیمت بدون نیاز به تأیید دستی در ووکامرس اعمال می‌شود.
                </p>
              </div>
              <Switch
                id="autoApplyEnabled"
                checked={autoSettings.enabled}
                onCheckedChange={handleAutoApplyToggle}
              />
            </div>

            {/* Circuit Breaker & Safety Guards */}
            <div className="space-y-4 pt-1">
              <div className="flex items-start justify-between gap-4 py-3 border-b border-border">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
                    <Label htmlFor="maxDrop" className="text-sm font-medium">
                      حداکثر درصد افت قیمت مجاز در هر نوبت (Circuit Breaker)
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground max-w-md">
                    جهت محافظت در برابر خطای نام‌گذاری رقبا یا نوسانات هیجانی بازار؛ اگر کاهش قیمت بیش از این درصد باشد، اعمال خودکار متوقف شده و نیاز به بررسی دستی خواهد داشت.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Input
                    id="maxDrop"
                    type="number"
                    dir="ltr"
                    min="1"
                    max="50"
                    className="w-20 h-9 text-center font-bold text-sm"
                    value={autoSettings.maxDropPercent}
                    onChange={(e) =>
                      setAutoSettings({
                        ...autoSettings,
                        maxDropPercent: Number(e.target.value) || 15,
                      })
                    }
                  />
                  <span className="text-xs font-semibold text-muted-foreground">درصد</span>
                </div>
              </div>

              {/* Fresh Rivals Only Switch */}
              <div className="flex items-start justify-between gap-4 py-3 border-b border-border">
                <div className="space-y-1">
                  <Label htmlFor="onlyFreshRivals" className="text-sm font-medium">
                    فقط با داده‌های تازه رقبا
                  </Label>
                  <p className="text-xs text-muted-foreground max-w-md">
                    اگر اطلاعات رقیب در ترب یا اسنپ منقضی شده باشد، قیمت خودکار تغییر نمی‌کند تا داده‌های جدید استخراج شوند.
                  </p>
                </div>
                <Switch
                  id="onlyFreshRivals"
                  checked={autoSettings.onlyFreshRivals}
                  onCheckedChange={(checked) =>
                    setAutoSettings({ ...autoSettings, onlyFreshRivals: checked })
                  }
                />
              </div>

              {/* Daily Notification Switch */}
              <div className="flex items-start justify-between gap-4 py-3 border-b border-border">
                <div className="space-y-1">
                  <Label htmlFor="notifyDaily" className="text-sm font-medium">
                    ارسال خلاصه روزانه تغییرات خودکار
                  </Label>
                  <p className="text-xs text-muted-foreground max-w-md">
                    گزارش روزانه تعداد کالاهایی که قیمت آنها به‌صورت خودکار تغییر یافته است به ایمیل شما ارسال می‌شود.
                  </p>
                </div>
                <Switch
                  id="notifyDaily"
                  checked={autoSettings.notifyDaily}
                  onCheckedChange={(checked) =>
                    setAutoSettings({ ...autoSettings, notifyDaily: checked })
                  }
                />
              </div>
            </div>

            {/* Quick Stats Strip */}
            <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-muted/40 border border-border/70 text-center">
              <div>
                <span className="text-xs text-muted-foreground">کالاهای آماده اعمال:</span>
                <p className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {autoSettings.eligibleProductsCount} محصول
                </p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">کالاهای مستثنی شده:</span>
                <p className="text-base font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                  {autoSettings.excludedProductsCount} محصول
                </p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">کل محصولات:</span>
                <p className="text-base font-bold text-foreground mt-0.5">
                  {autoSettings.totalProductsCount} محصول
                </p>
              </div>
            </div>

            {/* Run Feedback */}
            {runResult && (
              <div className="p-3 rounded-xl bg-muted border border-border text-xs flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span>{runResult}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-3">
                <Button onClick={() => void handleSaveAutoApply()} disabled={savingAuto}>
                  {savingAuto ? 'در حال ذخیره…' : 'ذخیره تنظیمات اعمال خودکار'}
                </Button>
                {savedAuto && <span className="text-sm text-emerald-600">تنظیمات ذخیره شد</span>}
                {saveAutoError && <span className="text-sm text-destructive">{saveAutoError}</span>}
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => void handleRunNow()}
                disabled={runningNow}
                className="gap-1.5 text-xs rounded-xl"
              >
                {runningNow ? (
                  <RotateCw className="size-3.5 animate-spin" />
                ) : (
                  <Play className="size-3.5 text-primary" />
                )}
                اجرای دستی چرخه هم‌اکنون
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 2. Standard Notifications Card */}
      {error ? (
        <p className="text-sm text-destructive">بارگذاری هشدارها ناموفق بود.</p>
      ) : isLoading || !prefs ? (
        <Skeleton className="h-64 w-full rounded-2xl" />
      ) : (
        <Card className="border-border/80 shadow-xs rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">ترجیحات اعلان و هشدارها</CardTitle>
            <CardDescription className="text-xs">
              در چه شرایطی سیستم از طریق ایمیل یا اعلان پنل شما را مطلع سازد.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {row(
              'belowCost',
              'زیر کف هزینه',
              'اگر قیمت فروشگاه به زیر کف هزینه + حاشیه برسد.'
            )}
            {row(
              'aboveRivals',
              'بالاتر از رقبا',
              'وقتی فروشگاه از ارزان‌ترین رقیب فاصله معنادار بگیرد.'
            )}
            {row(
              'staleCost',
              'هزینه‌های قدیمی',
              'اگر مدتی است هزینه‌های فروشگاه را به‌روز نکرده‌اید.'
            )}
            {row('email', 'ایمیل', 'ارسال اعلان‌ها به ایمیل حساب شما')}
            {row('sms', 'پیامک', 'به‌زودی', true)}

            <div className="flex items-center gap-3 pt-4">
              <Button onClick={() => void handleSaveAlerts()} disabled={savingAlerts}>
                {savingAlerts ? 'در حال ذخیره…' : 'ذخیره ترجیحات هشدار'}
              </Button>
              {savedAlerts && <span className="text-sm text-primary">ذخیره شد</span>}
              {saveAlertsError && <span className="text-sm text-destructive">ذخیره ناموفق بود.</span>}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plan Upgrade Dialog */}
      <PlanUpgradeDialog open={upgradeOpen} onOpenChange={setUpgradeOpen} />
    </div>
  )
}
