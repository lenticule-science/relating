/**
 * Contract: finite algebra-hierarchy receipts mirror the concrete examples in
 * RelMath.Order.AlgebraHierarchy and normalize as RMN terms.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  algebraHierarchy,
  evaluateRunTerm,
} from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

describe("analysis.algebraHierarchy: finite algebra tower witnesses", () => {
  it("checks the Boolean field, K4 group, and order-derived monoids", () => {
    const receipt = analysis.algebraHierarchy.algebraHierarchy();

    assert.equal(receipt.kind, "algebraHierarchy.receipt:witness");
    assert.equal(receipt.boolField.zeroLabel, "false");
    assert.equal(receipt.boolField.oneLabel, "true");
    assert.equal(receipt.boolField.zeroNeOne, true);
    assert.equal(receipt.boolField.zeroUnique, true);

    assert.deepEqual(receipt.kleinFourGroup.carrier, ["id", "negation", "conflation", "double"]);
    assert.deepEqual(receipt.kleinFourGroup.inverses, [0, 1, 2, 3]);
    assert.equal(receipt.kleinFourGroup.rightInverse, true);
    assert.equal(receipt.kleinFourGroup.leftCancel, true);

    assert.equal(receipt.meetMonoid.oneLabel, "true");
    assert.equal(receipt.joinMonoid.oneLabel, "false");
    assert.equal(receipt.fuseMonoid.oneLabel, "true");
    assert.equal(receipt.orderToAlgebraCollapse, true);
  });

  it("reports law obstructions for invalid finite field data", () => {
    const bad = analysis.algebraHierarchy.finiteFieldSystem(
      ["false", "true"],
      [
        [0, 1],
        [1, 0],
      ],
      [
        [0, 0],
        [0, 1],
      ],
      0,
      0,
      [0, 1],
      [0, 1],
    );

    const receipt = analysis.algebraHierarchy.field(bad);

    assert.equal(receipt.kind, "algebraHierarchy.obstruction");
    assert.equal(receipt.law, "zeroNeOne");
  });
});

describe("algebraHierarchy RMN terms normalize finite receipts", () => {
  it("normalizes the finite algebra-hierarchy receipt", () => {
    const receipt = analysis.algebraHierarchy.algebraHierarchy();

    assert.deepEqual(evaluateRunTerm(algebraHierarchy.receipt, receipt), receipt);
  });
});
