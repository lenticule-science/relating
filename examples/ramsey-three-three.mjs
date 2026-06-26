import assert from "node:assert/strict";

import { evaluateRunTerm, graphColoring } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

const coloring = Object.freeze(Array.from({ length: 6 }, () =>
  Object.freeze(Array.from({ length: 6 }, () => true))));
const receipt = analysis.ramseyThreeThree(coloring);

assert.equal(receipt.kind, "meme-analysis.ramsey.r33:witness");
assert.deepEqual(evaluateRunTerm(graphColoring.ramseyThreeThree, receipt), receipt);

console.log(JSON.stringify({
  product: "relating.ramsey-three-three",
  receipt,
}, null, 2));
