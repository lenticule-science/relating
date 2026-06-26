import assert from "node:assert/strict";

import {
  chargeValueName,
  classicalEq,
  evaluateRunTerm,
  finiteFibration,
  mark,
  paraconsistentEq,
  predicating,
  predicatingEqualityReceipt,
  token,
  truthQuantifierReceipt,
} from "@emsenn/relating";

const alpha = token(mark("alpha"));
const beta = token(mark("beta"));
const equality = predicatingEqualityReceipt([alpha, beta]);
const quantifier = truthQuantifierReceipt(finiteFibration(["diag", "off"], [["alpha"], []]), {
  alpha: "potential",
});

assert.equal(chargeValueName(classicalEq(alpha, alpha)), "potential");
assert.equal(chargeValueName(classicalEq(alpha, beta)), "active");
assert.equal(chargeValueName(paraconsistentEq(alpha, alpha)), "stable");
assert.equal(chargeValueName(paraconsistentEq(alpha, beta)), "absurd");
assert.deepEqual(evaluateRunTerm(predicating.equality, equality), equality);
assert.deepEqual(evaluateRunTerm(predicating.truthQuantifier, quantifier), quantifier);

console.log(JSON.stringify({
  product: "relating.predicating-equality",
  equality,
  quantifier,
}, null, 2));
