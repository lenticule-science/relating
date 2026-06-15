/**
 * codecs/resource/datom — the atomic WITNESS (EAVT) and the Datom (EAVT + reading).
 *
 * An EAVT `[entity, attribute, value, time]` is a witness: at `time`, the cell
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
 * You ASSERT EAVT and RECEIVE Datoms. A `Datom` is an EAVT plus the reading a
 * script computed about that cell: `[entity, attribute, value, time, reading]` —
 * five parts. The fifth slot, where Datomic puts assert/retract, is where our
 * reading (the settled judgement) goes. EAVT is the asserted/witnessed form;
 * Datom is the received/queried form. A four-part value is an EAVT, never a Datom.
 *
 * Reading an EAVT yields a cell whose charge is the witnessed potential
 * (present-side evidence, value derived); accumulating many EAVTs about one cell
 * is, downstream, a knowledge-join of their witnesses. Writing emits one EAVT
 * per present-side witness — the absent side is never serialized, because it was
 * never witnessed.
 */
import { witnessedPotential, type ChargeCarrier } from "../../algebra/index.mjs";
import { type JsonValue, parseLines, serializeLines, canonical } from "./json.mjs";

/** An EAVT: `[entity, attribute, value, time]` — a cell witnessed at a time. The asserted form. */
export type EAVT = readonly [entity: JsonValue, attribute: JsonValue, value: JsonValue, time: JsonValue];

/** A Datom: an EAVT plus the reading a script computed —
 *  `[entity, attribute, value, time, reading]`. The received form; five parts. */
export type Datom = readonly [entity: JsonValue, attribute: JsonValue, value: JsonValue, time: JsonValue, reading: JsonValue];

/** A predication cell at the serialization boundary: entity × attribute × value. */
export type Cell = { readonly subject: JsonValue; readonly predicate: JsonValue; readonly object: JsonValue };

/** A cell with the charge derived from its witnesses — the carrier an EAVT document carries. */
export type ChargedCell = { readonly cell: Cell; readonly charge: ChargeCarrier };

/** Whether a json value is shaped like an EAVT: a 4-tuple [entity, attribute, value, time]. */
export function isEavtShape(value: JsonValue): boolean {
  return Array.isArray(value) && value.length === 4;
}

/** Whether a json value is shaped like a Datom: a 5-tuple [entity, attribute, value, time, reading]. */
export function isDatomShape(value: JsonValue): boolean {
  return Array.isArray(value) && value.length === 5;
}

/** Narrow a json value to an EAVT. Throws if it is not a 4-tuple. */
export function toEavt(value: JsonValue): EAVT {
  if (!Array.isArray(value) || value.length !== 4) {
    throw new TypeError("eavt: expected [entity, attribute, value, time]");
  }
  return [value[0]!, value[1]!, value[2]!, value[3]!];
}

/** A Datom from an EAVT and a reading. You assert EAVT and receive Datoms. */
export const datom = (e: EAVT, reading: JsonValue): Datom => [e[0], e[1], e[2], e[3], reading];

/** Parse an EAVT document: jsonl lines, each narrowed to an EAVT. */
export const parse = (content: string): EAVT[] => parseLines(content).map(toEavt);

/** Serialize EAVTs to an EAVT document. */
export const serialize = (eavts: readonly EAVT[]): string =>
  serializeLines(eavts.map((e) => [...e] as JsonValue[]));

/** An EAVT → the cell it witnesses, charged with its witnessed potential. The
 *  value is derived from present-side evidence; nothing negative is admitted. */
export function eavtToCell(e: EAVT): ChargedCell {
  const [entity, attribute, value, time] = e;
  return { cell: { subject: entity, predicate: attribute, object: value }, charge: witnessedPotential(time) };
}

/** A charged cell → its EAVTs: one per present-side witness. The absent side is
 *  never an EAVT — you do not witness an absence; falsity is derived, not claimed. */
export function cellToEavt(charged: ChargedCell): EAVT[] {
  const { subject: e, predicate: a, object: v } = charged.cell;
  return charged.charge.evidence[0].map((t): EAVT => [e, a, v, t as JsonValue]);
}

/** The E-A-V-T order: compare canonical-json keys component by component, e then a then v then t. */
export function eavtOrder(x: EAVT, y: EAVT): number {
  for (let i = 0; i < 4; i++) {
    const xk = canonical(x[i]!);
    const yk = canonical(y[i]!);
    if (xk < yk) return -1;
    if (xk > yk) return 1;
  }
  return 0;
}
