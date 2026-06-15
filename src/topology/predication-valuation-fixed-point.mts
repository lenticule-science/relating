import { chargeSide, type ChargeSide } from "../algebra/index.mjs";
import { type ClosureCarrier } from "./ordinal-closure.mjs";
import type { Valuation } from "./predication-fiber.mjs";
import { fixedPointGap, fixedPointGapInput, type FixedPointGapCarrier } from "./predication-valuation-fixed-point-gap.mjs";
import {
  closePredicationValuationClosure,
  knowledgeValuationClosureOrder,
  predicationValuationClosureStageOrdinal,
  predicationValuationClosureProcess,
  truthValuationClosureOrder,
  type PredicationValuationClosureOrderCarrier,
  type PredicationValuationClosureStageOrdinalCarrier,
} from "./predication-valuation-closure.mjs";
import {
  type PresheafCarrier,
  type SheafCarrier,
} from "./predication-valuation-sheaf.mjs";

export type { OrderName } from "./predication-fiber.mjs";
import type { OrderName } from "./predication-fiber.mjs";
/**
 * The two extremal bounds of a fixed-point computation: "least" for the least
 * fixed point and "greatest" for the greatest.
 */
export type BoundName = "least" | "greatest";

/**
 * The order object a fixed point is taken in: wraps the underlying
 * predication-valuation closure order (knowledge or truth) used to drive
 * closure.
 */
export interface FixedPointOrderObject {
  readonly kind: "predication.valuation.fixedPoint.orderObject";
  readonly valuationClosureOrder: PredicationValuationClosureOrderCarrier;
}

/**
 * The bound object selecting which extremal fixed point to compute, carrying
 * its name ("least" or "greatest").
 */
export interface FixedPointBoundObject {
  readonly kind: "predication.valuation.fixedPoint.boundObject";
  readonly name: BoundName;
}

/**
 * The seed for a fixed-point closure: the valuation the closure process starts
 * from, tagged with the order and bound it is being closed under.
 */
export interface FixedPointSeedCarrier {
  readonly kind: "predication.valuation.fixedPoint.seed";
  readonly order: FixedPointOrderObject;
  readonly bound: FixedPointBoundObject;
  readonly valuation: Valuation;
}

/**
 * A computed extremal fixed point: the seed, the resulting ordinal closure, the
 * fixed-point judgment (witness or obstruction), and the sheaf of the closure's
 * value, for a given order and bound.
 */
export interface FixedPointExtremum {
  readonly kind: "predication.valuation.fixedPoint.extremum";
  readonly order: FixedPointOrderObject;
  readonly bound: FixedPointBoundObject;
  readonly seed: FixedPointSeedCarrier;
  readonly closure: ClosureCarrier<Valuation>;
  readonly fixedPoint: FixedPointJudgment;
  readonly sheaf: SheafCarrier;
}

/**
 * Witness that closure stabilized to a fixed point: records the stabilization
 * stage ordinal and the stabilized valuation value, with its order and bound.
 */
export interface FixedPointWitness {
  readonly kind: "predication.valuation.fixedPoint:witness";
  readonly order: FixedPointOrderObject;
  readonly bound: FixedPointBoundObject;
  readonly stabilizationStage: PredicationValuationClosureStageOrdinalCarrier;
  readonly value: Valuation;
}

/**
 * Obstruction recording that closure did not stabilize to a fixed point:
 * retains the last valuation value reached, with its order and bound.
 */
export interface FixedPointObstruction {
  readonly kind: "predication.valuation.fixedPoint-obstruction";
  readonly order: FixedPointOrderObject;
  readonly bound: FixedPointBoundObject;
  readonly value: Valuation;
}

/**
 * The outcome of closing toward a fixed point: either a stabilization witness
 * or a non-stabilization obstruction.
 */
export type FixedPointJudgment = FixedPointWitness | FixedPointObstruction;

/**
 * The pair of extremal fixed points for one order: the least and greatest
 * fixed-point extrema taken in the same order object.
 */
export interface FixedPointOrderCarrier {
  readonly kind: "predication.valuation.fixedPoint.order";
  readonly order: FixedPointOrderObject;
  readonly least: FixedPointExtremum;
  readonly greatest: FixedPointExtremum;
}

/**
 * The full fixed-point structure of a presheaf: the least/greatest extrema in
 * both the knowledge and truth orders, together with the gap carriers measuring
 * the spread between least and greatest in each order.
 */
