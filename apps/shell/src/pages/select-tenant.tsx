import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button, Card, ThemeProvider } from "@shipay/design-system";
import type { TenantConfig } from "@shipay/types";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  getTenantConfig,
  getAllowedTenants,
  loadTenantConfig,
} from "@/lib/tenant";
import styles from "@/styles/SelectTenant.module.scss";

interface TenantOption {
  id: string;
  name: string;
  primaryColor: string;
}

interface PageProps {
  currentTenant: TenantConfig;
  availableTenants: TenantOption[];
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (ctx) => {
  const currentTenant = await getTenantConfig(ctx);
  const allowedIds = getAllowedTenants();

  // Load preview info for each tenant
  const availableTenants: TenantOption[] = await Promise.all(
    allowedIds.map(async (id) => {
      const config = await loadTenantConfig(id);
      return {
        id,
        name: config.name,
        primaryColor: config.theme.primaryColor,
      };
    })
  );

  return {
    props: {
      currentTenant,
      availableTenants,
    },
  };
};

export default function SelectTenant({
  currentTenant,
  availableTenants,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSelectTenant = async (tenantId: string) => {
    setLoading(tenantId);
    setError(null);

    try {
      const response = await fetch("/api/tenant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenant: tenantId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to set tenant");
      }

      // Redirect to home with new tenant
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setLoading(null);
    }
  };

  const handleClearTenant = async () => {
    setLoading("clear");
    setError(null);

    try {
      await fetch("/api/tenant", { method: "DELETE" });
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setLoading(null);
    }
  };

  return (
    <>
      <Head>
        <title>Select Tenant - {currentTenant.name}</title>
        <meta name="description" content="Select your organization" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <ThemeProvider theme={currentTenant.theme}>
        <div className="app">
          <Header
            logo={currentTenant.logo}
            tenantName={currentTenant.name}
            showLogo={true}
          />

          <main className="main">
            <div className={styles["select-tenant"]}>
              <h1 className={styles["select-tenant__title"]}>
                Select Your Organization
              </h1>
              <p className={styles["select-tenant__subtitle"]}>
                Choose a tenant to customize your experience. Your selection
                will be securely stored in a cookie.
              </p>

              {error && (
                <div className={styles["select-tenant__error"]} role="alert">
                  {error}
                </div>
              )}

              <div className={styles["select-tenant__grid"]}>
                {availableTenants.map((tenant) => (
                  <Card key={tenant.id}>
                    <div className={styles["select-tenant__card"]}>
                      <div
                        className={styles["select-tenant__color-preview"]}
                        style={{ backgroundColor: tenant.primaryColor }}
                        aria-hidden="true"
                      />
                      <h3 className={styles["select-tenant__tenant-name"]}>
                        {tenant.name}
                      </h3>
                      <p className={styles["select-tenant__tenant-id"]}>
                        ID: {tenant.id}
                      </p>
                      <Button
                        variant={
                          currentTenant.id === tenant.id ? "secondary" : "primary"
                        }
                        onClick={() => handleSelectTenant(tenant.id)}
                        loading={loading === tenant.id}
                        disabled={loading !== null}
                        aria-label={`Select ${tenant.name}`}
                      >
                        {currentTenant.id === tenant.id ? "Current" : "Select"}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              <div className={styles["select-tenant__actions"]}>
                <Button
                  variant="ghost"
                  onClick={handleClearTenant}
                  loading={loading === "clear"}
                  disabled={loading !== null}
                >
                  Clear Selection (Use Default)
                </Button>
              </div>

              <Card title="How Tenant Resolution Works">
                <div className={styles["select-tenant__info"]}>
                  <p>
                    <strong>Priority Order:</strong>
                  </p>
                  <ol>
                    <li>
                      <strong>Subdomain</strong> (production):{" "}
                      <code>tenant-a.shipay.com</code>
                    </li>
                    <li>
                      <strong>Secure Cookie</strong> (fallback): Set via this page
                    </li>
                    <li>
                      <strong>Query Parameter</strong> (dev only):{" "}
                      <code>?tenant=tenant-a</code>
                    </li>
                    <li>
                      <strong>Default</strong>: If nothing matches
                    </li>
                  </ol>
                  <p className={styles["select-tenant__security"]}>
                    The cookie is <code>HttpOnly</code>, <code>Secure</code>, and{" "}
                    <code>SameSite=Strict</code> for security.
                  </p>
                </div>
              </Card>
            </div>
          </main>

          <Footer copyright={`${new Date().getFullYear()} ${currentTenant.name}`} />
        </div>
      </ThemeProvider>
    </>
  );
}
