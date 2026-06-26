import assert from "node:assert/strict";

import {
  closureOp,
  evaluateRunTerm,
  modalKripke,
  modalKripkeFrame,
  modalKripkeReceipt,
} from "@emsenn/relating";

const frame = modalKripkeFrame(["here", "there"], {
  here: ["here", "there"],
  there: ["here", "there"],
});

const valuation = {
  here: "potential",
  there: "active",
};

const receipt = modalKripkeReceipt(frame, valuation);

assert.equal(frame.frameClass, "S5");
assert.equal(receipt.s4BoxInterior, true);
assert.equal(receipt.s5PossibilizeAdjointNecessitate, true);
assert.deepEqual(closureOp(frame, valuation), receipt.possibilized);
assert.deepEqual(evaluateRunTerm(modalKripke.receipt, receipt), receipt);

console.log(JSON.stringify({
  product: "relating.modal-kripke-four-valued",
  frame,
  receipt,
}, null, 2));
