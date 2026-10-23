import { httpClient } from "@/lib/axios/httpClient";
import type {
  ApiResponse,
  MentorPayload,
  Student,
  UpdateMentorPayload,
  User,
} from "@/types";

export const peopleService = {
  students: (page = 1, limit = 10) =>
    httpClient.get<ApiResponse<Student[]>>("/api/v1/student/get-all-students", {
      params: { page, limit },
    }),
  student: (id: string) =>
    httpClient.get<ApiResponse<Student>>(
      `/api/v1/student/get-single-student/${id}`,
    ),
  mentors: () =>
    httpClient.get<ApiResponse<User[]>>("/api/v1/user/get-all-mentors"),
  createMentor: (body: MentorPayload) =>
    httpClient.post<ApiResponse<User>>("/api/v1/user/create-mentor", body),
  updateMentor: ({ id, ...body }: UpdateMentorPayload & { id: string }) =>
    httpClient.put<ApiResponse<User>>(`/api/v1/user/update-mentor/${id}`, body),
  deleteMentor: (id: string) =>
    httpClient.delete<ApiResponse<User>>(`/api/v1/user/delete-mentor/${id}`),
};
