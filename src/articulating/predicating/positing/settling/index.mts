/**
 * articulating/predicating/positing/settling — finite settlement outcomes.
 *
 * The research-chain morphism is:
 *
 * potential-scott-continuous-posit-cell
 *   --settling-->
 * finite-settlement-cell
 *
 * This surface owns the settlement filtrations, ordinal closure processes,
 * fixed-point readings, sheaves, cohomology, and valuation dynamics induced
 * by predication.
 */
export {
  normalizeUtterance,
  induce,
  extend,
  sameMemeTopology,
  singleUtteranceTopology,
  settleOneTraced,
  knowledgeLeastMemeOfSingleUtterance,
} from "./topology.mjs";
export type {
  PredicateInput,
  SubjectInput,
  MemeTopologyCarrier,
  SingleUtteranceInput,
  SingleSettlingCarrier,
} from "./topology.mjs";

export {
  zeroOrdinal,
  successorOrdinal,
  limitOrdinal,
  ordinalLabel,
  finiteOrdinal,
  ordinalPlusFinite,
  omegaOrdinal,
  omegaMultipleOrdinal,
  omegaSquaredOrdinal,
  isZeroOrdinal,
  isSuccessorOrdinal,
  isLimitOrdinal,
  finiteOrdinalJudgment,
  finiteClosureRegime,
  scottClosureRegime,
  transfiniteClosureRegime,
  aperiodicClosureRegime,
  closureRegimeOfOrdinal,
  closureProcess,
  closeOrdinalProcess,
  closureOrbitOfProcess,
  closureSearchBlocks,
  closureStabilizationAt,
  closureStabilizationSearchHorizon,
  stabilizingSup,
} from "./closure.mjs";
export type {
  Ordinal,
  ZeroOrdinal,
  SuccessorOrdinal,
  LimitOrdinal,
  OrdinalLabel,
  FiniteOrdinalWitness,
  FiniteOrdinalObstruction,
  FiniteOrdinalJudgment,
  ClosureRegime,
  StabilizingClosureRegime,
  FiniteClosureRegime,
  ScottClosureRegime,
  TransfiniteClosureRegime,
  AperiodicClosureRegime,
  Lattice,
  ClosureCarrier,
  ClosureProcessCarrier,
  ClosureOrbitPoint,
  ClosureStabilizationWitness,
  ClosureStabilizationObstruction,
  ClosureStabilizationJudgment,
  ClosureStabilizationSearchWitness,
  ClosureStabilizationSearchObstruction,
  ClosureStabilizationSearchJudgment,
  ClosureStabilizationSearchHorizon,
  ClosureSearchBlock,
} from "./closure.mjs";

export {
  settlingStageOrdinal,
  settlingInitialStageOrdinal,
  settlingSuccessorStageOrdinal,
  settlingLimitStageOrdinal,
  settlingFiniteStageJudgment,
  countableSettlingCofinality,
  uncountableSettlingCofinality,
} from "./ordinal.mjs";
export {
  settlingInitialStageInput,
  settlingSuccessorStageInput,
  settlingLimitStageInput,
  settlingStageInput,
  settlingStageShape,
  settlingStageDesignatedCells,
} from "./stage.mjs";
export { designatedCells } from "./designation.mjs";
export { settling } from "./filtration.mjs";
export {
  settlingIncrements,
  settlingFirings,
} from "./increment.mjs";
export {
  settlingLimitStages,
  nonScottSettlingFirings,
} from "./limit.mjs";
export { settlingFirstCohomology } from "./first-cohomology.mjs";
export {
  settlingClosureInvariant,
  settlingClosureEquivalence,
} from "./invariant.mjs";
export {
  gradedGap,
  gradedGapSettlingFirstCohomologyRank,
} from "./gap.mjs";
export {
  classifySettling,
  settlingDepth,
  settlingDepthFiniteJudgment,
} from "./classification.mjs";
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
  SettlementFiltration,
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
} from "./object.mjs";

export {
  classifyFiringOrbit,
  firingFirstCohomology,
  firingGenerator,
  firingGrade,
  firingGradeCohomology,
  firingGradeShadow,
  firingIndependence,
  firingSelfDuality,
  negateFiringGenerator,
  valuedFiringsFromSettling,
} from "./firing.mjs";

export {
  knowledgeValuationClosure,
  knowledgeClosureTrace,
  knowledgeClosureSheaf,
  knowledgeClosureCells,
  settle,
  utteranceKnowledgeClosureCohomology,
  predicationValuationClosureFiniteStageJudgment,
  possibilizeKnowledge,
  transportValuationAlongPredicationGenerators,
  lastValuation,
  settlingStageOrdinalOfPredicationValuationClosureStage,
} from "./valuation-closure.mjs";

export {
  commutate,
  presheaf,
  presheafFromValuation,
  sheafFromValuation,
} from "./sheaf.mjs";
export type {
  PositPresheaf,
  PresheafTrace,
  SheafCarrier,
  CommutationCarrier,
} from "./sheaf.mjs";

export { valuationConsistency } from "./valuation-consistency.mjs";
export { fixedPointGap, fixedPointGapInput } from "./fixed-point-gap.mjs";

export { fixedPoints } from "./fixed-point.mjs";
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
} from "./fixed-point.mjs";

export { readCharge } from "./fixed-point-reading.mjs";
export type {
  MemeTopologyFixedPointReading,
  MemeTopologyFixedPointReadings,
  MemeTopologyInformation,
  MemeTopologyInformationEntry,
  MemeTopologyInformationEntriesCarrier,
} from "./fixed-point-reading.mjs";

export {
  sectionOf,
  predicationsFor,
  subjectsFor,
  chargeAtValues,
  partitionSection,
  topologyVitals,
} from "./section.mjs";
export type {
  SectionCarrier,
  SectionEntry,
  SectionPartitionCarrier,
  TopologyVitalsCarrier,
} from "./section.mjs";

export {
  cohomologyOfValuation,
  cohomology,
  cohomologyOfCells,
  cohomologyLaplacianOfCells,
  rankVanishing,
} from "./cohomology.mjs";
export type {
  CohomologyCarrier,
  ZeroCoboundaryMatrixCarrier,
  ZeroCohomologyCarrier,
  FirstCohomologyCarrier,
  RankVanishingWitness,
  RankVanishingObstruction,
  RankVanishingJudgment,
} from "./cohomology.mjs";

export * as geometry from "./geometry/index.mjs";
export * from "./analysis/index.mjs";
export * as analysis from "./analysis/index.mjs";
