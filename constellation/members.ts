// People. Use either a plain address or, once the person is an org
// user, `eth.user["Full Name"]` (their personal Safe on Ethereum).

// Signers and role members
export const ANA = "0x59d911A970176063B5382Cf397d4DFE1dCb8438F";
export const BEN = "0x4D300210E6EFA0eD7CC8f89719a05a379D7BdEc7";
export const MARIA = "0xb6eaA0507Cd710d4d582a572FC8723Daf03A65ba";
export const STEVE = "0x6A8feefCac8687fF061977ba1aaD64742Bd5c055";

// Security council signers, controlled by the Zodiac team.
export const ZODIAC_TEAM_1 = "0x325b8aB1BD08FbA28332796e6e4e979Fc3776BA9";
export const ZODIAC_TEAM_2 = "0x07E36669796Dcd3cebe02A943bF4E643e455bff4";
export const ZODIAC_TEAM_3 = "0x06b2e1A976E97815a4563b5ee511BB1b2732e8EE";
export const ZODIAC_TEAM_4 = "0x0eD80404CFaD193ceCDF284C5C857640b0d7aa41";

const memberKeys = new Set(
  [ANA, BEN, MARIA, STEVE].map((address) => address.toLowerCase()),
);
const teamKeys = [
  ZODIAC_TEAM_1,
  ZODIAC_TEAM_2,
  ZODIAC_TEAM_3,
  ZODIAC_TEAM_4,
].map((address) => address.toLowerCase());
if (
  new Set(teamKeys).size !== teamKeys.length ||
  teamKeys.some((address) => memberKeys.has(address))
) {
  throw new Error(
    "Zodiac team keys must be distinct from each other and every member key",
  );
}

// A Safe owned by a placeholder can never sign again, so a deployment with
// one left in would lock the treasury. Refuse to build the spec until every
// placeholder is replaced; ALLOW_PLACEHOLDERS=1 is for local checks only.
const placeholders = Object.entries({
  ANA,
  BEN,
  MARIA,
  STEVE,
  ZODIAC_TEAM_1,
  ZODIAC_TEAM_2,
  ZODIAC_TEAM_3,
  ZODIAC_TEAM_4,
}).filter(([, address]) => /^0x0{36}[a-f]0/.test(address));

if (placeholders.length > 0 && process.env.ALLOW_PLACEHOLDERS !== "1") {
  throw new Error(
    `Placeholder addresses left in constellation/members.ts: ${placeholders
      .map(([name]) => name)
      .join(", ")}`,
  );
}
