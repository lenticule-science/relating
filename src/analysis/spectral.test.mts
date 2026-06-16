import test from "node:test";
import assert from "node:assert/strict";
import {
  fromInteger,
  natEqual,
  natOne,
  natZero,
  ratEqual,
  ratOne,
} from "../algebra/index.mjs";
import { fromCount, fromInts, fromRatio, toInt } from "../codecs/index.mjs";
import { polyFromInts, polyToInts } from "../codecs/spectral.mjs";
import {
  dominantRootConvergence,
  inversionSymmetry,
  mahlerMeasure,
  matrixPisot,
  mobius,
  pisotRoot,
  polyDegree,
  polynomialIdentity,
  polyReciprocal,
  resultant,
  rightHalfPlaneRoots,
  rootIntersection,
  rootLocation,
  selfReciprocity,
} from "./spectral.mjs";

test("spectral carries inversion and root-location reads over number carriers", () => {
  const fib = polyFromInts([-1, -1, 1]);
  const reciprocalPair = polyFromInts([1, -3, 1]);
  const onCircle = polyFromInts([-1, 0, 1]);
  const cyclotomic = polyFromInts([1, 1, 1]);
  const mobiusFib = mobius(fib);
  const fibLocation = rootLocation(fib);
  const fibRightHalfPlaneRoots = rightHalfPlaneRoots(mobiusFib.map(fromInteger));
  const fibConvergence = dominantRootConvergence(fib, fromCount(6));
  const fibMahler = mahlerMeasure(fib, fromCount(6));
  const cyclotomicMahler = mahlerMeasure(cyclotomic);
  const nonPisotMahler = mahlerMeasure(polyFromInts([-4, 0, 1]));

  assert.deepEqual(polyToInts(polyReciprocal(fib)), [1, -1, -1]);
  assert.equal(polynomialIdentity(polyReciprocal(polyReciprocal(fib)), fib).kind, "spectral.polynomialIdentity:witness");
  assert.equal(natEqual(polyDegree(polyFromInts([1, 2, 0, 0])), natOne), true);
  assert.equal(selfReciprocity(fib).kind, "spectral.polynomialIdentity-obstruction");
  assert.equal(selfReciprocity(reciprocalPair).kind, "spectral.polynomialIdentity:witness");
  assert.equal(inversionSymmetry(fib).rootIntersection.kind, "spectral.polynomialRootIntersection-obstruction");
  assert.equal(inversionSymmetry(reciprocalPair).rootIntersection.kind, "spectral.polynomialRootIntersection:witness");
  assert.equal(inversionSymmetry(onCircle).rootIntersection.kind, "spectral.polynomialRootIntersection:witness");
  assert.equal(inversionSymmetry(cyclotomic).rootIntersection.kind, "spectral.polynomialRootIntersection:witness");
  assert.equal(rootIntersection(fib, fib).kind, "spectral.polynomialRootIntersection:witness");
  assert.equal(rootIntersection(fib, polyFromInts([1, 1, 1])).kind, "spectral.polynomialRootIntersection-obstruction");
  assert.equal(toInt(resultant(polyFromInts([2, -3, 1]), polyFromInts([6, -5, 1]))), 0);
  assert.deepEqual(polyToInts(mobiusFib), [-1, 4, 1]);
  assert.equal(fibRightHalfPlaneRoots.kind, "spectral.rightHalfPlaneRoot:witness");
  if (fibRightHalfPlaneRoots.kind === "spectral.rightHalfPlaneRoot:witness") {
    assert.equal(natEqual(fibRightHalfPlaneRoots.rhp, natOne), true);
  }
  assert.equal(fibLocation.kind, "spectral.rootLocation:witness");
  if (fibLocation.kind === "spectral.rootLocation:witness") {
    assert.equal(natEqual(fibLocation.expanding, natOne), true);
    assert.equal(natEqual(fibLocation.contracting, natOne), true);
    assert.equal(natEqual(fibLocation.neutral, natZero), true);
  }
  assert.equal(pisotRoot(fib).kind, "spectral.pisotRoot:witness");
  assert.equal(pisotRoot(polyFromInts([-4, 0, 1])).kind, "spectral.pisotRoot-obstruction");
  assert.equal(rootLocation(onCircle).kind, "spectral.rootLocation-obstruction");
  assert.equal(fibConvergence.kind, "spectral.dominantRootConvergence:witness");
  if (fibConvergence.kind === "spectral.dominantRootConvergence:witness") {
    assert.equal(natEqual(fibConvergence.iterations, fromCount(6)), true);
    assert.equal(ratEqual(fibConvergence.value, fromRatio(13, 8)), true);
  }
  assert.equal(fibMahler.kind, "spectral.mahlerMeasure.dominantRoot:witness");
  if (fibMahler.kind === "spectral.mahlerMeasure.dominantRoot:witness") {
    assert.equal(fibMahler.convergence.kind, "spectral.dominantRootConvergence:witness");
    assert.equal(ratEqual(fibMahler.value, fibMahler.convergence.value), true);
  }
  assert.equal(cyclotomicMahler.kind, "spectral.mahlerMeasure.unit:witness");
  if (cyclotomicMahler.kind === "spectral.mahlerMeasure.unit:witness") {
    assert.equal(cyclotomicMahler.selfReciprocity.kind, "spectral.polynomialIdentity:witness");
    assert.equal(cyclotomicMahler.location.kind, "spectral.rootLocation-obstruction");
    assert.equal(ratEqual(cyclotomicMahler.value, ratOne), true);
  }
  assert.equal(nonPisotMahler.kind, "spectral.mahlerMeasure.pisot-obstruction");
});

test("matrixPisot is a spectral read of a substitution incidence matrix", () => {
  const integerMatrix = fromInts([[1, 1], [1, 0]]);
  const pisotMatrix = matrixPisot(integerMatrix);
  assert.equal(pisotMatrix.kind, "spectral.matrixPisot.carrier");
  assert.equal(pisotMatrix.roots.kind, "spectral.pisotRoot:witness");
  if (pisotMatrix.roots.kind === "spectral.pisotRoot:witness") {
    assert.equal(natEqual(pisotMatrix.roots.location.expanding, natOne), true);
  }
});
