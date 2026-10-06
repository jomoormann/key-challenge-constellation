import { custom } from "@zodiaceco/sdk/actions";
import config from "../../../zodiac.config";
import {
  swap_usdc_daily,
  swap_usdt_daily,
  swap_weth_daily,
} from "../../allowances";

// CoW Protocol swaps between ETH/WETH, USDC and USDT, proceeds to the vault.
//
// Hand-written rather than the SDK's `swap` entry: `swap` cannot carry an
// allowance, and the daily cap per sell token is the point of this role.
// The shape follows DeFi Kit's cowswap preset (the vault delegatecalls the
// CowswapOrderSigner, which presigns the order), with more fields pinned.
const { weth, usdc, usdt, cowswap } = config.contracts.eth;

// CoW's marker for "pay out native ETH"
const NATIVE_ETH: `0x${string}` = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
// keccak256("erc20"): plain ERC-20 balances, no Balancer vault balances
const ERC20_BALANCE: `0x${string}` =
  "0x5a28e9363bb942b639270062aa6bb295f434bcdfc42c97267bf003f272060dc9";

const BUYABLE = [NATIVE_ETH, weth, usdc, usdt] as const;

// One branch per sell token, each metered in that token's own units
const sellOrder = (sellToken: `0x${string}`, allowanceKey: string) => ({
  sellToken,
  buyToken: c.or(
    ...(BUYABLE.filter((t) => t !== sellToken) as [
      string,
      string,
      ...string[],
    ]),
  ),
  receiver: c.avatar, // proceeds land in the vault, nowhere else
  sellAmount: c.withinAllowance(allowanceKey),
  feeAmount: 0, // CoW only accepts zero-fee orders; the full sellAmount is metered
  sellTokenBalance: ERC20_BALANCE,
  buyTokenBalance: ERC20_BALANCE,
});

export default [
  custom({
    label: "Wrap and unwrap ETH",
    permissions: [
      // Value-neutral: ETH <-> WETH inside the vault
      allow.eth.weth.deposit({ send: true }),
      allow.eth.weth.withdraw(),
    ],
  }),

  custom({
    label: "CoW swaps ETH/WETH, USDC, USDT (0.05 ETH worth per token per day)",
    permissions: [
      // The relayer only pulls for orders the vault itself presigned
      allow.eth.weth.approve(cowswap.vault_relayer),
      allow.eth.usdc.approve(cowswap.vault_relayer),
      allow.eth.usdt.approve(cowswap.vault_relayer),

      allow.eth.cowswap.order_signer.signOrder(
        c.or(
          sellOrder(weth, swap_weth_daily.key),
          sellOrder(usdc, swap_usdc_daily.key),
          sellOrder(usdt, swap_usdt_daily.key),
        ),
        undefined, // validDuration
        undefined, // feeAmountBP: moot, feeAmount is pinned to 0
        { delegatecall: true },
      ),

      // Cancel a presigned order
      allow.eth.cowswap.order_signer.unsignOrder(undefined, {
        delegatecall: true,
      }),
    ],
  }),
] satisfies Permissions;
