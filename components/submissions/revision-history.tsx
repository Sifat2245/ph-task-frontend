import { formatDate } from "@/lib/format";
import { Icon } from "@/components/ui/icon";
import type { Revision } from "@/types";

export function SubmissionItems({ text }: { text: string }) {
  // The API accepts plain text; render safe HTTP(S) links without interpreting HTML.
  return (
    <p className="submission-text">
      {text.split(/(https?:\/\/[^\s<>]+)/g).map((part, index) =>
        /^https?:\/\//.test(part) ? (
          <a
            className="text-link break-all"
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            key={index}
          >
            {part}
            <Icon name="external" size={12} />
          </a>
        ) : (
          part
        ),
      )}
    </p>
  );
}

export function RevisionHistory({
  revisions,
  maxMarks,
  ownReviews = false,
}: {
  revisions: Revision[];
  maxMarks: number;
  ownReviews?: boolean;
}) {
  return (
    <div className="revision-list">
      {revisions.map((revision, index) => (
        <article className="revision-card" key={revision.id}>
          <header className="revision-header">
            <div>
              <Icon name="revision" size={17} />
              <h3>Version {revision.version}</h3>
              {index === 0 && (
                <span className="badge status-submitted">Latest</span>
              )}
            </div>
            <time dateTime={revision.submittedAt}>
              {formatDate(revision.submittedAt, true)} UTC
            </time>
          </header>
          <div className="revision-content">
            <div>
              <p className="content-label">Submission items</p>
              <SubmissionItems text={revision.submissionItems} />
            </div>
            <div>
              <p className="content-label">Student note</p>
              <p className="submission-text">{revision.note}</p>
            </div>
            {revision.reviews.length > 0 ? (
              revision.reviews.map((review) => (
                <div key={review.id} className="feedback-card">
                  <div className="feedback-top">
                    <strong>
                      {ownReviews
                        ? "Your feedback"
                        : (review.mentor?.name ?? "Reviewer feedback")}
                    </strong>
                    <strong className="marks">
                      {review.marks} <span>/ {maxMarks}</span>
                    </strong>
                  </div>
                  <p>{review.examineFeedback}</p>
                  <p className="mt-3 text-[10px]">
                    Reviewed {formatDate(review.reviewedAt)}
                  </p>
                </div>
              ))
            ) : (
              <p className="guidance">
                <Icon name="clock" size={16} />
                {ownReviews
                  ? "You haven’t reviewed this version yet."
                  : "Feedback will appear here once this submission is reviewed."}
              </p>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
