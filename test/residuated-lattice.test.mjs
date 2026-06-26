/**
 * Contract: finite residuated-lattice receipts mirror
 * RelMath.Order.ResiduatedLatticeStandalone and normalize as RMN terms.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { evaluateRunTerm, residuatedLattice } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

describe("analysis.residuatedLattice: finite integral residuated-lattice receipts", () => {
  it("checks the Boolean Two residuated lattice and derived Lean laws", () => {
    const receipt = analysis.residuatedLattice.laws(
      analysis.residuatedLattice.twoBooleanResiduatedLattice,
    );

    assert.equal(receipt.kind, "residuatedLattice.laws:witness");
    assert.equal(receipt.oneLabel, "true");
    assert.equal(receipt.topLabel, "true");
    assert.equal(receipt.botLabel, "false");
    assert.equal(receipt.boundedLattice, true);
    assert.equal(receipt.commutativeMonoid, true);
    assert.equal(receipt.residuation, true);
    assert.equal(receipt.integral, true);
    assert.equal(receipt.fuseMonotone, true);
    assert.equal(receipt.leOne, true);
    assert.equal(receipt.modusPonens, true);
    assert.equal(receipt.fuseLeMeet, true);
  });

  it("refuses a residual table that breaks the adjunction", () => {
    const broken = analysis.residuatedLattice.finiteResiduatedLatticeSystem(
      analysis.residuatedLattice.twoBooleanResiduatedLattice.lattice,
      1,
      0,
      1,
      analysis.residuatedLattice.twoBooleanResiduatedLattice.fuse,
      [
        [1, 1],
        [1, 1],
      ],
    );
    const receipt = analysis.residuatedLattice.laws(broken);

    assert.equal(receipt.kind, "residuatedLattice.laws-obstruction");
    assert.equal(receipt.reason, "residuation");
    assert.deepEqual(receipt.labels, ["true", "true", "false"]);
  });

  it("treats integrality as a real hypothesis", () => {
    const nonIntegral = analysis.residuatedLattice.finiteResiduatedLatticeSystem(
      analysis.residuatedLattice.twoBooleanResiduatedLattice.lattice,
      1,
      0,
      0,
      analysis.residuatedLattice.twoBooleanResiduatedLattice.fuse,
      analysis.residuatedLattice.twoBooleanResiduatedLattice.imp,
    );
    const receipt = analysis.residuatedLattice.laws(nonIntegral);

    assert.equal(receipt.kind, "residuatedLattice.laws-obstruction");
    assert.equal(receipt.reason, "integral");
  });
});

describe("residuatedLattice RMN terms normalize finite receipts", () => {
  it("normalizes the finite Boolean residuated-lattice receipt", () => {
    const receipt = analysis.residuatedLattice.laws(
      analysis.residuatedLattice.twoBooleanResiduatedLattice,
    );

    assert.deepEqual(evaluateRunTerm(residuatedLattice.laws, receipt), receipt);
  });
});
