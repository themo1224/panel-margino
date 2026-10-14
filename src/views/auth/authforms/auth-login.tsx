import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router";
import React, { useState } from "react";
import SocialButtons from "./social-buttons";
import logodark from "@/assets/images/logos/logoicon-dark.svg"
import logoicon from "@/assets/images/logos/logoicon.svg"
import { login } from "@/api/auth";
import { useAuth } from "@/context/auth-context";

const AuthLogin = () => {
  const router = useNavigate();
  const { setSession } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const email =
      form.username?.value?.trim?.() ??
      (form.querySelector("#email") as HTMLInputElement)?.value?.trim();
    const password = (
      form.querySelector("#password") as HTMLInputElement
    )?.value?.trim();

    if (!email || !password) {
      setError("لطفاً همه فیلدها را پر کنید");
      return;
    }

    setSubmitting(true);
    try {
      const session = await login(email, password);
      setSession(session);
      router("/");
    } catch {
      setError("ورود ناموفق بود. ایمیل و رمز را بررسی کنید.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12">
      <div className="w-full max-w-md flex flex-col gap-6 items-center">
        <a href="/">
          <img
            src={logodark}
            alt="لوگو"
            width={40}
            height={40}
            className="dark:hidden block"
          />
          <img
            src={logoicon}
            alt="لوگو"
            width={40}
            height={40}
            className="dark:block hidden"
          />
        </a>

        <div className="text-center flex flex-col gap-1">
          <p className="text-2xl font-medium text-foreground">
            به Pricing خوش آمدید
          </p>
          <p className="text-sm font-normal text-muted-foreground">
            وارد حساب فروشنده خود شوید
          </p>
        </div>

        <SocialButtons />

        <form className="space-y-6 w-full" onSubmit={(e) => void handleSubmit(e)}>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-sm font-normal text-muted-foreground"
              >
                ایمیل*
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seller@pricing.local"
                dir="ltr"
                className="text-start"
                required
                defaultValue="seller@pricing.local"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="text-sm font-normal text-muted-foreground"
              >
                رمز عبور*
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="رمز عبور را وارد کنید"
                dir="ltr"
                required
                defaultValue="password"
              />
            </div>
            <div className="flex items-center justify-between text-sm flex-wrap gap-4">
              <div className="flex items-center space-x-3 space-x-reverse">
                <Checkbox id="remember" className={"cursor-pointer"} />
                <Label
                  htmlFor="remember"
                  className="text-muted-foreground font-normal cursor-pointer leading-0"
                >
                  این دستگاه را به خاطر بسپار
                </Label>
              </div>
              <a
                href="/auth/auth2/forgot-password"
                className=" text-sm font-medium hover:underline underline-offset-4 transition-all"
              >
                فراموشی رمز؟
              </a>
            </div>
          </div>

          {error ? (
            <p className="text-sm text-destructive text-center">{error}</p>
          ) : null}

          <Button size="lg" className="w-full rounded-lg" disabled={submitting}>
            {submitting ? "در حال ورود…" : "ورود"}
          </Button>
          <p className="text-center text-sm font-normal text-muted-foreground">
            حساب ندارید؟{" "}
            <a
              href="/auth/auth2/register"
              className="text-foreground font-medium hover:underline underline-offset-4 transition-all"
            >
              ایجاد حساب
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthLogin;
