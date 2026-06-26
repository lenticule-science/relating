import assert from "node:assert/strict";

import {
  evaluateRunTerm,
  quartetRecurrenceReceipt,
  valuationFiberAlgebra,
  valuationFiberAlgebraReceipt,
  valuationFiberCarrier,
} from "@emsenn/relating";

const fiber = valuationFiberCarrier(["cell-a", "cell-b"], {
  "cell-a": "active",
  "cell-b": "stable",
});

const algebra = valuationFiberAlgebraReceipt(fiber);
const recurrence = quartetRecurrenceReceipt(fiber);

assert.deepEqual(evaluateRunTerm(valuationFiberAlgebra.receipt, algebra), algebra);
assert.deepEqual(evaluateRunTerm(valuationFiberAlgebra.quartetRecurrence, recurrence), recurrence);

console.log(JSON.stringify({
  product: "relating.valuation-fiber-algebra",
  algebra,
  recurrence,
}, null, 2));
