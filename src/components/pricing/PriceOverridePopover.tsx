import { useState, useId } from 'react'
import type { ProductRivalRow } from '@/types/apps/pricing'
import { formatToman } from '@/api/pricing/pricing-data'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlertTriangle, Check, Edit2, RotateCcw, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PriceOverridePopoverProps {
  product: ProductRivalRow
  onApply: (product: ProductRivalRow, customPrice: number) => Promise<void> | void
  align?: 'start' | 'center' | 'end'
}

export function PriceOverridePopover({
  product,
  onApply,
  align = 'end',
}: PriceOverridePopoverProps) {
  const [open, setOpen] = useState(false)
  const [priceInput, setPriceInput] = useState<string>(
    String(product.recommendedPrice ?? product.storePrice)
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const inputId = useId()

  const currentPrice = Number(priceInput) || 0
  const isBelowFloor = currentPrice > 0 && currentPrice < product.costFloor
  const isChanged = currentPrice !== product.recommendedPrice

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setPriceInput(String(product.recommendedPrice ?? product.storePrice))
    }
    setOpen(nextOpen)
  }

  function handleRoundTo50k() {
    if (currentPrice <= 0) return
    const rounded = Math.round(currentPrice / 50000) * 50000
    setPriceInput(String(rounded))
  }

  function handleDecrease1Percent() {
    if (currentPrice <= 0) return
    const decreased = Math.round((currentPrice * 0.99) / 1000) * 1000
    setPriceInput(String(decreased))
  }

  function handleReset() {
    setPriceInput(String(product.recommendedPrice ?? product.storePrice))
  }

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault()
    if (currentPrice <= 0 || isSubmitting) return

    try {
      setIsSubmitting(true)
      await onApply(product, currentPrice)
      setOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        type="button"
        className="size-7 inline-flex items-center justify-center p-0 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
        title="ویرایش دستی قیمت پیشنهادی"
        aria-label={`ویرایش دستی قیمت پیشنهادی برای ${product.name}`}
      >
        <Edit2 className="size-3.5" />
      </PopoverTrigger>

      <PopoverContent
        align={align}
        side="bottom"
        sideOffset={6}
        className="w-80 p-4 rounded-2xl border-border bg-card/95 backdrop-blur-md shadow-xl text-foreground"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {/* Header */}
          <div className="border-b border-border/70 pb-2.5">
            <h4 className="text-xs font-bold text-foreground">
              تنظیم دستی قیمت پیشنهادی
            </h4>
            <p className="mt-0.5 text-[11px] text-muted-foreground line-clamp-1">
              {product.name}
            </p>
          </div>

          {/* Reference stats (Recommended & Floor) */}
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted/40 p-2 text-xs">
            <div>
              <span className="text-[10px] text-muted-foreground block">پیشنهاد هوشمند:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {formatToman(product.recommendedPrice)}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground block">کف هزینه امن:</span>
              <span className="font-semibold text-foreground/80 tabular-nums">
                {formatToman(product.costFloor)}
              </span>
            </div>
          </div>

          {/* Price Input */}
          <div className="space-y-1.5">
            <label htmlFor={inputId} className="text-[11px] font-medium text-foreground block">
              قیمت جدید (تومان):
            </label>
            <div className="relative">
              <Input
                id={inputId}
                type="number"
                step="1000"
                min="0"
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                placeholder="مبلغ به تومان..."
                className={cn(
                  'h-9 pe-12 ps-3 text-xs font-semibold tabular-nums rounded-xl bg-background',
                  isBelowFloor && 'border-amber-500 focus-visible:ring-amber-500/30'
                )}
                autoFocus
              />
              <span className="absolute end-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground pointer-events-none">
                تومان
              </span>
            </div>
          </div>

          {/* Warning if below floor */}
          {isBelowFloor && (
            <div
              role="alert"
              className="flex items-start gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-2 text-[11px] text-amber-700 dark:text-amber-400"
            >
              <AlertTriangle className="size-3.5 shrink-0 mt-0.5 text-amber-500" />
              <span>
                توجه: این مبلغ کمتر از کف هزینه ({formatToman(product.costFloor)}) است و ممکن است حاشیه سود منفی شود!
              </span>
            </div>
          )}

          {/* Quick Rounding Helpers */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <button
              type="button"
              onClick={handleRoundTo50k}
              className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2 py-1 text-[10px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <span>گرد کردن به ۵۰,۰۰۰</span>
            </button>
            <button
              type="button"
              onClick={handleDecrease1Percent}
              className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2 py-1 text-[10px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <TrendingDown className="size-3" />
              <span>کاهش ۱٪</span>
            </button>
            {isChanged && (
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1 rounded-lg border border-transparent px-1.5 py-1 text-[10px] text-primary hover:underline transition-colors ms-auto"
              >
                <RotateCcw className="size-3" />
                <span>بازنشانی</span>
              </button>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center gap-2 pt-2 border-t border-border/70">
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || currentPrice <= 0}
              className="flex-1 h-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold gap-1.5 shadow-xs"
            >
              {isSubmitting ? (
                <span>در حال اعمال...</span>
              ) : (
                <>
                  <Check className="size-3.5" />
                  <span>ثبت و اعمال در ووکامرس</span>
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
              className="h-8 rounded-xl px-2.5 text-xs text-muted-foreground"
            >
              انصراف
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  )
}
