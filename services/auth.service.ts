import { httpClient } from "@/lib/axios/httpClient";
import type { ApiResponse, AuthResult, AuthSession } from "@/types";

export interface SignInPayload {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
}

export const authService = {
  signIn: (body: SignInPayload) =>
    httpClient.post<ApiResponse<AuthResult>>("/api/v1/auth/signin", body),
  signUp: (body: SignUpPayload) =>
    httpClient.post<ApiResponse<AuthResult>>("/api/v1/auth/signup", body),
  logout: () =>
    httpClient.post<ApiResponse<{ success: boolean }>>(
      "/api/v1/auth/logout",
      {},
    ),
  // Better Auth returns a native session object, without the custom API envelope.
  me: async () => {
    const session = await httpClient.get<AuthSession | null>(
      "/api/auth/get-session",
      {
        params: { disableCookieCache: true, disableRefresh: true },
      },
    );
    return session?.user ?? null;
  },
};
