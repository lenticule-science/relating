import { aperiodicClassification, evaluateRunTerm } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

const receipt = analysis.aperiodicClassification.receipt();
const normalized = evaluateRunTerm(aperiodicClassification.receipt, receipt);

console.log(JSON.stringify({
  product: "relating.aperiodic-classification",
  classification: {
    strictCoord: normalized.classification.strictSettling.clInv.coord,
    aperiodicCoord: normalized.classification.aperiodicWitness.clInv.coord,
    converseBoundary: normalized.classification.classificationConverseBoundary,
  },
  cohomologicalEquivalence: {
    h0: normalized.cohomologicalEquivalence.invariant.h0,
    coord: normalized.cohomologicalEquivalence.invariant.clInv.coord,
    gaugeInvisible: normalized.cohomologicalEquivalence.negationCohomologicallyInvisible,
  },
  directLimit: {
    leftStage: normalized.directLimit.left.stage,
    rightStage: normalized.directLimit.right.stage,
    colimitCoord: normalized.directLimit.colimitClass.coord,
  },
  moduli: {
    n: normalized.moduli.rule.n,
    shiftedN: normalized.moduli.shifted.n,
    coord: normalized.moduli.point.coord,
  },
  fixedPoint: {
    shiftedStage: normalized.fixedPoint.shifted.stage,
    rgFixedPoint: normalized.fixedPoint.rgFixedPoint,
  },
  universality: {
    dimension: normalized.universality.dimension,
    shiftEquivalent: normalized.universality.shiftEquivalent,
  },
  antonymy: {
    source: normalized.synonymyAntonymy.source.tau,
    twist: normalized.synonymyAntonymy.twist.tau,
  },
  frontiers: normalized.openFrontier,
}, null, 2));
