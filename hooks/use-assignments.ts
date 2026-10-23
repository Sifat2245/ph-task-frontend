"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { assignmentService } from "@/services/assignment.service";
import { submissionService } from "@/services/submission.service";
import { keys } from "@/lib/query-keys";
import type { ApiResponse, Assignment, Submission } from "@/types";

export const useAssignments = () =>
  useQuery({ queryKey: keys.assignments, queryFn: assignmentService.list });
export const useAssignment = (id: string) =>
  useQuery({
    queryKey: keys.assignment(id),
    queryFn: () => assignmentService.get(id),
  });
export const useMySubmission = (id: string, enabled = true) =>
  useQuery({
    queryKey: keys.mySubmission(id),
    queryFn: () => submissionService.mine(id),
    enabled,
  });
export const useMySkip = (id: string, enabled = true) =>
  useQuery({
    queryKey: keys.mySkip(id),
    queryFn: () => submissionService.mySkip(id),
    enabled,
  });

export function useSubmitAssignment() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: submissionService.submit,
    onSuccess: async (result, input) => {
      // Store the saved result immediately so resubmission cannot show old marks.
      client.setQueryData<ApiResponse<Submission>>(
        keys.mySubmission(input.assignmentId),
        (current) => ({
          statusCode: result.statusCode,
          success: result.success,
          message: result.message,
          data: {
            ...result.data.submission,
            revisions: [
              { ...result.data.revision, reviews: [] },
              ...(current?.data.revisions.filter(
                (revision) => revision.id !== result.data.revision.id,
              ) ?? []),
            ],
          },
        }),
      );
      client.setQueryData<ApiResponse<Assignment>>(
        keys.assignment(input.assignmentId),
        (current) =>
          current
            ? {
                ...current,
                data: {
                  ...current.data,
                  progressState: result.data.progress.state,
                },
              }
            : current,
      );
      await Promise.all([
        client.invalidateQueries({ queryKey: keys.assignments }),
        client.invalidateQueries({
          queryKey: keys.mySubmission(input.assignmentId),
        }),
      ]);
    },
  });
}

export function useSkipAssignment() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: submissionService.skip,
    onSuccess: async (_, input) => {
      await Promise.all([
        client.invalidateQueries({ queryKey: keys.assignments }),
        client.invalidateQueries({ queryKey: keys.mySkip(input.assignmentId) }),
      ]);
    },
  });
}

export function useAssignmentMutations() {
  const client = useQueryClient();
  const refresh = () =>
    client.invalidateQueries({ queryKey: keys.assignments });
  const create = useMutation({
    mutationFn: assignmentService.create,
    onSuccess: refresh,
  });
  const update = useMutation({
    mutationFn: assignmentService.update,
    onSuccess: refresh,
  });
  const remove = useMutation({
    mutationFn: assignmentService.remove,
    onSuccess: refresh,
  });
  return { create, update, remove };
}
