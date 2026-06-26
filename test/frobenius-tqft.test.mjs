/**
 * Contract: the settling Frobenius/TQFT surface exposes executable operations
 * for Z[x]/(x^2), finite law receipts, degree placement, and RMN normalization.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  evaluateRunTerm,
  frobeniusTqft,
} from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

describe("analysis.frobeniusTqft: Z[x]/(x^2) operations", () => {
  it("multiplies, traces, and comultiplies the worked Frobenius algebra", () => {
    const a = analysis.frobeniusTqft.z2(2, 3);
    const b = analysis.frobeniusTqft.z2(-1, 4);

    assert.deepEqual(analysis.frobeniusTqft.mul(a, b), analysis.frobeniusTqft.z2(-2, 5));
    assert.equal(analysis.frobeniusTqft.counit(a), 3);
    assert.equal(analysis.frobeniusTqft.comul(a).length, 3);
    assert.deepEqual(analysis.frobeniusTqft.mul(analysis.frobeniusTqft.x, analysis.frobeniusTqft.x), analysis.frobeniusTqft.zero);
  });

  it("checks the finite law receipt and degree placement", () => {
    const laws = analysis.frobeniusTqft.checkLaws([
      analysis.frobeniusTqft.z2(0, 0),
      analysis.frobeniusTqft.z2(1, 0),
      analysis.frobeniusTqft.z2(0, 1),
      analysis.frobeniusTqft.z2(2, -1),
    ]);
    const degree = analysis.frobeniusTqft.degreeReceipt(5);

    assert.equal(laws.frobeniusCompatibility, true);
    assert.equal(laws.xSquaredZero, true);
    assert.deepEqual(degree.h0Example, analysis.frobeniusTqft.z2(5, 0));
    assert.deepEqual(degree.h1Example, analysis.frobeniusTqft.z2(0, 5));
    assert.deepEqual(degree.h2Example, analysis.frobeniusTqft.zero);
  });

  it("normalizes the combined Frobenius/TQFT receipt as RMN data", () => {
    const receipt = analysis.frobeniusTqft.receipt();

    assert.equal(receipt.kind, "frobenius.settling.receipt:witness");
    assert.equal(receipt.tqft.generatorsMatch, true);
    assert.equal(receipt.k4Grading.gradeCount, 4);
    assert.equal(receipt.openFrontier.length, 4);
    assert.deepEqual(evaluateRunTerm(frobeniusTqft.receipt, receipt), receipt);
  });
});
