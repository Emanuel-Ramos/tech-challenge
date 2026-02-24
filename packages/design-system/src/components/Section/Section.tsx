import type { ReactNode } from "react";
import styles from "./Section.module.scss";

interface SectionProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "muted" | "primary";
  size?: "sm" | "md" | "lg";
  as?: "section" | "div" | "main" | "article";
}

/**
 * Section component provides consistent container sizing and padding.
 * Use this to wrap page sections for proper responsive layout.
 */
export function Section({
  children,
  className,
  variant = "default",
  size = "md",
  as: Component = "section",
}: SectionProps) {
  const classNames = [
    styles.section,
    styles[`section--${variant}`],
    styles[`section--${size}`],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component className={classNames}>
      <div className={styles["section__container"]}>{children}</div>
    </Component>
  );
}
