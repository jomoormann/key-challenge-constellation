// Every value-moving step draws on its own budget of 0.05 ETH worth per day,
// except payroll and FOLD swaps, which have their own amounts. Daily budgets
// do not roll over (maxRefill = refill) and start full.
//
// Roles v2 meters in token units, not in USD, so the ETH value is converted
// once here. Prices as of 2026-09-29, block 26,084,674:
//   ETH/USD 2,675.30 (Chainlink ETH/USD feed 0x5f4eC3Df…8419)
//   stETH per wstETH 1.245174 (wstETH.stEthPerToken())
// Re-price by editing the two constants below and pushing again.
const ETH_USD = 2_675n;
const STETH_PER_WSTETH = 1_245_173_991_915_781_615n; // 18 decimals

const MINUTE = 60n;
const DAY = 24n * 60n * MINUTE;
const ETH = 10n ** 18n;
const USD6 = 10n ** 6n; // USDC and USDT both have 6 decimals

const DAILY_ETH = (5n * ETH) / 100n; // 0.05 ETH
const DAILY_USD6 = ((5n * ETH_USD) / 100n) * USD6; // 133 USDC or USDT
const DAILY_WSTETH = (DAILY_ETH * ETH) / STETH_PER_WSTETH; // ≈ 0.0401 wstETH
const USD50_WETH = (50n * ETH) / ETH_USD; // ≈ 0.0187 WETH

const budget = (key: string, amount: bigint, period: bigint) => ({
  key,
  refill: amount,
  maxRefill: amount,
  period,
  balance: amount,
  timestamp: 0n,
});
const daily = (key: string, amount: bigint) => budget(key, amount, DAY);

// Payroll: WETH to Ana, Ben and Maria, shared by all three. Up to 50 USD
// worth, refilled every minute by 1/1440 of that (≈ 0.000013 WETH, about
// 3.5 cents), so an empty budget is full again after 24 hours. Starts empty.
const MINUTES_PER_DAY = DAY / MINUTE;
export const payroll_weth = {
  key: "payroll_weth",
  refill: (USD50_WETH + MINUTES_PER_DAY - 1n) / MINUTES_PER_DAY, // rounded up
  maxRefill: USD50_WETH,
  period: MINUTE,
  balance: 0n,
  timestamp: 0n,
};

// CoW swaps: one budget per sell token (Roles v2 cannot add up amounts in
// different tokens)
export const swap_weth_daily = daily("swap_weth_daily", DAILY_ETH);
export const swap_usdc_daily = daily("swap_usdc_daily", DAILY_USD6);
export const swap_usdt_daily = daily("swap_usdt_daily", DAILY_USD6);

// Lido: native ETH sent to stETH.submit (an ether allowance)
export const lido_eth_daily = daily("lido_eth_daily", DAILY_ETH);

// Aave v3 Core: wstETH supplied
export const aave_wsteth_daily = daily("aave_wsteth_daily", DAILY_WSTETH);

// Morpho: USDC deposited into Steakhouse Prime USDC
export const morpho_usdc_daily = daily("morpho_usdc_daily", DAILY_USD6);

// FOLD swaps: WETH sold for FOLD, 50 USD worth per day
export const fold_weth_daily = daily("fold_weth_daily", USD50_WETH);
