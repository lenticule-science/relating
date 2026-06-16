/**
 * articulating/predicating/positing/settling — finite settlement outcomes.
 *
 * The research-chain morphism is:
 *
 * potential-scott-continuous-posit-cell
 *   --settling-->
 * finite-settlement-cell
 *
 * This surface currently exposes the settling and fixed-point carriers from
 * the existing topology implementation while the source tree migrates toward
 * the nested categorical layout.
 */
export {
  settlingStageOrdinal,
  settlingInitialStageOrdinal,
  settlingSuccessorStageOrdinal,
  settlingLimitStageOrdinal,
  settlingInitialStageInput,
  settlingSuccessorStageInput,
  settlingLimitStageInput,
  designatedCells,
  settling,
  settlingDepth,
  settlingDepthFiniteJudgment,
  settlingIncrements,
  settlingLimitStages,
  nonScottSettlingFirings,
  settlingFirstCohomology,
  settlingClosureInvariant,
  settlingClosureEquivalence,
  gradedGap,
  gradedGapSettlingFirstCohomologyRank,
  classifySettling,
  settlingFiniteStageJudgment,
  countableSettlingCofinality,
  uncountableSettlingCofinality,
} from "../../../../topology/predication-settling.mjs";
export type {
  SettlingStageOrdinalCarrier,
  SettlingStageDesignatedCellsCarrier,
  SettlingFiniteStageWitness,
  SettlingFiniteStageObstruction,
  SettlingFiniteStageJudgment,
  SettlingInitialStage,
  SettlingSuccessorStage,
  SettlingLimitStage,
  SettlingStageShape,
  SettlingStageInputCarrier,
  SettlingStage,
  SettlingLimitStageCarrier,
  CountableSettlingCofinalityCarrier,
  UncountableSettlingCofinalityCarrier,
  SettlingCofinalityCarrier,
  SettlingCarrier,
  SettlingIncrement,
  SettlingLimitStagesCarrier,
  NonScottSettlingFiringsCarrier,
  SettlingFirstCohomologyGenerator,
  SettlingFirstCohomology,
  SettlingClosureInvariantStep,
  SettlingClosureInvariant,
  SettlingClosureEquivalenceWitness,
  SettlingClosureEquivalenceObstruction,
  SettlingClosureEquivalenceJudgment,
  GradedGapLoss,
  GradedGapCarrier,
  SettlingClassification,
} from "../../../../topology/predication-settling.mjs";

export {
  fixedPointOrderName,
  fixedPointBoundName,
  fixedPointOrderObject,
  fixedPointBoundObject,
  leastFixedPointBound,
  greatestFixedPointBound,
  knowledgeLeastFixedPoint,
  knowledgeGreatestFixedPoint,
  truthLeastFixedPoint,
  truthGreatestFixedPoint,
  fixedPoints,
  fixedPointKnowledgeGap,
  fixedPointTruthGap,
} from "../../../../topology/predication-valuation-fixed-point.mjs";
export type {
  BoundName,
  FixedPointOrderCarrier,
  FixedPointOrderObject,
  FixedPointBoundObject,
  FixedPointSeedCarrier,
  FixedPointWitness,
  FixedPointObstruction,
  FixedPointJudgment,
  FixedPointExtremum,
  FixedPointCarrier,
} from "../../../../topology/predication-valuation-fixed-point.mjs";

export * as geometry from "./geometry/index.mjs";
