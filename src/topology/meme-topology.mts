import { articulate, utterance, Mark, type PredicationPredicate, type PredicationTerm, type UtteranceCarrier } from "../algebra/index.mjs";
import { materializePredicationCategory, predicate, predicationCarrier } from "../algebra/index.mjs";
import { posit, type Meme } from "./predication-fiber.mjs";
import { settlingFirstCohomology, type SettlingCarrier, type SettlingFirstCohomology } from "./predication-settling.mjs";
import { presheaf } from "./predication-valuation-sheaf.mjs";
import {
  knowledgeClosureSettling,
  knowledgeClosureTrace,
  sameValuation,
  type PredicationValuationClosureTraceCarrier,
} from "./predication-valuation-closure.mjs";
import { fixedPoints, type FixedPointCarrier } from "./predication-valuation-fixed-point.mjs";
import { theoryOfBase, typedTheoryProofCarrier, type TypedTheoryCarrier, type TypedTheoryProofCarrier } from "../logic/index.mjs";
import { fixedPointReadings, type MemeTopologyFixedPointReadings } from "./meme-topology-fixed-point-reading.mjs";

/**
 * The induced state of a meme topology over an utterance log: holds the witness
 * utterances it was derived from, the four fixed points and their readings, the
 * knowledge-closure settling and its first cohomology, and the typed theory of
 * the base together with its proofs.
 */
export interface MemeTopologyCarrier {
  readonly kind: "meme-topology.carrier";
  /** The givens: the utterance log this carrier was induced from. Utterances
   *  are the only admission — every charge, edge, and section is derived. */
  readonly witnesses: readonly UtteranceCarrier[];
  readonly fixedPoints: FixedPointCarrier;
  readonly fixedPointReadings: MemeTopologyFixedPointReadings;
  readonly settling: SettlingCarrier;
  readonly settlingFirstCohomology: SettlingFirstCohomology;
  readonly theory: TypedTheoryCarrier;
  readonly proofs: TypedTheoryProofCarrier;
}

/**
 * A single utterance admitted as evidence: either an already-built utterance
 * carrier or a [left mark, right mark] pair to be promoted into one.
 */
export type SingleUtteranceInput = UtteranceCarrier | readonly [left: Mark, right: Mark];

/**
 * The settling of a single utterance with its derivation kept: the meme it
 * settles to together with the knowledge-closure trace that produced it.
 */
export interface SingleSettlingCarrier {
  readonly kind: "meme-topology.singleSettling.carrier";
  readonly meme: Meme;
  readonly trace: PredicationValuationClosureTraceCarrier;
}

/** Section reads take predicated carriers, never raw marks. */
export type SubjectInput = PredicationTerm;
export type PredicateInput = PredicationPredicate;

/**
 * Coerces a single utterance input into an utterance carrier: passes a carrier
 * through unchanged, otherwise builds one from a [left mark, right mark] pair,
 * throwing a TypeError on anything else.
 */
export function normalizeUtterance(input: SingleUtteranceInput): UtteranceCarrier {
  if (typeof input === "object" && input !== null && "kind" in input && input.kind === "utterance.carrier") {
    return input;
  }
  if (!Array.isArray(input) || !(input[0] instanceof Mark) || !(input[1] instanceof Mark)) {
    throw new TypeError("normalizeUtterance: expected an utterance carrier or a [left mark, right mark] pair");
  }
  return utterance(input[0], input[1]);
}

/** The descent, folded: articulate every utterance, predicate each potential
 *  cell, collect the generated predication carriers into the union of
 *  the relational sites, posit the measured valuation, and settle it into one
 *  frozen carrier. Evidence enters here and only here — there is no verb that
 *  admits a charge, a polarity, or an edge directly. */
