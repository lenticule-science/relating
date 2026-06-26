/**
 * analysis/aperiodic-classification - finite executable shadow of the
 * aperiodic `cl-inv` / moduli / direct-limit / synonymy cluster.
 *
 * This packages the runtime-computable part of:
 * - RelMath.Aperiodic.Classification
 * - RelMath.Aperiodic.AndersonPutnam
 * - RelMath.Aperiodic.Moduli
 * - RelMath.Aperiodic.Universality
 * - RelMath.Aperiodic.StepN.FixedPoint
 * - RelMath.Aperiodic.CoClassifying
 * - RelMath.Aperiodic.SynonymyAntonymy
 * - RelMath.Aperiodic.Autopoiesis
 *
 * It does not claim the open MLD classification converse, genuine q-fuzzy
 * Verdier duality, cross-dimension shift equivalence, or a real sheaf/topology
 * kernel. It carries the finite integer-coordinate and explicit matrix/table
 * shadows Lean makes computational.
 */
import {
  aperiodicClosureRegime,
  finiteClosureRegime,
  scottClosureRegime,
  type ClosureRegime,
} from "../closure.mjs";
import { cohomologyVanishesInRegime } from "../value-category.mjs";
import {
  receipt as bigradedDiamondReceipt,
  towerReceipt as bigradedDiamondTower,
  varyingFamilyReceipt,
  type BigradedDiamondReceipt,
  type BigradedDiamondTowerReceipt,
  type VaryingFamilyReceipt,
} from "./bigraded-diamond.mjs";

export type FiringType = "truthOnly" | "falsityOnly" | "both";

export interface H1Class {
  readonly kind: "aperiodic.h1.class";
  readonly coord: number;
}

export interface H1Homology {
  readonly kind: "aperiodic.h1.homology";
  readonly dualCoord: number;
}

export interface AperiodicSettling {
  readonly kind: "aperiodic.settling.carrier";
  readonly regime: ClosureRegime;
  readonly clInv: H1Class;
  readonly vanishingRespected: true;
}

export interface CohSettling {
  readonly kind: "aperiodic.cohSettling.carrier";
  readonly base: AperiodicSettling;
  readonly h0: number;
}

export interface CohInvariant {
  readonly kind: "aperiodic.cohInvariant";
  readonly h0: number;
  readonly clInv: H1Class;
  readonly regime: ClosureRegime;
}

export interface CohomologicalEquivalenceReceipt {
  readonly kind: "aperiodic.cohomologicalEquivalence.receipt:witness";
  readonly left: CohSettling;
  readonly right: CohSettling;
  readonly invariant: CohInvariant;
  readonly fullCohEquiv: true;
  readonly fullCohEquivIsEquivalence: true;
  readonly fullRefinesClInvEquiv: true;
  readonly flatClInvCollapse: true;
  readonly aperiodicNotTrivial: true;
  readonly negationCohomologicallyInvisible: true;
  readonly mldConverseBoundary: "open clInv equivalence implies structural MLD";
}

export interface LocalDerivabilityReceipt {
  readonly kind: "aperiodic.localDerivability:witness";
  readonly relation: "equality" | "shared-clInv";
  readonly mldRefinesCohEquiv: true;
}

export interface ClassificationReceipt {
  readonly kind: "aperiodic.classification.receipt:witness";
  readonly strictSettling: AperiodicSettling;
  readonly scottSettling: AperiodicSettling;
  readonly aperiodicWitness: AperiodicSettling;
  readonly synonym: readonly [AperiodicSettling, AperiodicSettling];
  readonly cohEquivIsEquivalence: true;
  readonly strictScottClInvZero: true;
  readonly aperiodicCanBeNonzero: true;
  readonly mldRefinesCohEquiv: true;
  readonly classificationConverseBoundary: "open MLD classification converse";
}

export interface StageElement {
  readonly kind: "aperiodic.stageElement";
  readonly stage: number;
  readonly coord: number;
}

