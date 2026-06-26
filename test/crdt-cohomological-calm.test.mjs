/**
 * Contract: CRDT/CALM exposes finite H1-vanishing convergence facts,
 * order-independent merge, confluence by knowledge join, cosettling overlap
 * gluing, and RMN normalization.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  crdtCalm,
  evaluateRunTerm,
  valuationFiberCarrier,
} from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

describe("analysis.crdtCalm: finite CRDT/CALM receipts", () => {
  it("merges equal-membership delta lists independently of order and multiplicity", () => {
    const receipt = analysis.crdtCalm.mergeOrderIndependentReceipt(
      ["potential", "active", "potential"],
      ["active", "potential"],
    );

    assert.equal(receipt.leftMerge, "stable");
    assert.equal(receipt.rightMerge, "stable");
    assert.equal(receipt.orderIndependent, true);
    assert.throws(() => analysis.crdtCalm.mergeOrderIndependentReceipt(["potential"], ["active"]), /equal membership/u);
  });

  it("witnesses predicatory confluence by knowledge join", () => {
    const left = valuationFiberCarrier(["p", "q"], { p: "potential", q: "absurd" });
    const right = valuationFiberCarrier(["p", "q"], { p: "absurd", q: "active" });
    const receipt = analysis.crdtCalm.confluenceReceipt(left, right);

    assert.equal(receipt.kind, "crdtCalm.confluence:witness");
    assert.equal(receipt.leftLeJoin, true);
    assert.equal(receipt.rightLeJoin, true);
    assert.equal(receipt.join.values.p, "potential");
    assert.equal(receipt.join.values.q, "active");
  });

  it("packages finite convergence, monotone coordination-free, and overlap-gluing facts", () => {
    const convergence = analysis.crdtCalm.calmConvergenceFactsReceipt();
    const monotone = analysis.crdtCalm.monotoneCoordinationFreeReceipt();
    const overlap = analysis.crdtCalm.mayerVietorisOverlapReceipt();

    assert.equal(convergence.h1VanishesFinite, true);
    assert.equal(convergence.quiescentIffClosureFixed, true);
    assert.equal(convergence.biconditionalFrontier, "proof-side genuine CALM equivalence");
    assert.equal(monotone.orbitMonotone, true);
    assert.equal(monotone.coordinationFree, true);
    assert.equal(overlap.overlapJoinClosed, true);
    assert.equal(overlap.cosettling.joinClosed, true);
  });

  it("normalizes the combined CRDT/CALM receipt as RMN data", () => {
    const receipt = analysis.crdtCalm.receipt();

    assert.equal(receipt.kind, "crdtCalm.receipt:witness");
    assert.equal(receipt.openFrontier.length, 3);
    assert.deepEqual(evaluateRunTerm(crdtCalm.receipt, receipt), receipt);
  });
});
