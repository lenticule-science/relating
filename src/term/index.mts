/**
 * term - JSON s-expression shadow of RelMath.CHL.Tm.
 *
 * This is the pure Curry-Howard-Lambek term layer proven in
 * `lean/RelMath/CurryHowardLambekQuartet.lean`: de-Bruijn STLC terms with
 * products and unit. It intentionally has no domain primitives.
 */
import { Type, type Static, type TSchema } from "@sinclair/typebox";
import {
  charge,
  chargeValue,
  conflateValue,
  isChargeValueName,
  joinKnowledgeValue,
  joinTruthValue,
  leqKnowledge,
  leqTruth,
  meetKnowledgeValue,
  meetTruthValue,
  negateValue,
  type ChargeValueName,
} from "../articulating/predicating/positing/bilattice-charge.mjs";
import {
  chargeJoinVClosure,
  settleOverValue,
} from "../articulating/predicating/positing/settling/value-category.mjs";
import type { JsonValue } from "../codecs/json.mjs";
import { canonical, parse } from "../codecs/json.mjs";
import { schemaCarrier } from "../typing/index.mjs";

export type GeneratorName = "specialization" | "converse" | "subjectProjection" | "objectProjection";
export type UnaryChargeOp = "negate" | "conflate" | "negConf";
export type BinaryChargeOp = "joinK" | "meetK" | "joinT" | "meetT";
export type OrderOp = "leK" | "leT";

export type Ty =
  | readonly ["base"]
  | readonly ["arrow", Ty, Ty]
  | readonly ["prod", Ty, Ty]
  | readonly ["unit"];

export type Tm =
  | readonly ["var", number]
  | readonly ["lam", Tm]
  | readonly ["app", Tm, Tm]
  | readonly ["pair", Tm, Tm]
  | readonly ["fst", Tm]
  | readonly ["snd", Tm]
  | readonly ["star"]
  | readonly ["mark", string]
  | readonly ["charge", ChargeValueName]
  | readonly ["bool", boolean]
  | readonly ["generator", GeneratorName]
  | readonly [UnaryChargeOp, Tm]
  | readonly [BinaryChargeOp, Tm, Tm]
  | readonly [OrderOp, Tm, Tm]
  | readonly ["settle", Tm, Tm]
  | readonly ["field", string, Tm];

export const TySchema = Type.Unsafe<Ty>({
  $id: "relating/term/ty",
  title: "CHL Ty",
  description: "RelMath.CHL.Ty as a recursive JSON s-expression: base, arrow, prod, unit.",
  anyOf: [
    { type: "array", items: [{ const: "base" }], minItems: 1, maxItems: 1, additionalItems: false },
    { type: "array", items: [{ const: "arrow" }, { $ref: "#" }, { $ref: "#" }], minItems: 3, maxItems: 3, additionalItems: false },
    { type: "array", items: [{ const: "prod" }, { $ref: "#" }, { $ref: "#" }], minItems: 3, maxItems: 3, additionalItems: false },
    { type: "array", items: [{ const: "unit" }], minItems: 1, maxItems: 1, additionalItems: false },
  ],
}) as TSchema & { readonly $id: "relating/term/ty" };

