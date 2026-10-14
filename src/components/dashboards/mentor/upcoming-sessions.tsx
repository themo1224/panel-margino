import { Link } from "react-router";
import { ChevronLeft, Video } from "lucide-react";
import {
  mentorUpcomingSessions,
  sessionStatusLabel,
} from "@/data/mentor-home-mock";

/** Compact session list for the side rail. */
export default function UpcomingSessions() {
  const sessions = mentorUpcomingSessions;

  return (
    <section className="flex flex-col gap-2.5">
      <div className="flex items-baseline justify-between gap-3 px-1">
        <div className="min-w-0">
          <h2 className="text-[17px] font-semibold tracking-[-0.01em] text-foreground">
            جلسات پیش‌رو
          </h2>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            تأییدشده · الوکام
          </p>
        </div>
        <Link
          to="/meetings"
          className="inline-flex shrink-0 items-center gap-0.5 text-[14px] font-semibold text-primary hover:opacity-80"
        >
          همه
          <ChevronLeft className="size-4" />
        </Link>
      </div>

      {sessions.length === 0 ? (
        <div className="rounded-2xl bg-card px-4 py-8 text-center ring-1 ring-foreground/10">
          <p className="text-[15px] font-semibold text-foreground">
            جلسه‌ای نیست
          </p>
          <p className="mt-1 text-[13px] text-muted-foreground">
            بعد از تعیین زمان اینجا می‌آید.
          </p>
        </div>
      ) : (
        <ul className="overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_3px_rgba(255,255,255,0.04)_inset,0_8px_32px_rgba(0,0,0,0.35)]">
          {sessions.map((session, index) => (
            <li
              key={session.id}
              className={
                index > 0 ? "border-t border-border/70" : undefined
              }
            >
              <div className="flex flex-col gap-2.5 p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="min-w-0 text-[15px] font-semibold leading-snug text-foreground">
                    {session.topic}
                  </p>
                  <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                    {sessionStatusLabel[session.status]}
                  </span>
                </div>
                <p className="text-[13px] text-muted-foreground">
                  {session.studentName}
                </p>
                <p className="text-[13px] font-medium text-foreground/85">
                  {session.datetimeLabel}
                </p>
                {session.meetingUrl ? (
                  <a
                    href={session.meetingUrl}
                    target="_blank"
                    rel="noreferrer"
                    dir="ltr"
                    className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-secondary text-[14px] font-semibold text-secondary-foreground transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] active:scale-[0.97] hover:bg-secondary/80"
                  >
                    <Video className="size-4" />
                    لینک جلسه
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-muted text-[14px] font-semibold text-muted-foreground opacity-70"
                  >
                    <Video className="size-4" />
                    لینک به‌زودی
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
