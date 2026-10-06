import { custom } from "@zodiaceco/sdk/actions";
import config from "../../../zodiac.config";
import { morpho_usdc_daily } from "../../allowances";

// USDC into Steakhouse Prime USDC, a Morpho Vault V2 (0xbeef0880…Def0f51),
// the largest listed USDC vault on Ethereum. Two larger USDC vaults exist
// (Adpend USDC, 1337 USDC) but are unlisted on Morpho, so they are out.
//
// Shares are minted to the vault; assets come back to the vault only.
// Not allowed: mint (takes shares, so it cannot be metered in USDC),
// share transfers, permit, multicall, forceDeallocate.
const { usdc, morpho } = config.contracts.eth;

export default [
  custom({
    label: "Deposit USDC into Steakhouse Prime USDC (133 per day)",
    permissions: [
      allow.eth.usdc.approve(morpho.steakhouse_prime_usdc),
      allow.eth.morpho.steakhouse_prime_usdc.deposit(
        c.withinAllowance(morpho_usdc_daily.key),
        c.avatar, // onBehalf: shares go to the vault
      ),
      allow.eth.morpho.steakhouse_prime_usdc.withdraw(
        undefined, // assets
        c.avatar, // receiver
        c.avatar, // onBehalf: only the vault's own shares
      ),
      allow.eth.morpho.steakhouse_prime_usdc.redeem(
        undefined, // shares
        c.avatar, // receiver
        c.avatar, // onBehalf
      ),
    ],
  }),
] satisfies Permissions;
