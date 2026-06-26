/**
 * Contract: the d-frame surface exposes finite powerset-frame laws, canonical
 * bitopological d-frame consistency/totality, d-frame-valued sheaf restriction,
 * and RMN receipt normalization.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  dFrame,
  evaluateRunTerm,
} from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

describe("analysis.dFrame: finite d-frame receipts", () => {
  it("checks finite powerset-frame laws", () => {
    const frame = analysis.dFrame.powersetFrameReceipt(["a", "b", "c"]);

    assert.equal(frame.subsetCount, 8);
    assert.deepEqual(frame.bottom.elements, []);
    assert.deepEqual(frame.top.elements, ["a", "b", "c"]);
    assert.equal(frame.meetDistributesOverFiniteSup, true);
  });

  it("models canonical bitopological d-frame relations", () => {
    const receipt = analysis.dFrame.canonicalDFrameReceipt(["plus", "minus"]);

    assert.equal(receipt.conIsDisjointness, true);
    assert.equal(receipt.totIsCovering, true);
    assert.equal(receipt.conDownwardClosed, true);
    assert.equal(receipt.totUpwardClosed, true);
    assert.equal(
      analysis.dFrame.disjoint(receipt.consistentExample[0], receipt.consistentExample[1]),
      true,
    );
    assert.equal(
      analysis.dFrame.covers(receipt.universe, receipt.totalExample[0], receipt.totalExample[1]),
      true,
    );
  });

  it("models the finite d-frame-valued settling sheaf", () => {
    const receipt = analysis.dFrame.valuedSheafReceipt();

    assert.deepEqual(receipt.positiveSupport.elements, ["both-cell", "truth-cell"]);
    assert.deepEqual(receipt.negativeSupport.elements, ["both-cell", "false-cell"]);
    assert.deepEqual(receipt.settledSupport.elements, ["both-cell", "false-cell", "truth-cell"]);
    assert.equal(receipt.topSharedByBothSides, true);
    assert.equal(receipt.bottomInNeitherSide, true);
    assert.equal(receipt.restrictionMeetPreserving, true);
  });

  it("normalizes the combined d-frame receipt as RMN data", () => {
    const receipt = analysis.dFrame.receipt();

    assert.equal(receipt.kind, "dFrame.receipt:witness");
    assert.equal(receipt.powerset.subsetCount, 8);
    assert.equal(receipt.openFrontier.length, 3);
    assert.deepEqual(evaluateRunTerm(dFrame.receipt, receipt), receipt);
  });
});
