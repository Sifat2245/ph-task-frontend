import Link from "next/link";
import { errorMessage } from "@/lib/api-error";
import { Button } from "./button";
import { Icon, type IconName } from "./icon";

export function ErrorState({
  error,
  retry,
}: {
  error: unknown;
  retry?: () => void;
}) {
  return (
    <div className="error-state" role="alert">
      <Icon name="warning" size={24} />
      <div>
        <h3>We couldn’t load this</h3>
        <p>{errorMessage(error)}</p>
      </div>
      {retry && (
        <Button variant="secondary" onClick={retry}>
          Try again
        </Button>
      )}
    </div>
  );
}
export function EmptyState({
  title,
  description,
  icon = "submissions",
  action,
}: {
  title: string;
  description: string;
  icon?: IconName;
  action?: { href: string; label: string };
}) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Icon name={icon} size={28} />
      </span>
      <h3>{title}</h3>
      <p>{description}</p>
      {action && (
        <Link className="btn btn-primary" href={action.href}>
          {action.label}
          <Icon name="arrow" size={16} />
        </Link>
      )}
    </div>
  );
}
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton ${className}`} aria-hidden="true" />;
}
export function PageSkeleton() {
  return (
    <div className="page-stack" role="status" aria-label="Loading page">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-80 max-w-full" />
      <div className="stat-grid">
        {[1, 2, 3, 4].map((n) => (
          <Skeleton key={n} className="h-28 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-80 rounded-2xl" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
export function InlineError({ message }: { message?: string }) {
  return message ? (
    <p className="form-error" role="alert">
      <Icon name="warning" size={16} />
      {message}
    </p>
  ) : null;
}
