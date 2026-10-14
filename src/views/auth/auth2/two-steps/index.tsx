import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { Field, FieldGroup } from '@/components/ui/field'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  AuthAlert,
  AuthField,
  AuthShell,
  authButtonClassName,
  authInputClassName,
  authOtpSlotClassName,
} from '@/components/auth/AuthShell'
import { requestOtp, verifyOtp } from '@/api/auth'
import { useAuth } from '@/context/auth-context'

type Step = 'phone' | 'code'

const BoxedTwoStep = () => {
  const navigate = useNavigate()
  const { setSession } = useAuth()
  const [step, setStep] = useState<Step>('phone')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const maskedPhone = useMemo(() => {
    if (phone.length < 4) return phone
    return `${'*'.repeat(Math.max(0, phone.length - 4))}${phone.slice(-4)}`
  }, [phone])

  async function sendOtp() {
    setError(null)
    setInfo(null)
    setIsLoading(true)
    try {
      await requestOtp(phone)
      setStep('code')
      setInfo('کد تأیید ارسال شد. در محیط محلی کد را در لاگ سرور ببینید.')
    } catch (err) {
      const status = (err as { status?: number })?.status
      if (status === 429) {
        setError('لطفاً کمی صبر کنید و دوباره درخواست دهید.')
      } else if (status === 422) {
        setError('شماره موبایل معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹).')
      } else {
        setError('ارسال کد ناموفق بود.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  async function onRequestSubmit(e: FormEvent) {
    e.preventDefault()
    await sendOtp()
  }

  async function onVerifySubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      const result = await verifyOtp(phone, code)
      if (result.user.role === 'admin') {
        setError('مدیران باید از پنل مدیریت وارد شوند.')
        return
      }
      setSession(result)
      navigate('/', { replace: true })
    } catch (err) {
      const status = (err as { status?: number })?.status
      if (status === 422) {
        setError('کد نامعتبر یا منقضی است.')
      } else {
        setError('تأیید کد ناموفق بود.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthShell
      title="ورود با پیامک"
      description={
        step === 'phone'
          ? 'شماره موبایل خود را وارد کنید تا کد تأیید ارسال شود.'
          : (
              <>
                کد ۶ رقمی ارسال‌شده به{' '}
                <span className="font-medium text-foreground" dir="ltr">
                  {maskedPhone}
                </span>{' '}
                را وارد کنید.
              </>
            )
      }
      footer={
        step === 'code' ? (
          <>
            <span>کد را دریافت نکردید؟</span>
            <button
              type="button"
              className="font-medium text-primary underline-offset-4 hover:underline disabled:opacity-50"
              disabled={isLoading}
              onClick={() => void sendOtp()}
            >
              ارسال مجدد
            </button>
          </>
        ) : (
          <>
            <span>ورود با ایمیل؟</span>
            <Link
              to="/auth/auth2/login"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              بازگشت
            </Link>
          </>
        )
      }
    >
      {error && <AuthAlert>{error}</AuthAlert>}
      {info && <AuthAlert tone="info">{info}</AuthAlert>}

      {step === 'phone' ? (
        <form className="space-y-5" onSubmit={onRequestSubmit} noValidate>
          <AuthField
            label="شماره موبایل"
            htmlFor="phone"
            hint="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
          >
            <Input
              id="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="09123456789"
              dir="ltr"
              className={`${authInputClassName} text-start tracking-wide`}
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </AuthField>
          <Button
            type="submit"
            size="lg"
            className={authButtonClassName}
            disabled={isLoading}
          >
            {isLoading ? 'در حال ارسال...' : 'ارسال کد'}
          </Button>
        </form>
      ) : (
        <form className="space-y-5" onSubmit={onVerifySubmit} noValidate>
          <FieldGroup className="gap-5">
            <div className="flex flex-col gap-5">
              <label htmlFor="otp" className="sr-only">
                کد تأیید
              </label>
              <InputOTP
                maxLength={6}
                id="otp"
                required
                dir="ltr"
                value={code}
                onChange={setCode}
                containerClassName="justify-center sm:justify-start"
              >
                <InputOTPGroup className="gap-2 w-full">
                  <InputOTPSlot index={0} className={authOtpSlotClassName} />
                  <InputOTPSlot index={1} className={authOtpSlotClassName} />
                  <InputOTPSlot index={2} className={authOtpSlotClassName} />
                  <InputOTPSlot index={3} className={authOtpSlotClassName} />
                  <InputOTPSlot index={4} className={authOtpSlotClassName} />
                  <InputOTPSlot index={5} className={authOtpSlotClassName} />
                </InputOTPGroup>
              </InputOTP>

              <Field className="gap-3">
                <Button
                  type="submit"
                  size="lg"
                  className={authButtonClassName}
                  disabled={isLoading || code.length !== 6}
                >
                  {isLoading ? 'در حال تأیید...' : 'تأیید و ورود'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-10 w-full text-muted-foreground"
                  disabled={isLoading}
                  onClick={() => {
                    setStep('phone')
                    setCode('')
                    setError(null)
                    setInfo(null)
                  }}
                >
                  تغییر شماره
                </Button>
              </Field>
            </div>
          </FieldGroup>
        </form>
      )}
    </AuthShell>
  )
}

export default BoxedTwoStep
