/**
 * Contract: finite OrderInfra receipts mirror RelMath.Order.OrderInfra and
 * normalize as RMN terms.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { evaluateRunTerm, orderInfra } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

describe("analysis.orderInfra: finite order hierarchy receipts", () => {
  it("checks preorder, partial order, monotone map, and finite completeness", () => {
    const chain = analysis.orderInfra.finitePreorderSystem(
      ["bottom", "middle", "top"],
      [
        [true, true, true],
        [false, true, true],
        [false, false, true],
      ],
    );

    const preorder = analysis.orderInfra.preorder(chain);
    const partial = analysis.orderInfra.partialOrder(chain);
    const monotone = analysis.orderInfra.monotoneMap(chain, chain, [0, 1, 2]);
    const notMonotone = analysis.orderInfra.monotoneMap(chain, chain, [2, 1, 0]);
    const complete = analysis.orderInfra.completeLattice(chain);

    assert.equal(preorder.kind, "orderInfra.preorder:witness");
    assert.equal(partial.kind, "orderInfra.partialOrder:witness");
    assert.equal(monotone.kind, "orderInfra.monotoneMap:witness");
    assert.equal(notMonotone.kind, "orderInfra.monotoneMap-obstruction");
    assert.equal(notMonotone.reason, "monotonicity");
    assert.equal(complete.kind, "orderInfra.completeLattice:witness");
    assert.equal(complete.subsetsChecked, 8);
    assert.equal(complete.topLabel, "top");
    assert.equal(complete.botLabel, "bottom");
  });

  it("reports antisymmetry and transitivity obstructions explicitly", () => {
    const nonThin = analysis.orderInfra.finitePreorderSystem(
      ["x", "y"],
      [
        [true, true],
        [true, true],
      ],
    );
    const nonTransitive = analysis.orderInfra.finitePreorderSystem(
      ["a", "b", "c"],
      [
        [true, true, false],
        [false, true, true],
        [false, false, true],
      ],
    );

    const antisymmetry = analysis.orderInfra.partialOrder(nonThin);
    const transitivity = analysis.orderInfra.preorder(nonTransitive);

    assert.equal(antisymmetry.kind, "orderInfra.partialOrder-obstruction");
    assert.equal(antisymmetry.reason, "antisymmetry");
    assert.deepEqual(antisymmetry.labels, ["x", "y"]);
    assert.equal(transitivity.kind, "orderInfra.preorder-obstruction");
    assert.equal(transitivity.reason, "transitivity");
    assert.deepEqual(transitivity.chainLabels, ["a", "b", "c"]);
  });

  it("checks algebraic lattice, bounded lattice, and distributivity laws", () => {
    const lattice = analysis.orderInfra.lattice(analysis.orderInfra.booleanLatticeSystem);
    const bounded = analysis.orderInfra.boundedLattice(analysis.orderInfra.booleanLatticeSystem, 1, 0);
    const distributive = analysis.orderInfra.distributiveLattice(analysis.orderInfra.booleanLatticeSystem);
    const complete = analysis.orderInfra.completeLattice(analysis.orderInfra.booleanOrderSystem);

    assert.equal(lattice.kind, "orderInfra.lattice:witness");
    assert.equal(lattice.meetGlb, true);
    assert.equal(lattice.joinLub, true);
    assert.equal(bounded.kind, "orderInfra.boundedLattice:witness");
    assert.equal(bounded.leTop, true);
    assert.equal(bounded.botLe, true);
    assert.equal(distributive.kind, "orderInfra.distributiveLattice:witness");
    assert.equal(complete.kind, "orderInfra.completeLattice:witness");
    assert.equal(complete.topLabel, "true");
    assert.equal(complete.botLabel, "false");
  });
});

describe("orderInfra RMN terms normalize finite receipts", () => {
  it("normalizes order, lattice, and complete-lattice receipts", () => {
    const preorder = analysis.orderInfra.preorder(analysis.orderInfra.booleanOrderSystem);
    const partial = analysis.orderInfra.partialOrder(analysis.orderInfra.booleanOrderSystem);
    const monotone = analysis.orderInfra.monotoneMap(
      analysis.orderInfra.booleanOrderSystem,
      analysis.orderInfra.booleanOrderSystem,
      [0, 1],
    );
    const lattice = analysis.orderInfra.lattice(analysis.orderInfra.booleanLatticeSystem);
    const bounded = analysis.orderInfra.boundedLattice(analysis.orderInfra.booleanLatticeSystem, 1, 0);
    const distributive = analysis.orderInfra.distributiveLattice(analysis.orderInfra.booleanLatticeSystem);
    const complete = analysis.orderInfra.completeLattice(analysis.orderInfra.booleanOrderSystem);

    assert.deepEqual(evaluateRunTerm(orderInfra.preorder, preorder), preorder);
    assert.deepEqual(evaluateRunTerm(orderInfra.partialOrder, partial), partial);
    assert.deepEqual(evaluateRunTerm(orderInfra.monotoneMap, monotone), monotone);
    assert.deepEqual(evaluateRunTerm(orderInfra.lattice, lattice), lattice);
    assert.deepEqual(evaluateRunTerm(orderInfra.boundedLattice, bounded), bounded);
    assert.deepEqual(evaluateRunTerm(orderInfra.distributiveLattice, distributive), distributive);
    assert.deepEqual(evaluateRunTerm(orderInfra.completeLattice, complete), complete);
  });
});
