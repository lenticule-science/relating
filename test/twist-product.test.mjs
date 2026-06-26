/**
 * Contract: finite twist-product receipts mirror
 * RelMath.Order.TwistProductResiduation and normalize as RMN terms.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  chargeValue,
  evaluateRunTerm,
  twistProduct,
} from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

describe("analysis.twistProduct: FOUR as the Boolean twist product", () => {
  it("exhausts the finite Two-twist carrier against the existing charge algebra", () => {
    const receipt = analysis.twistProduct.fourTwistProduct();

    assert.equal(receipt.kind, "twistProduct.four:witness");
    assert.deepEqual(receipt.elements.map((row) => row.charge), ["absurd", "potential", "active", "stable"]);
    assert.equal(receipt.knowledgeBottom, "absurd");
    assert.equal(receipt.knowledgeTop, "stable");
    assert.equal(receipt.truthBottom, "active");
    assert.equal(receipt.truthTop, "potential");
    assert.equal(receipt.fusionUnit, "stable");
    assert.deepEqual(receipt.consistentFragment, ["absurd", "potential", "active"]);
    assert.equal(receipt.bijection, true);
    assert.equal(receipt.knowledgeOrderMatches, true);
    assert.equal(receipt.truthOrderMatches, true);
    assert.equal(receipt.negationMatches, true);
    assert.equal(receipt.knowledgeLatticeMatches, true);
    assert.equal(receipt.truthLatticeMatches, true);
    assert.equal(receipt.truthResiduation, true);
    assert.equal(receipt.fusionCommutative, true);
    assert.equal(receipt.fusionUnitLaw, true);
    assert.equal(receipt.unitNonIntegral, true);
  });

  it("round-trips charge values through Boolean twist coordinates", () => {
    for (const name of ["absurd", "potential", "active", "stable"]) {
      const value = chargeValue(name);
      const point = analysis.twistProduct.booleanPointOfCharge(value);

      assert.equal(analysis.twistProduct.chargeOfBooleanPoint(point).name, name);
      assert.equal(point.label.length, 2);
    }
  });
});

describe("twistProduct RMN terms normalize finite receipts", () => {
  it("normalizes the finite FOUR twist-product receipt", () => {
    const receipt = analysis.twistProduct.fourTwistProduct();

    assert.deepEqual(evaluateRunTerm(twistProduct.four, receipt), receipt);
  });
});
