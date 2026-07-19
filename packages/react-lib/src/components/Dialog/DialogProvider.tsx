import { createContext, useCallback, useContext, useState } from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import type { M2S2DialogData } from "@m2s2/models";
import "./Dialog.scss";

// ── Context ───────────────────────────────────────────────────────────────────

interface DialogContextValue {
  dialog: (data: M2S2DialogData) => Promise<unknown>;
  confirm: (title: string, message?: string) => Promise<boolean>;
}

const DialogContext = createContext<DialogContextValue | null>(null);

interface ActiveDialog {
  data: M2S2DialogData;
  resolve: (value: unknown) => void;
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState<ActiveDialog | null>(null);

  const dialog = useCallback((data: M2S2DialogData): Promise<unknown> => {
    return new Promise((resolve) => setActive({ data, resolve }));
  }, []);

  const confirm = useCallback(
    (title: string, message?: string): Promise<boolean> => {
      return dialog({
        title,
        message,
        actions: [
          { label: "Cancel", value: false, variant: "secondary" },
          { label: "Confirm", value: true, variant: "primary" },
        ],
      }) as Promise<boolean>;
    },
    [dialog],
  );

  function close(value: unknown) {
    active?.resolve(value);
    setActive(null);
  }

  return (
    <DialogContext.Provider value={{ dialog, confirm }}>
      {children}
      {active && <DialogUI data={active.data} onClose={close} />}
    </DialogContext.Provider>
  );
}

export function useDialogContext(): DialogContextValue {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("useDialog must be used within a <DialogProvider>");
  return ctx;
}

// ── Dialog UI ─────────────────────────────────────────────────────────────────

function DialogUI({
  data,
  onClose,
}: {
  data: M2S2DialogData;
  onClose: (v: unknown) => void;
}) {
  return (
    <RadixDialog.Root
      open
      onOpenChange={(open) => {
        if (!open && !data.modal) onClose(null);
      }}
    >
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="m2s2-dialog-overlay" />
        <RadixDialog.Content
          className="m2s2-dialog-content"
          onInteractOutside={(e) => {
            if (data.modal) e.preventDefault();
          }}
          onEscapeKeyDown={(e) => {
            if (data.modal) e.preventDefault();
          }}
        >
          <div className="dialog-header">
            <RadixDialog.Title className="dialog-title">
              {data.title}
            </RadixDialog.Title>
            {!data.modal && (
              <RadixDialog.Close asChild>
                <button className="dialog-close" aria-label="Close">
                  ✕
                </button>
              </RadixDialog.Close>
            )}
          </div>

          {data.message && (
            <div className="dialog-body">
              <RadixDialog.Description className="dialog-message">
                {data.message}
              </RadixDialog.Description>
            </div>
          )}

          <div className="dialog-footer">
            {data.actions.map((action) => (
              <button
                key={action.label}
                className={`dialog-btn dialog-btn--${action.variant ?? "secondary"}`}
                onClick={() => onClose(action.value)}
              >
                {action.label}
              </button>
            ))}
          </div>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
