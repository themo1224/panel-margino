export type GuidanceRequestStatus =
  | 'submitted'
  | 'assigned'
  | 'accepted'

export const guidanceStatusChipLabel: Record<GuidanceRequestStatus, string> = {
  submitted: 'در انتظار تخصیص',
  assigned: 'اختصاص‌یافته',
  accepted: 'تأیید شده',
}

export const guidanceStatusHint: Partial<
  Record<GuidanceRequestStatus, string>
> = {
  assigned: 'در انتظار پذیرش منتور',
  accepted: 'زمان و لینک جلسه آماده است',
}

export function isGuidanceRequestStatus(
  value: string
): value is GuidanceRequestStatus {
  return value === 'submitted' || value === 'assigned' || value === 'accepted'
}

/** Soft chip classes aligned with docs/DESIGN-SYSTEM.md status chips. */
export const guidanceStatusChipClass: Record<GuidanceRequestStatus, string> = {
  submitted: 'border-transparent bg-[#FBF3E6] text-[#A3640E]',
  assigned: 'border-transparent bg-[#E6F2F5] text-[#0F4C5C]',
  accepted: 'border-transparent bg-[color-mix(in_oklab,var(--success)_18%,white)] text-[var(--success)]',
}
