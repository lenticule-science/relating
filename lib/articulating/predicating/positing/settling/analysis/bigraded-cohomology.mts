/**
 * analysis/bigraded-cohomology - finite executable shadow of
 * RelMath.Positing.BigradedCohomology.
 *
 * Lean states the aperiodic-regime trichotomy and the internal Z/2 gauge over a
 * finite cell list and valuation. This runtime surface takes the finite list of
 * FOUR charge names that results from such a valuation and returns the
 * truth/inconsistency content, regime, and gauge facts as a carrier receipt.
 */
import {
  asChargeValueName,
  chargeValue,
  chargeValueName,
  negateValue,
  type ChargeValueName,
} from "../../bilattice-charge.mjs";

export type BigradedRegimeName = "trivial" | "consistent" | "paraconsistent" | "mixed";

export interface BigradedCohomologyReceipt {
  readonly kind: "bigradedCohomology.receipt:witness";
  readonly charges: readonly ChargeValueName[];
  readonly negated: readonly ChargeValueName[];
  readonly truthContent: boolean;
  readonly falseContent: boolean;
  readonly inconsistencyContent: boolean;
  readonly regime: BigradedRegimeName;
  readonly nontrivialTrichotomy: true;
  readonly truthInconsistencyDisjoint: true;
  readonly gaugeFixesInconsistency: true;
  readonly gaugeFlipsTruthToFalse: true;
  readonly paraconsistentGaugeStable: boolean;
  readonly classicalGaugeMoved: boolean;
}

const freezeChargeNames = (charges: readonly ChargeValueName[]): readonly ChargeValueName[] =>
  Object.freeze([...charges]);

export const normalizeChargeNames = (charges: readonly string[]): readonly ChargeValueName[] =>
  freezeChargeNames(charges.map(asChargeValueName));

export const isTruthFiring = (charge: ChargeValueName): boolean => charge === "potential";
export const isFalseFiring = (charge: ChargeValueName): boolean => charge === "active";
export const isInconsistency = (charge: ChargeValueName): boolean => charge === "stable";

export const truthContent = (charges: readonly ChargeValueName[]): boolean => charges.some(isTruthFiring);
export const falseContent = (charges: readonly ChargeValueName[]): boolean => charges.some(isFalseFiring);
export const inconsistencyContent = (charges: readonly ChargeValueName[]): boolean => charges.some(isInconsistency);

export function regimeOf(truth: boolean, inconsistency: boolean): BigradedRegimeName {
  if (truth && inconsistency) return "mixed";
  if (truth) return "consistent";
  if (inconsistency) return "paraconsistent";
  return "trivial";
}

export const negateNames = (charges: readonly ChargeValueName[]): readonly ChargeValueName[] =>
  freezeChargeNames(charges.map((name) => chargeValueName(negateValue(chargeValue(name)))));

const paraconsistentOnly = (charges: readonly ChargeValueName[]): boolean =>
  charges.every((name) => name === "absurd" || name === "stable");

/** Finite bigraded-cohomology and gauge receipt over a list of FOUR charge names. */
export function receipt(chargesInput: readonly string[]): BigradedCohomologyReceipt {
  const charges = normalizeChargeNames(chargesInput);
  const negated = negateNames(charges);
  const truth = truthContent(charges);
  const falsity = falseContent(charges);
  const inconsistency = inconsistencyContent(charges);
  const negatedTruth = truthContent(negated);
  const negatedInconsistency = inconsistencyContent(negated);
  const paraconsistentGaugeStable = paraconsistentOnly(charges)
    ? negated.every((name, index) => name === charges[index])
    : false;
  const classicalGaugeMoved = charges.some((name, index) => isTruthFiring(name) && negated[index] !== name);

  if (negatedInconsistency !== inconsistency) {
    throw new Error("bigradedCohomology: negation failed to preserve inconsistency content");
  }
  if (negatedTruth !== falsity) {
    throw new Error("bigradedCohomology: negation failed to flip truth content to false content");
  }

  return Object.freeze({
    kind: "bigradedCohomology.receipt:witness" as const,
    charges,
    negated,
    truthContent: truth,
    falseContent: falsity,
    inconsistencyContent: inconsistency,
    regime: regimeOf(truth, inconsistency),
    nontrivialTrichotomy: true as const,
    truthInconsistencyDisjoint: true as const,
    gaugeFixesInconsistency: true as const,
    gaugeFlipsTruthToFalse: true as const,
    paraconsistentGaugeStable,
    classicalGaugeMoved,
  });
}

export const workedMixedCharges: readonly ChargeValueName[] = Object.freeze([
  "potential",
  "stable",
  "absurd",
]);

export const workedParaconsistentCharges: readonly ChargeValueName[] = Object.freeze([
  "stable",
  "absurd",
]);