export const TmSchema = Type.Unsafe<Tm>({
  $id: "relating/term/tm",
  title: "CHL Tm",
  description: "RelMath.CHL.Tm as a recursive de-Bruijn JSON s-expression.",
  anyOf: [
    { type: "array", items: [{ const: "var" }, { type: "integer", minimum: 0 }], minItems: 2, maxItems: 2, additionalItems: false },
    { type: "array", items: [{ const: "lam" }, { $ref: "#" }], minItems: 2, maxItems: 2, additionalItems: false },
    { type: "array", items: [{ const: "app" }, { $ref: "#" }, { $ref: "#" }], minItems: 3, maxItems: 3, additionalItems: false },
    { type: "array", items: [{ const: "pair" }, { $ref: "#" }, { $ref: "#" }], minItems: 3, maxItems: 3, additionalItems: false },
    { type: "array", items: [{ const: "fst" }, { $ref: "#" }], minItems: 2, maxItems: 2, additionalItems: false },
    { type: "array", items: [{ const: "snd" }, { $ref: "#" }], minItems: 2, maxItems: 2, additionalItems: false },
    { type: "array", items: [{ const: "star" }], minItems: 1, maxItems: 1, additionalItems: false },
    { type: "array", items: [{ const: "mark" }, { type: "string" }], minItems: 2, maxItems: 2, additionalItems: false },
    { type: "array", items: [{ const: "charge" }, { enum: ["absurd", "potential", "active", "stable"] }], minItems: 2, maxItems: 2, additionalItems: false },
    { type: "array", items: [{ const: "bool" }, { type: "boolean" }], minItems: 2, maxItems: 2, additionalItems: false },
    { type: "array", items: [{ const: "generator" }, { enum: ["specialization", "converse", "subjectProjection", "objectProjection"] }], minItems: 2, maxItems: 2, additionalItems: false },
    { type: "array", items: [{ enum: ["negate", "conflate", "negConf"] }, { $ref: "#" }], minItems: 2, maxItems: 2, additionalItems: false },
    { type: "array", items: [{ enum: ["joinK", "meetK", "joinT", "meetT", "leK", "leT", "settle"] }, { $ref: "#" }, { $ref: "#" }], minItems: 3, maxItems: 3, additionalItems: false },
    { type: "array", items: [{ const: "field" }, { type: "string" }, { $ref: "#" }], minItems: 3, maxItems: 3, additionalItems: false },
  ],
}) as TSchema & { readonly $id: "relating/term/tm" };

export const tyCarrier = schemaCarrier("relating/term/ty", TySchema);
export const tmCarrier = schemaCarrier("relating/term/tm", TmSchema);

export type TyCarrier = Static<typeof tyCarrier.schema>;
export type TmCarrier = Static<typeof tmCarrier.schema>;

export const ty = {
  base: (): Ty => Object.freeze(["base"] as const),
  arrow: (domain: Ty, codomain: Ty): Ty => Object.freeze(["arrow", domain, codomain] as const),
  prod: (left: Ty, right: Ty): Ty => Object.freeze(["prod", left, right] as const),
  unit: (): Ty => Object.freeze(["unit"] as const),
} as const;

export const tm = {
  var: (index: number): Tm => {
    if (!Number.isInteger(index) || index < 0) throw new TypeError(`tm.var: de-Bruijn index must be a natural number: ${index}`);
    return Object.freeze(["var", index] as const);
  },
  lam: (body: Tm): Tm => Object.freeze(["lam", body] as const),
  app: (fn: Tm, arg: Tm): Tm => Object.freeze(["app", fn, arg] as const),
  pair: (left: Tm, right: Tm): Tm => Object.freeze(["pair", left, right] as const),
  fst: (value: Tm): Tm => Object.freeze(["fst", value] as const),
  snd: (value: Tm): Tm => Object.freeze(["snd", value] as const),
  star: (): Tm => Object.freeze(["star"] as const),
  mark: (surface: string): Tm => Object.freeze(["mark", surface] as const),
  charge: (name: ChargeValueName): Tm => Object.freeze(["charge", name] as const),
  bool: (value: boolean): Tm => Object.freeze(["bool", value] as const),
  generator: (name: GeneratorName): Tm => Object.freeze(["generator", name] as const),
  negate: (value: Tm): Tm => Object.freeze(["negate", value] as const),
  conflate: (value: Tm): Tm => Object.freeze(["conflate", value] as const),
  negConf: (value: Tm): Tm => Object.freeze(["negConf", value] as const),
  joinK: (left: Tm, right: Tm): Tm => Object.freeze(["joinK", left, right] as const),
  meetK: (left: Tm, right: Tm): Tm => Object.freeze(["meetK", left, right] as const),
  joinT: (left: Tm, right: Tm): Tm => Object.freeze(["joinT", left, right] as const),
  meetT: (left: Tm, right: Tm): Tm => Object.freeze(["meetT", left, right] as const),
  leK: (left: Tm, right: Tm): Tm => Object.freeze(["leK", left, right] as const),
  leT: (left: Tm, right: Tm): Tm => Object.freeze(["leT", left, right] as const),
  settle: (target: Tm, seed: Tm): Tm => Object.freeze(["settle", target, seed] as const),
  /** Project the value of a named field from an object-encoded carrier term. */
  field: (key: string, object: Tm): Tm => Object.freeze(["field", key, object] as const),
} as const;

