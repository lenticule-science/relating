/**
 * Contract: finite lax-idempotence diagnostics mirror
 * RelMath.Closure.LaxSlackDiagnosis and normalize as RMN receipts.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { evaluateRunTerm, laxSlack } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

describe("analysis.laxSlack: finite antisymmetry/lax-idempotence diagnostics", () => {
  it("collapses KZ slack to strict idempotence on an antisymmetric carrier", () => {
    const collapse = analysis.laxSlack.kzStrictCollapse(analysis.laxSlack.twoPointChainSystem, 0);
    const noFailure = analysis.laxSlack.laxSlackAntisymmetryFailure(analysis.laxSlack.twoPointChainSystem, 0);

    assert.equal(collapse.kind, "laxSlack.kzStrictCollapse:witness");
    assert.equal(collapse.firstLabel, "top");
    assert.equal(collapse.secondLabel, "top");
    assert.equal(collapse.kz, true);
    assert.equal(collapse.strict, true);
    assert.equal(noFailure.kind, "laxSlack.antisymmetryFailure-obstruction");
    assert.equal(noFailure.reason, "strict");
  });

  it("witnesses antisymmetry failure from genuine lax slack on a non-thin carrier", () => {
    const failure = analysis.laxSlack.laxSlackAntisymmetryFailure(analysis.laxSlack.nonThinLaxSystem, 0);
    const collapse = analysis.laxSlack.kzStrictCollapse(analysis.laxSlack.nonThinLaxSystem, 0);

    assert.equal(failure.kind, "laxSlack.antisymmetryFailure:witness");
    assert.equal(failure.firstLabel, "y");
    assert.equal(failure.secondLabel, "x");
    assert.deepEqual(failure.antisymmetryFailurePair, [0, 1]);
    assert.equal(collapse.kind, "laxSlack.kzStrictCollapse-obstruction");
    assert.equal(collapse.reason, "antisymmetry");
  });

  it("carries the concrete FOUR knowledge-order no-lax-slack receipt", () => {
    const receipt = analysis.laxSlack.chargeNoLaxSlack("potential");

    assert.equal(receipt.kind, "laxSlack.chargeNoLaxSlack:witness");
    assert.equal(receipt.noLaxSlack, true);
    assert.equal(receipt.checked.length, 4);
    assert.equal(receipt.checked.every((row) => row.laxSlack === false), true);
    assert.equal(receipt.checked.find((row) => row.seed === "absurd").first, "potential");
  });
});

describe("laxSlack RMN terms normalize finite diagnostic receipts", () => {
  it("normalizes KZ, antisymmetry-failure, and FOUR no-slack receipts", () => {
    const collapse = analysis.laxSlack.kzStrictCollapse(analysis.laxSlack.twoPointChainSystem, 0);
    const failure = analysis.laxSlack.laxSlackAntisymmetryFailure(analysis.laxSlack.nonThinLaxSystem, 0);
    const charge = analysis.laxSlack.chargeNoLaxSlack("active");

    assert.deepEqual(evaluateRunTerm(laxSlack.kzStrictCollapse, collapse), collapse);
    assert.deepEqual(evaluateRunTerm(laxSlack.antisymmetryFailure, failure), failure);
    assert.deepEqual(evaluateRunTerm(laxSlack.chargeNoLaxSlack, charge), charge);
  });
});
