import { Icon, type IconName } from "./icon";
import { Skeleton } from "./feedback";
export function StatCard({
  label,
  value,
  caption,
  icon,
  tone = "indigo",
  loading,
}: {
  label: string;
  value: string | number;
  caption: string;
  icon: IconName;
  tone?: string;
  loading?: boolean;
}) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <span>{label}</span>
        <span className={`stat-icon tone-${tone}`}>
          <Icon name={icon} size={19} />
        </span>
      </div>
      {loading ? (
        <Skeleton className="mt-3 h-8 w-16" />
      ) : (
        <strong>{value}</strong>
      )}
      <p>{caption}</p>
    </div>
  );
}
