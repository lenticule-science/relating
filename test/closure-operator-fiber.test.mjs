/**
 * Contract: RelMath.Closure.ClosureOperatorFiber and the finite cosettling
 * fragment are exposed as explicit FOUR closure tables lifted over valuation
 * fibers.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  chargeClosureCarrier,
  chargeOrbit,
  closureFamily,
  closureMonadReceipt,
  closureOrbit,
  cosettlingReceipt,
  evaluateRunTerm,
  knowledgeJoinClosure,
  liftClosure,
  pointwiseClosureFamilyReceipt,
  reindexMapCarrier,
  settleStep,
  valuationFiberCarrier,
  valuationKnowledgeJoin,
} from "@emsenn/relating";

describe("closure operator fiber: finite pointwise Closure lift", () => {
  it("admits only inflationary monotone idempotent charge closures", () => {
    assert.throws(() => chargeClosureCarrier("bad", {
      absurd: "absurd",
      potential: "potential",
      active: "absurd",
      stable: "stable",
    }), /not inflationary/);

    const closure = knowledgeJoinClosure("potential");
    assert.equal(closure.operation.absurd, "potential");
    assert.equal(closure.operation.potential, "potential");
    assert.equal(closure.operation.active, "stable");
    assert.equal(closure.operation.stable, "stable");
  });

  it("lifts a charge closure pointwise and checks C-naturality, merge, lfp, and orbit laws", () => {
    const closure = knowledgeJoinClosure("potential");
    const seed = valuationFiberCarrier(["a", "b"], {
      a: "absurd",
      b: "active",
    });
    const map = reindexMapCarrier(["x", "y"], ["a", "b"], {
      x: "a",
      y: "b",
    });

    const receipt = pointwiseClosureFamilyReceipt(closure, seed, map, seed);

    assert.deepEqual(receipt.closed.values, { a: "potential", b: "stable" });
    assert.equal(receipt.liftInflationary, true);
    assert.equal(receipt.liftMonotone, true);
    assert.equal(receipt.liftIdempotent, true);
    assert.equal(receipt.noPeriodicOrbits, true);
    assert.equal(receipt.cNatural, true);
    assert.equal(receipt.closureMerge, true);
    assert.equal(receipt.lfpIsSettled, true);
    assert.equal(receipt.lfpReachedByThree, true);
    assert.equal(receipt.orbitMonotone, true);
    assert.equal(receipt.quiescentIffFixed, true);
    assert.deepEqual(receipt.cNaturalLeft.values, { x: "potential", y: "stable" });
    assert.deepEqual(receipt.cNaturalRight.values, { x: "potential", y: "stable" });
    assert.deepEqual(closureOrbit(closure, seed, 2).map((step) => step.values), [
      { a: "absurd", b: "active" },
      { a: "potential", b: "stable" },
      { a: "potential", b: "stable" },
    ]);
  });

  it("models cosettling as a finite join-subsemilattice with top", () => {
    const closure = knowledgeJoinClosure("potential");
    const top = valuationFiberCarrier(["a", "b"], {
      a: "potential",
      b: "stable",
    });
    const receipt = cosettlingReceipt(closure, top);

    assert.equal(receipt.containment, true);
    assert.equal(receipt.maximum, true);
    assert.equal(receipt.joinClosed, true);
    assert.equal(receipt.joinSubsemilatticeWithTop, true);
    assert.equal(receipt.preimages.some((fiber) => fiber.values.a === "absurd" && fiber.values.b === "active"), true);
    assert.deepEqual(valuationKnowledgeJoin(receipt.preimages[0], top).values, top.values);
  });

  it("packages the finite ClosureMonad settling endofunctor", () => {
    const closure = knowledgeJoinClosure("potential");

    assert.equal(settleStep(closure, "active", "absurd"), "stable");
    assert.deepEqual(chargeOrbit((value) => settleStep(closure, "active", value), "absurd", 4), [
      "absurd",
      "stable",
      "stable",
      "stable",
      "stable",
    ]);

    const receipt = closureMonadReceipt(closure, "active", "absurd");

    assert.equal(receipt.settled, "stable");
    assert.equal(receipt.kzIffStrict, true);
    assert.equal(receipt.noPeriodicOrbits, true);
    assert.equal(receipt.settleStepInflationary, true);
    assert.equal(receipt.settleStepSettlesByThree, true);
    assert.equal(receipt.unitInflationary, true);
    assert.equal(receipt.multiplicationIdempotent, true);
    assert.equal(receipt.counitTriangle, true);
    assert.deepEqual(evaluateRunTerm(closureFamily.monad, receipt), receipt);
  });

  it("normalizes pointwise closure, cosettling, and monad receipts as RMN data", () => {
    const closure = knowledgeJoinClosure("potential");
    const seed = valuationFiberCarrier(["a"], { a: "absurd" });
    const pointwise = pointwiseClosureFamilyReceipt(closure, seed);
    const cosettling = cosettlingReceipt(closure, liftClosure(closure, seed));
    const monad = closureMonadReceipt(closure, "active", "absurd");

    assert.deepEqual(evaluateRunTerm(closureFamily.pointwise, pointwise), pointwise);
    assert.deepEqual(evaluateRunTerm(closureFamily.cosettling, cosettling), cosettling);
    assert.deepEqual(evaluateRunTerm(closureFamily.monad, monad), monad);
  });
});