export interface FixedPointCarrier {
  readonly kind: "predication.valuation.fixedPoint.carrier";
  readonly knowledge: FixedPointOrderCarrier;
  readonly truth: FixedPointOrderCarrier;
  readonly knowledgeGap: FixedPointGapCarrier;
  readonly truthGap: FixedPointGapCarrier;
}

const greatestSeedValuation = (freeFalsity: ChargeSide) => (valuation: Valuation): Valuation => Object.freeze({
  ...valuation,
  fibers: Object.freeze(valuation.fibers.map((fiber) => Object.freeze({
    ...fiber,
    assignments: Object.freeze(fiber.assignments.map((assignment) => Object.freeze({
      ...assignment,
      charge: Object.freeze({
        kind: "bilattice-charge.carrier" as const,
        value: Object.freeze([
          assignment.charge.evidence[0].length ? assignment.charge.value[0] : chargeSide("present"),
          assignment.charge.evidence[1].length ? assignment.charge.value[1] : freeFalsity,
        ] as const),
        evidence: assignment.charge.evidence,
      }),
    }))),
  }))),
});

const fixedPointSeed = (
  order: FixedPointOrderObject,
  bound: FixedPointBoundObject,
  valuation: Valuation,
): FixedPointSeedCarrier => Object.freeze({
  kind: "predication.valuation.fixedPoint.seed" as const,
  order,
  bound,
  valuation,
});

const sheafOfClosure = (closure: ClosureCarrier<Valuation>): SheafCarrier => Object.freeze({
  kind: "predication.valuation.sheaf.carrier" as const,
  section: closure.value,
});

/**
 * Builds a fixed-point order object wrapping the given predication-valuation
 * closure order.
 */
export const fixedPointOrderObject = (
  valuationClosureOrder: PredicationValuationClosureOrderCarrier,
): FixedPointOrderObject => Object.freeze({
  kind: "predication.valuation.fixedPoint.orderObject" as const,
  valuationClosureOrder,
});

/**
 * The order name (knowledge or truth) of a fixed-point order object, read from
 * its wrapped closure order.
 */
export const fixedPointOrderName = (order: FixedPointOrderObject): OrderName => order.valuationClosureOrder.name;

/** Builds a fixed-point bound object carrying the given bound name. */
export const fixedPointBoundObject = (name: BoundName): FixedPointBoundObject => Object.freeze({
  kind: "predication.valuation.fixedPoint.boundObject" as const,
  name,
});

/** The bound name ("least" or "greatest") of a fixed-point bound object. */
export const fixedPointBoundName = (bound: FixedPointBoundObject): BoundName => bound.name;

/** The bound object selecting the least fixed point. */
export const leastFixedPointBound = (): FixedPointBoundObject => fixedPointBoundObject("least");
/** The bound object selecting the greatest fixed point. */
export const greatestFixedPointBound = (): FixedPointBoundObject => fixedPointBoundObject("greatest");

function fixedPointExtremum(
  order: FixedPointOrderObject,
  bound: FixedPointBoundObject,
  seed: FixedPointSeedCarrier,
): FixedPointExtremum {
  const closure = closePredicationValuationClosure(predicationValuationClosureProcess(order.valuationClosureOrder, seed.valuation)).closure;
  const fixedPoint = closure.stabilization.kind === "ordinal.closure.stabilization:witness"
    ? Object.freeze({
      kind: "predication.valuation.fixedPoint:witness" as const,
      order,
      bound,
      stabilizationStage: predicationValuationClosureStageOrdinal(closure.stabilization.ordinal),
      value: closure.stabilization.value,
    })
    : Object.freeze({
      kind: "predication.valuation.fixedPoint-obstruction" as const,
      order,
      bound,
      value: closure.stabilization.value,
    });
  return Object.freeze({
    kind: "predication.valuation.fixedPoint.extremum" as const,
    order,
    bound,
    seed,
    closure,
    fixedPoint,
    sheaf: sheafOfClosure(closure),
  });
}

/**
 * Computes the least fixed point in the knowledge order, seeded from the
 * presheaf's first trace valuation.
 */
