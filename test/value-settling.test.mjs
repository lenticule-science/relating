/**
 * Contract: value-category settling and optimization expose the green
 * RelMath.Value finite law surface as RMN-normalizable carrier receipts.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { chargeValue, evaluateRunTerm, valueSettling } from "@emsenn/relating";
import * as settling from "@emsenn/relating/settling";

describe("settling value-category parity receipts", () => {
  it("checks Boolean and FOUR value-category/closure laws over full finite carriers", () => {
    const boolOrder = settling.partialOrderOver(settling.booleanValueCategory, settling.booleanSample);
    const chargeOrder = settling.partialOrderOver(settling.chargeValueCategory, settling.chargeSample);
    const boolClosure = settling.booleanJoinVClosure(true);
    const chargeClosure = settling.chargeJoinVClosure(chargeValue("potential"));
    const boolClosureLaw = settling.closureOver(settling.booleanValueCategory, boolClosure, settling.booleanSample);
    const chargeClosureLaw = settling.closureOver(settling.chargeValueCategory, chargeClosure, settling.chargeSample);

    assert.equal(boolOrder.kind, "settling.valueCategory.partialOrder:witness");
    assert.equal(chargeOrder.kind, "settling.valueCategory.partialOrder:witness");
    assert.equal(boolClosureLaw.kind, "settling.vClosure.law:witness");
    assert.equal(chargeClosureLaw.kind, "settling.vClosure.law:witness");
    assert.equal(settling.settleOverValue(boolClosure, false), true);
    assert.equal(settling.settleOverValue(chargeClosure, chargeValue("absurd")).name, "potential");
  });

  it("carries fixed-point, least-fixed-point, regime independence, and spine-recovery receipts", () => {
    const closure = settling.chargeJoinVClosure(chargeValue("potential"));
    const fixed = settling.settleFixedPoint(settling.chargeValueCategory, closure, chargeValue("absurd"));
    const least = settling.settleLeast(settling.chargeValueCategory, closure, chargeValue("absurd"), chargeValue("stable"));
    const regimeData = settling.closureRegimeData(true, true, true);
    const independence = settling.fourRegimeValueIndependent(
      settling.booleanValueCategory,
      settling.booleanJoinVClosure(true),
      settling.chargeValueCategory,
      closure,
      regimeData.data,
    );
    const recovery = settling.spineRecovery(chargeValue("active"));

    assert.equal(fixed.kind, "settling.valueCategory.settleFixedPoint:witness");
    assert.equal(fixed.settled.name, "potential");
    assert.equal(least.kind, "settling.valueCategory.settleLeast:witness");
    assert.equal(independence.kind, "settling.valueIndependentRegime:witness");
    assert.equal(independence.regime.kind, "ordinal.closure.regime.finite");
    assert.equal(independence.dichotomy.exclusiveAndExhaustive, true);
    assert.equal(recovery.kind, "settling.spineRecovery:witness");
    assert.equal(recovery.chargePartialOrder.kind, "settling.valueCategory.partialOrder:witness");
    assert.equal(recovery.chargeClosureLaws.kind, "settling.vClosure.law:witness");
    assert.equal(recovery.reachesTarget, true);
  });

  it("carries optimization-as-settling as serializable receipt data", () => {
    const improve = settling.booleanJoinVClosure(true);
    const receipt = settling.settlingOptimizationReceipt(
      settling.booleanValueCategory,
      improve,
      false,
      true,
    );

    assert.equal(receipt.kind, "settling.optimization:witness");
    assert.equal(receipt.optimum, true);
    assert.equal(receipt.reachable, true);
    assert.equal(receipt.locallyOptimal, true);
    assert.equal(receipt.fixedPoint.kind, "settling.valueCategory.settleFixedPoint:witness");
    assert.equal(receipt.least.kind, "settling.valueCategory.settleLeast:witness");
  });

  it("carries exact counting-to-Boolean dequantization", () => {
    const receipt = settling.countingDequantizationReceipt();

    assert.equal(settling.support(0), false);
    assert.equal(settling.support(5), true);
    assert.deepEqual(receipt.support, [false, true, true, true, true]);
    assert.equal(receipt.boolStochIdempotent, true);
    assert.equal(receipt.natStochNotIdempotent, true);
    assert.equal(receipt.mapsAddToOr, true);
    assert.equal(receipt.mapsMulToAnd, true);
    assert.equal(receipt.monotone, true);
    assert.equal(receipt.diamondApexCount, 5);
    assert.equal(receipt.diamondApexSupport, true);
  });

  it("carries the magnitude witness that Boolean support forgets", () => {
    const receipt = settling.magnitudeWitnessReceipt(3);

    assert.equal(settling.divides(3, 6), true);
    assert.equal(settling.divides(3, 7), false);
    assert.equal(settling.magnitudeWitness(3, 6), false);
    assert.equal(settling.magnitudeWitness(3, 7), true);
    assert.equal(receipt.kind, "settling.dequantization.magnitudeWitness:witness");
    assert.equal(receipt.theoremSuppBlindToDvd, "RelMath.Dequantization.supp_blind_to_dvd");
    assert.equal(receipt.theoremWitnessOne, "RelMath.Dequantization.witness_one");
    assert.equal(receipt.theoremWitnessZero, "RelMath.Dequantization.witness_zero");
    assert.equal(receipt.theoremDiamondBoundaryWitness, "RelMath.Dequantization.diamond_boundary_witness");
    assert.equal(receipt.theoremDiamondInteriorNoWitness, "RelMath.Dequantization.diamond_interior_no_witness");
    assert.equal(receipt.divisor, 3);
    assert.equal(receipt.divisibleMagnitude, 3);
    assert.equal(receipt.nondivisibleMagnitude, 4);
    assert.equal(receipt.supportSame, true);
    assert.equal(receipt.divisibleWitness, false);
    assert.equal(receipt.nondivisibleWitness, true);
    assert.equal(receipt.witnessOne, true);
    assert.equal(receipt.witnessZero, false);
    assert.equal(receipt.diamondBoundaryMagnitude, 1);
    assert.equal(receipt.diamondInteriorMagnitude, 0);
    assert.equal(receipt.diamondBoundaryWitness, true);
    assert.equal(receipt.diamondInteriorWitness, false);
    assert.equal(receipt.dequantizationForgetsDivisibility, true);
  });
});

describe("valueSettling RMN terms normalize finite value-category receipts", () => {
  it("normalizes value-category and optimization receipts", () => {
    const closure = settling.chargeJoinVClosure(chargeValue("potential"));
    const partialOrder = settling.partialOrderOver(settling.chargeValueCategory, settling.chargeSample);
    const closureLaw = settling.closureOver(settling.chargeValueCategory, closure, settling.chargeSample);
    const fixed = settling.settleFixedPoint(settling.chargeValueCategory, closure, chargeValue("absurd"));
    const least = settling.settleLeast(settling.chargeValueCategory, closure, chargeValue("absurd"), chargeValue("stable"));
    const regimeData = settling.closureRegimeData(true, true, true);
    const independence = settling.fourRegimeValueIndependent(
      settling.booleanValueCategory,
      settling.booleanJoinVClosure(true),
      settling.chargeValueCategory,
      closure,
      regimeData.data,
    );
    const recovery = settling.spineRecovery(chargeValue("active"));
    const optimization = settling.settlingOptimizationReceipt(settling.booleanValueCategory, settling.booleanJoinVClosure(true), false, true);
    const dequantization = settling.countingDequantizationReceipt();
    const magnitude = settling.magnitudeWitnessReceipt();

    assert.deepEqual(evaluateRunTerm(valueSettling.partialOrder, partialOrder), partialOrder);
    assert.deepEqual(evaluateRunTerm(valueSettling.closureLaw, closureLaw), closureLaw);
    assert.deepEqual(evaluateRunTerm(valueSettling.settleFixedPoint, fixed), fixed);
    assert.deepEqual(evaluateRunTerm(valueSettling.settleLeast, least), least);
    assert.deepEqual(evaluateRunTerm(valueSettling.fourRegimeValueIndependent, independence), independence);
    assert.deepEqual(evaluateRunTerm(valueSettling.spineRecovery, recovery), recovery);
    assert.deepEqual(evaluateRunTerm(valueSettling.optimization, optimization), optimization);
    assert.deepEqual(evaluateRunTerm(valueSettling.dequantization, dequantization), dequantization);
    assert.deepEqual(evaluateRunTerm(valueSettling.magnitudeWitness, magnitude), magnitude);
  });
});
