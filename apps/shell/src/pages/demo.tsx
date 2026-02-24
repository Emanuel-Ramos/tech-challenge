import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useState } from "react";
import type { TenantConfig, PaymentSummary } from "@shipay/types";
import { ThemeProvider, Button, Card, Chart } from "@shipay/design-system";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getTenantConfig } from "@/lib/tenant";

interface PageProps {
  tenant: TenantConfig;
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (ctx) => {
  const tenant = await getTenantConfig(ctx);
  return { props: { tenant } };
};

const sampleData: PaymentSummary[] = [
  { period: "Jan", total: 12500, count: 45 },
  { period: "Feb", total: 18200, count: 62 },
  { period: "Mar", total: 15800, count: 53 },
  { period: "Apr", total: 22100, count: 78 },
];

export default function Demo({
  tenant,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [chartMode, setChartMode] = useState<
    "data" | "loading" | "error" | "empty"
  >("data");

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  return (
    <>
      <Head>
        <title>Component Demo - {tenant.name}</title>
        <meta name="description" content="Design System component demonstration" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <ThemeProvider theme={tenant.theme}>
        <div className="app">
          <Header
            logo={tenant.logo}
            tenantName={tenant.name}
            showLogo={true}
          />

          <main className="main">
            <h1 style={{ marginBottom: "var(--spacing-8)" }}>
              Component Demo
            </h1>

            {/* Buttons Section */}
            <Card title="Button Component">
              <div
                style={{
                  display: "flex",
                  gap: "var(--spacing-4)",
                  flexWrap: "wrap",
                  marginBottom: "var(--spacing-4)",
                }}
              >
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "var(--spacing-4)",
                  flexWrap: "wrap",
                  marginBottom: "var(--spacing-4)",
                }}
              >
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "var(--spacing-4)",
                  flexWrap: "wrap",
                }}
              >
                <Button disabled>Disabled</Button>
                <Button loading>Loading</Button>
              </div>
            </Card>

            {/* Chart Section */}
            <div style={{ marginTop: "var(--spacing-8)" }}>
              <Card title="Chart Component States">
                <div
                  style={{
                    display: "flex",
                    gap: "var(--spacing-2)",
                    marginBottom: "var(--spacing-4)",
                    flexWrap: "wrap",
                  }}
                >
                  <Button
                    size="sm"
                    variant={chartMode === "data" ? "primary" : "secondary"}
                    onClick={() => setChartMode("data")}
                  >
                    Data
                  </Button>
                  <Button
                    size="sm"
                    variant={chartMode === "loading" ? "primary" : "secondary"}
                    onClick={() => setChartMode("loading")}
                  >
                    Loading
                  </Button>
                  <Button
                    size="sm"
                    variant={chartMode === "error" ? "primary" : "secondary"}
                    onClick={() => setChartMode("error")}
                  >
                    Error
                  </Button>
                  <Button
                    size="sm"
                    variant={chartMode === "empty" ? "primary" : "secondary"}
                    onClick={() => setChartMode("empty")}
                  >
                    Empty
                  </Button>
                </div>

                <Chart<PaymentSummary>
                  data={chartMode === "empty" ? [] : sampleData}
                  state={
                    chartMode === "loading"
                      ? { loading: true }
                      : chartMode === "error"
                        ? { error: "Failed to load payment data. Please try again." }
                        : chartMode === "empty"
                          ? { empty: { message: "No payments found for this period" } }
                          : undefined
                  }
                  mapDataPoint={(item) => ({
                    label: item.period,
                    value: item.total,
                  })}
                  formatValue={formatCurrency}
                  title="Revenue by Period"
                  aria-label="Bar chart showing revenue by period"
                  height={300}
                />
              </Card>
            </div>

            {/* Tenant Info */}
            <div style={{ marginTop: "var(--spacing-8)" }}>
              <Card title="Current Tenant">
                <p>
                  <strong>ID:</strong> {tenant.id}
                </p>
                <p>
                  <strong>Name:</strong> {tenant.name}
                </p>
                <p>
                  <strong>Primary Color:</strong> {tenant.theme.primaryColor}
                </p>
                <p style={{ marginTop: "var(--spacing-4)" }}>
                  Try switching tenants by adding <code>?tenant=tenant-a</code> or{" "}
                  <code>?tenant=tenant-b</code> to the URL.
                </p>
              </Card>
            </div>
          </main>

          <Footer copyright={`${new Date().getFullYear()} ${tenant.name}`} />
        </div>
      </ThemeProvider>
    </>
  );
}
