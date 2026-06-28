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
    const logarithm = analysis.internalReal.logarithmReceipt();
    const lipschitz = analysis.internalReal.logLipschitzReceipt();

    assert.equal(step.kind, "internalReal.logStepBound:witness");
    assert.equal(rationalToString(step.lhs), "3");
    assert.equal(rationalToString(step.rhs), "10/3");
    assert.equal(badStep.kind, "internalReal.logStepBound-obstruction");
    assert.equal(badStep.reason, "domain");
    assert.equal(monotone.kind, "internalReal.logMonotone:witness");
    assert.equal(monotone.holds, true);
    assert.equal(logarithm.sourceModule, "RelMath.Real.Logarithm");
    assert.equal(logarithm.theorems.includes("RelMath.InternalReals.logNat_mul"), true);
    assert.equal(logarithm.theorems.includes("RelMath.InternalReals.golden_log_nested"), true);
    assert.equal(logarithm.sample.floorLog, 3);
    assert.equal(rationalToString(logarithm.sample.approximation), "3");
    assert.equal(logarithm.natLogSpecLower, true);
    assert.equal(logarithm.natLogSpecUpper, true);
    assert.equal(logarithm.logSeqSelf, true);
    assert.equal(logarithm.mulBounds.lowerHolds, true);
    assert.equal(logarithm.mulBounds.upperHolds, true);
    assert.deepEqual(logarithm.goldenNestedCrossProducts, [15, 16, 64, 65, 39, 40]);
    assert.equal(logarithm.goldenNested, true);
    assert.equal(lipschitz.sourceModule, "RelMath.Real.LogLipschitz");
    assert.equal(lipschitz.oneLogIsZero, true);
    assert.equal(lipschitz.invNatScalesToOne, true);
    assert.equal(lipschitz.powerLawSample, true);
  });

  it("models the finite GoldenLog and ColoringEntropy witnesses", () => {
    const cassiniEven = analysis.internalReal.goldenCassini(4);
    const cassiniOdd = analysis.internalReal.goldenCassini(5);
    const gap = analysis.internalReal.goldenConvergentLogGap(4, 2);
    const metallicCassini = analysis.internalReal.metallicCassini(2, 2);
    const metallicGap = analysis.internalReal.metallicConvergentGap(2, 2);
    const metallicReal = analysis.internalReal.metallicRealReceipt();
    const edge = analysis.internalReal.edgeColouringEntropy;
    const triangle = analysis.internalReal.triangleColouringEntropy(2);

    assert.equal(analysis.internalReal.fib(5), 8);
    assert.equal(cassiniEven.kind, "internalReal.goldenCassini:witness");
    assert.equal(cassiniEven.left, 1);
    assert.equal(cassiniOdd.kind, "internalReal.goldenCassini:witness");
    assert.equal(cassiniOdd.left, -1);
    assert.equal(gap.kind, "internalReal.goldenConvergentLogGap:witness");
    assert.equal(gap.fibonacci, 8);
    assert.equal(gap.square, 64);
    assert.equal(rationalToString(gap.bound), "1/3");
    assert.equal(analysis.internalReal.metallicNum(2, 4), 12);
    assert.equal(metallicCassini.kind, "internalReal.metallicCassini:witness");
    assert.equal(metallicCassini.left, -1);
    assert.equal(metallicGap.kind, "internalReal.metallicConvergentGap:witness");
    assert.equal(metallicGap.denominator, 60);
    assert.equal(rationalToString(metallicGap.gap), "1/60");
    assert.equal(rationalToString(metallicGap.telescopingBound), "7/60");
    assert.equal(metallicReal.sourceModule, "RelMath.Aperiodic.StepN.MetallicReal");
    assert.deepEqual(metallicReal.cassiniValues, [-1, 1, -1, 1, -1]);
    assert.equal(metallicReal.cassiniFlips, true);
    assert.equal(rationalToString(metallicReal.telescope.endpointGap), "1/2");
    assert.equal(rationalToString(metallicReal.telescope.telescopingBound), "1/2");
    assert.equal(edge.properColourings, 2);
    assert.equal(rationalToString(edge.entropy), "1");
    assert.equal(triangle.properColourings, 6);
    assert.equal(rationalToString(triangle.entropyApprox), "7/3");
  });

  it("models the constructive sqrt approximants and metallic root identity", () => {
    const sqrt = analysis.internalReal.sqrtSeqApproximation(2, 2);
    const ivt = analysis.internalReal.constructiveIvtReceipt(2, 2);
    const metallicRoot = analysis.internalReal.metallicRoot(3);
    const powerLens = analysis.internalReal.metallicPowerLensReceipt(3, 4);

    assert.equal(analysis.internalReal.natSqrt(18), 4);
    assert.equal(rationalToString(analysis.internalReal.sqrtSeq(2, 2)), "4/3");
    assert.equal(sqrt.kind, "internalReal.sqrtSeqApproximation:witness");
    assert.equal(sqrt.numerator, 4);
    assert.equal(sqrt.denominator, 3);
    assert.equal(rationalToString(sqrt.square), "16/9");
    assert.equal(rationalToString(sqrt.target), "2");
    assert.equal(rationalToString(sqrt.gap), "2/9");
    assert.equal(rationalToString(sqrt.gapBound), "4/3");
    assert.equal(ivt.sourceModule, "RelMath.Real.IVT");
    assert.equal(ivt.floorSqrtSpec, true);
    assert.equal(ivt.squareRootPinned, true);
    assert.equal(metallicRoot.kind, "internalReal.metallicRoot:witness");
    assert.equal(metallicRoot.radicand, 13);
    assert.equal(metallicRoot.leftConstant, 22);
    assert.equal(metallicRoot.rightConstant, 22);
    assert.equal(metallicRoot.sqrtCoefficient, 6);
    assert.equal(powerLens.sourceModule, "RelMath.Aperiodic.StepN.MetallicPowerLens");
    assert.deepEqual(powerLens.coef, [264, 160]);
    assert.deepEqual(powerLens.nextCoef, [1744, 1056]);
    assert.equal(powerLens.recurrenceHolds, true);
  });

  it("models finite constant-rational real multiplication laws", () => {
    const receipt = analysis.internalReal.realMultiplicationReceipt();

    assert.equal(receipt.kind, "internalReal.realMultiplication:witness");
    assert.equal(receipt.theorem, "RelMath.InternalReals.RReal.mul");
    assert.equal(rationalToString(receipt.product), "-2/5");
    assert.equal(receipt.absMul, true);
    assert.equal(receipt.leftMonotoneNonnegative, true);
    assert.equal(receipt.rightMonotoneNonnegative, true);
    assert.equal(receipt.boundScaling, true);
    assert.equal(receipt.productIncrementSplit, true);
    assert.equal(receipt.commutative, true);
    assert.equal(receipt.associative, true);
    assert.equal(receipt.leftDistributive, true);
    assert.equal(receipt.rightDistributive, true);
    assert.equal(
      receipt.boundary,
      "finite constant-rational shadow of Bishop real multiplication; arbitrary real product moduli remain proof-side",
    );
  });

  it("models Salem/Pisot polynomial signs and square-root root identities", () => {
    const salem = analysis.internalReal.salemPisotReceipt();

    assert.equal(analysis.internalReal.evalIntPoly(analysis.internalReal.salemTrace, -2), 3);
    assert.equal(analysis.internalReal.evalIntPoly(analysis.internalReal.salemTrace, 0), -3);
    assert.equal(analysis.internalReal.evalIntPoly(analysis.internalReal.salemTrace, 2), -1);
    assert.equal(analysis.internalReal.evalIntPoly(analysis.internalReal.salemTrace, 3), 3);
    assert.equal(analysis.internalReal.reciprocal(analysis.internalReal.charPolySalem), true);
    assert.equal(analysis.internalReal.reciprocal(analysis.internalReal.charPolyMetallic(1)), false);
    assert.deepEqual(salem.salemUnitCircleSigns, [3, -3]);
    assert.deepEqual(salem.salemRealRootSigns, [-1, 3]);
    assert.deepEqual(salem.pisotContractingSigns, [1, -1]);
    assert.equal(salem.salemTraceRoot.radicand, 13);
    assert.equal(salem.salemTraceRoot.leftConstant, 14);
    assert.equal(salem.goldenRoot.radicand, 5);
    assert.equal(salem.goldenRoot.leftConstant, 6);
    assert.equal(salem.salemDeterminant, 1);
    assert.equal(salem.pisotDeterminant, -1);
  });

  it("models exponential-series decay and the metallization dichotomy", () => {
    const exp = analysis.internalReal.expSeriesReceipt();
    const dichotomy = analysis.internalReal.metallizationDichotomyReceipt();

    assert.equal(rationalToString(analysis.internalReal.expTerm(3)), "1/6");
    assert.equal(rationalToString(analysis.internalReal.expSeq(4)), "8/3");
    assert.equal(exp.sourceModule, "RelMath.Real.ExpSeries");
    assert.equal(exp.factorialDominatesSelf, true);
    assert.equal(exp.termHalving, true);
    assert.equal(rationalToString(exp.summable.partial), "8/3");
    assert.equal(rationalToString(exp.summable.bound), "3");
    assert.equal(dichotomy.sourceModule, "RelMath.Aperiodic.MetallizationDichotomy");
    assert.equal(dichotomy.finiteMetallicExpansion, true);
    assert.equal(dichotomy.chromaticNonIdempotent, true);
    assert.equal(dichotomy.exponentialSummable, true);
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
    const logarithm = analysis.internalReal.logarithmReceipt();
    const lipschitz = analysis.internalReal.logLipschitzReceipt();

    assert.deepEqual(evaluateRunTerm(internalReal.logStepBound, step), step);
    assert.deepEqual(evaluateRunTerm(internalReal.logMonotone, monotone), monotone);
    assert.deepEqual(evaluateRunTerm(internalReal.logarithm, logarithm), logarithm);
    assert.deepEqual(evaluateRunTerm(internalReal.logLipschitz, lipschitz), lipschitz);
  });

  it("normalizes GoldenLog and ColoringEntropy carrier judgments", () => {
    const gap = analysis.internalReal.goldenConvergentLogGap(4, 2);
    const metallicGap = analysis.internalReal.metallicConvergentGap(1, 1);
    const metallicReal = analysis.internalReal.metallicRealReceipt();
    const edge = analysis.internalReal.edgeColouringEntropy;
    const triangle = analysis.internalReal.triangleColouringEntropy(2);

    assert.deepEqual(evaluateRunTerm(internalReal.goldenConvergentLogGap, gap), gap);
    assert.deepEqual(evaluateRunTerm(internalReal.metallicConvergentGap, metallicGap), metallicGap);
    assert.deepEqual(evaluateRunTerm(internalReal.metallicReal, metallicReal), metallicReal);
    assert.deepEqual(evaluateRunTerm(internalReal.edgeColouringEntropy, edge), edge);
    assert.deepEqual(evaluateRunTerm(internalReal.triangleColouringEntropy, triangle), triangle);
  });

  it("normalizes sqrt and metallic-root carrier judgments", () => {
    const sqrt = analysis.internalReal.sqrtSeqApproximation(2, 2);
    const ivt = analysis.internalReal.constructiveIvtReceipt(2, 2);
    const metallicRoot = analysis.internalReal.metallicRoot(3);
    const powerLens = analysis.internalReal.metallicPowerLensReceipt(3, 4);

    assert.deepEqual(evaluateRunTerm(internalReal.sqrtSeqApproximation, sqrt), sqrt);
    assert.deepEqual(evaluateRunTerm(internalReal.constructiveIvt, ivt), ivt);
    assert.deepEqual(evaluateRunTerm(internalReal.metallicRoot, metallicRoot), metallicRoot);
    assert.deepEqual(evaluateRunTerm(internalReal.metallicPowerLens, powerLens), powerLens);
  });

  it("normalizes the finite real-multiplication carrier judgment", () => {
    const receipt = analysis.internalReal.realMultiplicationReceipt();

    assert.deepEqual(evaluateRunTerm(internalReal.realMultiplication, receipt), receipt);
  });

  it("normalizes the Salem/Pisot carrier judgment", () => {
    const salem = analysis.internalReal.salemPisotReceipt();

    assert.deepEqual(evaluateRunTerm(internalReal.salemPisot, salem), salem);
  });

  it("normalizes exp-series and metallization-dichotomy carrier judgments", () => {
    const exp = analysis.internalReal.expSeriesReceipt();
    const dichotomy = analysis.internalReal.metallizationDichotomyReceipt();

    assert.deepEqual(evaluateRunTerm(internalReal.expSeries, exp), exp);
    assert.deepEqual(evaluateRunTerm(internalReal.metallizationDichotomy, dichotomy), dichotomy);
  });
});