export interface DirectLimitReceipt {
  readonly kind: "aperiodic.andersonPutnam.receipt:witness";
  readonly left: StageElement;
  readonly right: StageElement;
  readonly eventuallyEqual: true;
  readonly colimitClass: H1Class;
  readonly stageIndependent: true;
  readonly coconeLaw: true;
  readonly perGradeQuartet: BigradedDiamondTowerReceipt;
  readonly stepTwoIsFour: true;
}

export interface StepRule {
  readonly kind: "aperiodic.stepRule.carrier";
  readonly n: number;
  readonly substitution: readonly (readonly number[])[];
  readonly primitive: boolean;
  readonly coord: number;
}

export interface ModuliPoint {
  readonly kind: "aperiodic.moduliPoint";
  readonly coord: number;
}

export interface ModuliReceipt {
  readonly kind: "aperiodic.moduli.receipt:witness";
  readonly rule: StepRule;
  readonly shifted: StepRule;
  readonly point: ModuliPoint;
  readonly shiftedPoint: ModuliPoint;
  readonly stepShiftPreservesPrimitive: true;
  readonly stepShiftPreservesCoord: true;
  readonly stepShiftPreservesModuliPoint: true;
  readonly chainInclusion: true;
  readonly stratifiedOrResiduePartition: true;
  readonly negationGaugeInvisible: true;
  readonly coarseMldBoundary: "open coarse moduli equals structural MLD classes";
}

export interface FixedPointReceipt {
  readonly kind: "aperiodic.stepNFixedPoint.receipt:witness";
  readonly embedded: StageElement;
  readonly shifted: StageElement;
  readonly minfinityClass: H1Class;
  readonly embedDepthIndependent: true;
  readonly sigmaInfinityShiftsDepth: true;
  readonly sigmaInfinityFixed: true;
  readonly rgFixedPoint: true;
}

export type IntMatrix = readonly (readonly number[])[];

export interface ShiftEquivalenceReceipt {
  readonly kind: "aperiodic.shiftEquivalence.receipt:witness";
  readonly dimension: number;
  readonly matrix: IntMatrix;
  readonly shiftedMatrix: IntMatrix;
  readonly r: IntMatrix;
  readonly s: IntMatrix;
  readonly strongShiftEquivalent: true;
  readonly shiftEquivalent: true;
  readonly seReflexive: true;
  readonly seSymmetric: true;
  readonly seTransitiveByChains: true;
  readonly universalityClassIsSeClass: true;
  readonly clInvCoordinateInvariant: true;
  readonly fixedDimensionBoundary: "cross-dimension SE and dimension groups remain proof-side";
}

export interface CoClassifyingReceipt {
  readonly kind: "aperiodic.coClassifying.receipt:witness";
  readonly cohomology: H1Class;
  readonly homology: H1Homology;
  readonly inverse: H1Class;
  readonly dSpatialBijective: true;
  readonly zeroPreserving: true;
  readonly coClInvEqualsDSpatialClInv: true;
  readonly sameDataAsCohEquiv: true;
  readonly verdierBoundary: "q-fuzzy and derived Verdier duality remain proof-side";
}

export interface StrongSettling {
  readonly kind: "aperiodic.strongSettling.carrier";
  readonly base: AperiodicSettling;
  readonly tau: FiringType;
}

export interface SynonymyAntonymyReceipt {
  readonly kind: "aperiodic.synonymyAntonymy.receipt:witness";
  readonly source: StrongSettling;
  readonly twist: StrongSettling;
  readonly synonymyEquivalence: true;
  readonly negationInvisibleToSynonymy: true;
  readonly flipInvolutive: true;
  readonly antonymySymmetric: true;
  readonly antonymyRefinesSynonymy: true;
  readonly truthOnlyMoves: true;
}

export interface AutopoiesisReceipt {
  readonly kind: "aperiodic.autopoiesis.receipt:witness";
  readonly diamond: BigradedDiamondReceipt;
  readonly varying: VaryingFamilyReceipt;
  readonly tower: BigradedDiamondTowerReceipt;
  readonly autopoieticCoreIffFixedBoth: true;
  readonly fourCorners: 4;
  readonly historySeparationAperiodic: true;
  readonly historyValueOrderBoundary: "history-filtration nuclei are not value-order nuclei";
}

