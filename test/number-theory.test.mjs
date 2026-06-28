/**
 * Contract: finite number-theory and factorization models expose green
 * RelMath.Order facts as carrier judgments, and the root RMN terms normalize
 * those judgments.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { evaluateRunTerm, numberTheory } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

describe("analysis.numberTheory: finite arithmetic and factorization reads", () => {
  it("computes factorial, permutation, Pascal, and binomial receipts", () => {
    const pascal = analysis.numberTheory.pascal(5, 2);
    const binomial = analysis.numberTheory.binomial(2, 3, 4);
    const combinatorics = analysis.numberTheory.numberTheoryCombinatoricsReceipt();

    assert.equal(analysis.numberTheory.factorial(5), 120);
    assert.equal(analysis.numberTheory.permutationCount(5, 3), 60);
    assert.equal(analysis.numberTheory.choose(5, 2), 10);
    assert.equal(analysis.numberTheory.choose(3, 5), 0);
    assert.equal(pascal.kind, "numberTheory.pascal:witness");
    assert.equal(pascal.left, 20);
    assert.equal(pascal.right, 20);
    assert.equal(binomial.kind, "numberTheory.binomial:witness");
    assert.equal(binomial.lhs, 625);
    assert.equal(binomial.rhs, 625);
    assert.deepEqual(binomial.terms, [81, 216, 216, 96, 16]);
    assert.equal(combinatorics.sourceModule, "RelMath.Order.NumberTheoryCombinatorics");
    assert.equal(combinatorics.factorialSucc, true);
    assert.equal(combinatorics.permutationStep, true);
    assert.equal(combinatorics.gcdPrime.euclid.dividesRight, true);
  });

  it("carries divisibility, gcd-meet, and Euclid-lemma witnesses", () => {
    const divides = analysis.numberTheory.divides(6, 42);
    const notDivides = analysis.numberTheory.divides(5, 42);
    const meet = analysis.numberTheory.gcdMeet(84, 126, 14);
    const euclid = analysis.numberTheory.euclidLemma(7, 10, 21);
    const badEuclid = analysis.numberTheory.euclidLemma(9, 10, 18);

    assert.equal(divides.kind, "numberTheory.divides:witness");
    assert.equal(divides.quotient, 7);
    assert.equal(notDivides.kind, "numberTheory.divides-obstruction");
    assert.equal(analysis.numberTheory.gcd(84, 126), 42);
    assert.equal(meet.kind, "numberTheory.gcdMeet:witness");
    assert.equal(meet.gcd, 42);
    assert.equal(meet.dDividesGcd, true);
    assert.equal(euclid.kind, "numberTheory.euclidLemma:witness");
    assert.equal(euclid.dividesRight, true);
    assert.equal(badEuclid.kind, "numberTheory.euclidLemma-obstruction");
    assert.equal(badEuclid.reason, "prime");
  });

  it("carries fundamental-theorem-of-arithmetic receipts", () => {
    const factorization = analysis.numberTheory.primeFactorization(360);
    const unique = analysis.numberTheory.primeFactorizationUnique(360, [2, 2, 2, 3, 3, 5], [5, 3, 2, 3, 2, 2]);
    const badUnique = analysis.numberTheory.primeFactorizationUnique(12, [2, 6], [2, 2, 3]);

    assert.equal(analysis.numberTheory.isPrime(97), true);
    assert.equal(analysis.numberTheory.isPrime(99), false);
    assert.equal(factorization.kind, "numberTheory.primeFactorization:witness");
    assert.deepEqual(factorization.factors, [2, 2, 2, 3, 3, 5]);
    assert.equal(unique.kind, "numberTheory.primeFactorizationUnique:witness");
    assert.equal(unique.permutation, true);
    assert.equal(badUnique.kind, "numberTheory.primeFactorizationUnique-obstruction");
    assert.equal(badUnique.reason, "left-prime");
  });

  it("carries finite image/epi-mono factorization receipts", () => {
    const image = analysis.numberTheory.imageFactorization(["b", "a", "b", "c", "a"]);

    assert.equal(image.kind, "numberTheory.imageFactorization:witness");
    assert.deepEqual(image.image, ["b", "a", "c"]);
    assert.deepEqual(image.corestriction, [0, 1, 0, 2, 1]);
    assert.deepEqual(image.reconstructed, ["b", "a", "b", "c", "a"]);
    assert.equal(image.surjectiveCorestriction, true);
    assert.equal(image.injectiveInclusion, true);
    assert.equal(image.factors, true);
  });
});

describe("numberTheory RMN terms normalize finite arithmetic receipts", () => {
  it("normalizes number-theory witness carriers", () => {
    const pascal = analysis.numberTheory.pascal(5, 2);
    const binomial = analysis.numberTheory.binomial(2, 3, 4);
    const meet = analysis.numberTheory.gcdMeet(84, 126, 14);
    const euclid = analysis.numberTheory.euclidLemma(7, 10, 21);
    const combinatorics = analysis.numberTheory.numberTheoryCombinatoricsReceipt();
    const factorization = analysis.numberTheory.primeFactorization(360);
    const unique = analysis.numberTheory.primeFactorizationUnique(360, [2, 2, 2, 3, 3, 5], [5, 3, 2, 3, 2, 2]);
    const image = analysis.numberTheory.imageFactorization(["b", "a", "b", "c", "a"]);

    assert.deepEqual(evaluateRunTerm(numberTheory.pascal, pascal), pascal);
    assert.deepEqual(evaluateRunTerm(numberTheory.binomial, binomial), binomial);
    assert.deepEqual(evaluateRunTerm(numberTheory.gcdMeet, meet), meet);
    assert.deepEqual(evaluateRunTerm(numberTheory.euclidLemma, euclid), euclid);
    assert.deepEqual(evaluateRunTerm(numberTheory.combinatorics, combinatorics), combinatorics);
    assert.deepEqual(evaluateRunTerm(numberTheory.primeFactorization, factorization), factorization);
    assert.deepEqual(evaluateRunTerm(numberTheory.primeFactorizationUnique, unique), unique);
    assert.deepEqual(evaluateRunTerm(numberTheory.imageFactorization, image), image);
  });
});
