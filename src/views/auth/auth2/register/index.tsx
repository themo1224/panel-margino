import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  AuthAlert,
  AuthField,
  AuthShell,
  authButtonClassName,
  authInputClassName,
} from '@/components/auth/AuthShell'
import { register } from '@/api/auth'
import { useAuth } from '@/context/auth-context'

const BoxedRegister = () => {
  const navigate = useNavigate()
  const { setSession } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const result = await register({
        name,
        email,
        password,
        password_confirmation: password,
      })
      setSession(result)
      navigate('/', { replace: true })
    } catch (err) {
      const status = (err as { status?: number })?.status
      const body = (err as { body?: { errors?: Record<string, string[]> } })
        ?.body
      if (status === 422 && body?.errors?.email) {
        setError('این ایمیل قبلاً ثبت شده است.')
      } else if (status === 422) {
        setError('اطلاعات وارد شده معتبر نیست.')
      } else {
        setError('ثبت‌نام ناموفق بود. دوباره تلاش کنید.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthShell
      title="ایجاد حساب فروشنده"
      description="وارد Pricing شوید و هزینه و رقبا را یکجا ببینید."
      footer={
        <>
          <span>قبلاً حساب دارید؟</span>
          <Link
            to="/auth/auth2/login"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            ورود
          </Link>
        </>
      }
    >
      {error && <AuthAlert>{error}</AuthAlert>}

      <form className="space-y-5" onSubmit={onSubmit} noValidate>
        <AuthField label="نام" htmlFor="name">
          <Input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="نام فروشگاه یا شما"
            className={authInputClassName}
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </AuthField>

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

        <AuthField
          label="رمز عبور"
          htmlFor="password"
          hint="حداقل ۸ کاراکتر"
        >
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            dir="ltr"
            className={authInputClassName}
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </AuthField>

        <Button
          size="lg"
          className={authButtonClassName}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
        </Button>
      </form>
    </AuthShell>
  )
}

export default BoxedRegister
