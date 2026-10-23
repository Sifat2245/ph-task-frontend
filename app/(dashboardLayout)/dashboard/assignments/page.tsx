import { requireUser } from "@/lib/server/api";
import { StudentAssignments } from "@/components/assignments/student-assignments";
import { AssignmentManager } from "@/components/assignments/assignment-manager";
export const metadata = { title: "Assignments" };
export default async function AssignmentsPage() {
  const user = await requireUser();
  return user.role === "STUDENT" ? (
    <StudentAssignments />
  ) : (
    <AssignmentManager />
  );
}
