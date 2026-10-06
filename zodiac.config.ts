import { defineConfig } from "@zodiaceco/sdk/cli/config";

// Every contract the policies touch, on Ethereum mainnet. Verified on chain
// 2026-09-29 (block 26,084,674); see README "Contracts".
export default defineConfig({
  contracts: {
    eth: {
      weth: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      usdc: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      usdt: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      // Interfold (FOLD), 18 decimals. Only bought, through CoW (fold_swap)
      fold: "0xE172e9B6cfBeeB5593bDcE3f077356FDb33af904",
      cowswap: {
        // Gnosis Guild's CowswapOrderSigner: the vault delegatecalls it with
        // the full order, so Roles can check every field before it presigns
        order_signer: "0x23dA9AdE38E4477b23770DeD512fD37b12381FAB",
        // GPv2VaultRelayer: pulls the sell token when an order settles
        vault_relayer: "0xC92E8bdf79f0507f65a392b0ab4667716BFE0110",
      },
      lido: {
        steth: "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84",
        wsteth: "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0",
        withdrawal_queue: "0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1",
      },
      aave_v3: {
        // Aave v3 Ethereum Core market ("Aave Ethereum Market"), not Prime
        core_pool: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2",
      },
      morpho: {
        // Steakhouse Prime USDC, a Morpho Vault V2: the largest listed USDC
        // vault on Ethereum ($122M on 2026-09-29)
        steakhouse_prime_usdc: "0xbeef088055857739C12CD3765F20b7679Def0f51",
      },
    },
  },
});
