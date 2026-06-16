/**
 * articulating/predicating/positing — value enters predication by evidence.
 *
 * The research-chain morphism is:
 *
 * potential-transfinite-predication-cell
 *   --positing-->
 * potential-scott-continuous-posit-cell
 *
 * This surface carries the predication fiber/valuation objects and the
 * bilattice charge vocabulary used by positing. Direct charge admission remains
 * forbidden; charges are constructed as evidence carriers over cells.
 */
export {
  meme,
  isMeme,
  allCells,
  predicateFiber,
  predicateFiberCellIdentity,
  posit,
  knowledgeOrder,
  truthOrder,
  fiberFromAlgebra,
  predicationFiberLinearFusion,
  predicationFiberLinearResiduum,
  leqTruthPredicateFiber,
  generatorPreservesLinearFusion,
  generatorPreservesLinearResiduum,
  generatorSatisfiesLinearFusionFrobenius,
  converse,
  subjectProjection,
  objectProjection,
  specialization,
  composeFibers,
  chargeAt,
  valuationFromPredicateFiber,
} from "../../../topology/predication-fiber.mjs";
export type {
  Meme,
  FiberAlgebra,
  Valuation,
  FiberCarrier,
  OrderName,
  Order,
  PredicateFiberCell,
  PredicateFiberCellIdentityWitness,
  PredicateFiberCellIdentityObstruction,
  PredicateFiberCellIdentityJudgment,
  PredicateFiber,
  GeneratorKind,
  FiberGenerator,
} from "../../../topology/predication-fiber.mjs";

export {
  chargeSide,
  chargeSideNames,
  chargeValue,
  chargeValues,
  chargeValueNames,
  chargeValueName,
  asChargeValueName,
  asChargeValue,
  charge,
  bottom,
  witnessedPotential,
  valueOf,
  negate,
  conflate,
  joinKnowledge,
  meetKnowledge,
  joinTruth,
  meetTruth,
} from "../../../algebra/bilattice-charge.mjs";
export type {
  ChargeSideName,
  ChargeSide,
  ChargeValueName,
  ChargeCoordinates,
  ChargeValue,
  ChargeCarrier,
  ChargeFiniteAlgebraCarrier,
  ChargePair,
} from "../../../algebra/bilattice-charge.mjs";

export * as settling from "./settling/index.mjs";
