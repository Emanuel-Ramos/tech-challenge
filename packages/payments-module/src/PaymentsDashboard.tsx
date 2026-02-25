import { Card, Chart, Button } from "@shipay/design-system";
import type { PaymentSummary, ChartState } from "@shipay/types";
import styles from "./PaymentsDashboard.module.scss";

interface PaymentsDashboardProps {
  data: PaymentSummary[];
  state?: ChartState;
  onRefresh?: () => void;
}

export function PaymentsDashboard({ data, state, onRefresh }: PaymentsDashboardProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const totalRevenue = data.reduce((sum, item) => sum + item.total, 0);
  const totalTransactions = data.reduce((sum, item) => sum + item.count, 0);
  const averageTicket = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

  return (
    <div className={styles.dashboard}>
      <div className={styles["dashboard__header"]}>
        <h2 className={styles["dashboard__title"]}>Payments Dashboard</h2>
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

      <div className={styles["dashboard__stats"]}>
        <Card>
          <div className={styles["dashboard__stat"]}>
            <span className={styles["dashboard__stat-label"]}>Total Revenue</span>
            <span className={styles["dashboard__stat-value"]}>{formatCurrency(totalRevenue)}</span>
          </div>
        </Card>
        <Card>
          <div className={styles["dashboard__stat"]}>
            <span className={styles["dashboard__stat-label"]}>Transactions</span>
            <span className={styles["dashboard__stat-value"]}>{totalTransactions}</span>
          </div>
        </Card>
        <Card>
          <div className={styles["dashboard__stat"]}>
            <span className={styles["dashboard__stat-label"]}>Average Ticket</span>
            <span className={styles["dashboard__stat-value"]}>{formatCurrency(averageTicket)}</span>
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
