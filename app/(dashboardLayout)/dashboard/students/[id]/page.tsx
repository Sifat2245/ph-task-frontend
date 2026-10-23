import { requireUser } from "@/lib/server/api";
import { Prefetch } from "@/lib/server/prefetch";
import { keys } from "@/lib/query-keys";
import { staffRoles } from "@/config/routes";
import { RoleGuard } from "@/components/auth/auth-guard";
import { StudentProfile } from "@/components/people/student-profile";
export const metadata = { title: "Student profile" };
export default async function StudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser(staffRoles);
  const { id } = await params;
  return (
    <Prefetch
      queries={[
        {
          key: keys.student(id),
          path: `/api/v1/student/get-single-student/${id}`,
        },
      ]}
    >
      <RoleGuard roles={staffRoles}>
        <StudentProfile id={id} />
      </RoleGuard>
    </Prefetch>
  );
}
