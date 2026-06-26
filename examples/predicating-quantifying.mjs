import assert from "node:assert/strict";

import {
  evaluateRunTerm,
  finiteConverseFibration,
  finitePredicatingFibration,
  predicating,
  predicatingDualHyperdoctrineReceipt,
  predicatingHyperdoctrineReceipt,
  predicatingQuantifyingReceipt,
} from "@emsenn/relating";

const projection = finitePredicatingFibration(["a", "b", "c"], ["x", "y", "empty"], {
  a: "x",
  b: "x",
  c: "y",
});
const valuation = { a: "potential", b: "active", c: "stable" };
const quantifying = predicatingQuantifyingReceipt(projection, valuation);

const converse = finiteConverseFibration(["ab", "ba", "aa"], {
  ab: "ba",
  ba: "ab",
  aa: "aa",
});
const hyperdoctrine = predicatingHyperdoctrineReceipt(converse, {
  ab: "potential",
  ba: "active",
  aa: "stable",
});
const dual = predicatingDualHyperdoctrineReceipt(projection, valuation);

assert.deepEqual(evaluateRunTerm(predicating.quantifying, quantifying), quantifying);
assert.deepEqual(evaluateRunTerm(predicating.hyperdoctrine, hyperdoctrine), hyperdoctrine);
assert.deepEqual(evaluateRunTerm(predicating.dualHyperdoctrine, dual), dual);

console.log(JSON.stringify({
  product: "relating.predicating-quantifying",
  quantifying,
  hyperdoctrine,
  dual,
}, null, 2));
