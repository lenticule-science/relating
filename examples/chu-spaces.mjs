import assert from "node:assert/strict";
import { isDeepStrictEqual } from "node:util";

import {
  evaluateRunTerm,
  isClosed,
  termSize,
  termUses,
} from "@emsenn/relating";
import {
  chuDualInvolutionTerm,
  chuDualTerm,
  chuLookupTerm,
} from "@emsenn/relating/evaluating/pairing";

const space = {
  pts: ["a", "b"],
  sts: ["x", "y"],
  r: [
    { pt: "a", st: "x", charge: "active" },
    { pt: "a", st: "y", charge: "potential" },
    { pt: "b", st: "x", charge: "stable" },
    { pt: "b", st: "y", charge: "absurd" },
  ],
};

const dual = evaluateRunTerm(chuDualTerm, space);
const doubleDual = evaluateRunTerm(chuDualTerm, dual);
const activeLookup = evaluateRunTerm(chuLookupTerm, { space, pt: "a", st: "x" });
const missingLookup = evaluateRunTerm(chuLookupTerm, { space, pt: "z", st: "x" });
const dualLookup = evaluateRunTerm(chuLookupTerm, { space: dual, pt: "x", st: "a" });
const dualInvolution = evaluateRunTerm(chuDualInvolutionTerm, space);

assert.deepEqual(dual.pts, ["x", "y"]);
assert.deepEqual(dual.sts, ["a", "b"]);
assert.equal(dualLookup, "potential");
assert.deepEqual(doubleDual, space);
assert.equal(activeLookup, "active");
assert.equal(missingLookup, "absurd");
assert.equal(dualInvolution, true);
assert.equal(isClosed(chuDualTerm), true);
assert.equal(isClosed(chuLookupTerm), true);
assert.equal(isClosed(chuDualInvolutionTerm), true);

console.log(JSON.stringify({
  product: "relating.chu-spaces",
  space: {
    points: space.pts.length,
    states: space.sts.length,
    entries: space.r.length,
  },
  dual: {
    points: dual.pts,
    states: dual.sts,
    entryAtXACharge: dualLookup,
  },
  lookup: {
    activeEntry: activeLookup,
    missingEntry: missingLookup,
  },
  involution: {
    doubleDualEqualsOriginal: isDeepStrictEqual(doubleDual, space),
    witnessTerm: dualInvolution,
  },
  terms: {
    dual: {
      closed: isClosed(chuDualTerm),
      nodes: termSize(chuDualTerm),
      uses: termUses(chuDualTerm),
    },
    lookup: {
      closed: isClosed(chuLookupTerm),
      nodes: termSize(chuLookupTerm),
      uses: termUses(chuLookupTerm),
    },
  },
}, null, 2));
