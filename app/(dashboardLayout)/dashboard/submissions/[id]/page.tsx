import { requireUser } from "@/lib/server/api";
import { Prefetch } from "@/lib/server/prefetch";
import { keys } from "@/lib/query-keys";
import { staffRoles } from "@/config/routes";
import { RoleGuard } from "@/components/auth/auth-guard";
import { SubmissionDetail } from "@/components/reviews/submission-detail";
export const metadata = { title: "Review submission" };
export default async function SubmissionPage({
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
          key: keys.submission(id),
          path: `/api/v1/assignment-review/get-single-submission/${id}`,
        },
      ]}
    >
      <RoleGuard roles={staffRoles}>
        <SubmissionDetail id={id} />
      </RoleGuard>
    </Prefetch>
  );
}
