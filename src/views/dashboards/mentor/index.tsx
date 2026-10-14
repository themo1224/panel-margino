/**
 * Mentor home — wide dashboard grid.
 * RTL: primary queue sits on the start (right); side rail fills the end corner (left).
 */
import MentorGreeting from "@/components/dashboards/mentor/greeting";
import MentorStats from "@/components/dashboards/mentor/mentor-stats";
import PendingAssignments from "@/components/dashboards/mentor/pending-assignments";
import UpcomingSessions from "@/components/dashboards/mentor/upcoming-sessions";

export default function MentorHome() {
  return (
    <div className="flex w-full flex-col gap-6 pb-10">
      <MentorGreeting />

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Primary column — صف اقدام (DOM first = start/right in RTL) */}
        <div className="min-w-0 lg:col-span-8">
          <PendingAssignments />
        </div>

        {/* Side rail — fills the opposite corner */}
        <aside className="flex min-w-0 flex-col gap-6 lg:col-span-4 lg:sticky lg:top-4">
          <MentorStats />
          <UpcomingSessions />
        </aside>
      </div>
    </div>
  );
}
