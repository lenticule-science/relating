/**
 * codecs/resource/datom — the atomic WITNESS and its EAVT ordering.
 *
 * A datom `[entity, attribute, value, time]` is a witness: at `time`, the cell
 * (entity, attribute, value) was witnessed. It carries no polarity and no
 * operation. There is no "assert"/"retract":
 *   - the closure engine is ≤_k-monotone — it accumulates evidence and never
 *     retracts, so removal is not a thing a witness log can express; and
 *   - a negative is never admitted — `active` ("told false") and `stable`
 *     ("told both") are positions the *descent* derives by settling, not facts
 *     a flatfile may claim. You do not witness an absence; you cannot prove a
 *     negative. Negation is a ℤ/2 gauge symmetry of the whole value space
 *     (algebra's `negate`), not an operation this codec performs.
 *
 * So reading a datom yields a cell whose charge is the witnessed potential
 * (present-side evidence, value derived); accumulating many datoms about one
 * cell is, downstream, a knowledge-join of their witnesses. Writing emits one
 * datom per present-side witness — the absent side is never serialized, because
 * it was never witnessed.
 */
import { witnessedPotential, type ChargeCarrier } from "../../algebra/index.mjs";
import { type JsonValue, parseLines, serializeLines, canonical } from "./json.mjs";

/** A datom: `[entity, attribute, value, time]` — a cell witnessed at a time. */
export type Datom = readonly [entity: JsonValue, attribute: JsonValue, value: JsonValue, time: JsonValue];

/** A predication cell at the serialization boundary: entity × attribute × value. */
export type Cell = { readonly subject: JsonValue; readonly predicate: JsonValue; readonly object: JsonValue };

/** A cell with the charge derived from its witnesses — the carrier a datom document carries. */
export type ChargedCell = { readonly cell: Cell; readonly charge: ChargeCarrier };

/** Whether a json value is shaped like a datom: a 4-tuple [entity, attribute, value, time]. */
export function isDatomShape(value: JsonValue): boolean {
  return Array.isArray(value) && value.length === 4;
}

/** Narrow a json value to a datom. Throws if it is not a 4-tuple. */
export function toDatom(value: JsonValue): Datom {
  if (!Array.isArray(value) || value.length !== 4) {
    throw new TypeError("datom: expected [entity, attribute, value, time]");
  }
  return [value[0]!, value[1]!, value[2]!, value[3]!];
}

/** Parse a datom document: jsonl lines, each narrowed to a datom. */
export const parse = (content: string): Datom[] => parseLines(content).map(toDatom);

/** Serialize datoms to a datom document. */
export const serialize = (datoms: readonly Datom[]): string =>
  serializeLines(datoms.map((d) => [...d] as JsonValue[]));

/** A datom → the cell it witnesses, charged with its witnessed potential. The
 *  value is derived from present-side evidence; nothing negative is admitted. */
export function datomToCell(d: Datom): ChargedCell {
  const [e, a, v, t] = d;
  return { cell: { subject: e, predicate: a, object: v }, charge: witnessedPotential(t) };
}

/** A charged cell → its datoms: one per present-side witness. The absent side is
 *  never a datom — you do not witness an absence; falsity is derived, not claimed. */
export function cellToDatoms(charged: ChargedCell): Datom[] {
  const { subject: e, predicate: a, object: v } = charged.cell;
  return charged.charge.evidence[0].map((t): Datom => [e, a, v, t as JsonValue]);
}

/** The E-A-V-T order: compare canonical-json keys component by component, e then a then v then t. */
export function eavtOrder(x: Datom, y: Datom): number {
  for (let i = 0; i < 4; i++) {
    const xk = canonical(x[i]!);
    const yk = canonical(y[i]!);
    if (xk < yk) return -1;
    if (xk > yk) return 1;
  }
  return 0;
}
