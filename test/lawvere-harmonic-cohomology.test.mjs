/**
 * Contract: RelMath.Cohomology.LawvereHarmonicCohomology is exposed as a
 * finite bridge from Lawvere/Tarski harmonic fixed sections to zero clInv and
 * H0 truth-firing extent.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { evaluateRunTerm, lawvereHarmonicCohomology } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

describe("analysis.lawvereHarmonicCohomology: finite harmonic/cohomology bridge", () => {
  it("counts H0 as truth-firing extent of the settled section", () => {
    const seed = analysis.lawvereHarmonicCohomology.defaultSeed;
    const receipt = analysis.lawvereHarmonicCohomology.receipt(seed);

    assert.deepEqual(seed.values, { x: "absurd", y: "potential", z: "active" });
    assert.deepEqual(receipt.settled.values, { x: "potential", y: "potential", z: "stable" });
    assert.equal(analysis.lawvereHarmonicCohomology.h0TruthFiringCount(receipt.settled), 2);
    assert.equal(receipt.h0TruthFiringCount, 2);
    assert.equal(receipt.h0CountsTruthFirings, true);
  });

  it("identifies the settled section as harmonic/fixed with zero classifying invariant", () => {
    const receipt = analysis.lawvereHarmonicCohomology.receipt();

    assert.equal(receipt.laplacianizer.laplacianIsClosure, true);
    assert.equal(receipt.laplacianizer.harmonicEqualsFixed, true);
    assert.equal(receipt.laplacianizer.settledIsLeastHarmonic, true);
    assert.equal(receipt.harmonic, true);
    assert.equal(receipt.fixedPoint, true);
    assert.equal(receipt.classifyingInvariant.coord, 0);
    assert.equal(receipt.classifyingInvariantZero, true);
    assert.equal(receipt.cocycle, true);
    assert.equal(receipt.coboundary, true);
    assert.equal(receipt.coboundaryUnique, true);
  });

  it("packages the strict/Scott vanishing-side bridge as RMN data", () => {
    const receipt = analysis.lawvereHarmonicCohomology.receipt();

    assert.equal(receipt.kind, "lawvereHarmonicCohomology.receipt:witness");
    assert.equal(receipt.strictScottRegimeGate, true);
    assert.equal(receipt.transfiniteAperiodicBoundary, true);
    assert.equal(receipt.frontier.length, 3);
    assert.deepEqual(evaluateRunTerm(lawvereHarmonicCohomology.receipt, receipt), receipt);
  });
});
