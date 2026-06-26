import assert from "node:assert/strict";

import { chargeValue, chargeValueName } from "@emsenn/relating";
import * as settling from "@emsenn/relating/settling";

const name = (value) => chargeValueName(value);
const target = chargeValue("stable");
const chargeClosure = settling.chargeJoinVClosure(target);
const settledCharge = settling.settleOverValue(chargeClosure, settling.chargeValueCategory.bot);

const chargeOrder = settling.partialOrderOver(settling.chargeValueCategory, settling.chargeSample);
const booleanOrder = settling.partialOrderOver(settling.booleanValueCategory, settling.booleanSample);
const closureLaws = settling.closureOver(settling.chargeValueCategory, chargeClosure, settling.chargeSample);
const fixedPoint = settling.settleFixedPoint(settling.chargeValueCategory, chargeClosure, settling.chargeValueCategory.bot);
const least = settling.settleLeast(settling.chargeValueCategory, chargeClosure, settling.chargeValueCategory.bot, target);
const spine = settling.spineRecovery(target);

const strictData = settling.closureRegimeData(true, true, true);
const scottData = settling.closureRegimeData(true, false, true);
const transfiniteData = settling.closureRegimeData(false, false, true);
const aperiodicData = settling.closureRegimeData(false, false, false);
const invalidData = settling.closureRegimeData(false, true, true);

assert.equal(chargeOrder.kind, "settling.valueCategory.partialOrder:witness");
assert.equal(booleanOrder.kind, "settling.valueCategory.partialOrder:witness");
assert.equal(closureLaws.kind, "settling.vClosure.law:witness");
assert.equal(name(settledCharge), "stable");
assert.equal(fixedPoint.kind, "settling.valueCategory.settleFixedPoint:witness");
assert.equal(least.kind, "settling.valueCategory.settleLeast:witness");
assert.equal(spine.kind, "settling.spineRecovery:witness");
assert.equal(spine.reachesTarget, true);
assert.equal(invalidData.kind, "settling.closureRegimeData-obstruction");
assert.equal(invalidData.constraint, "finiteBase→scottContinuous");

const strict = strictData.data;
const scott = scottData.data;
const transfinite = transfiniteData.data;
const aperiodic = aperiodicData.data;
const independence = settling.fourRegimeValueIndependent(
  settling.chargeValueCategory,
  chargeClosure,
  settling.booleanValueCategory,
  settling.booleanJoinVClosure(true),
  transfinite,
);

assert.equal(settling.classifyRegime(strict).kind, "ordinal.closure.regime.finite");
assert.equal(settling.classifyRegime(scott).kind, "ordinal.closure.regime.scott");
assert.equal(settling.classifyRegime(transfinite).kind, "ordinal.closure.regime.transfinite");
assert.equal(settling.classifyRegime(aperiodic).kind, "ordinal.closure.regime.aperiodic");
assert.equal(settling.fourRegimeDichotomy(transfinite).exclusiveAndExhaustive, true);
assert.equal(independence.kind, "settling.valueIndependentRegime:witness");
assert.equal(independence.regime.kind, "ordinal.closure.regime.transfinite");
assert.equal(settling.cohomologyVanishesInRegime(settling.classifyRegime(strict)), true);
assert.equal(settling.cohomologyVanishesInRegime(settling.classifyRegime(aperiodic)), false);

console.log(JSON.stringify({
  product: "relating.value-category-settling",
  lawChecks: {
    chargeOrder: chargeOrder.kind,
    booleanOrder: booleanOrder.kind,
    chargeClosure: closureLaws.kind,
  },
  settling: {
    seed: name(settling.chargeValueCategory.bot),
    target: name(target),
    settled: name(settledCharge),
    fixedPoint: fixedPoint.kind,
    leastFixedPoint: least.kind,
    spineRecovery: spine.reachesTarget,
  },
  regimes: {
    strict: settling.classifyRegime(strict).kind,
    scott: settling.classifyRegime(scott).kind,
    transfinite: settling.classifyRegime(transfinite).kind,
    aperiodic: settling.classifyRegime(aperiodic).kind,
    invalidFiniteData: invalidData.constraint,
    valueIndependent: independence.kind,
    cohomologyVanishes: {
      strict: settling.cohomologyVanishesInRegime(settling.classifyRegime(strict)),
      aperiodic: settling.cohomologyVanishesInRegime(settling.classifyRegime(aperiodic)),
    },
  },
  boundary: "finite/sample-checked value-category settling; not a full continuous quantale runtime",
}, null, 2));
