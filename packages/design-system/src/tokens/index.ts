export { colors, type Colors } from "./colors";
export { spacing, type Spacing } from "./spacing";
export { typography, type Typography } from "./typography";

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
  };
}
