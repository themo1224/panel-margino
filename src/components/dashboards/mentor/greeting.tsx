import { Link } from "react-router";
import { ChevronLeft, Map, MessageCircle } from "lucide-react";
import { mentorHomeStats, mentorProfile } from "@/data/mentor-home-mock";

/** Full-width header: title on start, actions on end — uses horizontal space. */
export default function MentorGreeting() {
  return (
    <header className="flex flex-col gap-4 rounded-2xl bg-card p-5 ring-1 ring-foreground/10 sm:flex-row sm:items-end sm:justify-between sm:gap-6 sm:p-6">
      <div className="min-w-0 flex-1 space-y-1">
        <p className="text-[13px] font-medium tracking-wide text-muted-foreground">
          {mentorProfile.roleLabel}
        </p>
        <h1 className="text-[28px] font-bold leading-tight tracking-[-0.02em] text-foreground">
          سلام، {mentorProfile.displayName}
        </h1>
        <p className="text-[15px] leading-snug text-muted-foreground">
          {mentorHomeStats.pendingCount.toLocaleString("fa-IR")} درخواست منتظر
          پذیرش شماست
        </p>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <Link
          to="/chat"
          className="inline-flex h-11 items-center gap-2 rounded-full bg-secondary px-4 text-[15px] font-medium text-secondary-foreground transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] active:scale-[0.97] hover:bg-secondary/80"
        >
          <MessageCircle className="size-4 opacity-80" />
          گفتگو
        </Link>
        <Link
          to="/roadmap"
          className="inline-flex h-11 items-center gap-2 rounded-full bg-secondary px-4 text-[15px] font-medium text-secondary-foreground transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] active:scale-[0.97] hover:bg-secondary/80"
        >
          <Map className="size-4 opacity-80" />
          نقشه راه
        </Link>
        <Link
          to="/assigned-requests"
          className="inline-flex h-11 items-center gap-1 rounded-full bg-primary px-4 text-[15px] font-semibold text-primary-foreground transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] active:scale-[0.97] hover:bg-primary/90"
        >
          همه درخواست‌ها
          <ChevronLeft className="size-4" />
        </Link>
      </div>
    </header>
  );
}
