"use client";

import { createContext, useContext, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useMe } from "@/hooks/use-auth";
import { ErrorState, PageSkeleton } from "@/components/ui/feedback";
import { ApiError } from "@/lib/api-error";
import type { Role, User } from "@/types";

const UserContext = createContext<User | null>(null);
export function useAuth() {
  const user = useContext(UserContext);
  if (!user) throw new Error("useAuth must be used within AuthGuard.");
  return user;
}

export function AuthGuard({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: User;
}) {
  const { data: user, isPending, error, refetch } = useMe();
  const unauthorized =
    !isPending &&
    ((!user && !error) ||
      (error instanceof ApiError && error.statusCode === 401));
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    const signIn = () => {
      router.replace(`/signin?next=${encodeURIComponent(pathname)}`);
      router.refresh();
    };
    window.addEventListener("submitly:unauthorized", signIn);
    if (unauthorized) signIn();
    return () => window.removeEventListener("submitly:unauthorized", signIn);
  }, [unauthorized, pathname, router]);
  if (unauthorized) return <PageSkeleton />;
  if (error && !user)
    return <ErrorState error={error} retry={() => refetch()} />;
  return <UserContext value={user ?? initialUser}>{children}</UserContext>;
}

export function RoleGuard({
  roles,
  children,
}: {
  roles: readonly Role[];
  children: React.ReactNode;
}) {
  const user = useAuth();
  if (!roles.includes(user.role))
    return (
      <div className="empty-state">
        <h2>Access restricted</h2>
        <p>Your role does not have access to this page.</p>
      </div>
    );
  return children;
}
