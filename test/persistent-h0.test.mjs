/**
 * Contract: finite Persistent H0 mirrors RelMath.Topology.PersistentH0.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { evaluateRunTerm, persistentH0 } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

describe("analysis.persistentH0: finite graph-filtration H0", () => {
  it("computes components that only merge along monotone edge growth", () => {
    const filtration = analysis.persistentH0.graphFiltration(["a", "b", "c", "d"], [
      [],
      [["a", "b"]],
      [["a", "b"], ["c", "d"]],
      [["a", "b"], ["c", "d"], ["b", "c"]],
    ]);
    const receipt = analysis.persistentH0.persistentH0Receipt(filtration);

    assert.equal(receipt.sourceModule, "RelMath.Topology.PersistentH0");
    assert.equal(receipt.theorems.includes("RelMath.Topology.components_only_merge"), true);
    assert.deepEqual(receipt.partitions.map((stage) => stage.componentCount), [4, 3, 2, 1]);
    assert.deepEqual(receipt.partitions.at(-1)?.components, [["a", "b", "c", "d"]]);
    assert.equal(receipt.componentsOnlyMerge, true);
    assert.equal(receipt.finiteComponentCountsNonIncreasing, true);
    assert.equal(analysis.persistentH0.pathConnected(filtration, 1, "a", "b"), true);
    assert.equal(analysis.persistentH0.pathConnected(filtration, 1, "a", "c"), false);
    assert.equal(analysis.persistentH0.pathConnected(filtration, 3, "a", "d"), true);
  });

  it("rejects non-monotone filtrations and normalizes receipts through RMN", () => {
    assert.throws(
      () => analysis.persistentH0.graphFiltration(["a", "b"], [[["a", "b"]], []]),
      /monotone non-decreasing/,
    );

    const filtration = analysis.persistentH0.graphFiltration(["a", "b"], [
      [],
      [["a", "b"]],
    ]);
    const receipt = analysis.persistentH0.persistentH0Receipt(filtration);

    assert.deepEqual(evaluateRunTerm(persistentH0.receipt, receipt), receipt);
  });
});
