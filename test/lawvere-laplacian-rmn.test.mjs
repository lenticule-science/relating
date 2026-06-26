/**
 * Contract: finite Lawvere-Laplacian analysis exposes exact graph, harmonic,
 * spectrum, Hodge, balance, and diffusion carriers as RMN-normalizable receipts.
 */
import { describe, it } from "node:test";
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

const alpha = token(mark("laplace-alpha"));
const beta = token(mark("laplace-beta"));
const gamma = token(mark("laplace-gamma"));
const relates = predicateOfClaim(claim(mark("relates")));

const cycleCells = [
  cell(alpha, relates, beta),
  cell(beta, relates, gamma),
  cell(gamma, relates, alpha),
];

describe("Lawvere Laplacian RMN terms", () => {
  it("normalizes finite relation-graph and exact spectral carriers", () => {
    const graph = analysis.relationGraphOfCells(cycleCells);
    const matrix = analysis.laplacianOf(graph);
    const polynomial = analysis.spectrumPolynomial(graph);
    const spectrum = analysis.graphSpectrum(3, [[0, 1], [1, 2], [2, 0]]);
    const hodge = analysis.hodgeDecomposition(graph);

    assert.equal(graph.kind, "meme-analysis.laplacian.graph");
    assert.equal(analysis.toCount(spectrum.components), 1);
    assert.equal(analysis.toInt(spectrum.spanningTrees), 3);
    assert.equal(analysis.toCount(hodge.edges), 3);
    assert.equal(analysis.toCount(hodge.exact), 2);
    assert.equal(analysis.toCount(hodge.harmonic), 1);

    assert.deepEqual(evaluateRunTerm(laplacianTerms.relationGraph, graph), jsonCarrier(graph));
    assert.deepEqual(evaluateRunTerm(laplacianTerms.matrix, matrix), jsonCarrier(matrix));
    assert.deepEqual(evaluateRunTerm(laplacianTerms.spectrumPolynomial, polynomial), jsonCarrier(polynomial));
    assert.deepEqual(evaluateRunTerm(laplacianTerms.graphSpectrum, spectrum), jsonCarrier(spectrum));
    assert.deepEqual(evaluateRunTerm(laplacianTerms.hodgeDecomposition, hodge), jsonCarrier(hodge));
  });

  it("normalizes harmonic witnesses, obstructions, signed balance, and diffusion directions", () => {
    const graph = analysis.relationGraphOfCells(cycleCells);
    const harmonic = analysis.harmonic(graph, [analysis.ratZero, analysis.ratZero, analysis.ratZero]);
    const obstructed = analysis.harmonic(graph, [analysis.ratZero, analysis.ratOne, analysis.ratZero]);
    const balance = analysis.signedBalance(3, [[0, 1, true], [1, 2, true], [2, 0, false]]);
    const directions = analysis.diffusionDirections(
      analysis.weightsOfEdges(3, [[0, 1], [1, 2]]),
      [analysis.fromInt(-1), analysis.fromInt(1), analysis.fromInt(1)],
    );

    assert.equal(harmonic.kind, "meme-analysis.laplacian.harmonic:witness");
    assert.equal(obstructed.kind, "meme-analysis.laplacian.harmonic-obstruction");
    assert.equal(balance.kind, "meme-analysis.laplacian.signed-balance");
    assert.equal(balance.balanced, false);
    assert.equal(balance.frustration, 1);
    assert.deepEqual(directions.map(analysis.toInt), [1, 1, 1]);

    assert.deepEqual(evaluateRunTerm(laplacianTerms.harmonic, harmonic), jsonCarrier(harmonic));
    assert.deepEqual(evaluateRunTerm(laplacianTerms.harmonic, obstructed), jsonCarrier(obstructed));
    assert.deepEqual(evaluateRunTerm(laplacianTerms.signedBalance, balance), jsonCarrier(balance));
    assert.deepEqual(evaluateRunTerm(laplacianTerms.diffusionDirections, directions), jsonCarrier(directions));
  });
});
