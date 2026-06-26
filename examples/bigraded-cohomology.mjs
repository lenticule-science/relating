import assert from "node:assert/strict";

import { bigradedCohomology, evaluateRunTerm } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

const mixed = analysis.bigradedCohomology.receipt(
  analysis.bigradedCohomology.workedMixedCharges,
);
const paraconsistent = analysis.bigradedCohomology.receipt(
  analysis.bigradedCohomology.workedParaconsistentCharges,
);

assert.equal(mixed.regime, "mixed");
assert.equal(mixed.classicalGaugeMoved, true);
assert.equal(paraconsistent.regime, "paraconsistent");
assert.equal(paraconsistent.paraconsistentGaugeStable, true);
assert.deepEqual(evaluateRunTerm(bigradedCohomology.receipt, mixed), mixed);

console.log(JSON.stringify({
  product: "relating.bigraded-cohomology",
  mixed,
  paraconsistent,
}, null, 2));
