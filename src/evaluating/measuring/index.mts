/**
 * @packageDocumentation
 *
 * `@emsenn/relating/evaluating/measuring` exports Lean-grounded closure-regime
 * invariants as RMN terms.
 *
 * These reproduce abstract RelMath theorems and are golden-vectored against Lean
 * via test/fixtures/lean-measurement-golden.jsonl. Domain: `ClosureRegimeData`
 * `{ scottContinuous, finiteBase, countableCofinality }` / `ClosureRegime`.
 *
 * Product reading: measurement facts that are small enough to compute in Node
 * can still live as portable term bodies, with Lean-emitted vectors acting as
 * the oracle for the finite law surface this package actually claims.
 */
import { tm, type Tm } from "../../../lib/notating/index.mjs";
import { objectTerm, stringTerm } from "../projecting/index.mjs";
import {
  aperiodicClosureRegime,
  finiteClosureRegime,
  scottClosureRegime,
  transfiniteClosureRegime,
  type ClosureRegime,
} from "../../../lib/articulating/predicating/positing/settling/closure.mjs";
import { classifyRegime, cohomologyVanishesInRegime } from "../../../lib/articulating/predicating/positing/settling/value-category.mjs";

export {
  scalarCancellationTerm,
  logStepBoundTerm,
  logMonotoneTerm,
  sqrtSeqApproximationTerm,
  goldenConvergentLogGapTerm,
  metallicConvergentGapTerm,
  metallicRootTerm,
  edgeColouringEntropyTerm,
  triangleColouringEntropyTerm,
} from "./internal-real.mjs";
export {
  settleCausalSetTerm,
  geometryIndependentOfTopologyTerm,
  coneFieldTerm as causalConeFieldTerm,
  causalAlexandrovTerm,
  causalLaplacianTerm,
  lightObservationTerm as causalLightObservationTerm,
  diamondSpectralPortraitTerm,
  causalNetTerm,
  paraconsistentConeReportTerm,
  microlocalSupportTerm,
  myrheimMeyerRealShadowTerm,
} from "./causal.mjs";
export {
  measureIsValuationTerm,
  conditionalViaFiberAdjointTerm,
  markovStationaryIsClosureFixpointTerm,
  stochasticIsValueSettlingTerm,
  realUnitIntervalValueCategoryTerm,
} from "./probability.mjs";
export {
  properColoringTerm,
  coloringFactorMapTerm,
  completeGraphChromaticTerm,
  handshakeDegreeParityTerm,
  oddClosedWalkBipartiteObstructionTerm,
  ramseyThreeThreeTerm,
} from "./coloring.mjs";
export {
  closureHierarchyTerm as formatsFourClosureHierarchyTerm,
} from "./formats-four.mjs";
export {
  pathTerm as soficPathTerm,
  imageTerm as soficImageTerm,
  goldenForbidsBBTerm as soficGoldenForbidsBBTerm,
  fibSubstituteGoldenTerm as soficFibSubstituteGoldenTerm,
  fibDeepSoficTerm as soficFibDeepSoficTerm,
} from "./sofic.mjs";
export {
  stepNAllEqualTerm as recurrenceStepNAllEqualTerm,
  growthDegreeTerm as recurrenceGrowthDegreeTerm,
  stepNHierarchyTerm as recurrenceStepNHierarchyTerm,
} from "./recurrence.mjs";
export {
  mldInvariantTerm as dynamicsMldInvariantTerm,
  mutuallyLocallyDerivableTerm as dynamicsMutuallyLocallyDerivableTerm,
  hullThreadTerm as dynamicsHullThreadTerm,
  hullSeamTerm as dynamicsHullSeamTerm,
} from "./dynamics.mjs";
export {
  pascalTerm as numberTheoryPascalTerm,
  binomialTerm as numberTheoryBinomialTerm,
  gcdMeetTerm as numberTheoryGcdMeetTerm,
  euclidLemmaTerm as numberTheoryEuclidLemmaTerm,
  primeFactorizationTerm as numberTheoryPrimeFactorizationTerm,
  primeFactorizationUniqueTerm as numberTheoryPrimeFactorizationUniqueTerm,
  imageFactorizationTerm as numberTheoryImageFactorizationTerm,
} from "./number-theory.mjs";
export {
  partialOrderTerm as valueSettlingPartialOrderTerm,
  closureLawTerm as valueSettlingClosureLawTerm,
  settleFixedPointTerm as valueSettlingSettleFixedPointTerm,
  settleLeastTerm as valueSettlingSettleLeastTerm,
  fourRegimeValueIndependentTerm as valueSettlingFourRegimeValueIndependentTerm,
  spineRecoveryTerm as valueSettlingSpineRecoveryTerm,
  optimizationTerm as valueSettlingOptimizationTerm,
} from "./value-settling.mjs";
export {
  kzStrictCollapseTerm as laxSlackKzStrictCollapseTerm,
  laxSlackAntisymmetryFailureTerm as laxSlackAntisymmetryFailureTerm,
  chargeNoLaxSlackTerm as laxSlackChargeNoLaxSlackTerm,
} from "./lax-slack.mjs";
export {
  preorderTerm as orderInfraPreorderTerm,
  partialOrderTerm as orderInfraPartialOrderTerm,
  monotoneMapTerm as orderInfraMonotoneMapTerm,
  latticeTerm as orderInfraLatticeTerm,
  boundedLatticeTerm as orderInfraBoundedLatticeTerm,
  distributiveLatticeTerm as orderInfraDistributiveLatticeTerm,
  completeLatticeTerm as orderInfraCompleteLatticeTerm,
} from "./order-infra.mjs";
export {
  receiptTerm as ordinalClosureReceiptTerm,
} from "./ordinal-closure.mjs";
export {
  receiptTerm as scottCoalgebraReceiptTerm,
} from "./scott-coalgebra.mjs";
export {
  fixedPointsTerm as knasterTarskiFixedPointsTerm,
} from "./knaster-tarski.mjs";
export {
  lawsTerm as residuatedLatticeLawsTerm,
} from "./residuated-lattice.mjs";
export {
  lawsTerm as lambekLawsTerm,
} from "./lambek-calculus.mjs";
export {
  fourTwistProductTerm,
} from "./twist-product.mjs";
export {
  algebraHierarchyReceiptTerm,
} from "./algebra-hierarchy.mjs";
export {
  receiptTerm as aperiodicClassificationReceiptTerm,
} from "./aperiodic-classification.mjs";
export {
  receiptTerm as coordinationCohomologyReceiptTerm,
} from "./coordination-cohomology.mjs";
export {
  receiptTerm as frobeniusTqftReceiptTerm,
} from "./frobenius-tqft.mjs";
export {
  receiptTerm as jeandelRaoWitnessReceiptTerm,
} from "./jeandel-rao-witness.mjs";
export {
  receiptTerm as pairwiseStoneClopenReceiptTerm,
} from "./pairwise-stone-clopen.mjs";
export {
  receiptTerm as settlingAssociatedSheafReceiptTerm,
} from "./settling-associated-sheaf.mjs";
export {
  receiptTerm as negativeParaconsistentSheafReceiptTerm,
} from "./negative-paraconsistent-sheaf.mjs";
export {
  receiptTerm as quantaleEnrichedSheafReceiptTerm,
} from "./quantale-enriched-sheaf.mjs";
export {
  receiptTerm as alexandrovHusainovReceiptTerm,
} from "./alexandrov-husainov.mjs";
export {
  receiptTerm as crdtCalmReceiptTerm,
} from "./crdt-cohomological-calm.mjs";
export {
  receiptTerm as kzCoherentSheafReceiptTerm,
} from "./kz-coherent-sheaf.mjs";
export {
  valuationFiberAlgebraReceiptTerm,
  quartetRecurrenceReceiptTerm,
} from "./valuation-fiber-algebra.mjs";
export {
  modalKripkeReceiptTerm,
} from "./modal-kripke-four-valued.mjs";
export {
  pointwiseClosureFamilyReceiptTerm,
  cosettlingReceiptTerm,
  closureMonadReceiptTerm,
} from "./closure-operator-fiber.mjs";
export {
  closureRuleReceiptTerm,
  closureRuleAlwaysTerm,
} from "./closure-rule-system.mjs";
export {
  powersetReceiptTerm as discretePowersetReceiptTerm,
  kuratowskiPairReceiptTerm as discreteKuratowskiPairReceiptTerm,
  equivalencePartitionReceiptTerm as discreteEquivalencePartitionReceiptTerm,
  natSemiringReceiptTerm as discreteNatSemiringReceiptTerm,
  directedHandshakeReceiptTerm as discreteDirectedHandshakeReceiptTerm,
  topologicalDagReceiptTerm as discreteTopologicalDagReceiptTerm,
  treeCountReceiptTerm as discreteTreeCountReceiptTerm,
} from "./discrete-set-number-graph.mjs";
export {
  circleReceiptTerm as fcaLambekCircleReceiptTerm,
} from "./fca-lambek-circle.mjs";
export {
  fourCornerCellReceiptTerm,
} from "./four-corner-cell.mjs";
export {
  receiptTerm as bigradedDiamondReceiptTerm,
  towerTerm as bigradedDiamondTowerTerm,
} from "./bigraded-diamond.mjs";
export {
  receiptTerm as bigradedCohomologyReceiptTerm,
} from "./bigraded-cohomology.mjs";
export {
  affineTraceParityWordTerm,
  firstPassageTerm,
  parentBarrierTerm,
  twoAdicFactorTerm,
  shortcutOddPartTerm,
  reachedQuiescenceTerm,
  residueCharacterizationTerm,
  padovanLeFibSeqTerm,
} from "./collatz.mjs";
export {
  receiptTerm as dFrameReceiptTerm,
} from "./d-frame.mjs";
export {
  firingBlowupTerm,
  nscFiringTerm,
  scottClosureNoNscTerm,
  closureFlowDynamicsTerm,
  curvatureRegimeTerm,
  freeEnergyLyapunovTerm,
  laplacianizerTerm,
  transfiniteOmegaContinuityTerm,
} from "./flow.mjs";
export {
  yonedaRecoveryTerm,
  reindexTerm,
  reindexBilatticeHomomorphismTerm,
  grothendieckTransposeTerm,
  temporalTwoCategoryTerm,
  relativeIdealTerm,
} from "./predicating.mjs";
export {
  predicatingEqualityReceiptTerm,
  predicatingTruthQuantifierTerm,
} from "./predicating-equality.mjs";
export {
  predicatingQuantifyingReceiptTerm,
  predicatingHyperdoctrineReceiptTerm,
  predicatingDualHyperdoctrineReceiptTerm,
} from "./predicating-quantifying.mjs";
export {
  rankVanishingTerm,
  rankIdentityTerm,
  rankComparisonTerm,
  cohomologyCarrierTerm,
  cohomologyLaplacianTerm,
  bigradedCohomologyTerm,
  settlingFirstCohomologyTerm,
} from "./cohomology.mjs";
export {
  relationGraphTerm as laplacianRelationGraphTerm,
  laplacianMatrixTerm,
  spectrumPolynomialTerm as laplacianSpectrumPolynomialTerm,
  harmonicTerm as laplacianHarmonicTerm,
  hodgeDecompositionTerm as laplacianHodgeDecompositionTerm,
  graphSpectrumTerm as laplacianGraphSpectrumTerm,
  signedBalanceTerm as laplacianSignedBalanceTerm,
  diffusionDirectionsTerm as laplacianDiffusionDirectionsTerm,
} from "./laplacian.mjs";
export {
  matrixShapeTerm as linearAlgebraMatrixShapeTerm,
  squareMatrixInvariantsTerm as linearAlgebraSquareMatrixInvariantsTerm,
  rankNullityTerm as linearAlgebraRankNullityTerm,
} from "./linear-algebra.mjs";
export {
  rootLocationTerm as spectralRootLocationTerm,
  pisotRootTerm as spectralPisotRootTerm,
  polynomialIdentityTerm as spectralPolynomialIdentityTerm,
  rootIntersectionTerm as spectralRootIntersectionTerm,
  inversionSymmetryTerm as spectralInversionSymmetryTerm,
  dominantRootConvergenceTerm as spectralDominantRootConvergenceTerm,
  mahlerMeasureTerm as spectralMahlerMeasureTerm,
  matrixPisotTerm as spectralMatrixPisotTerm,
} from "./spectral.mjs";

