import assert from "node:assert/strict";

import { evaluateRunTerm, fcaLambekCircle } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

const receipt = analysis.fcaLambek.circle(
  analysis.fcaLambek.workedContext,
  analysis.residuatedLattice.twoBooleanResiduatedLattice,
);

assert.equal(receipt.kind, "fcaLambek.circle:witness");
assert.equal(receipt.fcaClosureIsSettlingClosure, true);
assert.equal(receipt.residuatedAsCommutativeLambek, true);
assert.equal(receipt.modelTheoreticClosingEdge, "documented-boundary");
assert.deepEqual(evaluateRunTerm(fcaLambekCircle.receipt, receipt), receipt);

console.log(JSON.stringify({
  product: "relating.fca-lambek-circle",
  receipt,
}, null, 2));
