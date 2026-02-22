/**
 * Base color tokens for the design system.
 * These are the foundation colors that tenant themes can override.
 */
export const colors = {
  // Neutral colors
  white: "#ffffff",
  black: "#000000",
  gray: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#e5e5e5",
    300: "#d4d4d4",
    400: "#a3a3a3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
  },

  // Brand colors (defaults, overridden by tenant)
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
  },

  // Semantic colors
  success: {
    light: "#86efac",
    main: "#22c55e",
    dark: "#16a34a",
  },
  warning: {
    light: "#fde047",
    main: "#eab308",
    dark: "#ca8a04",
  },
  error: {
    light: "#fca5a5",
    main: "#ef4444",
    dark: "#dc2626",
  },
  info: {
    light: "#93c5fd",
    main: "#3b82f6",
    dark: "#2563eb",
  },
} as const;

export type Colors = typeof colors;
