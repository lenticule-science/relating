/**
 * economy — exact graded value and conservation readings over relating.
 *
 * This is the layer-1 economic substrate formerly surfaced through trading's
 * money/conservation modules. A value is an exact Rational carried in a grade
 * (commodity, asset, unit, or other superselection sector). Arithmetic is exact,
 * grade-safe, and delegates to settling/analysis. Double-entry is the
 * conservation law over section flows.
 */
import {
  integer,
  fromNatural,
  rational,
  natZero,
  successor,
  natAdd,
  natMultiply,
  graded,
  gradedZero,
  gradedAdd,
  gradedSubtract,
  gradedNegate,
  gradedIsZero,
  gradedCompare,
  gradedScale,
  gradedTimes,
  gradeOf,
  gradedValue,
  conservation,
  type GradedRational,
  type Integer,
  type Natural,
  type Rational,
} from "../../lib/articulating/predicating/positing/settling/analysis/index.mjs";
import type { SectionCarrier } from "../../lib/articulating/predicating/positing/settling/section.mjs";
import { action, type Action } from "../running/action.mjs";
import { parseDecimal as parseRatDecimal, toDecimalString as ratToDecimalString } from "../writing/exact-number.mjs";
import { jsonResource, type JsonRecord, type JsonValue } from "../writing/json.mjs";

export type ExactValue = GradedRational;
export type Money = ExactValue;
export type { Rational, Integer, Natural };

export type ConservedJudgment = conservation.ConservedJudgment;
export type CompletionJudgment = conservation.CompletionJudgment;
export type GradedConservedJudgment = conservation.GradedConservedJudgment;
export type GradedCompletionJudgment = conservation.GradedCompletionJudgment;

const naturalFromNonNegBigInt = (value: bigint): Natural => {
  if (value < 0n) throw new RangeError(`naturalFromNonNegBigInt: negative ${value}`);
  if (value === 0n) return natZero;
  const ten = (() => {
    let n = natZero;
    for (let i = 0; i < 10; i += 1) n = successor(n);
    return n;
  })();
  const digitNaturals: readonly Natural[] = (() => {
    const out: Natural[] = [natZero];
    let n = natZero;
    for (let i = 1; i <= 9; i += 1) {
      n = successor(n);
      out.push(n);
    }
    return Object.freeze(out);
  })();
  let acc = natZero;
  for (const ch of value.toString()) {
    const digit = ch.charCodeAt(0) - 48;
    acc = natAdd(natMultiply(acc, ten), digitNaturals[digit] ?? natZero);
  }
  return acc;
};

const integerFromBigInt = (value: bigint): Integer =>
  value < 0n
    ? integer(natZero, naturalFromNonNegBigInt(-value))
    : fromNatural(naturalFromNonNegBigInt(value));

const bigIntFromNatural = (n: Natural): bigint => BigInt(n.members.length);

const bigIntFromInteger = (z: Integer): bigint =>
  bigIntFromNatural(z.pos) - bigIntFromNatural(z.neg);

const bigIntPartsOfRational = (q: Rational): { readonly num: bigint; readonly den: bigint } =>
  Object.freeze({ num: bigIntFromInteger(q.num), den: bigIntFromInteger(q.den) });

export const exactValue = (value: Rational, grade: string): ExactValue => graded(value, grade);
export const money = exactValue;

export const valueFromParts = (num: bigint, den: bigint, grade: string): ExactValue =>
  graded(rational(integerFromBigInt(num), integerFromBigInt(den)), grade);
export const moneyFromParts = valueFromParts;

export const valueZero = (grade: string): ExactValue => gradedZero(grade);
export const moneyZero = valueZero;

export const addValue = (left: ExactValue, right: ExactValue): ExactValue => gradedAdd(left, right);
export const addMoney = addValue;

export const subValue = (left: ExactValue, right: ExactValue): ExactValue => gradedSubtract(left, right);
export const subMoney = subValue;

export const negateValue = (value: ExactValue): ExactValue => gradedNegate(value);
export const negateMoney = negateValue;

export const isZeroValue = (value: ExactValue): boolean => gradedIsZero(value);
export const isZeroMoney = isZeroValue;

export const cmpValue = (left: ExactValue, right: ExactValue): -1 | 0 | 1 => gradedCompare(left, right);
export const cmpMoney = cmpValue;

export const scaleValue = (value: ExactValue, scalar: Rational): ExactValue => gradedScale(value, scalar);
export const scaleMoney = scaleValue;

export const timesValue = (left: ExactValue, right: ExactValue, grade: string): ExactValue =>
  gradedTimes(left, right, grade);
export const timesMoney = timesValue;

export const gradeOfValue = (value: ExactValue): string => gradeOf(value);
export const commodityOf = gradeOfValue;

export const valueRational = (value: ExactValue): Rational => gradedValue(value);

export const ratioOf = (left: ExactValue, right: ExactValue): { readonly num: bigint; readonly den: bigint } => {
  const l = bigIntPartsOfRational(gradedValue(left));
  const r = bigIntPartsOfRational(gradedValue(right));
  return Object.freeze({ num: l.num * r.den, den: l.den * r.num });
};

const valueParts = (value: ExactValue): { readonly num: bigint; readonly den: bigint; readonly grade: string } => {
  const parts = bigIntPartsOfRational(gradedValue(value));
  return Object.freeze({ num: parts.num, den: parts.den, grade: gradeOf(value) });
};

const terminatingPlaces = (den: bigint): number | null => {
  let d = den < 0n ? -den : den;
  if (d === 0n) return null;
  let twos = 0;
  let fives = 0;
  while (d % 2n === 0n) {
    d /= 2n;
    twos += 1;
  }
  while (d % 5n === 0n) {
    d /= 5n;
    fives += 1;
  }
  return d === 1n ? Math.max(twos, fives) : null;
};