export function knowledgeLeastFixedPoint(p: PresheafCarrier): FixedPointExtremum {
  const order = fixedPointOrderObject(knowledgeValuationClosureOrder());
  const bound = leastFixedPointBound();
  return fixedPointExtremum(order, bound, fixedPointSeed(order, bound, p.traces[0]!));
}

/**
 * Computes the greatest fixed point in the knowledge order, seeded from the
 * presheaf's first trace with unevidenced charge sides forced present.
 */
export function knowledgeGreatestFixedPoint(p: PresheafCarrier): FixedPointExtremum {
  const order = fixedPointOrderObject(knowledgeValuationClosureOrder());
  const bound = greatestFixedPointBound();
  return fixedPointExtremum(order, bound, fixedPointSeed(order, bound, greatestSeedValuation(chargeSide("present"))(p.traces[0]!)));
}

/**
 * Computes the least fixed point in the truth order, seeded from the presheaf's
 * first trace valuation.
 */
export function truthLeastFixedPoint(p: PresheafCarrier): FixedPointExtremum {
  const order = fixedPointOrderObject(truthValuationClosureOrder());
  const bound = leastFixedPointBound();
  return fixedPointExtremum(order, bound, fixedPointSeed(order, bound, p.traces[0]!));
}

/**
 * Computes the greatest fixed point in the truth order, seeded from the
 * presheaf's first trace with unevidenced falsity sides forced absent.
 */
export function truthGreatestFixedPoint(p: PresheafCarrier): FixedPointExtremum {
  const order = fixedPointOrderObject(truthValuationClosureOrder());
  const bound = greatestFixedPointBound();
  return fixedPointExtremum(order, bound, fixedPointSeed(order, bound, greatestSeedValuation(chargeSide("absent"))(p.traces[0]!)));
}

function fixedPointOrder(order: FixedPointOrderObject, least: FixedPointExtremum, greatest: FixedPointExtremum): FixedPointOrderCarrier {
  return Object.freeze({
    kind: "predication.valuation.fixedPoint.order" as const,
    order,
    least,
    greatest,
  });
}

/**
 * Computes the complete fixed-point structure of a presheaf: least and greatest
 * extrema in both the knowledge and truth orders plus the gap carriers for each
 * order.
 */
export function fixedPoints(p: PresheafCarrier): FixedPointCarrier {
  const knowledgeOrder = fixedPointOrderObject(knowledgeValuationClosureOrder());
  const truthOrder = fixedPointOrderObject(truthValuationClosureOrder());
  const leastBound = leastFixedPointBound();
  const greatestBound = greatestFixedPointBound();
  const knowledgeLeast = fixedPointExtremum(knowledgeOrder, leastBound, fixedPointSeed(knowledgeOrder, leastBound, p.traces[0]!));
  const knowledgeGreatest = fixedPointExtremum(
    knowledgeOrder,
    greatestBound,
    fixedPointSeed(knowledgeOrder, greatestBound, greatestSeedValuation(chargeSide("present"))(p.traces[0]!)),
  );
  const truthLeast = fixedPointExtremum(truthOrder, leastBound, fixedPointSeed(truthOrder, leastBound, p.traces[0]!));
  const truthGreatest = fixedPointExtremum(
    truthOrder,
    greatestBound,
    fixedPointSeed(truthOrder, greatestBound, greatestSeedValuation(chargeSide("absent"))(p.traces[0]!)),
  );
  const knowledge = fixedPointOrder(knowledgeOrder, knowledgeLeast, knowledgeGreatest);
  const truth = fixedPointOrder(truthOrder, truthLeast, truthGreatest);
  return Object.freeze({
    kind: "predication.valuation.fixedPoint.carrier" as const,
    knowledge,
    truth,
    knowledgeGap: fixedPointGap(fixedPointGapInput(knowledge)),
    truthGap: fixedPointGap(fixedPointGapInput(truth)),
  });
}

/**
 * The knowledge-order gap carrier of a presheaf's fixed points, measuring the
 * spread between the knowledge least and greatest fixed points.
 */
export function fixedPointKnowledgeGap(p: PresheafCarrier): FixedPointGapCarrier {
  return fixedPoints(p).knowledgeGap;
}

/**
 * The truth-order gap carrier of a presheaf's fixed points, measuring the
 * spread between the truth least and greatest fixed points.
 */
export function fixedPointTruthGap(p: PresheafCarrier): FixedPointGapCarrier {
  return fixedPoints(p).truthGap;
}
