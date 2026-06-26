/**
 * Contract: the negative-paraconsistent sheaf surface exposes the finite
 * dNeg/DFrame falsehood mask, bilattice negation mirror laws, negative split
 * into f-only plus top parts, restriction laws, and RMN receipt normalization.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  evaluateRunTerm,
  negativeParaconsistentSheaf,
} from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

describe("analysis.negativeParaconsistentSheaf: finite negative mirror receipts", () => {
  it("models dNeg as the positive mask under bilattice negation", () => {
    const receipt = analysis.negativeParaconsistentSheaf.negationMirrorReceipt();

    assert.deepEqual(receipt.dNeg.cells, ["both-cell", "false-cell"]);
    assert.deepEqual(receipt.dKOfNegated.cells, ["both-cell", "false-cell"]);
    assert.deepEqual(receipt.dFonly.cells, ["false-cell"]);
    assert.deepEqual(receipt.dTOfNegated.cells, ["false-cell"]);
    assert.equal(receipt.dNegEqualsDkOfNegation, true);
    assert.equal(receipt.dFonlyEqualsDtOfNegation, true);
    assert.equal(receipt.topSeamFixed, true);
    assert.equal(receipt.negationInvolutive, true);
    assert.deepEqual(receipt.chargeMirrorTable, {
      absurd: "absurd",
      potential: "active",
      active: "potential",
      stable: "stable",
    });
  });

  it("models the negative split into f-only and top support", () => {
    const receipt = analysis.negativeParaconsistentSheaf.negativeSplitReceipt();

    assert.deepEqual(receipt.dNeg.cells, ["both-cell", "false-cell"]);
    assert.deepEqual(receipt.dFonly.cells, ["false-cell"]);
    assert.deepEqual(receipt.dTop.cells, ["both-cell"]);
    assert.deepEqual(receipt.fPart.coefficients.filter((entry) => entry.coefficient !== 0), [
      { cell: "false-cell", coefficient: -2 },
    ]);
    assert.deepEqual(receipt.topPart.coefficients.filter((entry) => entry.coefficient !== 0), [
      { cell: "both-cell", coefficient: 5 },
    ]);
    assert.equal(receipt.dNegEqualsUnion, true);
    assert.equal(receipt.splitReconstructs, true);
    assert.equal(receipt.splitUniqueOnSample, true);
  });

  it("models negative restriction laws", () => {
    const receipt = analysis.negativeParaconsistentSheaf.negativeRestrictionReceipt();

    assert.deepEqual(receipt.dNeg.cells, ["both-cell", "false-cell"]);
    assert.equal(receipt.restrictedVanishesOffDNeg, true);
    assert.equal(receipt.fullRestrictionIdentity, true);
    assert.equal(receipt.restrictionComposesByMeet, true);
  });

  it("normalizes the combined negative-paraconsistent sheaf receipt as RMN data", () => {
    const receipt = analysis.negativeParaconsistentSheaf.receipt();

    assert.equal(receipt.kind, "negativeParaconsistentSheaf.receipt:witness");
    assert.equal(receipt.openFrontier.length, 3);
    assert.deepEqual(evaluateRunTerm(negativeParaconsistentSheaf.receipt, receipt), receipt);
  });
});