/** The four closure regimes, IN ORDER, sourced from lib's `ClosureRegime` carriers. The
 *  evaluating layer never re-authors the regime kind strings or the cohomology-vanishing table:
 *  both are owned by `lib/.../settling` and consumed here. */
const CLOSURE_REGIMES: readonly ClosureRegime[] = Object.freeze([
  finiteClosureRegime,
  scottClosureRegime,
  transfiniteClosureRegime,
  aperiodicClosureRegime,
]);

/** A regime-result object term whose `kind` is the lib carrier's kind (single-sourced, not a
 *  hand-written `ordinal.closure.regime.*` literal). */
const regimeConst = (regime: ClosureRegime) => objectTerm([["kind", stringTerm(regime.kind)]]);

/** The regime-result term that lib's `classifyRegime` assigns to a representative datum — each
 *  classify branch's RESULT is computed by lib, not hand-mapped from field to regime. */
const classifiedRegimeConst = (scottContinuous: boolean, finiteBase: boolean, countableCofinality: boolean) =>
  regimeConst(classifyRegime({ kind: "settling.closureRegimeData", scottContinuous, finiteBase, countableCofinality }));

/**
 * `classifyRegime` — `RelMath.ClosureOrdinalRegime.classify` as an IR cond-chain.
 * Domain: `{ scottContinuous, finiteBase, countableCofinality }`. Codomain: relating `ClosureRegime`.
 *
 * @example
 * ```ts
 * import { evaluateRunTerm, measurement } from "@emsenn/relating";
 *
 * const regime = evaluateRunTerm(measurement.classifyRegime, {
 *   kind: "settling.closureRegimeData",
 *   finiteBase: true,
 *   scottContinuous: true,
 *   countableCofinality: true,
 * });
 * // regime.kind === "ordinal.closure.regime.finite"
 * ```
 */
