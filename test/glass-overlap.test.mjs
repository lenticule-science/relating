/**
 * Contract: finite configuration overlap mirrors `RelMath.Glass.Overlap`.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { evaluateRunTerm, glassOverlap } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

describe("analysis.glassOverlap: finite configuration overlap", () => {
  it("counts agreement sites and checks self, symmetry, and length bounds", () => {
    const sites = ["a", "b", "c", "d"];
    const left = { a: "t", b: "f", c: "top", d: "bot" };
    const right = { a: "t", b: "top", c: "top", d: "f" };
    const count = analysis.glassOverlap.overlapCount(sites, left, right);
    const receipt = analysis.glassOverlap.receipt();

    assert.equal(count.kind, "glass.overlap.count:witness");
    assert.equal(count.count, 2);
    assert.equal(count.length, 4);
    assert.equal(receipt.sourceModule, "RelMath.Glass.Overlap");
    assert.equal(receipt.nil.count, 0);
    assert.equal(receipt.self.count, receipt.self.length);
    assert.equal(receipt.sample.count, receipt.symmetric.count);
    assert.equal(receipt.selfOverlapsEverywhere, true);
    assert.equal(receipt.overlapSymmetric, true);
    assert.equal(receipt.overlapLeLength, true);
  });

  it("normalizes the overlap receipt as RMN data", () => {
    const receipt = analysis.glassOverlap.receipt();

    assert.deepEqual(evaluateRunTerm(glassOverlap.receipt, receipt), receipt);
  });

  it("checks basin descent chains cannot cycle", () => {
    const receipt = analysis.glassOverlap.basinGraphReceipt();

    assert.equal(receipt.sourceModule, "RelMath.Glass.BasinGraph");
    assert.equal(receipt.chain.energyDecreases, true);
    assert.deepEqual(receipt.chain.chain, ["high", "mid", "low"]);
    assert.equal(receipt.chain.startEnergy, 4);
    assert.equal(receipt.chain.endEnergy, 0);
    assert.equal(receipt.noDescendingCycle, true);
    assert.equal(receipt.descendAsymmetric, true);
    assert.equal(analysis.glassOverlap.descends(receipt.graph, "high", "mid"), true);
    assert.equal(analysis.glassOverlap.descends(receipt.graph, "mid", "high"), false);
    assert.deepEqual(evaluateRunTerm(glassOverlap.basinGraph, receipt), receipt);
  });

  it("models dynamic heterogeneity as mobility complementing overlap", () => {
    const receipt = analysis.glassOverlap.dynamicHeterogeneityReceipt();

    assert.equal(receipt.sourceModule, "RelMath.Glass.DynamicHeterogeneity");
    assert.equal(receipt.mobilityCount, 2);
    assert.equal(receipt.overlapCount, 2);
    assert.equal(receipt.mobilityPlusOverlap, receipt.sites.length);
    assert.equal(receipt.mobilitySelf, 0);
    assert.equal(receipt.zeroMobilityIffAgree, true);
    assert.equal(analysis.glassOverlap.changedOn(receipt.left, receipt.right, "beta"), true);
    assert.equal(analysis.glassOverlap.changedOn(receipt.left, receipt.right, "alpha"), false);
    assert.deepEqual(evaluateRunTerm(glassOverlap.dynamicHeterogeneity, receipt), receipt);
  });

  it("computes deterministic KCM facilitation closure", () => {
    const receipt = analysis.glassOverlap.kcmReceipt();

    assert.equal(receipt.sourceModule, "RelMath.Glass.KCM");
    assert.deepEqual(receipt.afterOneStep, { a: true, b: true, c: false });
    assert.deepEqual(receipt.closure, { a: true, b: true, c: true });
    assert.equal(receipt.activationInflationary, true);
    assert.equal(receipt.activationMonotone, true);
    assert.equal(receipt.closureFixed, true);
    assert.equal(receipt.seedExtendsToClosure, true);
    assert.deepEqual(evaluateRunTerm(glassOverlap.kcm, receipt), receipt);
  });
});
