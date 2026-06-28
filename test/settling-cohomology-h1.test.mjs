/**
 * Contract: RelMath.Cohomology.SettlingCohomologyH1 is exposed as a finite
 * H0 designated-count, Cech gluing, strict/Scott H1-vanishing, and zero clInv
 * receipt.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { evaluateRunTerm, settlingCohomologyH1 } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

describe("analysis.settlingCohomologyH1: finite H0/H1 and classifying invariant", () => {
  it("counts H0 as the designated truth-cell extent", () => {
    const h0 = analysis.settlingCohomologyH1.h0();

    assert.deepEqual(h0.designatedCells, ["truth-cell"]);
    assert.equal(h0.count, 1);
    assert.equal(h0.truthContent, true);
    assert.equal(h0.h0IsDesignatedCount, true);
    assert.equal(h0.positiveIffTruthContent, true);
  });

  it("glues agreeing local sections into a unique global section on the finite cover", () => {
    const receipt = analysis.settlingCohomologyH1.gluingReceipt();

    assert.equal(receipt.cocycle, true);
    assert.equal(receipt.coboundary, true);
    assert.equal(receipt.separated, true);
    assert.equal(receipt.uniqueGluingOnFiniteSupport, true);
    assert.deepEqual(receipt.glued.coefficients, [
      { cell: "both-cell", coefficient: 2 },
      { cell: "empty-cell", coefficient: 0 },
      { cell: "false-cell", coefficient: 0 },
      { cell: "truth-cell", coefficient: 1 },
    ]);
  });

  it("forces the identity classifying invariant to zero in the strict/Scott regime", () => {
    const receipt = analysis.settlingCohomologyH1.classifyingInvariantReceipt();

    assert.equal(receipt.identityVanishesOffTruthMask, true);
    assert.equal(receipt.clInvDatumCocycle, true);
    assert.equal(receipt.clInvCoboundary, true);
    assert.equal(receipt.classifyingInvariant.coord, 0);
    assert.equal(receipt.classifyingInvariantZero, true);
    assert.equal(receipt.zeroOnlyInStrictScottReceipt, true);
  });

  it("packages the H1 vanishing bridge as RMN data", () => {
    const receipt = analysis.settlingCohomologyH1.receipt();

    assert.equal(receipt.kind, "settlingCohomologyH1.receipt:witness");
    assert.equal(receipt.strictScottRegimeGate, true);
    assert.equal(receipt.h1Vanishes, true);
    assert.equal(receipt.hnAboveOneZero, true);
    assert.equal(receipt.ses.splitReconstructs, true);
    assert.equal(receipt.bigradedLes.degenerateLes, true);
    assert.equal(receipt.frontier.length, 3);
    assert.deepEqual(evaluateRunTerm(settlingCohomologyH1.receipt, receipt), receipt);
  });
});
