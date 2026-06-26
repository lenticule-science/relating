/**
 * analysis/internal-real - finite executable shadows of RelMath.InternalReals.
 *
 * Lean derives constructive rationals/reals, logarithms, scalar cancellation,
 * entropy monotonicity, and the per-step log-Lipschitz bound. This module keeps
 * the Node surface finite and exact: it computes rational approximants and
 * carrier-shaped witnesses for the laws that can be checked over bounded Nat
 * inputs without pretending to materialize arbitrary Bishop reals.
 */
import {
  fromRatio,
  ratAdd,
  ratCompare,
  ratFromInt,
  ratMultiply,
  ratOne,
  type Rational,
} from "./exact-number.mjs";

const assertNat = (name: string, value: number): void => {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new RangeError(`${name}: expected a non-negative safe integer`);
  }
};

function powNat(base: number, exponent: number): number {
  assertNat("powNat base", base);
  assertNat("powNat exponent", exponent);
  let value = 1;
  for (let index = 0; index < exponent; index += 1) {
    value *= base;
    if (!Number.isSafeInteger(value)) throw new RangeError("powNat: result exceeds safe integer range");
  }
  return value;
}

/** The floor logarithm `floor(log_b n)`, matching RelMath.InternalReals.natLog. */
export function natLog(base: number, n: number): number {
  assertNat("natLog base", base);
  assertNat("natLog n", n);
  if (base < 2) throw new RangeError("natLog: base must be at least 2");
  if (n < 1) throw new RangeError("natLog: argument must be at least 1");
  let exponent = 0;
  while (powNat(base, exponent + 1) <= n) exponent += 1;
  return exponent;
}

/** The `k`th rational under-approximation of `log_b(N)`: `floor(log_b(N^(k+1))) / (k+1)`. */
export function logSeq(base: number, n: number, k: number): Rational {
  assertNat("logSeq k", k);
  return fromRatio(natLog(base, powNat(n, k + 1)), k + 1);
}

/** The rational `1/(k+1)` from the Lean `Rat.invNatP k` constructor. */
export function invNatP(k: number): Rational {
  assertNat("invNatP k", k);
  return fromRatio(1, k + 1);
}

/** Repeated addition of a rational, the finite carrier form of `nsmul`. */
export function nsmulRational(m: number, value: Rational): Rational {
  assertNat("nsmulRational m", m);
  return ratMultiply(ratFromInt(m), value);
}

export interface ScalarCancellationWitness {
  readonly kind: "internalReal.scalarCancellation:witness";
  readonly m: number;
  readonly left: Rational;
  readonly right: Rational;
  readonly scaledLeft: Rational;
  readonly scaledRight: Rational;
  readonly positive: true;
  readonly premiseHolds: true;
  readonly conclusionHolds: true;
}

export interface ScalarCancellationObstruction {
  readonly kind: "internalReal.scalarCancellation-obstruction";
  readonly reason: "positive-scalar" | "scaled-order-premise" | "conclusion";
  readonly m: number;
  readonly left: Rational;
  readonly right: Rational;
  readonly scaledLeft: Rational;
  readonly scaledRight: Rational;
  readonly positive: boolean;
  readonly premiseHolds: boolean;
  readonly conclusionHolds: boolean;
}

export type ScalarCancellationJudgment = ScalarCancellationWitness | ScalarCancellationObstruction;

/** The executable rational carrier of `Rat.le_of_ofNat_mul_le_left`. */
export function scalarCancellation(m: number, left: Rational, right: Rational): ScalarCancellationJudgment {
  assertNat("scalarCancellation m", m);
  const scaledLeft = nsmulRational(m, left);
  const scaledRight = nsmulRational(m, right);
  const positive = m >= 1;
  const premiseHolds = ratCompare(scaledLeft, scaledRight) <= 0;
  const conclusionHolds = ratCompare(left, right) <= 0;
  if (positive && premiseHolds && conclusionHolds) {
    return Object.freeze({
      kind: "internalReal.scalarCancellation:witness" as const,
      m,
      left,
      right,
      scaledLeft,
      scaledRight,
      positive,
      premiseHolds,
      conclusionHolds,
    });
  }
  return Object.freeze({
    kind: "internalReal.scalarCancellation-obstruction" as const,
    reason: !positive ? "positive-scalar" as const : !premiseHolds ? "scaled-order-premise" as const : "conclusion" as const,
    m,
    left,
    right,
    scaledLeft,
    scaledRight,
    positive,
    premiseHolds,
    conclusionHolds,
  });
}

