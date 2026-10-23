import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthPageSkeleton } from "@/components/ui/page-skeletons";
export const metadata = { title: "Create an account" };
export default function SignUpPage() {
  return (
    <Suspense fallback={<AuthPageSkeleton />}>
      <AuthForm mode="signup" />
    </Suspense>
  );
}
