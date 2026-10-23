"use client";
import { DetailPageSkeleton } from "@/components/ui/page-skeletons";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/auth/auth-guard";
import {
  useAssignment,
  useAssignments,
  useMySkip,
  useMySubmission,
  useSkipAssignment,
} from "@/hooks/use-assignments";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Modal } from "@/components/ui/modal";
import { ErrorState, InlineError, Skeleton } from "@/components/ui/feedback";
import { PageHeading } from "@/components/ui/page-heading";
import { StatusBadge } from "@/components/ui/badge";
import { SubmissionForm } from "@/components/submissions/submission-form";
import { StudentSubmissionResult } from "@/components/submissions/student-submission-result";
import { formatDate } from "@/lib/format";
import { useToast } from "@/components/ui/toast";

export function AssignmentDetail({ id }: { id: string }) {
  const user = useAuth();
  const isStudent = user.role === "STUDENT";
  const query = useAssignment(id);
  const assignments = useAssignments();
  const assignment = query.data?.data;
  const submission = useMySubmission(
    id,
    isStudent && assignment?.progressState === "SUBMITTED",
  );
  const skip = useMySkip(
    id,
    isStudent && assignment?.progressState === "SKIPPED",
  );
  const skipMutation = useSkipAssignment();
  const [skipOpen, setSkipOpen] = useState(false);
  const [isResubmitting, setIsResubmitting] = useState(false);
  const toast = useToast();
  if (query.isPending) return <DetailPageSkeleton />;
  if (query.error || !assignment)
    return (
      <div className="page-stack">
        <Link className="back-link" href="/dashboard/assignments">
          <Icon name="back" size={15} />
          Back to assignments
        </Link>
        <ErrorState error={query.error} retry={() => query.refetch()} />
      </div>
    );
  const hasSubmission = assignment.progressState === "SUBMITTED";
  const latestRevision = submission.data?.data.revisions[0];
  const nextAssignment = assignments.data
    ? (assignments.data.data
        .filter((item) => item.assignmentNumber > assignment.assignmentNumber)
        .sort((a, b) => a.assignmentNumber - b.assignmentNumber)[0] ?? null)
    : undefined;
  const startResubmission = () => setIsResubmitting(true);
  return (
    <div className="page-stack">
      <Link className="back-link" href="/dashboard/assignments">
        <Icon name="back" size={15} />
        Back to assignments
      </Link>
      <PageHeading
        eyebrow={`ASSIGNMENT ${String(assignment.assignmentNumber).padStart(2, "0")}`}
        title={assignment.title}
        description={
          isStudent
            ? "Make it yours. Build something you’re proud to share."
            : "Assignment brief and requirements."
        }
        action={
          <StatusBadge
            status={
              submission.data?.data.status ??
              (hasSubmission
                ? "SUBMITTED"
                : assignment.progressState === "SKIPPED"
                  ? "SKIPPED"
                  : "AVAILABLE")
            }
          />
        }
      />
      <div className="detail-grid">
        <div className="detail-grid-main">
          <section className="panel">
            <div className="panel-heading">
              <h2>The assignment</h2>
              <Icon name="book" size={19} />
            </div>
            <div className="panel-body">
              <p className="detail-description">{assignment.description}</p>
            </div>
          </section>
          {isStudent && (
            <>
              {hasSubmission && !isResubmitting ? (
                submission.isPending ? (
                  <Skeleton className="h-72" />
                ) : submission.error ? (
                  <ErrorState
                    error={submission.error}
                    retry={() => submission.refetch()}
                  />
                ) : latestRevision ? (
                  <StudentSubmissionResult
                    assignment={assignment}
                    revision={latestRevision}
                    nextAssignment={nextAssignment}
                    onResubmit={startResubmission}
                  />
                ) : null
              ) : (
                <section className="panel">
                  <div className="panel-heading">
                    <div>
                      <h2>
                        {hasSubmission
                          ? "Update your submission"
                          : "Ready to share your work?"}
                      </h2>
                      <p>
                        {hasSubmission
                          ? "Update your work and submit it for another review."
                          : "Share your project name, repository, live link, and description."}
                      </p>
                    </div>
                    <Icon name="send" size={20} />
                  </div>
                  <SubmissionForm
                    assignmentId={id}
                    initialRevision={hasSubmission ? latestRevision : undefined}
                    onSubmitted={() => {
                      setIsResubmitting(false);
                      toast("Assignment submitted. Keep that momentum!");
                    }}
                    onCancel={
                      hasSubmission ? () => setIsResubmitting(false) : undefined
                    }
                    onSkip={
                      !assignment.progressState
                        ? () => setSkipOpen(true)
                        : undefined
                    }
                  />
                </section>
              )}
              {assignment.progressState === "SKIPPED" && (
                <section className="panel">
                  <div className="panel-heading">
                    <h2>Your skip note</h2>
                    <StatusBadge status="SKIPPED" />
                  </div>
                  <div className="panel-body">
                    {skip.isPending ? (
                      <Skeleton className="h-16" />
                    ) : skip.error ? (
                      <ErrorState
                        error={skip.error}
                        retry={() => skip.refetch()}
                      />
                    ) : (
                      <>
                        <p className="submission-text">
                          {skip.data?.data.reason}
                        </p>
                        <p className="table-secondary mt-3">
                          Skipped {formatDate(skip.data?.data.skippedAt)} · You
                          can still submit this assignment.
                        </p>
                      </>
                    )}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
        <aside className="detail-aside">
          <section className="panel">
            <div className="panel-heading">
              <h2>At a glance</h2>
            </div>
            <div className="panel-body detail-meta">
              <div className="detail-meta-row">
                <span>Assignment</span>
                <strong>
                  #{String(assignment.assignmentNumber).padStart(2, "0")}
                </strong>
              </div>
              <div className="detail-meta-row">
                <span>Maximum marks</span>
                <strong>{assignment.maxMarks} marks</strong>
              </div>
              <div className="detail-meta-row">
                <span>Published</span>
                <strong>{formatDate(assignment.createdAt)}</strong>
              </div>
            </div>
          </section>
          <div className="guidance">
            <Icon name="info" size={17} />
            <p>
              {isStudent
                ? "Submitting unlocks your next assignment right away. You don’t have to wait for a review to keep learning."
                : "Students unlock this assignment by submitting or skipping all earlier assignments."}
            </p>
          </div>
        </aside>
      </div>
      {skipOpen && (
        <Modal
          title="Pause this assignment"
          description="You’ll unlock the next assignment and can return to this one anytime."
          busy={skipMutation.isPending}
          onClose={() => setSkipOpen(false)}
        >
          <form
            className="form-stack"
            onSubmit={async (event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              const reason = String(form.get("reason") ?? "").trim();
              if (!reason) return;
              try {
                await skipMutation.mutateAsync({ assignmentId: id, reason });
                setSkipOpen(false);
                toast("Assignment skipped. Your next challenge is unlocked.");
              } catch {
                /* Inline error below. */
              }
            }}
          >
            <label className="field">
              Why are you skipping?
              <textarea
                name="reason"
                required
                placeholder="Share a little context…"
                disabled={skipMutation.isPending}
                autoFocus
              />
            </label>
            <InlineError message={skipMutation.error?.message} />
            <div className="form-actions">
              <Button
                variant="secondary"
                onClick={() => setSkipOpen(false)}
                disabled={skipMutation.isPending}
              >
                Keep working
              </Button>
              <Button
                type="submit"
                loading={skipMutation.isPending}
                loadingText="Skipping…"
              >
                <Icon name="skip" size={16} />
                Skip assignment
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
