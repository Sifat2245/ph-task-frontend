import { httpClient } from "@/lib/axios/httpClient";
import type { ApiResponse, Assignment, AssignmentPayload } from "@/types";

export const assignmentService = {
  list: () =>
    httpClient.get<ApiResponse<Assignment[]>>(
      "/api/v1/assignment/get-all-assignments",
    ),
  get: (id: string) =>
    httpClient.get<ApiResponse<Assignment>>(
      `/api/v1/assignment/get-single-assignment/${id}`,
    ),
  create: (body: AssignmentPayload) =>
    httpClient.post<ApiResponse<Assignment>>(
      "/api/v1/assignment/create-assignment",
      body,
    ),
  update: ({ id, ...body }: Partial<AssignmentPayload> & { id: string }) =>
    httpClient.put<ApiResponse<Assignment>>(
      `/api/v1/assignment/update-assignment/${id}`,
      body,
    ),
  remove: (id: string) =>
    httpClient.delete<ApiResponse<Assignment>>(
      `/api/v1/assignment/delete-assignment/${id}`,
    ),
};
