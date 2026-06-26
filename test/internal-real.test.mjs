/**
 * Contract: finite internal-real/log models expose Lean-green facts as exact
 * carrier judgments, and the corresponding RMN terms normalize those judgments.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { evaluateRunTerm, internalReal } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

function naturalToNumber(value) {
  let count = 0;
  let current = value;
  while (!analysis.natIsZero(current)) {
    count += 1;
    current = analysis.predecessor(current);
  }
  return count;
}

function integerToNumber(value) {
  return naturalToNumber(value.pos) - naturalToNumber(value.neg);
}

function rationalToString(value) {
  const numerator = integerToNumber(value.num);
  const denominator = integerToNumber(value.den);
  return denominator === 1 ? String(numerator) : `${numerator}/${denominator}`;
}

describe("analysis.internalReal: finite exact models of green RelMath real/log proofs", () => {
  it("computes the Lean natLog/logSeq rational approximants exactly", () => {
    assert.equal(analysis.internalReal.natLog(2, 8), 3);
    assert.equal(analysis.internalReal.natLog(2, 9), 3);
    assert.equal(rationalToString(analysis.internalReal.logSeq(2, 8, 2)), "3");
    assert.equal(rationalToString(analysis.internalReal.invNatP(2)), "1/3");
    assert.equal(rationalToString(analysis.internalReal.binaryShiftEntropy.value), "1");
  });

  it("models positive scalar cancellation as a witness/obstruction carrier", () => {
    const left = analysis.fromRatio(1, 3);
    const right = analysis.fromRatio(2, 3);
    const witness = analysis.internalReal.scalarCancellation(3, left, right);
    const obstruction = analysis.internalReal.scalarCancellation(0, left, right);

    assert.equal(witness.kind, "internalReal.scalarCancellation:witness");
    assert.equal(rationalToString(witness.scaledLeft), "1");
    assert.equal(rationalToString(witness.scaledRight), "2");
    assert.equal(obstruction.kind, "internalReal.scalarCancellation-obstruction");
    assert.equal(obstruction.reason, "positive-scalar");
  });

  it("models the per-step log-Lipschitz bound and entropy monotonicity", () => {
    const step = analysis.internalReal.logStepBound(8, 2);
    const badStep = analysis.internalReal.logStepBound(2, 1);
    const monotone = analysis.internalReal.logMonotone(2, 3, 5, 2);

    assert.equal(step.kind, "internalReal.logStepBound:witness");
    assert.equal(rationalToString(step.lhs), "3");
    assert.equal(rationalToString(step.rhs), "10/3");
    assert.equal(badStep.kind, "internalReal.logStepBound-obstruction");
    assert.equal(badStep.reason, "domain");
    assert.equal(monotone.kind, "internalReal.logMonotone:witness");
    assert.equal(monotone.holds, true);
  });
});

describe("internalReal RMN terms normalize the exact witness carriers", () => {
  it("normalizes scalar-cancellation carrier judgments", () => {
    const input = analysis.internalReal.scalarCancellation(
      3,
      analysis.fromRatio(1, 3),
      analysis.fromRatio(2, 3),
    );
    const normal = evaluateRunTerm(internalReal.scalarCancellation, input);

    assert.equal(normal.kind, input.kind);
    assert.equal(normal.positive, true);
    assert.equal(normal.premiseHolds, true);
    assert.equal(normal.conclusionHolds, true);
    assert.deepEqual(normal.scaledLeft, input.scaledLeft);
  });

  it("normalizes log-step and log-monotone carrier judgments", () => {
    const step = analysis.internalReal.logStepBound(8, 2);
    const monotone = analysis.internalReal.logMonotone(2, 3, 5, 2);

    assert.deepEqual(evaluateRunTerm(internalReal.logStepBound, step), step);
    assert.deepEqual(evaluateRunTerm(internalReal.logMonotone, monotone), monotone);
  });
});
