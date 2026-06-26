/**
 * Contract: the quantale-enriched sheaf surface exposes the finite FOUR/Charge
 * quantale, finite Q-category/Q-functor receipts, q-fuzzy equivalence grade
 * multiplication, degree-0 Laplacian fixed points, and RMN normalization.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  evaluateRunTerm,
  quantaleEnrichedSheaf,
} from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

describe("analysis.quantaleEnrichedSheaf: finite quantale-enriched receipts", () => {
  it("checks the concrete FOUR/Charge quantale laws", () => {
    const receipt = analysis.quantaleEnrichedSheaf.chargeQuantaleReceipt();

    assert.deepEqual(receipt.carrier, ["absurd", "potential", "active", "stable"]);
    assert.equal(receipt.one, "stable");
    assert.equal(receipt.multiplication, "knowledge-meet");
    assert.equal(receipt.mulDistributesOverSup, true);
    assert.equal(receipt.mulMonotone, true);
    assert.equal(analysis.quantaleEnrichedSheaf.sup(["potential", "active"]), "stable");
    assert.equal(analysis.quantaleEnrichedSheaf.mul("potential", "active"), "absurd");
  });

  it("models finite Q-categories and Q-functor composition", () => {
    const receipt = analysis.quantaleEnrichedSheaf.qcategoryReceipt();

    assert.equal(receipt.oneObjectReflexive, true);
    assert.equal(receipt.oneObjectComposition, true);
    assert.equal(receipt.discreteReflexive, true);
    assert.equal(receipt.discreteComposition, true);
    assert.equal(receipt.identityPreservesHoms, true);
    assert.equal(receipt.compositionPreservesHoms, true);
    assert.deepEqual(receipt.discrete.objects, ["a", "b"]);
    assert.equal(analysis.quantaleEnrichedSheaf.hom(receipt.discrete, "a", "a"), "stable");
    assert.equal(analysis.quantaleEnrichedSheaf.hom(receipt.discrete, "a", "b"), "absurd");
  });

  it("models q-fuzzy equivalence grade multiplication", () => {
    const receipt = analysis.quantaleEnrichedSheaf.qFuzzyEquivalenceReceipt("potential", "active");

    assert.equal(receipt.leftGrade, "potential");
    assert.equal(receipt.rightGrade, "active");
    assert.equal(receipt.compositeGrade, "absurd");
    assert.equal(receipt.strictGrade, "stable");
    assert.equal(receipt.compositionMultipliesGrade, true);
    assert.equal(receipt.strictGradeReducesToRoundTripUnit, true);
  });

  it("models degree-0 Q-enriched cohomology as Laplacian fixed points", () => {
    const receipt = analysis.quantaleEnrichedSheaf.h0LaplacianReceipt("potential");

    assert.deepEqual(receipt.fixedPoints, ["absurd", "potential"]);
    assert.equal(receipt.laplacianTable.stable, "potential");
    assert.equal(receipt.laplacianIdempotent, true);
    assert.equal(receipt.fixedPointsClosedUnderJoin, true);
  });

  it("normalizes the combined quantale-enriched sheaf receipt as RMN data", () => {
    const receipt = analysis.quantaleEnrichedSheaf.receipt();

    assert.equal(receipt.kind, "quantaleEnrichedSheaf.receipt:witness");
    assert.equal(receipt.openFrontier.length, 3);
    assert.deepEqual(evaluateRunTerm(quantaleEnrichedSheaf.receipt, receipt), receipt);
  });
});
