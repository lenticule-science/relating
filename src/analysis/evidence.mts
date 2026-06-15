/**
 * Evidence and information structure of charge distributions.
 *
 * The predecessor information stack (information / belief / horizon /
 * channel / rate-distortion / free-energy / boundary) measured everything
 * in float bits. The fabric content is exact and lands here:
 *
 * - a charge distribution is an exact histogram, and evidence coordinates
 *   are expectations of the bedrock charge coordinates — rational
 *   throughout;
 * - divergence finiteness is absolute continuity, a support-containment
 *   judgment whose failure is an informational horizon;
 * - the entropy order is mixedness (majorization): exactly decidable, and
 *   respected by every Schur-concave uncertainty functional at once, so
 *   one judgment settles every entropy comparison; which functional — and
 *   which logarithm base — to read at is a boundary coordinate, never
 *   fabric;
 * - dependence in a joint distribution is an exact judgment, and mutual
 *   information vanishes exactly on the independence witness;
 * - a boundary claim is screening-off: internal and external conditionally
 *   independent given the boundary, checked exactly, with no tolerance
 *   knob.
 *
 * Float figures (entropy bits, divergence bits, mutual-information bits)
 * are boundary reads, named `AtBoundary` in the spirit of `toNumber`. The
 * β-weighted objectives of the predecessors (bottleneck, expected free
 * energy, rate-distortion scalarization, equilibrium tolerance) are
 * declined: their weights are slice parameters, and a locus can combine
 * the boundary reads itself.
 */

import { chargeValues, type ChargeValue, type ChargeValueName, type MemeTopologyInformation } from "../topology/index.mjs";
import {
  fromRatio,
  ratAdd,
  ratEqual,
  ratMultiply,
  ratSign,
  ratSubtract,
  toNumber,
  type Rational,
} from "../algebra/index.mjs";

const zero = (): Rational => fromRatio(0, 1);
const present = (value: ChargeValue, side: 0 | 1): boolean => value.coordinates[side].name === "present";

export interface ChargeBin {
  readonly kind: "meme-analysis.evidence.bin";
  readonly value: ChargeValue;
  readonly count: number;
  readonly probability: Rational;
}

export interface ChargeDistributionCarrier {
  readonly kind: "meme-analysis.evidence.distribution";
  readonly total: number;
  /** All four charge values in canonical order; zero counts are kept so
   *  every distribution shares the same support frame. */
  readonly bins: readonly ChargeBin[];
}

/** Exact histogram of charge values. An empty collection presents no
 *  distribution. */
export function chargeDistribution(values: readonly ChargeValue[]): ChargeDistributionCarrier {
  if (values.length === 0) throw new TypeError("an empty collection presents no distribution");
  const bins = chargeValues().map((value) => {
    const count = values.filter((candidate) => candidate.name === value.name).length;
    return Object.freeze({
      kind: "meme-analysis.evidence.bin" as const,
      value,
      count,
      probability: fromRatio(count, values.length),
    });
  });
  return Object.freeze({
    kind: "meme-analysis.evidence.distribution" as const,
    total: values.length,
    bins: Object.freeze(bins),
  });
}

/** The charge histogram of a fixed-point reading's information entries. */
export function informationDistribution(information: MemeTopologyInformation): ChargeDistributionCarrier {
  return chargeDistribution(information.entryCarrier.entries.map((entry) => entry.value));
}

export interface EvidenceCoordinatesCarrier {
  readonly kind: "meme-analysis.evidence.coordinates";
  readonly distribution: ChargeDistributionCarrier;
  /** Expected presence of the truth side. */
  readonly truth: Rational;
  /** Expected presence of the falsity side. */
  readonly falsity: Rational;
  /** truth + falsity — expected height in the knowledge order, 0 through 2. */
  readonly knowledge: Rational;
  /** Probability that both sides are present (the held contradiction). */
  readonly conflict: Rational;
}

