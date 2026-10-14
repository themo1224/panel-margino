import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

const AuthForgotPassword = () => {
  return (
    <>
      <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12">
        <div className="w-full max-w-md flex flex-col gap-6 items-center">

          <div className="text-center flex flex-col gap-1">
            <p className="text-2xl font-medium text-foreground">
              رمز عبور را فراموش کرده‌اید؟
            </p>
            <p className="text-sm font-normal text-muted-foreground">
              ایمیل مرتبط با حساب خود را وارد کنید تا لینک بازنشانی رمز برایتان
              ارسال شود.
            </p>
          </div>

          <form className="space-y-6 w-full">
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
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Button type="submit" className="rounded-lg">
                ارسال لینک بازنشانی
              </Button>
              <Link to="/auth/auth2/login">
                <Button
                  variant={"outline"}
                  className="rounded-lg w-full"
                >
                  بازگشت به ورود
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AuthForgotPassword;
