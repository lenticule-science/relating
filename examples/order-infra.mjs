import assert from "node:assert/strict";

import { evaluateRunTerm, orderInfra } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

const chain = analysis.orderInfra.finitePreorderSystem(
  ["bottom", "middle", "top"],
  [
    [true, true, true],
    [false, true, true],
    [false, false, true],
  ],
);

const preorder = analysis.orderInfra.preorder(chain);
const partialOrder = analysis.orderInfra.partialOrder(chain);
const monotone = analysis.orderInfra.monotoneMap(chain, chain, [0, 1, 2]);
const booleanLattice = analysis.orderInfra.lattice(analysis.orderInfra.booleanLatticeSystem);
const bounded = analysis.orderInfra.boundedLattice(analysis.orderInfra.booleanLatticeSystem, 1, 0);
const distributive = analysis.orderInfra.distributiveLattice(analysis.orderInfra.booleanLatticeSystem);
const complete = analysis.orderInfra.completeLattice(analysis.orderInfra.booleanOrderSystem);

assert.equal(preorder.kind, "orderInfra.preorder:witness");
assert.equal(partialOrder.kind, "orderInfra.partialOrder:witness");
assert.equal(monotone.kind, "orderInfra.monotoneMap:witness");
assert.equal(booleanLattice.kind, "orderInfra.lattice:witness");
assert.equal(bounded.kind, "orderInfra.boundedLattice:witness");
assert.equal(distributive.kind, "orderInfra.distributiveLattice:witness");
assert.equal(complete.kind, "orderInfra.completeLattice:witness");
assert.deepEqual(evaluateRunTerm(orderInfra.completeLattice, complete), complete);

console.log(JSON.stringify({
  product: "relating.order-infra",
  preorder,
  partialOrder,
  monotone,
  booleanLattice,
  bounded,
  distributive,
  complete,
}, null, 2));
