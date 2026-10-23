"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { keys } from "@/lib/query-keys";
import { getSubmissionIndex, reviewService } from "@/services/review.service";
import { peopleService } from "@/services/people.service";

export const useSubmissions = (page = 1, limit = 10, enabled = true) =>
  useQuery({
    queryKey: keys.submissionPage(page, limit),
    queryFn: ({ signal }) => reviewService.submissions(page, limit, signal),
    placeholderData: keepPreviousData,
    enabled,
  });
export const useSubmissionIndex = (enabled = true) =>
  useQuery({
    queryKey: keys.submissionIndex,
    queryFn: ({ signal }) => getSubmissionIndex(signal),
    enabled,
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
