import assert from "node:assert/strict";

import { evaluateRunTerm, probability } from "@emsenn/relating";
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

const outcomes = ["sun", "rain", "wind", "rain-wind"];
const sample = settling.sampleSpace(outcomes);
const rainy = (outcome) => outcome.includes("rain");
const windy = (outcome) => outcome.includes("wind");
const calm = (outcome) => !outcome.includes("wind");

const rainMass = settling.measure(sample, rainy);
const windMass = settling.measure(sample, windy);
const totalMass = settling.total(sample);
const valuation = settling.measureIsValuation(sample, rainy, calm);
const conditional = settling.conditionalViaFiberAdjoint(sample, rainy, windy);
const reindexOk = settling.conditioningIsReindex(
  sample,
  (outcome) => outcome.length,
  (length) => length > 4,
  (longerThanFour) => longerThanFour,
);

const stationary = settling.markovStationaryIsClosureFixpoint(
  settling.witnessKernel,
  settling.natStochSemiring,
  settling.uniformWitness,
);
const advancedAtZero = settling.advance(
  settling.witnessKernel,
  settling.natStochSemiring,
  settling.uniformWitness,
)(0);
const closureAtOneOne = settling.stochClosure(
  settling.witnessKernel,
  settling.natStochSemiring,
  (s, z) => (s === z ? analysis.natOne : analysis.natZero),
)(1, 1);
const regimeData = settling.closureRegimeData(true, true, true);
const stochasticWitness = settling.stochasticIsValueSettling(settling.natStochSemiring, regimeData.data);

assert.equal(sample.kind, "settling.sampleSpace");
assert.equal(naturalToNumber(totalMass), 4);
assert.equal(naturalToNumber(rainMass), 2);
assert.equal(naturalToNumber(windMass), 2);
assert.equal(valuation.kind, "settling.measureIsValuation:witness");
assert.equal(valuation.empty, true);
assert.equal(valuation.univ, true);
assert.equal(valuation.additiveOnDisjoint, true);
assert.equal(valuation.monotone, true);
assert.equal(valuation.complement, true);
assert.equal(conditional.kind, "settling.conditionalViaFiberAdjoint:witness");
assert.equal(conditional.restriction, true);
assert.equal(conditional.bayesSymmetry, true);
assert.equal(conditional.boundedByMarginal, true);
assert.equal(reindexOk, true);
assert.equal(stationary.kind, "settling.markovStationaryIsClosureFixpoint:witness");
assert.equal(stationary.stationary, true);
assert.equal(stationary.fixpoint, true);
assert.equal(stationary.equivalent, true);
assert.equal(naturalToNumber(advancedAtZero), 1);
assert.equal(naturalToNumber(closureAtOneOne), 1);
assert.equal(regimeData.kind, "settling.closureRegimeData:witness");
assert.equal(stochasticWitness.kind, "settling.stochasticIsValueSettling:witness");
assert.equal(stochasticWitness.regime.kind, "ordinal.closure.regime.finite");
assert.equal(stochasticWitness.stationaryExists, true);
assert.deepEqual(evaluateRunTerm(probability.measureIsValuation, valuation), valuation);
assert.deepEqual(evaluateRunTerm(probability.conditionalViaFiberAdjoint, conditional), conditional);
assert.deepEqual(evaluateRunTerm(probability.markovStationaryIsClosureFixpoint, stationary), stationary);
assert.deepEqual(evaluateRunTerm(probability.stochasticIsValueSettling, stochasticWitness), stochasticWitness);

console.log(JSON.stringify({
  product: "relating.probability-stochastic-settling",
  probability: {
    outcomes,
    totalMass: naturalToNumber(totalMass),
    rainMass: naturalToNumber(rainMass),
    windMass: naturalToNumber(windMass),
    valuation: valuation.kind,
    conditional: conditional.kind,
    rmnValuation: evaluateRunTerm(probability.measureIsValuation, valuation).kind,
    rmnConditional: evaluateRunTerm(probability.conditionalViaFiberAdjoint, conditional).kind,
    reindexFunctorial: reindexOk,
  },
  stochastic: {
    kernel: settling.witnessKernel.kind,
    stationary: stationary.kind,
    stationaryEquivalentToFixpoint: stationary.equivalent,
    advancedAtZero: naturalToNumber(advancedAtZero),
    closureAtOneOne: naturalToNumber(closureAtOneOne),
    rmnStationary: evaluateRunTerm(probability.markovStationaryIsClosureFixpoint, stationary).kind,
    rmnStochasticSettling: evaluateRunTerm(probability.stochasticIsValueSettling, stochasticWitness).kind,
    regime: stochasticWitness.regime.kind,
    stationaryExists: stochasticWitness.stationaryExists,
  },
  boundary: "finite counting measure and abstract stochastic witnesses; not a real-valued probability or Markov-chain solver",
}, null, 2));
