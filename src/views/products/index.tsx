import { useMemo, useState } from 'react'
import useSWR from 'swr'
import { toast } from 'sonner'
import {
  formatToman,
  rivalStatusLabel,
} from '@/api/pricing/pricing-data'
import {
  applyProductPrice,
  batchApplyPrices,
  batchRefreshRivals,
  confirmRivalMatch,
  fetchPlanUsage,
  fetchProducts,
  PLAN_KEY,
  PRODUCTS_KEY,
} from '@/api/pricing/pricing-api'
import { RivalCompare } from '@/components/pricing/RivalCompare'
import type { ProductRivalRow } from '@/types/apps/pricing'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { PackageSearch, Radio, Search, CheckCircle2, AlertTriangle, Layers, Clock, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProductRivalDetailSheet } from '@/components/pricing/ProductRivalDetailSheet'
import { PriceOverridePopover } from '@/components/pricing/PriceOverridePopover'
import { BulkActionToolbar } from '@/components/pricing/BulkActionToolbar'
import { PlanLimitBanner } from '@/components/pricing/PlanLimitBanner'
import { PlanUpgradeDialog } from '@/components/pricing/PlanUpgradeDialog'

type StatusFilter = 'all' | ProductRivalRow['rivalStatus'] | 'above_rivals'

function statusBadge(status: ProductRivalRow['rivalStatus']) {
  const label = rivalStatusLabel(status)
  const base = 'border font-medium text-xs px-2.5 py-0.5'
  switch (status) {
    case 'matched':
      return (
        <Badge
          className={cn(
            base,
            'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
          )}
        >
          {label}
        </Badge>
      )
    case 'stale':
      return (
        <Badge
          className={cn(
            base,
            'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400'
          )}
        >
          {label}
        </Badge>
      )
    case 'finding':
      return (
        <Badge
          variant="outline"
          className={cn(base, 'border-border text-muted-foreground')}
        >
          {label}
        </Badge>
      )
    case 'needs_confirm':
      return (
        <Badge
          className={cn(
            base,
            'border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400'
          )}
        >
          {label}
        </Badge>
      )
    case 'cannot_match':
      return (
        <Badge
          variant="outline"
          className={cn(
            base,
            'border-rose-500/35 bg-rose-500/10 text-rose-600 dark:text-rose-400'
          )}
        >
          {label}
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className={base}>
          {label}
        </Badge>
      )
  }
}

function ConfirmAction({
  row,
  onConfirm,
  busy,
  message,
}: {
  row: ProductRivalRow
  onConfirm: (row: ProductRivalRow) => void
  busy: boolean
  message: string | null
}) {
  const pending = row.pendingRivalMatch
  if (!pending || row.rivalStatus !== 'needs_confirm') return null

  return (
    <div className="space-y-2 rounded-xl border border-blue-500/20 bg-blue-500/5 p-3">
      <p className="text-xs font-medium text-foreground">
        آیا این همان محصول رقیب است؟
        {pending.listingTitle ? (
          <span className="mt-1 block text-xs text-muted-foreground font-normal">
            {pending.listingTitle}
          </span>
        ) : null}
      </p>
      <Button
        type="button"
        size="sm"
        className="h-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-lg"
        disabled={busy}
        onClick={() => onConfirm(row)}
      >
        {busy ? 'در حال ثبت…' : 'تأیید محصول رقیب'}
      </Button>
      {message ? (
        <p
          className={cn(
            'text-[11px]',
            message.startsWith('خطا')
              ? 'text-destructive'
              : 'text-emerald-500'
          )}
          role="status"
        >
          {message}
        </p>
      ) : null}
    </div>
  )
}

