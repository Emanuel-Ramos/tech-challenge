import type { LayoutBlock, TenantConfig, PaymentSummary, ChartState } from "@shipay/types";
import { blocks, type BlockContext } from "../../lib/blocks";

interface BlockRendererProps {
  blocks: LayoutBlock[];
  tenant: TenantConfig;
  paymentData?: PaymentSummary[];
  paymentState?: ChartState;
  onRefreshPayments?: () => void;
}

/**
 * Renders blocks from CMS layout configuration.
 * Blocks are defined in `lib/blocks.ts` - just add new entries there.
 */
export function BlockRenderer({
  blocks: layoutBlocks,
  tenant,
  paymentData = [],
  paymentState,
  onRefreshPayments,
}: BlockRendererProps) {
  const context: BlockContext = {
    tenant,
    paymentData,
    paymentState,
    onRefreshPayments,
  };

  return (
    <>
      {layoutBlocks.map((block, index) => {
        const config = blocks[block.type];

        if (!config) {
          console.warn(
            `[BlockRenderer] Block "${block.type}" not found. ` +
              `Available: ${Object.keys(blocks).join(", ")}`
          );
          return null;
        }

        const { component: Component, mapProps } = config;
        const props = mapProps(block.props ?? {}, context);

        return <Component key={`${block.type}-${index}`} {...props} />;
      })}
    </>
  );
}
