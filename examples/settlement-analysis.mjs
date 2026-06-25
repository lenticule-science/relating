import assert from "node:assert/strict";

import { chargeValue } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

function naturalToNumber(value) {
  let count = 0;
  let current = value;
  while (!analysis.natIsZero(current)) {
    count += 1;
    current = analysis.predecessor(current);
  }
  return count;
}

function integerToNumber(value) {
  return naturalToNumber(value.pos) - naturalToNumber(value.neg);
}

function rationalToString(value) {
  const numerator = integerToNumber(value.num);
  const denominator = integerToNumber(value.den);
  return denominator === 1 ? String(numerator) : `${numerator}/${denominator}`;
}

const three = analysis.count(["alpha", "beta", "gamma"]);
const one = analysis.fromNatural(analysis.natOne);
const zero = analysis.intZero;
const matrix = Object.freeze([
  Object.freeze([one, one]),
  Object.freeze([one, zero]),
]);

const determinant = analysis.determinant(matrix);
const rank = analysis.rank(matrix);
const characteristic = analysis.charPoly(matrix);

const values = [
  chargeValue("potential"),
  chargeValue("active"),
  chargeValue("stable"),
  chargeValue("stable"),
];
const distribution = analysis.chargeDistribution(values);
const coordinates = analysis.evidenceCoordinates(distribution);
const mixed = analysis.mixedness(
  distribution,
  analysis.chargeDistribution([
    chargeValue("stable"),
    chargeValue("stable"),
    chargeValue("stable"),
    chargeValue("stable"),
  ]),
);

assert.equal(naturalToNumber(three), 3);
assert.equal(integerToNumber(determinant), -1);
assert.equal(naturalToNumber(rank), 2);
assert.deepEqual(characteristic.map(integerToNumber), [-1, -1, 1]);
assert.equal(naturalToNumber(distribution.total), 4);
assert.equal(rationalToString(coordinates.truth), "3/4");
assert.equal(rationalToString(coordinates.falsity), "3/4");
assert.equal(rationalToString(coordinates.conflict), "1/2");
assert.equal(mixed.kind, "meme-analysis.evidence.mixedness");

console.log(JSON.stringify({
  product: "relating.settlement-analysis",
  exact: {
    count: naturalToNumber(three),
    determinant: integerToNumber(determinant),
    rank: naturalToNumber(rank),
    characteristicPolynomial: characteristic.map(integerToNumber),
  },
  evidence: {
    total: naturalToNumber(distribution.total),
    truth: rationalToString(coordinates.truth),
    falsity: rationalToString(coordinates.falsity),
    knowledge: rationalToString(coordinates.knowledge),
    conflict: rationalToString(coordinates.conflict),
    mixedness: mixed.relation,
  },
}, null, 2));
