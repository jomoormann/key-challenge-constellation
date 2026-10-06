import { ApplyConstellationPayload } from "@zodiaceco/api-types";
import type { PermissionEntry } from "@zodiaceco/sdk/actions";
import type { ChainPrefix } from "@zodiaceco/sdk/allow";

export type { ChainPrefix } from "@zodiaceco/sdk/allow";

/** A reference to another node in the constellation, e.g. `eth.safe["Treasury"]`. */
type NodeRef = Readonly<{
  type: "SAFE" | "ROLES" | "DELAY";
  label: string;
  chain: number;
}>;

/** Member list for a role: addresses, user accessors (which resolve to
 * addresses), or node references. */
export type Members = readonly (`0x${string}` | NodeRef)[];

export type NestedAddresses = {
  [name: string]: `0x${string}` | NestedAddresses;
};

export type ContractsConfig = {
  [chain in ChainPrefix]?: NestedAddresses;
};

/**
 * A role's permission list. Re-exported from the SDK rather than restated, so
 * `permissions.ts` files are checked against the shape `push()` actually takes:
 * a bare `allow`-kit permission, or one of the labelled entries from
 * `@zodiaceco/sdk/actions`. A compiled `PermissionSet` — what calling `defi-kit`
 * directly returns — is no longer one of them.
 */
export type Permissions = readonly PermissionEntry[];

export type Ref = (completion: any) => { ref: Lowercase<string> };

export type Role = {
  members: (Ref | `0x${string}`)[];
  permissions: Permissions;
};

export type { PermissionEntry };

type Prettify<T> = { [K in keyof T]: T[K] } & {};

type EnhanceRefs<T> = T extends `$${Lowercase<string>}`
  ? Ref
  : T extends (infer U)[]
    ? EnhanceRefs<U>[]
    : T extends Record<string, any>
      ? { [K in keyof T]: EnhanceRefs<T[K]> }
      : T;

type RealBigints<T> = T extends `${bigint}`
  ? bigint
  : T extends (infer U)[]
    ? RealBigints<U>[]
    : T extends Record<string, any>
      ? { [K in keyof T]: RealBigints<T[K]> }
      : T;

type Safe = Prettify<
  EnhanceRefs<
    RealBigints<
      Extract<
        ApplyConstellationPayload["specification"][number],
        { type: "SAFE" }
      >
    >
  >
>;
type Delay = Prettify<
  EnhanceRefs<
    RealBigints<
      Extract<
        ApplyConstellationPayload["specification"][number],
        { type: "DELAY" }
      >
    >
  >
>;
type Roles = Prettify<
  EnhanceRefs<
    RealBigints<
      Omit<
        Extract<
          ApplyConstellationPayload["specification"][number],
          { type: "ROLES" }
        >,
        "roles"
      >
    >
  > & { roles: { [key: string]: Role | null } }
>;

export type Node = Safe | Delay | Roles;
export type Specification = Node[];