/** Expectations of the bedrock charge coordinates, exactly. */
export function evidenceCoordinates(distribution: ChargeDistributionCarrier): EvidenceCoordinatesCarrier {
  let truth = zero();
  let falsity = zero();
  let conflict = zero();
  for (const bin of distribution.bins) {
    if (present(bin.value, 0)) truth = ratAdd(truth, bin.probability);
    if (present(bin.value, 1)) falsity = ratAdd(falsity, bin.probability);
    if (present(bin.value, 0) && present(bin.value, 1)) conflict = ratAdd(conflict, bin.probability);
  }
  return Object.freeze({
    kind: "meme-analysis.evidence.coordinates" as const,
    distribution,
    truth,
    falsity,
    knowledge: ratAdd(truth, falsity),
    conflict,
  });
}

export interface EvidenceDeltaCarrier {
  readonly kind: "meme-analysis.evidence.coordinatesDelta";
  readonly prior: EvidenceCoordinatesCarrier;
  readonly posterior: EvidenceCoordinatesCarrier;
  readonly truthDelta: Rational;
  readonly falsityDelta: Rational;
  readonly knowledgeDelta: Rational;
  readonly conflictDelta: Rational;
}

/** Exact movement of evidence coordinates from a prior to a posterior
 *  distribution — the lawful core of a belief-update read. */
export function evidenceDelta(
  prior: ChargeDistributionCarrier,
  posterior: ChargeDistributionCarrier,
): EvidenceDeltaCarrier {
  const before = evidenceCoordinates(prior);
  const after = evidenceCoordinates(posterior);
  return Object.freeze({
    kind: "meme-analysis.evidence.coordinatesDelta" as const,
    prior: before,
    posterior: after,
    truthDelta: ratSubtract(after.truth, before.truth),
    falsityDelta: ratSubtract(after.falsity, before.falsity),
    knowledgeDelta: ratSubtract(after.knowledge, before.knowledge),
    conflictDelta: ratSubtract(after.conflict, before.conflict),
  });
}

export interface AbsoluteContinuityWitness {
  readonly kind: "meme-analysis.evidence.absoluteContinuity:witness";
  readonly from: ChargeDistributionCarrier;
  readonly to: ChargeDistributionCarrier;
}

export interface AbsoluteContinuityObstruction {
  readonly kind: "meme-analysis.evidence.absoluteContinuity-obstruction";
  readonly from: ChargeDistributionCarrier;
  readonly to: ChargeDistributionCarrier;
  /** Charge values `from` stands on that `to` assigns zero. */
  readonly escaping: readonly ChargeValueName[];
}

export type AbsoluteContinuityJudgment = AbsoluteContinuityWitness | AbsoluteContinuityObstruction;

/** Support containment of `from` within `to`. The divergence of `from`
 *  relative to `to` is finite exactly when the witness exists; an
 *  obstruction is an informational horizon — `to` assigns zero where
 *  `from` stands. */
export function absoluteContinuity(
  from: ChargeDistributionCarrier,
  to: ChargeDistributionCarrier,
): AbsoluteContinuityJudgment {
  const escaping = from.bins
    .filter((bin, index) => bin.count > 0 && to.bins[index]!.count === 0)
    .map((bin) => bin.value.name);
  if (escaping.length > 0) {
    return Object.freeze({
      kind: "meme-analysis.evidence.absoluteContinuity-obstruction" as const,
      from,
      to,
      escaping: Object.freeze(escaping),
    });
  }
  return Object.freeze({ kind: "meme-analysis.evidence.absoluteContinuity:witness" as const, from, to });
}

export type MixednessRelation = "leftMoreMixed" | "rightMoreMixed" | "equallyMixed";

export interface MixednessComparison {
  readonly kind: "meme-analysis.evidence.mixedness";
  readonly left: ChargeDistributionCarrier;
  readonly right: ChargeDistributionCarrier;
  readonly relation: MixednessRelation;
}

export interface MixednessIncomparability {
  readonly kind: "meme-analysis.evidence.mixedness-incomparable";
  readonly left: ChargeDistributionCarrier;
  readonly right: ChargeDistributionCarrier;
  /** Prefix length at which left's concentration strictly exceeds right's. */
  readonly leftExceedsAtPrefix: number;
  /** Prefix length at which right's concentration strictly exceeds left's. */
  readonly rightExceedsAtPrefix: number;
}

