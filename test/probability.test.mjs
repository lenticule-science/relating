/**
 * Contract: finite probability/stochastic-settling witnesses mirror the green
 * RelMath Probability surface and expose RMN-normalizable carrier judgments.
 */
import { describe, it } from "node:test";
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

describe("settling probability: finite counting-measure and stochastic witnesses", () => {
  it("models counting measure as a valuation and conditioning as reindexing", () => {
    const sample = settling.sampleSpace(["sun", "rain", "wind", "rain-wind"]);
    const rainy = (outcome) => outcome.includes("rain");
    const windy = (outcome) => outcome.includes("wind");
    const calm = (outcome) => !outcome.includes("wind");

    const valuation = settling.measureIsValuation(sample, rainy, calm);
    const conditional = settling.conditionalViaFiberAdjoint(sample, rainy, windy);
    const reindexOk = settling.conditioningIsReindex(
      sample,
      (outcome) => outcome.length,
      (length) => length > 4,
      (longerThanFour) => longerThanFour,
    );

    assert.equal(naturalToNumber(settling.total(sample)), 4);
    assert.equal(naturalToNumber(settling.measure(sample, rainy)), 2);
    assert.equal(naturalToNumber(settling.measure(sample, windy)), 2);
    assert.equal(valuation.kind, "settling.measureIsValuation:witness");
    assert.deepEqual(
      {
        empty: valuation.empty,
        univ: valuation.univ,
        additiveOnDisjoint: valuation.additiveOnDisjoint,
        monotone: valuation.monotone,
        complement: valuation.complement,
      },
      {
        empty: true,
        univ: true,
        additiveOnDisjoint: true,
        monotone: true,
        complement: true,
      },
    );
    assert.equal(conditional.kind, "settling.conditionalViaFiberAdjoint:witness");
    assert.equal(conditional.restriction, true);
    assert.equal(conditional.bayesSymmetry, true);
    assert.equal(conditional.boundedByMarginal, true);
    assert.equal(reindexOk, true);
  });

  it("models Markov stationarity as stochastic-closure fixed point", () => {
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

    assert.equal(stationary.kind, "settling.markovStationaryIsClosureFixpoint:witness");
    assert.equal(stationary.stationary, true);
    assert.equal(stationary.fixpoint, true);
    assert.equal(stationary.equivalent, true);
    assert.equal(naturalToNumber(advancedAtZero), 1);
    assert.equal(naturalToNumber(closureAtOneOne), 1);
    assert.equal(stochasticWitness.kind, "settling.stochasticIsValueSettling:witness");
    assert.equal(stochasticWitness.regime.kind, "ordinal.closure.regime.finite");
    assert.equal(stochasticWitness.stationaryExists, true);
  });

  it("carries the rational unit-interval value-category shadow", () => {
    const interval = settling.realUnitIntervalValueCategory();

    assert.equal(interval.kind, "settling.realUnitIntervalValueCategory:witness");
    assert.equal(interval.zeroLeOne, true);
    assert.equal(interval.botIsZero, true);
    assert.equal(interval.constructiveRealCompletion, "documented-boundary");
  });
});

describe("probability RMN terms normalize finite probability carriers", () => {
  it("normalizes valuation, conditioning, stationarity, and stochastic-settling witnesses", () => {
    const sample = settling.sampleSpace(["sun", "rain", "wind", "rain-wind"]);
    const rainy = (outcome) => outcome.includes("rain");
    const windy = (outcome) => outcome.includes("wind");
    const calm = (outcome) => !outcome.includes("wind");
    const regimeData = settling.closureRegimeData(true, true, true);

    const valuation = settling.measureIsValuation(sample, rainy, calm);
    const conditional = settling.conditionalViaFiberAdjoint(sample, rainy, windy);
    const stationary = settling.markovStationaryIsClosureFixpoint(
      settling.witnessKernel,
      settling.natStochSemiring,
      settling.uniformWitness,
    );
    const stochasticWitness = settling.stochasticIsValueSettling(settling.natStochSemiring, regimeData.data);
    const interval = settling.realUnitIntervalValueCategory();

    assert.deepEqual(evaluateRunTerm(probability.measureIsValuation, valuation), valuation);
    assert.deepEqual(evaluateRunTerm(probability.conditionalViaFiberAdjoint, conditional), conditional);
    assert.deepEqual(evaluateRunTerm(probability.markovStationaryIsClosureFixpoint, stationary), stationary);
    assert.deepEqual(evaluateRunTerm(probability.stochasticIsValueSettling, stochasticWitness), stochasticWitness);
    assert.deepEqual(evaluateRunTerm(probability.realUnitIntervalValueCategory, interval), interval);
  });
});
