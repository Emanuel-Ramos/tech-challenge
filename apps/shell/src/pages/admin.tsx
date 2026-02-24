import type { InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { ThemeProvider, Section } from "@shipay/design-system";
import { Header } from "@/components/Header";
import { AdminPanel } from "@shipay/admin-module";
import { withTenant, type TenantPageProps } from "@/lib/tenant";

export const getServerSideProps = withTenant<TenantPageProps>();

/**
 * Simple admin page to demonstrate CMS white-label capability.
 * Edit tenant name and theme colors, then see changes on reload.
 */
export default function AdminPage({
  tenant,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>Admin - {tenant.name}</title>
        <meta name="robots" content="noindex" />
      </Head>
      <ThemeProvider theme={tenant.theme}>
        <Header logo={tenant.logo} tenantName={tenant.name} showLogo />
        <Section as="main" size="md">
          <h1 style={{ marginBottom: "var(--spacing-6)" }}>Admin: {tenant.name}</h1>
          <AdminPanel initialConfig={tenant} />
        </Section>
      </ThemeProvider>
    </>
  );
}
