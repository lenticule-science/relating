/**
 * Contract: finite exact matrix invariants and rank-nullity receipts are
 * carrier-shaped and RMN-normalizable.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { evaluateRunTerm, linearAlgebraTerms } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

function jsonCarrier(value) {
  return JSON.parse(JSON.stringify(value));
}

describe("linear algebra RMN terms", () => {
  it("normalizes square determinant, characteristic polynomial, rank, and Smith factors", () => {
    const matrix = analysis.fromInts([
      [1, 2],
      [3, 4],
    ]);
    const shape = analysis.linearAlgebra.matrixShape(matrix);
    const invariants = analysis.linearAlgebra.squareMatrixInvariants(matrix);

    assert.equal(shape.kind, "linearAlgebra.matrix.shape");
    assert.equal(analysis.toCount(shape.rows), 2);
    assert.equal(analysis.toCount(shape.columns), 2);
    assert.equal(shape.square, true);
    assert.equal(analysis.toInt(invariants.determinant), -2);
    assert.deepEqual(invariants.characteristicPolynomial.map(analysis.toInt), [-2, -5, 1]);
    assert.equal(analysis.toCount(invariants.rank), 2);
    assert.deepEqual(invariants.smithNormalForm.map(analysis.toInt), [1, 2]);

    assert.deepEqual(evaluateRunTerm(linearAlgebraTerms.matrixShape, shape), jsonCarrier(shape));
    assert.deepEqual(evaluateRunTerm(linearAlgebraTerms.squareMatrixInvariants, invariants), jsonCarrier(invariants));
  });

  it("normalizes rectangular rank-nullity receipts", () => {
    const matrix = analysis.fromInts([
      [1, 0, 1],
      [0, 1, 1],
    ]);
    const receipt = analysis.linearAlgebra.rankNullity(matrix);

    assert.equal(receipt.kind, "linearAlgebra.rankNullity");
    assert.equal(analysis.toCount(receipt.shape.rows), 2);
    assert.equal(analysis.toCount(receipt.shape.columns), 3);
    assert.equal(receipt.shape.square, false);
    assert.equal(analysis.toCount(receipt.rank), 2);
    assert.equal(analysis.toCount(receipt.nullity), 1);
    assert.equal(analysis.toCount(receipt.rankPlusNullity), 3);
    assert.equal(analysis.toCount(receipt.domainDimension), 3);
    assert.equal(receipt.rankNullityHolds, true);
    assert.deepEqual(receipt.smithNormalForm.map(analysis.toInt), [1, 1]);

    assert.deepEqual(evaluateRunTerm(linearAlgebraTerms.rankNullity, receipt), jsonCarrier(receipt));
  });
});
