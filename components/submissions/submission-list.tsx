"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAssignments } from "@/hooks/use-assignments";
import { useSubmissions } from "@/hooks/use-staff";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { keys } from "@/lib/query-keys";
import { reviewService } from "@/services/review.service";
import { formatDate } from "@/lib/format";
import { Icon } from "@/components/ui/icon";
import { Avatar } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/feedback";
import type {
  StaffSubmission,
  SubmissionFilters,
  SubmissionStatus,
} from "@/types";

export function SubmissionsTable({ rows }: { rows: StaffSubmission[] }) {
  const client = useQueryClient();
  const href = (row: StaffSubmission) => `/dashboard/submissions/${row.id}`;
  const prefetch = (id: string) => {
    void client.prefetchQuery({
      queryKey: keys.submission(id),
      queryFn: () => reviewService.submission(id),
    });
  };
  return (
    <>
      <div className="table-wrap desktop-table">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Assignment</th>
              <th>Submitted</th>
              <th>Status</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>
                  <Link
                    className="person-cell"
                    href={`/dashboard/students/${row.student.id}`}
                  >
                    <Avatar name={row.student.user.name} size="sm" />
                    <div>
                      <span className="table-primary">
                        {row.student.user.name}
                      </span>
                      <span className="table-secondary">
                        {row.student.user.studentId}
                      </span>
                    </div>
                  </Link>
                </td>
                <td>
                  <span className="table-primary">{row.assignment.title}</span>
                  <span className="table-secondary">
                    Assignment{" "}
                    {String(row.assignment.assignmentNumber).padStart(2, "0")}
                  </span>
                </td>
                <td>
                  {formatDate(row.revisions[0]?.submittedAt)}
                  <span className="table-secondary">
                    Version {row.revisions[0]?.version}
                  </span>
                </td>
                <td>
                  <StatusBadge status={row.status} />
                </td>
                <td>
                  <div className="table-actions">
                    <Link
                      className="text-link"
                      href={href(row)}
                      onMouseEnter={() => prefetch(row.id)}
                    >
                      {row.revisions[0]?.reviews.length
                        ? "View review"
                        : "Review"}
                      <Icon name="external" size={14} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mobile-cards">
        {rows.map((row) => (
          <article key={row.id} className="mobile-record">
            <div className="mobile-record-top">
              <Link
                className="person-cell"
                href={`/dashboard/students/${row.student.id}`}
              >
                <Avatar name={row.student.user.name} size="sm" />
                <div>
                  <span className="table-primary">{row.student.user.name}</span>
                  <span className="table-secondary">
                    {row.student.user.studentId}
                  </span>
                </div>
              </Link>
              <StatusBadge status={row.status} />
            </div>
            <p className="mobile-record-title">{row.assignment.title}</p>
            <div className="mobile-record-bottom">
              <span>
                {formatDate(row.revisions[0]?.submittedAt)} · v
                {row.revisions[0]?.version}
              </span>
              <Link className="text-link" href={href(row)}>
                Review
                <Icon name="arrow" size={14} />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

export function SubmissionList() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [assignment, setAssignment] = useState("");
  const [status, setStatus] = useState<SubmissionStatus | "">("");
  const searchTerm = useDebouncedValue(search.trim());
  const filters = useMemo<SubmissionFilters>(
    () => ({
      ...(searchTerm ? { searchTerm } : {}),
      ...(assignment ? { assignmentId: assignment } : {}),
      ...(status ? { status } : {}),
    }),
    [searchTerm, assignment, status],
  );
  const filtering = !!(searchTerm || assignment || status);
  const query = useSubmissions(page, limit, filters);
  const assignments = useAssignments();
  const client = useQueryClient();
  useEffect(() => {
    if (
      !query.isPlaceholderData &&
      query.data?.meta &&
      page < query.data.meta.totalPages
    ) {
      void client.prefetchQuery({
        queryKey: keys.submissionPage(page + 1, limit, filters),
        queryFn: ({ signal }) =>
          reviewService.submissions(page + 1, limit, filters, signal),
      });
    }
  }, [page, limit, filters, query.data, query.isPlaceholderData, client]);
  const rows = query.data?.data ?? [];
  const meta = query.data?.meta;
  const loading = query.isPending;
  const error = query.error;
  const busy = query.isFetching || search.trim() !== searchTerm;
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h2>Submission inbox</h2>
          <p>A little feedback can make a big difference.</p>
        </div>
        <span className="badge status-submitted">
          {meta?.total ?? "—"} submissions
        </span>
      </div>
      <div className="filters">
        <div className="input-icon">
          <Icon name="search" size={16} />
          <input
            aria-label="Search by student ID or name"
            placeholder="Search student ID or name…"
            maxLength={100}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <select
          aria-label="Filter by assignment"
          value={assignment}
          onChange={(e) => {
            setAssignment(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All assignments</option>
          {assignments.data?.data.map((item) => (
            <option key={item.id} value={item.id}>
              Assignment {item.assignmentNumber}
            </option>
          ))}
        </select>
        <select
          aria-label="Filter by status"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as SubmissionStatus | "");
            setPage(1);
          }}
        >
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="REVIEWED">Reviewed</option>
        </select>
        {busy && !loading && (
          <Icon name="spinner" size={15} className="spin text-muted" />
        )}
      </div>
      {loading ? (
        <div
          className="p-6 space-y-5"
          role="status"
          aria-label="Loading submissions"
        >
          {[1, 2, 3, 4].map((n) => (
            <Skeleton key={n} className="h-10" />
          ))}
        </div>
      ) : error ? (
        <div className="p-5">
          <ErrorState error={error} retry={() => query.refetch()} />
        </div>
      ) : rows.length ? (
        <SubmissionsTable rows={rows} />
      ) : (
        <EmptyState
          title={filtering ? "No matching submissions" : "A fresh inbox"}
          description={
            filtering
              ? "Try a different student, assignment, or status."
              : "Student submissions will appear here, ready for your feedback."
          }
          icon="submissions"
        />
      )}
      <Pagination
        meta={meta}
        onPage={setPage}
        onLimit={(value) => {
          setLimit(value);
          setPage(1);
        }}
        busy={busy}
      />
    </section>
  );
}
