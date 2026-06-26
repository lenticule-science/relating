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

    assert.deepEqual(evaluateRunTerm(valueSettling.partialOrder, partialOrder), partialOrder);
    assert.deepEqual(evaluateRunTerm(valueSettling.closureLaw, closureLaw), closureLaw);
    assert.deepEqual(evaluateRunTerm(valueSettling.settleFixedPoint, fixed), fixed);
    assert.deepEqual(evaluateRunTerm(valueSettling.settleLeast, least), least);
    assert.deepEqual(evaluateRunTerm(valueSettling.fourRegimeValueIndependent, independence), independence);
    assert.deepEqual(evaluateRunTerm(valueSettling.spineRecovery, recovery), recovery);
    assert.deepEqual(evaluateRunTerm(valueSettling.optimization, optimization), optimization);
  });
});
