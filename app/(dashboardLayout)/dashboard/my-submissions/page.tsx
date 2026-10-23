import { requireUser } from "@/lib/server/api";
import { RoleGuard } from "@/components/auth/auth-guard";
import { MySubmissions } from "@/components/submissions/my-submissions";
export const metadata = { title: "My submissions" };
export default async function MySubmissionsPage() {
  await requireUser(["STUDENT"]);
  return (
    <RoleGuard roles={["STUDENT"]}>
      <MySubmissions />
    </RoleGuard>
  );
}
