import { custom } from "@zodiaceco/sdk/actions";
import { eth } from "../../context";

// The council's only power: skip queued transactions on the treasury Delay.
// setTxNonce is owner-only on the Delay, and the Delay's owner is the
// treasury, so the call runs as the treasury through this Roles Modifier.
//
// Written without the allow kit because the Delay is a new node: its address
// is derived at deploy, and the node reference stands in for it. The Delay's
// export name must stay lowercase (see constellation/index.ts).
export default [
  custom({
    label: "Veto queued treasury transactions",
    permissions: [
      {
        targetAddress: eth.delay["Ops Treasury Delay"],
        selector: "0x46ba2307", // setTxNonce(uint256)
      },
    ],
  }),
] satisfies Permissions;
