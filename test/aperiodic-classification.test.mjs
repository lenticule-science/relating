/**
 * Contract: the finite aperiodic cl-inv/moduli/direct-limit cluster has an
 * executable RMN receipt over integer coordinates, finite step rules, and
 * fixed-dimension matrix witnesses.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  aperiodicClassification,
  evaluateRunTerm,
} from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

describe("analysis.aperiodicClassification: cl-inv and co-classifying receipts", () => {
  it("forces clInv zero in vanishing regimes and witnesses nonzero aperiodic classes", () => {
    const receipt = analysis.aperiodicClassification.classificationReceipt();

    assert.equal(receipt.kind, "aperiodic.classification.receipt:witness");
    assert.equal(receipt.strictSettling.clInv.coord, 0);
    assert.equal(receipt.scottSettling.clInv.coord, 0);
    assert.notEqual(receipt.aperiodicWitness.clInv.coord, 0);
    assert.equal(receipt.strictScottClInvZero, true);
    assert.equal(receipt.aperiodicCanBeNonzero, true);
    assert.throws(
      () => analysis.aperiodicClassification.settling(receipt.strictSettling.regime, 1),
      /strict\/Scott regimes force clInv = 0/u,
    );
  });

  it("models strict Boolean co-classifying as an isomorphic H1 copy", () => {
    const receipt = analysis.aperiodicClassification.coClassifyingReceipt(11);

    assert.equal(receipt.homology.dualCoord, 11);
    assert.equal(receipt.inverse.coord, 11);
    assert.equal(receipt.dSpatialBijective, true);
    assert.equal(receipt.zeroPreserving, true);
    assert.equal(receipt.sameDataAsCohEquiv, true);
  });

  it("models full cohomological equivalence as the H0/clInv/regime invariant", () => {
    const receipt = analysis.aperiodicClassification.cohomologicalEquivalenceReceipt();

    assert.equal(receipt.fullCohEquiv, true);
    assert.equal(receipt.invariant.h0, 2);
    assert.equal(receipt.invariant.clInv.coord, 4);
    assert.equal(receipt.fullRefinesClInvEquiv, true);
    assert.equal(receipt.flatClInvCollapse, true);
    assert.equal(receipt.aperiodicNotTrivial, true);
    assert.equal(receipt.negationCohomologicallyInvisible, true);
  });
});

describe("analysis.aperiodicClassification: direct limit, moduli, fixed point, and SE", () => {
  it("collapses constant Anderson-Putnam stages and fixes sigma-infinity", () => {
    const direct = analysis.aperiodicClassification.directLimitReceipt();
    const fixed = analysis.aperiodicClassification.fixedPointReceipt();

    assert.equal(direct.eventuallyEqual, true);
    assert.equal(direct.stageIndependent, true);
    assert.equal(direct.stepTwoIsFour, true);
    assert.equal(fixed.embedDepthIndependent, true);
    assert.equal(fixed.sigmaInfinityFixed, true);
    assert.equal(fixed.rgFixedPoint, true);
  });

  it("preserves moduli points under step-shift and packages fixed-dimension SE", () => {
    const moduli = analysis.aperiodicClassification.moduliReceipt();
    const se = analysis.aperiodicClassification.shiftEquivalenceReceipt();

    assert.equal(moduli.shifted.n, moduli.rule.n + 1);
    assert.equal(moduli.stepShiftPreservesCoord, true);
    assert.deepEqual(moduli.point, moduli.shiftedPoint);
    assert.equal(se.dimension, 2);
    assert.equal(se.strongShiftEquivalent, true);
    assert.equal(se.shiftEquivalent, true);
    assert.equal(se.universalityClassIsSeClass, true);
  });
});

describe("analysis.aperiodicClassification: synonymy, antonymy, and autopoiesis", () => {
  it("flips firing type while leaving ordinary synonymy invisible", () => {
    const receipt = analysis.aperiodicClassification.synonymyAntonymyReceipt();

    assert.equal(receipt.source.tau, "truthOnly");
    assert.equal(receipt.twist.tau, "falsityOnly");
    assert.equal(receipt.negationInvisibleToSynonymy, true);
    assert.equal(receipt.flipInvolutive, true);
    assert.equal(receipt.antonymySymmetric, true);
  });

  it("reuses the finite nuclear diamond as the autopoiesis/history-separation witness", () => {
    const receipt = analysis.aperiodicClassification.autopoiesisReceipt();

    assert.equal(receipt.fourCorners, 4);
    assert.equal(receipt.varying.varies, true);
    assert.equal(receipt.historySeparationAperiodic, true);
    assert.equal(receipt.tower.gradeCount, 4);
  });

  it("normalizes the combined aperiodic classification receipt as RMN data", () => {
    const receipt = analysis.aperiodicClassification.receipt();

    assert.equal(receipt.kind, "aperiodic.classificationCluster.receipt:witness");
    assert.equal(receipt.openFrontier.length, 4);
    assert.deepEqual(evaluateRunTerm(aperiodicClassification.receipt, receipt), receipt);
  });
});
