import { Card, Chart, Button } from "@shipay/design-system";
import type { PaymentSummary, ChartState } from "@shipay/types";
import styles from "./PaymentsDashboard.module.css";

interface PaymentsDashboardProps {
  data: PaymentSummary[];
  state?: ChartState;
  onRefresh?: () => void;
}

/**
 * Payments Dashboard microfrontend component.
 * Displays a chart of payment summaries with loading, error, and empty states.
 */
export function PaymentsDashboard({
  data,
  state,
  onRefresh,
}: PaymentsDashboardProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const totalRevenue = data.reduce((sum, item) => sum + item.total, 0);
  const totalTransactions = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h2 className={styles.title}>Payments Dashboard</h2>
        {onRefresh && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onRefresh}
            aria-label="Refresh payments data"
          >
            Refresh
          </Button>
        )}
      </div>

      <div className={styles.stats}>
        <Card>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Total Revenue</span>
            <span className={styles.statValue}>{formatCurrency(totalRevenue)}</span>
          </div>
        </Card>
        <Card>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Transactions</span>
            <span className={styles.statValue}>{totalTransactions}</span>
          </div>
        </Card>
      </div>

      <Chart<PaymentSummary>
        data={data}
        state={state}
        mapDataPoint={(item) => ({
          label: item.period,
          value: item.total,
        })}
        formatValue={formatCurrency}
        title="Revenue by Period"
        aria-label="Bar chart showing revenue by period"
        height={350}
      />
    </div>
  );
}
