"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Modal } from "@/components/ui/modal";
import { ProjectDetails } from "./project-details";
import { formatDate } from "@/lib/format";
import type { Assignment, Revision } from "@/types";
import "./student-submission-result.css";

export function StudentSubmissionResult({
  assignment,
  revision,
  nextAssignment,
  onResubmit,
}: {
  assignment: Assignment;
  revision: Revision;
  nextAssignment?: Assignment | null;
  onResubmit?: () => void;
}) {
  const [dialog, setDialog] = useState<"submission" | "feedback" | null>(null);
  // The API orders revisions and their reviews newest first.
  const review = revision.reviews[0];
  const nextUnlocked = nextAssignment && !nextAssignment.isLocked;
  const score = review
    ? Math.min(100, Math.max(0, (review.marks / assignment.maxMarks) * 100))
    : 0;

  return (
    <>
      <section className="student-result" aria-live="polite">
        {review ? (
          <div
            className="student-result-score"
            role="img"
            aria-label={`${review.marks} out of ${assignment.maxMarks} marks`}
            style={{ "--score-progress": `${score}%` } as CSSProperties}
          >
            <span className="student-result-score-check">
              <Icon name="check" size={18} weight="bold" />
            </span>
            <strong aria-hidden="true">
              {review.marks}
              <span>/{assignment.maxMarks}</span>
            </strong>
          </div>
        ) : (
          <span className="student-result-check">
            <Icon name="success" size={34} />
          </span>
        )}
        <h2>
          {review
            ? review.marks === assignment.maxMarks
              ? "Great job!"
              : "Your results are in!"
            : "Assignment submitted successfully"}
        </h2>
        <p className="student-result-description">
          {review ? (
            <>
              You’ve completed assignment {assignment.assignmentNumber} and
              earned <strong>{review.marks} marks</strong>.
            </>
          ) : nextUnlocked ? (
            <>
              You’ve successfully submitted your work and unlocked assignment{" "}
              {nextAssignment.assignmentNumber}.
            </>
          ) : nextAssignment === null ? (
            "You’ve successfully submitted your work and reached the end of the roadmap."
          ) : (
            "You’ve successfully submitted your work. It’s ready for review."
          )}
        </p>
        {review && revision.reviews.length > 1 && (
          <p className="student-result-reviewer">
            Latest review{review.mentor ? ` by ${review.mentor.name}` : ""} ·
            View feedback for all received marks.
          </p>
        )}
        <div className="student-result-actions">
          {!review && nextUnlocked && (
            <Link
              href={`/dashboard/assignments/${nextAssignment.id}`}
              className="btn btn-primary"
            >
              Next assignment
              <Icon name="arrow" size={16} />
            </Link>
          )}
          <Button
            variant={!review && nextUnlocked ? "secondary" : "primary"}
            onClick={() => setDialog("submission")}
          >
            My submission
            <Icon name="arrow" size={16} />
          </Button>
          {onResubmit ? (
            <Button variant="secondary" onClick={onResubmit}>
              Resubmit
            </Button>
          ) : (
            <Link
              href={`/dashboard/assignments/${assignment.id}`}
              className="btn btn-secondary"
            >
              View assignment
            </Link>
          )}
        </div>
        {review && (
          <button
            className="student-result-feedback-link"
            onClick={() => setDialog("feedback")}
          >
            View examiner’s feedback
            <Icon name="right" size={14} />
          </button>
        )}
      </section>
      {dialog && (
        <Modal
          title={
            dialog === "submission" ? "My submission" : "Examiner’s feedback"
          }
          description={`Assignment ${assignment.assignmentNumber} · ${assignment.title}`}
          onClose={() => setDialog(null)}
        >
          {dialog === "submission" ? (
            <div className="form-stack">
              <ProjectDetails project={revision} />
              <p className="table-secondary">
                Submitted {formatDate(revision.submittedAt, true)} UTC
              </p>
            </div>
          ) : (
            <div className="form-stack">
              {revision.reviews.map((item) => (
                <article key={item.id} className="feedback-card">
                  <div className="feedback-top">
                    <strong>{item.mentor?.name ?? "Reviewer"}</strong>
                    <strong className="marks">
                      {item.marks}
                      <span> / {assignment.maxMarks}</span>
                    </strong>
                  </div>
                  <p>{item.examineFeedback}</p>
                  <p className="mt-3">Reviewed {formatDate(item.reviewedAt)}</p>
                </article>
              ))}
            </div>
          )}
        </Modal>
      )}
    </>
  );
}
