import assert from "node:assert/strict";

import { chargeValue, evaluateRunTerm, valueSettling } from "@emsenn/relating";
import * as settling from "@emsenn/relating/settling";

const closure = settling.chargeJoinVClosure(chargeValue("potential"));
const regimeData = settling.closureRegimeData(true, true, true);

const partialOrder = settling.partialOrderOver(settling.chargeValueCategory, settling.chargeSample);
const closureLaw = settling.closureOver(settling.chargeValueCategory, closure, settling.chargeSample);
const fixed = settling.settleFixedPoint(settling.chargeValueCategory, closure, chargeValue("absurd"));
const least = settling.settleLeast(settling.chargeValueCategory, closure, chargeValue("absurd"), chargeValue("stable"));
const independence = settling.fourRegimeValueIndependent(
  settling.booleanValueCategory,
  settling.booleanJoinVClosure(true),
  settling.chargeValueCategory,
  closure,
  regimeData.data,
);
const recovery = settling.spineRecovery(chargeValue("active"));
const optimization = settling.settlingOptimizationReceipt(
  settling.booleanValueCategory,
  settling.booleanJoinVClosure(true),
  false,
  true,
);

assert.equal(partialOrder.kind, "settling.valueCategory.partialOrder:witness");
assert.equal(closureLaw.kind, "settling.vClosure.law:witness");
assert.equal(fixed.kind, "settling.valueCategory.settleFixedPoint:witness");
assert.equal(least.kind, "settling.valueCategory.settleLeast:witness");
assert.equal(independence.kind, "settling.valueIndependentRegime:witness");
assert.equal(recovery.kind, "settling.spineRecovery:witness");
assert.equal(optimization.kind, "settling.optimization:witness");
assert.deepEqual(evaluateRunTerm(valueSettling.optimization, optimization), optimization);

console.log(JSON.stringify({
  product: "relating.value-settling-optimization",
  partialOrder,
  closureLaw,
  fixed,
  least,
  independence,
  recovery,
  optimization,
}, null, 2));
