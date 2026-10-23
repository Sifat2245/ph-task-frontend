import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ApiError } from "@/lib/api-error";
import { httpClient } from "@/lib/axios/httpClient";
import type { ApiResponse, Assignment, AuthSession, Role } from "@/types";

function isAuthCookie(name: string) {
  return (
    ["accessToken", "refreshToken", "betterAuthSession"].includes(name) ||
    name.startsWith("better-auth.") ||
    name.startsWith("__Secure-better-auth.")
  );
}

export async function serverGet<T>(path: string): Promise<T> {
  const jar = await cookies();
  try {
    return await httpClient.get<T>(path, {
      headers: {
        Cookie: jar
          .getAll()
          .filter((cookie) => isAuthCookie(cookie.name))
          .map(({ name, value }) => `${name}=${value}`)
          .join("; "),
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(15_000),
    });
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      "Unable to reach Submitly. Please check that the backend is running.",
      503,
    );
  }
}

export const getServerAssignments = cache(() =>
  serverGet<ApiResponse<Assignment[]>>(
    "/api/v1/assignment/get-all-assignments",
  ),
);

export const getCurrentUser = cache(async () => {
  const jar = await cookies();
  if (!jar.has("accessToken")) return null;
  try {
    const session = await serverGet<AuthSession | null>(
      "/api/auth/get-session?disableCookieCache=true&disableRefresh=true",
    );
    if (
      !session?.user ||
      !["STUDENT", "MENTOR", "ADMIN"].includes(session.user.role)
    )
      return null;
    await getServerAssignments();
    return session.user;
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 401) return null;
    throw error;
  }
});

export async function requireUser(roles?: readonly Role[]) {
  const user = await getCurrentUser();
  if (!user) redirect("/signin");
  if (roles && !roles.includes(user.role)) redirect("/dashboard");
  return user;
}
