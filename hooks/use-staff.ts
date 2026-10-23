"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { keys } from "@/lib/query-keys";
import {
  getStudentSubmissions,
  reviewService,
} from "@/services/review.service";
import { peopleService } from "@/services/people.service";
import type { SubmissionFilters } from "@/types";

export const useSubmissions = (
  page = 1,
  limit = 10,
  filters: SubmissionFilters = {},
) =>
  useQuery({
    queryKey: keys.submissionPage(page, limit, filters),
    queryFn: ({ signal }) =>
      reviewService.submissions(page, limit, filters, signal),
    placeholderData: keepPreviousData,
  });
export const useSubmissionStats = () =>
  useQuery({ queryKey: keys.submissionStats, queryFn: reviewService.stats });
export const useStudentSubmissions = (studentId: string) =>
  useQuery({
    queryKey: keys.studentSubmissions(studentId),
    queryFn: ({ signal }) => getStudentSubmissions(studentId, signal),
    enabled: !!studentId,
  });
export const useSubmission = (id: string) =>
  useQuery({
    queryKey: keys.submission(id),
    queryFn: () => reviewService.submission(id),
  });
export const useReviews = () =>
  useQuery({ queryKey: keys.reviews, queryFn: reviewService.list });
export const useReview = (id: string) =>
  useQuery({
    queryKey: keys.review(id),
    queryFn: () => reviewService.get(id),
    enabled: !!id,
  });
export const useStudents = (page = 1, limit = 10) =>
  useQuery({
    queryKey: keys.studentPage(page, limit),
    queryFn: () => peopleService.students(page, limit),
    placeholderData: keepPreviousData,
  });
export const useStudent = (id: string) =>
  useQuery({
    queryKey: keys.student(id),
    queryFn: () => peopleService.student(id),
  });
export const useMentors = () =>
  useQuery({ queryKey: keys.mentors, queryFn: peopleService.mentors });

export function useReviewMutations() {
  const client = useQueryClient();
  const refresh = async () => {
    await Promise.all([
      client.invalidateQueries({ queryKey: keys.reviews }),
      client.invalidateQueries({ queryKey: keys.submissions }),
    ]);
  };
  const create = useMutation({
    mutationFn: reviewService.create,
    onSuccess: refresh,
  });
  const update = useMutation({
    mutationFn: reviewService.update,
    onSuccess: refresh,
  });
  return { create, update };
}

export function useMentorMutations() {
  const client = useQueryClient();
  const refresh = () => client.invalidateQueries({ queryKey: keys.mentors });
  const create = useMutation({
    mutationFn: peopleService.createMentor,
    onSuccess: refresh,
  });
  const update = useMutation({
    mutationFn: peopleService.updateMentor,
    onSuccess: refresh,
  });
  const remove = useMutation({
    mutationFn: peopleService.deleteMentor,
    onSuccess: refresh,
  });
  return { create, update, remove };
}
