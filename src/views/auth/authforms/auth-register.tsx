import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SocialButtons from "./social-buttons";
import logodark from "@/assets/images/logos/logoicon-dark.svg";
import logoicon from "@/assets/images/logos/logoicon.svg";
import { register } from "@/api/auth";
import { useAuth } from "@/context/auth-context";

const AuthRegister = () => {
  const router = useNavigate();
  const { setSession } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString().trim();

    if (!name || !email || !password) {
      setError("لطفاً همه فیلدها را پر کنید");
      return;
    }

    setSubmitting(true);
    try {
      const session = await register({
        name,
        email,
        password,
        password_confirmation: password,
      });
      setSession(session);
      router("/");
    } catch {
      setError("ثبت‌نام ناموفق بود. دوباره تلاش کنید.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12">
      <div className="w-full max-w-md flex flex-col gap-6 items-center">
        <a href="/auth/auth2/login">
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
            حساب فروشنده جدید بسازید
          </p>
        </div>

        <SocialButtons />

        <form
          className="space-y-6 w-full"
          onSubmit={(e) => void handleSubmit(e)}
        >
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="name"
                className="text-sm font-normal text-muted-foreground"
              >
                نام*
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="نام خود را وارد کنید"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-sm font-normal text-muted-foreground"
              >
                ایمیل*
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seller@pricing.local"
                dir="ltr"
                className="text-start"
                required
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
                name="password"
                type="password"
                placeholder="رمز عبور را وارد کنید"
                dir="ltr"
                required
              />
            </div>
          </div>

          {error ? (
            <p className="text-sm text-destructive text-center">{error}</p>
          ) : null}

          <Button
            size="lg"
            className="w-full rounded-lg"
            disabled={submitting}
          >
            {submitting ? "در حال ثبت‌نام…" : "ثبت‌نام"}
          </Button>
          <p className="text-center text-sm font-normal text-muted-foreground">
            قبلاً حساب دارید؟{" "}
            <a
              href="/auth/auth2/login"
              className="text-foreground font-medium hover:underline underline-offset-4 transition-all"
            >
              ورود
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthRegister;
