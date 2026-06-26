import assert from "node:assert/strict";

import { evaluateRunTerm, probability } from "@emsenn/relating";
import * as settling from "@emsenn/relating/settling";

const receipt = settling.realUnitIntervalValueCategory();

assert.equal(receipt.kind, "settling.realUnitIntervalValueCategory:witness");
assert.equal(receipt.zeroLeOne, true);
assert.deepEqual(evaluateRunTerm(probability.realUnitIntervalValueCategory, receipt), receipt);

console.log(JSON.stringify({
  product: "relating.real-stochastic-interval",
  receipt,
}, null, 2));
