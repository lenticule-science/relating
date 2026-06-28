/**
 * Contract: finite causal involutivity mirrors
 * RelMath.Lorentzian.CausalInvolutivity's propagation content.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { causalInvolutivity, evaluateRunTerm } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

describe("analysis.causalInvolutivity: bicharacteristic propagation", () => {
  it("reads causal triangles as composable bicharacteristics", () => {
    const carrier = analysis.causalPolarization.diamondCarrier;
    const triangles = analysis.causalInvolutivity.bicharacteristicTriangles(carrier);

    assert.deepEqual(triangles, [
      {
        edge01: { from: "a", to: "b" },
        edge12: { from: "b", to: "d" },
        edge02: { from: "a", to: "d" },
      },
      {
        edge01: { from: "a", to: "c" },
        edge12: { from: "c", to: "d" },
        edge02: { from: "a", to: "d" },
      },
    ]);
    assert.equal(analysis.causalInvolutivity.bicharacteristicComposable(triangles[0].edge01, triangles[0].edge12), true);
  });

  it("checks cocycle additivity and wavefront decomposition", () => {
    const carrier = analysis.causalPolarization.diamondCarrier;
    const cochain = analysis.causalInvolutivity.colorCoboundary({ a: 0, b: 1, c: 1, d: 2 });
    const receipt = analysis.causalInvolutivity.causalInvolutivityReceipt();

    assert.equal(cochain({ from: "a", to: "d" }), 2);
    assert.equal(analysis.causalInvolutivity.cocycleAdditive(carrier, cochain), true);
    assert.equal(analysis.causalInvolutivity.wavefrontInvolutive(carrier, cochain), true);
    assert.equal(receipt.edgesComposable, true);
    assert.equal(receipt.cocycleAdditive, true);
    assert.equal(receipt.wavefrontInvolutive, true);
    assert.equal(receipt.bicharacteristicCausal, true);
    assert.equal(receipt.bridgeBoundary, "symplectic Hamiltonian flow remains frontier");
    assert.deepEqual(evaluateRunTerm(causalInvolutivity.receipt, receipt), receipt);
  });
});
