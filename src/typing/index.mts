/**
 * typing - the schema-first category kernel.
 *
 * A carrier is declared once as a TypeBox value. That one value supplies the
 * static `Static<>` type, the JSON Schema document with its bare `$id`, and the
 * Ajv validator. Actions are morphisms typed by carrier domain/codomain objects,
 * and composition is `$id` equality.
 */
export {
  CarrierSchema,
  MorphismSchema,
  registeredCategory,
  schemaCarrier,
  carrier,
  action,
  composes,
  actionIrAudit,
  freeTsActions,
  morphismCarrier,
  type Carrier,
  type CarrierCarrier,
  type CarrierId,
  type CarrierOptions,
  type Action,
  type ActionSpec,
  type ActionCarrier,
  type MorphismCarrier,
  type ActionIrAuditEntry,
  type CategoryRegistry,
} from "./kernel.mjs";

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
export { printType, generateDeclaration } from "./print.mjs";
export { schemaRegistry, schemaId, type SchemaRegistry } from "./registry.mjs";

export { Type, type Static } from "@sinclair/typebox";
