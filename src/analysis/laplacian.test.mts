import test from "node:test";
import assert from "node:assert/strict";
import { induce, mark, utterance } from "../topology/index.mjs";
import { ratFromInt, toCount, toInt, toNumber } from "../algebra/index.mjs";
import {
  carrierRelationGraph,
  componentCount,
  deviationOf,
  harmonic,
  relationGraph,
  spectrumPolynomial,
  treeCount,
} from "./laplacian.mjs";

const utter = (subject: string, predicate: string, object: string) =>
  utterance(mark({ subject, object }), mark(predicate));

const pathGraph = () => carrierRelationGraph(induce([
  utter("a", "touches", "b"),
  utter("b", "touches", "c"),
]));

test("the relation graph weighs term pairs by how many cells relate them", () => {
  const graph = pathGraph();
  assert.equal(graph.terms.length, 3);
  assert.deepEqual(graph.weights.map((row) => row.map(toInt)), [[0, 1, 0], [1, 0, 1], [0, 1, 0]]);

  const doubled = carrierRelationGraph(induce([
    utter("a", "touches", "b"),
    utter("a", "holds", "b"),
  ]));
  assert.deepEqual(doubled.weights.map((row) => row.map(toInt)), [[0, 2], [2, 0]]);
});

test("the deviation operator is exact and vanishes on constants", () => {
  const graph = pathGraph();
  assert.deepEqual(deviationOf(graph, [0, 1, 2].map(ratFromInt)).map(toNumber), [-1, 0, 1]);
  assert.equal(harmonic(graph, [5, 5, 5].map(ratFromInt)).kind, "meme-analysis.laplacian.harmonic:witness");
  const judged = harmonic(graph, [0, 1, 2].map(ratFromInt));
  assert.equal(judged.kind, "meme-analysis.laplacian.harmonic-obstruction");
  if (judged.kind === "meme-analysis.laplacian.harmonic-obstruction") {
    assert.equal(toNumber(judged.deviation), -1);
  }
  assert.throws(() => deviationOf(graph, [1, 2].map(ratFromInt)), TypeError);
});

test("the spectrum polynomial is exact: path on three terms gives λ³ − 4λ² + 3λ", () => {
  const coefficients = spectrumPolynomial(pathGraph()).map((value) => toInt(value));
  assert.deepEqual(coefficients, [0, 3, -4, 1]);
});

test("component count is the zero-eigenvalue multiplicity, exactly", () => {
  assert.equal(toCount(componentCount(pathGraph())), 1);
  const split = carrierRelationGraph(induce([
    utter("a", "touches", "b"),
    utter("c", "touches", "d"),
  ]));
  assert.equal(toCount(componentCount(split)), 2);
  assert.equal(toInt(treeCount(split)), 0);
});

test("tree count is the Matrix-Tree determinant", () => {
  assert.equal(toInt(treeCount(pathGraph())), 1);
  const doubled = carrierRelationGraph(induce([
    utter("a", "touches", "b"),
    utter("a", "holds", "b"),
  ]));
  assert.equal(toInt(treeCount(doubled)), 2);
});

test("reflexive cells are not edges; a lone term still has the empty tree", () => {
  const reflexive = carrierRelationGraph(induce([utter("a", "is", "a")]));
  assert.equal(reflexive.terms.length, 1);
  assert.equal(toCount(componentCount(reflexive)), 1);
  assert.equal(toInt(treeCount(reflexive)), 1);
  assert.equal(harmonic(reflexive, [7].map(ratFromInt)).kind, "meme-analysis.laplacian.harmonic:witness");
});

test("empty sections present no relation graph", () => {
  assert.throws(() => relationGraph({
    kind: "meme-topology.section.carrier",
    order: "knowledge",
    bound: "least",
    entries: [],
  }), TypeError);
});
