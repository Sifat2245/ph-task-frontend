export type Role = "STUDENT" | "MENTOR" | "ADMIN";
export type ProgressState = "SUBMITTED" | "SKIPPED";
export type SubmissionStatus = "PENDING" | "REVIEWED";

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  studentId: string | null;
  image: string | null;
  emailVerified: boolean;
  createdById: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  user: User;
  session: { id: string; userId: string; expiresAt: string };
}

export interface AuthResult {
  user: User;
  token: string;
  accessToken: string;
  refreshToken: string;
}

export interface Assignment {
  id: string;
  assignmentNumber: number;
  title: string;
  description: string | null;
  maxMarks: number;
  createdAt: string;
  isLocked?: boolean;
  progressState?: ProgressState | null;
}

export interface AssignmentPayload {
  assignmentNumber: number;
  title: string;
  description: string;
  maxMarks: number;
}

export interface Student {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: Pick<
    User,
    | "id"
    | "studentId"
    | "name"
    | "email"
    | "image"
    | "role"
    | "createdAt"
    | "updatedAt"
  >;
}

export interface Review {
  id: string;
  revisionId: string;
  mentorId: string;
  marks: number;
  examineFeedback: string;
  reviewedAt: string;
  mentor?: { id: string; name: string };
}

export interface Revision {
  id: string;
  submissionId: string;
  version: number;
  submissionItems: string;
  note: string;
  submittedAt: string;
  reviews: Review[];
}

export interface Submission {
  id: string;
  studentId: string;
  assignmentId: string;
  status: SubmissionStatus;
  createdAt: string;
  updatedAt: string;
  revisions: Revision[];
}

export interface StaffSubmission extends Submission {
  assignment: Assignment;
  student: { id: string; user: Pick<User, "id" | "name" | "studentId"> };
}

export interface ReviewDetail extends Review {
  mentor: { id: string; name: string };
  revision: Omit<Revision, "reviews"> & {
    submission: Omit<StaffSubmission, "revisions">;
  };
}

export interface SubmissionSkip {
  id: string;
  studentId: string;
  assignmentId: string;
  reason: string;
  skippedAt: string;
}

export interface Progress {
  id: string;
  studentId: string;
  assignmentId: string;
  state: ProgressState;
  updatedAt: string;
}

export interface SubmitPayload {
  assignmentId: string;
  submissionItems: string;
  note: string;
}

export interface SubmitResult {
  submission: Omit<Submission, "revisions">;
  revision: Omit<Revision, "reviews">;
  progress: Progress;
  nextAssignment: Pick<Assignment, "id" | "assignmentNumber" | "title"> | null;
}

export interface SkipResult {
  skip: SubmissionSkip;
  progress: Progress;
  nextAssignment: SubmitResult["nextAssignment"];
}

export interface ReviewPayload {
  revisionId: string;
  marks: number;
  examineFeedback: string;
}

export interface MentorPayload {
  name: string;
  email: string;
  password: string;
  image?: string;
}

export type UpdateMentorPayload = Partial<Omit<MentorPayload, "image">> & {
  image?: string | null;
};
