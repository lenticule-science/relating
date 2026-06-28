/**
 * @packageDocumentation
 *
 * @emsenn/relating — the relational substrate as one boundary system.
 *
 * The root surface is the ordinary public API for the relating category: it rolls
 * up the carrier constructors, readers, judgments, and morphisms of the
 * categorical chain — `articulating → predicating → positing → settling` — as a
 * flat namespace, the common Node idiom. Strings and JSON appear only at codec and
 * action boundaries; the mathematical API works over admitted carriers (`Mark`,
 * `UtteranceCarrier`, `ArticulationCell`, `PredicationSite`, `PositPresheaf`,
 * `SettlementFiltration`). Register an operation once as an `action`; `induceBins`
 * projects the whole module to every transport. The source declarations and package
 * `exports` map are the normative API; handwritten docs explain them but do not
 * override them. Representation writing, projector, the realize functor, and the
 * boundary serve/dispatch internals are reached through their package subpaths
 * (`/writing`, `/writing/projector`, `/typing`, `/running`).
 *
 * Product map:
 *
 * - Carrier kernel: `carrierFrom`, `registeredCategory`, and the
 *   schema registry keep static type source, JSON Schema identity, validation,
 *   and composition address in one authored value.
 * - RMN runtime: `ty`, `tm`, `evaluateRunTerm`, `hasTy`, and the term catalogs
 *   make pure morphism bodies inspectable data instead of opaque callbacks.
 * - Action apex: `action`, `actions`, `induceBins`, and `dispatch` project one
 *   carrier-morphism registry into CLI, HTTP, OpenAPI, MCP, browser forms, and
 *   witnessed invocation rows.
 * - Witness substrate: `witnessInvocation` plus the `./running/ledger` subpath
 *   keep append-only EAVT traces and project them to state, records, content
 *   documents, and resumable feeds.
 * - FOUR-valued settling: charge values, evidence joins, predication fibers,
 *   settlement filtrations, fixed points, learning/closure reads, and exact
 *   analysis surfaces share the same contradiction-preserving value story.
 * - Finite math workbenches: Chu terms, formal-concept terms, relation matrices,
 *   typed-theory consequence, substitution dynamics, stochastic/value-category
 *   settling, and radial/projector surfaces are implemented Node products over
 *   the same carriers, not separate mini-frameworks.
 * - Lean conformance bridge: committed Lean-emitted golden vectors cover the
 *   finite algebra and calculus surfaces the Node package can replay. Broader
 *   RelMath/content material guides the package shape, but only implemented
 *   carriers, actions, examples, and tests are documented here as live API.
 */

