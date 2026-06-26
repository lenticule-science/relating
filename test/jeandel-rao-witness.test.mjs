/**
 * Contract: the Jeandel-Rao finite witness surface computes the two one-vertex
 * AP cohomology witnesses and keeps the persistence theorem outside runtime.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  evaluateRunTerm,
  jeandelRaoWitness,
} from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

const natSize = (n) => n.members.length;

describe("analysis.jeandelRaoWitness: finite AP cohomology witnesses", () => {
  it("checks the decorated phi cocycle as a nonzero one-vertex H1 class", () => {
    const witness = analysis.jeandelRaoWitness.decoratedPhiWitness();

    assert.equal(witness.kind, "jeandelRao.nonzeroH1:witness");
    assert.deepEqual(witness.delta1, [0, 0, 0]);
    assert.equal(witness.isCocycle, true);
    assert.equal(witness.nonzeroEdge, "e2");
    assert.equal(witness.nonzeroValue, 1);
    assert.equal(witness.representsNonzeroH1, true);
    assert.equal(natSize(witness.h1Rank), 4);
  });

  it("checks the marker-ring b3 cocycle and rank-five H1 claim", () => {
    const witness = analysis.jeandelRaoWitness.markerRingB3Witness();

    assert.deepEqual(witness.delta1, [0, 0, 0, 0]);
    assert.equal(witness.nonzeroEdge, "q1");
    assert.equal(witness.nonzeroValue, 1);
    assert.equal(natSize(witness.h1Rank), 5);
    assert.equal(witness.h1RankMatchesLeanClaim, true);
  });

  it("normalizes the combined witness receipt as RMN data", () => {
    const receipt = analysis.jeandelRaoWitness.receipt();

    assert.equal(receipt.kind, "jeandelRao.receipt:witness");
    assert.equal(receipt.decoratedPhi.representsNonzeroH1, true);
    assert.equal(receipt.markerRingB3.representsNonzeroH1, true);
    assert.equal(receipt.persistenceBoundary, "open thm:jeandel-rao-persistence");
    assert.deepEqual(evaluateRunTerm(jeandelRaoWitness.receipt, receipt), receipt);
  });
});
