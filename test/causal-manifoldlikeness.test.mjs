/**
 * Contract: finite causal manifoldlikeness mirrors
 * RelMath.Lorentzian.CausalManifoldlikeness without claiming the frontier
 * causal-set Hauptvermutung.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { causalManifoldlikeness, evaluateRunTerm } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

describe("analysis.causalManifoldlikeness: cochain pullback functoriality", () => {
  it("commutes pullback with the finite coboundary", () => {
    const map = { p: "a", q: "b", r: "d" };
    const cochain = (chain) => chain.join("").length + chain.length;
    const chains = [["p"], ["p", "q"], ["p", "q", "r"]];

    assert.equal(analysis.causalManifoldlikeness.pullback(map, cochain)(["p", "r"]), cochain(["a", "d"]));
    assert.equal(analysis.causalManifoldlikeness.pullbackDeltaCommutes(map, cochain, chains), true);
    assert.equal(analysis.causalManifoldlikeness.pullbackPreservesCocycle(map, () => 0, chains), true);
    assert.equal(analysis.causalManifoldlikeness.pullbackPreservesCoboundary(map, cochain, chains), true);
  });
});

describe("analysis.causalManifoldlikeness: diamond Euler/Mobius signature", () => {
  it("computes the RelMath diamond chain census and Philip Hall sum", () => {
    const carrier = analysis.causal.diamondCausalSet;
    const receipt = analysis.causalManifoldlikeness.diamondIntervalEulerReceipt();

    assert.equal(analysis.causalManifoldlikeness.chainCount(carrier, 1, "a", "d"), 1);
    assert.equal(analysis.causalManifoldlikeness.chainCount(carrier, 2, "a", "d"), 2);
    assert.equal(analysis.causalManifoldlikeness.chainCount(carrier, 3, "a", "d"), 0);
    assert.equal(analysis.causalManifoldlikeness.hallSum(carrier, "a", "d", 3), 1);
    assert.equal(receipt.mobius, 1);
    assert.deepEqual(receipt.chainCounts, [1, 2, 0]);
    assert.equal(receipt.linkSignature, "S0");
    assert.equal(receipt.certifiedDimension, 2);
  });

  it("packages the finite manifoldlikeness receipt and normalizes it as RMN data", () => {
    const receipt = analysis.causalManifoldlikeness.causalManifoldlikenessReceipt();

    assert.equal(receipt.pullbackDelta, true);
    assert.equal(receipt.pullbackCocycle, true);
    assert.equal(receipt.pullbackCoboundary, true);
    assert.equal(receipt.topologyMldInvariant, true);
    assert.equal(receipt.diamondCertified2DManifoldlike, true);
    assert.equal(receipt.hauptvermutungBoundary, "continuum-limit Betti matching remains frontier");
    assert.deepEqual(evaluateRunTerm(causalManifoldlikeness.receipt, receipt), receipt);
  });
});