import {
  articulateTerm,
  predicateTerm,
  positTerm,
  settleTerm,
  induceRelationTerm,
  relateRelationsTerm,
  coincideTerm,
} from "./evaluating/descending/index.mjs";
import { countTerm, natZeroTerm, successorTerm } from "./evaluating/counting/index.mjs";
import { freeTerm } from "./evaluating/settling/index.mjs";
import { classifyRegimeTerm, cohomologyVanishesInRegimeTerm } from "./evaluating/measuring/index.mjs";
import {
  scalarCancellationTerm as internalRealScalarCancellationTerm,
  logStepBoundTerm as internalRealLogStepBoundTerm,
  logMonotoneTerm as internalRealLogMonotoneTerm,
  logarithmTerm as internalRealLogarithmTerm,
  sqrtSeqApproximationTerm as internalRealSqrtSeqApproximationTerm,
  constructiveIvtTerm as internalRealConstructiveIvtTerm,
  realMultiplicationTerm as internalRealRealMultiplicationTerm,
  goldenConvergentLogGapTerm as internalRealGoldenConvergentLogGapTerm,
  metallicConvergentGapTerm as internalRealMetallicConvergentGapTerm,
  metallicRootTerm as internalRealMetallicRootTerm,
  metallicRealTerm as internalRealMetallicRealTerm,
  metallicPowerLensTerm as internalRealMetallicPowerLensTerm,
  logLipschitzTerm as internalRealLogLipschitzTerm,
  expSeriesTerm as internalRealExpSeriesTerm,
  metallizationDichotomyTerm as internalRealMetallizationDichotomyTerm,
  salemPisotTerm as internalRealSalemPisotTerm,
  edgeColouringEntropyTerm as internalRealEdgeColouringEntropyTerm,
  triangleColouringEntropyTerm as internalRealTriangleColouringEntropyTerm,
  settleCausalSetTerm as causalSettleTerm,
  geometryIndependentOfTopologyTerm as causalGeometryIndependentOfTopologyTerm,
  causalConeFieldTerm,
  causalIntervalTerm,
  causalAlexandrovTerm,
  causalAlexandrovTopologyTerm,
  causalLaplacianTerm,
  causalLightObservationTerm,
  diamondSpectralPortraitTerm,
  causalNetTerm,
  paraconsistentConeReportTerm,
  microlocalSupportTerm,
  myrheimMeyerRealShadowTerm,
  benincasaDowkerTerm,
  einsteinHilbertTerm,
  sprinklingAverageTerm,
  causalDalembertianTerm,
  endogenousCoefficientsTerm,
  causalMobiusTerm,
  lambekCurvatureTerm,
  lambekRicciTerm,
  causalCohomologyTerm,
  causalCohomologyH2Term,
  causalCohomologyNTerm,
  causalCurvatureActionWiringTerm,
  causalDistanceTerm,
  bdgMobiusActionTerm,
  causalInvolutivityReceiptTerm,
  causalManifoldlikenessReceiptTerm,
  causalMicrosupportReceiptTerm,
  causalMldClassificationReceiptTerm,
  hauptvermutungReceiptTerm,
  glassOverlapReceiptTerm,
  glassBasinGraphTerm,
  glassDynamicHeterogeneityTerm,
  glassKcmTerm,
  inconsistencySheafReceiptTerm,
  causalPolarizationReceiptTerm,
  causalLiouvilleReceiptTerm,
  measureIsValuationTerm as probabilityMeasureIsValuationTerm,
  conditionalViaFiberAdjointTerm as probabilityConditionalViaFiberAdjointTerm,
  markovStationaryIsClosureFixpointTerm as probabilityMarkovStationaryIsClosureFixpointTerm,
  stochasticIsValueSettlingTerm as probabilityStochasticIsValueSettlingTerm,
  realUnitIntervalValueCategoryTerm as probabilityRealUnitIntervalValueCategoryTerm,
  expectationLawsTerm as probabilityExpectationLawsTerm,
  detailedBalanceImpliesStationaryTerm as probabilityDetailedBalanceImpliesStationaryTerm,
  poissonSettlingTerm as probabilityPoissonSettlingTerm,
  properColoringTerm as graphColoringProperColoringTerm,
  coloringFactorMapTerm as graphColoringFactorMapTerm,
  completeGraphChromaticTerm as graphColoringCompleteGraphChromaticTerm,
  handshakeDegreeParityTerm as graphColoringHandshakeDegreeParityTerm,
  oddClosedWalkBipartiteObstructionTerm as graphColoringOddClosedWalkBipartiteObstructionTerm,
  combinatoricsExtremalTerm as graphColoringCombinatoricsExtremalTerm,
  ramseyThreeThreeTerm as graphColoringRamseyThreeThreeTerm,
  formatsFourClosureHierarchyTerm,
  soficPathTerm,
  soficImageTerm,
  soficGoldenForbidsBBTerm,
  soficFibSubstituteGoldenTerm,
  soficFibDeepSoficTerm,
  soficFiniteLocalRuleTerm,
  recurrenceStepNAllEqualTerm,
  recurrenceGrowthDegreeTerm,
  recurrenceStepNHierarchyTerm,
  recurrenceSubstitutionPrimitivityTerm,
  dynamicsMldInvariantTerm,
  dynamicsMutuallyLocallyDerivableTerm,
  dynamicsHullThreadTerm,
  dynamicsHullSeamTerm,
  numberTheoryPascalTerm,
  numberTheoryBinomialTerm,
  numberTheoryGcdMeetTerm,
  numberTheoryEuclidLemmaTerm,
  numberTheoryCombinatoricsTerm,
  numberTheoryPrimeFactorizationTerm,
  numberTheoryPrimeFactorizationUniqueTerm,
  numberTheoryImageFactorizationTerm,
  valueSettlingPartialOrderTerm,
  valueSettlingClosureLawTerm,
  valueSettlingSettleFixedPointTerm,
  valueSettlingSettleLeastTerm,
  valueSettlingFourRegimeValueIndependentTerm,
  valueSettlingSpineRecoveryTerm,
  valueSettlingOptimizationTerm,
  valueSettlingDequantizationTerm,
  valueSettlingMagnitudeWitnessTerm,
  laxSlackKzStrictCollapseTerm,
  laxSlackAntisymmetryFailureTerm,
  laxSlackChargeNoLaxSlackTerm,
  laxSlackPreValueCategoryReceiptTerm,
  orderInfraPreorderTerm,
  orderInfraPartialOrderTerm,
  orderInfraMonotoneMapTerm,
  orderInfraLatticeTerm,
  orderInfraBoundedLatticeTerm,
  orderInfraDistributiveLatticeTerm,
  orderInfraCompleteLatticeTerm,
  ordinalClosureReceiptTerm,
  continuumColimitReceiptTerm,
  continuumColimitChuInformationActionTerm,
  regimeTimeSectionReceiptTerm,
  portGraphReceiptTerm,
  condensateMatterReceiptTerm,
  portGrowthReceiptTerm,
  portGrowthTimeReceiptTerm,
  portVershikReceiptTerm,
  matterTopologyReceiptTerm,
  weaveDraftReceiptTerm,
  inverseHullReceiptTerm,
  chromaticLorentzianReceiptTerm,
  chromaticLorentzianActionReceiptTerm,
  scottCoalgebraReceiptTerm,
  knasterTarskiFixedPointsTerm,
  residuatedLatticeLawsTerm,
  lambekLawsTerm,
  verificationTournamentReceiptTerm,
  fourTwistProductTerm,
  algebraHierarchyReceiptTerm,
  aperiodicAutocorrelationReceiptTerm,
  aperiodicClassificationReceiptTerm,
  aperiodicClassificationSettleFrameTerm,
  aperiodicClassificationReductionTerm,
  aperiodicGeometricMldCompleteTerm,
  aperiodicUpToClosureCoinductionTerm,
  aperiodicTransfiniteUpToClosureTerm,
  aperiodicDefectTerm,
  bitopologicalSettlingSiteReceiptTerm,
  coordinationCohomologyReceiptTerm,
  coordinationCohomologyLandauerEntropyTerm,
  frobeniusTqftReceiptTerm,
  jeandelRaoWitnessReceiptTerm,
  jeandelRaoWitnessSubstitutionPullbackTerm,
  jeandelRaoWitnessSubstitutionTowerTerm,
  jeandelRaoWitnessPersistenceTerm,
  pairwiseStoneClopenReceiptTerm,
  persistentH0ReceiptTerm,
  settlingAssociatedSheafReceiptTerm,
  settlingCohomologyH1ReceiptTerm,
  settlingLocalConstancyReceiptTerm,
  transfiniteCellComplexReceiptTerm,
  negativeParaconsistentSheafReceiptTerm,
  quantaleEnrichedSheafReceiptTerm,
  alexandrovHusainovReceiptTerm,
  crdtCalmReceiptTerm,
  kzCoherentSheafReceiptTerm,
  lawvereHarmonicCohomologyReceiptTerm,
  valuationFiberAlgebraReceiptTerm,
  quartetRecurrenceReceiptTerm,
  modalKripkeReceiptTerm,
  modalPairAdjunctionReceiptTerm,
  pointwiseClosureFamilyReceiptTerm,
  cosettlingReceiptTerm,
  closureMonadReceiptTerm,
  closure2MonadKzReceiptTerm,
  closureRuleReceiptTerm,
  closureRuleAlwaysTerm,
  discretePowersetReceiptTerm,
  discreteKuratowskiPairReceiptTerm,
  discreteEquivalencePartitionReceiptTerm,
  discreteNatSemiringReceiptTerm,
  discreteSuccessorAlgebraReceiptTerm,
  discreteDirectedHandshakeReceiptTerm,
  discreteTopologicalDagReceiptTerm,
  discreteTreeCountReceiptTerm,
  fcaLambekCircleReceiptTerm,
  fcaFormalConceptAnalysisReceiptTerm,
  fourCornerCellReceiptTerm,
  chlQuartetIsNuclearTerm,
  bigradedDiamondReceiptTerm,
  bigradedDiamondTowerTerm,
  bigradedCohomologyReceiptTerm,
  bigradedTruthKnowledgeSectionDecompositionTerm,
  bigradedLocalMldClassificationTerm,
  affineTraceParityWordTerm as collatzAffineTraceParityWordTerm,
  dFrameReceiptTerm,
  firstPassageTerm as collatzFirstPassageTerm,
  parentBarrierTerm as collatzParentBarrierTerm,
  twoAdicFactorTerm as collatzTwoAdicFactorTerm,
  shortcutOddPartTerm as collatzShortcutOddPartTerm,
  reachedQuiescenceTerm as collatzReachedQuiescenceTerm,
  residueCharacterizationTerm as collatzResidueCharacterizationTerm,
  padovanLeFibSeqTerm as collatzPadovanLeFibSeqTerm,
  semigroupGapReceiptTerm as collatzSemigroupGapReceiptTerm,
  firingBlowupTerm as flowFiringBlowupTerm,
  nscFiringTerm as flowNscFiringTerm,
  scottClosureNoNscTerm as flowScottClosureNoNscTerm,
  closureFlowDynamicsTerm as flowClosureFlowDynamicsTerm,
  curvatureRegimeTerm as flowCurvatureRegimeTerm,
  freeEnergyLyapunovTerm as flowFreeEnergyLyapunovTerm,
  laplacianizerTerm as flowLaplacianizerTerm,
  lawvereKernelH0Term as flowLawvereKernelH0Term,
  lawvereLaplacianSpectralGapReceiptTerm as flowLawvereLaplacianSpectralGapReceiptTerm,
  transfiniteOmegaContinuityTerm as flowTransfiniteOmegaContinuityTerm,
  nonScottContinuousFiringReceiptTerm as flowNonScottContinuousFiringReceiptTerm,
  closureFlowCurvatureRegimeReceiptTerm as flowClosureFlowCurvatureRegimeReceiptTerm,
  transfiniteClosureFlowReceiptTerm as flowTransfiniteClosureFlowReceiptTerm,
  blowupClassificationReceiptTerm as flowBlowupClassificationReceiptTerm,
  yonedaRecoveryTerm as predicatingYonedaRecoveryTerm,
  reindexTerm as predicatingReindexTerm,
  reindexBilatticeHomomorphismTerm as predicatingReindexBilatticeHomomorphismTerm,
  grothendieckTransposeTerm as predicatingGrothendieckTransposeTerm,
  temporalTwoCategoryTerm as predicatingTemporalTwoCategoryTerm,
  relativeIdealTerm as predicatingRelativeIdealTerm,
  yonedaArrowsFirstReceiptTerm as predicatingYonedaArrowsFirstReceiptTerm,
  predicationFibrationReceiptTerm as predicatingFibrationReceiptTerm,
  theoryRelativeIdealReceiptTerm as predicatingTheoryRelativeIdealReceiptTerm,
  predicatingEqualityReceiptTerm,
  predicatingTruthQuantifierTerm,
  predicatingQuantifyingReceiptTerm,
  predicatingHyperdoctrineReceiptTerm,
  predicatingDualHyperdoctrineReceiptTerm,
  rankVanishingTerm as cohomologyRankVanishingTerm,
  rankIdentityTerm as cohomologyRankIdentityTerm,
  rankComparisonTerm as cohomologyRankComparisonTerm,
  cohomologyCarrierTerm as cohomologyCarrierNormalizerTerm,
  cohomologyLaplacianTerm as cohomologyLaplacianNormalizerTerm,
  bigradedCohomologyTerm as cohomologyBigradedTerm,
  settlingFirstCohomologyTerm as cohomologySettlingFirstTerm,
  laplacianRelationGraphTerm,
  laplacianMatrixTerm,
  laplacianSpectrumPolynomialTerm,
  laplacianHarmonicTerm,
  laplacianHodgeDecompositionTerm,
  laplacianGraphSpectrumTerm,
  laplacianSignedBalanceTerm,
  laplacianDiffusionDirectionsTerm,
  linearAlgebraMatrixShapeTerm,
  linearAlgebraSquareMatrixInvariantsTerm,
  linearAlgebraRankNullityTerm,
  linearAlgebraBoolWorkedRankNullityTerm,
  spectralRootLocationTerm,
  spectralPisotRootTerm,
  spectralPolynomialIdentityTerm,
  spectralRootIntersectionTerm,
  spectralInversionSymmetryTerm,
  spectralDominantRootConvergenceTerm,
  spectralMahlerMeasureTerm,
  spectralMatrixPisotTerm,
} from "./evaluating/measuring/index.mjs";
import {
  intentOfExtentTerm,
  extentOfIntentTerm,
  closeExtentTerm,
  isConceptPairTerm,
  formalConceptTerm,
} from "./evaluating/connecting/index.mjs";
import {
  chuDualTerm,
  chuLookupTerm,
  chuDualInvolutionTerm,
} from "./evaluating/pairing/index.mjs";
import {
  readClassification,
  readDepth,
  readDepthFiniteStageJudgment,
  readLimitStages,
  readNonScottFirings,
  readFirstCohomology,
  readGradedGap,
  readGradedGapFirstCohomologyRankIdentity,
  readClosureInvariant,
} from "./evaluating/reading/index.mjs";