export interface LogStepBoundWitness {
  readonly kind: "internalReal.logStepBound:witness";
  readonly base: 2;
  readonly M: number;
  readonly k: number;
  readonly lhs: Rational;
  readonly rhs: Rational;
  readonly admissible: true;
  readonly holds: true;
}

export interface LogStepBoundObstruction {
  readonly kind: "internalReal.logStepBound-obstruction";
  readonly reason: "domain" | "bound";
  readonly base: 2;
  readonly M: number;
  readonly k: number;
  readonly lhs: Rational;
  readonly rhs: Rational;
  readonly admissible: boolean;
  readonly holds: boolean;
}

export type LogStepBoundJudgment = LogStepBoundWitness | LogStepBoundObstruction;

/**
 * Finite rational approximation of `logNat_step_bound`:
 * `log₂(M+1) ≤ log₂ M + 1/(k+1)` when `2(k+1) ≤ M`.
 */
export function logStepBound(M: number, k: number): LogStepBoundJudgment {
  assertNat("logStepBound M", M);
  assertNat("logStepBound k", k);
  const safeM = Math.max(M, 1);
  const lhs = logSeq(2, safeM + 1, k);
  const rhs = ratAdd(logSeq(2, safeM, k), invNatP(k));
  const admissible = 2 * (k + 1) <= M;
  const holds = ratCompare(lhs, rhs) <= 0;
  if (admissible && holds) {
    return Object.freeze({ kind: "internalReal.logStepBound:witness" as const, base: 2 as const, M, k, lhs, rhs, admissible, holds });
  }
  return Object.freeze({
    kind: "internalReal.logStepBound-obstruction" as const,
    reason: admissible ? "bound" as const : "domain" as const,
    base: 2 as const,
    M,
    k,
    lhs,
    rhs,
    admissible,
    holds,
  });
}

export interface LogMonotoneWitness {
  readonly kind: "internalReal.logMonotone:witness";
  readonly base: number;
  readonly lower: number;
  readonly upper: number;
  readonly k: number;
  readonly lowerApprox: Rational;
  readonly upperApprox: Rational;
  readonly admissible: true;
  readonly holds: true;
}

export interface LogMonotoneObstruction {
  readonly kind: "internalReal.logMonotone-obstruction";
  readonly reason: "domain" | "order";
  readonly base: number;
  readonly lower: number;
  readonly upper: number;
  readonly k: number;
  readonly lowerApprox: Rational;
  readonly upperApprox: Rational;
  readonly admissible: boolean;
  readonly holds: boolean;
}

export type LogMonotoneJudgment = LogMonotoneWitness | LogMonotoneObstruction;

/** Finite rational approximation of `logNat_mono`: `M ≤ N -> log_b M ≤ log_b N`. */
export function logMonotone(base: number, lower: number, upper: number, k: number): LogMonotoneJudgment {
  assertNat("logMonotone base", base);
  assertNat("logMonotone lower", lower);
  assertNat("logMonotone upper", upper);
  assertNat("logMonotone k", k);
  const safeLower = Math.max(lower, 1);
  const safeUpper = Math.max(upper, 1);
  const lowerApprox = logSeq(base, safeLower, k);
  const upperApprox = logSeq(base, safeUpper, k);
  const admissible = base >= 2 && 1 <= lower && lower <= upper;
  const holds = ratCompare(lowerApprox, upperApprox) <= 0;
  if (admissible && holds) {
    return Object.freeze({
      kind: "internalReal.logMonotone:witness" as const,
      base,
      lower,
      upper,
      k,
      lowerApprox,
      upperApprox,
      admissible,
      holds,
    });
  }
  return Object.freeze({
    kind: "internalReal.logMonotone-obstruction" as const,
    reason: admissible ? "order" as const : "domain" as const,
    base,
    lower,
    upper,
    k,
    lowerApprox,
    upperApprox,
    admissible,
    holds,
  });
}

/** The fixed Lean theorem `log₂ 2 = 1`, as an exact rational carrier. */
export const binaryShiftEntropy = Object.freeze({
  kind: "internalReal.fullShiftEntropy:witness" as const,
  alphabet: 2,
  value: ratOne,
});
