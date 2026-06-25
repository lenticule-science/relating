import assert from "node:assert/strict";

import {
  evaluateRunTerm,
  isClosed,
  termSize,
  termUses,
} from "../dist/index.mjs";
import {
  closeExtentTerm,
  extentOfIntentTerm,
  formalConceptTerm,
  intentOfExtentTerm,
  isConceptPairTerm,
} from "@emsenn/relating/expressing/evaluating/connecting";

const cells = [
  { subject: "alpha", predicate: "warm", object: "alpha" },
  { subject: "alpha", predicate: "bright", object: "alpha" },
  { subject: "beta", predicate: "warm", object: "beta" },
];

const intent = evaluateRunTerm(intentOfExtentTerm, {
  cells,
  extent: ["alpha", "beta"],
});
const extent = evaluateRunTerm(extentOfIntentTerm, {
  cells,
  intent: ["warm"],
});
const closedAlpha = evaluateRunTerm(closeExtentTerm, {
  cells,
  extent: ["alpha"],
});
const closedAlphaAgain = evaluateRunTerm(closeExtentTerm, {
  cells,
  extent: closedAlpha,
});
const concept = evaluateRunTerm(formalConceptTerm, {
  cells,
  extent: ["alpha", "beta"],
});
const conceptHolds = evaluateRunTerm(isConceptPairTerm, {
  cells,
  extent: concept.extent,
  intent: concept.intent,
});

assert.deepEqual(intent, ["warm"]);
assert.deepEqual(extent, ["alpha", "beta"]);
assert.deepEqual(closedAlpha, ["alpha"]);
assert.deepEqual(closedAlphaAgain, closedAlpha);
assert.deepEqual(concept, {
  extent: ["alpha", "beta"],
  intent: ["warm"],
  kind: "predication.fca.concept",
});
assert.equal(conceptHolds, true);
assert.equal(isClosed(formalConceptTerm), true);

console.log("Formal Concept Analysis");
console.log("intent(alpha,beta):", intent.join(", "));
console.log("extent(warm):", extent.join(", "));
console.log("close(alpha):", closedAlpha.join(", "));
console.log("close(close(alpha)):", closedAlphaAgain.join(", "));
console.log("concept:", JSON.stringify(concept));
console.log("concept valid:", conceptHolds);
console.log("formalConcept term:", {
  closed: isClosed(formalConceptTerm),
  nodes: termSize(formalConceptTerm),
  uses: termUses(formalConceptTerm).join(", "),
});
