/**
 * Contract: RelMath.Articulating.FourCornerCell is exposed as a finite
 * coordinate bridge between articulation phases and the existing charge algebra.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  articulate,
  evaluateRunTerm,
  fourCornerCell,
  fourCornerCellReceipt,
  mark,
  readFourCorner,
  statusOfCorner,
  utterance,
} from "@emsenn/relating";

describe("fourCornerCell: articulation phase as charge coordinates", () => {
  it("round-trips the four Lean corner names through status pairs", () => {
    assert.deepEqual(statusOfCorner("potential"), {
      kind: "fourCorner.status",
      tokenArticulated: false,
      claimArticulated: false,
    });
    assert.deepEqual(statusOfCorner("active"), {
      kind: "fourCorner.status",
      tokenArticulated: true,
      claimArticulated: false,
    });
    assert.deepEqual(statusOfCorner("absurd"), {
      kind: "fourCorner.status",
      tokenArticulated: true,
      claimArticulated: true,
    });
    assert.deepEqual(statusOfCorner("stable"), {
      kind: "fourCorner.status",
      tokenArticulated: false,
      claimArticulated: true,
    });
  });

  it("keeps Lean phase names and current JS charge names explicit", () => {
    assert.deepEqual(
      [
        readFourCorner(false, false),
        readFourCorner(true, false),
        readFourCorner(true, true),
        readFourCorner(false, true),
      ].map((reading) => [reading.corner, reading.chargeAlias, reading.chargeName]),
      [
        ["potential", "kBot", "absurd"],
        ["active", "tTop", "potential"],
        ["absurd", "kTop", "stable"],
        ["stable", "tBot", "active"],
      ],
    );
  });

  it("reads the initial articulation cell as Lean potential and knowledge bottom", () => {
    const cell = articulate(utterance(mark("token"), mark("claim")));
    const receipt = fourCornerCellReceipt(cell);

    assert.equal(receipt.kind, "fourCornerCell.receipt:witness");
    assert.equal(receipt.cellReading.corner, "potential");
    assert.equal(receipt.cellReading.chargeAlias, "kBot");
    assert.equal(receipt.cellReading.chargeName, "absurd");
    assert.equal(receipt.cornerRoundTrip, true);
    assert.equal(receipt.chargeCoordinateRoundTrip, true);
    assert.equal(receipt.articulationPhaseIsChargeByCoordinates, true);
    assert.equal(receipt.initialPotentialIsKnowledgeBottom, true);
  });
});

describe("fourCornerCell RMN terms normalize finite receipts", () => {
  it("normalizes the four-corner-cell receipt", () => {
    const receipt = fourCornerCellReceipt(articulate(utterance(mark("token"), mark("claim"))));

    assert.deepEqual(evaluateRunTerm(fourCornerCell.receipt, receipt), receipt);
  });
});
