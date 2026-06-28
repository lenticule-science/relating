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

  it("models defects as nonzero classifying invariants in curved regimes", () => {
    const receipt = analysis.aperiodicClassification.defectReceipt();

    assert.equal(receipt.kind, "aperiodic.defect.receipt:witness");
    assert.equal(receipt.sourceModule, "RelMath.Cohomology.Defect");
    assert.equal(analysis.aperiodicClassification.hasDefect(receipt.flat), false);
    assert.equal(analysis.aperiodicClassification.hasDefect(receipt.scott), false);
    assert.equal(analysis.aperiodicClassification.hasDefect(receipt.witness), true);
    assert.equal(analysis.aperiodicClassification.isCurvedRegime(receipt.witness.regime), true);
    assert.equal(receipt.flatDefectFree, true);
    assert.equal(receipt.vanishingDefectFree, true);
    assert.equal(receipt.defectCurved, true);
    assert.equal(receipt.defectNonvanishing, true);
    assert.equal(receipt.aperiodicWitnessHasDefect, true);
    assert.equal(receipt.defectExists, true);
  });
});

describe("analysis.aperiodicClassification: common-base MLD classification", () => {
  it("classifies common-base settlings by firing-stage counts", () => {
    const left = analysis.aperiodicClassification.commonBaseSettling([2, 1, 2, 4]);
    const right = analysis.aperiodicClassification.commonBaseSettling([4, 2, 1, 2]);
    const other = analysis.aperiodicClassification.commonBaseSettling([1, 2, 4, 4]);

    assert.deepEqual(analysis.aperiodicClassification.baseClInv(left), { 1: 1, 2: 2, 4: 1 });
    assert.equal(analysis.aperiodicClassification.baseClInvAt(left, 2), 2);
    assert.equal(analysis.aperiodicClassification.baseMLD(left, right), true);
    assert.equal(analysis.aperiodicClassification.baseMLD(left, other), false);
  });

  it("constructs the firing-ordinal permutation when clInv agrees", () => {
    const left = analysis.aperiodicClassification.commonBaseSettling([2, 1, 2, 4]);
    const right = analysis.aperiodicClassification.commonBaseSettling([4, 2, 1, 2]);
    const derivation = analysis.aperiodicClassification.commonBaseDerivation(left, right);
    const receipt = analysis.aperiodicClassification.commonBaseClassificationReceipt();

    assert.deepEqual(derivation.permutation, [1, 2, 3, 0]);
    assert.equal(derivation.preservesFirings, true);
    assert.equal(receipt.baseMLDRefl, true);
    assert.equal(receipt.baseMLDSymm, true);
    assert.equal(receipt.baseMLDTrans, true);
    assert.equal(receipt.baseClInvOfBaseMLD, true);
    assert.equal(receipt.baseMLDOfClInvEq, true);
    assert.equal(receipt.commonBaseClassification, true);
    assert.throws(
      () => analysis.aperiodicClassification.commonBaseDerivation(
        left,
        analysis.aperiodicClassification.commonBaseSettling([1, 2, 4, 4]),
      ),
      /unequal baseClInv/u,
    );
  });
});

