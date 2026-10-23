import { requireUser } from "@/lib/server/api";
import { Prefetch } from "@/lib/server/prefetch";
import { keys } from "@/lib/query-keys";
import { staffRoles } from "@/config/routes";
import { RoleGuard } from "@/components/auth/auth-guard";
import { SubmissionList } from "@/components/submissions/submission-list";
import { PageHeading } from "@/components/ui/page-heading";
export const metadata = { title: "Submissions" };
export default async function SubmissionsPage() {
  await requireUser(staffRoles);
  return (
    <Prefetch
      queries={[
        {
          key: keys.submissionPage(1, 10),
          path: "/api/v1/assignment-review/get-all-submissions?page=1&limit=10",
        },
      ]}
    >
      <RoleGuard roles={staffRoles}>
        <div className="page-stack">
          <PageHeading
            eyebrow="GOOD WORK DESERVES GOOD FEEDBACK"
            title="Student submissions"
            description="Explore what your students are building and help them take the next step."
          />
          <SubmissionList />
        </div>
      </RoleGuard>
    </Prefetch>
  );
}