// ── articulating: the base object surface ──
export {
  Mark,
  Token,
  Claim,
  mark,
  token,
  claim,
  markKinds,
  isMarkKind,
  markKindTwoKinds,
  tokenNeClaim,
  utterance,
  articulatingUtter,
  articulatingPair,
  articulatingHead,
  articulatingDepth,
  articulatingFloor,
  articulatingUtterNePair,
  articulate,
  tokenIdentity,
  claimIdentity,
  isArticulationCell,
  coincides,
  fourCornerNames,
  cornerOfStatus,
  statusOfCorner,
  chargeNameOfCorner,
  readFourCorner,
  fourCornerOfArticulationCell,
  fourCornerCellReceipt,
} from "../lib/articulating/index.mjs";
export type {
  UtteranceCarrier,
  TokenArticulationSlot,
  ClaimArticulationSlot,
  AperiodicArticulationPairing,
  MarkKind,
  AperiodicArticulationCell,
  PotentialAperiodicArticulationCell,
  ArticulationCell,
  ArticulatingUtter,
  ArticulatingPair,
  Articulating,
  MarkCoincidenceWitness,
  MarkCoincidenceObstruction,
  TokenIdentityJudgment,
  ClaimIdentityJudgment,
  FourCornerName,
  FourCornerChargeAlias,
  FourCornerStatus,
  FourCornerReading,
  FourCornerCellReceipt,
} from "../lib/articulating/index.mjs";

// ── predicating: the predication category over the articulation base ──
export {
  Predicate,
  predicate,
  predicateOfClaim,
  predicationSeed,
  predicatingCell,
  cell,
  converseCell,
  subjectProjectionCell,
  objectProjectionCell,
  specializePredicateCell,
  converseCellInvolution,
  converseSeed,
  converseCellDistinctWhenOriented,
  subjectProjectionCellIdempotent,
  objectProjectionCellIdempotent,
  specializePredicateCellIdentity,
  cellSet,
  entitySet,
  predicateSet,
  generatedPredicationCellSet,
  generatePredicationCategory,
  transfinitePredicationCategory,
  materializePredicationCategory,
  predicationSite,
  presentPredicationSite,
  freePredicationSite,
  specializationMorphism,
  isCell,
  isSpecializationMorphism,
  closeSpecialization,
  cohere,
  unrelatedPairs,
  termCoincides,
  predicateCoincides,
  cellCoincides,
  nodeCoincides,
  baseObjectCoincides,
  predicationTermIdentity,
  predicationPredicateIdentity,
  cellIdentity,
  predicationNodeIdentity,
  relation,
  relationRead,
  relationReadAbsence,
  relationMatrix,
  matrixEntryReading,
  relationFromMatrix,
  isRelationCarrier,
  pointProfile,
  stateProfile,
  stateExtension,
  transpose,
  dual,
  settleStateProfile,
  settlePointProfile,
  checkRelationTransform,
  relationTransform,
  isRelationTransform,
  idTransform,
  composeTransforms,
  dualTransform,
  signatureOfCell,
  cellSignatureKey,
  predicationCategoryShadow,
  incomingArrows,
  yonedaRecovery,
  finitePredicationValuation,
  finiteValuationFromCells,
  embedding,
  reindexValuation,
  reindexWitness,
  reindexBilatticeHomomorphism,
  grothendieckTranspose,
  temporalZeroCell,
  temporalOneCell,
  temporalTwoCategory,
  relativeIdeal,
  yonedaArrowsFirstReceipt,
  predicationFibrationReceipt,
  theoryRelativeIdealReceipt,
  truthJoinList,
  truthMeetList,
  knowledgeJoinList,
  diagonalFiber,
  classicalEq,
  paraconsistentEq,
  equalityCell,
  predicatingEqualityReceipt,
  finiteFibration,
  truthQuantifierReceipt,
  finitePredicatingFibration,
  chargeListJoin,
  chargeListMeet,
  existsF,
  forallF,
  reindexF,
  swapValuation,
  predicatingQuantifyingReceipt,
  finiteConverseFibration,
  predicatingHyperdoctrineReceipt,
  predicatingDualHyperdoctrineReceipt,
} from "../lib/articulating/predicating/index.mjs";
export type {
  PredicationTerm,
  PredicationPredicate,
  PredicationNode,
  PredicationBaseObject,
  PredicationDatum,
  Cell,
  Edge,
  SpecializationMorphism,
  EntitySet,
  PredicateSet,
  CellSet,
  GeneratedPredicationCellSet,
  BaseCategory,
  PredicationSite,
  PredicationFiberFunctorCarrier,
  TransfinitePredicationCategory,
  CoherenceCarrier,
  UnrelatedPairsCarrier,
  Judgment,
  RelationSameness,
  RelationReadJudgment,
  RelationCarrier,
  RelationMatrixCarrier,
  RelationMatrixEntry,
  PointProfileCarrier,
  StateProfileCarrier,
  StateExtensionCarrier,
  RelationTransform,
  RelationTransformJudgment,
  PredicationObjectKind,
  PredicationCellSignature,
  PredicationObjectSignature,
  PredicationArrowSignature,
  PredicationCategoryShadow,
  YonedaRecoveryWitness,
  FinitePredicationValuation,
  PredicationEmbeddingEntry,
  PredicationEmbedding,
  ReindexWitness,
  BilatticeHomomorphismWitness,
  GrothendieckTransposeWitness,
  TemporalZeroCell,
  TemporalOneCell,
  TemporalTwoCategoryWitness,
  RelativeIdealWitness,
  YonedaArrowsFirstReceipt,
  PredicationFibrationReceipt,
  TheoryRelativeIdealReceipt,
  EqualityCell,
  PredicatingEqualityReceipt,
  FiniteFibrationCarrier,
  FibrationQuantifierReceipt,
  FiniteValuation,
  PredicatingFiniteFibration,
  PredicatingQuantifyingReceipt,
  PredicatingHyperdoctrineReceipt,
  PredicatingDualHyperdoctrineReceipt,
} from "../lib/articulating/predicating/index.mjs";

