import { createContext, useCallback, useContext, useState } from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import type { M2S2PanelData } from '@m2s2/models';
import './Panel.scss';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface M2S2PanelDataReact extends M2S2PanelData {
  body?: React.ReactNode;
}

interface PanelContextValue {
  panel: (data: M2S2PanelDataReact) => Promise<unknown>;
}

const PanelContext = createContext<PanelContextValue | null>(null);

interface ActivePanel {
  data:    M2S2PanelDataReact;
  resolve: (value: unknown) => void;
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function PanelProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState<ActivePanel | null>(null);

  const panel = useCallback((data: M2S2PanelDataReact): Promise<unknown> => {
    return new Promise(resolve => setActive({ data, resolve }));
  }, []);

  function close(value: unknown) {
    active?.resolve(value);
    setActive(null);
  }

  return (
    <PanelContext.Provider value={{ panel }}>
      {children}
      {active && <PanelUI data={active.data} onClose={close} />}
    </PanelContext.Provider>
  );
}

export function usePanelContext(): PanelContextValue {
  const ctx = useContext(PanelContext);
  if (!ctx) throw new Error('usePanel must be used within a <PanelProvider>');
  return ctx;
}

// ── Panel UI ──────────────────────────────────────────────────────────────────

function PanelUI({ data, onClose }: { data: M2S2PanelDataReact; onClose: (v: unknown) => void }) {
  const side  = data.side ?? 'right';
  const width = data.width ?? '480px';

  return (
    <RadixDialog.Root open onOpenChange={open => { if (!open && !data.modal) onClose(null); }}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="m2s2-panel-overlay" />
        <RadixDialog.Content
          className={`m2s2-panel-content m2s2-panel-content--${side}`}
          style={{ '--panel-width': width } as React.CSSProperties}
          onInteractOutside={e => { if (data.modal) e.preventDefault(); }}
          onEscapeKeyDown={e    => { if (data.modal) e.preventDefault(); }}
        >
          <div className="panel-header">
            <div className="panel-header-text">
              <RadixDialog.Title className="panel-title">{data.title}</RadixDialog.Title>
              {data.subtitle && <p className="panel-subtitle">{data.subtitle}</p>}
            </div>
            {!data.modal && (
              <RadixDialog.Close asChild>
                <button className="panel-close" aria-label="Close">✕</button>
              </RadixDialog.Close>
            )}
          </div>

          <div className="panel-body">
            {data.body
              ? data.body
              : data.message && (
                  <RadixDialog.Description className="panel-message">
                    {data.message}
                  </RadixDialog.Description>
                )}
          </div>

          {data.actions?.length ? (
            <div className="panel-footer">
              {data.actions.map(action => (
                <button
                  key={action.label}
                  className={`panel-btn panel-btn--${action.variant ?? 'secondary'}`}
                  onClick={() => onClose(action.value)}
                >
                  {action.label}
                </button>
              ))}
            </div>
          ) : null}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
