import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  AuthAlert,
  AuthField,
  AuthShell,
  authButtonClassName,
  authInputClassName,
} from '@/components/auth/AuthShell'

const BoxedForgotpwd = () => {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    // Phase 1: UI-only reset request (no backend endpoint yet)
    setSent(true)
  }

  return (
    <AuthShell
      title="بازنشانی رمز عبور"
      description="ایمیل مرتبط با حساب خود را وارد کنید تا لینک بازنشانی برایتان ارسال شود."
      footer={
        <Link
          to="/auth/auth2/login"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          بازگشت به ورود
        </Link>
      }
    >
      {sent && (
        <AuthAlert tone="info">
          اگر این ایمیل در سیستم باشد، لینک بازنشانی به‌زودی ارسال می‌شود.
        </AuthAlert>
      )}

      <form className="space-y-5" onSubmit={onSubmit} noValidate>
        <AuthField label="ایمیل" htmlFor="email">
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="seller@pricing.local"
            dir="ltr"
            className={`${authInputClassName} text-start`}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </AuthField>

        <Button size="lg" className={authButtonClassName} type="submit">
          ارسال لینک بازنشانی
        </Button>

        <Button
          type="button"
          variant="outline"
          className={`${authButtonClassName} border-border/80 bg-background/60`}
          render={<Link to="/auth/auth2/login" />}
        >
          بازگشت به ورود
        </Button>
      </form>
    </AuthShell>
  )
}

export default BoxedForgotpwd
