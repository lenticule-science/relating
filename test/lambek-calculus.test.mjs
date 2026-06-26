/**
 * Contract: finite Lambek algebra receipts mirror
 * RelMath.Order.LambekCalculus and normalize as RMN terms.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { evaluateRunTerm, lambek } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

describe("analysis.lambek: finite Lambek algebra receipts", () => {
  it("checks the one-point Lean Trivial Lambek algebra", () => {
    const receipt = analysis.lambek.laws(analysis.lambek.trivialLambekAlgebra);

    assert.equal(receipt.kind, "lambek.laws:witness");
    assert.equal(receipt.unitLabel, "unit");
    assert.equal(receipt.lattice, true);
    assert.equal(receipt.monoid, true);
    assert.equal(receipt.leftBiResiduation, true);
    assert.equal(receipt.rightBiResiduation, true);
    assert.equal(receipt.modusPonensLeft, true);
    assert.equal(receipt.modusPonensRight, true);
    assert.equal(receipt.commutative, true);
    assert.equal(receipt.residualsCoincideWhenCommutative, true);
    assert.equal(receipt.singleImplicationWhenCommutative, true);
  });

  it("checks the Boolean commutative collapse to one implication", () => {
    const receipt = analysis.lambek.laws(
      analysis.lambek.booleanCommutativeLambekAlgebra,
    );

    assert.equal(receipt.kind, "lambek.laws:witness");
    assert.equal(receipt.unitLabel, "true");
    assert.equal(receipt.fusionMonotoneLeft, true);
    assert.equal(receipt.fusionMonotoneRight, true);
    assert.equal(receipt.residualMonotone, true);
    assert.equal(receipt.residualAntitone, true);
    assert.equal(receipt.unitResiduals, true);
    assert.equal(receipt.commutative, true);
    assert.equal(receipt.residualsCoincideWhenCommutative, true);
    assert.equal(receipt.singleImplicationWhenCommutative, true);
  });

  it("refuses a left residual table that breaks bi-residuation", () => {
    const broken = analysis.lambek.finiteLambekAlgebraSystem(
      analysis.lambek.booleanCommutativeLambekAlgebra.lattice,
      analysis.lambek.booleanCommutativeLambekAlgebra.unit,
      analysis.lambek.booleanCommutativeLambekAlgebra.dot,
      [
        [0, 0],
        [0, 1],
      ],
      analysis.lambek.booleanCommutativeLambekAlgebra.rres,
    );
    const receipt = analysis.lambek.laws(broken);

    assert.equal(receipt.kind, "lambek.laws-obstruction");
    assert.equal(receipt.reason, "leftBiResiduation");
  });
});

describe("lambek RMN terms normalize finite receipts", () => {
  it("normalizes the finite Boolean Lambek receipt", () => {
    const receipt = analysis.lambek.laws(
      analysis.lambek.booleanCommutativeLambekAlgebra,
    );

    assert.deepEqual(evaluateRunTerm(lambek.laws, receipt), receipt);
  });
});
