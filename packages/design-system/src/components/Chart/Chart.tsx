import type { ChartProps } from "@shipay/types";
import styles from "./Chart.module.css";

/**
 * Generic Chart component with loading, empty, and error states.
 * Uses a simple bar chart visualization that can be replaced with Recharts.
 *
 * @example
 * <Chart
 *   data={transactions}
 *   mapDataPoint={(t) => ({ label: t.date, value: t.amount })}
 *   formatValue={(v) => `R$ ${v.toFixed(2)}`}
 *   title="Monthly Revenue"
 *   aria-label="Bar chart showing monthly revenue"
 * />
 */
export function Chart<T>({
  data,
  state,
  mapDataPoint,
  formatValue = (v) => v.toString(),
  title,
  "aria-label": ariaLabel,
  height = 300,
}: ChartProps<T>) {
  // Loading state
  if (state?.loading) {
    return (
      <div
        className={styles.container}
        style={{ height }}
        role="img"
        aria-label={ariaLabel || "Loading chart"}
        aria-busy="true"
      >
        {title && <h4 className={styles.title}>{title}</h4>}
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} aria-hidden="true" />
          <span className={styles.loadingText}>Loading...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (state?.error) {
    const errorMessage =
      typeof state.error === "string" ? state.error : state.error.message;

    return (
      <div
        className={styles.container}
        style={{ height }}
        role="img"
        aria-label={ariaLabel || `Chart error: ${errorMessage}`}
      >
        {title && <h4 className={styles.title}>{title}</h4>}
        <div className={styles.errorContainer}>
          <svg
            className={styles.errorIcon}
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path
              d="M12 8v4m0 4h.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <span className={styles.errorText}>{errorMessage}</span>
        </div>
      </div>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div
        className={styles.container}
        style={{ height }}
        role="img"
        aria-label={ariaLabel || "Empty chart"}
      >
        {title && <h4 className={styles.title}>{title}</h4>}
        <div className={styles.emptyContainer}>
          {state?.empty?.icon || (
            <svg
              className={styles.emptyIcon}
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 3v18h18M7 14v3m4-6v6m4-9v9m4-4v4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          <span className={styles.emptyText}>
            {state?.empty?.message || "No data available"}
          </span>
        </div>
      </div>
    );
  }

  // Data state - render bar chart
  const dataPoints = data.map(mapDataPoint);
  const maxValue = Math.max(...dataPoints.map((d) => d.value));

  return (
    <div
      className={styles.container}
      style={{ height }}
      role="img"
      aria-label={
        ariaLabel ||
        `Bar chart${title ? ` showing ${title}` : ""} with ${dataPoints.length} data points`
      }
    >
      {title && <h4 className={styles.title}>{title}</h4>}
      <div className={styles.chartArea}>
        <div className={styles.bars}>
          {dataPoints.map((point, index) => {
            const barHeight = maxValue > 0 ? (point.value / maxValue) * 100 : 0;

            return (
              <div key={index} className={styles.barGroup}>
                <div className={styles.barValue}>{formatValue(point.value)}</div>
                <div className={styles.barWrapper}>
                  <div
                    className={styles.bar}
                    style={{
                      height: `${barHeight}%`,
                      backgroundColor: point.color || "var(--color-primary)",
                    }}
                    role="presentation"
                  />
                </div>
                <div className={styles.barLabel}>{point.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
