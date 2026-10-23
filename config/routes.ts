import type { Role } from "@/types";

export const staffRoles: Role[] = ["ADMIN", "MENTOR"];
export const navigation = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: "overview",
    roles: ["STUDENT", "MENTOR", "ADMIN"],
  },
  {
    href: "/dashboard/assignments",
    label: "Assignments",
    icon: "assignments",
    roles: ["STUDENT", "MENTOR", "ADMIN"],
  },
  {
    href: "/dashboard/my-submissions",
    label: "My submissions",
    icon: "submissions",
    roles: ["STUDENT"],
  },
  {
    href: "/dashboard/submissions",
    label: "Submissions",
    icon: "submissions",
    roles: staffRoles,
  },
  {
    href: "/dashboard/reviews",
    label: "My reviews",
    icon: "reviews",
    roles: staffRoles,
  },
  {
    href: "/dashboard/students",
    label: "Students",
    icon: "students",
    roles: staffRoles,
  },
  {
    href: "/dashboard/mentors",
    label: "Mentors",
    icon: "mentors",
    roles: ["ADMIN"],
  },
] as const;
