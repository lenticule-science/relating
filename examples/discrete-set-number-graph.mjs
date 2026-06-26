import { discreteTerms, evaluateRunTerm } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

const powerset = analysis.discrete.powersetReceipt(["a", "b", "c"], ["a", "b"], ["b", "c"]);
const nat = analysis.discrete.natSemiringReceipt(8);
const graph = analysis.discrete.directedGraph(["root", "left", "right"], [
  ["root", "left"],
  ["root", "right"],
]);
const handshake = analysis.discrete.directedHandshakeReceipt(graph);
const dag = analysis.discrete.topologicalDagReceipt(graph, { root: 0, left: 1, right: 1 });
const tree = analysis.discrete.treeCountReceipt(graph);

console.log(JSON.stringify({
  powerset: evaluateRunTerm(discreteTerms.powerset, powerset).intersection.members,
  natSemiring: evaluateRunTerm(discreteTerms.natSemiring, nat).checkedThrough,
  handshake: {
    edges: handshake.edgeCount,
    indegree: evaluateRunTerm(discreteTerms.directedHandshake, handshake).sumIndegree,
    outdegree: handshake.sumOutdegree,
  },
  dag: evaluateRunTerm(discreteTerms.topologicalDag, dag).dag,
  tree: evaluateRunTerm(discreteTerms.treeCount, tree).spanningCount,
}, null, 2));