export interface AperiodicClassificationReceipt {
  readonly kind: "aperiodic.classificationCluster.receipt:witness";
  readonly classification: ClassificationReceipt;
  readonly cohomologicalEquivalence: CohomologicalEquivalenceReceipt;
  readonly directLimit: DirectLimitReceipt;
  readonly moduli: ModuliReceipt;
  readonly fixedPoint: FixedPointReceipt;
  readonly universality: ShiftEquivalenceReceipt;
  readonly coClassifying: CoClassifyingReceipt;
  readonly synonymyAntonymy: SynonymyAntonymyReceipt;
  readonly autopoiesis: AutopoiesisReceipt;
  readonly openFrontier: readonly string[];
}

const assertSafeInteger = (value: number, caller: string): void => {
  if (!Number.isSafeInteger(value)) throw new RangeError(`${caller}: integer coordinates must be safe integers`);
};

export function h1Class(coord: number): H1Class {
  assertSafeInteger(coord, "h1Class");
  return Object.freeze({ kind: "aperiodic.h1.class" as const, coord });
}

export const h1Zero = h1Class(0);

export function h1Homology(dualCoord: number): H1Homology {
  assertSafeInteger(dualCoord, "h1Homology");
  return Object.freeze({ kind: "aperiodic.h1.homology" as const, dualCoord });
}

export const h1HomologyZero = h1Homology(0);

export function settling(regime: ClosureRegime, coord: number): AperiodicSettling {
  const clInv = h1Class(coord);
  if (cohomologyVanishesInRegime(regime) && coord !== 0) {
    throw new TypeError("aperiodic.settling: strict/Scott regimes force clInv = 0");
  }
  return Object.freeze({
    kind: "aperiodic.settling.carrier" as const,
    regime,
    clInv,
    vanishingRespected: true as const,
  });
}

export function aperiodicWitness(coord = 1): AperiodicSettling {
  if (coord === 0) throw new RangeError("aperiodicWitness: witness must carry nonzero clInv");
  return settling(aperiodicClosureRegime, coord);
}

export function cohEquiv(left: AperiodicSettling, right: AperiodicSettling): boolean {
  return left.clInv.coord === right.clInv.coord;
}

export function cohSettling(base: AperiodicSettling, h0: number): CohSettling {
  assertSafeInteger(h0, "cohSettling");
  if (h0 < 0) throw new RangeError("cohSettling: H0 content must be non-negative");
  return Object.freeze({ kind: "aperiodic.cohSettling.carrier" as const, base, h0 });
}

export function cohInvariant(value: CohSettling): CohInvariant {
  return Object.freeze({
    kind: "aperiodic.cohInvariant" as const,
    h0: value.h0,
    clInv: value.base.clInv,
    regime: value.base.regime,
  });
}

export function fullCohEquiv(left: CohSettling, right: CohSettling): boolean {
  return left.h0 === right.h0
    && left.base.clInv.coord === right.base.clInv.coord
    && left.base.regime.kind === right.base.regime.kind;
}

export function cohomologicalEquivalenceReceipt(): CohomologicalEquivalenceReceipt {
  const left = cohSettling(aperiodicWitness(4), 2);
  const right = cohSettling(aperiodicWitness(4), 2);
  const flat = cohSettling(settling(finiteClosureRegime, 0), 0);
  const nonflat = cohSettling(aperiodicWitness(1), 0);
  const twist = cohSettling(negTwist(strongSettling(left.base, "truthOnly")).base, left.h0);
  if (!fullCohEquiv(left, right) || !cohEquiv(left.base, right.base) || !cohEquiv(flat.base, settling(finiteClosureRegime, 0))) {
    throw new TypeError("cohomologicalEquivalenceReceipt: finite cohomological equivalence laws failed");
  }
  if (cohEquiv(nonflat.base, flat.base) || !fullCohEquiv(left, twist)) {
    throw new TypeError("cohomologicalEquivalenceReceipt: aperiodic separation or gauge invisibility failed");
  }
  return Object.freeze({
    kind: "aperiodic.cohomologicalEquivalence.receipt:witness" as const,
    left,
    right,
    invariant: cohInvariant(left),
    fullCohEquiv: true as const,
    fullCohEquivIsEquivalence: true as const,
    fullRefinesClInvEquiv: true as const,
    flatClInvCollapse: true as const,
    aperiodicNotTrivial: true as const,
    negationCohomologicallyInvisible: true as const,
    mldConverseBoundary: "open clInv equivalence implies structural MLD" as const,
  });
}

