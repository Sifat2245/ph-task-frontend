"use client";
import { ListPageSkeleton } from "@/components/ui/page-skeletons";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useStudents } from "@/hooks/use-staff";
import { peopleService } from "@/services/people.service";
import { keys } from "@/lib/query-keys";
import { PageHeading } from "@/components/ui/page-heading";
import { EmptyState, ErrorState } from "@/components/ui/feedback";
import { Avatar } from "@/components/ui/avatar";
import { Icon } from "@/components/ui/icon";
import { Pagination } from "@/components/ui/pagination";
import { formatDate } from "@/lib/format";

export function StudentDirectory() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const query = useStudents(page, limit);
  const client = useQueryClient();
  useEffect(() => {
    if (query.data?.meta && page < query.data.meta.totalPages)
      void client.prefetchQuery({
        queryKey: keys.studentPage(page + 1, limit),
        queryFn: () => peopleService.students(page + 1, limit),
      });
  }, [page, limit, query.data, client]);
  if (query.isPending) return <ListPageSkeleton />;
  if (query.error)
    return <ErrorState error={query.error} retry={() => query.refetch()} />;
  const prefetch = (id: string) => {
    void client.prefetchQuery({
      queryKey: keys.student(id),
      queryFn: () => peopleService.student(id),
    });
  };
  const rows = query.data?.data ?? [];
  return (
    <div className="page-stack">
      <PageHeading
        eyebrow="THE PEOPLE BEHIND THE PROGRESS"
        title="Your students"
        description="Meet the builders, learners, and future makers in your workspace."
      />
      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Student directory</h2>
            <p>
              {query.data?.meta?.total ?? "—"} students, each on their own
              journey
            </p>
          </div>
          {query.isFetching ? (
            <Icon name="spinner" className="spin text-muted" size={18} />
          ) : (
            <Icon name="graduation" size={22} />
          )}
        </div>
        {rows.length ? (
          <>
            <div className="table-wrap desktop-table">
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Student ID</th>
                    <th>Email address</th>
                    <th>Joined</th>
                    <th className="text-right">Profile</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((student) => (
                    <tr key={student.id}>
                      <td>
                        <div className="person-cell">
                          <Avatar name={student.user.name} />
                          <span className="table-primary">
                            {student.user.name}
                          </span>
                        </div>
                      </td>
                      <td className="mono">{student.user.studentId}</td>
                      <td>{student.user.email}</td>
                      <td>{formatDate(student.createdAt)}</td>
                      <td>
                        <div className="table-actions">
                          <Link
                            className="text-link"
                            href={`/dashboard/students/${student.id}`}
                            onMouseEnter={() => prefetch(student.id)}
                          >
                            View student
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
              {rows.map((student) => (
                <article key={student.id} className="mobile-record">
                  <div className="mobile-record-top">
                    <div className="person-cell">
                      <Avatar name={student.user.name} />
                      <div>
                        <span className="table-primary">
                          {student.user.name}
                        </span>
                        <span className="table-secondary">
                          {student.user.studentId}
                        </span>
                      </div>
                    </div>
                    <Link
                      className="text-link"
                      href={`/dashboard/students/${student.id}`}
                    >
                      Profile
                      <Icon name="arrow" size={14} />
                    </Link>
                  </div>
                  <span className="table-secondary">{student.user.email}</span>
                  <div className="mobile-record-bottom">
                    Joined {formatDate(student.createdAt)}
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <EmptyState
            title="Your next students are on their way"
            description="Students will appear here after creating an account."
            icon="students"
          />
        )}
        <Pagination
          meta={query.data?.meta}
          onPage={setPage}
          onLimit={(value) => {
            setLimit(value);
            setPage(1);
          }}
          busy={query.isFetching}
        />
      </section>
    </div>
  );
}