export function induce(utterances: readonly SingleUtteranceInput[]): MemeTopologyCarrier {
  const log = utterances.map(normalizeUtterance);
  const generated = log.map((carrier) => materializePredicationCategory(predicate(articulate(carrier))));
  const predicated = predicationCarrier(generated.flatMap((carrier) => [
    ...carrier.cells.cells,
    ...carrier.specializations,
  ]));
  const p = presheaf(posit(predicated));
  const fixed = fixedPoints(p);
  const settling = knowledgeClosureSettling(p);
  const theory = theoryOfBase(predicated.base);
  return Object.freeze({
    kind: "meme-topology.carrier" as const,
    witnesses: Object.freeze(log),
    fixedPoints: fixed,
    fixedPointReadings: fixedPointReadings(fixed),
    settling,
    settlingFirstCohomology: settlingFirstCohomology(settling),
    theory,
    proofs: typedTheoryProofCarrier(theory),
  });
}

/** Evidence is monotone: `extend(induce(a), b)` agrees with `induce([...a, ...b])`. */
export function extend(carrier: MemeTopologyCarrier, delta: readonly SingleUtteranceInput[]): MemeTopologyCarrier {
  if (typeof carrier !== "object" || carrier === null || carrier.kind !== "meme-topology.carrier") {
    throw new TypeError("extend: expected a meme-topology carrier");
  }
  return induce([...carrier.witnesses, ...delta]);
}

const sameUtterance = (left: UtteranceCarrier, right: UtteranceCarrier): boolean => left === right;

/** Mathematical parity of two carriers: same admitted utterance carriers and
 * same four fixed points. The witness log is compared at the utterance-carrier
 * layer; marks inside those carriers remain opaque and unexamined. */
export function sameMemeTopology(left: MemeTopologyCarrier, right: MemeTopologyCarrier): boolean {
  if (left.kind !== "meme-topology.carrier" || right.kind !== "meme-topology.carrier") return false;
  if (left.witnesses.length !== right.witnesses.length) return false;
  if (!left.witnesses.every((witness, index) => sameUtterance(witness, right.witnesses[index]!))) return false;
  return (["knowledge", "truth"] as const).every((order) => (["least", "greatest"] as const).every((bound) => {
    const leftExtremum = left.fixedPoints[order][bound];
    const rightExtremum = right.fixedPoints[order][bound];
    return leftExtremum.fixedPoint.kind === rightExtremum.fixedPoint.kind
      && sameValuation(leftExtremum.fixedPoint.value, rightExtremum.fixedPoint.value);
  }));
}

/**
 * Induces the meme topology of a single utterance given as its left and right
 * marks.
 */
export function singleUtteranceTopology(left: Mark, right: Mark): MemeTopologyCarrier {
  return induce([[left, right]]);
}

/**
 * The knowledge-least meme of a single utterance: induces that utterance's
 * topology and returns the first assignment of the first fiber of its
 * knowledge-least fixed-point reading.
 */
export function knowledgeLeastMemeOfSingleUtterance(input: SingleUtteranceInput): Meme {
  const carrier = normalizeUtterance(input);
  const topology = singleUtteranceTopology(carrier.token.mark, carrier.claim.mark);
  return topology.fixedPointReadings.knowledgeLeast.extremum.sheaf.section.fibers[0]!.assignments[0]!;
}

/**
 * Settles a single utterance and keeps its trace: articulates and predicates
 * the utterance, runs the knowledge-closure trace over its presheaf, and
 * returns a carrier holding the settled meme and that trace.
 */
export function settleOneTraced(input: SingleUtteranceInput): SingleSettlingCarrier {
  const carrier = normalizeUtterance(input);
  const predicated = materializePredicationCategory(predicate(articulate(carrier)));
  const trace = knowledgeClosureTrace(presheaf(posit(predicated)));
  return Object.freeze({
    kind: "meme-topology.singleSettling.carrier" as const,
    meme: trace.sheaf.section.fibers[0]!.assignments[0]!,
    trace,
  });
}
