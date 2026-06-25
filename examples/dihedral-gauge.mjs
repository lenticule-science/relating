import assert from "node:assert/strict";

import {
  chargeValue,
  chargeValueNames,
  dihedral,
  dihedralConjugation,
  dihedralElementNames,
  dihedralFixedSet,
  dihedralMul,
  dihedralOrderEffect,
  dihedralSwapsOrders,
  orderSwapIso,
} from "@emsenn/relating";

const name = (value) => value.name;
const value = (name) => chargeValue(name);
const permutationOf = (element) => chargeValueNames.map((chargeName) => name(dihedral(element, value(chargeName))));

const orderPreserving = ["id", "negation", "conflation", "double"];
const orderSwapping = ["order-swap", "order-swap-negation", "order-swap-conflation", "order-swap-double"];

const permutations = Object.fromEntries(
  dihedralElementNames.map((element) => [element, permutationOf(element)]),
);

assert.equal(dihedralElementNames.length, 8);
assert.deepEqual(orderPreserving.map(dihedralOrderEffect), [
  "order-preserving",
  "order-preserving",
  "order-preserving",
  "order-preserving",
]);
assert.deepEqual(orderSwapping.map(dihedralOrderEffect), [
  "order-swapping",
  "order-swapping",
  "order-swapping",
  "order-swapping",
]);

const leftThenRight = dihedralMul("order-swap", "negation");
const rightThenLeft = dihedralMul("negation", "order-swap");
assert.equal(leftThenRight, "order-swap-conflation");
assert.equal(rightThenLeft, "order-swap-negation");
assert.notEqual(leftThenRight, rightThenLeft);

for (const element of orderPreserving) {
  assert.equal(dihedralSwapsOrders(element).kind, "dihedral-gauge.swapsOrders-obstruction");
}
for (const element of orderSwapping) {
  assert.equal(dihedralSwapsOrders(element).kind, "dihedral-gauge.swapsOrders:witness");
}
for (const chargeName of chargeValueNames) {
  assert.equal(dihedralConjugation(value(chargeName)).kind, "dihedral-gauge.conjugation:witness");
}

const crossOrder = orderSwapIso(value("absurd"), value("potential"));
assert.equal(crossOrder.kind, "dihedral-gauge.orderSwapIso:witness");

console.log(JSON.stringify({
  product: "relating.dihedral-gauge",
  elements: dihedralElementNames,
  permutations,
  cosets: {
    orderPreserving,
    orderSwapping,
  },
  noncommutingPair: {
    "order-swap after negation": leftThenRight,
    "negation after order-swap": rightThenLeft,
  },
  crossOrder: {
    sample: "absurd <=knowledge potential iff orderSwap(absurd) <=truth orderSwap(potential)",
    kind: crossOrder.kind,
    swapped: [name(crossOrder.swappedLeft), name(crossOrder.swappedRight)],
    knowledgeLeq: crossOrder.knowledgeLeq,
  },
  conjugation: {
    relation: "order-swap · negation · order-swap = conflation",
    allValuesWitness: true,
  },
  fixed: {
    "order-swap": dihedralFixedSet("order-swap").map(name),
  },
}, null, 2));
