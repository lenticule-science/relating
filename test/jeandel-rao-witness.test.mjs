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
    assert.equal(
      receipt.decoratedPullbackBoundary,
      "phi is the pullback of b3 along the transcribed marker-domino chain map",
    );
    assert.equal(
      receipt.persistenceBoundary,
      "finite substitution tower persists b3; literal Labbe matrix identification remains residual",
    );
    assert.equal(receipt.substitutionPullback.equalsPhi, true);
    assert.equal(receipt.substitutionTower.b3NonzeroInDirectLimit, true);
    assert.equal(receipt.persistence.nonzeroAtEveryIterateByFixedPoint, true);
    assert.deepEqual(evaluateRunTerm(jeandelRaoWitness.receipt, receipt), receipt);
  });

  it("transcribes the marker-domino pullback chain map", () => {
    const pullback = analysis.jeandelRaoWitness.substitutionPullbackReceipt();

    assert.equal(pullback.theorem, "RelMath.Aperiodic.Witness.jr_substitution_pullback");
    assert.deepEqual(pullback.subEdge, {
      e0: "q0",
      e1: "q0",
      e2: "q1",
      e3: "q5",
      e4: "q0",
      e5: "q0",
    });
    assert.deepEqual(pullback.pulledBackB3.values, { e2: 1, e3: 1 });
    assert.equal(pullback.equalsPhi, true);
    assert.deepEqual(pullback.chainMapRows.map((row) => row.holds), [true, true, true]);
    assert.deepEqual(pullback.chainMapRows.map((row) => row.jrDelta), [0, 0, 0]);
    assert.deepEqual(evaluateRunTerm(jeandelRaoWitness.substitutionPullback, pullback), pullback);
  });

  it("checks the recognizability return and finite substitution tower", () => {
    const tower = analysis.jeandelRaoWitness.substitutionTowerReceipt(5);

    assert.equal(tower.theorem, "RelMath.Aperiodic.Witness.jr_substitution_tower");
    assert.deepEqual(tower.recEdge, {
      q0: "e0",
      q1: "e2",
      q2: "e2",
      q3: "e0",
      q4: "e0",
      q5: "e2",
      q6: "e0",
    });
    assert.deepEqual(tower.returnedPhi.values, { q1: 1, q2: 1, q5: 1 });
    assert.deepEqual(tower.sigmaB3.values, { q1: 1, q2: 1, q5: 1 });
    assert.equal(tower.iteratesChecked.length, 6);
    assert.equal(tower.everyCheckedIterateEqualsB3, true);
    assert.equal(tower.residualScope, "identifying sigma with the literal Labbe recognizable substitution matrix is not claimed");
    assert.deepEqual(evaluateRunTerm(jeandelRaoWitness.substitutionTower, tower), tower);
  });

  it("reduces Jeandel-Rao persistence to the finite fixed phi orbit", () => {
    const persistence = analysis.jeandelRaoWitness.persistenceReceipt(5);

    assert.equal(persistence.sourceModule, "RelMath.Aperiodic.Witness.JeandelRaoPersistence");
    assert.equal(persistence.theorem, "RelMath.Aperiodic.Witness.jeandel_rao_persistence");
    assert.deepEqual(persistence.decoratedSigmaPhi.values, { e2: 1, e3: 1 });
    assert.equal(persistence.decoratedSigmaPhiEqualsPhi, true);
    assert.equal(persistence.iteratesChecked.length, 6);
    assert.deepEqual(persistence.iteratesChecked.map((cochain) => cochain.values), [
      { e2: 1, e3: 1 },
      { e2: 1, e3: 1 },
      { e2: 1, e3: 1 },
      { e2: 1, e3: 1 },
      { e2: 1, e3: 1 },
      { e2: 1, e3: 1 },
    ]);
    assert.equal(persistence.nonzeroAtEveryIterateByFixedPoint, true);
    assert.match(persistence.frontierBoundary, /full AP direct limit/);
    assert.deepEqual(evaluateRunTerm(jeandelRaoWitness.persistence, persistence), persistence);
  });
});
