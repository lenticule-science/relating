import assert from "node:assert/strict";

import * as settling from "@emsenn/relating/settling";

const eq = (left, right) => left === right;
const lattice = {
  bottom: 0,
  leq: (left, right) => left <= right,
  join: (left, right) => Math.max(left, right),
  eq,
  sup: settling.stabilizingSup({ eq }),
};

const process = settling.closureProcess(lattice, (value) => Math.min(3, value + 1));
const closure = settling.closeOrdinalProcess(process);
const cycle = settling.learningCycleOfClosureCarrier(closure);

assert.equal(cycle.kind, "learning.cycle.observedClosureTrace");
assert.equal(cycle.ascent.kind, "learning.cycle.observedAscent:witness");
assert.equal(cycle.nontrivialReturn.kind, "learning.cycle.nontrivialReturn:witness");
assert.equal(cycle.stabilization.kind, "ordinal.closure.stabilization:witness");
assert.equal(cycle.depth?.name, "rote");

assert.deepEqual(closure.orbit.map((point) => point.value), [0, 1, 2, 3]);
assert.equal(cycle.ascent.steps.length, 3);
assert.equal(cycle.nontrivialReturn.inspectedPoints, 4);

console.log(JSON.stringify({
  product: "relating.learning-cycle",
  orbit: closure.orbit.map((point) => point.value),
  ascent: cycle.ascent.kind,
  nontrivialReturn: cycle.nontrivialReturn.kind,
  stabilization: cycle.stabilization.kind,
  depth: cycle.depth?.name ?? null,
  boundary: "observed closure trace read; caller still supplies the lawful closure process",
}, null, 2));
