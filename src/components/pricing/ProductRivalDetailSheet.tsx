import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { toast } from 'sonner'
import {
  formatToman,
  rivalStatusLabel,
} from '@/api/pricing/pricing-data'
import {
  applyProductPrice,
  fetchProductDetail,
  PRODUCTS_KEY,
  refreshRivals,
  unlinkRival,
} from '@/api/pricing/pricing-api'
import type { ProductRivalDetail, ProductRivalRow } from '@/types/apps/pricing'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Calculator,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  ShieldCheck,
  Store,
  TrendingDown,
  TrendingUp,
  Unlink,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ProductRivalDetailSheetProps {
  productId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onPriceApplied?: (updated: ProductRivalRow) => void
  onRivalUpdated?: (updated: ProductRivalRow) => void
}

export function ProductRivalDetailSheet({
  productId,
  open,
  onOpenChange,
  onPriceApplied,
  onRivalUpdated,
}: ProductRivalDetailSheetProps) {
  const detailKey = productId && open ? `${PRODUCTS_KEY}/${productId}` : null
  const { data, isLoading, mutate } = useSWR(
    detailKey,
    productId ? () => fetchProductDetail(productId) : null
  )

  const detail: ProductRivalDetail | undefined = data?.data

  const [overridePrice, setOverridePrice] = useState<string>('')
  const [isApplying, setIsApplying] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isUnlinking, setIsUnlinking] = useState(false)

  // Reset or initialize custom price whenever detail changes
  useEffect(() => {
    if (detail?.recommendedPrice) {
      setOverridePrice(String(detail.recommendedPrice))
    }
  }, [detail?.recommendedPrice, productId])

  async function handleApply() {
    if (!productId) return
    const numericPrice = Number(overridePrice)
    if (isNaN(numericPrice) || numericPrice <= 0) {
      toast.error('لطفاً یک قیمت معتبر وارد کنید.')
      return
    }

    if (detail && numericPrice < detail.costFloor) {
      toast.warning('توجه: این قیمت کمتر از کف هزینه امن فروشگاه است!')
    }

    setIsApplying(true)
    try {
      const res = await applyProductPrice(productId, numericPrice)
      toast.success(`قیمت با موفقیت به ${formatToman(numericPrice)} به‌روزرسانی شد.`)
      await mutate()
      if (onPriceApplied) {
        onPriceApplied(res.data)
      }
      onOpenChange(false)
    } catch {
      toast.error('خطا در اعمال قیمت جدید.')
    } finally {
      setIsApplying(false)
    }
  }

  async function handleRefresh() {
    if (!productId) return
    setIsRefreshing(true)
    try {
      const res = await refreshRivals(productId)
      toast.success('استعلام مجدد از ترب با موفقیت انجام شد.')
      await mutate()
      if (onRivalUpdated) {
        onRivalUpdated(res.data)
      }
    } catch {
      toast.error('خطا در استعلام مجدد از ترب.')
    } finally {
      setIsRefreshing(false)
    }
  }

  async function handleUnlink() {
    if (!productId) return
    setIsUnlinking(true)
    try {
      const res = await unlinkRival(productId)
      toast.success('اتصال رقیب با موفقیت لغو شد.')
      await mutate()
      if (onRivalUpdated) {
        onRivalUpdated(res.data)
      }
      onOpenChange(false)
    } catch {
      toast.error('خطا در لغو اتصال رقیب.')
    } finally {
      setIsUnlinking(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-full sm:max-w-2xl md:max-w-3xl lg:max-w-3xl overflow-y-auto overflow-x-hidden p-0 flex flex-col justify-between"
      >
        {isLoading || !detail ? (
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/3" />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton className="h-20 rounded-xl" />
            </div>
            <Skeleton className="h-64 rounded-xl" />
          </div>
        ) : (
          <div className="flex flex-col flex-1 pb-6">
            {/* Header Banner */}
            <SheetHeader className="p-5 sm:p-6 border-b border-border bg-muted/20 text-start space-y-3 pe-16">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono text-muted-foreground bg-muted px-2.5 py-0.5 rounded-lg border border-border/50">
                      {detail.sku}
                    </span>
                    <Badge variant="outline" className="text-xs rounded-lg py-0.5">
                      {rivalStatusLabel(detail.rivalStatus)}
                    </Badge>
                  </div>
                  <SheetTitle className="text-xl font-bold text-foreground leading-snug">
                    {detail.name}
                  </SheetTitle>
                  <SheetDescription className="text-xs text-muted-foreground">
                    تحلیل کامل بازار، لیست رقبای متصل و تفکیک هزینه محصول
                  </SheetDescription>
                </div>

                {detail.torobUrl ? (
                  <a
                    href={detail.torobUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline bg-primary/10 hover:bg-primary/15 px-3 py-1.5 rounded-xl shrink-0 font-medium transition-colors"
                  >
                    <span>مشاهده در ترب</span>
                    <ExternalLink className="size-3.5 shrink-0" />
                  </a>
                ) : null}
              </div>

              {/* 4 KPI Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                <div className="rounded-2xl border border-border bg-card p-3 text-center shadow-2xs">
                  <p className="text-[11px] text-muted-foreground whitespace-nowrap font-medium">قیمت فروشگاه</p>
                  <p className="mt-1 text-sm font-bold tabular-nums text-foreground">
                    {formatToman(detail.storePrice)}
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-card p-3 text-center shadow-2xs">
                  <p className="text-[11px] text-muted-foreground whitespace-nowrap font-medium">کف امن هزینه</p>
                  <p className="mt-1 text-sm font-bold tabular-nums text-muted-foreground">
                    {formatToman(detail.costFloor)}
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-card p-3 text-center shadow-2xs">
                  <p className="text-[11px] text-muted-foreground whitespace-nowrap font-medium">ارزان‌ترین رقیب</p>
                  <p className="mt-1 text-sm font-bold tabular-nums text-amber-600 dark:text-amber-400">
                    {detail.rivalCheapest ? formatToman(detail.rivalCheapest) : '—'}
                  </p>
                </div>

                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-3 text-center shadow-2xs">
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold whitespace-nowrap">پیشنهاد هوشمند</p>
                  <p className="mt-1 text-sm font-black tabular-nums text-emerald-600 dark:text-emerald-400">
                    {formatToman(detail.recommendedPrice)}
                  </p>
                </div>
              </div>
            </SheetHeader>

            {/* Main Tabs Content */}
            <div className="p-5 sm:p-6 flex-1">
              <Tabs defaultValue="competitors" className="w-full">
                <TabsList className="flex flex-wrap w-full sm:w-auto items-center justify-start gap-1.5 h-auto p-1.5 rounded-2xl bg-muted/60 mb-5 border border-border/50">
                  <TabsTrigger
                    value="competitors"
                    className="px-4 py-2 text-xs font-semibold rounded-xl transition-all data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  >
                    رقبا در ترب ({detail.competitors.length.toLocaleString('fa-IR')})
                  </TabsTrigger>
                  <TabsTrigger
                    value="formula"
                    className="px-4 py-2 text-xs font-semibold rounded-xl transition-all data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  >
                    فرمول کف هزینه
                  </TabsTrigger>
                  <TabsTrigger
                    value="history"
                    className="px-4 py-2 text-xs font-semibold rounded-xl transition-all data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  >
                    تاریخچه تغییرات
                  </TabsTrigger>
                </TabsList>

                {/* Tab 1: Competitors List */}
                <TabsContent value="competitors" className="space-y-4">
                  {detail.competitors.length === 0 ? (
                    <div className="p-8 sm:p-10 text-center border border-dashed border-border/80 rounded-2xl bg-muted/10 space-y-3">
                      <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                        <Store className="size-6 text-muted-foreground/60" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-foreground">
                          رقیب فعالی برای این کالا در ترب ثبت نشده است
                        </p>
                        <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                          پیشنهاد هوشمند بر اساس کف امن هزینه و حاشیه سود هدف فروشگاه محاسبه شده است. می‌توانید مجدداً از ترب استعلام بگیرید.
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isRefreshing}
                        onClick={handleRefresh}
                        className="gap-2 text-xs rounded-xl h-9 px-4"
                      >
                        <RefreshCw className={cn('size-3.5', isRefreshing && 'animate-spin')} />
                        <span>استعلام مجدد از ترب</span>
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="overflow-x-auto rounded-xl border border-border">
                        <Table className="min-w-[500px]">
                          <TableHeader>
                            <TableRow className="bg-muted/40 text-[11px]">
                              <TableHead className="text-start whitespace-nowrap min-w-[170px]">نام فروشگاه رقیب</TableHead>
                              <TableHead className="text-start whitespace-nowrap min-w-[70px]">شهر</TableHead>
                              <TableHead className="text-start whitespace-nowrap min-w-[110px]">قیمت رقیب</TableHead>
                              <TableHead className="text-start whitespace-nowrap min-w-[110px]">اختلاف با شما</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {detail.competitors.map((comp) => {
                              const diff = comp.price - detail.storePrice
                              const diffPct = Math.round((diff / detail.storePrice) * 100)
                              return (
                                <TableRow key={comp.id} className="text-xs">
                                  <TableCell className="font-medium whitespace-nowrap">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span>{comp.shopName}</span>
                                      {comp.isCheapest ? (
                                        <Badge className="bg-emerald-500/10 text-emerald-600 text-[10px] px-1 py-0 border-emerald-500/20 whitespace-nowrap">
                                          ارزان‌ترین
                                        </Badge>
                                      ) : null}
                                      {comp.isDigikala ? (
                                        <Badge className="bg-rose-500/10 text-rose-600 text-[10px] px-1 py-0 border-rose-500/20 whitespace-nowrap">
                                          دیجی‌کالا
                                        </Badge>
                                      ) : null}
                                    </div>
                                    <span className="text-[10px] text-muted-foreground block mt-0.5 whitespace-nowrap">
                                      ثبت: {comp.lastSeenAt}
                                    </span>
                                  </TableCell>
                                  <TableCell className="text-muted-foreground text-[11px] whitespace-nowrap">
                                    {comp.city ?? 'سراسری'}
                                  </TableCell>
                                  <TableCell className="font-bold tabular-nums whitespace-nowrap">
                                    {formatToman(comp.price)}
                                  </TableCell>
                                  <TableCell className="tabular-nums whitespace-nowrap">
                                    {diff === 0 ? (
                                      <span className="text-muted-foreground text-[11px]">هم‌قیمت</span>
                                    ) : diff > 0 ? (
                                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px] flex items-center gap-0.5">
                                        <TrendingDown className="size-3" />
                                        {diffPct}٪ گران‌تر
                                      </span>
                                    ) : (
                                      <span className="text-rose-600 dark:text-rose-400 font-semibold text-[11px] flex items-center gap-0.5">
                                        <TrendingUp className="size-3" />
                                        {Math.abs(diffPct)}٪ ارزان‌تر
                                      </span>
                                    )}
                                  </TableCell>
                                </TableRow>
                              )
                            })}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Match Metadata strip */}
                      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-muted/30 rounded-2xl border border-border text-xs">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <ShieldCheck className="size-4 text-primary shrink-0" />
                          <span>ضریب اطمینان تطبیق رقیب:</span>
                          <span className="font-bold text-foreground bg-primary/10 text-primary px-2 py-0.5 rounded-lg text-xs">
                            {Math.round((detail.matchConfidence ?? 0.8) * 100)}٪
                          </span>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isRefreshing}
                            onClick={handleRefresh}
                            className="h-8 gap-1.5 text-xs rounded-xl whitespace-nowrap"
                          >
                            <RefreshCw className={cn('size-3.5', isRefreshing && 'animate-spin')} />
                            <span>استعلام مجدد از ترب</span>
                          </Button>

                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            disabled={isUnlinking}
                            onClick={handleUnlink}
                            className="h-8 gap-1.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-500/10 rounded-xl whitespace-nowrap"
                          >
                            <Unlink className="size-3.5 shrink-0" />
                            <span>لغو اتصال رقیب</span>
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </TabsContent>

                {/* Tab 2: Cost Formula Breakdown */}
                <TabsContent value="formula" className="space-y-4">
                  <div className="p-4 rounded-xl border border-border bg-card space-y-3">
                    <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Calculator className="size-4 text-primary" />
                      مراحل محاسبه کف هزینه امن (Cost Floor)
                    </h4>
                    <p className="text-xs text-muted-foreground leading-5">
                      قیمت پیشنهادی هیچ‌گاه زیر این مبلغ نخواهد رفت تا شما متضرر نشوید.
                    </p>

                    <div className="divide-y divide-border/60 text-xs">
                      <div className="py-2 flex items-center justify-between">
                        <span className="text-muted-foreground">۱. قیمت خرید پایه از تأمین‌کننده:</span>
                        <span className="font-semibold tabular-nums">
                          {formatToman(detail.costBreakdown.baseCost)}
                        </span>
                      </div>
                      <div className="py-2 flex items-center justify-between">
                        <span className="text-muted-foreground">
                          ۲. درصد سربار، حمل و اصطکاک ({detail.costBreakdown.overheadPct}٪):
                        </span>
                        <span className="font-semibold tabular-nums text-muted-foreground">
                          {formatToman(
                            Math.round(detail.costBreakdown.baseCost * (detail.costBreakdown.overheadPct / 100))
                          )}
                        </span>
                      </div>
                      <div className="py-2 flex items-center justify-between">
                        <span className="text-muted-foreground">
                          ۳. حداقل حاشیه سود هدف ({detail.costBreakdown.targetMarginPct}٪):
                        </span>
                        <span className="font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                          {formatToman(
                            Math.round(detail.costBreakdown.baseCost * (detail.costBreakdown.targetMarginPct / 100))
                          )}
                        </span>
                      </div>
                      <div className="py-2.5 flex items-center justify-between bg-muted/40 px-2 rounded-lg mt-1 font-bold">
                        <span className="text-foreground">کف هزینه امن نهایی (Floor):</span>
                        <span className="tabular-nums text-primary text-sm">
                          {formatToman(detail.costBreakdown.calculatedFloor)}
                        </span>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Tab 3: Price History */}
                <TabsContent value="history" className="space-y-3">
                  <div className="rounded-xl border border-border overflow-x-auto">
                    <Table className="min-w-[450px]">
                      <TableHeader>
                        <TableRow className="bg-muted/40 text-[11px]">
                          <TableHead className="text-start whitespace-nowrap">تاریخ تغییر</TableHead>
                          <TableHead className="text-start whitespace-nowrap">قیمت قبلی</TableHead>
                          <TableHead className="text-start whitespace-nowrap">قیمت جدید</TableHead>
                          <TableHead className="text-start whitespace-nowrap">علت تغییر</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {detail.priceHistory.map((item) => (
                          <TableRow key={item.id} className="text-xs">
                            <TableCell className="text-muted-foreground font-mono whitespace-nowrap">
                              {item.date}
                            </TableCell>
                            <TableCell className="tabular-nums text-muted-foreground line-through whitespace-nowrap">
                              {formatToman(item.oldPrice)}
                            </TableCell>
                            <TableCell className="tabular-nums font-bold text-foreground whitespace-nowrap">
                              {formatToman(item.newPrice)}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {item.source === 'auto' ? (
                                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] border-emerald-500/20 gap-0.5 whitespace-nowrap">
                                  <Zap className="size-2.5" />
                                  اعمال خودکار (سیستم)
                                </Badge>
                              ) : item.source === 'recommendation' ? (
                                <Badge className="bg-primary/10 text-primary text-[10px] border-primary/20 whitespace-nowrap">
                                  تأیید پیشنهاد
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-[10px] whitespace-nowrap">
                                  دستی توسط کاربر
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Action Bar / Price Override Footer */}
            <div className="p-4 sm:p-5 border-t border-border bg-card/95 backdrop-blur-sm mt-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <label htmlFor="price-override" className="text-xs font-semibold text-foreground block">
                    قیمت نهایی جهت اعمال در فروشگاه:
                  </label>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    می‌توانید عدد پیشنهادی را قبل از اعمال ویرایش نمایید.
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="relative w-44">
                    <Input
                      id="price-override"
                      type="number"
                      value={overridePrice}
                      onChange={(e) => setOverridePrice(e.target.value)}
                      className="text-left font-mono font-bold text-sm h-10 pe-14 rounded-xl"
                    />
                    <span className="absolute end-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium pointer-events-none">
                      تومان
                    </span>
                  </div>

                  <Button
                    type="button"
                    disabled={isApplying}
                    onClick={handleApply}
                    className="h-10 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-5 rounded-xl gap-2 shadow-sm whitespace-nowrap shrink-0"
                  >
                    <CheckCircle2 className="size-4 shrink-0" />
                    <span>{isApplying ? 'در حال اعمال…' : 'اعمال قیمت در ووکامرس'}</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