export const classifyRegimeTerm = tm.lam(
  tm.cond(
    tm.field("finiteBase", tm.var(0)),
    classifiedRegimeConst(true, true, true),
    tm.cond(
      tm.field("scottContinuous", tm.var(0)),
      classifiedRegimeConst(true, false, true),
      tm.cond(
        tm.field("countableCofinality", tm.var(0)),
        classifiedRegimeConst(false, false, true),
        classifiedRegimeConst(false, false, false),
      ),
    ),
  ),
);

/**
 * `cohomologyVanishesInRegime` — `RelMath.ClosureOrdinalRegime.cohomologyVanishes` as an IR cond-chain.
 * H¹ vanishes in strict/Scott regimes, is non-trivial in transfinite/aperiodic.
 *
 * @example
 * ```ts
 * import { evaluateRunTerm, measurement } from "@emsenn/relating";
 *
 * const vanishes = evaluateRunTerm(measurement.cohomologyVanishesInRegime, {
 *   kind: "ordinal.closure.regime.finite",
 * });
 * // vanishes === true
 * ```
 */
export const cohomologyVanishesInRegimeTerm = tm.lam(
  CLOSURE_REGIMES.reduceRight<Tm>(
    (elseBranch, regime) => tm.cond(
      tm.coincide(tm.field("kind", tm.var(0)), stringTerm(regime.kind)),
      tm.bool(cohomologyVanishesInRegime(regime)),
      elseBranch,
    ),
    tm.bool(false),
  ),
);
