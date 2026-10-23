"use client";
import { CardsPageSkeleton } from "@/components/ui/page-skeletons";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/components/auth/auth-guard";
import { useAssignments } from "@/hooks/use-assignments";
import { useStudentWork } from "@/hooks/use-student-work";
import { assignmentService } from "@/services/assignment.service";
import { keys } from "@/lib/query-keys";
import { Icon } from "@/components/ui/icon";
import { StatusBadge, type DisplayStatus } from "@/components/ui/badge";
import { PageHeading } from "@/components/ui/page-heading";
import { StatCard } from "@/components/ui/stat-card";
import { EmptyState, ErrorState, PageSkeleton } from "@/components/ui/feedback";

export function StudentAssignments({
  overview = false,
}: {
  overview?: boolean;
}) {
  const user = useAuth();
  const query = useAssignments();
  const assignments = query.data?.data ?? [];
  const work = useStudentWork(assignments);
  const client = useQueryClient();
  if (query.isPending)
    return overview ? <PageSkeleton /> : <CardsPageSkeleton />;
  if (query.error)
    return <ErrorState error={query.error} retry={() => query.refetch()} />;
  const submitted = assignments.filter(
    (assignment) => assignment.progressState === "SUBMITTED",
  ).length;
  const skipped = assignments.filter(
    (assignment) => assignment.progressState === "SKIPPED",
  ).length;
  const reviewed = work.submissions.filter(
    (item) => item.data?.data.status === "REVIEWED",
  ).length;
  const workError = work.submissions.find((item) => item.error)?.error;
  const completed = submitted + skipped;
  const percent = assignments.length
    ? Math.round((completed / assignments.length) * 100)
    : 0;
  const current = assignments.find(
    (assignment) => !assignment.isLocked && !assignment.progressState,
  );
  return (
    <div className="page-stack">
      <PageHeading
        eyebrow={overview ? "YOUR LEARNING JOURNEY" : "ONE STEP AT A TIME"}
        title={
          overview
            ? `Let’s keep growing, ${user.name.split(" ")[0]}.`
            : "Your assignments"
        }
        description="Build something great. Share your work. Take the next step."
        action={
          overview ? (
            <Link className="heading-date" href="/dashboard/my-submissions">
              <Icon name="submissions" size={16} />
              My submissions
            </Link>
          ) : undefined
        }
      />
      {overview && (
        <div className="stat-grid">
          <StatCard
            label="Total assignments"
            value={assignments.length}
            caption="Your learning path"
            icon="assignments"
          />
          <StatCard
            label="Submitted"
            value={submitted}
            caption="Ideas brought to life"
            icon="send"
            tone="blue"
          />
          <StatCard
            label="Reviewed"
            value={workError ? "—" : reviewed}
            caption="Feedback to grow with"
            icon="reviews"
            tone="green"
            loading={work.pending}
          />
          <StatCard
            label="Skipped"
            value={skipped}
            caption="Come back when you’re ready"
            icon="skip"
            tone="amber"
          />
        </div>
      )}
      {workError && (
        <ErrorState
          error={workError}
          retry={() => {
            work.submissions.forEach((item) => {
              if (item.error) void item.refetch();
            });
          }}
        />
      )}
      <section className="progress-card" aria-label="Your assignment progress">
        <div>
          <p className="eyebrow">KEEP THE MOMENTUM</p>
          <h2>
            {completed === assignments.length && assignments.length
              ? "Look how far you’ve come."
              : completed
                ? "You’re making things happen."
                : "Every great journey starts somewhere."}
          </h2>
          <p>
            {completed} of {assignments.length} assignments completed
            {skipped
              ? ` · ${submitted} submitted, ${skipped} skipped`
              : " · One assignment at a time."}
          </p>
          <div className="progress-line">
            <div
              className="progress-track"
              role="progressbar"
              aria-label="Assignments completed"
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className="progress-fill" style={{ width: `${percent}%` }} />
            </div>
            <span className="progress-percent">{percent}%</span>
          </div>
        </div>
        <div className="progress-art">
          <Icon name="trophy" size={43} weight="duotone" />
        </div>
      </section>
      <section>
        <div className="section-heading">
          <div>
            <h2>
              Assignment roadmap
              <span className="count">{assignments.length}</span>
            </h2>
            <p>Your next challenge, and everything that comes after.</p>
          </div>
          <span className="eyebrow hidden sm:block">BUILD AT YOUR PACE</span>
        </div>
        {!assignments.length ? (
          <div className="panel">
            <EmptyState
              title="Your next challenge is on its way"
              description="Assignments will appear here once they’re published."
              icon="book"
            />
          </div>
        ) : (
          <div className="assignment-grid">
            {assignments.map((assignment, index) => {
              const submission = work.submissions.find(
                (item) => item.assignment.id === assignment.id,
              )?.data?.data;
              const status: DisplayStatus = assignment.isLocked
                ? "LOCKED"
                : assignment.progressState === "SKIPPED"
                  ? "SKIPPED"
                  : submission?.status === "REVIEWED"
                    ? "REVIEWED"
                    : assignment.progressState === "SUBMITTED"
                      ? "SUBMITTED"
                      : "AVAILABLE";
              const isCurrent = current?.id === assignment.id;
              return (
                <article
                  className={`assignment-card ${assignment.isLocked ? "assignment-locked" : ""} ${isCurrent ? "assignment-current" : ""}`}
                  key={assignment.id}
                >
                  <div className="assignment-card-body">
                    <div className="assignment-card-top">
                      <span className={`assignment-symbol symbol-${index % 3}`}>
                        <Icon
                          name={assignment.isLocked ? "lock" : "assignments"}
                          size={23}
                          weight="duotone"
                        />
                      </span>
                      <StatusBadge status={status} />
                    </div>
                    <p className="assignment-number">
                      ASSIGNMENT{" "}
                      {String(assignment.assignmentNumber).padStart(2, "0")}
                    </p>
                    <h3>{assignment.title}</h3>
                    <p className="assignment-description">
                      {assignment.isLocked
                        ? "Your next challenge is waiting. Submit or skip the previous assignments to unlock it."
                        : assignment.description}
                    </p>
                    <div className="assignment-card-meta">
                      <span>
                        <Icon name="trophy" size={14} />
                        <strong>{assignment.maxMarks} marks</strong>
                      </span>
                      <span>
                        {isCurrent
                          ? "Up next for you"
                          : submission?.revisions[0]?.reviews[0]
                            ? `${submission.revisions[0].reviews[0].marks}/${assignment.maxMarks} marks`
                            : submission
                              ? "Awaiting review"
                              : "Assignment"}
                      </span>
                    </div>
                  </div>
                  <div className="assignment-card-footer">
                    {assignment.isLocked ? (
                      <button className="btn btn-secondary" disabled>
                        <Icon name="lock" size={14} />
                        Complete previous assignments
                      </button>
                    ) : (
                      <Link
                        className={`btn ${isCurrent ? "btn-primary" : "btn-secondary"}`}
                        href={`/dashboard/assignments/${assignment.id}`}
                        onMouseEnter={() => {
                          void client.prefetchQuery({
                            queryKey: keys.assignment(assignment.id),
                            queryFn: () => assignmentService.get(assignment.id),
                          });
                        }}
                      >
                        {assignment.progressState === "SUBMITTED"
                          ? "View submission"
                          : assignment.progressState === "SKIPPED"
                            ? "Revisit assignment"
                            : "Let’s get started"}
                        <Icon name="arrow" size={15} />
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
      <div className="guidance">
        <Icon name="info" size={17} />
        <p>
          <strong>Your path, at your pace.</strong> Submit or skip an assignment
          to unlock the next one. You can revisit skipped work and resubmit
          previous assignments anytime.
        </p>
      </div>
    </div>
  );
}
