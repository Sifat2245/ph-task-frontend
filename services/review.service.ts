import { httpClient } from "@/lib/axios/httpClient";
import type {
  ApiResponse,
  ReviewDetail,
  ReviewPayload,
  StaffSubmission,
  SubmissionFilters,
  SubmissionStats,
} from "@/types";

export const reviewService = {
  submissions: (
    page = 1,
    limit = 10,
    filters: SubmissionFilters = {},
    signal?: AbortSignal,
  ) =>
    httpClient.get<ApiResponse<StaffSubmission[]>>(
      "/api/v1/assignment-review/get-all-submissions",
      { params: { page, limit, ...filters }, signal },
    ),
  stats: () =>
    httpClient.get<ApiResponse<SubmissionStats>>(
      "/api/v1/assignment-review/get-submission-stats",
    ),
  submission: (id: string) =>
    httpClient.get<ApiResponse<StaffSubmission>>(
      `/api/v1/assignment-review/get-single-submission/${id}`,
    ),
  list: () =>
    httpClient.get<ApiResponse<ReviewDetail[]>>(
      "/api/v1/assignment-review/get-my-reviews",
    ),
  get: (id: string) =>
    httpClient.get<ApiResponse<ReviewDetail>>(
      `/api/v1/assignment-review/get-my-review/${id}`,
    ),
  create: (body: ReviewPayload) =>
    httpClient.post<ApiResponse<ReviewDetail>>(
      "/api/v1/assignment-review/create-review",
      body,
    ),
  update: ({
    id,
    ...body
  }: { id: string } & Partial<Omit<ReviewPayload, "revisionId">>) =>
    httpClient.put<ApiResponse<ReviewDetail>>(
      `/api/v1/assignment-review/update-review/${id}`,
      body,
    ),
};

// A student's journey needs all of their submissions, fetched in bounded pages.
export async function getStudentSubmissions(
  studentId: string,
  signal?: AbortSignal,
): Promise<StaffSubmission[]> {
  const filters = { studentId };
  const first = await reviewService.submissions(1, 100, filters, signal);
  const rows = [...first.data];
  for (let page = 2; page <= (first.meta?.totalPages ?? 1); page++) {
    rows.push(
      ...(await reviewService.submissions(page, 100, filters, signal)).data,
    );
  }
  return Array.from(new Map(rows.map((row) => [row.id, row])).values());
}
