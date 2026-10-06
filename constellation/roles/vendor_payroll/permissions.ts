import { custom } from "@zodiaceco/sdk/actions";
import { vendor_usdc_12h } from "../../allowances";

// Vendor payments in USDC, 50 USDC every 12 hours.
//
// A separate role from `payroll`: in one role, two permissions on
// USDC.transfer would merge.
// Written with `custom` because a `transfer` entry needs named recipients.
export default [
  custom({
    label: "Vendor payments in USDC (50 per 12h)",
    permissions: [
      allow.eth.usdc.transfer(
        undefined,
        c.withinAllowance(vendor_usdc_12h.key),
      ),
    ],
  }),
] satisfies Permissions;