function ProductMobileCard({
  row,
  onConfirm,
  busyId,
  feedback,
  onApplyPrice,
  onApplyCustomPrice,
  onOpenDetail,
  isSelected,
  onToggleSelect,
}: {
  row: ProductRivalRow
  onConfirm: (row: ProductRivalRow) => void
  busyId: string | null
  feedback: Record<string, string>
  onApplyPrice: (product: ProductRivalRow) => void
  onApplyCustomPrice: (product: ProductRivalRow, price: number) => Promise<void> | void
  onOpenDetail: (productId: string) => void
  isSelected: boolean
  onToggleSelect: () => void
}) {
  return (
    <article
      className={cn(
        'border-b border-border p-4 space-y-3 last:border-b-0 transition-colors',
        isSelected && 'bg-primary/5'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onToggleSelect}
            aria-label={`انتخاب ${row.name}`}
          />
          <div
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => onOpenDetail(row.id)}
          >
            <div className="size-10 rounded-xl bg-muted/80 flex items-center justify-center border border-border group-hover:border-primary/40 transition-colors shrink-0">
              <PackageSearch className="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground leading-tight group-hover:text-primary transition-colors">
                {row.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5" dir="ltr">
                {row.sku}
              </p>
            </div>
          </div>
        </div>
        {statusBadge(row.rivalStatus)}
      </div>

      <div className="grid grid-cols-3 gap-2 rounded-xl border border-border bg-muted/30 p-2.5 text-center">
        <div>
          <p className="text-[11px] text-muted-foreground">فروشگاه</p>
          <p className="mt-0.5 text-xs font-semibold tabular-nums">
            {formatToman(row.storePrice)}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground">کف هزینه</p>
          <p className="mt-0.5 text-xs font-semibold tabular-nums text-muted-foreground">
            {formatToman(row.costFloor)}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground">پیشنهادی</p>
          <p className="mt-0.5 text-xs font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
            {formatToman(row.recommendedPrice)}
          </p>
        </div>
      </div>

      {row.rivalStatus === 'finding' ? (
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground py-1">
          <Radio className="size-3.5 animate-pulse text-primary" />
          در حال یافتن رقبا در ترب و اسنپ…
        </p>
      ) : row.rivalStatus === 'cannot_match' ? (
        <p className="text-xs text-muted-foreground py-1">
          رقیب سودآور پیدا نشد — پیشنهاد براساس کف هزینه.
        </p>
      ) : row.rivalStatus === 'needs_confirm' ? (
        <ConfirmAction
          row={row}
          onConfirm={onConfirm}
          busy={busyId === row.id}
          message={feedback[row.id] ?? null}
        />
      ) : (
        <div
          className="cursor-pointer"
          onClick={() => onOpenDetail(row.id)}
          title="مشاهده جزئیات رقبا"
        >
          <RivalCompare
            storePrice={row.storePrice}
            rivalCheapest={row.rivalCheapest}
            vsStorePct={row.vsStorePct}
            source={row.rivalSource}
            rivalCount={row.rivalCount}
            status={row.rivalStatus}
          />
        </div>
      )}

      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          onClick={() => onApplyPrice(row)}
          className="flex-1 h-9 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-xl gap-1.5"
        >
          <CheckCircle2 className="size-3.5" />
          اعمال پیشنهاد ({formatToman(row.recommendedPrice)})
        </Button>
        <PriceOverridePopover
          product={row}
          onApply={onApplyCustomPrice}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onOpenDetail(row.id)}
          className="h-9 px-3 border-border rounded-xl text-xs gap-1"
        >
          <Eye className="size-3.5" />
          <span>تحلیل</span>
        </Button>
      </div>
    </article>
  )
}

