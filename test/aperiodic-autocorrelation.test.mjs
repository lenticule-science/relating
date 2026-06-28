/**
 * Contract: finite autocorrelation and homometry mirror RelMath.Aperiodic.FiniteAutocorrelation.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { aperiodicAutocorrelation, evaluateRunTerm } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

describe("analysis.aperiodicAutocorrelation: finite pair-difference counts", () => {
  it("computes cyclic autocorrelation and homometry", () => {
    const pattern = [true, true, false, false, true];
    const receipt = analysis.aperiodicAutocorrelation.receipt();

    assert.equal(receipt.sourceModule, "RelMath.Aperiodic.FiniteAutocorrelation");
    assert.deepEqual(analysis.aperiodicAutocorrelation.autocorrelation(pattern), [3, 2, 1, 1, 2]);
    assert.equal(analysis.aperiodicAutocorrelation.autocorr(pattern, 0), 3);
    assert.equal(analysis.aperiodicAutocorrelation.autocorr(pattern, 5), 3);
    assert.deepEqual(receipt.autocorrelation, receipt.shiftedAutocorrelation);
    assert.equal(receipt.boundedBySiteCount, true);
    assert.equal(receipt.homometricRefl, true);
    assert.equal(receipt.homometricSymm, true);
    assert.equal(receipt.homometricTrans, true);
    assert.match(receipt.boundary, /no Fourier/u);
  });

  it("normalizes the autocorrelation receipt as RMN data", () => {
    const receipt = analysis.aperiodicAutocorrelation.receipt();

    assert.deepEqual(evaluateRunTerm(aperiodicAutocorrelation.receipt, receipt), receipt);
  });
});
