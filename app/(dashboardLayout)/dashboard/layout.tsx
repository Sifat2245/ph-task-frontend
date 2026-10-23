import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { requireUser, getServerAssignments } from "@/lib/server/api";
import { makeQueryClient } from "@/lib/query-client";
import { keys } from "@/lib/query-keys";
import { AuthGuard } from "@/components/auth/auth-guard";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import "@/app/dashboard-layout.css";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const client = makeQueryClient();
  client.setQueryData(keys.me, user);
  client.setQueryData(keys.assignments, await getServerAssignments());
  return (
    <HydrationBoundary state={dehydrate(client)}>
      <AuthGuard initialUser={user}>
        <DashboardShell>{children}</DashboardShell>
      </AuthGuard>
    </HydrationBoundary>
  );
}
