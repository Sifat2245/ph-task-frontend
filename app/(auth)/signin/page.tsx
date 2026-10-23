import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthPageSkeleton } from "@/components/ui/page-skeletons";
export const metadata = { title: "Sign in" };
export default function SignInPage() {
  return (
    <Suspense fallback={<AuthPageSkeleton />}>
      <AuthForm mode="signin" />
    </Suspense>
  );
}
