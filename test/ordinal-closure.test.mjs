/**
 * Contract: RelMath.Closure.OrdinalCore and RelMath.Closure.Ordinal have a
 * finite/symbolic ordinal receipt over the existing closure ordinal carriers.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { evaluateRunTerm, ordinalClosure } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

describe("analysis.ordinalClosure: finite and named-limit ordinal receipts", () => {
  it("embeds finite naturals as finite successor ordinals", () => {
    const read = analysis.ordinalClosure.finiteRead(3);

    assert.equal(read.kind, "ordinalClosure.finiteRead:witness");
    assert.equal(read.stage, 3);
    assert.equal(read.isFinite, true);
    assert.equal(read.finiteWitnessValue, 3);
    assert.equal(read.regime.kind, "ordinal.closure.regime.finite");
    assert.equal(read.belowOmega, true);
    assert.equal(read.monotoneBelowNext, true);
  });

  it("reads omega and omega-shift as named non-finite limits", () => {
    const omega = analysis.ordinalClosure.namedLimitRead("omega", 4);
    const shift = analysis.ordinalClosure.namedLimitRead("omegaShift", 4);

    assert.equal(omega.isFinite, false);
    assert.equal(omega.prefixBelowLimit, true);
    assert.equal(omega.regimeWhenScott.kind, "ordinal.closure.regime.scott");
    assert.equal(omega.regimeWhenNonScottCountable.kind, "ordinal.closure.regime.transfinite");
    assert.equal(omega.regimeWhenNonScottUncountable.kind, "ordinal.closure.regime.aperiodic");
    assert.equal(shift.name, "omegaShift");
    assert.equal(shift.regimeWhenNonScottCountable.kind, "ordinal.closure.regime.transfinite");
  });

  it("proves the Boolean classifier is the ordinal-shape shadow", () => {
    const data = {
      kind: "settling.closureRegimeData",
      scottContinuous: true,
      finiteBase: true,
      countableCofinality: true,
    };
    const shadow = analysis.ordinalClosure.classifierShadow(data, analysis.ordinalClosure.ofNat(2));

    assert.equal(shadow.finiteFlagMatchesOrdinal, true);
    assert.equal(shadow.matches, true);
    assert.equal(shadow.regimeOfOrdinal.kind, shadow.classifiedRegime.kind);
  });
});

describe("ordinalClosure RMN terms normalize finite/symbolic receipts", () => {
  it("normalizes the ordinal closure receipt", () => {
    const receipt = analysis.ordinalClosure.receipt(3);

    assert.equal(receipt.kind, "ordinalClosure.receipt:witness");
    assert.equal(receipt.limitLubBoundary, "named-fundamental-sequence-prefix");
    assert.equal(receipt.arbitraryLimitBoundary, "proof-side Nat -> Ord functions");
    assert.deepEqual(evaluateRunTerm(ordinalClosure.receipt, receipt), receipt);
  });
});
