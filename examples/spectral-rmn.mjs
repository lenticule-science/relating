import assert from "node:assert/strict";

import { evaluateRunTerm, spectralTerms } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

function jsonCarrier(value) {
  return JSON.parse(JSON.stringify(value));
}

const polynomial = analysis.integerPolynomial([
  analysis.fromInt(-1),
  analysis.fromInt(-1),
  analysis.fromInt(1),
]);

const matrix = analysis.fromInts([
  [0, 1],
  [1, 1],
]);

const rootLocation = analysis.rootLocation(polynomial);
const pisot = analysis.pisotRoot(polynomial);
const inversion = analysis.inversionSymmetry(polynomial);
const iterations = analysis.fromCount(4);
const convergence = analysis.dominantRootConvergence(polynomial, iterations);
const mahler = analysis.mahlerMeasure(polynomial, iterations);
const matrixPisot = analysis.matrixPisot(matrix);

assert.equal(rootLocation.kind, "spectral.rootLocation:witness");
assert.equal(pisot.kind, "spectral.pisotRoot:witness");
assert.equal(mahler.kind, "spectral.mahlerMeasure.dominantRoot:witness");
assert.equal(matrixPisot.roots.kind, "spectral.pisotRoot:witness");
assert.deepEqual(evaluateRunTerm(spectralTerms.rootLocation, rootLocation), jsonCarrier(rootLocation));
assert.deepEqual(evaluateRunTerm(spectralTerms.pisotRoot, pisot), jsonCarrier(pisot));
assert.deepEqual(evaluateRunTerm(spectralTerms.inversionSymmetry, inversion), jsonCarrier(inversion));
assert.deepEqual(evaluateRunTerm(spectralTerms.dominantRootConvergence, convergence), jsonCarrier(convergence));
assert.deepEqual(evaluateRunTerm(spectralTerms.mahlerMeasure, mahler), jsonCarrier(mahler));
assert.deepEqual(evaluateRunTerm(spectralTerms.matrixPisot, matrixPisot), jsonCarrier(matrixPisot));

console.log(JSON.stringify({
  product: "relating.spectral-rmn",
  polynomial: polynomial.map(analysis.toInt),
  rootLocation: rootLocation.kind,
  pisot: pisot.kind,
  inversion: {
    reciprocal: inversion.reciprocal.map(analysis.toInt),
    intersection: inversion.rootIntersection.kind,
  },
  dominantRoot: {
    kind: convergence.kind,
    iterations: analysis.toCount(convergence.iterations),
  },
  mahler: {
    kind: mahler.kind,
  },
  matrixPisot: {
    polynomial: matrixPisot.polynomial.map(analysis.toInt),
    roots: matrixPisot.roots.kind,
  },
}, null, 2));
