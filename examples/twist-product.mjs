import assert from "node:assert/strict";

import { evaluateRunTerm, twistProduct } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

const receipt = analysis.twistProduct.fourTwistProduct();

assert.equal(receipt.kind, "twistProduct.four:witness");
assert.equal(receipt.truthResiduation, true);
assert.equal(receipt.fusionUnit, "stable");
assert.equal(receipt.unitNonIntegral, true);
assert.deepEqual(evaluateRunTerm(twistProduct.four, receipt), receipt);

console.log(JSON.stringify({
  product: "relating.twist-product",
  receipt,
}, null, 2));
