import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CheckCircle2, RefreshCw, X, Sparkles, AlertCircle } from 'lucide-react'

interface BulkActionToolbarProps {
  selectedCount: number
  totalCount: number
  onClearSelection: () => void
  onBatchApply: () => Promise<void> | void
  onBatchRefresh: () => Promise<void> | void
  isApplying?: boolean
  isRefreshing?: boolean
}

export function BulkActionToolbar({
  selectedCount,
  onClearSelection,
  onBatchApply,
  onBatchRefresh,
  isApplying = false,
  isRefreshing = false,
}: BulkActionToolbarProps) {
  const [confirmOpen, setConfirmOpen] = useState(false)

  if (selectedCount === 0) return null

  async function handleConfirmApply() {
    try {
      await onBatchApply()
      setConfirmOpen(false)
    } catch {
      // Error handling is handled in caller with toast
    }
  }

  return (
    <>
      <div
        role="region"
        aria-label="عملیات گروهی"
        className="fixed bottom-6 start-4 end-4 md:start-1/2 md:end-auto md:-translate-x-1/2 z-40 max-w-2xl md:w-auto animate-in fade-in slide-in-from-bottom-5 duration-200"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary/20 bg-card/95 p-3 shadow-2xl backdrop-blur-xl sm:px-5 sm:py-3 dark:border-primary/30 dark:bg-card/90">
          {/* Selected Count Badge */}
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary tabular-nums">
              {selectedCount.toLocaleString('fa-IR')}
            </span>
            <span className="text-xs font-medium text-foreground whitespace-nowrap">
              محصول انتخاب شده
            </span>
          </div>

          <div className="h-4 w-px bg-border hidden sm:block" />

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap ms-auto">
            {/* Batch Apply Trigger */}
            <Button
              type="button"
              size="sm"
              disabled={isApplying || isRefreshing}
              onClick={() => setConfirmOpen(true)}
              className="h-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold gap-1.5 shadow-xs"
            >
              <Sparkles className="size-3.5" />
              <span>اعمال قیمت پیشنهادی</span>
            </Button>

            {/* Batch Refresh Rivals */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isApplying || isRefreshing}
              onClick={onBatchRefresh}
              className="h-8 rounded-xl border-border text-xs gap-1.5 hover:bg-muted"
            >
              <RefreshCw
                className={`size-3.5 text-muted-foreground ${isRefreshing ? 'animate-spin text-primary' : ''}`}
              />
              <span className="hidden xs:inline">استعلام ترب</span>
              <span className="xs:hidden">استعلام</span>
            </Button>

            {/* Clear Selection */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isApplying || isRefreshing}
              onClick={onClearSelection}
              className="h-8 rounded-xl px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted"
              title="لغو انتخاب محصولات"
              aria-label="لغو انتخاب محصولات"
            >
              <X className="size-3.5" />
              <span className="sr-only sm:not-sr-only sm:ms-1">لغو</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog for Batch Apply */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader className="gap-2">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-5" />
              <DialogTitle className="text-base font-bold text-foreground">
                اعمال گروهی قیمت‌های پیشنهادی
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs leading-5 text-muted-foreground">
              آیا از اعمال قیمت هوشمند برای{' '}
              <strong className="text-foreground font-semibold">
                {selectedCount.toLocaleString('fa-IR')} محصول انتخاب شده
              </strong>{' '}
              اطمینان دارید؟
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3 text-xs text-foreground/80 space-y-1.5">
            <div className="flex items-center gap-1.5 font-medium text-blue-600 dark:text-blue-400">
              <AlertCircle className="size-3.5" />
              <span>نحوه اعمال تغییرات:</span>
            </div>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              قیمت جدید تمام این محصولات بلافاصله در فروشگاه ووکامرس شما ثبت می‌شود. تمامی قیمت‌های پیشنهادی بالاتر از کف هزینه امن محاسبه شده‌اند.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-2 pt-2">
            <Button
              type="button"
              disabled={isApplying}
              onClick={handleConfirmApply}
              className="h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold gap-1.5"
            >
              {isApplying ? (
                <span>در حال اعمال تغییرات...</span>
              ) : (
                <>
                  <CheckCircle2 className="size-3.5" />
                  <span>تأیید و اعمال در ووکامرس</span>
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isApplying}
              onClick={() => setConfirmOpen(false)}
              className="h-9 rounded-xl text-xs"
            >
              انصراف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
