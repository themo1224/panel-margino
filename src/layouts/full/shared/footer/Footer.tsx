import { Link } from "react-router";

type SearchType = {
    title: string;
    href: string;
};

const searchSugg: SearchType[] = [
    { title: "پشتیبانی", href: "/pages/user-profile" },
    { title: "کلید API", href: "/api-keys" },
];

export default function Footer() {
    return (
        <div className="flex md:flex-row flex-col items-center justify-between gap-3 text-center">
            <p className="text-sm text-muted-foreground">
                © ۱۴۰۵{" "}
                <Link
                    to="/"
                    className="hover:text-primary text-muted-foreground"
                >
                    Pricing
                </Link>
                — قیمت امن، رقیب در دید
            </p>

            <div className="flex gap-4">
                {searchSugg.map((item, index) => (
                    <Link
                        key={index}
                        to={item.href}
                        className="text-sm hover:text-primary text-muted-foreground"
                    >
                        {item.title}
                    </Link>
                ))}
            </div>
        </div>
    );
}
