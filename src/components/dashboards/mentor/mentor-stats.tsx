import { CalendarCheck, CircleCheck, ClipboardList } from "lucide-react";
import { mentorHomeStats } from "@/data/mentor-home-mock";

const items = [
  {
    key: "pending",
    label: "در انتظار",
    value: mentorHomeStats.pendingCount,
    icon: ClipboardList,
    emphasize: true,
  },
  {
    key: "week",
    label: "این هفته",
    value: mentorHomeStats.thisWeekCount,
    icon: CalendarCheck,
    emphasize: false,
  },
  {
    key: "done",
    label: "تکمیل‌شده",
    value: mentorHomeStats.completedCount,
    icon: CircleCheck,
    emphasize: false,
  },
] as const;

/** Vertical metrics for the side rail (uses corner column width). */
export default function MentorStats() {
  return (
    <section
      aria-label="خلاصه وضعیت"
      className="overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_3px_rgba(255,255,255,0.04)_inset,0_8px_32px_rgba(0,0,0,0.35)]"
    >
      <div className="border-b border-border/70 px-4 py-3">
        <h2 className="text-[15px] font-semibold text-foreground">خلاصه</h2>
      </div>
      <ul>
        {items.map(({ key, label, value, icon: Icon, emphasize }, index) => (
          <li
            key={key}
            className={
              index > 0 ? "border-t border-border/70" : undefined
            }
          >
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div
                className={
                  emphasize
                    ? "flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent"
                    : "flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground"
                }
              >
                <Icon className="size-5" strokeWidth={2} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium text-muted-foreground">
                  {label}
                </p>
              </div>
              <p
                className={
                  emphasize
                    ? "text-[22px] font-bold tabular-nums tracking-tight text-foreground"
                    : "text-[22px] font-semibold tabular-nums tracking-tight text-foreground"
                }
              >
                {value.toLocaleString("fa-IR")}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
