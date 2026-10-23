import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./icon";

export function Button({
  children,
  className,
  variant = "primary",
  loading,
  loadingText,
  disabled,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  loading?: boolean;
  loadingText?: string;
}) {
  return (
    <button
      type={type}
      className={cn("btn", `btn-${variant}`, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Icon name="spinner" size={17} className="spin" />}
      {loading ? (loadingText ?? children) : children}
    </button>
  );
}
