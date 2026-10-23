"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAssignments } from "@/hooks/use-assignments";
import { useSubmissionIndex, useSubmissions } from "@/hooks/use-staff";
import { keys } from "@/lib/query-keys";
import { reviewService } from "@/services/review.service";
import { formatDate } from "@/lib/format";
import { Icon } from "@/components/ui/icon";
import { Avatar } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/feedback";
import type { StaffSubmission } from "@/types";

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
  const [status, setStatus] = useState("");
  const filtering = !!(search.trim() || assignment || status);
  const query = useSubmissions(page, limit, !filtering);
  const index = useSubmissionIndex(filtering);
  const assignments = useAssignments();
  const client = useQueryClient();
  useEffect(() => {
    if (!filtering && query.data?.meta && page < query.data.meta.totalPages) {
      void client.prefetchQuery({
        queryKey: keys.submissionPage(page + 1, limit),
        queryFn: ({ signal }) =>
          reviewService.submissions(page + 1, limit, signal),
      });
    }
  }, [page, limit, filtering, query.data, client]);
  const filtered = (index.data ?? []).filter(
    (row) =>
      (!search.trim() ||
        `${row.student.user.studentId} ${row.student.user.name}`
          .toLowerCase()
          .includes(search.trim().toLowerCase())) &&
      (!assignment || row.assignmentId === assignment) &&
      (!status || row.status === status),
  );
  const rows = filtering
    ? filtered.slice((page - 1) * limit, page * limit)
    : (query.data?.data ?? []);
  const meta = filtering
    ? {
        page,
        limit,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / limit),
      }
    : query.data?.meta;
  const loading = filtering ? index.isPending : query.isPending;
  const error = filtering ? index.error : query.error;
  const busy = filtering ? index.isFetching : query.isFetching;
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
            setStatus(e.target.value);
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
          <ErrorState
            error={error}
            retry={() => (filtering ? index.refetch() : query.refetch())}
          />
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
