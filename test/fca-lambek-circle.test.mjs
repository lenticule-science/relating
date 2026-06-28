/**
 * Contract: finite receipts for RelMath.Order.FCALambekCircle assemble the
 * executable FCA closure, concept-lattice, residuated-lattice, and Lambek edges.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { evaluateRunTerm, fcaLambekCircle } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

describe("analysis.fcaLambek: finite FCA/Lambek circle receipts", () => {
  it("checks the direct finite formal-concept-analysis derivation receipt", () => {
    const receipt = analysis.fcaLambek.formalConceptAnalysisReceipt();

    assert.equal(receipt.kind, "fca.formalConceptAnalysis.receipt:witness");
    assert.equal(receipt.sourceModule, "RelMath.Order.FormalConceptAnalysis");
    assert.equal(receipt.theorems.includes("RelMath.FCA.derivation_galois_connection"), true);
    assert.equal(receipt.theorems.includes("RelMath.FCA.conceptLatticeData"), true);
    assert.deepEqual(receipt.sampleExtent, ["a", "b"]);
    assert.deepEqual(receipt.sampleIntent, ["p"]);
    assert.deepEqual(receipt.sampleClosedExtent, ["a", "b", "c"]);
    assert.deepEqual(receipt.closedExtents, [[], ["a"], ["b"], ["a", "b", "c"]]);
    assert.equal(receipt.primeAdjunction, true);
    assert.equal(receipt.primeAAntitone, true);
    assert.equal(receipt.primeBAntitone, true);
    assert.equal(receipt.closeAExtensive, true);
    assert.equal(receipt.primeACancelsClosure, true);
    assert.equal(receipt.closeAMonotone, true);
    assert.equal(receipt.closeAIdempotent, true);
    assert.equal(receipt.conceptExtentsClosed, true);
    assert.equal(receipt.conceptMeetClosed, true);
    assert.equal(receipt.conceptJoinClosed, true);
    assert.equal(receipt.implicationCharacterization, true);
  });

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
    const fca = analysis.fcaLambek.formalConceptAnalysisReceipt();
    const receipt = analysis.fcaLambek.circle(
      analysis.fcaLambek.workedContext,
      analysis.residuatedLattice.twoBooleanResiduatedLattice,
    );

    assert.deepEqual(evaluateRunTerm(fcaLambekCircle.formalConceptAnalysis, fca), fca);
    assert.deepEqual(evaluateRunTerm(fcaLambekCircle.receipt, receipt), receipt);
  });
});
