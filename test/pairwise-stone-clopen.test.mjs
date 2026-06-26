/**
 * Contract: the PairwiseStoneClopen surface exposes the finite two-point
 * paired Priestley carrier, clopen-upset lattice, swap-negation transport, and
 * RMN receipt normalization.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  evaluateRunTerm,
  pairwiseStoneClopen,
} from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

describe("analysis.pairwiseStoneClopen: finite FOUR Priestley dual", () => {
  it("carries the two-point antichain paired Priestley space", () => {
    const space = analysis.pairwiseStoneClopen.pairedPriestleyReceipt();

    assert.equal(space.points.length, 2);
    assert.deepEqual(space.order, [["plus", "plus"], ["minus", "minus"]]);
    assert.deepEqual(space.sigma, { plus: "minus", minus: "plus" });
    assert.equal(space.antichain, true);
    assert.equal(analysis.pairwiseStoneClopen.sigma("plus"), "minus");
    assert.equal(analysis.pairwiseStoneClopen.le("plus", "minus"), false);
  });

  it("identifies clopen up-sets with the FOUR charge table", () => {
    const lattice = analysis.pairwiseStoneClopen.clopenLatticeReceipt();

    assert.deepEqual(lattice.table.map((row) => row.charge), [
      "absurd",
      "potential",
      "active",
      "stable",
    ]);
    assert.equal(
      analysis.pairwiseStoneClopen.toChargeName(analysis.pairwiseStoneClopen.clopenUp(true, false)),
      "potential",
    );
    assert.deepEqual(analysis.pairwiseStoneClopen.ofChargeName("active"), analysis.pairwiseStoneClopen.clopenUp(false, true));
    assert.equal(lattice.absorption, true);
  });

  it("transports swap to charge negation and recovers order from tauPlus", () => {
    const swap = analysis.pairwiseStoneClopen.swapNegationReceipt();
    const topology = analysis.pairwiseStoneClopen.topologyReceipt();

    assert.equal(swap.transportedAsChargeNegation, true);
    assert.equal(swap.table.find((row) => row.charge === "potential")?.negatedCharge, "active");
    assert.equal(topology.orderRecoveredFromTauPlus, true);
    assert.equal(analysis.pairwiseStoneClopen.orderRecoveredFromTauPlus("plus", "minus"), true);
  });

  it("normalizes the combined PairwiseStoneClopen receipt as RMN data", () => {
    const receipt = analysis.pairwiseStoneClopen.receipt();

    assert.equal(receipt.kind, "pairwiseStoneClopen.receipt:witness");
    assert.equal(receipt.duality, "ClopenUp(FourDual) ~= FOUR");
    assert.equal(receipt.openFrontier.length, 3);
    assert.deepEqual(evaluateRunTerm(pairwiseStoneClopen.receipt, receipt), receipt);
  });
});
