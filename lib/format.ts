export function formatDate(value?: string, withTime = false) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
    ...(withTime ? ({ hour: "numeric", minute: "2-digit" } as const) : {}),
  }).format(new Date(value));
}

export function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export function safeNext(path: string | null) {
  return path?.startsWith("/dashboard") && !path.startsWith("//")
    ? path
    : "/dashboard";
}