export function rename(rho: (index: number) => number, term: Tm): Tm {
  switch (term[0]) {
    case "var":
      return tm.var(rho(term[1]));
    case "lam":
      return tm.lam(rename((index) => index === 0 ? 0 : rho(index - 1) + 1, term[1]));
    case "app":
      return tm.app(rename(rho, term[1]), rename(rho, term[2]));
    case "pair":
      return tm.pair(rename(rho, term[1]), rename(rho, term[2]));
    case "fst":
      return tm.fst(rename(rho, term[1]));
    case "snd":
      return tm.snd(rename(rho, term[1]));
    case "star":
      return tm.star();
    case "mark":
      return tm.mark(term[1]);
    case "charge":
      return tm.charge(term[1]);
    case "bool":
      return tm.bool(term[1]);
    case "generator":
      return tm.generator(term[1]);
    case "negate":
      return tm.negate(rename(rho, term[1]));
    case "conflate":
      return tm.conflate(rename(rho, term[1]));
    case "negConf":
      return tm.negConf(rename(rho, term[1]));
    case "joinK":
      return tm.joinK(rename(rho, term[1]), rename(rho, term[2]));
    case "meetK":
      return tm.meetK(rename(rho, term[1]), rename(rho, term[2]));
    case "joinT":
      return tm.joinT(rename(rho, term[1]), rename(rho, term[2]));
    case "meetT":
      return tm.meetT(rename(rho, term[1]), rename(rho, term[2]));
    case "leK":
      return tm.leK(rename(rho, term[1]), rename(rho, term[2]));
    case "leT":
      return tm.leT(rename(rho, term[1]), rename(rho, term[2]));
    case "settle":
      return tm.settle(rename(rho, term[1]), rename(rho, term[2]));
    case "field":
      return tm.field(term[1], rename(rho, term[2]));
  }
}

export function subst(sigma: (index: number) => Tm, term: Tm): Tm {
  switch (term[0]) {
    case "var":
      return sigma(term[1]);
    case "lam":
      return tm.lam(subst((index) => index === 0 ? tm.var(0) : rename((n) => n + 1, sigma(index - 1)), term[1]));
    case "app":
      return tm.app(subst(sigma, term[1]), subst(sigma, term[2]));
    case "pair":
      return tm.pair(subst(sigma, term[1]), subst(sigma, term[2]));
    case "fst":
      return tm.fst(subst(sigma, term[1]));
    case "snd":
      return tm.snd(subst(sigma, term[1]));
    case "star":
      return tm.star();
    case "mark":
      return tm.mark(term[1]);
    case "charge":
      return tm.charge(term[1]);
    case "bool":
      return tm.bool(term[1]);
    case "generator":
      return tm.generator(term[1]);
    case "negate":
      return tm.negate(subst(sigma, term[1]));
    case "conflate":
      return tm.conflate(subst(sigma, term[1]));
    case "negConf":
      return tm.negConf(subst(sigma, term[1]));
    case "joinK":
      return tm.joinK(subst(sigma, term[1]), subst(sigma, term[2]));
    case "meetK":
      return tm.meetK(subst(sigma, term[1]), subst(sigma, term[2]));
    case "joinT":
      return tm.joinT(subst(sigma, term[1]), subst(sigma, term[2]));
    case "meetT":
      return tm.meetT(subst(sigma, term[1]), subst(sigma, term[2]));
    case "leK":
      return tm.leK(subst(sigma, term[1]), subst(sigma, term[2]));
    case "leT":
      return tm.leT(subst(sigma, term[1]), subst(sigma, term[2]));
    case "settle":
      return tm.settle(subst(sigma, term[1]), subst(sigma, term[2]));
    case "field":
      return tm.field(term[1], subst(sigma, term[2]));
  }
}

export function inst(body: Tm, value: Tm): Tm {
  return subst((index) => index === 0 ? value : tm.var(index - 1), body);
}

function dedupe(terms: readonly Tm[]): readonly Tm[] {
  const seen = new Set<string>();
  const out: Tm[] = [];
  for (const term of terms) {
    const key = JSON.stringify(term);
    if (!seen.has(key)) {
      seen.add(key);
      out.push(term);
    }
  }
  return Object.freeze(out);
}

const chargeName = (term: Tm): ChargeValueName | undefined => term[0] === "charge" ? term[1] : undefined;

