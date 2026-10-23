"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/auth-guard";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { formatDate } from "@/lib/format";
import type { Revision } from "@/types";
import { ReviewForm } from "./review-form";

export function SubmissionReview({
  revision,
  maxMarks,
  isLatest,
}: {
  revision: Revision;
  maxMarks: number;
  isLatest: boolean;
}) {
  const user = useAuth();
  const [editing, setEditing] = useState(false);
  const ownReview = revision.reviews.find(
    (review) => review.mentorId === user.id,
  );
  const showForm = editing || !revision.reviews.length;

  return (
    <section className="panel" aria-label="Submission review">
      <div className="panel-heading">
        <div>
          <h2>
            {revision.reviews.length
              ? "Reviews and feedback"
              : "Give a little guidance"}
          </h2>
          <p>
            Version {revision.version}
            {isLatest ? " · Latest submission" : " · Previous submission"}
          </p>
        </div>
        {revision.reviews.length === 1 ? (
          <strong
            className="marks"
            aria-label={`${revision.reviews[0].marks} out of ${maxMarks} marks`}
          >
            {revision.reviews[0].marks}
            <span> / {maxMarks} marks</span>
          </strong>
        ) : revision.reviews.length > 1 ? (
          <span className="badge status-reviewed">
            {revision.reviews.length} reviews
          </span>
        ) : (
          <Icon name="reviews" size={21} />
        )}
      </div>
      <div className="panel-body form-stack">
        {revision.reviews
          .filter((review) => !editing || review.id !== ownReview?.id)
          .map((review) => (
            <article className="feedback-card" key={review.id}>
              <div className="feedback-top">
                <strong>
                  {review.mentor?.name ??
                    (review.mentorId === user.id ? user.name : "Reviewer")}
                  {review.mentorId === user.id ? " (you)" : ""}
                </strong>
                <strong className="marks">
                  {review.marks}
                  <span> / {maxMarks}</span>
                </strong>
              </div>
              <p>{review.examineFeedback}</p>
              <p className="mt-3">
                Reviewed {formatDate(review.reviewedAt, true)} UTC
              </p>
            </article>
          ))}
        {showForm ? (
          <>
            {!isLatest && (
              <div className="guidance">
                <Icon name="info" size={16} />
                <p>
                  This is an earlier submission. Reviewing it will leave the
                  latest submission’s status unchanged.
                </p>
              </div>
            )}
            <ReviewForm
              key={ownReview?.id ?? "new"}
              revisionId={revision.id}
              maxMarks={maxMarks}
              existing={ownReview}
              onSuccess={() => setEditing(false)}
              onCancel={
                revision.reviews.length ? () => setEditing(false) : undefined
              }
            />
          </>
        ) : (
          <div className="form-actions">
            <Button variant="secondary" onClick={() => setEditing(true)}>
              <Icon name={ownReview ? "edit" : "plus"} size={16} />
              {ownReview ? "Edit your review" : "Add your review"}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
