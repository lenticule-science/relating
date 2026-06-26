/**
 * analysis/linear-algebra - finite exact matrix receipts.
 *
 * This is the executable shadow of the RelMath LinearAlgebra spine: finite
 * integer matrices, Smith factors, rank, nullity, determinant, and
 * characteristic polynomial. The abstract field/vector-space proof remains in
 * Lean; this module records the computable finite matrix evidence.
 */
import {
  charPoly,
  count,
  determinant,
  monus,
  natAdd,
  natEqual,
  rank,
  smithNormalForm,
  type Integer,
  type Matrix,
  type Natural,
} from "./exact-number.mjs";

export interface MatrixShapeCarrier {
  readonly kind: "linearAlgebra.matrix.shape";
  readonly rows: Natural;
  readonly columns: Natural;
  readonly square: boolean;
}

export interface SquareMatrixInvariantsCarrier {
  readonly kind: "linearAlgebra.matrix.squareInvariants";
  readonly matrix: Matrix;
  readonly shape: MatrixShapeCarrier;
  readonly determinant: Integer;
  readonly characteristicPolynomial: readonly Integer[];
  readonly rank: Natural;
  readonly smithNormalForm: readonly Integer[];
}

export interface RankNullityCarrier {
  readonly kind: "linearAlgebra.rankNullity";
  readonly matrix: Matrix;
  readonly shape: MatrixShapeCarrier;
  readonly rank: Natural;
  readonly nullity: Natural;
  readonly rankPlusNullity: Natural;
  readonly domainDimension: Natural;
  readonly rankNullityHolds: boolean;
  readonly smithNormalForm: readonly Integer[];
}

const assertRectangular = (matrix: Matrix): void => {
  if (matrix.length === 0) return;
  const columns = matrix[0]!.length;
  if (!matrix.every((row) => row.length === columns)) {
    throw new TypeError("linear algebra matrix rows must have equal length");
  }
};

/** Finite matrix shape as exact naturals. */
export function matrixShape(matrix: Matrix): MatrixShapeCarrier {
  assertRectangular(matrix);
  const rows = count(matrix);
  const columns = count(matrix[0] ?? []);
  return Object.freeze({
    kind: "linearAlgebra.matrix.shape" as const,
    rows,
    columns,
    square: natEqual(rows, columns),
  });
}

/** Square-matrix determinant, characteristic polynomial, rank, and Smith factors. */
export function squareMatrixInvariants(matrix: Matrix): SquareMatrixInvariantsCarrier {
  const shape = matrixShape(matrix);
  if (!shape.square) throw new TypeError("squareMatrixInvariants expects a square matrix");
  const smith = smithNormalForm(matrix);
  return Object.freeze({
    kind: "linearAlgebra.matrix.squareInvariants" as const,
    matrix,
    shape,
    determinant: determinant(matrix),
    characteristicPolynomial: charPoly(matrix),
    rank: rank(matrix),
    smithNormalForm: smith,
  });
}

/** Rank-nullity receipt for a finite integer matrix read as a map Z^n -> Z^m. */
export function rankNullity(matrix: Matrix): RankNullityCarrier {
  const shape = matrixShape(matrix);
  const matrixRank = rank(matrix);
  const nullity = monus(shape.columns, matrixRank);
  const rankPlusNullity = natAdd(matrixRank, nullity);
  return Object.freeze({
    kind: "linearAlgebra.rankNullity" as const,
    matrix,
    shape,
    rank: matrixRank,
    nullity,
    rankPlusNullity,
    domainDimension: shape.columns,
    rankNullityHolds: natEqual(rankPlusNullity, shape.columns),
    smithNormalForm: smithNormalForm(matrix),
  });
}