const unaryChargeStep = (
  ctor: (value: Tm) => Tm,
  op: (value: ReturnType<typeof chargeValue>) => ReturnType<typeof chargeValue>,
  value: Tm,
): readonly Tm[] => {
  const name = chargeName(value);
  const top = name === undefined ? [] : [tm.charge(op(chargeValue(name)).name)];
  return dedupe([...top, ...step(value).map((next) => ctor(next))]);
};

const binaryChargeStep = (
  ctor: (left: Tm, right: Tm) => Tm,
  op: (left: ReturnType<typeof chargeValue>, right: ReturnType<typeof chargeValue>) => ReturnType<typeof chargeValue>,
  left: Tm,
  right: Tm,
): readonly Tm[] => {
  const leftName = chargeName(left);
  const rightName = chargeName(right);
  const top = leftName === undefined || rightName === undefined
    ? []
    : [tm.charge(op(chargeValue(leftName), chargeValue(rightName)).name)];
  return dedupe([
    ...top,
    ...step(left).map((next) => ctor(next, right)),
    ...step(right).map((next) => ctor(left, next)),
  ]);
};

const orderStep = (
  ctor: (left: Tm, right: Tm) => Tm,
  op: (left: ReturnType<typeof charge>, right: ReturnType<typeof charge>) => boolean,
  left: Tm,
  right: Tm,
): readonly Tm[] => {
  const leftName = chargeName(left);
  const rightName = chargeName(right);
  const top = leftName === undefined || rightName === undefined
    ? []
    : [tm.bool(op(charge(chargeValue(leftName)), charge(chargeValue(rightName))))];
  return dedupe([
    ...top,
    ...step(left).map((next) => ctor(next, right)),
    ...step(right).map((next) => ctor(left, next)),
  ]);
};

function devUnaryCharge(ctor: (value: Tm) => Tm, op: (value: ReturnType<typeof chargeValue>) => ReturnType<typeof chargeValue>, value: Tm): Tm {
  const next = dev(value);
  const name = chargeName(next);
  return name === undefined ? ctor(next) : tm.charge(op(chargeValue(name)).name);
}

function devBinaryCharge(
  ctor: (left: Tm, right: Tm) => Tm,
  op: (left: ReturnType<typeof chargeValue>, right: ReturnType<typeof chargeValue>) => ReturnType<typeof chargeValue>,
  left: Tm,
  right: Tm,
): Tm {
  const nextLeft = dev(left);
  const nextRight = dev(right);
  const leftName = chargeName(nextLeft);
  const rightName = chargeName(nextRight);
  return leftName === undefined || rightName === undefined
    ? ctor(nextLeft, nextRight)
    : tm.charge(op(chargeValue(leftName), chargeValue(rightName)).name);
}

function devOrder(ctor: (left: Tm, right: Tm) => Tm, op: (left: ReturnType<typeof charge>, right: ReturnType<typeof charge>) => boolean, left: Tm, right: Tm): Tm {
  const nextLeft = dev(left);
  const nextRight = dev(right);
  const leftName = chargeName(nextLeft);
  const rightName = chargeName(nextRight);
  return leftName === undefined || rightName === undefined
    ? ctor(nextLeft, nextRight)
    : tm.bool(op(charge(chargeValue(leftName)), charge(chargeValue(rightName))));
}

