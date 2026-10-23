"use client";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth-guard";
import { useStudents, useSubmissionStats } from "@/hooks/use-staff";
import { PageHeading } from "@/components/ui/page-heading";
import { StatCard } from "@/components/ui/stat-card";
import { ErrorState } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";
import { SubmissionList } from "@/components/submissions/submission-list";

export function StaffOverview() {
  const user = useAuth();
  const stats = useSubmissionStats();
  const students = useStudents(1, 1);
  return (
    <div className="page-stack">
      <PageHeading
        eyebrow={
          user.role === "ADMIN"
            ? "YOUR WORKSPACE AT A GLANCE"
            : "A LITTLE GUIDANCE GOES A LONG WAY"
        }
        title={`Welcome back, ${user.name.split(" ")[0]}.`}
        description="Good work is happening. Let’s help it get even better."
        action={
          <Link
            className="btn btn-primary"
            href={
              user.role === "ADMIN"
                ? "/dashboard/mentors"
                : "/dashboard/reviews"
            }
          >
            <Icon
              name={user.role === "ADMIN" ? "mentors" : "reviews"}
              size={17}
            />
            {user.role === "ADMIN" ? "Manage mentors" : "My reviews"}
          </Link>
        }
      />
      <div className="stat-grid">
        <StatCard
          label="Total submissions"
          value={stats.data?.data.total ?? "—"}
          caption="Work shared by students"
          icon="submissions"
          loading={stats.isPending}
        />
        <StatCard
          label="Pending review"
          value={stats.data?.data.pending ?? "—"}
          caption="Ready for a fresh perspective"
          icon="clock"
          tone="amber"
          loading={stats.isPending}
        />
        <StatCard
          label="Reviewed"
          value={stats.data?.data.reviewed ?? "—"}
          caption="Feedback shared, progress made"
          icon="reviews"
          tone="green"
          loading={stats.isPending}
        />
        <StatCard
          label="Total students"
          value={students.data?.meta?.total ?? "—"}
          caption="People building their next chapter"
          icon="students"
          tone="blue"
          loading={students.isPending}
        />
      </div>
      {stats.error && (
        <ErrorState error={stats.error} retry={() => stats.refetch()} />
      )}
      {students.error && (
        <ErrorState error={students.error} retry={() => students.refetch()} />
      )}
      <SubmissionList />
      <div className="guidance">
        <Icon name="info" size={17} />
        <p>
          <strong>Make feedback count.</strong> Review the latest version to
          help students move forward. You can revisit and edit your own reviews
          anytime.
        </p>
      </div>
    </div>
  );
}
