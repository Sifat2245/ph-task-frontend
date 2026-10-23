export const keys = {
  me: ["auth", "me"] as const,
  assignments: ["assignments"] as const,
  assignment: (id: string) => ["assignments", id] as const,
  mySubmission: (id: string) => ["my-submission", id] as const,
  mySkip: (id: string) => ["my-skip", id] as const,
  submissions: ["submissions"] as const,
  submissionPage: (page: number, limit: number) =>
    ["submissions", "page", page, limit] as const,
  submissionIndex: ["submissions", "index"] as const,
  submission: (id: string) => ["submissions", "detail", id] as const,
  reviews: ["reviews"] as const,
  review: (id: string) => ["reviews", id] as const,
  students: ["students"] as const,
  studentPage: (page: number, limit: number) =>
    ["students", "page", page, limit] as const,
  student: (id: string) => ["students", id] as const,
  mentors: ["mentors"] as const,
};
