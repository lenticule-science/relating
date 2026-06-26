/**
 * positing — value enters predication by evidence.
 *
 *   potential-transfinite-predication-cell --positing--> potential-scott-continuous-posit-cell
 *
 * Carries the bilattice charge vocabulary, the predication fiber algebra, the
 * `posit` morphism, the multiplicative linear logic at value entry, and the
 * posit presheaf settlement reads. Diataxis is exposed as a small read over the
 * same FOUR charge values. Charges are never admitted directly; they are
 * constructed from evidence over cells.
 */
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
} from "./bilattice-charge.mjs";
export type {
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
} from "./bilattice-charge.mjs";

export {
  memeSchema,
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
} from "./fiber.mjs";
export type {
  Meme,
  FiberAlgebra,
  Valuation,
  FiberCarrier,
  PositPresheafGenerators,
  OrderName,
  Order,
  PredicateFiberCell,
  PredicateFiberCellIdentityJudgment,
  PredicateFiber,
  GeneratorKind,
  FiberGenerator,
} from "./fiber.mjs";

export {
  commutate,
  presheaf,
  presheafFromValuation,
  sheafFromValuation,
} from "./settling/sheaf.mjs";
export type {
  PositPresheaf,
  PresheafTrace,
  SheafCarrier,
  CommutationCarrier,
} from "./settling/sheaf.mjs";

export {
  orderSwapValue,
  dihedral,
  dihedralElementNames,
  dihedralMul,
  dihedralFixedSet,
  dihedralOrderEffect,
  orderSwapIso,
  dihedralConjugation,
  dihedralSwapsOrders,
} from "./dihedral-gauge.mjs";
export type {
  DihedralElementName,
  DihedralOrderEffectName,
  OrderSwapIsoJudgment,
  DihedralConjugationJudgment,
  DihedralSwapsOrdersJudgment,
} from "./dihedral-gauge.mjs";

export {
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
  modalToCorner,
  cornerToModal,
  valuationFiberCornerOp,
  quartetRecurrenceReceipt,
} from "./valuation-fiber-algebra.mjs";
export type {
  ValuationFiberCornerName,
  ModalCornerName,
  ValuationFiberCarrier,
  CrossOrderNucleusFinding,
  ValuationFiberAlgebraReceipt,
  QuartetRecurrenceReceipt,
} from "./valuation-fiber-algebra.mjs";

export {
  modalKripkeFrame,
  possibilize,
  necessitate,
  closureOp,
  twistSplit,
  modalKripkeReceipt,
} from "./modal-kripke-four-valued.mjs";
export type {
  KripkeFrameClass,
  KripkeValuation,
  ModalKripkeFrame,
  TwistSplit,
  ModalKripkeReceipt,
} from "./modal-kripke-four-valued.mjs";

export {
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
} from "./closure-operator-fiber.mjs";
export type {
  ChargeClosureCarrier,
  ReindexMapCarrier,
  PointwiseClosureFamilyReceipt,
  CosettlingReceipt,
  ClosureMonadReceipt,
} from "./closure-operator-fiber.mjs";

export {
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
} from "./diataxis.mjs";
export type {
  DiataxisModeName,
  DiataxisMode,
  DiataxisDualityEdge,
  DiataxisReading,
} from "./diataxis.mjs";

export * as logic from "./logic/index.mjs";
export * as settling from "./settling/index.mjs";
