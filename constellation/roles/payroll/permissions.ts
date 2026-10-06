import { transfer } from "@zodiaceco/sdk/actions";
import config from "../../../zodiac.config";
import { PAYEE_1, PAYEE_2, PAYEE_3 } from "../../members";
import { payroll_usdc_daily } from "../../allowances";

// USDC transfers to the three whitelisted receivers only, 133 USDC per day
// across all three. No approve, no transferFrom: nothing else can move USDC.
// Changing the receiver list is a governance action on the treasury.
export default [
  transfer({
    label: "Payroll in USDC (3 receivers, 133 per day)",
    tokens: [config.contracts.eth.usdc],
    to: [PAYEE_1, PAYEE_2, PAYEE_3],
    allowance: payroll_usdc_daily,
  }),
] satisfies Permissions;
