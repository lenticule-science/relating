/**
 * Contract: RelMath.Positing.ValuationFiberAlgebra and its quartet discharge
 * are exposed as finite valuation-fiber receipts over FOUR.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  chargeValue,
  chargeValueName,
  cornerToModal,
  crossOrderNotKnowledgeNucleus,
  deltaNucleus,
  evaluateRunTerm,
  modalToCorner,
  piNucleus,
  quartetRecurrenceReceipt,
  sigmaNucleus,
  truthImplicationValue,
  valuationFiberAlgebra,
  valuationFiberAlgebraReceipt,
  valuationFiberCarrier,
  valuationLeqKnowledge,
  valuationLeqTruth,
  valuationTruthImplication,
  valuationTruthMeet,
} from "@emsenn/relating";

const fiber = valuationFiberCarrier(["left", "right"], {
  left: "active",
  right: "stable",
});

describe("valuation fiber algebra: truth Heyting structure and nuclei", () => {
  it("computes the truth-order implication pointwise", () => {
    assert.equal(chargeValueName(truthImplicationValue(chargeValue("potential"), chargeValue("active"))), "active");
    assert.equal(chargeValueName(truthImplicationValue(chargeValue("active"), chargeValue("potential"))), "potential");
    assert.deepEqual(valuationTruthImplication(fiber, fiber).values, {
      left: "potential",
      right: "potential",
    });
  });

  it("lifts truth meet/order and the two nuclei over finite valuations", () => {
    const sigma = sigmaNucleus(fiber);
    const delta = deltaNucleus(fiber);
    const pi = piNucleus(fiber);

    assert.deepEqual(valuationTruthMeet(fiber, sigma).values, fiber.values);
    assert.equal(valuationLeqTruth(fiber, sigma), true);
    assert.deepEqual(sigma.values, { left: "potential", right: "potential" });
    assert.deepEqual(delta.values, { left: "stable", right: "stable" });
    assert.deepEqual(pi.values, { left: "potential", right: "potential" });
    assert.deepEqual(sigmaNucleus(delta).values, deltaNucleus(sigma).values);
  });

  it("carries the cross-order finding as an obstruction witness", () => {
    const finding = crossOrderNotKnowledgeNucleus(["cell"]);

    assert.equal(finding.kind, "positing.valuationFiber.crossOrderNotKnowledgeNucleus:witness");
    assert.equal(finding.before, "stable");
    assert.equal(finding.after, "potential");
    assert.equal(finding.knowledgeInflationary, false);
    assert.equal(valuationLeqKnowledge(finding.valuation, finding.closure), false);
  });

  it("packages the discharged finite quartet receipt", () => {
    const receipt = valuationFiberAlgebraReceipt(fiber);

    assert.equal(receipt.kind, "positing.valuationFiberAlgebra.receipt:witness");
    assert.equal(receipt.truthOrderPartial, true);
    assert.equal(receipt.heytingAdjunction, true);
    assert.equal(receipt.sigmaDeltaCommute, true);
    assert.equal(receipt.piIdempotent, true);
    assert.equal(receipt.fixPiIffFixSigmaAndDelta, true);
    assert.equal(receipt.abstractQuartetDischarged, true);
  });
});

describe("quartet recurrence: one four-corner coherence cell at two depths", () => {
  it("round-trips modal/corner readings and checks both commuting squares", () => {
    const receipt = quartetRecurrenceReceipt(fiber);

    assert.equal(modalToCorner("dia"), "active");
    assert.equal(cornerToModal("stable"), "box");
    assert.equal(receipt.modalRoundTrip, true);
    assert.equal(receipt.cornerRoundTrip, true);
    assert.equal(receipt.twistoringSquare, true);
    assert.equal(receipt.commutatingSquare, true);
    assert.equal(receipt.cardFour, 4);
  });

  it("normalizes valuation-fiber receipts as RMN data", () => {
    const algebra = valuationFiberAlgebraReceipt(fiber);
    const recurrence = quartetRecurrenceReceipt(fiber);

    assert.deepEqual(evaluateRunTerm(valuationFiberAlgebra.receipt, algebra), algebra);
    assert.deepEqual(evaluateRunTerm(valuationFiberAlgebra.quartetRecurrence, recurrence), recurrence);
  });
});