// ── positing: value entry by evidence (the bilattice charge algebra and fibers) ──
export {
  chargeSide,
  chargeSideNames,
  chargeValue,
  chargeValues,
  chargeValueNames,
  chargeValueName,
  chargeSideName,
  isChargeValueName,
  isChargeSideName,
  isChargeSide,
  isChargeValue,
  isCharge,
  asChargeValueName,
  asChargeValue,
  charge,
  bottom,
  witnessedPotential,
  valueOf,
  present,
  sameCharge,
  sameChargeValue,
  negate,
  negateValue,
  conflate,
  conflateValue,
  joinKnowledge,
  joinKnowledgeValue,
  meetKnowledge,
  meetKnowledgeValue,
  joinTruth,
  joinTruthValue,
  meetTruth,
  meetTruthValue,
  leqKnowledge,
  leqTruth,
  compareKnowledge,
  aggregate,
  knowledgeAggregate,
  knowledgeAggregateOfCensus,
  knowledgeMeet,
  knowledgeMeetOfCensus,
  truthAggregate,
  truthAggregateOfCensus,
  fourCensus,
  fourCensusOfNames,
  isTop,
  isBottom,
  knowledgeLeq,
  truthLeq,
  gauge,
  gaugeMul,
  gaugeOrderEffect,
  gaugeElementNames,
  fixedSet,
  firingPatternSelfDuality,
  chargeValueIdentity,
  chargeBilatticeLawReceipt,
  kleinFourGaugeReceipt,
  chargeFiniteAlgebra,
  meme,
  isMeme,
  allCells,
  predicateFiber,
  predicateFiberCellIdentity,
  fiberCarrier,
  posit,
  presentPositPresheaf,
  freePositPresheaf,
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
  knowledgeLeastValuation,
  fiberValuationLeqKnowledge,
  fiberValuationKnowledgeJoin,
  knowledgeLeastValuationReceipt,
  valuationFromPredicateFiber,
  commutate,
  presheaf,
  presheafFromValuation,
  sheafFromValuation,
  orderSwapValue,
  dihedral,
  dihedralElementNames,
  dihedralMul,
  dihedralFixedSet,
  dihedralOrderEffect,
  orderSwapIso,
  orderSwapDualityReceipt,
  dihedralConjugation,
  dihedralSwapsOrders,
  d4GaugeReceipt,
  truthImplicationValue,
  valuationFiberCarrier,
  readValuationFiber,
  valuationTruthMeet,
  valuationTruthJoin,
  valuationTruthImplication,
  valuationLeqTruth,
  valuationLeqKnowledge,
  nucleusToward,
  sigmaNucleus,
  deltaNucleus,
  piNucleus,
  crossOrderNotKnowledgeNucleus,
  valuationFiberAlgebraReceipt,
  valuationQuartetDischargeReceipt,
  modalToCorner,
  cornerToModal,
  valuationFiberCornerOp,
  quartetRecurrenceReceipt,
  modalKripkeFrame,
  possibilize,
  necessitate,
  closureOp,
  twistSplit,
  modalKripkeReceipt,
  modalPairAdjunctionReceipt,
  chargeClosureCarrier,
  knowledgeJoinClosure,
  applyChargeClosure,
  iterateChargeOperation,
  settleStep,
  chargeOrbit,
  liftClosure,
  valuationKnowledgeJoin,
  valuationKnowledgeMeet,
  closureOrbit,
  reindexMapCarrier,
  reindexValuationFiber,
  pointwiseClosureFamilyReceipt,
  cosettlingReceipt,
  closureMonadReceipt,
  closure2MonadKzReceipt,
  diataxisModeNames,
  diataxisModes,
  isDiataxisModeName,
  asDiataxisModeName,
  diataxisMode,
  diataxisModeName,
  chargeValueOfDiataxisMode,
  diataxisModeOfCharge,
  diataxisApplication,
  diataxisCognition,
  diataxisLookupDual,
  diataxisDoingDual,
  diataxisAntipode,
  diataxisReading,
} from "../lib/articulating/predicating/positing/index.mjs";
export type {
  DihedralElementName,
  DihedralOrderEffectName,
  OrderSwapIsoJudgment,
  OrderSwapDualityReceipt,
  DihedralConjugationJudgment,
  DihedralSwapsOrdersJudgment,
  D4GaugeReceipt,
  ValuationFiberCornerName,
  ModalCornerName,
  ValuationFiberCarrier,
  CrossOrderNucleusFinding,
  ValuationFiberAlgebraReceipt,
  ValuationQuartetDischargeReceipt,
  QuartetRecurrenceReceipt,
  KripkeFrameClass,
  KripkeValuation,
  ModalKripkeFrame,
  TwistSplit,
  ModalKripkeReceipt,
  ModalPairAdjunctionReceipt,
  ChargeClosureCarrier,
  ReindexMapCarrier,
  PointwiseClosureFamilyReceipt,
  CosettlingReceipt,
  ClosureMonadReceipt,
  Closure2MonadKzReceipt,
  DiataxisModeName,
  DiataxisMode,
  DiataxisDualityEdge,
  DiataxisReading,
  ChargeSideName,
  ChargeSide,
  ChargeValueName,
  ChargeCoordinates,
  ChargeValue,
  ChargeCarrier,
  ChargeFiniteAlgebraCarrier,
  ChargePair,
  FourCensus,
  GaugeElementName,
  GaugeOrderEffectName,
  FiringPatternSelfDualityJudgment,
  ChargeValueIdentityJudgment,
  OrderLeqJudgment,
  ChargeBilatticeLawReceipt,
  KleinFourGaugeReceipt,
  Meme,
  FiberAlgebra,
  Valuation,
  FiberCarrier,
  OrderName,
  Order,
  PredicateFiberCell,
  PredicateFiberCellIdentityJudgment,
  PredicateFiber,
  GeneratorKind,
  FiberGenerator,
  KnowledgeLeastValuationReceipt,
  PositPresheaf,
  PositPresheafGenerators,
  PresheafTrace,
  SheafCarrier,
  CommutationCarrier,
} from "../lib/articulating/predicating/positing/index.mjs";

// ── settling: the settlement filtration, its readers, sections, and analysis ──
export * from "../lib/articulating/predicating/positing/settling/index.mjs";

// ── the boundary: actions, the dispatcher, induceBins, invocation witnessing ──
export {
  action,
  composes,
  compose,
  isAction,
  induceBins,
  collectActions,
  dispatch,
  dispatchAsync,
  serve,
  serveAsync,
  routeRequest,
  routeRequestAsync,
  serveManifold,
  serveManifoldAsync,
  routeManifold,
  routeManifoldAsync,
  serveCarrierManifold,
  serveCarrierManifoldAsync,
  routeCarrierManifold,
  routeCarrierManifoldAsync,
  operationsManifoldOf,
  operationsManifoldGraphOf,
  operationsManifoldUri,
  wireCodec,
  WIRE_CODEC_NAMES,
  witnessInvocation,
  type Action,
  type InducedBins,
  type DispatchOptions,
  type DispatchResult,
  type ServeOptions,
  type ServedRequest,
  type ServedResponse,
  type ActionDiscovery,
  type PackageOperationsManifold,
  type OperationsManifoldGraph,
  type Invocation,
} from "./running/index.mjs";

export { actions } from "./actions.mjs";

// ── carriers: validating carrier objects assembled from the lib/ schemas ──
export { memeCarrier, tyCarrier, tmCarrier, utteranceCarrier, articulationCellCarrier } from "./carriers.mjs";
export {
  CausalSetSchema,
  causalSetCarrier,
  type CausalSet,
} from "./causal-set.mjs";

