"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Icon } from "./icon";

const ToastContext = createContext<
  (message: string, kind?: "success" | "error") => void
>(() => {});
export function useToast() {
  return useContext(ToastContext);
}
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{
    message: string;
    kind: "success" | "error";
  } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const show = useCallback(
    (message: string, kind: "success" | "error" = "success") => {
      if (timer.current) clearTimeout(timer.current);
      setToast({ message, kind });
      timer.current = setTimeout(() => setToast(null), 5000);
    },
    [],
  );
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  return (
    <ToastContext value={show}>
      {children}
      <div className="toast-region" aria-live="polite" aria-atomic="true">
        {toast && (
          <div className={`toast toast-${toast.kind}`} role="status">
            <Icon name={toast.kind === "success" ? "success" : "warning"} />
            <span>{toast.message}</span>
            <button
              className="icon-btn"
              onClick={() => setToast(null)}
              aria-label="Dismiss notification"
            >
              <Icon name="close" size={16} />
            </button>
          </div>
        )}
      </div>
    </ToastContext>
  );
}
