import { Icon } from "./icon";
export type DisplayStatus =
  "LOCKED" | "AVAILABLE" | "PENDING" | "SUBMITTED" | "REVIEWED" | "SKIPPED";
const labels: Record<DisplayStatus, string> = {
  LOCKED: "Locked",
  AVAILABLE: "Ready to start",
  PENDING: "Pending review",
  SUBMITTED: "Submitted",
  REVIEWED: "Reviewed",
  SKIPPED: "Skipped",
};
export function StatusBadge({ status }: { status: DisplayStatus }) {
  return (
    <span className={`badge status-${status.toLowerCase()}`}>
      {status === "LOCKED" ? (
        <Icon name="lock" size={12} />
      ) : (
        <span className="status-dot" />
      )}
      {labels[status]}
    </span>
  );
}
