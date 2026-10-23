"use client";
import { DetailPageSkeleton } from "@/components/ui/page-skeletons";
import Link from "next/link";
import { useStudent, useStudentSubmissions } from "@/hooks/use-staff";
import { useAssignments } from "@/hooks/use-assignments";
import { PageHeading } from "@/components/ui/page-heading";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/feedback";
import { Avatar } from "@/components/ui/avatar";
import { Icon } from "@/components/ui/icon";
import { StatusBadge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";

export function StudentProfile({ id }: { id: string }) {
  const query = useStudent(id);
  const index = useStudentSubmissions(id);
  const assignments = useAssignments();
  if (query.isPending) return <DetailPageSkeleton />;
  if (query.error || !query.data)
    return <ErrorState error={query.error} retry={() => query.refetch()} />;
  const student = query.data.data;
  const submissions = index.data ?? [];
  return (
    <div className="page-stack">
      <Link className="back-link" href="/dashboard/students">
        <Icon name="back" size={15} />
        Back to students
      </Link>
      <PageHeading
        eyebrow="EVERY STUDENT HAS A STORY"
        title="Student profile"
        description="Get to know the person behind the submissions."
      />
      <div className="detail-grid">
        <div className="detail-grid-main">
          <section className="panel">
            <div className="profile-header">
              <Avatar name={student.user.name} size="lg" />
              <div>
                <h2>{student.user.name}</h2>
                <p>{student.user.email}</p>
                <span className="profile-tag">{student.user.studentId}</span>
              </div>
            </div>
          </section>
          <section className="panel">
            <div className="panel-heading">
              <div>
                <h2>Assignment journey</h2>
                <p>
                  Submitted assignments and your feedback on their latest
                  versions.
                </p>
              </div>
            </div>
            {index.isPending || assignments.isPending ? (
              <div className="p-6 space-y-5">
                <Skeleton className="h-14" />
                <Skeleton className="h-14" />
                <Skeleton className="h-14" />
              </div>
            ) : index.error || assignments.error ? (
              <div className="p-5">
                <ErrorState
                  error={index.error ?? assignments.error}
                  retry={() => {
                    void index.refetch();
                    void assignments.refetch();
                  }}
                />
              </div>
            ) : !assignments.data?.data.length ? (
              <EmptyState
                title="The journey is about to begin"
                description="Assignments will appear here when they’re published."
                icon="book"
              />
            ) : (
              <div>
                {assignments.data.data.map((assignment) => {
                  const submission = submissions.find(
                    (row) => row.assignmentId === assignment.id,
                  );
                  const review = submission?.revisions[0]?.reviews[0];
                  return (
                    <article
                      className="mobile-record border-b border-border p-5 last:border-b-0"
                      key={assignment.id}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="eyebrow mb-2">
                            ASSIGNMENT {assignment.assignmentNumber}
                          </p>
                          <h3 className="text-sm font-semibold">
                            {assignment.title}
                          </h3>
                        </div>
                        {submission ? (
                          <StatusBadge status={submission.status} />
                        ) : (
                          <span className="badge status-locked">
                            No submission
                          </span>
                        )}
                      </div>
                      {submission && (
                        <>
                          <div className="flex justify-between gap-3 mt-3">
                            <span className="text-[11px] text-muted">
                              {formatDate(submission.revisions[0]?.submittedAt)}{" "}
                              · Version {submission.revisions[0]?.version}
                            </span>
                            <Link
                              className="text-link"
                              href={`/dashboard/submissions/${submission.id}`}
                            >
                              View submission
                              <Icon name="arrow" size={14} />
                            </Link>
                          </div>
                          {review && (
                            <div className="feedback-card mt-4">
                              <div className="feedback-top">
                                <strong>Your feedback</strong>
                                <span className="marks">
                                  {review.marks}{" "}
                                  <span>/ {assignment.maxMarks}</span>
                                </span>
                              </div>
                              <p>{review.examineFeedback}</p>
                            </div>
                          )}
                        </>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
        <aside className="detail-aside">
          <section className="panel">
            <div className="panel-heading">
              <h2>Student details</h2>
            </div>
            <div className="panel-body detail-meta">
              <div className="detail-meta-row">
                <span>Student ID</span>
                <strong>{student.user.studentId}</strong>
              </div>
              <div className="detail-meta-row">
                <span>Joined</span>
                <strong>{formatDate(student.createdAt)}</strong>
              </div>
              <div className="detail-meta-row">
                <span>Submitted</span>
                <strong>
                  {index.isPending
                    ? "…"
                    : index.error
                      ? "—"
                      : `${submissions.length} assignments`}
                </strong>
              </div>
              <div className="detail-meta-row">
                <span>Reviewed</span>
                <strong>
                  {index.isPending
                    ? "…"
                    : index.error
                      ? "—"
                      : submissions.filter((row) => row.status === "REVIEWED")
                          .length}
                </strong>
              </div>
            </div>
          </section>
          <div className="guidance">
            <Icon name="info" size={17} />
            <p>
              Submitted work appears here. Skip history is only available to the
              student.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
