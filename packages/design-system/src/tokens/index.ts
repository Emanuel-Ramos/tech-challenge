export { colors, type Colors } from "./colors";
export { spacing, type Spacing } from "./spacing";
export { typography, type Typography } from "./typography";

/**
 * Adjusts hex color opacity by converting to rgba.
 */
function hexToRgba(hex: string, alpha: number): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return hex;
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * CSS custom properties generator for tenant theming.
 * This creates CSS variables from the tenant theme configuration.
 */
export function generateCSSVariables(theme: {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  borderRadius: string;
}): Record<string, string> {
  return {
    "--color-primary": theme.primaryColor,
    "--color-secondary": theme.secondaryColor,
    "--color-background": theme.backgroundColor,
    "--color-text": theme.textColor,
    "--border-radius": theme.borderRadius,
    "--color-text-secondary": hexToRgba(theme.textColor, 0.7),
    "--color-background-secondary": hexToRgba(theme.backgroundColor, 0.95),
    "--color-text-inverse": theme.backgroundColor,
    "--transition-fast": "150ms ease",
    "--border-radius-sm": "0.25rem",
  };
}
