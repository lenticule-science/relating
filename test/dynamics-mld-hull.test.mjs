/**
 * Contract: `dynamics.mld` and `dynamics.hull` expose finite, exact readings of
 * the substitution classifier layer. MLD compares implemented colimit
 * invariants; hull checks finite coherent threads and reads the same invariant
 * at the hull/colimit seam.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import * as dynamics from "@emsenn/relating/dynamics";

const { hull, mld, recurrence } = dynamics;

describe("dynamics.mld: finite MLD-invariant comparison", () => {
  it("witnesses identical substitution matrices by their implemented invariant", () => {
    const judgment = mld.mutuallyLocallyDerivable(
      recurrence.fibonacciIncidence,
      recurrence.fibonacciIncidence,
    );

    assert.equal(judgment.kind, "substitution.dynamics.mld:witness");
    assert.deepEqual(judgment.left, judgment.right);
  });

  it("returns an obstruction when the finite invariants separate", () => {
    const judgment = mld.mutuallyLocallyDerivable(
      recurrence.fibonacciIncidence,
      recurrence.padovanIncidence,
    );

    assert.equal(judgment.kind, "substitution.dynamics.mld-obstruction");
    assert.ok(["rank", "determinant", "smith-normal-form", "localized-module"].includes(judgment.reason));
  });
});

describe("dynamics.hull: finite inverse-system thread checks", () => {
  const sameString = (left, right) => left === right;

  it("checks a coherent finite odometer thread", () => {
    const system = hull.odometerHull();
    const thread = hull.coherentThread(system, ["", "0", "01", "010"], sameString);

    assert.equal(thread.kind, "substitution.dynamics.hull.thread:witness");
    assert.deepEqual(system.stage(2), ["00", "01", "10", "11"]);
    assert.equal(hull.threadsSeparated(["", "0", "01"], ["", "0", "01"], sameString), true);
  });

  it("names the first finite stage where a thread fails coherence", () => {
    const system = hull.odometerHull();
    const thread = hull.coherentThread(system, ["", "1", "00"], sameString);

    assert.equal(thread.kind, "substitution.dynamics.hull.thread-obstruction");
    assert.equal(thread.atStage, 1);
    assert.equal(thread.expected, "0");
    assert.equal(thread.found, "1");
  });

  it("reads the same finite invariant at the hull/colimit seam", () => {
    assert.deepEqual(
      hull.hullSeam(recurrence.fibonacciIncidence),
      mld.mldInvariant(recurrence.fibonacciIncidence),
    );
  });
});
