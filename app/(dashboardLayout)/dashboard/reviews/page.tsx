import { requireUser } from "@/lib/server/api";
import { Prefetch } from "@/lib/server/prefetch";
import { keys } from "@/lib/query-keys";
import { staffRoles } from "@/config/routes";
import { RoleGuard } from "@/components/auth/auth-guard";
import { MyReviews } from "@/components/reviews/my-reviews";
export const metadata = { title: "My reviews" };
export default async function ReviewsPage() {
  await requireUser(staffRoles);
  return (
    <Prefetch
      queries={[
        { key: keys.reviews, path: "/api/v1/assignment-review/get-my-reviews" },
      ]}
    >
      <RoleGuard roles={staffRoles}>
        <MyReviews />
      </RoleGuard>
    </Prefetch>
  );
}
