/**
 * Contract: the coordination-cohomology surface exposes finite cover-nerve
 * Euler ranks, coordination-cost receipts, tree vanishing, Laplacian duality,
 * and RMN normalization.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  coordinationCohomology,
  evaluateRunTerm,
} from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

describe("analysis.coordinationCohomology: finite cover-nerve costs", () => {
  it("admits well-formed cover nerves and rejects broken union-find invariants", () => {
    const nerve = analysis.coordinationCohomology.coverNerve(3, 3, 1);
    const obstruction = analysis.coordinationCohomology.coverNerveJudgment(5, 1, 1);

    assert.equal(nerve.kind, "coordinationCohomology.coverNerve");
    assert.equal(obstruction.kind, "coordinationCohomology.coverNerve-obstruction");
    assert.equal(obstruction.reason, "union-find-invariant-fails");
  });

  it("computes H0/H1 and identifies coordination-free forests", () => {
    const cycle = analysis.coordinationCohomology.coordinationCostReceipt(
      analysis.coordinationCohomology.coverNerve(3, 3, 1),
    );
    const forest = analysis.coordinationCohomology.coordinationCostReceipt(
      analysis.coordinationCohomology.coverNerve(4, 2, 2),
    );

    assert.equal(cycle.h0Rank, 1);
    assert.equal(cycle.h1Rank, 1);
    assert.equal(cycle.coordinationCost, 1);
    assert.equal(cycle.coordinationFree, false);
    assert.equal(forest.h1Rank, 0);
    assert.equal(forest.coordinationFree, true);
    assert.equal(forest.forestEquality, true);
  });

  it("packages tree and Laplacian duality receipts", () => {
    const tree = analysis.coordinationCohomology.treeCoordinationReceipt(6);
    const laplacian = analysis.coordinationCohomology.laplacianDualReceipt(
      analysis.coordinationCohomology.coverNerve(3, 3, 1),
    );

    assert.equal(tree.edges, 5);
    assert.equal(tree.h1Rank, 0);
    assert.equal(laplacian.incidenceRank, 2);
    assert.equal(laplacian.h0KernelRank, 1);
    assert.equal(laplacian.h1CokernelRank, 1);
  });

  it("reads H1 coordination cost as finite Landauer entropy", () => {
    const cycle = analysis.coordinationCohomology.coverNerve(3, 3, 1);
    const forest = analysis.coordinationCohomology.coverNerve(4, 2, 2);
    const cycleReceipt = analysis.coordinationCohomology.landauerEntropyReceipt(cycle);
    const forestReceipt = analysis.coordinationCohomology.landauerEntropyReceipt(forest);

    assert.equal(analysis.coordinationCohomology.landauerBits(cycle), 1);
    assert.equal(analysis.coordinationCohomology.landauerBits(forest), 0);
    assert.equal(cycleReceipt.bits, cycleReceipt.coordinationCost);
    assert.equal(cycleReceipt.reversible, false);
    assert.equal(cycleReceipt.landauerFree, false);
    assert.equal(forestReceipt.reversible, true);
    assert.equal(forestReceipt.landauerFree, true);
    assert.equal(cycleReceipt.stochasticFace.detailedBalance, true);
    assert.equal(cycleReceipt.stochasticFace.rowsSumToOne, true);
    assert.equal(cycleReceipt.stochasticFace.stationary, true);
    assert.equal(cycleReceipt.reversibleIsLandauerFree, true);
    assert.deepEqual(evaluateRunTerm(coordinationCohomology.landauerEntropy, cycleReceipt), cycleReceipt);
  });

  it("normalizes the combined coordination-cohomology receipt as RMN data", () => {
    const receipt = analysis.coordinationCohomology.receipt();

    assert.equal(receipt.kind, "coordinationCohomology.receipt:witness");
    assert.equal(receipt.cycle.coordinationCost, 1);
    assert.equal(receipt.forest.coordinationFree, true);
    assert.equal(receipt.landauer.bits, 1);
    assert.equal(receipt.landauer.equalsCoordinationCost, true);
    assert.equal(receipt.openFrontier.length, 4);
    assert.deepEqual(evaluateRunTerm(coordinationCohomology.receipt, receipt), receipt);
  });
});