describe("analysis.aperiodicClassification: geometric MLD completion", () => {
  it("carries the aperiodic settling frame and its settled-value kernel", () => {
    const frame = analysis.aperiodicClassification.aperiodicSettleFrameReceipt();
    const witness = analysis.aperiodicClassification.aperiodicFramePoint(
      analysis.aperiodicClassification.aperiodicWitness(3),
      2,
    );
    const stepped = analysis.aperiodicClassification.aperiodicStep(witness);
    const settled = analysis.aperiodicClassification.aperiodicSettle(witness);

    assert.equal(frame.stepNotIdempotent, true);
    assert.equal(frame.settleStepAbsorbs, true);
    assert.equal(frame.witnessSeparated, true);
    assert.equal(frame.aperiodicGeoMldIffCohEquiv, true);
    assert.equal(stepped.stage, 3);
    assert.equal(settled.stage, 0);
    assert.equal(settled.settling.clInv.coord, 3);
    assert.equal(analysis.aperiodicClassification.aperiodicFrameSettledEqual(witness, stepped), true);
  });

  it("reduces classification to completeness and supplies the geometric complete witness", () => {
    const reduction = analysis.aperiodicClassification.classificationReductionReceipt();
    const complete = analysis.aperiodicClassification.geometricMldCompleteReceipt();
    const upTo = analysis.aperiodicClassification.upToClosureCoinductionReceipt();
    const transfinite = analysis.aperiodicClassification.transfiniteUpToClosureReceipt();
    const left = analysis.aperiodicClassification.aperiodicWitness(8);
    const right = analysis.aperiodicClassification.canonicalAperiodic(8);
    const other = analysis.aperiodicClassification.canonicalAperiodic(0);
    const derivation = analysis.aperiodicClassification.geometricMldDerivation(left, right);

    assert.equal(reduction.classificationIffComplete, true);
    assert.equal(reduction.existsCompleteLocalDerivability, true);
    assert.equal(complete.geometricLocalDerivabilityComplete, true);
    assert.equal(complete.classificationReductionDischarged, true);
    assert.equal(complete.geometricMldIffCohEquiv, true);
    assert.equal(upTo.sourceModule, "RelMath.Aperiodic.UpToClosureCoinduction");
    assert.equal(upTo.bisimulationUpToClosure, true);
    assert.equal(upTo.crossBaseConverseDischarged, true);
    assert.equal(transfinite.sourceModule, "RelMath.Aperiodic.TransfiniteUpToClosure");
    assert.equal(transfinite.limitStageCarriesSettledValue, true);
    assert.equal(transfinite.coinductionClimbsLimit, true);
    assert.equal(derivation.relation, "settled-value-kernel");
    assert.equal(derivation.constructedMorphism, true);
    assert.equal(analysis.aperiodicClassification.geometricMld(left, right), true);
    assert.equal(analysis.aperiodicClassification.geometricMld(left, other), false);
    assert.throws(
      () => analysis.aperiodicClassification.geometricMldDerivation(left, other),
      /unequal clInv/u,
    );
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

  it("identifies the Salem/Pisot split with the closure-regime split", () => {
    const receipt = analysis.aperiodicClassification.salemPisotRegimeReceipt();

    assert.equal(analysis.aperiodicClassification.inflationRegime(true).kind, "ordinal.closure.regime.aperiodic");
    assert.equal(analysis.aperiodicClassification.inflationRegime(false).kind, "ordinal.closure.regime.finite");
    assert.equal(receipt.salemAperiodic, true);
    assert.equal(receipt.pisotStrict, true);
    assert.equal(receipt.salem.salemReciprocal, true);
    assert.equal(receipt.salem.metallicReciprocal, false);
    assert.deepEqual(receipt.salem.salemUnitCircleSigns, [3, -3]);
    assert.deepEqual(receipt.salem.pisotContractingSigns, [1, -1]);
  });

  it("normalizes the combined aperiodic classification receipt as RMN data", () => {
    const receipt = analysis.aperiodicClassification.receipt();

    assert.equal(receipt.kind, "aperiodic.classificationCluster.receipt:witness");
    assert.equal(receipt.commonBase.commonBaseClassification, true);
    assert.equal(receipt.aperiodicSettleFrame.aperiodicGeoMldIffCohEquiv, true);
    assert.equal(receipt.geometricMldComplete.classificationReductionDischarged, true);
    assert.equal(receipt.salemPisotRegime.splitIsRegimeSplit, true);
    assert.equal(receipt.defect.defectExists, true);
    assert.equal(receipt.openFrontier.length, 4);
    assert.deepEqual(evaluateRunTerm(aperiodicClassification.receipt, receipt), receipt);
    assert.deepEqual(
      evaluateRunTerm(aperiodicClassification.settleFrame, receipt.aperiodicSettleFrame),
      receipt.aperiodicSettleFrame,
    );
    assert.deepEqual(
      evaluateRunTerm(aperiodicClassification.classificationReduction, receipt.classificationReduction),
      receipt.classificationReduction,
    );
    assert.deepEqual(
      evaluateRunTerm(aperiodicClassification.geometricMldComplete, receipt.geometricMldComplete),
      receipt.geometricMldComplete,
    );
    assert.deepEqual(
      evaluateRunTerm(
        aperiodicClassification.upToClosureCoinduction,
        analysis.aperiodicClassification.upToClosureCoinductionReceipt(),
      ),
      analysis.aperiodicClassification.upToClosureCoinductionReceipt(),
    );
    assert.deepEqual(
      evaluateRunTerm(
        aperiodicClassification.transfiniteUpToClosure,
        analysis.aperiodicClassification.transfiniteUpToClosureReceipt(),
      ),
      analysis.aperiodicClassification.transfiniteUpToClosureReceipt(),
    );
    assert.deepEqual(
      evaluateRunTerm(
        aperiodicClassification.defect,
        analysis.aperiodicClassification.defectReceipt(),
      ),
      analysis.aperiodicClassification.defectReceipt(),
    );
  });
});
