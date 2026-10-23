"use client";
import { WorkPageSkeleton } from "@/components/ui/page-skeletons";
import Link from "next/link";
import { useState } from "react";
import { useAssignments } from "@/hooks/use-assignments";
import { useStudentWork } from "@/hooks/use-student-work";
import { PageHeading } from "@/components/ui/page-heading";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/feedback";
import { StatusBadge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { StudentSubmissionResult } from "./student-submission-result";
import { formatDate } from "@/lib/format";

export function MySubmissions() {
  const query = useAssignments();
  const work = useStudentWork(query.data?.data ?? [], true);
  const [tab, setTab] = useState<"submitted" | "skipped">("submitted");
  if (query.isPending) return <WorkPageSkeleton />;
  if (query.error)
    return <ErrorState error={query.error} retry={() => query.refetch()} />;
  return (
    <div className="page-stack">
      <PageHeading
        eyebrow="LOOK HOW FAR YOU’VE COME"
        title="Your work, all in one place."
        description="View your latest submissions, marks, and reviewer feedback."
      />
      <div
        className="flex gap-2"
        role="tablist"
        aria-label="Your work"
        onKeyDown={(event) => {
          if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))
            return;
          event.preventDefault();
          const next =
            event.key === "Home"
              ? "submitted"
              : event.key === "End"
                ? "skipped"
                : tab === "submitted"
                  ? "skipped"
                  : "submitted";
          setTab(next);
          event.currentTarget
            .querySelector<HTMLButtonElement>(`#${next}-work-tab`)
            ?.focus();
        }}
      >
        <button
          role="tab"
          id="submitted-work-tab"
          aria-controls="work-panel"
          tabIndex={tab === "submitted" ? 0 : -1}
          aria-selected={tab === "submitted"}
          className={`btn ${tab === "submitted" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setTab("submitted")}
        >
          Submitted{" "}
          <span className="opacity-70">{work.submissions.length}</span>
        </button>
        <button
          role="tab"
          id="skipped-work-tab"
          aria-controls="work-panel"
          tabIndex={tab === "skipped" ? 0 : -1}
          aria-selected={tab === "skipped"}
          className={`btn ${tab === "skipped" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setTab("skipped")}
        >
          Skipped <span className="opacity-70">{work.skips.length}</span>
        </button>
      </div>
      <div
        role="tabpanel"
        id="work-panel"
        aria-labelledby={`${tab}-work-tab`}
        className="page-stack"
        tabIndex={0}
      >
        {tab === "submitted" ? (
          work.submissions.length ? (
            work.submissions.map((item) => (
              <section key={item.assignment.id}>
                <div className="section-heading">
                  <div>
                    <p className="eyebrow mb-2">
                      ASSIGNMENT {item.assignment.assignmentNumber}
                    </p>
                    <h2>{item.assignment.title}</h2>
                  </div>
                </div>
                <div className="mb-4">
                  {item.data && <StatusBadge status={item.data.data.status} />}
                </div>
                {item.isPending ? (
                  <Skeleton className="h-64" />
                ) : item.error ? (
                  <ErrorState error={item.error} retry={() => item.refetch()} />
                ) : item.data?.data.revisions[0] ? (
                  <StudentSubmissionResult
                    assignment={item.assignment}
                    revision={item.data.data.revisions[0]}
                  />
                ) : null}
              </section>
            ))
          ) : (
            <div className="panel">
              <EmptyState
                title="Your first submission starts here"
                description="Build something, share it, and watch your progress grow."
                action={{
                  href: "/dashboard/assignments",
                  label: "Explore assignments",
                }}
              />
            </div>
          )
        ) : work.skips.length ? (
          work.skips.map((item) => (
            <section key={item.assignment.id} className="panel">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow mb-2">
                    ASSIGNMENT {item.assignment.assignmentNumber}
                  </p>
                  <h2>{item.assignment.title}</h2>
                </div>
                <StatusBadge status="SKIPPED" />
              </div>
              <div className="panel-body">
                {item.isPending ? (
                  <Skeleton className="h-16" />
                ) : item.error ? (
                  <ErrorState error={item.error} retry={() => item.refetch()} />
                ) : (
                  <>
                    <p className="content-label">Your reason</p>
                    <p className="submission-text">{item.data?.data.reason}</p>
                    <p className="table-secondary mt-3">
                      Skipped {formatDate(item.data?.data.skippedAt)}
                    </p>
                  </>
                )}
                <Link
                  className="text-link mt-5"
                  href={`/dashboard/assignments/${item.assignment.id}`}
                >
                  Ready to give it a try?
                  <Icon name="arrow" size={15} />
                </Link>
              </div>
            </section>
          ))
        ) : (
          <div className="panel">
            <EmptyState
              title="No skipped assignments"
              description="Keep going. Every step brings you a little further."
              icon="skip"
            />
          </div>
        )}
      </div>
    </div>
  );
}
