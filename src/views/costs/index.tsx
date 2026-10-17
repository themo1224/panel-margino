import { FormEvent, useEffect, useState } from 'react'
import useSWR from 'swr'
import { COSTS_KEY, fetchCosts, saveCosts } from '@/api/pricing/pricing-api'
import type { CostProfile } from '@/types/apps/pricing'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'

export default function CostsPage() {
  const { data, isLoading, error, mutate } = useSWR<{ data: CostProfile }>(
    COSTS_KEY,
    fetchCosts
  )
  const profile = data?.data

  const [form, setForm] = useState<CostProfile | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (profile) setForm(profile)
  }, [profile])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form) return
    setSaving(true)
    setSaved(false)
    try {
      await saveCosts(form)
      await mutate()
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }


  function setNumber(key: keyof CostProfile, value: string) {
    if (!form) return
    const n = Number(value.replace(/,/g, ''))
    setForm({ ...form, [key]: Number.isFinite(n) ? n : 0 })
  }

  return (
    <div className="flex flex-col gap-6 p-1 pb-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold">هزینه‌ها</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          پروفایل هزینه فروشگاه — کف قیمت و حاشیه هدف. پیشنهاد هرگز زیر کف + حاشیه
          نمی‌رود.
        </p>
      </div>

      {isLoading || !form ? (
        <Skeleton className="h-80 w-full" />
      ) : error ? (
        <p className="text-sm text-destructive">بارگذاری هزینه‌ها ناموفق بود.</p>
      ) : (
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-base">پروفایل هزینه</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={(e) => void onSubmit(e)}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="supplierPct">سهم تأمین‌کننده (٪)</Label>
                  <Input
                    id="supplierPct"
                    type="number"
                    dir="ltr"
                    value={form.supplierPct}
                    onChange={(e) => setNumber('supplierPct', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dollarPct">حساسیت دلار (٪)</Label>
                  <Input
                    id="dollarPct"
                    type="number"
                    dir="ltr"
                    value={form.dollarPct}
                    onChange={(e) => setNumber('dollarPct', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rentMonthly">اجاره ماهانه (تومان)</Label>
                  <Input
                    id="rentMonthly"
                    type="number"
                    dir="ltr"
                    value={form.rentMonthly}
                    onChange={(e) => setNumber('rentMonthly', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="staffMonthly">حقوق ماهانه (تومان)</Label>
                  <Input
                    id="staffMonthly"
                    type="number"
                    dir="ltr"
                    value={form.staffMonthly}
                    onChange={(e) => setNumber('staffMonthly', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="otherMonthly">سایر هزینه‌ها (تومان)</Label>
                  <Input
                    id="otherMonthly"
                    type="number"
                    dir="ltr"
                    value={form.otherMonthly}
                    onChange={(e) => setNumber('otherMonthly', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetMarginPct">حاشیه هدف (٪)</Label>
                  <Input
                    id="targetMarginPct"
                    type="number"
                    dir="ltr"
                    value={form.targetMarginPct}
                    onChange={(e) =>
                      setNumber('targetMarginPct', e.target.value)
                    }
                  />
                </div>
              </div>

              {saved ? (
                <p className="text-sm text-primary">پروفایل هزینه با موفقیت ذخیره شد.</p>
              ) : null}

              <Button type="submit" disabled={saving}>
                {saving ? 'در حال ذخیره…' : 'ذخیره پروفایل'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