export const toDecimalString = (value: ExactValue): string => {
  const q = gradedValue(value);
  const places = terminatingPlaces(bigIntPartsOfRational(q).den);
  return ratToDecimalString(q, places ?? 8);
};

export const toExactString = (value: ExactValue): string => {
  const parts = valueParts(value);
  return `${parts.num}/${parts.den} ${parts.grade}`;
};

export const parseDecimalValue = (decimal: string, grade: string): ExactValue => {
  const { value } = parseRatDecimal(decimal);
  return exactValue(value, grade);
};
export const parseDecimalMoney = parseDecimalValue;

export const exactValueSchema = Object.freeze({
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "relating/economy/exact-value",
  title: "ExactValue",
  description:
    "Exact graded value: a Rational carried in a superselection grade. Arithmetic is exact and grade-safe.",
  type: "object",
  required: ["kind", "value", "grade"],
  additionalProperties: false,
  properties: {
    kind: { const: "exactNumber.gradedRational" },
    grade: { type: "string" },
    value: { $ref: "#/$defs/Rational" },
  },
  $defs: {
    Natural: {
      type: "object",
      required: ["kind", "members"],
      properties: {
        kind: { const: "exactNumber.natural" },
        members: { type: "array", items: { $ref: "#/$defs/Natural" } },
      },
    },
    Integer: {
      type: "object",
      required: ["kind", "pos", "neg"],
      properties: {
        kind: { const: "exactNumber.integer" },
        pos: { $ref: "#/$defs/Natural" },
        neg: { $ref: "#/$defs/Natural" },
      },
    },
    Rational: {
      type: "object",
      required: ["kind", "num", "den"],
      properties: {
        kind: { const: "exactNumber.rational" },
        num: { $ref: "#/$defs/Integer" },
        den: { $ref: "#/$defs/Integer" },
      },
    },
  },
} as const);
export const moneySchema = exactValueSchema;

export function balanceOf(section: SectionCarrier, flow: readonly Rational[]): ConservedJudgment {
  return conservation.conserved(conservation.flowNetwork(section), flow);
}

export function completePosting(
  section: SectionCarrier,
  flow: readonly Rational[],
  holeIndex: number,
): CompletionJudgment {
  return conservation.complete(conservation.flowNetwork(section), flow, holeIndex);
}

export function gradedBalanceOf(amounts: readonly ExactValue[]): GradedConservedJudgment {
  return conservation.gradedConserved(amounts);
}

export function inferElidedValue(known: readonly ExactValue[]): GradedCompletionJudgment {
  return conservation.gradedComplete(known);
}
export const inferElidedMoney = inferElidedValue;

const flowFromWire = (value: unknown): readonly Rational[] => {
  if (!Array.isArray(value)) {
    throw new TypeError("a flow is an array of one Rational per oriented posting edge");
  }
  return value as readonly Rational[];
};

const structuralObstruction = (verb: string, error: unknown): JsonValue =>
  jsonResource(
    Object.freeze({
      kind: "relating.economy.conservation.structural-obstruction" as const,
      verb,
      reason: error instanceof Error ? error.message : String(error),
    }),
    "conservation structural obstruction",
  );

export const conserveAction: Action = action({
  verb: "conserve",
  inputFormat: "json",
  outputFormat: "json",
  summary: "Judge a section's posting flow for double-entry balance.",
  description:
    "Domain: a JSON object { section, flow } — a relating SectionCarrier and one Rational per oriented posting edge. Codomain: the conservation judgment, or a structural obstruction for malformed flow shape.",
  run: (input: unknown): JsonValue => {
    if (input === null || typeof input !== "object" || Array.isArray(input)) {
      throw new TypeError("conserve: expected a JSON object { section, flow }");
    }
    const record = input as JsonRecord;
    if (!("section" in record) || !("flow" in record)) {
      throw new TypeError("conserve: requires section and flow");
    }
    try {
      return jsonResource(
        balanceOf(record["section"] as unknown as SectionCarrier, flowFromWire(record["flow"])) as unknown as JsonValue,
        "balance judgment",
      );
    } catch (error) {
      return structuralObstruction("conserve", error);
    }
  },
});

export const completePostingAction: Action = action({
  verb: "complete-posting",
  inputFormat: "json",
  outputFormat: "json",
  summary: "Infer the single elided posting that completes a book into conservation.",
  description:
    "Domain: a JSON object { section, flow, holeIndex }. Codomain: the completion judgment, or a structural obstruction for malformed flow shape.",
  run: (input: unknown): JsonValue => {
    if (input === null || typeof input !== "object" || Array.isArray(input)) {
      throw new TypeError("complete-posting: expected a JSON object { section, flow, holeIndex }");
    }
    const record = input as JsonRecord;
    if (!("section" in record) || !("flow" in record) || !("holeIndex" in record)) {
      throw new TypeError("complete-posting: requires section, flow, and holeIndex");
    }
    const holeIndex = record["holeIndex"];
    if (typeof holeIndex !== "number" || !Number.isInteger(holeIndex)) {
      throw new TypeError("complete-posting: holeIndex must be an integer edge index");
    }
    try {
      return jsonResource(
        completePosting(record["section"] as unknown as SectionCarrier, flowFromWire(record["flow"]), holeIndex) as unknown as JsonValue,
        "completion judgment",
      );
    } catch (error) {
      return structuralObstruction("complete-posting", error);
    }
  },
});

export const conservationActions: readonly Action[] = Object.freeze([
  conserveAction,
  completePostingAction,
]);
