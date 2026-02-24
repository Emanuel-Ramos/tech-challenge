import type { ReactNode } from "react";
import type { TenantTheme } from "@shipay/types";
import { generateCSSVariables } from "../../tokens";

interface ThemeProviderProps {
  theme: TenantTheme;
  children: ReactNode;
}

/**
 * ThemeProvider applies tenant-specific CSS variables to the app.
 * Wrap your application with this component to enable multi-tenant theming.
 */
export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  const cssVariables = generateCSSVariables(theme);

  return <div style={cssVariables as React.CSSProperties}>{children}</div>;
}
