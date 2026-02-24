import type { ReactNode } from "react";

// Tenant Types
export interface TenantTheme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  borderRadius: string;
}

export interface TenantConfig {
  id: string;
  name: string;
  logo: string;
  theme: TenantTheme;
}

// Chart Types
export interface ChartState {
  loading?: boolean;
  error?: Error | string | null;
  empty?: {
    message: string;
    icon?: ReactNode;
  };
}

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface ChartProps<T> {
  data: T[];
  state?: ChartState;
  mapDataPoint: (item: T) => ChartDataPoint;
  formatValue?: (value: number) => string;
  title?: string;
  "aria-label"?: string;
  height?: number;
}

// Payment Types
export interface PaymentSummary {
  period: string;
  total: number;
  count: number;
}

// Component Props
export interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  "aria-label"?: string;
  className?: string;
}

export interface CardProps {
  children: ReactNode;
  title?: string;
  className?: string;
}
