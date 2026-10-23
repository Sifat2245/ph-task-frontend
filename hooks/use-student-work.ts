"use client";
import { useQueries } from "@tanstack/react-query";
import { keys } from "@/lib/query-keys";
import { submissionService } from "@/services/submission.service";
import type { Assignment } from "@/types";

export function useStudentWork(
  assignments: Assignment[],
  includeSkips = false,
) {
  const submitted = assignments.filter(
    (assignment) =>
      !assignment.isLocked && assignment.progressState === "SUBMITTED",
  );
  const skipped = includeSkips
    ? assignments.filter(
        (assignment) =>
          !assignment.isLocked && assignment.progressState === "SKIPPED",
      )
    : [];
  const submissions = useQueries({
    queries: submitted.map((assignment) => ({
      queryKey: keys.mySubmission(assignment.id),
      queryFn: () => submissionService.mine(assignment.id),
    })),
  });
  const skips = useQueries({
    queries: skipped.map((assignment) => ({
      queryKey: keys.mySkip(assignment.id),
      queryFn: () => submissionService.mySkip(assignment.id),
    })),
  });
  return {
    submissions: submitted.map((assignment, index) => ({
      assignment,
      ...submissions[index],
    })),
    skips: skipped.map((assignment, index) => ({
      assignment,
      ...skips[index],
    })),
    pending:
      submissions.some((query) => query.isPending) ||
      skips.some((query) => query.isPending),
  };
}