// ── the OBJECT half of the category kernel + the schema → structural-type → TS
//    representation pipeline (src/writing): carrier constructor, the realize
//    forgetful functor, structural-type printing, and the schema `$id` registry. ──
export {
  carrierFrom,
  realize,
  realizeDefs,
  printType,
  generateDeclaration,
  schemaRegistry,
  schemaId,
  type Carrier,
  type CarrierId,
  type FromSchema,
  type DataCarrier,
  type SchemaRegistry,
  type StructuralType,
  type StructuralField,
} from "./writing/index.mjs";

// ── the MORPHISM half of the category kernel (src/running/category): the live
//    registry, the IR audit, and the serializable morphism carrier face. ──
export {
  registeredCategory,
  actionIrAudit,
  freeTsActions,
  morphismCarrier,
  morphismSchemaCarrier,
  type MorphismCarrier,
  type ActionIrAuditEntry,
  type CategoryRegistry,
} from "./running/index.mjs";

// ── expressing: Relation Model Notation (RMN) — the CHL term calculus as JSON IR ──
export {
  TySchema,
  TmSchema,
  chlFormerNames,
  chlFormerToCorner,
  cornerToChlFormer,
  chlQuartetIsNuclearReceipt,
  ty,
  tm,
  rename,
  subst,
  inst,
  type Ty,
  type Tm,
  type TyCarrier,
  type TmCarrier,
  type GeneratorName,
  type UnaryChargeOp,
  type BinaryChargeOp,
  type OrderOp,
  type CHLFormerName,
  type CHLQuartetIsNuclearReceipt,
} from "../lib/notating/index.mjs";
export {
  step,
  dev,
  evaluate,
  evaluate as eval,
  evaluateRunTerm,
  hasTy,
  inferTy,
  checkTy,
  tyEqual,
  termSize,
  termUses,
  isClosed,
} from "./evaluating/index.mjs";

/**
 * The relational descent as closed RMN action bodies.
 *
 * These are the IR bodies used by the registered descent actions. They are
 * exported as a catalog so tests, docs, and downstream packages can inspect the
 * morphism bodies without reaching into internal files.
 */
export const descent = Object.freeze({
  articulate: articulateTerm,
  predicate: predicateTerm,
  posit: positTerm,
  settle: settleTerm,
  induceRelation: induceRelationTerm,
  relateRelations: relateRelationsTerm,
  coincide: coincideTerm,
});

/** Von Neumann natural-number builders carried as RMN terms. */
export const nat = Object.freeze({
  zero: natZeroTerm,
  successor: successorTerm,
  count: countTerm,
});

/** Settlement free-construction terms. */
export const settlingTerms = Object.freeze({
  free: freeTerm,
});

/** Settlement reader terms, each shaped as `read . free`. */
export const readerTerms = Object.freeze({
  readClassification,
  readDepth,
  readDepthFiniteStageJudgment,
  readLimitStages,
  readNonScottFirings,
  readFirstCohomology,
  readGradedGap,
  readGradedGapFirstCohomologyRankIdentity,
  readClosureInvariant,
});

/** Lean-grounded measurement invariant terms. */
export const measurement = Object.freeze({
  classifyRegime: classifyRegimeTerm,
  cohomologyVanishesInRegime: cohomologyVanishesInRegimeTerm,
});

/** Lean-grounded internal-real/logarithm witness normalizers as RMN terms. */
export const internalReal = Object.freeze({
  scalarCancellation: internalRealScalarCancellationTerm,
  logStepBound: internalRealLogStepBoundTerm,
  logMonotone: internalRealLogMonotoneTerm,
  logarithm: internalRealLogarithmTerm,
  sqrtSeqApproximation: internalRealSqrtSeqApproximationTerm,
  constructiveIvt: internalRealConstructiveIvtTerm,
  realMultiplication: internalRealRealMultiplicationTerm,
  goldenConvergentLogGap: internalRealGoldenConvergentLogGapTerm,
  metallicConvergentGap: internalRealMetallicConvergentGapTerm,
  metallicRoot: internalRealMetallicRootTerm,
  metallicReal: internalRealMetallicRealTerm,
  metallicPowerLens: internalRealMetallicPowerLensTerm,
  logLipschitz: internalRealLogLipschitzTerm,
  expSeries: internalRealExpSeriesTerm,
  metallizationDichotomy: internalRealMetallizationDichotomyTerm,
  salemPisot: internalRealSalemPisotTerm,
  edgeColouringEntropy: internalRealEdgeColouringEntropyTerm,
  triangleColouringEntropy: internalRealTriangleColouringEntropyTerm,
});

/** Lean-grounded finite Lorentzian causal-set witness normalizers as RMN terms. */
export const causal = Object.freeze({
  settle: causalSettleTerm,
  geometryIndependentOfTopology: causalGeometryIndependentOfTopologyTerm,
  coneField: causalConeFieldTerm,
  interval: causalIntervalTerm,
  alexandrov: causalAlexandrovTerm,
  alexandrovTopology: causalAlexandrovTopologyTerm,
  laplacian: causalLaplacianTerm,
  lightObservation: causalLightObservationTerm,
  diamondSpectralPortrait: diamondSpectralPortraitTerm,
  net: causalNetTerm,
  paraconsistentConeReport: paraconsistentConeReportTerm,
  microlocalSupport: microlocalSupportTerm,
  myrheimMeyerRealShadow: myrheimMeyerRealShadowTerm,
  benincasaDowker: benincasaDowkerTerm,
  einsteinHilbert: einsteinHilbertTerm,
  sprinklingAverage: sprinklingAverageTerm,
  dalembertian: causalDalembertianTerm,
  endogenousCoefficients: endogenousCoefficientsTerm,
  mobius: causalMobiusTerm,
  lambekCurvature: lambekCurvatureTerm,
  lambekRicci: lambekRicciTerm,
  cohomology: causalCohomologyTerm,
  cohomologyH2: causalCohomologyH2Term,
  cohomologyN: causalCohomologyNTerm,
  curvatureActionWiring: causalCurvatureActionWiringTerm,
  distance: causalDistanceTerm,
  bdgMobiusAction: bdgMobiusActionTerm,
});

/** Lean-grounded finite causal involutivity normalizer as an RMN term. */
export const causalInvolutivity = Object.freeze({
  receipt: causalInvolutivityReceiptTerm,
});

/** Lean-grounded finite causal manifoldlikeness normalizer as an RMN term. */
export const causalManifoldlikeness = Object.freeze({
  receipt: causalManifoldlikenessReceiptTerm,
});

/** Lean-grounded finite causal/charged/cotangent microsupport normalizer as an RMN term. */
export const causalMicrosupport = Object.freeze({
  receipt: causalMicrosupportReceiptTerm,
});

/** Lean-grounded finite causal MLD/classification normalizer as an RMN term. */
export const causalMldClassification = Object.freeze({
  receipt: causalMldClassificationReceiptTerm,
});

/** Lean-grounded finite Hauptvermutung fingerprint normalizer as an RMN term. */
export const hauptvermutung = Object.freeze({
  receipt: hauptvermutungReceiptTerm,
});

/** Lean-grounded finite configuration-overlap normalizer as an RMN term. */
export const glassOverlap = Object.freeze({
  receipt: glassOverlapReceiptTerm,
  basinGraph: glassBasinGraphTerm,
  dynamicHeterogeneity: glassDynamicHeterogeneityTerm,
  kcm: glassKcmTerm,
});

/** Lean-grounded finite inconsistency-sheaf normalizer as an RMN term. */
export const inconsistencySheaf = Object.freeze({
  receipt: inconsistencySheafReceiptTerm,
});

/** Lean-grounded finite causal polarization/Liouville normalizers as RMN terms. */
export const causalPolarization = Object.freeze({
  polarization: causalPolarizationReceiptTerm,
  liouville: causalLiouvilleReceiptTerm,
});

