import type { LayoutBlock, TenantConfig, PaymentSummary, ChartState } from "@shipay/types";
import { PaymentsDashboard } from "@shipay/payments-module";
import { Header } from "../Header";
import { Hero } from "../Hero";
import { Footer } from "../Footer";

interface BlockRendererProps {
  blocks: LayoutBlock[];
  tenant: TenantConfig;
  paymentData?: PaymentSummary[];
  paymentState?: ChartState;
  onRefreshPayments?: () => void;
}

/**
 * Dynamic block renderer that maps layout blocks to components.
 * This enables CMS-driven page composition.
 */
export function BlockRenderer({
  blocks,
  tenant,
  paymentData = [],
  paymentState,
  onRefreshPayments,
}: BlockRendererProps) {
  return (
    <>
      {blocks.map((block, index) => {
        switch (block.type) {
          case "header":
            return (
              <Header
                key={`header-${index}`}
                logo={tenant.logo}
                tenantName={tenant.name}
                showLogo={block.props?.showLogo as boolean}
              />
            );

          case "hero":
            return (
              <Hero
                key={`hero-${index}`}
                title={block.props?.title as string}
                subtitle={block.props?.subtitle as string}
              />
            );

          case "payments-dashboard":
            return (
              <PaymentsDashboard
                key={`payments-${index}`}
                data={paymentData}
                state={paymentState}
                onRefresh={onRefreshPayments}
              />
            );

          case "footer":
            return (
              <Footer
                key={`footer-${index}`}
                copyright={block.props?.copyright as string}
              />
            );

          default:
            if (process.env.NODE_ENV === "development") {
              console.warn(`[BlockRenderer] Unknown block type: ${block.type}`);
            }
            return null;
        }
      })}
    </>
  );
}