export type MixednessJudgment = MixednessComparison | MixednessIncomparability;

const descendingPrefixSums = (distribution: ChargeDistributionCarrier): readonly Rational[] => {
  const sorted = distribution.bins
    .map((bin) => bin.probability)
    .sort((left, right) => ratSign(ratSubtract(right, left)));
  const sums: Rational[] = [];
  let running = zero();
  for (const probability of sorted) {
    running = ratAdd(running, probability);
    sums.push(running);
  }
  return sums;
};

/** The mixedness (majorization) order, exactly. "More mixed" means
 *  majorized-by: every Schur-concave uncertainty functional — Shannon
 *  entropy in any base among them — weakly increases with mixedness, so
 *  this one judgment settles every entropy comparison at once. Genuine
 *  incomparability is information the float entropy figure destroys: two
 *  incomparable distributions are ranked oppositely by different
 *  uncertainty functionals. */
export function mixedness(
  left: ChargeDistributionCarrier,
  right: ChargeDistributionCarrier,
): MixednessJudgment {
  const leftSums = descendingPrefixSums(left);
  const rightSums = descendingPrefixSums(right);
  let leftExceedsAt = 0;
  let rightExceedsAt = 0;
  for (let prefix = 0; prefix < leftSums.length; prefix += 1) {
    const sign = ratSign(ratSubtract(leftSums[prefix]!, rightSums[prefix]!));
    if (sign > 0 && leftExceedsAt === 0) leftExceedsAt = prefix + 1;
    if (sign < 0 && rightExceedsAt === 0) rightExceedsAt = prefix + 1;
  }
  if (leftExceedsAt > 0 && rightExceedsAt > 0) {
    return Object.freeze({
      kind: "meme-analysis.evidence.mixedness-incomparable" as const,
      left,
      right,
      leftExceedsAtPrefix: leftExceedsAt,
      rightExceedsAtPrefix: rightExceedsAt,
    });
  }
  const relation: MixednessRelation =
    leftExceedsAt > 0 ? "rightMoreMixed" : rightExceedsAt > 0 ? "leftMoreMixed" : "equallyMixed";
  return Object.freeze({ kind: "meme-analysis.evidence.mixedness" as const, left, right, relation });
}

export interface JointChargeCell {
  readonly kind: "meme-analysis.evidence.jointCell";
  readonly source: ChargeValue;
  readonly reproduction: ChargeValue;
  readonly count: number;
  readonly probability: Rational;
}

export interface JointChargeDistributionCarrier {
  readonly kind: "meme-analysis.evidence.joint";
  readonly total: number;
  /** All sixteen source × reproduction cells in canonical order. */
  readonly cells: readonly JointChargeCell[];
  readonly sourceMarginal: ChargeDistributionCarrier;
  readonly reproductionMarginal: ChargeDistributionCarrier;
}

/** Exact joint histogram of (source, reproduction) charge pairs — the
 *  observed-channel core. */
export function chargeJoint(
  pairs: readonly (readonly [source: ChargeValue, reproduction: ChargeValue])[],
): JointChargeDistributionCarrier {
  if (pairs.length === 0) throw new TypeError("an empty collection presents no joint distribution");
  const support = chargeValues();
  const cells = support.flatMap((source) => support.map((reproduction) => {
    const count = pairs.filter(([left, right]) =>
      left.name === source.name && right.name === reproduction.name).length;
    return Object.freeze({
      kind: "meme-analysis.evidence.jointCell" as const,
      source,
      reproduction,
      count,
      probability: fromRatio(count, pairs.length),
    });
  }));
  return Object.freeze({
    kind: "meme-analysis.evidence.joint" as const,
    total: pairs.length,
    cells: Object.freeze(cells),
    sourceMarginal: chargeDistribution(pairs.map(([source]) => source)),
    reproductionMarginal: chargeDistribution(pairs.map(([, reproduction]) => reproduction)),
  });
}

export interface IndependenceWitness {
  readonly kind: "meme-analysis.evidence.independence:witness";
  readonly joint: JointChargeDistributionCarrier;
}

