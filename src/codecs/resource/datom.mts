/**
 * codecs/resource/datom — the atomic fact and its EAVT ordering.
 *
 * A datom `[entity, attribute, value, time, op]` IS an un-folded charged cell:
 * one mark, witnessed by its time. So this module owns the bridge between the
 * serialization boundary and relationality's algebra:
 *   read  — each datom → a charged cell (cell {e,a,v}; charge potential/active
 *           with the time as its lone witness)
 *   write — each charged cell → its datoms (one per witness on each side; a
 *           contested/stable cell expands to both an assert and a retract)
 * Folding those cells back together (settling) is the topology's job, not the
 * codec's. The charge is constructed through relationality's own algebra.
 */
import { charge, chargeValue, type ChargeCarrier } from "../../algebra/index.mjs";
import { type JsonValue, parseLines, serializeLines, canonical } from "./json.mjs";

/** Whether a datom asserts a fact or retracts it. */
export type Op = "assert" | "retract";

/** A datom: `[entity, attribute, value, time, op]`. */
export type Datom = readonly [entity: JsonValue, attribute: JsonValue, value: JsonValue, time: JsonValue, op: Op];

/** A predication cell at the serialization boundary: entity × attribute × value. */
export type Cell = { readonly subject: JsonValue; readonly predicate: JsonValue; readonly object: JsonValue };

/** A cell with its charge — the un-folded carrier element a datom document carries. */
export type ChargedCell = { readonly cell: Cell; readonly charge: ChargeCarrier };

const isOp = (x: unknown): x is Op => x === "assert" || x === "retract";

/** Whether a json value is shaped like a datom: a 5-tuple with a valid operation. */
export function isDatomShape(value: JsonValue): boolean {
  return Array.isArray(value) && value.length === 5 && isOp(value[4]);
}

/** Narrow a json value to a datom. Throws if it is not a datom. */
export function toDatom(value: JsonValue): Datom {
  if (!Array.isArray(value) || value.length !== 5) {
    throw new TypeError("datom: expected [entity, attribute, value, time, op]");
  }
  const op = value[4];
  if (!isOp(op)) throw new TypeError(`datom: op must be "assert" or "retract", got ${JSON.stringify(op)}`);
  return [value[0]!, value[1]!, value[2]!, value[3]!, op];
}

/** Parse a datom document: jsonl lines, each narrowed to a datom. */
export const parse = (content: string): Datom[] => parseLines(content).map(toDatom);

/** Serialize datoms to a datom document. */
export const serialize = (datoms: readonly Datom[]): string =>
  serializeLines(datoms.map((d) => [...d] as JsonValue[]));

/** A datom → the charged cell it is: cell {e,a,v}; assert→potential, retract→active; time the lone witness. */
export function datomToCell(d: Datom): ChargedCell {
  const [e, a, v, t, op] = d;
  const c: ChargeCarrier = op === "assert"
    ? charge(chargeValue("potential"), [[t], []])
    : charge(chargeValue("active"), [[], [t]]);
  return { cell: { subject: e, predicate: a, object: v }, charge: c };
}

/** A charged cell → its datoms: one assert per positive witness, one retract per negative (contested → both). */
export function cellToDatoms(charged: ChargedCell): Datom[] {
  const { subject: e, predicate: a, object: v } = charged.cell;
  const out: Datom[] = [];
  for (const t of charged.charge.evidence[0]) out.push([e, a, v, t as JsonValue, "assert"]);
  for (const t of charged.charge.evidence[1]) out.push([e, a, v, t as JsonValue, "retract"]);
  return out;
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
