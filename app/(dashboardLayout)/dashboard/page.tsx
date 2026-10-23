import { requireUser } from "@/lib/server/api";
import { StudentAssignments } from "@/components/assignments/student-assignments";
import { StaffOverview } from "@/components/dashboard/staff-overview";
import { Prefetch } from "@/lib/server/prefetch";
import { keys } from "@/lib/query-keys";

export default async function DashboardPage() {
  const user = await requireUser();
  if (user.role === "STUDENT") return <StudentAssignments overview />;
  return (
    <Prefetch
      queries={[
        {
          key: keys.submissionPage(1, 10),
          path: "/api/v1/assignment-review/get-all-submissions?page=1&limit=10",
        },
        {
          key: keys.submissionStats,
          path: "/api/v1/assignment-review/get-submission-stats",
        },
        {
          key: keys.studentPage(1, 1),
          path: "/api/v1/student/get-all-students?page=1&limit=1",
        },
      ]}
    >
      <StaffOverview />
    </Prefetch>
  );
}