export interface IndependenceObstruction {
  readonly kind: "meme-analysis.evidence.independence-obstruction";
  readonly joint: JointChargeDistributionCarrier;
  readonly source: ChargeValue;
  readonly reproduction: ChargeValue;
  readonly jointProbability: Rational;
  readonly productProbability: Rational;
}

export type IndependenceJudgment = IndependenceWitness | IndependenceObstruction;

/** Exact factorization check of a joint against its marginals. Mutual
 *  information vanishes exactly on the witness; how much dependence an
 *  obstruction amounts to in bits is a boundary read. */
export function independence(joint: JointChargeDistributionCarrier): IndependenceJudgment {
  const support = chargeValues();
  for (const cell of joint.cells) {
    const sourceIndex = support.findIndex((value) => value.name === cell.source.name);
    const reproductionIndex = support.findIndex((value) => value.name === cell.reproduction.name);
    const product = ratMultiply(
      joint.sourceMarginal.bins[sourceIndex]!.probability,
      joint.reproductionMarginal.bins[reproductionIndex]!.probability,
    );
    if (!ratEqual(cell.probability, product)) {
      return Object.freeze({
        kind: "meme-analysis.evidence.independence-obstruction" as const,
        joint,
        source: cell.source,
        reproduction: cell.reproduction,
        jointProbability: cell.probability,
        productProbability: product,
      });
    }
  }
  return Object.freeze({ kind: "meme-analysis.evidence.independence:witness" as const, joint });
}

/** Per-side disagreement of two charge coordinates, in {0, 1/2, 1} — the
 *  structural distortion the predecessor rate-distortion surface buried
 *  under a β-weighted float objective. */
export function coordinateDistortion(left: ChargeValue, right: ChargeValue): Rational {
  let disagreements = 0;
  if (present(left, 0) !== present(right, 0)) disagreements += 1;
  if (present(left, 1) !== present(right, 1)) disagreements += 1;
  return fromRatio(disagreements, 2);
}

/** Expected coordinate distortion of a joint, exactly. */
export function expectedDistortion(joint: JointChargeDistributionCarrier): Rational {
  let expected = zero();
  for (const cell of joint.cells) {
    if (cell.count === 0) continue;
    expected = ratAdd(expected, ratMultiply(cell.probability, coordinateDistortion(cell.source, cell.reproduction)));
  }
  return expected;
}

export interface TripleChargeCell {
  readonly kind: "meme-analysis.evidence.tripleCell";
  readonly internal: ChargeValue;
  readonly boundary: ChargeValue;
  readonly external: ChargeValue;
  readonly count: number;
  readonly probability: Rational;
}

export interface TripleChargeDistributionCarrier {
  readonly kind: "meme-analysis.evidence.triple";
  readonly total: number;
  /** All sixty-four internal × boundary × external cells. */
  readonly cells: readonly TripleChargeCell[];
}

/** Exact joint histogram of (internal, boundary, external) charge triples. */
export function chargeTriple(
  triples: readonly (readonly [internal: ChargeValue, boundary: ChargeValue, external: ChargeValue])[],
): TripleChargeDistributionCarrier {
  if (triples.length === 0) throw new TypeError("an empty collection presents no triple distribution");
  const support = chargeValues();
  const cells = support.flatMap((internal) => support.flatMap((boundary) => support.map((external) => {
    const count = triples.filter(([i, b, e]) =>
      i.name === internal.name && b.name === boundary.name && e.name === external.name).length;
    return Object.freeze({
      kind: "meme-analysis.evidence.tripleCell" as const,
      internal,
      boundary,
      external,
      count,
      probability: fromRatio(count, triples.length),
    });
  })));
  return Object.freeze({
    kind: "meme-analysis.evidence.triple" as const,
    total: triples.length,
    cells: Object.freeze(cells),
  });
}

export interface ScreeningOffWitness {
  readonly kind: "meme-analysis.evidence.screeningOff:witness";
  readonly triple: TripleChargeDistributionCarrier;
}

export interface ScreeningOffObstruction {
  readonly kind: "meme-analysis.evidence.screeningOff-obstruction";
  readonly triple: TripleChargeDistributionCarrier;
  readonly internal: ChargeValue;
  readonly boundary: ChargeValue;
  readonly external: ChargeValue;
  /** p(i,b,e) · p(b) and p(i,b) · p(b,e) — unequal exactly here. */
  readonly throughBoundary: Rational;
  readonly aroundBoundary: Rational;
}

