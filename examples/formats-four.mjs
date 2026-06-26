import assert from "node:assert/strict";

import { evaluateRunTerm, formatsFour } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

const receipt = analysis.formatsFour.formatsClosureHierarchy();

assert.equal(receipt.cardinality, 8);
assert.equal(receipt.rmnHtmlRecoversDecidability, true);
assert.deepEqual(evaluateRunTerm(formatsFour.closureHierarchy, receipt), receipt);

console.log(JSON.stringify({
  product: "relating.formats-four",
  receipt,
}, null, 2));
