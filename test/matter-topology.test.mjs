/**
 * Contract: RelMath.Aperiodic.MatterTopology is exposed as finite
 * contact-network load-bearing and jamming receipts.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { evaluateRunTerm, matterTopology } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

describe("analysis.matterTopology: contact-network rigidity", () => {
  it("detects load-bearing exactly at non-forest contact nerves", () => {
    const cycle = analysis.coordinationCohomology.coverNerve(3, 3, 1);
    const forest = analysis.coordinationCohomology.coverNerve(4, 2, 2);
    const cycleReceipt = analysis.matterTopology.receipt(cycle);
    const forestReceipt = analysis.matterTopology.receipt(forest);

    assert.equal(analysis.matterTopology.loadBearing(cycle), true);
    assert.equal(analysis.matterTopology.loadBearing(forest), false);
    assert.equal(cycleReceipt.h1Rank, 1);
    assert.equal(cycleReceipt.notForest, true);
    assert.equal(cycleReceipt.loadBearingIffNotForest, true);
    assert.equal(forestReceipt.h1Rank, 0);
    assert.equal(forestReceipt.notForest, false);
    assert.equal(forestReceipt.loadBearingIffNotForest, true);
  });

  it("adds one redundant contact as one jamming click", () => {
    const nerve = analysis.coordinationCohomology.coverNerve(5, 4, 1);
    const receipt = analysis.matterTopology.receipt(nerve);

    assert.deepEqual(receipt.jammed, analysis.coordinationCohomology.coverNerve(5, 5, 1));
    assert.equal(receipt.h1Rank, 0);
    assert.equal(receipt.jammedH1Rank, 1);
    assert.equal(receipt.jammingClick, true);
    assert.equal(receipt.percolationFrontier, "condensate density does not alone force load-bearing topology");
  });

  it("normalizes material-topology receipts as RMN data", () => {
    const receipt = analysis.matterTopology.receipt();

    assert.deepEqual(evaluateRunTerm(matterTopology.receipt, receipt), receipt);
  });
});