export type ScreeningOffJudgment = ScreeningOffWitness | ScreeningOffObstruction;

/** The lawful core of a boundary claim: internal and external are
 *  conditionally independent given the boundary — p(i,b,e)·p(b) =
 *  p(i,b)·p(b,e) at every cell, exactly, with no tolerance knob. An
 *  obstruction exhibits a cell where information passes around the
 *  boundary. */
export function screeningOff(triple: TripleChargeDistributionCarrier): ScreeningOffJudgment {
  const marginal = (predicate: (cell: TripleChargeCell) => boolean): Rational =>
    triple.cells.filter(predicate).reduce((sum, cell) => ratAdd(sum, cell.probability), zero());
  // Zero cells stay in the loop: p(i,b,e) = 0 with p(i,b)·p(b,e) > 0 is a leak.
  for (const cell of triple.cells) {
    const boundaryMass = marginal((candidate) => candidate.boundary.name === cell.boundary.name);
    const internalBoundary = marginal((candidate) =>
      candidate.internal.name === cell.internal.name && candidate.boundary.name === cell.boundary.name);
    const boundaryExternal = marginal((candidate) =>
      candidate.boundary.name === cell.boundary.name && candidate.external.name === cell.external.name);
    const throughBoundary = ratMultiply(cell.probability, boundaryMass);
    const aroundBoundary = ratMultiply(internalBoundary, boundaryExternal);
    if (!ratEqual(throughBoundary, aroundBoundary)) {
      return Object.freeze({
        kind: "meme-analysis.evidence.screeningOff-obstruction" as const,
        triple,
        internal: cell.internal,
        boundary: cell.boundary,
        external: cell.external,
        throughBoundary,
        aroundBoundary,
      });
    }
  }
  return Object.freeze({ kind: "meme-analysis.evidence.screeningOff:witness" as const, triple });
}

// ---------- boundary reads: floats, in the spirit of toNumber ----------

const log2 = (value: number): number => Math.log(value) / Math.log(2);

/** Shannon entropy in bits — a float boundary read; the base-2 choice is a
 *  slice coordinate. The exact content is the mixedness order. */
export function entropyBitsAtBoundary(distribution: ChargeDistributionCarrier): number {
  return distribution.bins.reduce((sum, bin) => {
    if (bin.count === 0) return sum;
    const probability = toNumber(bin.probability);
    return sum - probability * log2(probability);
  }, 0);
}

/** Divergence of `from` relative to `to` in bits — a float boundary read.
 *  Infinite exactly when `absoluteContinuity(from, to)` obstructs. */
export function klBitsAtBoundary(
  from: ChargeDistributionCarrier,
  to: ChargeDistributionCarrier,
): number {
  if (absoluteContinuity(from, to).kind === "meme-analysis.evidence.absoluteContinuity-obstruction") {
    return Number.POSITIVE_INFINITY;
  }
  return from.bins.reduce((sum, bin, index) => {
    if (bin.count === 0) return sum;
    const p = toNumber(bin.probability);
    const q = toNumber(to.bins[index]!.probability);
    return sum + p * log2(p / q);
  }, 0);
}

/** Mutual information in bits — a float boundary read. Zero exactly when
 *  `independence(joint)` witnesses. */
export function mutualInformationBitsAtBoundary(joint: JointChargeDistributionCarrier): number {
  const support = chargeValues();
  return joint.cells.reduce((sum, cell) => {
    if (cell.count === 0) return sum;
    const sourceIndex = support.findIndex((value) => value.name === cell.source.name);
    const reproductionIndex = support.findIndex((value) => value.name === cell.reproduction.name);
    const pxy = toNumber(cell.probability);
    const px = toNumber(joint.sourceMarginal.bins[sourceIndex]!.probability);
    const py = toNumber(joint.reproductionMarginal.bins[reproductionIndex]!.probability);
    return sum + pxy * log2(pxy / (px * py));
  }, 0);
}