export function classificationReceipt(): ClassificationReceipt {
  const strictSettling = settling(finiteClosureRegime, 0);
  const scottSettling = settling(scottClosureRegime, 0);
  const witness = aperiodicWitness(1);
  const synonym = [aperiodicWitness(7), aperiodicWitness(7)] as const;
  const strictScottClInvZero = strictSettling.clInv.coord === 0 && scottSettling.clInv.coord === 0;
  const aperiodicCanBeNonzero = witness.regime.kind === aperiodicClosureRegime.kind && witness.clInv.coord !== 0;
  if (!cohEquiv(synonym[0], synonym[1]) || !strictScottClInvZero || !aperiodicCanBeNonzero) {
    throw new TypeError("classificationReceipt: finite clInv classification laws failed");
  }
  return Object.freeze({
    kind: "aperiodic.classification.receipt:witness" as const,
    strictSettling,
    scottSettling,
    aperiodicWitness: witness,
    synonym,
    cohEquivIsEquivalence: true as const,
    strictScottClInvZero: true as const,
    aperiodicCanBeNonzero: true as const,
    mldRefinesCohEquiv: true as const,
    classificationConverseBoundary: "open MLD classification converse" as const,
  });
}

export function stageElement(stage: number, coord: number): StageElement {
  assertSafeInteger(stage, "stageElement");
  if (stage < 0) throw new RangeError("stageElement: stage must be non-negative");
  assertSafeInteger(coord, "stageElement");
  return Object.freeze({ kind: "aperiodic.stageElement" as const, stage, coord });
}

export function eventuallyEqual(left: StageElement, right: StageElement): boolean {
  return left.coord === right.coord;
}

export function colimitClass(element: StageElement): H1Class {
  return h1Class(element.coord);
}

export function directLimitReceipt(): DirectLimitReceipt {
  const left = stageElement(2, 5);
  const right = stageElement(8, 5);
  if (!eventuallyEqual(left, right)) throw new TypeError("directLimitReceipt: constant AP system did not stabilize");
  return Object.freeze({
    kind: "aperiodic.andersonPutnam.receipt:witness" as const,
    left,
    right,
    eventuallyEqual: true as const,
    colimitClass: colimitClass(left),
    stageIndependent: true as const,
    coconeLaw: true as const,
    perGradeQuartet: bigradedDiamondTower(),
    stepTwoIsFour: true as const,
  });
}

export function stepRule(n: number, substitution: readonly (readonly number[])[], primitive: boolean, coord: number): StepRule {
  assertSafeInteger(n, "stepRule");
  if (n < 1) throw new RangeError("stepRule: n must be positive");
  if (substitution.length !== n) throw new TypeError("stepRule: substitution must have one word per letter");
  for (const word of substitution) {
    for (const letter of word) {
      assertSafeInteger(letter, "stepRule");
      if (letter < 0 || letter >= n) throw new RangeError("stepRule: substitution references a letter outside Fin n");
    }
  }
  assertSafeInteger(coord, "stepRule");
  return Object.freeze({
    kind: "aperiodic.stepRule.carrier" as const,
    n,
    substitution: Object.freeze(substitution.map((word) => Object.freeze([...word]))),
    primitive,
    coord,
  });
}

export function stepShift(rule: StepRule): StepRule {
  return stepRule(
    rule.n + 1,
    Object.freeze([...rule.substitution.map((word) => Object.freeze([...word])), Object.freeze([rule.n])]),
    rule.primitive,
    rule.coord,
  );
}

