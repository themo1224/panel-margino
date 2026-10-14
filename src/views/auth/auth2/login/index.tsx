import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  AuthAlert,
  AuthField,
  AuthShell,
  authButtonClassName,
  authInputClassName,
} from '@/components/auth/AuthShell'
import { login, logout } from '@/api/auth'
import { setStoredToken } from '@/api/client'
import { useAuth } from '@/context/auth-context'

const BoxedLogin = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { setSession, clearSession } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const adminBlocked = Boolean(
    (location.state as { adminBlocked?: boolean } | null)?.adminBlocked
  )

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const result = await login(email, password)

      if (result.user.role === 'admin') {
        try {
          setStoredToken(result.token)
          await logout()
        } catch {
          // ignore
        }
        clearSession()
        setError('مدیران باید از پنل مدیریت وارد شوند.')
        return
      }

      setSession(result)
      navigate('/', { replace: true })
    } catch (err) {
      const status = (err as { status?: number })?.status
      if (status === 422) {
        setError('ایمیل یا رمز عبور نادرست است.')
      } else {
        setError('ورود ناموفق بود. دوباره تلاش کنید.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthShell
      title="ورود به حساب"
      description={
        <>
          ایمیل و رمز عبور، یا{' '}
          <Link
            to="/auth/auth2/two-steps"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            ورود با کد پیامکی
          </Link>
        </>
      }
      footer={
        <>
          <span>تازه‌وارد هستید؟</span>
          <Link
            to="/auth/auth2/register"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            ایجاد حساب فروشنده
          </Link>
        </>
      }
    >
      {(adminBlocked || error) && (
        <AuthAlert>
          {error ?? 'مدیران باید از پنل مدیریت وارد شوند.'}
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

        <AuthField label="رمز عبور" htmlFor="password">
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            dir="ltr"
            className={authInputClassName}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </AuthField>

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2.5">
            <Checkbox id="remember" className="size-5 cursor-pointer" />
            <label
              htmlFor="remember"
              className="cursor-pointer text-sm text-muted-foreground"
            >
              این دستگاه را به خاطر بسپار
            </label>
          </div>
          <Link
            to="/auth/auth2/forgot-password"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            فراموشی رمز؟
          </Link>
        </div>

        <Button
          size="lg"
          className={authButtonClassName}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'در حال ورود...' : 'ورود'}
        </Button>
      </form>
    </AuthShell>
  )
}

export default BoxedLogin
