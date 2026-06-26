import assert from "node:assert/strict";

import { evaluateRunTerm, sofic } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

const word = [0, 1, 0];
const path = analysis.sofic.path(analysis.sofic.goldenMeanGraph, word);
const forbidden = analysis.sofic.goldenForbidsBB();
const fib = analysis.sofic.fibSubstituteGolden(word);
const deep = analysis.sofic.fibDeepSofic(word);

assert.equal(path.kind, "sofic.path:witness");
assert.equal(forbidden.kind, "sofic.goldenMean.forbidsBB:witness");
assert.equal(fib.kind, "sofic.fibonacciSubstitution.golden:witness");
assert.equal(deep.kind, "sofic.fibonacciSubstitution.deep:witness");
assert.deepEqual(evaluateRunTerm(sofic.path, path), path);
assert.deepEqual(evaluateRunTerm(sofic.fibDeepSofic, deep), deep);

console.log(JSON.stringify({
  product: "relating.sofic-shift",
  goldenMean: {
    word,
    path: evaluateRunTerm(sofic.path, path).kind,
    forbidden: {
      kind: evaluateRunTerm(sofic.goldenForbidsBB, forbidden).kind,
      word: forbidden.word,
      edge: forbidden.path.edge,
    },
  },
  fibonacci: {
    substituted: fib.substituted,
    landsInGolden: evaluateRunTerm(sofic.fibSubstituteGolden, fib).kind,
  },
  decoratedCover: {
    decorated: deep.decorated,
    image: deep.sofic.image,
    forgetsToSubstitution: deep.forgetsToSubstitution,
    receipt: evaluateRunTerm(sofic.fibDeepSofic, deep).kind,
  },
}, null, 2));
