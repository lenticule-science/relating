/**
 * Contract: RelMath.Positing.BigradedCohomology has a finite charge-list
 * receipt for the trichotomy and negation gauge laws.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { bigradedCohomology, evaluateRunTerm } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

describe("analysis.bigradedCohomology: finite charge-list receipts", () => {
  it("classifies the mixed bigraded regime and gauge action", () => {
    const receipt = analysis.bigradedCohomology.receipt(
      analysis.bigradedCohomology.workedMixedCharges,
    );

    assert.equal(receipt.kind, "bigradedCohomology.receipt:witness");
    assert.equal(receipt.truthContent, true);
    assert.equal(receipt.inconsistencyContent, true);
    assert.equal(receipt.regime, "mixed");
    assert.deepEqual(receipt.negated, ["active", "stable", "absurd"]);
    assert.equal(receipt.gaugeFixesInconsistency, true);
    assert.equal(receipt.gaugeFlipsTruthToFalse, true);
    assert.equal(receipt.classicalGaugeMoved, true);
  });

  it("recognizes paraconsistent points as gauge-stable", () => {
    const receipt = analysis.bigradedCohomology.receipt(
      analysis.bigradedCohomology.workedParaconsistentCharges,
    );

    assert.equal(receipt.regime, "paraconsistent");
    assert.equal(receipt.truthContent, false);
    assert.equal(receipt.inconsistencyContent, true);
    assert.equal(receipt.paraconsistentGaugeStable, true);
    assert.deepEqual(receipt.negated, receipt.charges);
  });
});

describe("bigradedCohomology RMN terms normalize finite receipts", () => {
  it("normalizes the bigraded cohomology receipt", () => {
    const receipt = analysis.bigradedCohomology.receipt(
      analysis.bigradedCohomology.workedMixedCharges,
    );

    assert.deepEqual(evaluateRunTerm(bigradedCohomology.receipt, receipt), receipt);
  });
});
