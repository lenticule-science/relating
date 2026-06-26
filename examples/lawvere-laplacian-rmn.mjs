import assert from "node:assert/strict";

import {
  cell,
  claim,
  evaluateRunTerm,
  laplacianTerms,
  mark,
  predicateOfClaim,
  token,
} from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

function jsonCarrier(value) {
  return JSON.parse(JSON.stringify(value));
}

const a = token(mark("a"));
const b = token(mark("b"));
const c = token(mark("c"));
const relates = predicateOfClaim(claim(mark("relates")));

const cycle = [
  cell(a, relates, b),
  cell(b, relates, c),
  cell(c, relates, a),
];

const graph = analysis.relationGraphOfCells(cycle);
const harmonic = analysis.harmonic(graph, [analysis.ratZero, analysis.ratZero, analysis.ratZero]);
const obstruction = analysis.harmonic(graph, [analysis.ratZero, analysis.ratOne, analysis.ratZero]);
const hodge = analysis.hodgeDecomposition(graph);
const spectrum = analysis.graphSpectrum(3, [[0, 1], [1, 2], [2, 0]]);
const balance = analysis.signedBalance(3, [[0, 1, true], [1, 2, true], [2, 0, false]]);

assert.equal(harmonic.kind, "meme-analysis.laplacian.harmonic:witness");
assert.equal(obstruction.kind, "meme-analysis.laplacian.harmonic-obstruction");
assert.equal(analysis.toCount(hodge.harmonic), 1);
assert.equal(analysis.toInt(spectrum.spanningTrees), 3);
assert.equal(balance.frustration, 1);
assert.deepEqual(evaluateRunTerm(laplacianTerms.relationGraph, graph), jsonCarrier(graph));
assert.deepEqual(evaluateRunTerm(laplacianTerms.harmonic, harmonic), jsonCarrier(harmonic));
assert.deepEqual(evaluateRunTerm(laplacianTerms.harmonic, obstruction), jsonCarrier(obstruction));
assert.deepEqual(evaluateRunTerm(laplacianTerms.hodgeDecomposition, hodge), jsonCarrier(hodge));
assert.deepEqual(evaluateRunTerm(laplacianTerms.graphSpectrum, spectrum), jsonCarrier(spectrum));
assert.deepEqual(evaluateRunTerm(laplacianTerms.signedBalance, balance), jsonCarrier(balance));

console.log(JSON.stringify({
  product: "relating.lawvere-laplacian-rmn",
  relationGraph: {
    vertices: graph.terms.length,
    laplacianPolynomialDegree: analysis.spectrumPolynomial(graph).length - 1,
  },
  harmonic: {
    witness: evaluateRunTerm(laplacianTerms.harmonic, harmonic).kind,
    obstruction: evaluateRunTerm(laplacianTerms.harmonic, obstruction).kind,
  },
  hodge: {
    edges: analysis.toCount(hodge.edges),
    exact: analysis.toCount(hodge.exact),
    harmonic: analysis.toCount(hodge.harmonic),
  },
  spectrum: {
    components: analysis.toCount(spectrum.components),
    spanningTrees: analysis.toInt(spectrum.spanningTrees),
  },
  signedBalance: {
    balanced: balance.balanced,
    frustration: balance.frustration,
  },
}, null, 2));
