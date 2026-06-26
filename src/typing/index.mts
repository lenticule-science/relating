/**
 * @packageDocumentation
 *
 * typing — the category's OBJECT kernel: the carrier constructor and the schema↔type
 * machinery. Extracted from `writing/` (where it was mis-homed among the codecs, whose
 * own charter is "representation boundaries, never the category's ontology") into a
 * first-class capability peer to `writing`/`ledger`/`evaluating`/`running`.
 *
 * A carrier is one `as const` JSON-Schema literal whose `FromSchema` static type, bare
 * `$id` identity, and relating-owned runtime validator are one value — no TypeBox, no
 * Ajv, no codegen. `realize` is the forgetful functor `Sub(J) → StructuralTypes`;
 * `registry` resolves a `$id` to the schema document it names. The MORPHISM half of the
 * category (actions, dispatch, the action registry) lives in `running`; the representation
 * codecs in `writing`.
 *
 * Reached at `@emsenn/relating/typing` (also surfaced via the root and `/writing` for
 * back-compat — downstream that imports `carrierFrom` from either keeps working).
 */
export {
  CarrierSchema,
  carrierFrom,
  registerCarrier,
  carrierById,
  carriers as registeredCarriers,
  carriersById,
  type Carrier,
  type CarrierCarrier,
  type CarrierId,
  type FromSchema,
  type DataCarrier,
} from "./carrier.mjs";

export {
  type StructuralType,
  type StructuralField,
  unknownType,
  neverType,
  primitive,
  literal,
  array,
  tuple,
  ref,
  objectType,
  union,
  intersection,
} from "./structural.mjs";

export { realize, realizeDefs } from "./realize.mjs";
export { schemaRegistry, schemaId, type SchemaRegistry } from "./registry.mjs";