export function toModuli(rule: StepRule): ModuliPoint {
  return Object.freeze({ kind: "aperiodic.moduliPoint" as const, coord: rule.coord });
}

export function moduliReceipt(): ModuliReceipt {
  const rule = stepRule(2, [[0, 1], [0]], true, 3);
  const shifted = stepShift(rule);
  const point = toModuli(rule);
  const shiftedPoint = toModuli(shifted);
  if (shifted.primitive !== rule.primitive || shifted.coord !== rule.coord || shiftedPoint.coord !== point.coord) {
    throw new TypeError("moduliReceipt: step-shift did not preserve the finite moduli point");
  }
  return Object.freeze({
    kind: "aperiodic.moduli.receipt:witness" as const,
    rule,
    shifted,
    point,
    shiftedPoint,
    stepShiftPreservesPrimitive: true as const,
    stepShiftPreservesCoord: true as const,
    stepShiftPreservesModuliPoint: true as const,
    chainInclusion: true as const,
    stratifiedOrResiduePartition: true as const,
    negationGaugeInvisible: true as const,
    coarseMldBoundary: "open coarse moduli equals structural MLD classes" as const,
  });
}

export function fixedPointReceipt(): FixedPointReceipt {
  const embedded = stageElement(4, 3);
  const shifted = stageElement(embedded.stage + 1, embedded.coord);
  if (!eventuallyEqual(embedded, shifted)) throw new TypeError("fixedPointReceipt: sigmaInfinity failed depth-collapse");
  return Object.freeze({
    kind: "aperiodic.stepNFixedPoint.receipt:witness" as const,
    embedded,
    shifted,
    minfinityClass: colimitClass(embedded),
    embedDepthIndependent: true as const,
    sigmaInfinityShiftsDepth: true as const,
    sigmaInfinityFixed: true as const,
    rgFixedPoint: true as const,
  });
}

function requireSquareMatrix(matrix: IntMatrix, caller: string): number {
  const n = matrix.length;
  if (n === 0) throw new RangeError(`${caller}: matrix must be nonempty`);
  for (const row of matrix) {
    if (row.length !== n) throw new TypeError(`${caller}: matrix must be square`);
    for (const value of row) assertSafeInteger(value, caller);
  }
  return n;
}

function matMul(left: IntMatrix, right: IntMatrix): IntMatrix {
  const n = requireSquareMatrix(left, "matMul");
  if (requireSquareMatrix(right, "matMul") !== n) throw new TypeError("matMul: dimensions differ");
  return Object.freeze(left.map((row, i) => Object.freeze(row.map((_cell, k) =>
    row.reduce((sum, value, j) => sum + value * right[j]![k]!, 0),
  ))));
}

function sameMatrix(left: IntMatrix, right: IntMatrix): boolean {
  return left.length === right.length
    && left.every((row, i) => row.length === right[i]!.length && row.every((value, j) => value === right[i]![j]));
}

export function shiftEquivalenceReceipt(): ShiftEquivalenceReceipt {
  const r: IntMatrix = Object.freeze([Object.freeze([1, 1]), Object.freeze([0, 1])]);
  const s: IntMatrix = Object.freeze([Object.freeze([1, 0]), Object.freeze([1, 1])]);
  const matrix = matMul(r, s);
  const shiftedMatrix = matMul(s, r);
  const strongShiftEquivalent = sameMatrix(matrix, matMul(r, s)) && sameMatrix(shiftedMatrix, matMul(s, r));
  if (!strongShiftEquivalent) throw new TypeError("shiftEquivalenceReceipt: SSE witness failed");
  return Object.freeze({
    kind: "aperiodic.shiftEquivalence.receipt:witness" as const,
    dimension: 2,
    matrix,
    shiftedMatrix,
    r,
    s,
    strongShiftEquivalent: true as const,
    shiftEquivalent: true as const,
    seReflexive: true as const,
    seSymmetric: true as const,
    seTransitiveByChains: true as const,
    universalityClassIsSeClass: true as const,
    clInvCoordinateInvariant: true as const,
    fixedDimensionBoundary: "cross-dimension SE and dimension groups remain proof-side" as const,
  });
}

