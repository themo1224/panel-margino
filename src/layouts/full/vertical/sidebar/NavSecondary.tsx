import { Camera, Rocket } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

/** Seller plan + coming-soon chips (Instagram / public API per STRATEGY). */
export function NavSecondary() {
  return (
    <div className="-mx-4 border-t border-b border-sidebar-border px-5 py-5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Rocket className="size-5 shrink-0 text-primary" />
              <span className="font-medium text-base leading-6 text-sidebar-foreground">
                طرح پایه
              </span>
            </div>
            <span className="font-medium text-base leading-6 text-sidebar-foreground">
              ۱۲۴ محصول
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-sidebar-foreground/10 overflow-hidden">
            <div className="h-full w-[62%] bg-primary rounded-full" />
          </div>
          <p className="text-sm font-normal leading-5 text-sidebar-foreground/60 text-center">
            رقبا برای ۱۲۴ محصول تحلیل شده‌اند
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          <Badge
            variant="secondary"
            className="gap-1 bg-[var(--accent-soft)] text-accent-foreground border-0"
          >
            <Camera className="size-3.5" />
            اینستاگرام — به‌زودی
          </Badge>
          <Badge
            variant="outline"
            className="border-sidebar-border text-sidebar-foreground/70"
          >
            API عمومی — به‌زودی
          </Badge>
        </div>
      </div>
    </div>
  )
}
