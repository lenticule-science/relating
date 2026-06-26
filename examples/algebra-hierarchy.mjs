import assert from "node:assert/strict";

import { algebraHierarchy, evaluateRunTerm } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

const receipt = analysis.algebraHierarchy.algebraHierarchy();

assert.equal(receipt.kind, "algebraHierarchy.receipt:witness");
assert.equal(receipt.boolField.zeroLabel, "false");
assert.equal(receipt.boolField.oneLabel, "true");
assert.equal(receipt.kleinFourGroup.oneLabel, "id");
assert.equal(receipt.fuseMonoid.oneLabel, "true");
assert.deepEqual(evaluateRunTerm(algebraHierarchy.receipt, receipt), receipt);

console.log(JSON.stringify({
  product: "relating.algebra-hierarchy",
  receipt,
}, null, 2));
