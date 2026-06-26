/**
 * Contract: RelMath.Closure.ScottContinuousClosure and SettlingCoalgebra have
 * finite executable receipts over FOUR charge closures and valuation fibers.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  evaluateRunTerm,
  scottCoalgebra,
} from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

describe("analysis.scottCoalgebra: finite Scott-continuity receipts", () => {
  it("admits only finite directed charge families whose join is attained", () => {
    const family = analysis.scottCoalgebra.directedFamily(["absurd", "potential", "stable"]);

    assert.equal(family.kind, "scottCoalgebra.directedFamily.carrier");
    assert.equal(family.sup, "stable");
    assert.equal(family.supAttained, true);
    assert.throws(
      () => analysis.scottCoalgebra.directedFamily(analysis.scottCoalgebra.invalidNonDirectedFamily()),
      /must attain their join/u,
    );
  });

  it("proves finite charge closures commute with directed joins", () => {
    const closure = analysis.scottCoalgebra.receipt().scott.closure;
    const family = analysis.scottCoalgebra.directedFamily(["absurd", "potential", "stable"]);
    const receipt = analysis.scottCoalgebra.scottContinuityReceipt(closure, family);

    assert.equal(receipt.kind, "scottCoalgebra.scottContinuity:witness");
    assert.equal(receipt.left, receipt.right);
    assert.equal(receipt.commutesWithDirectedJoin, true);
    assert.equal(receipt.finiteCarrierForcesAttainment, true);
  });

  it("models finite-antecedent firing as Scott-continuous over directed joins", () => {
    const family = analysis.scottCoalgebra.directedFamily(["absurd", "potential", "stable"]);
    const receipt = analysis.scottCoalgebra.finiteAntecedentScottReceipt("potential", "stable", family);

    assert.equal(receipt.firesOnJoinIffFiresOnMember, true);
    assert.equal(receipt.left, "stable");
    assert.equal(receipt.right, "stable");
    assert.equal(receipt.commutesWithDirectedJoin, true);
  });
});

describe("analysis.scottCoalgebra: finite settling-coalgebra receipts", () => {
  it("packages coalgebra inflation, orbit monotonicity, limit joins, and finite KZ shadow", () => {
    const receipt = analysis.scottCoalgebra.receipt().coalgebra;

    assert.equal(receipt.kind, "scottCoalgebra.settlingCoalgebra:witness");
    assert.equal(receipt.coalgebraMapInflationary, true);
    assert.equal(receipt.settlingEndofunctorMonotone, true);
    assert.equal(receipt.zeroIncrementRecoversClosure, true);
    assert.equal(receipt.orbitMonotone, true);
    assert.equal(receipt.orbitLimit.leastUpperBound, true);
    assert.equal(receipt.quiescenceIsoAtZeroIncrement, true);
    assert.equal(receipt.finiteKzShadow.kzIffStrict, true);
  });

  it("normalizes the combined Scott/coalgebra receipt as RMN data", () => {
    const receipt = analysis.scottCoalgebra.receipt();

    assert.equal(receipt.kind, "scottCoalgebra.receipt:witness");
    assert.equal(receipt.dcpoBoundary, "proof-side arbitrary directed-complete joins");
    assert.deepEqual(evaluateRunTerm(scottCoalgebra.receipt, receipt), receipt);
  });
});
