/**
 * Contract: `dynamics.recurrence` — the step-`n` co-incrementing hierarchy.
 * A single parameter `n` locks the incidence-matrix dimension, recurrence depth,
 * alphabet size, and cohomological rank together; the growth rate is a degree-`n`
 * algebraic number whose monic integer characteristic polynomial relating DERIVES
 * from a real substitution (Fibonacci ↦ golden ratio, Padovan ↦ plastic number).
 * Ported from lean/RelMath/Aperiodic/StepN/Recurrence.lean.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { dynamics } from "@emsenn/relating";

const { recurrence } = dynamics;

describe("dynamics.recurrence: the step-n co-incrementing hierarchy", () => {
  const hierarchy = recurrence.stepNHierarchy(recurrence.fibonacciStepN.matrixDim);

  it("the four controlled quantities of the canonical bundle all coincide", () => {
    assert.equal(hierarchy.atParameter.kind, "substitution.dynamics.recurrence.allEqual:witness");
  });

  it("the +1 in the parameter propagates to all four quantities (the (n+1) bundle)", () => {
    assert.equal(hierarchy.atSuccessor.kind, "substitution.dynamics.recurrence.allEqual:witness");
  });

  it("Fibonacci growth rate is degree 2: derived char poly = golden-ratio minimal polynomial", () => {
    assert.equal(hierarchy.fibonacci.kind, "substitution.dynamics.recurrence.growthDegree:witness");
    assert.ok(recurrence.samePolynomial(
      recurrence.fibonacciCharacteristicPolynomial,
      recurrence.goldenRatioMinimalPolynomial,
    ));
    assert.ok(recurrence.degreeN(recurrence.fibonacciCharacteristicPolynomial, recurrence.fibonacciStepN.matrixDim));
    assert.ok(recurrence.monic(recurrence.fibonacciCharacteristicPolynomial));
  });

  it("Padovan growth rate is degree 3: derived char poly = plastic-number minimal polynomial", () => {
    assert.equal(hierarchy.padovan.kind, "substitution.dynamics.recurrence.growthDegree:witness");
    assert.ok(recurrence.samePolynomial(
      recurrence.padovanCharacteristicPolynomial,
      recurrence.plasticNumberMinimalPolynomial,
    ));
    assert.ok(recurrence.degreeN(recurrence.padovanCharacteristicPolynomial, recurrence.padovanStepN.matrixDim));
    assert.ok(recurrence.monic(recurrence.padovanCharacteristicPolynomial));
  });

  it("n = 2 ↔ FOUR: the bilattice's 4 = 2² corners align with the step-2 instance", () => {
    assert.equal(hierarchy.fourCornerAlignment, true);
  });

  it("the recurrence node descends from substitution's step-N invariant", () => {
    assert.equal(hierarchy.fibonacciStepNInvariant.kind, "substitution.dynamics.stepNInvariant");
  });

  it("the growth-degree judgment refuses a mismatched declared polynomial", () => {
    const judgment = recurrence.growthDegree(
      recurrence.fibonacciIncidence,
      recurrence.fibonacciStepN.matrixDim,
      recurrence.plasticNumberMinimalPolynomial,
    );
    assert.equal(judgment.kind, "substitution.dynamics.recurrence.growthDegree-obstruction");
  });
});
