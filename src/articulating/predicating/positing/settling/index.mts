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
  normalizeUtterance,
  induce,
  extend,
  sameMemeTopology,
  singleUtteranceTopology,
  settleOneTraced,
  knowledgeLeastMemeOfSingleUtterance,
} from "../../../../topology/meme-topology.mjs";
export type {
  PredicateInput,
  SubjectInput,
  MemeTopologyCarrier,
  SingleUtteranceInput,
  SingleSettlingCarrier,
} from "../../../../topology/meme-topology.mjs";

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

export { fixedPoints } from "../../../../topology/predication-valuation-fixed-point.mjs";
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

export { readCharge } from "../../../../topology/meme-topology-fixed-point-reading.mjs";
export type {
  MemeTopologyFixedPointReading,
  MemeTopologyFixedPointReadings,
  MemeTopologyInformation,
  MemeTopologyInformationEntry,
  MemeTopologyInformationEntriesCarrier,
} from "../../../../topology/meme-topology-fixed-point-reading.mjs";

export {
  sectionOf,
  predicationsFor,
  subjectsFor,
  chargeAtValues,
  partitionSection,
  topologyVitals,
} from "../../../../topology/meme-topology-section.mjs";
export type {
  SectionCarrier,
  SectionEntry,
  SectionPartitionCarrier,
  TopologyVitalsCarrier,
} from "../../../../topology/meme-topology-section.mjs";

export {
  cohomologyOfValuation,
  cohomology,
  cohomologyOfCells,
  rankVanishing,
} from "../../../../topology/predication-cohomology.mjs";
export type {
  CohomologyCarrier,
  ZeroCoboundaryMatrixCarrier,
  ZeroCohomologyCarrier,
  FirstCohomologyCarrier,
  RankVanishingWitness,
  RankVanishingObstruction,
  RankVanishingJudgment,
} from "../../../../topology/predication-cohomology.mjs";

export * as geometry from "./geometry/index.mjs";
export * as analysis from "./analysis/index.mjs";
