/**
 * Contract: finite causal polarization and Liouville receipts mirror
 * RelMath.Lorentzian.CausalPolarization and CausalLiouville.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { causalPolarization, evaluateRunTerm } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

describe("analysis.causalPolarization: polarization as proper colouring", () => {
  it("computes the polarization 1-form and nondegeneracy", () => {
    const carrier = analysis.causalPolarization.diamondCarrier;
    const colors = { a: 0, b: 1, c: 1, d: 2 };
    const form = analysis.causalPolarization.polarizationForm(carrier, colors);

    assert.deepEqual(form, [
      { from: "a", to: "b", value: 1 },
      { from: "a", to: "c", value: 1 },
      { from: "a", to: "d", value: 2 },
      { from: "b", to: "d", value: 1 },
      { from: "c", to: "d", value: 1 },
    ]);
    assert.equal(analysis.causalPolarization.nondegenerate(carrier, colors), true);
    assert.equal(analysis.causalPolarization.properColoring(carrier, colors), true);
    assert.equal(analysis.causalPolarization.nondegenerate(carrier, { a: 0, b: 0, c: 1, d: 2 }), false);
  });

  it("pulls nondegenerate polarization back along graph homomorphisms", () => {
    const source = {
      kind: "lorentzian.causalSet",
      events: ["p", "q", "r"],
      links: [{ from: "p", to: "q" }, { from: "q", to: "r" }],
    };
    const target = analysis.causalPolarization.diamondCarrier;
    const map = { p: "a", q: "b", r: "d" };
    const colors = { a: 0, b: 1, c: 1, d: 2 };
    const pulled = analysis.causalPolarization.pullbackColors(map, colors);

    assert.equal(analysis.causalPolarization.graphHom(source, target, map), true);
    assert.deepEqual(pulled, { p: 0, q: 1, r: 2 });
    assert.equal(analysis.causalPolarization.nondegenerate(source, pulled), true);
  });

  it("detects Bool-polarization exactly as bipartiteness on finite direct graphs", () => {
    const path = {
      kind: "lorentzian.causalSet",
      events: ["a", "b", "c"],
      links: [{ from: "a", to: "b" }, { from: "b", to: "c" }],
    };
    const diamond = analysis.causalPolarization.diamondCarrier;
    const triangle = analysis.causalPolarization.triangleCarrier;

    assert.deepEqual(analysis.causalPolarization.bipartiteColoring(path), { a: 0, b: 1, c: 0 });
    assert.equal(analysis.causalPolarization.hasBoolPolarization(path), true);
    assert.equal(analysis.causalPolarization.hasBoolPolarization(diamond), false);
    assert.equal(analysis.causalPolarization.bipartiteColoring(triangle), undefined);
    assert.equal(analysis.causalPolarization.hasBoolPolarization(triangle), false);
  });

  it("packages the causal-polarization receipt", () => {
    const receipt = analysis.causalPolarization.polarizationReceipt();

    assert.equal(receipt.nondegenerate, true);
    assert.equal(receipt.properColoring, true);
    assert.equal(receipt.nondegenerateIffProper, true);
    assert.equal(receipt.mldPreservesPolarization, true);
    assert.equal(receipt.boolPolarizationIffBipartite, true);
    assert.equal(receipt.chromaticObstruction, "odd causal cycle obstructs Bool polarization");
  });
});

describe("analysis.causalPolarization: exact Liouville form", () => {
  it("computes d(dc)=0 on causal triangles", () => {
    const carrier = analysis.causalPolarization.diamondCarrier;
    const colors = { a: 0, b: 1, c: 1, d: 2 };

    assert.deepEqual(analysis.causalPolarization.causalTriangles(carrier), [
      { a: "a", b: "b", c: "d" },
      { a: "a", b: "c", c: "d" },
    ]);
    assert.deepEqual(analysis.causalPolarization.omegaLiouville(carrier, colors), [0, 0]);
  });

  it("packages Liouville exactness and normalizes both receipts as RMN data", () => {
    const polarization = analysis.causalPolarization.polarizationReceipt();
    const liouville = analysis.causalPolarization.liouvilleReceipt();

    assert.equal(liouville.liouvilleCodirEqualsPolForm, true);
    assert.equal(liouville.omegaExact, true);
    assert.equal(liouville.omegaClosed, true);
    assert.equal(liouville.omegaLiouvilleZero, true);
    assert.equal(liouville.liouvilleNondegenerateIffProper, true);
    assert.equal(liouville.mldPreservesLiouville, true);
    assert.deepEqual(evaluateRunTerm(causalPolarization.polarization, polarization), polarization);
    assert.deepEqual(evaluateRunTerm(causalPolarization.liouville, liouville), liouville);
  });
});
