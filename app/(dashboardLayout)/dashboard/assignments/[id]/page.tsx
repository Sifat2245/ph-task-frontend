import { requireUser } from "@/lib/server/api";
import { Prefetch } from "@/lib/server/prefetch";
import { keys } from "@/lib/query-keys";
import { AssignmentDetail } from "@/components/assignments/assignment-detail";
export default async function AssignmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser();
  const { id } = await params;
  return (
    <Prefetch
      queries={[
        {
          key: keys.assignment(id),
          path: `/api/v1/assignment/get-single-assignment/${id}`,
        },
      ]}
    >
      <AssignmentDetail id={id} />
    </Prefetch>
  );
}
