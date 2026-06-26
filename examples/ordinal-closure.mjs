import assert from "node:assert/strict";

import { evaluateRunTerm, ordinalClosure } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

const receipt = analysis.ordinalClosure.receipt(3);

assert.equal(receipt.finite.regime.kind, "ordinal.closure.regime.finite");
assert.equal(receipt.omega.regimeWhenScott.kind, "ordinal.closure.regime.scott");
assert.equal(receipt.omegaShift.regimeWhenNonScottCountable.kind, "ordinal.closure.regime.transfinite");
assert.deepEqual(evaluateRunTerm(ordinalClosure.receipt, receipt), receipt);

console.log(JSON.stringify({
  product: "relating.ordinal-closure",
  finite: {
    stage: receipt.finite.stage,
    finiteWitnessValue: receipt.finite.finiteWitnessValue,
    regime: receipt.finite.regime.kind,
  },
  omega: {
    prefixLength: receipt.omega.ordinal.kind === "ordinalClosure.summary.limit"
      ? receipt.omega.ordinal.fundamentalPrefix.length
      : 0,
    scott: receipt.omega.regimeWhenScott.kind,
    transfinite: receipt.omega.regimeWhenNonScottCountable.kind,
  },
  boundary: receipt.arbitraryLimitBoundary,
}, null, 2));
