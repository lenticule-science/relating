import assert from "node:assert/strict";

import { evaluateRunTerm, numberTheory } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

const pascal = analysis.numberTheory.pascal(5, 2);
const binomial = analysis.numberTheory.binomial(2, 3, 4);
const gcd = analysis.numberTheory.gcdMeet(84, 126, 14);
const euclid = analysis.numberTheory.euclidLemma(7, 10, 21);
const factorization = analysis.numberTheory.primeFactorization(360);
const unique = analysis.numberTheory.primeFactorizationUnique(360, factorization.factors, [5, 3, 2, 3, 2, 2]);
const image = analysis.numberTheory.imageFactorization(["b", "a", "b", "c", "a"]);

assert.equal(pascal.kind, "numberTheory.pascal:witness");
assert.equal(binomial.kind, "numberTheory.binomial:witness");
assert.equal(gcd.kind, "numberTheory.gcdMeet:witness");
assert.equal(euclid.kind, "numberTheory.euclidLemma:witness");
assert.equal(factorization.kind, "numberTheory.primeFactorization:witness");
assert.equal(unique.kind, "numberTheory.primeFactorizationUnique:witness");
assert.equal(image.kind, "numberTheory.imageFactorization:witness");
assert.deepEqual(evaluateRunTerm(numberTheory.imageFactorization, image), image);

console.log(JSON.stringify({
  product: "relating.number-theory-factorization",
  pascal,
  binomial,
  gcd,
  euclid,
  factorization,
  unique,
  image,
}, null, 2));
