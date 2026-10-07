import { transfer } from "@zodiaceco/sdk/actions";
import config from "../../../zodiac.config";
import { ANA, BEN, MARIA } from "../../members";
import { payroll_weth } from "../../allowances";

// WETH transfers to Ana, Ben and Maria only, up to 50 USD worth across all
// three, refilled by the minute. No approve, no transferFrom. Changing the
// receiver list is a governance action on the treasury.
export default [
  transfer({
    label: "Payroll in WETH (Ana, Ben, Maria, 50 USD per day)",
    tokens: [config.contracts.eth.weth],
    to: [ANA, BEN, MARIA],
    allowance: payroll_weth,
  }),
] satisfies Permissions;