/** Lean-grounded finite probability/stochastic-settling witness normalizers as RMN terms. */
export const probability = Object.freeze({
  measureIsValuation: probabilityMeasureIsValuationTerm,
  conditionalViaFiberAdjoint: probabilityConditionalViaFiberAdjointTerm,
  markovStationaryIsClosureFixpoint: probabilityMarkovStationaryIsClosureFixpointTerm,
  stochasticIsValueSettling: probabilityStochasticIsValueSettlingTerm,
  realUnitIntervalValueCategory: probabilityRealUnitIntervalValueCategoryTerm,
  expectationLaws: probabilityExpectationLawsTerm,
  detailedBalanceImpliesStationary: probabilityDetailedBalanceImpliesStationaryTerm,
  poissonSettling: probabilityPoissonSettlingTerm,
});

/** Lean-grounded finite graph-coloring/chromatic/extremal witness normalizers as RMN terms. */
export const graphColoring = Object.freeze({
  properColoring: graphColoringProperColoringTerm,
  factorMap: graphColoringFactorMapTerm,
  completeGraphChromatic: graphColoringCompleteGraphChromaticTerm,
  handshakeDegreeParity: graphColoringHandshakeDegreeParityTerm,
  oddClosedWalkBipartiteObstruction: graphColoringOddClosedWalkBipartiteObstructionTerm,
  combinatoricsExtremal: graphColoringCombinatoricsExtremalTerm,
  ramseyThreeThree: graphColoringRamseyThreeThreeTerm,
});

/** Lean-grounded finite serialization format hierarchy normalizer. */
export const formatsFour = Object.freeze({
  closureHierarchy: formatsFourClosureHierarchyTerm,
});

/** Lean-grounded finite sofic-shift witness normalizers as RMN terms. */
export const sofic = Object.freeze({
  path: soficPathTerm,
  image: soficImageTerm,
  goldenForbidsBB: soficGoldenForbidsBBTerm,
  fibSubstituteGolden: soficFibSubstituteGoldenTerm,
  fibDeepSofic: soficFibDeepSoficTerm,
  finiteLocalRule: soficFiniteLocalRuleTerm,
});

/** Lean-grounded finite Step-N substitution-recurrence normalizers as RMN terms. */
export const recurrenceTerms = Object.freeze({
  stepNAllEqual: recurrenceStepNAllEqualTerm,
  growthDegree: recurrenceGrowthDegreeTerm,
  stepNHierarchy: recurrenceStepNHierarchyTerm,
  substitutionPrimitivity: recurrenceSubstitutionPrimitivityTerm,
});

/** Lean-grounded finite substitution-dynamics classifier/hull normalizers as RMN terms. */
export const dynamicsTerms = Object.freeze({
  mldInvariant: dynamicsMldInvariantTerm,
  mutuallyLocallyDerivable: dynamicsMutuallyLocallyDerivableTerm,
  hullThread: dynamicsHullThreadTerm,
  hullSeam: dynamicsHullSeamTerm,
});

/** Lean-grounded finite number-theory/factorization witness normalizers as RMN terms. */
export const numberTheory = Object.freeze({
  pascal: numberTheoryPascalTerm,
  binomial: numberTheoryBinomialTerm,
  gcdMeet: numberTheoryGcdMeetTerm,
  euclidLemma: numberTheoryEuclidLemmaTerm,
  combinatorics: numberTheoryCombinatoricsTerm,
  primeFactorization: numberTheoryPrimeFactorizationTerm,
  primeFactorizationUnique: numberTheoryPrimeFactorizationUniqueTerm,
  imageFactorization: numberTheoryImageFactorizationTerm,
});

/** Lean-grounded finite value-category settling/optimization normalizers as RMN terms. */
export const valueSettling = Object.freeze({
  partialOrder: valueSettlingPartialOrderTerm,
  closureLaw: valueSettlingClosureLawTerm,
  settleFixedPoint: valueSettlingSettleFixedPointTerm,
  settleLeast: valueSettlingSettleLeastTerm,
  fourRegimeValueIndependent: valueSettlingFourRegimeValueIndependentTerm,
  spineRecovery: valueSettlingSpineRecoveryTerm,
  optimization: valueSettlingOptimizationTerm,
  dequantization: valueSettlingDequantizationTerm,
  magnitudeWitness: valueSettlingMagnitudeWitnessTerm,
});

/** Lean-grounded finite lax-idempotence/antisymmetry normalizers as RMN terms. */
export const laxSlack = Object.freeze({
  kzStrictCollapse: laxSlackKzStrictCollapseTerm,
  antisymmetryFailure: laxSlackAntisymmetryFailureTerm,
  chargeNoLaxSlack: laxSlackChargeNoLaxSlackTerm,
  preValueCategory: laxSlackPreValueCategoryReceiptTerm,
});

/** Lean-grounded finite verification-tournament certificate normalizer. */
export const verificationTournament = Object.freeze({
  receipt: verificationTournamentReceiptTerm,
});

/** Lean-grounded finite order/lattice hierarchy normalizers as RMN terms. */
export const orderInfra = Object.freeze({
  preorder: orderInfraPreorderTerm,
  partialOrder: orderInfraPartialOrderTerm,
  monotoneMap: orderInfraMonotoneMapTerm,
  lattice: orderInfraLatticeTerm,
  boundedLattice: orderInfraBoundedLatticeTerm,
  distributiveLattice: orderInfraDistributiveLatticeTerm,
  completeLattice: orderInfraCompleteLatticeTerm,
});

/** Lean-grounded finite/symbolic ordinal closure normalizer. */
export const ordinalClosure = Object.freeze({
  receipt: ordinalClosureReceiptTerm,
});

/** Lean-grounded finite Scott-colimit continuum-limit shape normalizer. */
export const continuumColimit = Object.freeze({
  receipt: continuumColimitReceiptTerm,
  chuInformationAction: continuumColimitChuInformationActionTerm,
});

/** Lean-grounded finite causal past-count time-section normalizer. */
export const regimeTimeSection = Object.freeze({
  receipt: regimeTimeSectionReceiptTerm,
});

/** Lean-grounded finite lenticule port-graph and condensate-matter normalizers. */
export const portGraph = Object.freeze({
  receipt: portGraphReceiptTerm,
  condensateMatter: condensateMatterReceiptTerm,
  growth: portGrowthReceiptTerm,
  time: portGrowthTimeReceiptTerm,
  vershik: portVershikReceiptTerm,
});

/** Lean-grounded finite material contact-topology normalizer. */
export const matterTopology = Object.freeze({
  receipt: matterTopologyReceiptTerm,
});

/** Lean-grounded finite bilattice-coloured weave-draft normalizer. */
export const weaveDraft = Object.freeze({
  receipt: weaveDraftReceiptTerm,
});

/** Lean-grounded finite constant Anderson-Putnam inverse-hull normalizer. */
export const inverseHull = Object.freeze({
  receipt: inverseHullReceiptTerm,
});

/** Lean-grounded finite chromatic-Lorentzian settling/action normalizers. */
export const chromaticLorentzian = Object.freeze({
  receipt: chromaticLorentzianReceiptTerm,
  action: chromaticLorentzianActionReceiptTerm,
});

/** Lean-grounded finite Scott-continuity and settling-coalgebra normalizer. */
export const scottCoalgebra = Object.freeze({
  receipt: scottCoalgebraReceiptTerm,
});

/** Lean-grounded finite Knaster-Tarski fixed-point normalizer as an RMN term. */
export const knasterTarski = Object.freeze({
  fixedPoints: knasterTarskiFixedPointsTerm,
});

/** Lean-grounded finite integral commutative residuated-lattice normalizer. */
export const residuatedLattice = Object.freeze({
  laws: residuatedLatticeLawsTerm,
});

/** Lean-grounded finite Lambek-algebra normalizer. */
export const lambek = Object.freeze({
  laws: lambekLawsTerm,
});

/** Lean-grounded finite twist-product/FOUR normalizer. */
export const twistProduct = Object.freeze({
  four: fourTwistProductTerm,
});

