/**
 * Contract: RelMath.Cohomology.InconsistencySheaf is exposed as a finite
 * dTop-supported cokernel and H0/H1 regime receipt.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { evaluateRunTerm, inconsistencySheaf } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

describe("analysis.inconsistencySheaf: finite dTop cokernel receipt", () => {
  it("counts top cells as H0 of the inconsistency sheaf", () => {
    const valuation = analysis.settlingAssociatedSheaf.defaultValuation;
    const cohomology = analysis.inconsistencySheaf.inconsistencyCohomologyReceipt(valuation);

    assert.equal(analysis.inconsistencySheaf.h0Top(valuation), 1);
    assert.equal(analysis.inconsistencySheaf.hasInconsistencyContent(valuation), true);
    assert.equal(cohomology.h0Top, 1);
    assert.equal(cohomology.h0CountsInconsistency, true);
    assert.equal(cohomology.h1VanishesInStrict, true);
    assert.equal(cohomology.h1VanishesInScott, true);
    assert.equal(cohomology.h1VanishesInTransfinite, false);
    assert.equal(cohomology.h1VanishesInAperiodic, false);
  });

  it("kills the top section for a consistent valuation", () => {
    const zero = analysis.inconsistencySheaf.consistentZeroReceipt();

    assert.equal(zero.noTopCells, true);
    assert.equal(zero.topSectionZero, true);
    assert.deepEqual(zero.topSection.coefficients, [
      { cell: "empty-cell", coefficient: 0 },
      { cell: "false-cell", coefficient: 0 },
      { cell: "truth-cell", coefficient: 0 },
    ]);
  });

  it("reuses the associated-sheaf SES as the cokernel of iota", () => {
    const receipt = analysis.inconsistencySheaf.receipt();

    assert.equal(receipt.kind, "inconsistencySheaf.receipt:witness");
    assert.deepEqual(receipt.topMask.cells, ["both-cell"]);
    assert.deepEqual(receipt.topSection.coefficients, [
      { cell: "both-cell", coefficient: 5 },
      { cell: "empty-cell", coefficient: 0 },
      { cell: "false-cell", coefficient: 0 },
      { cell: "truth-cell", coefficient: 0 },
    ]);
    assert.equal(receipt.restrictTopEqualsPi, true);
    assert.equal(receipt.cokernelOfIota, true);
    assert.equal(receipt.directSumSplitInherited, true);
    assert.equal(receipt.cokernel.kernelPiIffVanishesOnTopOnSample, true);
    assert.deepEqual(evaluateRunTerm(inconsistencySheaf.receipt, receipt), receipt);
  });
});
