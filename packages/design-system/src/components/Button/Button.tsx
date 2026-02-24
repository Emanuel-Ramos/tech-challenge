import type { ButtonProps } from "@shipay/types";
import styles from "./Button.module.scss";

export function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  onClick,
  type = "button",
  "aria-label": ariaLabel,
  className,
}: ButtonProps) {
  const classNames = [
    styles.button,
    styles[`button--${variant}`],
    styles[`button--${size}`],
    loading && styles["button--loading"],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classNames}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading}
    >
      {loading && (
        <span className={styles["button__spinner"]} aria-hidden="true">
          <svg
            className={styles["button__spinner-icon"]}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="31.4 31.4"
            />
          </svg>
        </span>
      )}
      <span className={loading ? styles["button__text--hidden"] : undefined}>{children}</span>
    </button>
  );
}
