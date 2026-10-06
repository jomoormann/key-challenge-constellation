import { encodeKey } from "@zodiaceco/sdk";
import { custom } from "@zodiaceco/sdk/actions";
import config from "../../../zodiac.config";
import { lido_eth_daily } from "../../allowances";

// Stake ETH with Lido (0.05 ETH per day) and exit through the Lido
// withdrawal queue. stETH is minted to the vault; withdrawal NFTs are owned
// by the vault and pay out only to their owner.
const { lido } = config.contracts.eth;

export default [
  custom({
    label: "Stake ETH on Lido (0.05 ETH per day)",
    permissions: [
      // stETH is minted to msg.sender, which is the vault
      allow.eth.lido.steth.submit(undefined, {
        send: true,
        // Encoded by hand: unlike c.withinAllowance, the allow kit of
        // @zodiaceco/sdk 2.4 passes this key through as is
        etherWithinAllowance: encodeKey(lido_eth_daily.key),
      }),
    ],
  }),

  custom({
    label: "Unstake stETH through the Lido withdrawal queue",
    permissions: [
      allow.eth.lido.steth.approve(lido.withdrawal_queue),
      // The withdrawal NFT is owned by the vault
      allow.eth.lido.withdrawal_queue.requestWithdrawals(undefined, c.avatar),
      // Both claim functions pay msg.sender, which must own the NFT.
      // claimWithdrawalsTo (free recipient) is deliberately not allowed.
      allow.eth.lido.withdrawal_queue.claimWithdrawals(),
      allow.eth.lido.withdrawal_queue.claimWithdrawal(),
    ],
  }),
] satisfies Permissions;
