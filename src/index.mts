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
 * override them. Representation codecs, holography, the realize functor, and the
 * boundary serve/dispatch internals are reached
 * through their package subpaths (`/codecs`, `/holography`, `/typing`, `/acting`).
 */

import {
  articulateTerm,
  predicateTerm,
  positTerm,
  settleTerm,
  induceRelationTerm,
  relateRelationsTerm,
  coincideTerm,
} from "./holography/expressing/evaluating/descending/index.mjs";
import { countTerm, natZeroTerm, successorTerm } from "./holography/expressing/evaluating/counting/index.mjs";
import { freeTerm } from "./holography/expressing/evaluating/settling/index.mjs";
import { classifyRegimeTerm, cohomologyVanishesInRegimeTerm } from "./holography/expressing/evaluating/measuring/index.mjs";
import {
  intentOfExtentTerm,
  extentOfIntentTerm,
  closeExtentTerm,
  isConceptPairTerm,
  formalConceptTerm,
} from "./holography/expressing/evaluating/connecting/index.mjs";
import {
  chuDualTerm,
  chuLookupTerm,
  chuDualInvolutionTerm,
} from "./holography/expressing/evaluating/pairing/index.mjs";
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
} from "./holography/expressing/evaluating/reading/index.mjs";

// ── articulating: the base object surface ──
export {
  Mark,
  Token,
  Claim,
  mark,
  token,
  claim,
  utterance,
  articulate,
  tokenIdentity,
  claimIdentity,
  isArticulationCell,
  coincides,
} from "./articulating/index.mjs";
export type {
  UtteranceCarrier,
  TokenArticulationSlot,
  ClaimArticulationSlot,
  AperiodicArticulationPairing,
  AperiodicArticulationCell,
  PotentialAperiodicArticulationCell,
  ArticulationCell,
  MarkCoincidenceWitness,
  MarkCoincidenceObstruction,
  TokenIdentityJudgment,
  ClaimIdentityJudgment,
} from "./articulating/index.mjs";

// ── predicating: the predication category over the articulation base ──
export {
  Predicate,
  predicate,
  predicateOfClaim,
  cell,
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
} from "./articulating/predicating/index.mjs";
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
} from "./articulating/predicating/index.mjs";

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
  isTop,
  isBottom,
  knowledgeLeq,
  truthLeq,
  gauge,
  gaugeElementNames,
  fixedSet,
  firingPatternSelfDuality,
  chargeValueIdentity,
  chargeFiniteAlgebra,
  memeCarrier,
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
  dihedralConjugation,
  dihedralSwapsOrders,
} from "./articulating/predicating/positing/index.mjs";
export type {
  DihedralElementName,
  DihedralOrderEffectName,
  OrderSwapIsoJudgment,
  DihedralConjugationJudgment,
  DihedralSwapsOrdersJudgment,
  ChargeSideName,
  ChargeSide,
  ChargeValueName,
  ChargeCoordinates,
  ChargeValue,
  ChargeCarrier,
  ChargeFiniteAlgebraCarrier,
  ChargePair,
  GaugeElementName,
  FiringPatternSelfDualityJudgment,
  ChargeValueIdentityJudgment,
  OrderLeqJudgment,
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
  PositPresheaf,
  PositPresheafGenerators,
  PresheafTrace,
  SheafCarrier,
  CommutationCarrier,
} from "./articulating/predicating/positing/index.mjs";

// ── settling: the settlement filtration, its readers, sections, and analysis ──
export * from "./articulating/predicating/positing/settling/index.mjs";

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
  type Invocation,
} from "./holography/acting/index.mjs";

export { actions } from "./actions.mjs";

export {
  carrier,
  schemaCarrier,
  registeredCategory,
  actionIrAudit,
  freeTsActions,
  morphismCarrier,
  morphismSchemaCarrier,
  type Carrier,
  type CarrierId,
  type MorphismCarrier,
  type ActionIrAuditEntry,
} from "./typing/index.mjs";

// ── expressing: Relation Model Notation (RMN) — the CHL term calculus as JSON IR ──
export {
  TySchema,
  TmSchema,
  tyCarrier,
  tmCarrier,
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
} from "./holography/expressing/notating/index.mjs";
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
} from "./holography/expressing/evaluating/index.mjs";

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
} from "./holography/expressing/projecting/index.mjs";

// ── the JSON codec helpers downstream packages admit their own data through ──
export {
  canonical,
  requireJsonValue,
  jsonResource,
  parse as parseJson,
  type JsonValue,
  type JsonRecord,
} from "./codecs/json.mjs";