/** Lean-grounded finite algebra-hierarchy receipt normalizer. */
export const algebraHierarchy = Object.freeze({
  receipt: algebraHierarchyReceiptTerm,
});

/** Lean-grounded finite aperiodic autocorrelation normalizer. */
export const aperiodicAutocorrelation = Object.freeze({
  receipt: aperiodicAutocorrelationReceiptTerm,
});

/** Lean-grounded finite aperiodic classification/moduli/direct-limit normalizer. */
export const aperiodicClassification = Object.freeze({
  receipt: aperiodicClassificationReceiptTerm,
  settleFrame: aperiodicClassificationSettleFrameTerm,
  classificationReduction: aperiodicClassificationReductionTerm,
  geometricMldComplete: aperiodicGeometricMldCompleteTerm,
  upToClosureCoinduction: aperiodicUpToClosureCoinductionTerm,
  transfiniteUpToClosure: aperiodicTransfiniteUpToClosureTerm,
  defect: aperiodicDefectTerm,
});

/** Lean-grounded finite bitopological settling-site normalizer. */
export const bitopologicalSettlingSite = Object.freeze({
  receipt: bitopologicalSettlingSiteReceiptTerm,
});

/** Lean-grounded finite coordination-cohomology normalizer. */
export const coordinationCohomology = Object.freeze({
  receipt: coordinationCohomologyReceiptTerm,
  landauerEntropy: coordinationCohomologyLandauerEntropyTerm,
});

/** Lean-grounded finite settling Frobenius/TQFT normalizer. */
export const frobeniusTqft = Object.freeze({
  receipt: frobeniusTqftReceiptTerm,
});

/** Lean-grounded finite Jeandel-Rao AP cohomology witness normalizer. */
export const jeandelRaoWitness = Object.freeze({
  receipt: jeandelRaoWitnessReceiptTerm,
  substitutionPullback: jeandelRaoWitnessSubstitutionPullbackTerm,
  substitutionTower: jeandelRaoWitnessSubstitutionTowerTerm,
  persistence: jeandelRaoWitnessPersistenceTerm,
});

/** Lean-grounded finite paired Priestley / pairwise-Stone FOUR normalizer. */
export const pairwiseStoneClopen = Object.freeze({
  receipt: pairwiseStoneClopenReceiptTerm,
});

/** Lean-grounded finite settling-associated sheaf normalizer. */
export const settlingAssociatedSheaf = Object.freeze({
  receipt: settlingAssociatedSheafReceiptTerm,
});

/** Lean-grounded finite settling H0/H1/cohomology normalizer. */
export const settlingCohomologyH1 = Object.freeze({
  receipt: settlingCohomologyH1ReceiptTerm,
});

/** Lean-grounded finite settling-local-constancy normalizer. */
export const settlingLocalConstancy = Object.freeze({
  receipt: settlingLocalConstancyReceiptTerm,
});

/** Lean-grounded finite transfinite-cell-complex normalizer. */
export const transfiniteCellComplex = Object.freeze({
  receipt: transfiniteCellComplexReceiptTerm,
});

/** Lean-grounded finite negative-paraconsistent sheaf normalizer. */
export const negativeParaconsistentSheaf = Object.freeze({
  receipt: negativeParaconsistentSheafReceiptTerm,
});

/** Lean-grounded finite quantale-enriched sheaf normalizer. */
export const quantaleEnrichedSheaf = Object.freeze({
  receipt: quantaleEnrichedSheafReceiptTerm,
});

/** Lean-grounded finite Alexandrov/Husainov normalizer. */
export const alexandrovHusainov = Object.freeze({
  receipt: alexandrovHusainovReceiptTerm,
});

/** Lean-grounded finite CRDT/CALM convergence normalizer. */
export const crdtCalm = Object.freeze({
  receipt: crdtCalmReceiptTerm,
});

/** Lean-grounded finite KZ-coherent sheaf descent normalizer. */
export const kzCoherentSheaf = Object.freeze({
  receipt: kzCoherentSheafReceiptTerm,
});

/** Lean-grounded finite Lawvere-harmonic cohomology normalizer. */
export const lawvereHarmonicCohomology = Object.freeze({
  receipt: lawvereHarmonicCohomologyReceiptTerm,
});

/** Lean-grounded finite valuation-fiber Heyting/nuclear-quartet normalizers. */
export const valuationFiberAlgebra = Object.freeze({
  receipt: valuationFiberAlgebraReceiptTerm,
  quartetRecurrence: quartetRecurrenceReceiptTerm,
});

/** Lean-grounded finite FOUR-valued Kripke frame hierarchy normalizer. */
export const modalKripke = Object.freeze({
  receipt: modalKripkeReceiptTerm,
  modalPairAdjunction: modalPairAdjunctionReceiptTerm,
});

/** Lean-grounded finite pointwise closure-family normalizers. */
export const closureFamily = Object.freeze({
  pointwise: pointwiseClosureFamilyReceiptTerm,
  cosettling: cosettlingReceiptTerm,
  monad: closureMonadReceiptTerm,
  closure2MonadKz: closure2MonadKzReceiptTerm,
});

/** Lean-grounded finite closure-rule-system normalizers. */
export const closureRule = Object.freeze({
  receipt: closureRuleReceiptTerm,
  always: closureRuleAlwaysTerm,
});

/** Lean-grounded finite set/number/graph normalizers. */
export const discreteTerms = Object.freeze({
  powerset: discretePowersetReceiptTerm,
  kuratowskiPair: discreteKuratowskiPairReceiptTerm,
  equivalencePartition: discreteEquivalencePartitionReceiptTerm,
  natSemiring: discreteNatSemiringReceiptTerm,
  successorAlgebra: discreteSuccessorAlgebraReceiptTerm,
  directedHandshake: discreteDirectedHandshakeReceiptTerm,
  topologicalDag: discreteTopologicalDagReceiptTerm,
  treeCount: discreteTreeCountReceiptTerm,
});

/** Lean-grounded finite FCA/Lambek/residuated/settling circle normalizer. */
export const fcaLambekCircle = Object.freeze({
  receipt: fcaLambekCircleReceiptTerm,
  formalConceptAnalysis: fcaFormalConceptAnalysisReceiptTerm,
});

/** Lean-grounded finite persistent-H0 graph-filtration normalizer. */
export const persistentH0 = Object.freeze({
  receipt: persistentH0ReceiptTerm,
});

/** Lean-grounded four-corner articulation/charge bridge normalizer. */
export const fourCornerCell = Object.freeze({
  receipt: fourCornerCellReceiptTerm,
});

/** Lean-grounded Curry-Howard-Lambek quartet/nuclear-corner normalizer. */
export const chl = Object.freeze({
  quartetIsNuclear: chlQuartetIsNuclearTerm,
});

/** Lean-grounded finite FOUR knowledge-Heyting nuclear-square normalizer. */
export const bigradedDiamond = Object.freeze({
  receipt: bigradedDiamondReceiptTerm,
  tower: bigradedDiamondTowerTerm,
});

/** Lean-grounded finite bigraded-cohomology gauge normalizer. */
export const bigradedCohomology = Object.freeze({
  receipt: bigradedCohomologyReceiptTerm,
  truthKnowledgeSectionDecomposition: bigradedTruthKnowledgeSectionDecompositionTerm,
  localMldClassification: bigradedLocalMldClassificationTerm,
});

/** Lean-grounded finite Collatz arithmetic-shadow witness normalizers as RMN terms. */
export const collatz = Object.freeze({
  affineTraceParityWord: collatzAffineTraceParityWordTerm,
  firstPassage: collatzFirstPassageTerm,
  parentBarrier: collatzParentBarrierTerm,
  twoAdicFactor: collatzTwoAdicFactorTerm,
  shortcutOddPart: collatzShortcutOddPartTerm,
  reachedQuiescence: collatzReachedQuiescenceTerm,
  residueCharacterization: collatzResidueCharacterizationTerm,
  padovanLeFibSeq: collatzPadovanLeFibSeqTerm,
  semigroupGap: collatzSemigroupGapReceiptTerm,
});

