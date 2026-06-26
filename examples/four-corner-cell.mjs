import assert from "node:assert/strict";

import {
  articulate,
  evaluateRunTerm,
  fourCornerCell,
  fourCornerCellReceipt,
  mark,
  utterance,
} from "@emsenn/relating";

const cell = articulate(utterance(mark("token"), mark("claim")));
const receipt = fourCornerCellReceipt(cell);

assert.equal(receipt.kind, "fourCornerCell.receipt:witness");
assert.equal(receipt.cellReading.corner, "potential");
assert.equal(receipt.cellReading.chargeAlias, "kBot");
assert.equal(receipt.cellReading.chargeName, "absurd");
assert.deepEqual(evaluateRunTerm(fourCornerCell.receipt, receipt), receipt);

console.log(JSON.stringify({
  product: "relating.four-corner-cell",
  receipt,
}, null, 2));
