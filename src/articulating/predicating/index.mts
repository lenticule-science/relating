/**
 * articulating/predicating — Fregean predication inside articulation.
 *
 * The research-chain morphism is:
 *
 * potential-aperiodic-articulation-cell
 *   --predicating-->
 * potential-transfinite-predication-cell
 *
 * This surface is currently a categorical barrel over the existing
 * implementation while files migrate into the nested layout.
 */
export {
  Predicate,
  predicate,
  entitySet,
  predicateSet,
  cell,
  cellSet,
  generatedPredicationCellSet,
  isCell,
  predicateOfClaim,
  materializePredicationCategory,
  specializationMorphism,
  isSpecializationMorphism,
  predicationCarrier,
  predicationTermIdentity,
  predicationPredicateIdentity,
  cellIdentity,
  predicationNodeIdentity,
  predicationBaseObjectIdentity,
  cohere,
  closeSpecialization,
  unrelatedPairs,
} from "../../algebra/predication.mjs";
export type {
  PredicationTerm,
  PredicationPredicate,
  EntitySet,
  PredicateSet,
  Cell,
  CellSet,
  GeneratedPredicationCellSet,
  PredicationNode,
  PredicationBaseObject,
  Edge,
  SpecializationMorphism,
  BaseCategory,
  PredicationCarrier,
  TransfinitePredicationCategory,
  PredicationFiberFunctorCarrier,
  PredicationDatum,
  PredicationTermIdentityWitness,
  PredicationTermIdentityObstruction,
  PredicationTermIdentityJudgment,
  PredicationPredicateIdentityWitness,
  PredicationPredicateIdentityObstruction,
  PredicationPredicateIdentityJudgment,
  CellIdentityWitness,
  CellIdentityObstruction,
  CellIdentityJudgment,
  PredicationNodeIdentityWitness,
  PredicationNodeIdentityObstruction,
  PredicationNodeIdentityJudgment,
  PredicationBaseObjectIdentityWitness,
  PredicationBaseObjectIdentityObstruction,
  PredicationBaseObjectIdentityJudgment,
  CoherenceCarrier,
  UnrelatedPairsCarrier,
} from "../../algebra/predication.mjs";

export * as geometry from "./geometry/index.mjs";
export * as positing from "./positing/index.mjs";
export * as typedTheory from "./typed-theory/index.mjs";
