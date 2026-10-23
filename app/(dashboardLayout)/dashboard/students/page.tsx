import { requireUser } from "@/lib/server/api";
import { Prefetch } from "@/lib/server/prefetch";
import { keys } from "@/lib/query-keys";
import { staffRoles } from "@/config/routes";
import { RoleGuard } from "@/components/auth/auth-guard";
import { StudentDirectory } from "@/components/people/student-directory";
export const metadata = { title: "Students" };
export default async function StudentsPage() {
  await requireUser(staffRoles);
  return (
    <Prefetch
      queries={[
        {
          key: keys.studentPage(1, 10),
          path: "/api/v1/student/get-all-students?page=1&limit=10",
        },
      ]}
    >
      <RoleGuard roles={staffRoles}>
        <StudentDirectory />
      </RoleGuard>
    </Prefetch>
  );
}
