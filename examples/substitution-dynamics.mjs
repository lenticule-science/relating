import assert from "node:assert/strict";

import { dynamicsTerms, evaluateRunTerm, recurrenceTerms } from "@emsenn/relating";
import * as dynamics from "@emsenn/relating/dynamics";

const { recurrence } = dynamics;
const { hull, mld } = dynamics;

const naturalNumber = (natural) => natural.members.length;
const integerNumber = (integer) => naturalNumber(integer.pos) - naturalNumber(integer.neg);
const integerPolynomial = (polynomial) => polynomial.map(integerNumber);
const integerMatrix = (matrix) => matrix.map((row) => row.map(integerNumber));

const hierarchy = recurrence.stepNHierarchy(recurrence.fibonacciStepN.matrixDim);

assert.equal(hierarchy.kind, "substitution.dynamics.recurrence.hierarchy");
assert.equal(hierarchy.atParameter.kind, "substitution.dynamics.recurrence.allEqual:witness");
assert.equal(hierarchy.atSuccessor.kind, "substitution.dynamics.recurrence.allEqual:witness");
assert.equal(hierarchy.fibonacci.kind, "substitution.dynamics.recurrence.growthDegree:witness");
assert.equal(hierarchy.padovan.kind, "substitution.dynamics.recurrence.growthDegree:witness");
assert.equal(hierarchy.fourCornerAlignment, true);
assert.deepEqual(evaluateRunTerm(recurrenceTerms.stepNHierarchy, hierarchy), hierarchy);
assert.deepEqual(integerPolynomial(recurrence.fibonacciCharacteristicPolynomial), [-1, -1, 1]);
assert.deepEqual(integerPolynomial(recurrence.padovanCharacteristicPolynomial), [-1, -1, 0, 1]);

const primitive = dynamics.primitiveMatrix(recurrence.fibonacciIncidence);
assert.equal(primitive.kind, "substitution.dynamics.primitiveMatrix:witness");

const mismatch = recurrence.growthDegree(
  recurrence.fibonacciIncidence,
  recurrence.fibonacciStepN.matrixDim,
  recurrence.plasticNumberMinimalPolynomial,
);
assert.equal(mismatch.kind, "substitution.dynamics.recurrence.growthDegree-obstruction");
assert.equal(mismatch.reason, "declared-mismatch");
assert.deepEqual(evaluateRunTerm(recurrenceTerms.growthDegree, mismatch), mismatch);

const fibonacciInvariant = dynamics.stepNInvariant(recurrence.fibonacciIncidence);
assert.equal(fibonacciInvariant.kind, "substitution.dynamics.stepNInvariant");

const mldWitness = mld.mutuallyLocallyDerivable(
  recurrence.fibonacciIncidence,
  recurrence.fibonacciIncidence,
);
assert.equal(mldWitness.kind, "substitution.dynamics.mld:witness");
assert.deepEqual(evaluateRunTerm(dynamicsTerms.mutuallyLocallyDerivable, mldWitness), mldWitness);

const mldObstruction = mld.mutuallyLocallyDerivable(
  recurrence.fibonacciIncidence,
  recurrence.padovanIncidence,
);
assert.equal(mldObstruction.kind, "substitution.dynamics.mld-obstruction");
assert.deepEqual(evaluateRunTerm(dynamicsTerms.mutuallyLocallyDerivable, mldObstruction), mldObstruction);

const odometer = hull.odometerHull();
const thread = hull.coherentThread(odometer, ["", "0", "01", "010"], (left, right) => left === right);
assert.equal(thread.kind, "substitution.dynamics.hull.thread:witness");
assert.deepEqual(hull.hullSeam(recurrence.fibonacciIncidence), mld.mldInvariant(recurrence.fibonacciIncidence));
assert.deepEqual(evaluateRunTerm(dynamicsTerms.hullThread, thread), thread);
assert.deepEqual(evaluateRunTerm(dynamicsTerms.hullSeam, hull.hullSeam(recurrence.fibonacciIncidence)), hull.hullSeam(recurrence.fibonacciIncidence));

console.log(JSON.stringify({
  product: "relating.substitution-dynamics",
  hierarchy: {
    parameter: naturalNumber(hierarchy.parameter),
    atParameter: hierarchy.atParameter.kind,
    atSuccessor: hierarchy.atSuccessor.kind,
    rmnNormalizer: evaluateRunTerm(recurrenceTerms.stepNAllEqual, hierarchy.atParameter).kind,
    fourCornerAlignment: hierarchy.fourCornerAlignment,
  },
  fibonacci: {
    incidence: integerMatrix(recurrence.fibonacciIncidence),
    characteristicPolynomial: integerPolynomial(recurrence.fibonacciCharacteristicPolynomial),
    growthDegree: hierarchy.fibonacci.kind,
    primitive: {
      kind: primitive.kind,
      exponent: naturalNumber(primitive.exponent),
    },
    stepInvariantRank: naturalNumber(fibonacciInvariant.rank),
  },
  padovan: {
    incidenceTargetBySource: integerMatrix(recurrence.padovanIncidence),
    characteristicPolynomial: integerPolynomial(recurrence.padovanCharacteristicPolynomial),
    growthDegree: hierarchy.padovan.kind,
  },
  obstruction: {
    kind: mismatch.kind,
    reason: mismatch.reason,
  },
  mld: {
    identical: mldWitness.kind,
    rmnNormalizer: evaluateRunTerm(dynamicsTerms.mutuallyLocallyDerivable, mldWitness).kind,
    separated: {
      kind: mldObstruction.kind,
      reason: mldObstruction.reason,
    },
  },
  hull: {
    odometerStage2: odometer.stage(2),
    thread: thread.kind,
    rmnNormalizer: evaluateRunTerm(dynamicsTerms.hullThread, thread).kind,
    seamRank: naturalNumber(hull.hullSeam(recurrence.fibonacciIncidence).rank),
  },
}, null, 2));
