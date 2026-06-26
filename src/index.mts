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
  utterance,
  articulate,
  tokenIdentity,
  claimIdentity,
  isArticulationCell,
  coincides,
} from "../lib/articulating/index.mjs";
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
} from "../lib/articulating/index.mjs";

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
  gaugeElementNames,
  fixedSet,
  firingPatternSelfDuality,
  chargeValueIdentity,
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
  DihedralConjugationJudgment,
  DihedralSwapsOrdersJudgment,
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
