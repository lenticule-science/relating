import assert from "node:assert/strict";

import { evaluateRunTerm, laxSlack } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

const collapse = analysis.laxSlack.kzStrictCollapse(analysis.laxSlack.twoPointChainSystem, 0);
const failure = analysis.laxSlack.laxSlackAntisymmetryFailure(analysis.laxSlack.nonThinLaxSystem, 0);
const charge = analysis.laxSlack.chargeNoLaxSlack("stable");

assert.equal(collapse.kind, "laxSlack.kzStrictCollapse:witness");
assert.equal(failure.kind, "laxSlack.antisymmetryFailure:witness");
assert.equal(charge.kind, "laxSlack.chargeNoLaxSlack:witness");
assert.deepEqual(evaluateRunTerm(laxSlack.chargeNoLaxSlack, charge), charge);

console.log(JSON.stringify({
  product: "relating.lax-slack-diagnosis",
  collapse,
  failure,
  charge,
}, null, 2));
