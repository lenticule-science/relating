import assert from "node:assert/strict";

import { evaluateRunTerm, knasterTarski } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

const chain = analysis.orderInfra.finitePreorderSystem(
  ["bottom", "middle", "top"],
  [
    [true, true, true],
    [false, true, true],
    [false, false, true],
  ],
);

const endomap = analysis.knasterTarski.finiteMonotoneEndomap(chain, [1, 1, 2]);
const fixedPoints = analysis.knasterTarski.fixedPoints(endomap);

assert.equal(fixedPoints.kind, "knasterTarski.fixedPoints:witness");
assert.equal(fixedPoints.lfpLabel, "middle");
assert.equal(fixedPoints.gfpLabel, "top");
assert.deepEqual(evaluateRunTerm(knasterTarski.fixedPoints, fixedPoints), fixedPoints);

console.log(JSON.stringify({
  product: "relating.knaster-tarski",
  fixedPoints,
}, null, 2));
