import { custom } from "@zodiaceco/sdk/actions";
import config from "../../../zodiac.config";
import { aave_wsteth_daily } from "../../allowances";

// stETH into Aave v3, Ethereum Core market ("Aave Ethereum Market",
// Pool 0x87870Bca…4fA4E2, aToken aEthwstETH 0x0B925eD1…9E9371).
//
// Aave v3 does not list stETH itself (it rebases), only wstETH, so stETH is
// wrapped first. Supply only: no borrow, so no debt and no liquidation.
// Supplied wstETH belongs to the vault and withdraws only to the vault.
const { lido, aave_v3 } = config.contracts.eth;

export default [
  custom({
    label: "Wrap and unwrap stETH",
    permissions: [
      // Value-neutral: stETH <-> wstETH inside the vault
      allow.eth.lido.steth.approve(lido.wsteth),
      allow.eth.lido.wsteth.wrap(),
      allow.eth.lido.wsteth.unwrap(),
    ],
  }),

  custom({
    label: "Supply wstETH on Aave v3 Core (0.05 ETH worth per day)",
    permissions: [
      allow.eth.lido.wsteth.approve(aave_v3.core_pool),
      allow.eth.aave_v3.core_pool.supply(
        lido.wsteth,
        c.withinAllowance(aave_wsteth_daily.key),
        c.avatar, // onBehalfOf: the position belongs to the vault
      ),
      allow.eth.aave_v3.core_pool.withdraw(
        lido.wsteth,
        undefined, // any amount, including type(uint256).max
        c.avatar, // to: back to the vault only
      ),
    ],
  }),
] satisfies Permissions;
