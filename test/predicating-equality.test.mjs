/**
 * Contract: RelMath.Predicating.Equality is exposed as derived diagonal
 * equality, not as a primitive equality predicate.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  chargeValueName,
  classicalEq,
  evaluateRunTerm,
  finiteFibration,
  mark,
  paraconsistentEq,
  predicating,
  predicatingEqualityReceipt,
  token,
  truthJoinList,
  truthMeetList,
  truthQuantifierReceipt,
} from "@emsenn/relating";

const alpha = token(mark("alpha"));
const beta = token(mark("beta"));

describe("predicating equality: diagonal-derived equalities", () => {
  it("derives classical and paraconsistent equality from the diagonal", () => {
    const receipt = predicatingEqualityReceipt([alpha, beta]);

    assert.equal(receipt.kind, "predicating.equality.receipt:witness");
    assert.equal(chargeValueName(classicalEq(alpha, alpha)), "potential");
    assert.equal(chargeValueName(classicalEq(alpha, beta)), "active");
    assert.equal(chargeValueName(paraconsistentEq(alpha, alpha)), "stable");
    assert.equal(chargeValueName(paraconsistentEq(alpha, beta)), "absurd");
    assert.equal(receipt.reflexiveClassical, true);
    assert.equal(receipt.reflexiveParaconsistent, true);
    assert.equal(receipt.sameSupport, true);
    assert.equal(receipt.derivedFromDiagonal, true);
  });

  it("uses truth-order bottom/top for empty truth joins and meets", () => {
    assert.equal(chargeValueName(truthJoinList([])), "active");
    assert.equal(chargeValueName(truthMeetList([])), "potential");
  });

  it("computes finite truth quantifiers over explicit fibers", () => {
    const fibration = finiteFibration(["x", "y", "empty"], [["a", "b"], ["c"], []]);
    const receipt = truthQuantifierReceipt(fibration, {
      a: "active",
      b: "stable",
      c: "potential",
    });

    assert.equal(receipt.kind, "predicating.equality.truthQuantifier:witness");
    assert.deepEqual(receipt.existsTruth, { x: "stable", y: "potential", empty: "active" });
    assert.deepEqual(receipt.forallTruth, { x: "active", y: "potential", empty: "potential" });
    assert.equal(receipt.emptyFiberExistsTruth, "active");
    assert.equal(receipt.emptyFiberForallTruth, "potential");
    assert.equal(receipt.singletonFiberIdentity, true);
    assert.equal(receipt.truthOrderAdjunctionFinite, true);
  });
});

describe("predicating equality RMN terms normalize finite receipts", () => {
  it("normalizes equality and truth-quantifier receipts", () => {
    const equality = predicatingEqualityReceipt([alpha, beta]);
    const quantifier = truthQuantifierReceipt(finiteFibration(["x"], [["a"]]), { a: "potential" });

    assert.deepEqual(evaluateRunTerm(predicating.equality, equality), equality);
    assert.deepEqual(evaluateRunTerm(predicating.truthQuantifier, quantifier), quantifier);
  });
});
