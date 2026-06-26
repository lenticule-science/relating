import assert from "node:assert/strict";

import {
  closureFamily,
  closureMonadReceipt,
  cosettlingReceipt,
  evaluateRunTerm,
  knowledgeJoinClosure,
  pointwiseClosureFamilyReceipt,
  valuationFiberCarrier,
} from "@emsenn/relating";

const closure = knowledgeJoinClosure("potential");
const seed = valuationFiberCarrier(["left", "right"], {
  left: "absurd",
  right: "active",
});

const pointwise = pointwiseClosureFamilyReceipt(closure, seed);
const cosettling = cosettlingReceipt(closure, pointwise.closed);
const monad = closureMonadReceipt(closure, "active", "absurd");

assert.equal(pointwise.closureMerge, true);
assert.equal(cosettling.joinSubsemilatticeWithTop, true);
assert.equal(monad.settleStepSettlesByThree, true);
assert.deepEqual(evaluateRunTerm(closureFamily.pointwise, pointwise), pointwise);
assert.deepEqual(evaluateRunTerm(closureFamily.cosettling, cosettling), cosettling);
assert.deepEqual(evaluateRunTerm(closureFamily.monad, monad), monad);

console.log(JSON.stringify({
  product: "relating.closure-operator-fiber",
  pointwise,
  cosettling,
  monad,
}, null, 2));
