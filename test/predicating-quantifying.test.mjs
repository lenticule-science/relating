/**
 * Contract: RelMath.Predicating.Quantifying/Hyperdoctrine/Dual are exposed as
 * finite fiber quantifier receipts with checked adjunction and sigma transport
 * laws.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  chargeListJoin,
  chargeListMeet,
  evaluateRunTerm,
  existsF,
  finiteConverseFibration,
  finitePredicatingFibration,
  forallF,
  predicating,
  predicatingDualHyperdoctrineReceipt,
  predicatingHyperdoctrineReceipt,
  predicatingQuantifyingReceipt,
  reindexF,
  swapValuation,
} from "@emsenn/relating";

describe("predicating quantifying: finite fiber joins, meets, and adjunctions", () => {
  it("uses the Lean empty-list bounds in both orders", () => {
    assert.equal(chargeListJoin("knowledge", []), "absurd");
    assert.equal(chargeListMeet("knowledge", []), "stable");
    assert.equal(chargeListJoin("truth", []), "active");
    assert.equal(chargeListMeet("truth", []), "potential");
  });

  it("derives fibers from a total base map and computes quantifiers", () => {
    const fibration = finitePredicatingFibration(["a", "b", "c"], ["x", "y", "empty"], {
      a: "x",
      b: "x",
      c: "y",
    });
    const valuation = { a: "potential", b: "active", c: "stable" };
    const receipt = predicatingQuantifyingReceipt(fibration, valuation);

    assert.deepEqual(fibration.fibers, { x: ["a", "b"], y: ["c"], empty: [] });
    assert.deepEqual(existsF(fibration, valuation, "knowledge"), { x: "stable", y: "stable", empty: "absurd" });
    assert.deepEqual(forallF(fibration, valuation, "knowledge"), { x: "absurd", y: "stable", empty: "stable" });
    assert.deepEqual(existsF(fibration, valuation, "truth"), { x: "potential", y: "stable", empty: "active" });
    assert.deepEqual(forallF(fibration, valuation, "truth"), { x: "active", y: "stable", empty: "potential" });
    assert.equal(receipt.knowledgeAdjunctionFinite, true);
    assert.equal(receipt.truthAdjunctionFinite, true);
    assert.equal(receipt.singletonFiberIdentityKnowledge, true);
    assert.equal(receipt.singletonFiberIdentityTruth, true);
  });

  it("normalizes the quantifier receipt as RMN data", () => {
    const fibration = finitePredicatingFibration(["a"], ["x"], { a: "x" });
    const receipt = predicatingQuantifyingReceipt(fibration, { a: "stable" });

    assert.deepEqual(evaluateRunTerm(predicating.quantifying, receipt), receipt);
  });
});

describe("predicating hyperdoctrine: converse is its own adjoint", () => {
  it("checks the finite converse hyperdoctrine laws", () => {
    const converse = finiteConverseFibration(["ab", "ba", "aa"], {
      ab: "ba",
      ba: "ab",
      aa: "aa",
    });
    const valuation = { ab: "potential", ba: "active", aa: "stable" };
    const receipt = predicatingHyperdoctrineReceipt(converse, valuation);

    assert.deepEqual(reindexF(converse, valuation), { ab: "active", ba: "potential", aa: "stable" });
    assert.deepEqual(receipt.reindexedTwice, valuation);
    assert.equal(receipt.baseIsoInvolution, true);
    assert.equal(receipt.converseExistsIsReindexKnowledge, true);
    assert.equal(receipt.converseForallIsReindexKnowledge, true);
    assert.equal(receipt.converseFrobeniusKnowledge, true);
    assert.equal(receipt.converseFrobeniusTruth, true);
    assert.deepEqual(evaluateRunTerm(predicating.hyperdoctrine, receipt), receipt);
  });
});

describe("predicating hyperdoctrine dual: sigma transports knowledge laws to truth laws", () => {
  it("checks conjugated quantifiers against truth-order quantifiers", () => {
    const fibration = finitePredicatingFibration(["a", "b"], ["x"], { a: "x", b: "x" });
    const valuation = { a: "potential", b: "active" };
    const receipt = predicatingDualHyperdoctrineReceipt(fibration, valuation);

    assert.deepEqual(swapValuation(valuation), { a: "stable", b: "absurd" });
    assert.deepEqual(receipt.conjExists, receipt.existsTruth);
    assert.deepEqual(receipt.conjForall, receipt.forallTruth);
    assert.equal(receipt.swapInvolutive, true);
    assert.equal(receipt.dualAdjointSystemFinite, true);
    assert.deepEqual(evaluateRunTerm(predicating.dualHyperdoctrine, receipt), receipt);
  });
});
