"use client";
import { WorkPageSkeleton } from "@/components/ui/page-skeletons";
import Link from "next/link";
import { useState } from "react";
import { useReview, useReviews } from "@/hooks/use-staff";
import { PageHeading } from "@/components/ui/page-heading";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/feedback";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Icon } from "@/components/ui/icon";
import { ReviewForm } from "./review-form";
import { ProjectDetails } from "@/components/submissions/project-details";
import { formatDate } from "@/lib/format";

function EditReview({ id, onClose }: { id: string; onClose: () => void }) {
  const query = useReview(id);
  const [busy, setBusy] = useState(false);
  const review = query.data?.data;
  return (
    <Modal
      title="Refine your feedback"
      description={
        review
          ? `${review.revision.submission.student.user.name} · Version ${review.revision.version}`
          : "Loading your review…"
      }
      onClose={onClose}
      busy={busy}
      wide
    >
      {query.isPending ? (
        <Skeleton className="h-72" />
      ) : query.error ? (
        <ErrorState error={query.error} retry={() => query.refetch()} />
      ) : (
        review && (
          <div className="form-stack">
            <div className="guidance">
              <Icon name="submissions" size={18} />
              <ProjectDetails project={review.revision} />
            </div>
            <ReviewForm
              revisionId={review.revisionId}
              maxMarks={review.revision.submission.assignment.maxMarks}
              existing={review}
              onSuccess={onClose}
              onCancel={onClose}
              onPendingChange={setBusy}
            />
          </div>
        )
      )}
    </Modal>
  );
}

export function MyReviews() {
  const query = useReviews();
  const [edit, setEdit] = useState<string | null>(null);
  if (query.isPending) return <WorkPageSkeleton />;
  if (query.error)
    return <ErrorState error={query.error} retry={() => query.refetch()} />;
  return (
    <div className="page-stack">
      <PageHeading
        eyebrow="GUIDANCE THAT GOES FURTHER"
        title="Your reviews"
        description="A record of the feedback you’ve shared. Revisit it, refine it, keep it useful."
        action={
          <Link href="/dashboard/submissions" className="btn btn-primary">
            Review submissions
            <Icon name="arrow" size={16} />
          </Link>
        }
      />
      {!query.data?.data.length ? (
        <div className="panel">
          <EmptyState
            title="Your feedback starts here"
            description="Open a student’s submission and share your first review."
            icon="reviews"
            action={{
              href: "/dashboard/submissions",
              label: "Explore submissions",
            }}
          />
        </div>
      ) : (
        <div className="revision-list">
          {query.data.data.map((review) => (
            <article className="panel" key={review.id}>
              <div className="panel-heading">
                <div>
                  <p className="eyebrow mb-2">
                    {review.revision.submission.student.user.studentId} ·
                    VERSION {review.revision.version}
                  </p>
                  <h2>
                    <Link
                      href={`/dashboard/submissions/${review.revision.submissionId}`}
                    >
                      {review.revision.submission.assignment.title}
                    </Link>
                  </h2>
                  <p>
                    {review.revision.submission.student.user.name} · Reviewed{" "}
                    {formatDate(review.reviewedAt)}
                  </p>
                </div>
                <strong className="marks">
                  {review.marks}
                  <span>
                    {" "}
                    / {review.revision.submission.assignment.maxMarks}
                  </span>
                </strong>
              </div>
              <div className="panel-body">
                <p className="content-label">Your feedback</p>
                <p className="submission-text">{review.examineFeedback}</p>
                <div className="mt-5 flex justify-end">
                  <Button
                    variant="secondary"
                    onClick={() => setEdit(review.id)}
                  >
                    <Icon name="edit" size={16} />
                    Edit review
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
      {edit && <EditReview id={edit} onClose={() => setEdit(null)} />}
    </div>
  );
}
