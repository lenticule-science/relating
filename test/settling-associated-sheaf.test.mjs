/**
 * Contract: the settling-associated sheaf surface exposes finite designation
 * masks, masked cochain restriction, split SES receipts, and RMN normalization.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  evaluateRunTerm,
  settlingAssociatedSheaf,
} from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

describe("analysis.settlingAssociatedSheaf: finite mask and SES receipts", () => {
  it("splits truth, top, and Belnap-designated masks", () => {
    const split = analysis.settlingAssociatedSheaf.maskSplitReceipt();

    assert.deepEqual(split.dT.cells, ["truth-cell"]);
    assert.deepEqual(split.dTop.cells, ["both-cell"]);
    assert.deepEqual(split.dK.cells, ["truth-cell", "both-cell"]);
    assert.equal(split.dTDisjointDTop, true);
    assert.equal(split.dKEqualsUnion, true);
  });

  it("restricts cochains along masks and composes restrictions by meet", () => {
    const value = analysis.settlingAssociatedSheaf.cochain([
      { cell: "truth-cell", coefficient: 3 },
      { cell: "both-cell", coefficient: 7 },
      { cell: "false-cell", coefficient: 11 },
    ]);
    const receipt = analysis.settlingAssociatedSheaf.restrictionReceipt(
      analysis.settlingAssociatedSheaf.defaultValuation,
      value,
    );

    assert.deepEqual(receipt.restricted.coefficients.find((entry) => entry.cell === "truth-cell")?.coefficient, 3);
    assert.deepEqual(receipt.restricted.coefficients.find((entry) => entry.cell === "both-cell")?.coefficient, 0);
    assert.equal(receipt.fullRestrictionIdentity, true);
    assert.equal(receipt.restrictionComposesByMeet, true);
  });

  it("packages the designated short exact sequence as a finite receipt", () => {
    const receipt = analysis.settlingAssociatedSheaf.shortExactSequenceReceipt();

    assert.equal(receipt.iotaImageVanishesOnTop, true);
    assert.equal(receipt.piSurjectiveOnTopPart, true);
    assert.equal(receipt.kernelPiIffVanishesOnTopOnSample, true);
    assert.equal(receipt.splitReconstructs, true);
    assert.equal(receipt.splitUniqueOnSample, true);
    assert.equal(receipt.sampleSize, 9);
  });

  it("normalizes the combined settling-associated sheaf receipt as RMN data", () => {
    const receipt = analysis.settlingAssociatedSheaf.receipt();

    assert.equal(receipt.kind, "settlingAssociatedSheaf.receipt:witness");
    assert.equal(receipt.supportReading.potential.dT, true);
    assert.equal(receipt.supportReading.stable.dTop, true);
    assert.equal(receipt.openFrontier.length, 3);
    assert.deepEqual(evaluateRunTerm(settlingAssociatedSheaf.receipt, receipt), receipt);
  });
});
