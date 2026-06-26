import assert from "node:assert/strict";

import * as analysis from "@emsenn/relating/analysis";
import * as settling from "@emsenn/relating/settling";

function naturalToNumber(value) {
  let count = 0;
  let current = value;
  while (!analysis.natIsZero(current)) {
    count += 1;
    current = analysis.predecessor(current);
  }
  return count;
}

function ordinalSummary(ordinal) {
  const finite = settling.finiteOrdinalJudgment(ordinal);
  if (finite.kind === "ordinal.closure.finiteOrdinal:witness") {
    return { kind: "finite", value: naturalToNumber(finite.value) };
  }
  if (ordinal.kind === "ordinal.closure.ordinal.limit") {
    return { kind: "limit", label: ordinal.label.mark.value.kind };
  }
  return { kind: ordinal.kind };
}

const finiteChainLattice = Object.freeze({
  bottom: 0,
  leq: (left, right) => left <= right,
  join: (left, right) => Math.max(left, right),
  eq: (left, right) => left === right,
  sup: (sequence) => {
    let previous = sequence(analysis.natZero);
    for (let n = analysis.successor(analysis.natZero); ; n = analysis.successor(n)) {
      const current = sequence(n);
      if (current === previous) return current;
      previous = current;
    }
  },
});

const process = settling.closureProcess(
  finiteChainLattice,
  (value) => Math.min(3, value + 1),
);

const closed = settling.closeOrdinalProcess(process);

assert.equal(closed.value, 3);
assert.equal(closed.search.kind, "ordinal.closure.stabilizationSearch:witness");
assert.equal(closed.search.regime.kind, "ordinal.closure.regime.finite");
assert.deepEqual(ordinalSummary(closed.search.ordinal), { kind: "finite", value: 3 });

const regimes = {
  finite: settling.closureRegimeOfOrdinal(settling.finiteOrdinal(analysis.count([0, 1, 2]))).kind,
  omega: settling.closureRegimeOfOrdinal(settling.omegaOrdinal()).kind,
  omegaSquared: settling.closureRegimeOfOrdinal(settling.omegaSquaredOrdinal()).kind,
};

assert.equal(regimes.finite, "ordinal.closure.regime.finite");
assert.equal(regimes.omega, "ordinal.closure.regime.scott");
assert.equal(regimes.omegaSquared, "ordinal.closure.regime.transfinite");

console.log(JSON.stringify({
  product: "relating.closure-regime",
  closed: {
    value: closed.value,
    stabilization: closed.search.kind,
    regime: closed.search.regime.kind,
    ordinal: ordinalSummary(closed.search.ordinal),
    orbit: closed.orbit.map((point) => ({
      stage: ordinalSummary(point.stage),
      value: point.value,
    })),
  },
  regimes,
  boundary: "bounded search over caller-supplied lattices; not a full transfinite ordinal runtime",
}, null, 2));
