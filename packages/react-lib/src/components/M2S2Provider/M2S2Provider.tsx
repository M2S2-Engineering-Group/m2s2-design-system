import { ThemeProvider, type Theme } from "../ThemeProvider/ThemeProvider";
import { DialogProvider } from "../Dialog/DialogProvider";
import { PanelProvider } from "../Panel/PanelProvider";

interface M2S2ProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

export function M2S2Provider({ children, defaultTheme }: M2S2ProviderProps) {
  return (
    <ThemeProvider defaultTheme={defaultTheme}>
      <DialogProvider>
        <PanelProvider>{children}</PanelProvider>
      </DialogProvider>
    </ThemeProvider>
  );
}