/** All one-step reducts admitted by RelMath.CHL.step. */
export function step(term: Tm): readonly Tm[] {
  switch (term[0]) {
    case "var":
    case "star":
    case "mark":
    case "charge":
    case "bool":
    case "generator":
      return Object.freeze([]);
    case "lam":
      return dedupe(step(term[1]).map((body) => tm.lam(body)));
    case "app": {
      const top = term[1][0] === "lam" ? [inst(term[1][1], term[2])] : [];
      return dedupe([
        ...top,
        ...step(term[1]).map((fn) => tm.app(fn, term[2])),
        ...step(term[2]).map((arg) => tm.app(term[1], arg)),
      ]);
    }
    case "pair":
      return dedupe([
        ...step(term[1]).map((left) => tm.pair(left, term[2])),
        ...step(term[2]).map((right) => tm.pair(term[1], right)),
      ]);
    case "fst": {
      const top = term[1][0] === "pair" ? [term[1][1]] : [];
      return dedupe([...top, ...step(term[1]).map((value) => tm.fst(value))]);
    }
    case "snd": {
      const top = term[1][0] === "pair" ? [term[1][2]] : [];
      return dedupe([...top, ...step(term[1]).map((value) => tm.snd(value))]);
    }
    case "negate":
      return unaryChargeStep(tm.negate, negateValue, term[1]);
    case "conflate":
      return unaryChargeStep(tm.conflate, conflateValue, term[1]);
    case "negConf":
      return unaryChargeStep(tm.negConf, (value) => negateValue(conflateValue(value)), term[1]);
    case "joinK":
      return binaryChargeStep(tm.joinK, joinKnowledgeValue, term[1], term[2]);
    case "meetK":
      return binaryChargeStep(tm.meetK, meetKnowledgeValue, term[1], term[2]);
    case "joinT":
      return binaryChargeStep(tm.joinT, joinTruthValue, term[1], term[2]);
    case "meetT":
      return binaryChargeStep(tm.meetT, meetTruthValue, term[1], term[2]);
    case "leK":
      return orderStep(tm.leK, leqKnowledge, term[1], term[2]);
    case "leT":
      return orderStep(tm.leT, leqTruth, term[1], term[2]);
    case "settle":
      return binaryChargeStep(
        tm.settle,
        (target, seed) => settleOverValue(chargeJoinVClosure(target), seed),
        term[1],
        term[2],
      );
    case "field": {
      const projected = objectFieldOf(term[2], term[1]);
      return dedupe([
        ...(projected === undefined ? [] : [projected]),
        ...step(term[2]).map((object) => tm.field(term[1], object)),
      ]);
    }
  }
}

/** Takahashi complete development, matching RelMath.CHL.dev. */
export function dev(term: Tm): Tm {
  switch (term[0]) {
    case "var":
      return tm.var(term[1]);
    case "star":
      return tm.star();
    case "mark":
      return tm.mark(term[1]);
    case "charge":
      return tm.charge(term[1]);
    case "bool":
      return tm.bool(term[1]);
    case "generator":
      return tm.generator(term[1]);
    case "lam":
      return tm.lam(dev(term[1]));
    case "app":
      return term[1][0] === "lam"
        ? inst(dev(term[1][1]), dev(term[2]))
        : tm.app(dev(term[1]), dev(term[2]));
    case "pair":
      return tm.pair(dev(term[1]), dev(term[2]));
    case "fst":
      return term[1][0] === "pair" ? dev(term[1][1]) : tm.fst(dev(term[1]));
    case "snd":
      return term[1][0] === "pair" ? dev(term[1][2]) : tm.snd(dev(term[1]));
    case "negate":
      return devUnaryCharge(tm.negate, negateValue, term[1]);
    case "conflate":
      return devUnaryCharge(tm.conflate, conflateValue, term[1]);
    case "negConf":
      return devUnaryCharge(tm.negConf, (value) => negateValue(conflateValue(value)), term[1]);
    case "joinK":
      return devBinaryCharge(tm.joinK, joinKnowledgeValue, term[1], term[2]);
    case "meetK":
      return devBinaryCharge(tm.meetK, meetKnowledgeValue, term[1], term[2]);
    case "joinT":
      return devBinaryCharge(tm.joinT, joinTruthValue, term[1], term[2]);
    case "meetT":
      return devBinaryCharge(tm.meetT, meetTruthValue, term[1], term[2]);
    case "leK":
      return devOrder(tm.leK, leqKnowledge, term[1], term[2]);
    case "leT":
      return devOrder(tm.leT, leqTruth, term[1], term[2]);
    case "settle":
      return devBinaryCharge(
        tm.settle,
        (target, seed) => settleOverValue(chargeJoinVClosure(target), seed),
        term[1],
        term[2],
      );
    case "field": {
      const developed = dev(term[2]);
      const projected = objectFieldOf(developed, term[1]);
      return projected === undefined ? tm.field(term[1], developed) : projected;
    }
  }
}

export function evaluate(term: Tm): Tm {
  let current = term;
  for (let fuel = 0; fuel < 10_000; fuel += 1) {
    const next = dev(current);
    if (JSON.stringify(next) === JSON.stringify(current)) return next;
    current = next;
  }
  throw new Error("eval: development did not reach a fixed point within 10000 iterations");
}

export { evaluate as eval };

const arrayTag = "relating.term.array";
const objectTag = "relating.term.object";

function listTerm(items: readonly Tm[]): Tm {
  return items.reduceRight<Tm>((tail, item) => tm.pair(item, tail), tm.star());
}

