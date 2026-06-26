import assert from "node:assert/strict";

import { evaluateRunTerm, linearAlgebraTerms } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

function jsonCarrier(value) {
  return JSON.parse(JSON.stringify(value));
}

const square = analysis.fromInts([
  [1, 2],
  [3, 4],
]);

const rectangular = analysis.fromInts([
  [1, 0, 1],
  [0, 1, 1],
]);

const invariants = analysis.linearAlgebra.squareMatrixInvariants(square);
const rankNullity = analysis.linearAlgebra.rankNullity(rectangular);

assert.equal(analysis.toInt(invariants.determinant), -2);
assert.deepEqual(invariants.characteristicPolynomial.map(analysis.toInt), [-2, -5, 1]);
assert.equal(analysis.toCount(rankNullity.rank), 2);
assert.equal(analysis.toCount(rankNullity.nullity), 1);
assert.equal(rankNullity.rankNullityHolds, true);
assert.deepEqual(
  evaluateRunTerm(linearAlgebraTerms.squareMatrixInvariants, invariants),
  jsonCarrier(invariants),
);
assert.deepEqual(
  evaluateRunTerm(linearAlgebraTerms.rankNullity, rankNullity),
  jsonCarrier(rankNullity),
);

console.log(JSON.stringify({
  product: "relating.linear-algebra-rmn",
  squareMatrix: {
    determinant: analysis.toInt(invariants.determinant),
    characteristicPolynomial: invariants.characteristicPolynomial.map(analysis.toInt),
    rank: analysis.toCount(invariants.rank),
    smithNormalForm: invariants.smithNormalForm.map(analysis.toInt),
  },
  rankNullity: {
    rows: analysis.toCount(rankNullity.shape.rows),
    columns: analysis.toCount(rankNullity.shape.columns),
    rank: analysis.toCount(rankNullity.rank),
    nullity: analysis.toCount(rankNullity.nullity),
    rankPlusNullity: analysis.toCount(rankNullity.rankPlusNullity),
    domainDimension: analysis.toCount(rankNullity.domainDimension),
    holds: rankNullity.rankNullityHolds,
  },
}, null, 2));
