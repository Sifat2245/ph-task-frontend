"use client";
import { ErrorState } from "@/components/ui/feedback";
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="standalone-error">
      <ErrorState error={error} retry={reset} />
    </main>
  );
}
