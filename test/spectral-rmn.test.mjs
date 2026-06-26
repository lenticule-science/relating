/**
 * Contract: exact polynomial and matrix spectral receipts are RMN-normalizable.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { evaluateRunTerm, spectralTerms } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

function jsonCarrier(value) {
  return JSON.parse(JSON.stringify(value));
}

const fibonacciPolynomial = () => analysis.integerPolynomial([
  analysis.fromInt(-1),
  analysis.fromInt(-1),
  analysis.fromInt(1),
]);

describe("spectral RMN terms", () => {
  it("normalizes exact root-location, Pisot, inversion, and Mahler receipts", () => {
    const polynomial = fibonacciPolynomial();
    const location = analysis.rootLocation(polynomial);
    const pisot = analysis.pisotRoot(polynomial);
    const selfReciprocity = analysis.selfReciprocity(polynomial);
    const intersection = analysis.rootIntersection(polynomial, analysis.polyReciprocal(polynomial));
    const inversion = analysis.inversionSymmetry(polynomial);
    const iterations = analysis.fromCount(4);
    const convergence = analysis.dominantRootConvergence(polynomial, iterations);
    const mahler = analysis.mahlerMeasure(polynomial, iterations);

    assert.equal(location.kind, "spectral.rootLocation:witness");
    assert.equal(pisot.kind, "spectral.pisotRoot:witness");
    assert.equal(selfReciprocity.kind, "spectral.polynomialIdentity-obstruction");
    assert.equal(intersection.kind, "spectral.polynomialRootIntersection-obstruction");
    assert.equal(inversion.kind, "spectral.polynomialInversionSymmetry");
    assert.equal(convergence.kind, "spectral.dominantRootConvergence:witness");
    assert.equal(mahler.kind, "spectral.mahlerMeasure.dominantRoot:witness");

    assert.deepEqual(evaluateRunTerm(spectralTerms.rootLocation, location), jsonCarrier(location));
    assert.deepEqual(evaluateRunTerm(spectralTerms.pisotRoot, pisot), jsonCarrier(pisot));
    assert.deepEqual(evaluateRunTerm(spectralTerms.polynomialIdentity, selfReciprocity), jsonCarrier(selfReciprocity));
    assert.deepEqual(evaluateRunTerm(spectralTerms.rootIntersection, intersection), jsonCarrier(intersection));
    assert.deepEqual(evaluateRunTerm(spectralTerms.inversionSymmetry, inversion), jsonCarrier(inversion));
    assert.deepEqual(evaluateRunTerm(spectralTerms.dominantRootConvergence, convergence), jsonCarrier(convergence));
    assert.deepEqual(evaluateRunTerm(spectralTerms.mahlerMeasure, mahler), jsonCarrier(mahler));
  });

  it("normalizes exact matrix-Pisot spectral receipts", () => {
    const matrix = analysis.fromInts([
      [0, 1],
      [1, 1],
    ]);
    const receipt = analysis.matrixPisot(matrix);

    assert.equal(receipt.kind, "spectral.matrixPisot.carrier");
    assert.deepEqual(receipt.polynomial.map(analysis.toInt), [-1, -1, 1]);
    assert.equal(receipt.roots.kind, "spectral.pisotRoot:witness");
    assert.deepEqual(evaluateRunTerm(spectralTerms.matrixPisot, receipt), jsonCarrier(receipt));
  });
});
