import assert from "node:assert/strict";

import { chargeValue, chargeValueName } from "@emsenn/relating";
import * as settling from "@emsenn/relating/settling";

const name = (value) => chargeValueName(value);

const seed = settling.chargeValueCategory.bot;
const target = chargeValue("stable");
const improve = settling.chargeJoinVClosure(target);
const problem = settling.optimizationProblem(settling.chargeValueCategory, improve);

const optimum = settling.optimum(problem, seed);
const fixedPoint = settling.optimumIsFixedPoint(problem, seed);
const witness = settling.settlingIsOptimization(settling.chargeValueCategory, improve, seed);
const leastAtTarget = witness.least(target);
const metricReading = settling.metricOptimumIsMinFixedPoint(problem, seed, target);
const prematureBound = witness.least(chargeValue("potential"));

assert.equal(problem.kind, "settling.optimizationProblem");
assert.equal(name(seed), "absurd");
assert.equal(name(optimum), "stable");
assert.equal(settling.locallyOptimal(problem, optimum), true);
assert.equal(settling.optimumReachable(problem, seed), true);
assert.equal(fixedPoint.kind, "settling.valueCategory.settleFixedPoint:witness");
assert.equal(witness.kind, "settling.settlingIsOptimization:witness");
assert.equal(name(witness.optimum), "stable");
assert.equal(witness.reachable, true);
assert.equal(witness.locallyOptimal, true);
assert.equal(leastAtTarget.kind, "settling.valueCategory.settleLeast:witness");
assert.equal(metricReading.kind, "settling.valueCategory.settleLeast:witness");
assert.equal(prematureBound.kind, "settling.valueCategory.settleLeast-obstruction");
assert.equal(prematureBound.reason, "bound-not-fixed");

console.log(JSON.stringify({
  product: "relating.optimization-settling",
  problem: {
    kind: problem.kind,
    seed: name(seed),
    target: name(target),
    optimum: name(optimum),
  },
  fixedPoint: {
    kind: fixedPoint.kind,
    locallyOptimal: settling.locallyOptimal(problem, optimum),
    reachable: settling.optimumReachable(problem, seed),
  },
  settlingAsOptimization: {
    kind: witness.kind,
    leastAtTarget: leastAtTarget.kind,
    metricReading: metricReading.kind,
    prematureBound: prematureBound.reason,
  },
  boundary: "optimization is exposed as value-category settling; it is not a numerical solver package",
}, null, 2));