function termList(term: Tm): readonly Tm[] {
  const out: Tm[] = [];
  let current = term;
  while (current[0] === "pair") {
    out.push(current[1]);
    current = current[2];
  }
  if (current[0] !== "star") throw new TypeError(`termToCarrier: malformed product list ${JSON.stringify(term)}`);
  return Object.freeze(out);
}

function markString(term: Tm): string | undefined {
  if (term[0] !== "mark") return undefined;
  const value = parse(term[1]);
  return typeof value === "string" ? value : undefined;
}

/**
 * Project the value of a named field from an object-encoded term — a structural
 * walk of the bridge's object encoding (sorted (key-mark, value) pair-list). No
 * TS delegation; `undefined` if the term is not an object or lacks the key.
 */
function objectFieldOf(term: Tm, key: string): Tm | undefined {
  if (term[0] !== "pair" || term[1][0] !== "mark" || term[1][1] !== canonical(objectTag)) return undefined;
  const wanted = canonical(key);
  let entries = term[2];
  while (entries[0] === "pair") {
    const entry = entries[1];
    if (entry[0] === "pair" && entry[1][0] === "mark" && entry[1][1] === wanted) return entry[2];
    entries = entries[2];
  }
  return undefined;
}

/**
 * Admit a JSON carrier into the term layer.
 *
 * The bridge follows the CHL spine: atomic booleans and FOUR values become
 * domain leaves, unit-like null becomes star, and JSON products become product
 * terms. `mark` remains only the opaque leaf for atoms/field labels with no
 * built-in domain operation.
 */
export function carrierToTerm(value: JsonValue): Tm {
  if (value === null) return tm.star();
  if (typeof value === "boolean") return tm.bool(value);
  if (typeof value === "string" && isChargeValueName(value)) return tm.charge(value);
  if (typeof value === "string" || typeof value === "number") return tm.mark(canonical(value));
  if (Array.isArray(value)) {
    return tm.pair(tm.mark(canonical(arrayTag)), listTerm(value.map((item) => carrierToTerm(item))));
  }
  const record = value as { readonly [key: string]: JsonValue };
  const entries = Object.keys(record).sort().map((key) =>
    tm.pair(tm.mark(canonical(key)), carrierToTerm(record[key] as JsonValue)));
  return tm.pair(tm.mark(canonical(objectTag)), listTerm(entries));
}

/** Decode a normal-form term back to an admitted JSON carrier. */
export function termToCarrier(term: Tm): JsonValue {
  if (term[0] === "mark") return parse(term[1]);
  if (term[0] === "bool") return term[1];
  if (term[0] === "charge") return term[1];
  if (term[0] === "generator") return term[1];
  if (term[0] === "star") return null;
  if (term[0] === "pair") {
    const tag = markString(term[1]);
    if (tag === arrayTag) return termList(term[2]).map((item) => termToCarrier(item));
    if (tag === objectTag) {
      const out: Record<string, JsonValue> = {};
      for (const entry of termList(term[2])) {
        if (entry[0] !== "pair") throw new TypeError(`termToCarrier: malformed object entry ${JSON.stringify(entry)}`);
        const key = markString(entry[1]);
        if (key === undefined) throw new TypeError(`termToCarrier: object key is not an opaque string mark ${JSON.stringify(entry[1])}`);
        out[key] = termToCarrier(entry[2]);
      }
      return out;
    }
    return [termToCarrier(term[1]), termToCarrier(term[2])];
  }
  throw new TypeError(`termToCarrier: cannot decode normal form ${JSON.stringify(term)}`);
}

/** Apply an action run-term to an admitted input carrier and evaluate it. */
export function evaluateRunTerm(runTerm: Tm, input: JsonValue): JsonValue {
  const normal = evaluate(tm.app(runTerm, carrierToTerm(input)));
  return termToCarrier(normal);
}

// ── descent morphisms as faithful IR compositions over the real carriers ──
// Each rebuilds the exact codomain-carrier structure its TS counterpart
// produces, using the bridge's own object/array/mark encoding. The builders
// below mirror carrierToTerm so a constructed term round-trips through
// termToCarrier identically to the admitted carrier it represents.

