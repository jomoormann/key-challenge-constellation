import { custom, swap } from "@zodiaceco/sdk/actions";
import config from "../../../zodiac.config";
import {
  swap_usdc_daily,
  swap_usdt_daily,
  swap_weth_daily,
} from "../../allowances";

// CoW Protocol swaps between ETH/WETH, USDC and USDT, proceeds to the vault.
//
// One `swap` entry per sell token, so each is metered in its own units: a
// `sellAllowance` caps the sum across every token in `sell`.
const { weth, usdc, usdt } = config.contracts.eth;

// CoW's marker for "pay out native ETH"
const NATIVE_ETH: `0x${string}` = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

const BUYABLE = [NATIVE_ETH, weth, usdc, usdt] as const;
const buyableFor = (sellToken: `0x${string}`) =>
  BUYABLE.filter((t) => t !== sellToken);

export default [
  custom({
    label: "Wrap and unwrap ETH",
    permissions: [
      // Value-neutral: ETH <-> WETH inside the vault
      allow.eth.weth.deposit({ send: true }),
      allow.eth.weth.withdraw(),
    ],
  }),

  swap({
    label: "CoW swaps selling WETH (0.05 WETH per day)",
    sell: [weth],
    buy: buyableFor(weth),
    sellAllowance: swap_weth_daily,
  }),
  swap({
    label: "CoW swaps selling USDC (133 USDC per day)",
    sell: [usdc],
    buy: buyableFor(usdc),
    sellAllowance: swap_usdc_daily,
  }),
  swap({
    label: "CoW swaps selling USDT (133 USDT per day)",
    sell: [usdt],
    buy: buyableFor(usdt),
    sellAllowance: swap_usdt_daily,
  }),
] satisfies Permissions;