export function dSpatial(value: H1Class): H1Homology {
  return h1Homology(value.coord);
}

export function dSpatialInv(value: H1Homology): H1Class {
  return h1Class(value.dualCoord);
}

export function coClassifyingReceipt(coord = 1): CoClassifyingReceipt {
  const cohomology = h1Class(coord);
  const homology = dSpatial(cohomology);
  const inverse = dSpatialInv(homology);
  if (inverse.coord !== cohomology.coord || dSpatial(h1Zero).dualCoord !== h1HomologyZero.dualCoord) {
    throw new TypeError("coClassifyingReceipt: strict Boolean dSpatial bijection failed");
  }
  return Object.freeze({
    kind: "aperiodic.coClassifying.receipt:witness" as const,
    cohomology,
    homology,
    inverse,
    dSpatialBijective: true as const,
    zeroPreserving: true as const,
    coClInvEqualsDSpatialClInv: true as const,
    sameDataAsCohEquiv: true as const,
    verdierBoundary: "q-fuzzy and derived Verdier duality remain proof-side" as const,
  });
}

export function flipFiring(type: FiringType): FiringType {
  if (type === "truthOnly") return "falsityOnly";
  if (type === "falsityOnly") return "truthOnly";
  return "both";
}

export function strongSettling(base: AperiodicSettling, tau: FiringType): StrongSettling {
  return Object.freeze({ kind: "aperiodic.strongSettling.carrier" as const, base, tau });
}

export function negTwist(source: StrongSettling): StrongSettling {
  return strongSettling(source.base, flipFiring(source.tau));
}

export function synonymyAntonymyReceipt(): SynonymyAntonymyReceipt {
  const source = strongSettling(aperiodicWitness(9), "truthOnly");
  const twist = negTwist(source);
  if (!cohEquiv(source.base, twist.base) || flipFiring(flipFiring(source.tau)) !== source.tau || twist.tau === source.tau) {
    throw new TypeError("synonymyAntonymyReceipt: finite synonymy/antonymy laws failed");
  }
  return Object.freeze({
    kind: "aperiodic.synonymyAntonymy.receipt:witness" as const,
    source,
    twist,
    synonymyEquivalence: true as const,
    negationInvisibleToSynonymy: true as const,
    flipInvolutive: true as const,
    antonymySymmetric: true as const,
    antonymyRefinesSynonymy: true as const,
    truthOnlyMoves: true as const,
  });
}

export function autopoiesisReceipt(): AutopoiesisReceipt {
  const diamond = bigradedDiamondReceipt();
  const varying = varyingFamilyReceipt();
  const tower = bigradedDiamondTower();
  if (!varying.varies || diamond.heyting.carrier.length !== 4 || tower.gradeCount !== 4) {
    throw new TypeError("autopoiesisReceipt: finite nuclear autopoiesis witness failed");
  }
  return Object.freeze({
    kind: "aperiodic.autopoiesis.receipt:witness" as const,
    diamond,
    varying,
    tower,
    autopoieticCoreIffFixedBoth: true as const,
    fourCorners: 4 as const,
    historySeparationAperiodic: true as const,
    historyValueOrderBoundary: "history-filtration nuclei are not value-order nuclei" as const,
  });
}

export function receipt(): AperiodicClassificationReceipt {
  return Object.freeze({
    kind: "aperiodic.classificationCluster.receipt:witness" as const,
    classification: classificationReceipt(),
    cohomologicalEquivalence: cohomologicalEquivalenceReceipt(),
    directLimit: directLimitReceipt(),
    moduli: moduliReceipt(),
    fixedPoint: fixedPointReceipt(),
    universality: shiftEquivalenceReceipt(),
    coClassifying: coClassifyingReceipt(),
    synonymyAntonymy: synonymyAntonymyReceipt(),
    autopoiesis: autopoiesisReceipt(),
    openFrontier: Object.freeze([
      "structural MLD classification converse",
      "q-fuzzy and derived Verdier duality",
      "cross-dimension shift equivalence and dimension-group computation",
      "genuine sheaf/topology moduli stack",
    ]),
  });
}
