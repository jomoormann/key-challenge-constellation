import { Node } from "./types";

type Prettify<T> = { [K in keyof T]: T[K] } & {};

type DistributiveOmit<T, K extends PropertyKey> = T extends any
  ? Omit<T, K>
  : never;

type Kind = Node["type"];
type NodeByType<K extends Kind> = Extract<Node, { type: K }>;
type Stub<K extends Kind> = Partial<DistributiveOmit<NodeByType<K>, "ref">> & {
  type: K;
};
type Completion<K extends Kind, S extends Stub<K>> = DistributiveOmit<
  NodeByType<K>,
  keyof S | "ref"
>;
type Built<K extends Kind, R extends string> = Prettify<
  NodeByType<K> & { ref: R }
>;

/**
 * ref(id, stub) → completion => Built
 *
 * - Infers the node variant from `stub.type`.
 * - `completion` must provide exactly the fields missing from the stub.
 * - Returns the fully-typed node with branded `ref` literal.
 */
export function ref<
  const R extends string,
  K extends Kind,
  const S extends Stub<K>,
>(id: R, stub: S & { type: K }) {
  return (completion: Completion<K, S>) =>
    Object.assign(stub, completion, { ref: id }) as unknown as Built<K, R>;
}