/** Lean-grounded finite d-frame and d-frame-valued sheaf normalizer. */
export const dFrame = Object.freeze({
  receipt: dFrameReceiptTerm,
});

/** Lean-grounded finite closure-flow/firing witness normalizers as RMN terms. */
export const flow = Object.freeze({
  firingBlowup: flowFiringBlowupTerm,
  nscFiring: flowNscFiringTerm,
  scottClosureNoNsc: flowScottClosureNoNscTerm,
  closureFlowDynamics: flowClosureFlowDynamicsTerm,
  curvatureRegime: flowCurvatureRegimeTerm,
  freeEnergyLyapunov: flowFreeEnergyLyapunovTerm,
  laplacianizer: flowLaplacianizerTerm,
  lawvereKernelH0: flowLawvereKernelH0Term,
  lawvereLaplacianSpectralGap: flowLawvereLaplacianSpectralGapReceiptTerm,
  transfiniteOmegaContinuity: flowTransfiniteOmegaContinuityTerm,
  nonScottContinuousFiring: flowNonScottContinuousFiringReceiptTerm,
  closureFlowCurvatureRegime: flowClosureFlowCurvatureRegimeReceiptTerm,
  transfiniteClosureFlow: flowTransfiniteClosureFlowReceiptTerm,
  blowupClassification: flowBlowupClassificationReceiptTerm,
});

/** Lean-grounded finite predication fibration/Yoneda witness normalizers as RMN terms. */
export const predicating = Object.freeze({
  yonedaRecovery: predicatingYonedaRecoveryTerm,
  reindex: predicatingReindexTerm,
  reindexBilatticeHomomorphism: predicatingReindexBilatticeHomomorphismTerm,
  grothendieckTranspose: predicatingGrothendieckTransposeTerm,
  temporalTwoCategory: predicatingTemporalTwoCategoryTerm,
  relativeIdeal: predicatingRelativeIdealTerm,
  yonedaArrowsFirst: predicatingYonedaArrowsFirstReceiptTerm,
  fibration: predicatingFibrationReceiptTerm,
  theoryRelativeIdeal: predicatingTheoryRelativeIdealReceiptTerm,
  equality: predicatingEqualityReceiptTerm,
  truthQuantifier: predicatingTruthQuantifierTerm,
  quantifying: predicatingQuantifyingReceiptTerm,
  hyperdoctrine: predicatingHyperdoctrineReceiptTerm,
  dualHyperdoctrine: predicatingDualHyperdoctrineReceiptTerm,
});

/** Lean-grounded finite cohomology witness normalizers as RMN terms. */
export const cohomologyTerms = Object.freeze({
  rankVanishing: cohomologyRankVanishingTerm,
  rankIdentity: cohomologyRankIdentityTerm,
  rankComparison: cohomologyRankComparisonTerm,
  carrier: cohomologyCarrierNormalizerTerm,
  laplacian: cohomologyLaplacianNormalizerTerm,
  bigraded: cohomologyBigradedTerm,
  settlingFirst: cohomologySettlingFirstTerm,
});

/** Lean-grounded finite Lawvere-Laplacian witness normalizers as RMN terms. */
export const laplacianTerms = Object.freeze({
  relationGraph: laplacianRelationGraphTerm,
  matrix: laplacianMatrixTerm,
  spectrumPolynomial: laplacianSpectrumPolynomialTerm,
  harmonic: laplacianHarmonicTerm,
  hodgeDecomposition: laplacianHodgeDecompositionTerm,
  graphSpectrum: laplacianGraphSpectrumTerm,
  signedBalance: laplacianSignedBalanceTerm,
  diffusionDirections: laplacianDiffusionDirectionsTerm,
});

/** Lean-grounded finite exact matrix/rank-nullity normalizers as RMN terms. */
export const linearAlgebraTerms = Object.freeze({
  matrixShape: linearAlgebraMatrixShapeTerm,
  squareMatrixInvariants: linearAlgebraSquareMatrixInvariantsTerm,
  rankNullity: linearAlgebraRankNullityTerm,
  boolWorkedRankNullity: linearAlgebraBoolWorkedRankNullityTerm,
});

/** Lean-grounded exact polynomial/matrix spectral normalizers as RMN terms. */
export const spectralTerms = Object.freeze({
  rootLocation: spectralRootLocationTerm,
  pisotRoot: spectralPisotRootTerm,
  polynomialIdentity: spectralPolynomialIdentityTerm,
  rootIntersection: spectralRootIntersectionTerm,
  inversionSymmetry: spectralInversionSymmetryTerm,
  dominantRootConvergence: spectralDominantRootConvergenceTerm,
  mahlerMeasure: spectralMahlerMeasureTerm,
  matrixPisot: spectralMatrixPisotTerm,
});

/**
 * Formal Concept Analysis operators — RelMath.Order.FormalConceptAnalysis.
 *
 * The Galois connection between extents and intents over the predication-cell
 * incidence: I(subject, predicate) iff ∃ cell with that subject and predicate.
 *
 *   intentOfExtent  primeA I A = attributes shared by all objects in extent A
 *   extentOfIntent  primeB I B = objects bearing all attributes in intent B
 *   closeExtent     primeB ∘ primeA — the FCA closure (extensive, monotone, idempotent)
 *   isConceptPair   (A,B) is a formal concept iff primeA(A)=B and primeB(B)=A
 *   formalConcept   construct a concept from cells + seed extent (closes the extent first)
 */
export const fca = Object.freeze({
  intentOfExtent: intentOfExtentTerm,
  extentOfIntent: extentOfIntentTerm,
  closeExtent: closeExtentTerm,
  isConceptPair: isConceptPairTerm,
  formalConcept: formalConceptTerm,
});

/**
 * Finite Chu-space operators over FOUR — RelMath.Order.LinearLogicChu.
 *
 * A Node-side Chu space `{ pts, r, sts }` carries a FOUR-valued matrix
 * `r : [{ charge, pt, st }]`. The implemented RMN terms transpose that finite
 * encoding, look up matrix entries, and witness the double-dual equality. Lean
 * proves the abstract Chu/FOUR dual-involution theorem; the Node surface is the
 * finite encoded operator layer, not the full Chu transform category.
 *
 *   dual          swap pts/sts and negate each charge
 *   lookup        evaluate the matrix at a single (pt, st) cell
 *   dualInvolution  verify dual(dual(C)) = C
 *
 * @example
 * ```js
 * import { chu, evaluateRunTerm } from "@emsenn/relating";
 *
 * const space = {
 *   pts: ["a"],
 *   sts: ["x"],
 *   r: [{ pt: "a", st: "x", charge: "active" }],
 * };
 *
 * evaluateRunTerm(chu.lookup, { space, pt: "a", st: "x" }); // "active"
 * evaluateRunTerm(chu.dualInvolution, space); // true
 * ```
 */
export const chu = Object.freeze({
  dual: chuDualTerm,
  lookup: chuLookupTerm,
  dualInvolution: chuDualInvolutionTerm,
});

export {
  carrierToTerm,
  termToCarrier,
  objectTerm,
  arrayTerm,
  stringTerm,
} from "./evaluating/projecting/index.mjs";

// ── the JSON codec helpers downstream packages admit their own data through ──
export {
  canonical,
  requireJsonValue,
  jsonResource,
  parse as parseJson,
  type JsonValue,
  type JsonRecord,
} from "./writing/json.mjs";

export {
  LeanGoldenVectorSchema,
  decodeLeanGoldenVectorJsonl,
  decodeLeanGoldenVectorLine,
  encodeLeanGoldenVectorJsonl,
  leanGoldenVectorCarrier,
  leanGoldenVectorsByAction,
  type LeanGoldenVector,
} from "./writing/lean/index.mjs";
