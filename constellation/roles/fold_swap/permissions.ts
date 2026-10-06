import { custom } from "@zodiaceco/sdk/actions";
import config from "../../../zodiac.config";
import { fold_weth_daily } from "../../allowances";

// CoW orders that sell WETH for FOLD, 50 USD worth of WETH per day.
const { weth, fold, cowswap } = config.contracts.eth;

// keccak256("erc20"): plain ERC-20 balances, no Balancer vault balances
const ERC20_BALANCE: `0x${string}` =
  "0x5a28e9363bb942b639270062aa6bb295f434bcdfc42c97267bf003f272060dc9";

export default [
  custom({
    label: "Wrap ETH for FOLD swaps",
    permissions: [
      // Value-neutral: ETH -> WETH inside the vault
      allow.eth.weth.deposit({ send: true }),
    ],
  }),

  custom({
    label: "CoW swaps WETH -> FOLD (50 USD per day)",
    permissions: [
      allow.eth.weth.approve(cowswap.vault_relayer),

      allow.eth.cowswap.order_signer.signOrder(
        {
          sellToken: weth,
          buyToken: fold,
          sellAmount: c.withinAllowance(fold_weth_daily.key),
          feeAmount: 0, // CoW only accepts zero-fee orders
          sellTokenBalance: ERC20_BALANCE,
          buyTokenBalance: ERC20_BALANCE,
        },
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
