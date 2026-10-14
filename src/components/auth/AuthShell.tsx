import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { ChartNoAxesCombined, ShieldCheck, Store } from 'lucide-react'
import { cn } from '@/lib/utils'

const brandPoints = [
  {
    icon: ChartNoAxesCombined,
    title: 'تحلیل رقبا',
    body: 'ارزان‌ترین، میانه و وضعیت تطبیق — نه فقط یک عدد.',
  },
  {
    icon: Store,
    title: 'هزینه تا پیشنهاد',
    body: 'کف هزینه و قیمت امن را برای هر محصول ببینید.',
  },
  {
    icon: ShieldCheck,
    title: 'هشدار به‌موقع',
    body: 'بالاتر از رقبا، زیر کف هزینه، یا داده کهنه.',
  },
] as const

function PricingMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('size-8 shrink-0', className)}
      aria-hidden
    >
      <rect width="32" height="32" rx="9" fill="currentColor" />
      <path
        d="M9.2 20.4c-.55-1.9.5-3.9 2.4-4.45l6.2-1.8c.55 1.9-.5 3.9-2.4 4.45l-6.2 1.8Z"
        fill="#FFD786"
      />
      <path
        d="M7.6 24.1c-.28-.95.27-1.95 1.22-2.23l7.9-2.28c.55 1.9-.55 3.9-2.45 4.45l-4.45 1.28c-.95.28-1.95-.27-2.22-1.22Z"
        fill="#FFAA00"
      />
    </svg>
  )
}

type AuthShellProps = {
  title: string
  description?: ReactNode
  children: ReactNode
  footer?: ReactNode
  className?: string
}

export function AuthShell({
  title,
  description,
  children,
  footer,
  className,
}: AuthShellProps) {
  return (
    <div
      className={cn(
        'auth-shell relative min-h-dvh overflow-hidden bg-[oklch(0.97_0.012_145)] text-foreground',
        className
      )}
    >
      {/* Atmosphere — brand greens + soft gold, full-bleed */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_100%_0%,oklch(0.487_0.134_143.9_/_0.14),transparent_55%),radial-gradient(90%_70%_at_0%_100%,oklch(0.802_0.171_73.3_/_0.12),transparent_50%),linear-gradient(165deg,oklch(0.985_0.01_145),oklch(0.96_0.02_150)_45%,oklch(0.94_0.03_145))]" />
        <div className="auth-shell-grid absolute inset-0 opacity-[0.35]" />
        <div className="absolute -start-24 top-1/4 size-72 rounded-full bg-[oklch(0.487_0.134_143.9_/_0.08)] blur-3xl" />
        <div className="absolute -end-16 bottom-0 size-80 rounded-full bg-[oklch(0.896_0.109_84_/_0.25)] blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-6xl flex-col lg:flex-row lg:items-stretch">
        {/* Brand — leading side in RTL */}
        <aside className="auth-shell-brand relative hidden flex-col justify-between px-10 py-12 text-primary-foreground lg:flex lg:w-[42%] lg:shrink-0 lg:rounded-e-[2rem] lg:my-6 lg:ms-6 lg:overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(160deg,#1a5a1e_0%,#237227_42%,#2f8a35_78%,#519A66_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_20%_10%,oklch(0.802_0.171_73.3_/_0.22),transparent_55%)]" />
          <div className="absolute -end-10 -bottom-10 size-56 rounded-full border border-white/10" />
          <div className="absolute -end-2 bottom-8 size-40 rounded-full border border-[#FFD786]/25" />

          <div className="relative flex flex-col gap-8">
            <Link
              to="/auth/auth2/login"
              className="inline-flex items-center gap-3 self-start transition-opacity hover:opacity-90"
            >
              <PricingMark className="size-10 text-white" />
              <span className="text-3xl font-semibold tracking-tight text-white">
                Pricing
              </span>
            </Link>

            <div className="max-w-sm space-y-3">
              <p className="text-2xl font-semibold leading-snug tracking-tight text-white">
                پنل فروشنده برای قیمت‌گذاری هوشمند
              </p>
              <p className="text-sm leading-7 text-white/75">
                هزینه، تحلیل رقبا و پیشنهاد قیمت امن — یکجا، به فارسی.
              </p>
              <div
                className="h-0.5 w-16 rounded-full bg-[#FFAA00]"
                aria-hidden
              />
            </div>
          </div>

          <ul className="relative mt-10 flex flex-col gap-5">
            {brandPoints.map(({ icon: Icon, title: pointTitle, body }) => (
              <li key={pointTitle} className="flex gap-3">
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#FFD786] ring-1 ring-white/15">
                  <Icon className="size-4" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-medium text-white">{pointTitle}</p>
                  <p className="mt-0.5 text-xs leading-6 text-white/65">{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </aside>

        {/* Form column */}
        <main className="flex flex-1 flex-col justify-center px-4 py-10 sm:px-8 lg:px-12 lg:py-12">
          <div className="auth-shell-panel mx-auto w-full max-w-[26rem]">
            {/* Mobile brand */}
            <div className="mb-8 flex flex-col items-center gap-3 lg:hidden">
              <Link
                to="/auth/auth2/login"
                className="inline-flex items-center gap-2.5"
              >
                <PricingMark className="text-primary size-9" />
                <span className="text-2xl font-semibold tracking-tight text-foreground">
                  Pricing
                </span>
              </Link>
              <p className="text-center text-sm text-muted-foreground">
                پنل فروشنده · هزینه و رقبا
              </p>
            </div>

            <header className="mb-7 space-y-2 text-center lg:text-start">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[1.65rem]">
                {title}
              </h1>
              {description ? (
                <div className="text-sm leading-7 text-muted-foreground">
                  {description}
                </div>
              ) : null}
            </header>

            <div className="auth-shell-form space-y-6">{children}</div>

            {footer ? (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-muted-foreground lg:justify-start">
                {footer}
              </div>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  )
}

export function AuthField({
  label,
  htmlFor,
  children,
  hint,
}: {
  label: string
  htmlFor: string
  children: ReactNode
  hint?: string
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-foreground"
      >
        {label}
      </label>
      {children}
      {hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  )
}

export function AuthAlert({
  tone = 'error',
  children,
}: {
  tone?: 'error' | 'info'
  children: ReactNode
}) {
  return (
    <p
      role="alert"
      className={cn(
        'rounded-xl px-3.5 py-2.5 text-sm leading-6',
        tone === 'error'
          ? 'bg-destructive/8 text-destructive ring-1 ring-destructive/15'
          : 'bg-[var(--primary-soft)] text-primary ring-1 ring-primary/15'
      )}
    >
      {children}
    </p>
  )
}

/**
 * Shared auth field styles — ≥44px hit target, solid fill + visible border
 * so controls stay readable on the soft green/gold atmosphere.
 */
export const authInputClassName =
  'h-11 rounded-xl border border-primary/30 bg-card px-3.5 text-base text-foreground shadow-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/25 md:text-sm'

/** OTP digit cells — same affordance as text fields */
export const authOtpSlotClassName =
  'size-11 flex-1 rounded-xl border border-primary/30 bg-card text-base shadow-none data-[active=true]:border-primary data-[active=true]:ring-3 data-[active=true]:ring-primary/25'

export const authButtonClassName =
  'h-11 w-full rounded-xl bg-primary text-sm font-medium text-primary-foreground shadow-none transition-[transform,opacity] hover:bg-primary/90 active:scale-[0.99]'
