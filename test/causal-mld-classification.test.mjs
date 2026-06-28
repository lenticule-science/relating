/**
 * Contract: finite causal H1/MLD classification mirrors
 * RelMath.Lorentzian.CausalMLDClassification and CausalMldCohomology.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { causalMldClassification, evaluateRunTerm } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

describe("analysis.causalMldClassification: SameClass groupoid", () => {
  it("checks reflexivity, symmetry, transitivity, and pullback invariance", () => {
    const chains = [["a"], ["a", "b"], ["a", "b", "d"]];
    const sourceChains = [["p"], ["p", "q"], ["p", "q", "r"]];
    const map = { p: "a", q: "b", r: "d" };
    const chi = (chain) => chain.length;
    const eta = (chain) => chain.join("").length + 1;
    const phi = (chain) => chain.reduce((sum, event) => sum + event.charCodeAt(0), 0);
    const psi = (chain) => phi(chain) - analysis.causalManifoldlikeness.delta(chi)(chain);
    const rho = (chain) => psi(chain) - analysis.causalManifoldlikeness.delta(eta)(chain);

    assert.equal(analysis.causalMldClassification.sameClassRefl(phi, chains), true);
    assert.equal(analysis.causalMldClassification.sameClassSymm(phi, psi, chi, chains), true);
    assert.equal(analysis.causalMldClassification.sameClassTrans(phi, psi, rho, chi, eta, chains), true);
    assert.equal(analysis.causalMldClassification.pullbackSameClass(map, phi, psi, chi, sourceChains), true);
    assert.equal(analysis.causalMldClassification.cohomologicalMldGroupoid(phi, psi, rho, chi, eta, chains), true);
  });
});

describe("analysis.causalMldClassification: flat cl-inv collapse", () => {
  it("collapses exactly to Bool polarization and packages the frontier boundary", () => {
    const path = {
      kind: "lorentzian.causalSet",
      events: ["a", "b", "c"],
      links: [{ from: "a", to: "b" }, { from: "b", to: "c" }],
    };
    const receipt = analysis.causalMldClassification.causalMldClassificationReceipt();

    assert.equal(analysis.causalMldClassification.flatClinvCollapse(path), true);
    assert.equal(analysis.causalPolarization.hasBoolPolarization(path), true);
    assert.equal(analysis.causalPolarization.hasBoolPolarization(analysis.causalPolarization.triangleCarrier), false);
    assert.equal(receipt.sameClassReflexive, true);
    assert.equal(receipt.sameClassSymmetric, true);
    assert.equal(receipt.sameClassTransitive, true);
    assert.equal(receipt.pullbackSameClass, true);
    assert.equal(receipt.flatClinvCollapse, true);
    assert.equal(receipt.oddCycleObstruction, true);
    assert.equal(receipt.completenessBoundary, "equal H1 forcing carrier-level MLD remains frontier");
    assert.deepEqual(evaluateRunTerm(causalMldClassification.receipt, receipt), receipt);
  });
});
