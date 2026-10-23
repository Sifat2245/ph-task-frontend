import { Button } from "./button";
import { Icon } from "./icon";
import type { PaginationMeta } from "@/types";

export function Pagination({
  meta,
  onPage,
  onLimit,
  busy,
}: {
  meta?: PaginationMeta;
  onPage: (page: number) => void;
  onLimit: (limit: number) => void;
  busy?: boolean;
}) {
  if (!meta) return null;
  const { page, limit, total, totalPages } = meta;
  return (
    <div className="pagination">
      <div className="pagination-summary">
        <span>
          {total === 0
            ? "No results"
            : page > totalPages
              ? `0 of ${total}`
              : `${(page - 1) * limit + (page > totalPages ? 0 : 1)}–${Math.min(page * limit, total)} of ${total}`}
        </span>
        <label className="page-size">
          <span className="sr-only">Rows per page</span>
          <select
            value={limit}
            onChange={(e) => onLimit(Number(e.target.value))}
            disabled={busy}
          >
            {[10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="pagination-buttons">
        <Button
          variant="secondary"
          disabled={page <= 1 || busy}
          onClick={() => onPage(page - 1)}
          aria-label="Previous page"
        >
          <Icon name="left" size={16} />
        </Button>
        <span>
          Page {page} of {Math.max(1, totalPages)}
        </span>
        <Button
          variant="secondary"
          disabled={page >= totalPages || busy}
          onClick={() => onPage(page + 1)}
          aria-label="Next page"
        >
          <Icon name="right" size={16} />
        </Button>
      </div>
    </div>
  );
}