/** Build an object-carrier term (matching carrierToTerm's object encoding). */
function objectTerm(entries: ReadonlyArray<readonly [string, Tm]>): Tm {
  const sorted = [...entries].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  return tm.pair(
    tm.mark(canonical(objectTag)),
    listTerm(sorted.map(([key, value]) => tm.pair(tm.mark(canonical(key)), value))),
  );
}

/** Build an array-carrier term (matching carrierToTerm's array encoding). */
function arrayTerm(items: readonly Tm[]): Tm {
  return tm.pair(tm.mark(canonical(arrayTag)), listTerm(items));
}

/** Admit a string literal exactly as the bridge encodes one (an opaque mark). */
function stringTerm(value: string): Tm {
  return tm.mark(canonical(value));
}

/**
 * The descent morphisms whose logic is pure structural rebuild, as faithful IR
 * terms (no domain primitive, no TS delegation).
 *
 * - `articulate`: an utterance carrier (var 0) opens into its potential
 *   articulation cell `{ kind: "utterance.articulation.cell",
 *   potentialAperiodicArticulationCell: [utterance, [[], []]] }` — the
 *   empty-slot initial object, matching `articulating/utterance.articulate`.
 *
 * - `predicate`: an articulation cell (var 0) opens into the predication site's
 *   GENERATORS — the single reflexive cell `{ subject: token, predicate:
 *   {kind, claim, mark}, object: token }` over the carrier's token/claim, wrapped
 *   `{ kind: "predication.site", cells: [cell], specializations: [] }`. Faithful to
 *   `predicate` after the carrier slim (the derived entities/predicates/base are a
 *   read-time materialization, not stored). Uses `field` to destructure the carrier.
 *
 * `posit`/`settle` are NOT here yet: their carriers must be slimmed to their
 * generators first (same pattern), then they collapse to structural builds too.
 */
const articulateTerm = tm.lam(
  objectTerm([
    ["kind", stringTerm("utterance.articulation.cell")],
    [
      "potentialAperiodicArticulationCell",
      arrayTerm([tm.var(0), arrayTerm([arrayTerm([]), arrayTerm([])])]),
    ],
  ]),
);

const predicateTerm = (() => {
  const input = tm.var(0);
  // carrier = input.potentialAperiodicArticulationCell[0]  (the utterance carrier)
  const carrier = tm.fst(tm.snd(tm.field("potentialAperiodicArticulationCell", input)));
  const token = tm.field("token", carrier);
  const claim = tm.field("claim", carrier);
  const predicateObject = objectTerm([
    ["kind", stringTerm("predication.predicate")],
    ["claim", claim],
    ["mark", tm.field("mark", claim)],
  ]);
  const cellObject = objectTerm([
    ["subject", token],
    ["predicate", predicateObject],
    ["object", token],
  ]);
  return tm.lam(
    objectTerm([
      ["kind", stringTerm("predication.site")],
      ["cells", arrayTerm([cellObject])],
      ["specializations", arrayTerm([])],
    ]),
  );
})();

// `posit` over the slimmed carriers: the bare presheaf adds no essential data
// (its fiber/valuation/traces are a free construction over the predication
// generators), so it re-tags the predication generators as a presheaf.
const positTerm = tm.lam(
  objectTerm([
    ["kind", stringTerm("predication.posit.presheaf")],
    ["cells", tm.field("cells", tm.var(0))],
    ["specializations", tm.field("specializations", tm.var(0))],
  ]),
);

// `settle` over the slimmed carriers: the settlement is the terminal free
// construction over the predication generators (stages/cofinality all derived),
// so the bare settle carries the generators forward under the filtration kind.
const settleTerm = tm.lam(
  objectTerm([
    ["kind", stringTerm("predication.settlement.filtration")],
    ["cells", tm.field("cells", tm.var(0))],
    ["specializations", tm.field("specializations", tm.var(0))],
  ]),
);

// induceRelation = settle ∘ posit ∘ predicate ∘ articulate, as ONE IR term: the
// whole relation descent composed in the calculus (each leg a closed lambda).
const induceRelationTerm = tm.lam(
  tm.app(settleTerm, tm.app(positTerm, tm.app(predicateTerm, tm.app(articulateTerm, tm.var(0))))),
);

export const descent = Object.freeze({
  articulate: articulateTerm,
  predicate: predicateTerm,
  posit: positTerm,
  settle: settleTerm,
  induceRelation: induceRelationTerm,
} as const);
