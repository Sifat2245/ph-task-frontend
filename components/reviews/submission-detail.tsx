"use client";
import { ProjectDetails } from "@/components/submissions/project-details";
import { DetailPageSkeleton } from "@/components/ui/page-skeletons";
import Link from "next/link";
import { useState } from "react";
import { useSubmission } from "@/hooks/use-staff";
import { PageHeading } from "@/components/ui/page-heading";
import { ErrorState } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";
import { StatusBadge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { RevisionHistory } from "@/components/submissions/revision-history";
import { SubmissionReview } from "./submission-review";
import { formatDate } from "@/lib/format";

export function SubmissionDetail({ id }: { id: string }) {
  const query = useSubmission(id);
  const [selected, setSelected] = useState("");
  if (query.isPending) return <DetailPageSkeleton />;
  if (query.error || !query.data)
    return <ErrorState error={query.error} retry={() => query.refetch()} />;
  const submission = query.data.data;
  const revision =
    submission.revisions.find((item) => item.id === selected) ??
    submission.revisions[0];
  const latest = submission.revisions[0]?.id === revision?.id;
  return (
    <div className="page-stack">
      <Link className="back-link" href="/dashboard/submissions">
        <Icon name="back" size={15} />
        Back to submissions
      </Link>
      <PageHeading
        eyebrow={`ASSIGNMENT ${String(submission.assignment.assignmentNumber).padStart(2, "0")}`}
        title={submission.assignment.title}
        description="A fresh perspective helps good work become great work."
        action={<StatusBadge status={submission.status} />}
      />
      <div className="detail-grid">
        <div className="detail-grid-main">
          <section className="panel">
            <div className="panel-heading">
              <Link
                className="person-cell"
                href={`/dashboard/students/${submission.student.id}`}
              >
                <Avatar name={submission.student.user.name} />
                <div>
                  <h2>{submission.student.user.name}</h2>
                  <p>{submission.student.user.studentId}</p>
                </div>
              </Link>
              <Link
                className="text-link"
                href={`/dashboard/students/${submission.student.id}`}
              >
                View student
                <Icon name="external" size={14} />
              </Link>
            </div>
            <div className="panel-body">
              <p className="content-label">Assignment brief</p>
              <p className="detail-description">
                {submission.assignment.description}
              </p>
            </div>
          </section>
          {revision && (
            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h2>Submitted work</h2>
                  <p>{formatDate(revision.submittedAt, true)} UTC</p>
                </div>
                <select
                  className="max-w-40"
                  aria-label="Submission version"
                  value={revision.id}
                  onChange={(e) => setSelected(e.target.value)}
                >
                  {submission.revisions.map((item, index) => (
                    <option key={item.id} value={item.id}>
                      Version {item.version}
                      {index === 0 ? " (latest)" : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div className="panel-body form-stack">
                <ProjectDetails project={revision} />
              </div>
            </section>
          )}
          {revision && (
            <SubmissionReview
              key={revision.id}
              revision={revision}
              maxMarks={submission.assignment.maxMarks}
              isLatest={latest}
            />
          )}
          <section>
            <div className="section-heading">
              <div>
                <h2>Version history</h2>
                <p>
                  Feedback from every reviewer across this student’s
                  submissions.
                </p>
              </div>
            </div>
            <RevisionHistory
              revisions={submission.revisions}
              maxMarks={submission.assignment.maxMarks}
            />
          </section>
        </div>
        <aside className="detail-aside">
          <section className="panel">
            <div className="panel-heading">
              <h2>Review details</h2>
            </div>
            <div className="panel-body detail-meta">
              <div className="detail-meta-row">
                <span>Student ID</span>
                <strong>{submission.student.user.studentId}</strong>
              </div>
              <div className="detail-meta-row">
                <span>Maximum marks</span>
                <strong>{submission.assignment.maxMarks} marks</strong>
              </div>
              <div className="detail-meta-row">
                <span>Latest awarded marks</span>
                <strong className={revision?.reviews[0] ? "marks" : undefined}>
                  {revision?.reviews[0]
                    ? `${revision.reviews[0].marks} / ${submission.assignment.maxMarks}`
                    : "Not reviewed"}
                </strong>
              </div>
              <div className="detail-meta-row">
                <span>Versions submitted</span>
                <strong>{submission.revisions.length}</strong>
              </div>
              <div className="detail-meta-row">
                <span>First submitted</span>
                <strong>{formatDate(submission.createdAt)}</strong>
              </div>
            </div>
          </section>
          <div className="guidance">
            <Icon name="info" size={17} />
            <p>
              Reviews include feedback from every reviewer. You can add your own
              review or edit the review you submitted.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
