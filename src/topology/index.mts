/**
 * ../topology/index.mjs — curated app surface.
 *
 * Evidence enters by articulating utterances — that is the only admission.
 * `induce`/`extend` fold an utterance log through the descent
 * (articulate → predicate → posit → settle) into a frozen MemeTopologyCarrier,
 * and the section reads render any of the four fixed-point sections.
 * Predicating opens the transfinite predication carrier from the potential
 * articulation cell; subject-predicate-object cells, charges, edges, sections,
 * and contradictions are derived downstream. There is no verb that admits a
 * charge, a polarity, or a denial. The underlying mathematics lives in
 * ../algebra/index.mjs, ../logic/index.mjs, `./dynamics`, and `./arithmetic`;
 * anything under `./internal`
 * is the engine, not the contract.
 */

// ---------- articulation ----------
export { mark, token, claim, utterance, articulate, isArticulationCarrier, tokenIdentity, claimIdentity } from "../algebra/index.mjs";
export type {
  Mark,
  Token,
  Claim,
  UtteranceCarrier,
  ArticulationCarrier,
  TokenIdentityWitness,
  TokenIdentityObstruction,
  TokenIdentityJudgment,
  ClaimIdentityWitness,
  ClaimIdentityObstruction,
  ClaimIdentityJudgment,
} from "../algebra/index.mjs";
export {
  cell,
  predicate,
  predicateOfClaim,
  materializePredicationCategory,
  specializationMorphism,
  predicationCarrier,
  cohere,
  closeSpecialization,
  unrelatedPairs,
  cellIdentity,
  predicationTermIdentity,
  predicationPredicateIdentity,
} from "../algebra/index.mjs";
export type {
  Cell,
  SpecializationMorphism,
  PredicationCarrier,
  TransfinitePredicationCategory,
  PredicationDatum,
  PredicationTerm,
  PredicationPredicate,
  CoherenceCarrier,
  Edge,
  UnrelatedPairsCarrier,
  CellIdentityWitness,
  CellIdentityObstruction,
  CellIdentityJudgment,
  PredicationTermIdentityWitness,
  PredicationTermIdentityObstruction,
  PredicationTermIdentityJudgment,
  PredicationPredicateIdentityWitness,
  PredicationPredicateIdentityObstruction,
  PredicationPredicateIdentityJudgment,
} from "../algebra/index.mjs";

// ---------- relational carriers ----------
export {
  charge,
  dual,
  entitySet,
  predicateSet,
  relation,
  relationRead,
  settlePointProfile,
  transpose,
} from "../algebra/index.mjs";
export type {
  RelationCarrier,
  RelationReadJudgment,
  EntitySet,
  PredicateSet,
} from "../algebra/index.mjs";

// ---------- admission ----------
export type { OrderName } from "./predication-fiber.mjs";
export { normalizeUtterance } from "./meme-topology.mjs";
export type { PredicateInput, SubjectInput } from "./meme-topology.mjs";

// ---------- settling ----------
export {
  induce,
  extend,
  sameMemeTopology,
  singleUtteranceTopology,
  settleOneTraced,
  knowledgeLeastMemeOfSingleUtterance,
} from "./meme-topology.mjs";
export type { MemeTopologyCarrier, SingleUtteranceInput, SingleSettlingCarrier } from "./meme-topology.mjs";
export { classifySettling } from "./predication-settling.mjs";
export type { SettlingClassification } from "./predication-settling.mjs";

// ---------- construction pipeline ----------
export { posit } from "./predication-fiber.mjs";
export { presheaf, presheafFromValuation, sheafFromValuation, commutate } from "./predication-valuation-sheaf.mjs";
export type { PresheafCarrier, SheafCarrier, CommutationCarrier } from "./predication-valuation-sheaf.mjs";
export {
  fixedPoints,
  knowledgeLeastFixedPoint,
  knowledgeGreatestFixedPoint,
  truthLeastFixedPoint,
  truthGreatestFixedPoint,
  fixedPointOrderName,
  fixedPointBoundName,
  fixedPointKnowledgeGap,
  fixedPointTruthGap,
} from "./predication-valuation-fixed-point.mjs";
export type {
  BoundName,
  FixedPointCarrier,
  FixedPointJudgment,
  FixedPointWitness,
  FixedPointObstruction,
  FixedPointExtremum,
  FixedPointOrderCarrier,
  FixedPointOrderObject,
  FixedPointBoundObject,
  FixedPointSeedCarrier,
} from "./predication-valuation-fixed-point.mjs";
export type { FixedPointGapCarrier } from "./predication-valuation-fixed-point-gap.mjs";

// ---------- reading ----------
export { readCharge } from "./meme-topology-fixed-point-reading.mjs";
export type {
  MemeTopologyFixedPointReading,
  MemeTopologyFixedPointReadings,
  MemeTopologyInformation,
  MemeTopologyInformationEntry,
  MemeTopologyInformationEntriesCarrier,
} from "./meme-topology-fixed-point-reading.mjs";
export type { PredicationValuationConsistencyCarrier } from "./predication-valuation-consistency.mjs";

// ---------- section layer ----------
export {
  sectionOf,
  predicationsFor,
  subjectsFor,
  chargeAtValues,
  partitionSection,
  topologyVitals,
} from "./meme-topology-section.mjs";
export type { SectionCarrier, SectionEntry, SectionPartitionCarrier, TopologyVitalsCarrier } from "./meme-topology-section.mjs";

// ---------- cohomology ----------
// Pure readers: the first cohomology of a predication complex is *derived* from
// the cells (cycle rank = cells − entities + components), never admitted — the
// same standing as every other section read.
export { cohomologyOfValuation, cohomology, cohomologyOfCells, rankVanishing } from "./predication-cohomology.mjs";
export type {
  CohomologyCarrier,
  ZeroCoboundaryMatrixCarrier,
  ZeroCohomologyCarrier,
  FirstCohomologyCarrier,
  RankVanishingWitness,
  RankVanishingObstruction,
  RankVanishingJudgment,
} from "./predication-cohomology.mjs";

// ---------- charge value boundary ----------
export {
  chargeValue,
  chargeValues,
  chargeValueName,
  asChargeValueName,
  asChargeValue,
  valueOf,
  chargeValueIdentity,
  joinKnowledgeValue,
  meetKnowledgeValue,
  joinTruthValue,
  meetTruthValue,
  negateValue,
  conflateValue,
} from "../algebra/index.mjs";
export type {
  ChargeValueName,
  ChargeValue,
  ChargeCarrier,
  ChargeSide,
  ChargeSideName,
  ChargeCoordinates,
  ChargeValueIdentityWitness,
  ChargeValueIdentityObstruction,
  ChargeValueIdentityJudgment,
} from "../algebra/index.mjs";

// ---------- exact number carriers ----------
export type { Natural, Integer, Rational } from "../algebra/index.mjs";

// ---------- utterance-log persistence ----------
