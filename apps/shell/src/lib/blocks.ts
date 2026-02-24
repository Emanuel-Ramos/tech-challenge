/**
 * Block Registry - Simple map of block types to components.
 *
 * To add a new block, just add an entry here.
 */
import type { TenantConfig, PaymentSummary, ChartState } from "@shipay/types";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { Footer } from "../components/Footer";
import { PaymentsDashboard } from "@shipay/payments-module";

// Context available to all blocks
export interface BlockContext {
  tenant: TenantConfig;
  paymentData?: PaymentSummary[];
  paymentState?: ChartState;
  onRefreshPayments?: () => void;
}

// Block configuration
interface BlockConfig {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<any>;
  mapProps: (props: Record<string, unknown>, ctx: BlockContext) => Record<string, unknown>;
}

/**
 * All available blocks.
 * Add new blocks here - that's it!
 */
export const blocks: Record<string, BlockConfig> = {
  // Shell blocks
  header: {
    component: Header,
    mapProps: (props, ctx) => ({
      logo: ctx.tenant.logo,
      tenantName: ctx.tenant.name,
      showLogo: props.showLogo,
    }),
  },

  hero: {
    component: Hero,
    mapProps: (props) => ({
      title: props.title,
      subtitle: props.subtitle,
    }),
  },

  footer: {
    component: Footer,
    mapProps: (props) => ({
      copyright: props.copyright,
    }),
  },

  // Microfrontend blocks
  "payments-dashboard": {
    component: PaymentsDashboard,
    mapProps: (_, ctx) => ({
      data: ctx.paymentData ?? [],
      state: ctx.paymentState,
      onRefresh: ctx.onRefreshPayments,
    }),
  },

  // Add new blocks here:
  // "my-block": {
  //   component: MyComponent,
  //   mapProps: (props, ctx) => ({ ... }),
  // },
};
