import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  guidanceStatusChipClass,
  guidanceStatusChipLabel,
  guidanceStatusHint,
  isGuidanceRequestStatus,
} from '@/lib/guidance-status'

type GuidanceStatusChipProps = {
  status: string
  showHint?: boolean
  className?: string
}

export function GuidanceStatusChip({
  status,
  showHint = false,
  className,
}: GuidanceStatusChipProps) {
  const known = isGuidanceRequestStatus(status)
  const label = known ? guidanceStatusChipLabel[status] : status
  const chipClass = known
    ? guidanceStatusChipClass[status]
    : 'border-transparent bg-muted text-muted-foreground'
  const hint = known ? guidanceStatusHint[status] : undefined

  return (
    <div className={cn('flex flex-col gap-1 items-start', className)}>
      <Badge
        variant="outline"
        className={cn('rounded-sm h-auto py-0.5 font-medium', chipClass)}
      >
        {label}
      </Badge>
      {showHint && hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  )
}
