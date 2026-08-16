import { ReactNode } from "react";
import { ToastKind } from "@m2s2/models";
import "./Toast.scss";

interface ToastProps {
  kind?: ToastKind;
  onDismiss: () => void;
  children: ReactNode;
}

export function Toast({ kind = "info", onDismiss, children }: ToastProps) {
  return (
    <div
      className="m2s2-toast"
      role={kind === "error" ? "alert" : "status"}
      data-kind={kind}
    >
      <div className="toast-body">{children}</div>
      <button className="toast-close" onClick={onDismiss} aria-label="Dismiss">
        ×
      </button>
    </div>
  );
}
