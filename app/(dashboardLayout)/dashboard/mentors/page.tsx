import { requireUser } from "@/lib/server/api";
import { Prefetch } from "@/lib/server/prefetch";
import { keys } from "@/lib/query-keys";
import { RoleGuard } from "@/components/auth/auth-guard";
import { MentorManager } from "@/components/people/mentor-manager";
export const metadata = { title: "Mentors" };
export default async function MentorsPage() {
  await requireUser(["ADMIN"]);
  return (
    <Prefetch
      queries={[{ key: keys.mentors, path: "/api/v1/user/get-all-mentors" }]}
    >
      <RoleGuard roles={["ADMIN"]}>
        <MentorManager />
      </RoleGuard>
    </Prefetch>
  );
}
