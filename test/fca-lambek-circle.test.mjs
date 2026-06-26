/**
 * Contract: finite receipts for RelMath.Order.FCALambekCircle assemble the
 * executable FCA closure, concept-lattice, residuated-lattice, and Lambek edges.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { evaluateRunTerm, fcaLambekCircle } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

describe("analysis.fcaLambek: finite FCA/Lambek circle receipts", () => {
  it("checks the worked finite circle", () => {
    const receipt = analysis.fcaLambek.circle(
      analysis.fcaLambek.workedContext,
      analysis.residuatedLattice.twoBooleanResiduatedLattice,
    );

    assert.equal(receipt.kind, "fcaLambek.circle:witness");
    assert.deepEqual(receipt.contextSubjects, ["a", "b", "c"]);
    assert.deepEqual(receipt.contextPredicates, ["p", "q", "r"]);
    assert.equal(receipt.extentsChecked, 8);
    assert.equal(receipt.fcaClosureIsSettlingClosure, true);
    assert.equal(receipt.conceptLatticeFiniteComplete, true);
    assert.equal(receipt.residuatedAsCommutativeLambek, true);
    assert.equal(receipt.commutativeCollapse, true);
    assert.equal(receipt.modelTheoreticClosingEdge, "documented-boundary");
    assert.equal(receipt.lambek.kind, "lambek.laws:witness");
  });

  it("exposes FCA closure as an extensive idempotent operation", () => {
    const closed = analysis.fcaLambek.closeExtent(
      analysis.fcaLambek.workedContext,
      ["a", "b"],
    );
    const twice = analysis.fcaLambek.closeExtent(
      analysis.fcaLambek.workedContext,
      closed,
    );

    assert.deepEqual(new Set(closed), new Set(["a", "b", "c"]));
    assert.deepEqual(new Set(twice), new Set(closed));
  });

  it("refuses a residuated input that cannot provide the Lambek edge", () => {
    const broken = analysis.residuatedLattice.finiteResiduatedLatticeSystem(
      analysis.residuatedLattice.twoBooleanResiduatedLattice.lattice,
      1,
      0,
      0,
      analysis.residuatedLattice.twoBooleanResiduatedLattice.fuse,
      analysis.residuatedLattice.twoBooleanResiduatedLattice.imp,
    );
    const receipt = analysis.fcaLambek.circle(
      analysis.fcaLambek.workedContext,
      broken,
    );

    assert.equal(receipt.kind, "fcaLambek.circle-obstruction");
    assert.equal(receipt.reason, "residuated");
    assert.equal(receipt.residuated.reason, "integral");
  });
});

describe("fcaLambekCircle RMN terms normalize finite receipts", () => {
  it("normalizes the finite circle receipt", () => {
    const receipt = analysis.fcaLambek.circle(
      analysis.fcaLambek.workedContext,
      analysis.residuatedLattice.twoBooleanResiduatedLattice,
    );

    assert.deepEqual(evaluateRunTerm(fcaLambekCircle.receipt, receipt), receipt);
  });
});
