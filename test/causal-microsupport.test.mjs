/**
 * Contract: finite causal/charged/cotangent microsupport mirrors
 * RelMath.Lorentzian.CausalMicrosupport, ChargedMicrosupport, and
 * CotangentMicrosupport.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { causalMicrosupport, evaluateRunTerm } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

describe("analysis.causalMicrosupport: cone-confined support", () => {
  it("propagates support by causal future closure and excludes spacelike events", () => {
    const carrier = analysis.causal.diamondCausalSet;

    assert.deepEqual(analysis.causalMicrosupport.closedFuture(carrier, "a"), ["a", "b", "c", "d"]);
    assert.deepEqual(analysis.causalMicrosupport.closedFuture(carrier, "b"), ["b", "d"]);
    assert.deepEqual(analysis.causalMicrosupport.microsupport(carrier, ["b"]), ["b", "d"]);
    assert.equal(analysis.causalMicrosupport.microsupportUpwardClosed(carrier, ["b"]), true);
    assert.equal(analysis.causalMicrosupport.microsupportIdempotent(carrier, ["b"]), true);
    assert.equal(analysis.causalMicrosupport.spacelike(carrier, "b", "c"), true);
    assert.equal(analysis.causalMicrosupport.microsupportExcludesSpacelike(carrier, "b", "c"), true);
  });
});

describe("analysis.causalMicrosupport: charged cone emission", () => {
  it("emits bottom outside the cone and holds contradiction at common futures", () => {
    const carrier = analysis.causal.diamondCausalSet;

    assert.equal(analysis.causalMicrosupport.emit(carrier, "b", "potential", "c"), "absurd");
    assert.equal(analysis.causalMicrosupport.emit(carrier, "b", "potential", "d"), "potential");
    assert.equal(analysis.causalMicrosupport.emit2(carrier, "b", "potential", "c", "active", "d"), "stable");
    assert.equal(analysis.causalMicrosupport.emit2(carrier, "b", "potential", "c", "potential", "d"), "potential");
    assert.equal(analysis.causalMicrosupport.emit2Inflationary(carrier, "b", "potential", "c", "active", "d"), true);
  });
});

describe("analysis.causalMicrosupport: cotangent wavefront projection", () => {
  it("projects nonzero codirections to base singular support", () => {
    const carrier = analysis.causal.diamondCausalSet;
    const cochain = { "a->b": 1, "b->d": 2 };
    const receipt = analysis.causalMicrosupport.causalMicrosupportReceipt();

    assert.deepEqual(analysis.causalMicrosupport.wavefront(carrier, cochain), [
      { from: "a", to: "b" },
      { from: "b", to: "d" },
    ]);
    assert.deepEqual(analysis.causalMicrosupport.singularSupport(carrier, cochain), ["a", "b"]);
    assert.equal(analysis.causalMicrosupport.emptyWavefrontCoboundary(carrier, {}), true);
    assert.equal(analysis.causalMicrosupport.clinvNonzeroSingular(carrier, cochain, { from: "a", to: "b" }), true);
    assert.equal(receipt.chargedCollision, "stable");
    assert.equal(receipt.bridgeBoundary, "smooth cotangent symplectic flow remains frontier");
    assert.deepEqual(evaluateRunTerm(causalMicrosupport.receipt, receipt), receipt);
  });
});
