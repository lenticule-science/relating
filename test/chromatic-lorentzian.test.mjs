/**
 * Contract: RelMath.Aperiodic.ChromaticLorentzian and
 * RelMath.Lorentzian.ChromaticLorentzianAction finite prefix receipts.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { chromaticLorentzian, evaluateRunTerm } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

describe("analysis.chromaticLorentzian: non-idempotent settling frame", () => {
  it("propagates marks one causal tick per step and settles by past closure", () => {
    const seed = analysis.chromaticLorentzian.mark0(4);

    assert.deepEqual(seed, [true, false, false, false]);
    assert.deepEqual(analysis.chromaticLorentzian.step(seed), [true, true, false, false]);
    assert.deepEqual(analysis.chromaticLorentzian.orbit(seed, 2), [true, true, true, false]);
    assert.deepEqual(analysis.chromaticLorentzian.settle(seed), [true, true, true, true]);
    assert.deepEqual(analysis.chromaticLorentzian.settle(analysis.chromaticLorentzian.step(seed)), [true, true, true, true]);
  });

  it("classifies finite prefix MLD by equal settled values", () => {
    const left = [false, true, false, false];
    const right = [false, false, true, false];
    const different = [false, false, false, true];
    const receipt = analysis.chromaticLorentzian.receipt();

    assert.equal(analysis.chromaticLorentzian.geoMld(left, right), false);
    assert.equal(analysis.chromaticLorentzian.geoMld(left, analysis.chromaticLorentzian.step(left)), true);
    assert.equal(analysis.chromaticLorentzian.geoMld(right, different), false);
    assert.equal(receipt.stepNotIdempotent, true);
    assert.equal(receipt.settleStepAbsorption, true);
    assert.equal(receipt.settleOrbitConstant, true);
    assert.equal(receipt.geoMldIffSettleEq, true);
    assert.equal(receipt.crossBaseClassification, true);
  });
});

describe("analysis.chromaticLorentzian: chain d'Alembertian action", () => {
  it("uses box and past-sum as inverse finite-prefix operators", () => {
    const field = [2, -1, 3, 0];

    assert.deepEqual(analysis.chromaticLorentzian.pastSum(field), [2, 1, 4, 4]);
    assert.deepEqual(analysis.chromaticLorentzian.box(field), [2, -3, 4, -3]);
    assert.deepEqual(analysis.chromaticLorentzian.box(analysis.chromaticLorentzian.pastSum(field)), field);
    assert.deepEqual(analysis.chromaticLorentzian.pastSum(analysis.chromaticLorentzian.box(field)), field);
    assert.deepEqual(analysis.chromaticLorentzian.box(analysis.chromaticLorentzian.unitField(4)), [1, 0, 0, 0]);
    assert.equal(analysis.chromaticLorentzian.bdActionChain(4), 1);
  });

  it("matches Bool settling with positive integer past sums", () => {
    const marking = [false, false, true, false];
    const settled = analysis.chromaticLorentzian.settle(marking);
    const propagated = analysis.chromaticLorentzian.pastSum(analysis.chromaticLorentzian.indicator(marking));
    const receipt = analysis.chromaticLorentzian.actionReceipt();

    assert.deepEqual(settled, [false, false, true, true]);
    assert.deepEqual(propagated, [0, 0, 1, 1]);
    assert.equal(receipt.boxPastSum, true);
    assert.equal(receipt.pastSumBox, true);
    assert.deepEqual(receipt.boxUnit, [1, 0, 0, 0]);
    assert.equal(receipt.bdActionChain, true);
    assert.equal(receipt.settleIffPastSumPositive, true);
    assert.equal(receipt.chainBdActionFour, 1);
    assert.equal(receipt.chromaticLorentzianAction, true);
  });

  it("normalizes chromatic-Lorentzian receipts as RMN data", () => {
    const settling = analysis.chromaticLorentzian.receipt();
    const action = analysis.chromaticLorentzian.actionReceipt();

    assert.deepEqual(evaluateRunTerm(chromaticLorentzian.receipt, settling), settling);
    assert.deepEqual(evaluateRunTerm(chromaticLorentzian.action, action), action);
  });
});
