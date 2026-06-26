/**
 * Contract: finite Knaster-Tarski receipts mirror
 * RelMath.Order.KnasterTarskiStandalone and normalize as RMN terms.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { evaluateRunTerm, knasterTarski } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

const threePointChain = analysis.orderInfra.finitePreorderSystem(
  ["bottom", "middle", "top"],
  [
    [true, true, true],
    [false, true, true],
    [false, false, true],
  ],
);

describe("analysis.knasterTarski: finite monotone fixed-point receipts", () => {
  it("computes least and greatest fixed points on a finite complete chain", () => {
    const endomap = analysis.knasterTarski.finiteMonotoneEndomap(threePointChain, [1, 1, 2]);
    const receipt = analysis.knasterTarski.fixedPoints(endomap);

    assert.equal(receipt.kind, "knasterTarski.fixedPoints:witness");
    assert.equal(receipt.lfpLabel, "middle");
    assert.equal(receipt.gfpLabel, "top");
    assert.deepEqual(receipt.prefixPoints, [1, 2]);
    assert.deepEqual(receipt.postfixPoints, [0, 1, 2]);
    assert.deepEqual(receipt.fixedPoints, [1, 2]);
    assert.equal(receipt.lfpFixed, true);
    assert.equal(receipt.gfpFixed, true);
    assert.equal(receipt.lfpLeast, true);
    assert.equal(receipt.gfpGreatest, true);
    assert.equal(receipt.lfpLeGfp, true);
  });

  it("refuses a nonmonotone endomap before claiming fixed-point parity", () => {
    const endomap = analysis.knasterTarski.finiteMonotoneEndomap(threePointChain, [2, 1, 0]);
    const receipt = analysis.knasterTarski.fixedPoints(endomap);

    assert.equal(receipt.kind, "knasterTarski.fixedPoints-obstruction");
    assert.equal(receipt.reason, "monotone");
    assert.equal(receipt.monotone.reason, "monotonicity");
  });

  it("uses the OrderInfra complete-lattice check as a real hypothesis", () => {
    const nonThin = analysis.orderInfra.finitePreorderSystem(
      ["x", "y"],
      [
        [true, true],
        [true, true],
      ],
    );
    const endomap = analysis.knasterTarski.finiteMonotoneEndomap(nonThin, [0, 1]);
    const receipt = analysis.knasterTarski.fixedPoints(endomap);

    assert.equal(receipt.kind, "knasterTarski.fixedPoints-obstruction");
    assert.equal(receipt.reason, "completeLattice");
    assert.equal(receipt.completeLattice.reason, "partialOrder");
  });
});

describe("knasterTarski RMN terms normalize finite receipts", () => {
  it("normalizes a finite fixed-point receipt", () => {
    const receipt = analysis.knasterTarski.fixedPoints(
      analysis.knasterTarski.finiteMonotoneEndomap(threePointChain, [1, 1, 2]),
    );

    assert.deepEqual(evaluateRunTerm(knasterTarski.fixedPoints, receipt), receipt);
  });
});
