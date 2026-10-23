import { httpClient } from "@/lib/axios/httpClient";
import type {
  ApiResponse,
  SkipResult,
  Submission,
  SubmissionSkip,
  SubmitPayload,
  SubmitResult,
} from "@/types";

export const submissionService = {
  submit: (body: SubmitPayload) =>
    httpClient.post<ApiResponse<SubmitResult>>(
      "/api/v1/assignment-submission/submit-assignment",
      body,
    ),
  skip: (body: { assignmentId: string; reason: string }) =>
    httpClient.post<ApiResponse<SkipResult>>(
      "/api/v1/submission-skip/skip-assignment",
      body,
    ),
  mine: (id: string) =>
    httpClient.get<ApiResponse<Submission>>(
      `/api/v1/assignment-submission/get-my-submission/${id}`,
    ),
  mySkip: (id: string) =>
    httpClient.get<ApiResponse<SubmissionSkip>>(
      `/api/v1/submission-skip/get-my-skip/${id}`,
    ),
};
