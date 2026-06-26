/**
 * Contract: finite set/number/graph receipts mirror
 * RelMath.Order.SetNumberGraphTheory and normalize through RMN.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { discreteTerms, evaluateRunTerm } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

describe("analysis.discrete: finite powerset, Nat, and graph receipts", () => {
  it("checks powerset Boolean laws, Kuratowski equality, and equivalence partitions", () => {
    const powerset = analysis.discrete.powersetReceipt(["a", "b", "c"], ["a", "b"], ["b", "c"]);
    const pairEqual = analysis.discrete.kuratowskiPairReceipt("a", "b", "a", "b");
    const pairDifferent = analysis.discrete.kuratowskiPairReceipt("a", "b", "b", "a");
    const partition = analysis.discrete.equivalencePartitionReceipt(
      ["a", "b", "c"],
      [
        [true, true, false],
        [true, true, false],
        [false, false, true],
      ],
    );

    assert.equal(powerset.deMorganInter, true);
    assert.equal(powerset.deMorganUnion, true);
    assert.deepEqual(powerset.intersection.members, ["b"]);
    assert.deepEqual(powerset.union.members, ["a", "b", "c"]);
    assert.equal(pairEqual.equal, true);
    assert.equal(pairDifferent.equal, false);
    assert.equal(partition.overlapForcesEqual, true);
    assert.deepEqual(partition.classes.map((cls) => cls.members), [["a", "b"], ["c"]]);
  });

  it("checks bounded Nat semiring laws", () => {
    const receipt = analysis.discrete.natSemiringReceipt(8);

    assert.equal(receipt.kind, "discrete.natSemiring.receipt:witness");
    assert.equal(receipt.leftDistributive, true);
    assert.equal(receipt.rightDistributive, true);
    assert.equal(receipt.noAdditiveInverseOfOne, true);
  });

  it("checks directed handshake, topological DAG, and tree edge count receipts", () => {
    const graph = analysis.discrete.directedGraph(["root", "left", "right"], [
      ["root", "left"],
      ["root", "right"],
    ]);
    const handshake = analysis.discrete.directedHandshakeReceipt(graph);
    const dag = analysis.discrete.topologicalDagReceipt(graph, { root: 0, left: 1, right: 1 });
    const tree = analysis.discrete.treeCountReceipt(graph);

    assert.equal(handshake.edgeCount, 2);
    assert.equal(handshake.sumIndegree, 2);
    assert.equal(handshake.sumOutdegree, 2);
    assert.equal(handshake.outdegrees.root, 2);
    assert.equal(dag.dag, true);
    assert.equal(tree.kind, "discrete.graph.treeCount.receipt:witness");
    assert.equal(tree.edgeCountPlusOne, tree.vertexCount);
  });
});

describe("discreteTerms RMN normalizers", () => {
  it("normalizes finite set/number/graph receipts", () => {
    const powerset = analysis.discrete.powersetReceipt(["a", "b"], ["a"], ["b"]);
    const pair = analysis.discrete.kuratowskiPairReceipt("a", "b", "a", "b");
    const partition = analysis.discrete.equivalencePartitionReceipt(["a"], [[true]]);
    const nat = analysis.discrete.natSemiringReceipt(4);
    const graph = analysis.discrete.directedGraph(["a", "b"], [["a", "b"]]);
    const handshake = analysis.discrete.directedHandshakeReceipt(graph);
    const dag = analysis.discrete.topologicalDagReceipt(graph, { a: 0, b: 1 });
    const tree = analysis.discrete.treeCountReceipt(graph);

    assert.deepEqual(evaluateRunTerm(discreteTerms.powerset, powerset), powerset);
    assert.deepEqual(evaluateRunTerm(discreteTerms.kuratowskiPair, pair), pair);
    assert.deepEqual(evaluateRunTerm(discreteTerms.equivalencePartition, partition), partition);
    assert.deepEqual(evaluateRunTerm(discreteTerms.natSemiring, nat), nat);
    assert.deepEqual(evaluateRunTerm(discreteTerms.directedHandshake, handshake), handshake);
    assert.deepEqual(evaluateRunTerm(discreteTerms.topologicalDag, dag), dag);
    assert.deepEqual(evaluateRunTerm(discreteTerms.treeCount, tree), tree);
  });
});
