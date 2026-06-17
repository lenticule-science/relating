import test from "node:test";
import assert from "node:assert/strict";
import type { SectionCarrier } from "../articulating/predicating/positing/settling/index.mjs";
import { cell, charge, chargeValue, claim, mark, predicateOfClaim, token, type Cell } from "../algebra/index.mjs";
import { ratFromInt, toCount, toInt, toNumber } from "../codecs/index.mjs";
import {
  componentCount,
  deviationOf,
  harmonic,
  relationGraph,
  spectrumPolynomial,
  treeCount,
} from "./laplacian.mjs";

const tm = (value: string) => token(mark(value));
const pr = (value: string) => predicateOfClaim(claim(mark(value)));
const related = (subject: ReturnType<typeof tm>, predicate: string, object: ReturnType<typeof tm>) =>
  cell(subject, pr(predicate), object);
const section = (cells: readonly Cell[]): SectionCarrier => Object.freeze({
  kind: "meme-topology.section.carrier" as const,
  order: "knowledge" as const,
  bound: "least" as const,
  entries: Object.freeze(cells.map((c) => Object.freeze({
    kind: "meme-topology.section.entry" as const,
    cell: c,
    charge: charge(chargeValue("potential")),
  }))),
});

const pathGraph = () => {
  const a = tm("a");
  const b = tm("b");
  const c = tm("c");
  return relationGraph(section([
    related(a, "touches", b),
    related(b, "touches", c),
  ]));
};

test("the relation graph weighs term pairs by how many cells relate them", () => {
  const graph = pathGraph();
  assert.equal(graph.terms.length, 3);
  assert.deepEqual(graph.weights.map((row) => row.map(toInt)), [[0, 1, 0], [1, 0, 1], [0, 1, 0]]);

  const a = tm("a");
  const b = tm("b");
  const doubled = relationGraph(section([
    related(a, "touches", b),
    related(a, "holds", b),
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
  const a = tm("a");
  const b = tm("b");
  const c = tm("c");
  const d = tm("d");
  const split = relationGraph(section([
    related(a, "touches", b),
    related(c, "touches", d),
  ]));
  assert.equal(toCount(componentCount(split)), 2);
  assert.equal(toInt(treeCount(split)), 0);
});

test("tree count is the Matrix-Tree determinant", () => {
  assert.equal(toInt(treeCount(pathGraph())), 1);
  const a = tm("a");
  const b = tm("b");
  const doubled = relationGraph(section([
    related(a, "touches", b),
    related(a, "holds", b),
  ]));
  assert.equal(toInt(treeCount(doubled)), 2);
});

test("reflexive cells are not edges; a lone term still has the empty tree", () => {
  const a = tm("a");
  const reflexive = relationGraph(section([related(a, "is", a)]));
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
