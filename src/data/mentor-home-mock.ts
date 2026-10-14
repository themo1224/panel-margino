/**
 * Static mentor home fixtures — replace with API in Phase 2/3.
 * Persian-first copy for LVP mentor dashboard.
 */

export type MentorAssignmentStatus = "pending_accept";

export type MentorSessionStatus = "confirmed";

export interface MentorAssignment {
  id: string;
  studentName: string;
  topic: string;
  category: string;
  contact: string;
  status: MentorAssignmentStatus;
  assignedAtLabel: string;
}

export interface MentorSession {
  id: string;
  studentName: string;
  topic: string;
  datetimeLabel: string;
  status: MentorSessionStatus;
  /** Placeholder until AloCom — keep falsy / empty for disabled CTA */
  meetingUrl: string | null;
}

export interface MentorHomeStats {
  pendingCount: number;
  thisWeekCount: number;
  completedCount: number;
}

export const mentorProfile = {
  displayName: "سارا محمدی",
  roleLabel: "منتور راهنمایی تحصیلی",
};

export const mentorPendingAssignments: MentorAssignment[] = [
  {
    id: "asg-1",
    studentName: "علی رضایی",
    topic: "نقشه راه ورود به مهندسی نرم‌افزار",
    category: "مسیر شغلی",
    contact: "ali.rezaei@example.com",
    status: "pending_accept",
    assignedAtLabel: "۲ ساعت پیش",
  },
  {
    id: "asg-2",
    studentName: "مریم کریمی",
    topic: "انتخاب رشته برای کنکور ۱۴۰۵",
    category: "انتخاب رشته",
    contact: "0912•••••••",
    status: "pending_accept",
    assignedAtLabel: "دیروز",
  },
  {
    id: "asg-3",
    studentName: "حسین نوری",
    topic: "آمادگی برای مصاحبه کارآموزی",
    category: "مهارت نرم",
    contact: "hossein.nouri@example.com",
    status: "pending_accept",
    assignedAtLabel: "۳ روز پیش",
  },
];

export const mentorUpcomingSessions: MentorSession[] = [
  {
    id: "ses-1",
    studentName: "زهرا احمدی",
    topic: "برنامه مطالعه برای ترم آینده",
    datetimeLabel: "شنبه ۱۴ شهریور · ۱۶:۳۰",
    status: "confirmed",
    meetingUrl: null,
  },
  {
    id: "ses-2",
    studentName: "امیر حسینی",
    topic: "آشنایی با بازار کار فناوری",
    datetimeLabel: "دوشنبه ۱۶ شهریور · ۱۰:۰۰",
    status: "confirmed",
    meetingUrl: null,
  },
];

export const mentorHomeStats: MentorHomeStats = {
  pendingCount: mentorPendingAssignments.length,
  thisWeekCount: 4,
  completedCount: 12,
};

export const assignmentStatusLabel: Record<MentorAssignmentStatus, string> = {
  pending_accept: "در انتظار پذیرش",
};

export const sessionStatusLabel: Record<MentorSessionStatus, string> = {
  confirmed: "تأیید شده",
};
