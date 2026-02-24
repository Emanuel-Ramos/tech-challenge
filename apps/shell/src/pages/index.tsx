import type { InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useState, useCallback } from "react";
import type { PaymentSummary, ChartState } from "@shipay/types";
import { ThemeProvider } from "@shipay/design-system";
import { BlockRenderer } from "@/components/BlockRenderer";
import { withTenant, type TenantPageProps } from "@/lib/tenant";

// Mock payment data - in production this would come from an API
const mockPaymentData: PaymentSummary[] = [
  { period: "Jan", total: 12500, count: 45 },
  { period: "Feb", total: 18200, count: 62 },
  { period: "Mar", total: 15800, count: 53 },
  { period: "Apr", total: 22100, count: 78 },
  { period: "May", total: 19500, count: 67 },
  { period: "Jun", total: 25300, count: 89 },
];

// Using withTenant helper for cleaner SSR
export const getServerSideProps = withTenant<TenantPageProps>();

export default function Home({
  tenant,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [paymentData, setPaymentData] = useState<PaymentSummary[]>(mockPaymentData);
  const [chartState, setChartState] = useState<ChartState>({});

  const handleRefresh = useCallback(() => {
    setChartState({ loading: true });

    setTimeout(() => {
      const newData = mockPaymentData.map((item) => ({
        ...item,
        total: item.total + Math.floor(Math.random() * 1000 - 500),
        count: item.count + Math.floor(Math.random() * 10 - 5),
      }));
      setPaymentData(newData);
      setChartState({});
    }, 1000);
  }, []);

  return (
    <>
      <Head>
        <title>{tenant.name}</title>
        <meta
          name="description"
          content={`${tenant.name} - Payment Management Platform`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeProvider theme={tenant.theme}>
        <div className="app">
          <BlockRenderer
            blocks={tenant.layout}
            tenant={tenant}
            paymentData={paymentData}
            paymentState={chartState}
            onRefreshPayments={handleRefresh}
          />
        </div>
      </ThemeProvider>
    </>
  );
}
