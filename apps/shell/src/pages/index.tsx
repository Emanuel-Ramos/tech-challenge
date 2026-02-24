import type { InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useState, useCallback } from "react";
import type { PaymentSummary, ChartState } from "@shipay/types";
import { ThemeProvider } from "@shipay/design-system";
import { PaymentsDashboard } from "@shipay/payments-module";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { withTenant, getMockPaymentData, type TenantPageProps } from "@/lib/tenant";

interface HomePageProps extends TenantPageProps {
  initialPaymentData: PaymentSummary[];
}

export const getServerSideProps = withTenant<HomePageProps>((_ctx, tenant) => ({
  initialPaymentData: getMockPaymentData(tenant.id),
}));

export default function Home({
  tenant,
  initialPaymentData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [paymentData, setPaymentData] = useState<PaymentSummary[]>(initialPaymentData);
  const [chartState, setChartState] = useState<ChartState>({});

  const handleRefresh = useCallback(() => {
    setChartState({ loading: true });

    // Simulate API refresh with slight random variation
    setTimeout(() => {
      const newData = initialPaymentData.map((item) => ({
        ...item,
        total: item.total + Math.floor(Math.random() * 2000 - 1000),
        count: item.count + Math.floor(Math.random() * 20 - 10),
      }));
      setPaymentData(newData);
      setChartState({});
    }, 1000);
  }, [initialPaymentData]);

  return (
    <>
      <Head>
        <title>{tenant.name}</title>
        <meta name="description" content={`${tenant.name} - Payment Management Platform`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeProvider theme={tenant.theme}>
        <div className="app">
          <Header logo={tenant.logo} tenantName={tenant.name} />
          <Hero title={`Welcome to ${tenant.name}`} subtitle="Your payment management solution" />
          <PaymentsDashboard data={paymentData} state={chartState} onRefresh={handleRefresh} />
          <Footer copyright={`2024 ${tenant.name}. All rights reserved.`} />
        </div>
      </ThemeProvider>
    </>
  );
}
