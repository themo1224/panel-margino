import { useEffect, useState } from 'react'
import useSWR from 'swr'
import {
  ALERTS_KEY,
  fetchAlertPrefs,
  saveAlertPrefs,
} from '@/api/pricing/pricing-api'
import type { AlertPrefs } from '@/types/apps/pricing'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function AlertsPage() {
  const { data, isLoading, error, mutate } = useSWR(ALERTS_KEY, fetchAlertPrefs)
  const [prefs, setPrefs] = useState<AlertPrefs | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState(false)

  useEffect(() => {
    if (data?.data) setPrefs(data.data)
  }, [data])

  async function handleSave() {
    if (!prefs) return
    setSaving(true)
    setSaved(false)
    setSaveError(false)
    try {
      const res = await saveAlertPrefs(prefs)
      await mutate(res, { revalidate: false })
      setSaved(true)
    } catch {
      setSaveError(true)
    } finally {
      setSaving(false)
    }
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
    <div className="flex flex-col gap-6 p-1 pb-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold">هشدارها</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          انتخاب کنید برای چه چیزهایی به شما خبر بدهیم.
        </p>
      </div>

      {error ? (
        <p className="text-sm text-destructive">بارگذاری هشدارها ناموفق بود.</p>
      ) : isLoading || !prefs ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-base">ترجیحات اعلان</CardTitle>
            <CardDescription>
              اینستاگرام و API عمومی فعلاً به‌زودی هستند؛ هشدارهای پنل اینجا تنظیم
              می‌شوند.
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
              <Button onClick={() => void handleSave()} disabled={saving}>
                {saving ? 'در حال ذخیره…' : 'ذخیره ترجیحات'}
              </Button>
              {saved ? (
                <span className="text-sm text-primary">ذخیره شد</span>
              ) : null}
              {saveError ? (
                <span className="text-sm text-destructive">ذخیره ناموفق بود.</span>
              ) : null}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