export default function ProductsPage() {
  const { data, isLoading, error, mutate } = useSWR(PRODUCTS_KEY, fetchProducts)
  const { data: planData } = useSWR(PLAN_KEY, fetchPlanUsage)
  const plan = planData?.data
  const products = data?.data ?? []
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [busyId, setBusyId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<Record<string, string>>({})
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [upgradeOpen, setUpgradeOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isBatchApplying, setIsBatchApplying] = useState(false)
  const [isBatchRefreshing, setIsBatchRefreshing] = useState(false)

  function handleOpenDetail(productId: string) {
    setSelectedProductId(productId)
    setSheetOpen(true)
  }

  function handleToggleSelect(productId: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(productId)) {
        next.delete(productId)
      } else {
        next.add(productId)
      }
      return next
    })
  }

  const counts = useMemo(() => {
    return {
      all: products.length,
      matched: products.filter((p) => p.rivalStatus === 'matched').length,
      stale: products.filter((p) => p.rivalStatus === 'stale').length,
      finding: products.filter((p) => p.rivalStatus === 'finding').length,
      needs_confirm: products.filter((p) => p.rivalStatus === 'needs_confirm').length,
      cannot_match: products.filter((p) => p.rivalStatus === 'cannot_match').length,
      above_rivals: products.filter((p) => p.vsStorePct != null && p.vsStorePct > 5).length,
    }
  }, [products])

  const filtered = useMemo(() => {
    return products.filter((p) => {
      // Search query filter
      const matchesSearch =
        searchQuery.trim() === '' ||
        p.name.includes(searchQuery.trim()) ||
        p.sku.toLowerCase().includes(searchQuery.trim().toLowerCase())

      if (!matchesSearch) return false

      // Status filter
      if (filter === 'all') return true
      if (filter === 'above_rivals') return p.vsStorePct != null && p.vsStorePct > 5
      return p.rivalStatus === filter
    })
  }, [products, filter, searchQuery])

  const isAllSelected = filtered.length > 0 && filtered.every((p) => selectedIds.has(p.id))
  const isSomeSelected = filtered.some((p) => selectedIds.has(p.id)) && !isAllSelected

  function handleToggleSelectAll() {
    if (isAllSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filtered.map((p) => p.id)))
    }
  }

  async function handleConfirm(row: ProductRivalRow) {
    const matchId = row.pendingRivalMatch?.id
    if (!matchId) return
    setBusyId(row.id)
    setFeedback((prev) => ({ ...prev, [row.id]: '' }))
    try {
      const res = await confirmRivalMatch(row.id, matchId)
      await mutate(
        (current) => {
          if (!current) return current
          return {
            data: current.data.map((p) => (p.id === row.id ? res.data : p)),
          }
        },
        { revalidate: false }
      )
      toast.success('محصول رقیب تأیید شد و تحلیل به‌روزرسانی گردید.')
    } catch {
      toast.error('خطا در تأیید محصول رقیب.')
    } finally {
      setBusyId(null)
    }
  }

  async function handleApplyPrice(product: ProductRivalRow) {
    try {
      const res = await applyProductPrice(product.id, product.recommendedPrice)
      await mutate(
        (current) => {
          if (!current) return current
          return {
            data: current.data.map((p) => (p.id === product.id ? res.data : p)),
          }
        },
        { revalidate: false }
      )
      toast.success(
        `قیمت محصول «${product.name}» با موفقیت به ${formatToman(product.recommendedPrice)} به‌روزرسانی شد.`
      )
    } catch {
      toast.error('خطا در اعمال قیمت.')
    }
  }

  async function handleApplyCustomPrice(product: ProductRivalRow, customPrice: number) {
    try {
      const res = await applyProductPrice(product.id, customPrice)
      await mutate(
        (current) => {
          if (!current) return current
          return {
            data: current.data.map((p) => (p.id === product.id ? res.data : p)),
          }
        },
        { revalidate: false }
      )
      toast.success(
        `قیمت محصول «${product.name}» با موفقیت به ${formatToman(customPrice)} تغییر یافت.`
      )
    } catch {
      toast.error('خطا در اعمال قیمت سفارشی.')
      throw new Error('Apply price failed')
    }
  }

  async function handleBatchApply() {
    const ids = Array.from(selectedIds)
    if (ids.length === 0) return
    setIsBatchApplying(true)
    try {
      const res = await batchApplyPrices(ids)
      const updatedMap = new Map(res.data.map((p) => [p.id, p]))
      await mutate(
        (current) => {
          if (!current) return current
          return {
            data: current.data.map((p) => updatedMap.get(p.id) ?? p),
          }
        },
        { revalidate: false }
      )
      toast.success(
        `قیمت‌های پیشنهادی برای ${ids.length.toLocaleString('fa-IR')} محصول با موفقیت در ووکامرس اعمال گردید.`
      )
      setSelectedIds(new Set())
    } catch {
      toast.error('خطا در اعمال گروهی قیمت‌ها.')
    } finally {
      setIsBatchApplying(false)
    }
  }

  async function handleBatchRefresh() {
    const ids = Array.from(selectedIds)
    if (ids.length === 0) return
    setIsBatchRefreshing(true)
    try {
      const res = await batchRefreshRivals(ids)
      const updatedMap = new Map(res.data.map((p) => [p.id, p]))
      await mutate(
        (current) => {
          if (!current) return current
          return {
            data: current.data.map((p) => updatedMap.get(p.id) ?? p),
          }
        },
        { revalidate: false }
      )
      toast.success(
        `استعلام مجدد از ترب برای ${ids.length.toLocaleString('fa-IR')} محصول آغاز شد.`
      )
    } catch {
      toast.error('خطا در استعلام مجدد از ترب.')
    } finally {
      setIsBatchRefreshing(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Page Title & Search Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            کاتالوگ محصولات و تحلیل رقبا
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            تحلیل هوشمند و تصویری قیمت فروشگاه در مقایسه با ارزان‌ترین رقبا در ترب و اسنپ
          </p>
        </div>

        {/* Global Product Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="جستجوی نام محصول یا کد SKU…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ps-9 h-10 rounded-xl bg-card border-border shadow-xs text-sm"
          />
        </div>
      </header>

      {/* Plan Quota Alert Banner when >= 80% or at 100% cap */}
      <PlanLimitBanner plan={plan} onUpgradeClick={() => setUpgradeOpen(true)} />

      {/* 4 Hero KPI Cards (Glassmorphism & Status Dots) */}
      <section
        aria-label="خلاصه آمار کاتالوگ"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-card p-4 shadow-sm backdrop-blur-md">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">کل محصولات کاتالوگ</p>
            <div className="flex items-baseline gap-1.5">
              <p className="text-2xl font-bold tabular-nums text-foreground">
                {counts.all.toLocaleString('fa-IR')}
              </p>
              {plan && (
                <span className="text-xs font-semibold tabular-nums text-muted-foreground">
                  از {plan.productsLimit.toLocaleString('fa-IR')} سقف
                </span>
              )}
            </div>
          </div>
          <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Layers className="size-5" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-card p-4 shadow-sm backdrop-blur-md">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">تحلیل شده در ترب/اسنپ</p>
            <p className="text-2xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
              {counts.matched.toLocaleString('fa-IR')}
            </p>
          </div>
          <div className="size-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <CheckCircle2 className="size-5" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-card p-4 shadow-sm backdrop-blur-md">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">گران‌تر از ارزان‌ترین رقیب</p>
            <p className="text-2xl font-bold tabular-nums text-amber-600 dark:text-amber-400">
              {counts.above_rivals.toLocaleString('fa-IR')}
            </p>
          </div>
          <div className="size-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
            <AlertTriangle className="size-5" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-card p-4 shadow-sm backdrop-blur-md">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">نیازمند اقدام / منقضی</p>
            <p className="text-2xl font-bold tabular-nums text-blue-600 dark:text-blue-400">
              {(counts.needs_confirm + counts.stale + counts.finding).toLocaleString('fa-IR')}
            </p>
          </div>
          <div className="size-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
            <Clock className="size-5" />
          </div>
        </div>
      </section>

      {/* Unified Segmented Control Filter Bar */}
      <div
        className="flex overflow-x-auto gap-1 rounded-2xl border border-border bg-card p-1 shadow-xs"
        role="toolbar"
        aria-label="فیلتر وضعیت کاتالوگ"
      >
        {[
          { key: 'all', label: 'همه محصولات', count: counts.all },
          { key: 'above_rivals', label: 'گران‌تر از رقیب', count: counts.above_rivals },
          { key: 'needs_confirm', label: 'نیاز به تأیید', count: counts.needs_confirm },
          { key: 'stale', label: 'منقضی', count: counts.stale },
          { key: 'finding', label: 'در حال یافتن', count: counts.finding },
          { key: 'cannot_match', label: 'بدون رقابت سودآور', count: counts.cannot_match },
        ].map((tab) => {
          const isActive = filter === tab.key
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key as StatusFilter)}
              className={cn(
                'flex h-9 items-center gap-2 whitespace-nowrap rounded-xl px-3.5 text-xs font-medium transition-all',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
              )}
            >
              <span>{tab.label}</span>
              <span
                className={cn(
                  'rounded-md px-1.5 py-0.5 text-[10px] tabular-nums font-semibold',
                  isActive
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {tab.count.toLocaleString('fa-IR')}
              </span>
            </button>
          )
        })}
      </div>

      {/* Main Catalog Data Table Section */}
      <section
        aria-labelledby="catalog-heading"
        className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
      >
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          <h2
            id="catalog-heading"
            className="text-base font-semibold text-foreground flex items-center gap-2"
          >
            <PackageSearch className="size-4 text-primary" />
            لیست محصولات و وضعیت رقبا
          </h2>
          <span className="text-xs font-medium tabular-nums text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-lg">
            نمایش {filtered.length.toLocaleString('fa-IR')} محصول
          </span>
        </div>

        {isLoading ? (
          <div className="space-y-0 divide-y divide-border p-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="flex gap-4 py-4">
                <Skeleton className="size-12 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="border-t border-destructive/20 bg-destructive/5 p-6 text-center text-sm text-destructive">
            خطا در دریافت لیست محصولات. لطفاً صفحه را تازه کنید.
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <PackageSearch className="mx-auto size-10 text-muted-foreground/40" />
            <p className="mt-3 text-sm font-semibold text-foreground">
              هیچ محصولی مطابق با جستجو پیدا نشد
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              عبارت جستجو یا فیلتر انتخابی را تغییر دهید.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setFilter('all')
                setSearchQuery('')
              }}
              className="mt-4 rounded-xl text-xs font-medium"
            >
              پاک کردن فیلترها
            </Button>
          </div>
        ) : (
          <>
            {/* Mobile View Cards */}
            <div className="lg:hidden">
              {filtered.map((row) => (
                <ProductMobileCard
                  key={row.id}
                  row={row}
                  onConfirm={handleConfirm}
                  busyId={busyId}
                  feedback={feedback}
                  onApplyPrice={handleApplyPrice}
                  onApplyCustomPrice={handleApplyCustomPrice}
                  onOpenDetail={handleOpenDetail}
                  isSelected={selectedIds.has(row.id)}
                  onToggleSelect={() => handleToggleSelect(row.id)}
                />
              ))}
            </div>

            {/* Desktop Table Layout */}
            <div className="hidden overflow-x-auto lg:block">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border bg-muted/40 hover:bg-transparent">
                    <TableHead className="w-12 h-11 px-4 text-center">
                      <Checkbox
                        checked={isAllSelected}
                        indeterminate={isSomeSelected}
                        onCheckedChange={handleToggleSelectAll}
                        aria-label="انتخاب همه محصولات"
                      />
                    </TableHead>
                    <TableHead className="h-11 font-semibold text-xs text-foreground text-start">
                      عنوان محصول
                    </TableHead>
                    <TableHead className="h-11 font-semibold text-xs text-foreground text-start">
                      قیمت فروشگاه
                    </TableHead>
                    <TableHead className="h-11 font-semibold text-xs text-foreground text-start">
                      کف هزینه
                    </TableHead>
                    <TableHead className="h-11 font-semibold text-xs text-primary text-start min-w-[18rem]">
                      تحلیل و مقایسه با رقیب
                    </TableHead>
                    <TableHead className="h-11 font-semibold text-xs text-foreground text-start w-60">
                      پیشنهاد هوشمند و اقدام
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((row) => (
                    <TableRow
                      key={row.id}
                      className={cn(
                        'border-b border-border/70 last:border-b-0 hover:bg-muted/30 transition-colors',
                        selectedIds.has(row.id) && 'bg-primary/5 hover:bg-primary/10'
                      )}
                    >
                      {/* Selection Checkbox */}
                      <TableCell className="align-middle px-4 py-4 w-12 text-center">
                        <Checkbox
                          checked={selectedIds.has(row.id)}
                          onCheckedChange={() => handleToggleSelect(row.id)}
                          aria-label={`انتخاب ${row.name}`}
                        />
                      </TableCell>

                      {/* Product Avatar & Info */}
                      <TableCell
                        className="align-middle py-4 cursor-pointer group"
                        onClick={() => handleOpenDetail(row.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="size-11 rounded-xl bg-muted/80 flex items-center justify-center border border-border shrink-0 group-hover:border-primary/50 transition-colors">
                            <PackageSearch className="size-5 text-muted-foreground/70 group-hover:text-primary transition-colors" />
                          </div>
                          <div className="min-w-0 space-y-1">
                            <div className="font-semibold text-sm leading-snug text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                              {row.name}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-muted-foreground font-mono" dir="ltr">
                                {row.sku}
                              </span>
                              {statusBadge(row.rivalStatus)}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Store Price */}
                      <TableCell className="align-middle py-4 whitespace-nowrap">
                        <span className="font-bold text-sm tabular-nums text-foreground">
                          {formatToman(row.storePrice)}
                        </span>
                      </TableCell>

                      {/* Cost Floor */}
                      <TableCell className="align-middle py-4 whitespace-nowrap">
                        <span className="text-xs font-semibold tabular-nums text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-lg">
                          {formatToman(row.costFloor)}
                        </span>
                      </TableCell>

                      {/* Rival Comparison Strip */}
                      <TableCell
                        className="align-middle py-4 cursor-pointer"
                        onClick={() => handleOpenDetail(row.id)}
                        title="جهت مشاهده جزئیات کلیک کنید"
                      >
                        {row.rivalStatus === 'finding' ? (
                          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Radio className="size-3.5 animate-pulse text-primary" />
                            در حال بررسی رقبا…
                          </p>
                        ) : row.rivalStatus === 'cannot_match' ? (
                          <p className="text-xs text-muted-foreground">
                            رقیب سودآور پیدا نشد
                          </p>
                        ) : row.rivalStatus === 'needs_confirm' ? (
                          <ConfirmAction
                            row={row}
                            onConfirm={handleConfirm}
                            busy={busyId === row.id}
                            message={feedback[row.id] ?? null}
                          />
                        ) : (
                          <div className="hover:opacity-90 transition-opacity">
                            <RivalCompare
                              storePrice={row.storePrice}
                              rivalCheapest={row.rivalCheapest}
                              vsStorePct={row.vsStorePct}
                              source={row.rivalSource}
                              rivalCount={row.rivalCount}
                              status={row.rivalStatus}
                            />
                          </div>
                        )}
                      </TableCell>

                      {/* Price Recommendation & Apply Action */}
                      <TableCell className="align-middle py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-muted-foreground">پیشنهاد:</span>
                            <span className="text-xs font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                              {formatToman(row.recommendedPrice)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => handleApplyPrice(row)}
                              className="h-7 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-[11px] rounded-lg shadow-xs"
                            >
                              اعمال قیمت
                            </Button>
                            <PriceOverridePopover
                              product={row}
                              onApply={handleApplyCustomPrice}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenDetail(row.id)}
                              className="h-7 px-2 border-border text-[11px] rounded-lg text-muted-foreground hover:text-foreground"
                              title="مشاهده تحلیل کامل و لیست رقبا"
                            >
                              <Eye className="size-3.5" />
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </section>

      {/* Deep-Dive Product & Rival Detail Drawer */}
      <ProductRivalDetailSheet
        productId={selectedProductId}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onPriceApplied={(updated) => {
          mutate(
            (current) => {
              if (!current) return current
              return {
                data: current.data.map((p) => (p.id === updated.id ? updated : p)),
              }
            },
            { revalidate: false }
          )
        }}
        onRivalUpdated={(updated) => {
          mutate(
            (current) => {
              if (!current) return current
              return {
                data: current.data.map((p) => (p.id === updated.id ? updated : p)),
              }
            },
            { revalidate: false }
          )
        }}
      />
      {/* Floating Bulk Action Toolbar */}
      <BulkActionToolbar
        selectedCount={selectedIds.size}
        totalCount={products.length}
        onClearSelection={() => setSelectedIds(new Set())}
        onBatchApply={handleBatchApply}
        onBatchRefresh={handleBatchRefresh}
        isApplying={isBatchApplying}
        isRefreshing={isBatchRefreshing}
      />

      {/* Plan Upgrade Dialog */}
      <PlanUpgradeDialog open={upgradeOpen} onOpenChange={setUpgradeOpen} />
    </div>
  )
}
