/**
 * Contract: RelMath.Aperiodic.WeaveDraft is exposed as finite plain-weave,
 * FOUR-crossing, and bilattice-coloured sofic receipts.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { evaluateRunTerm, weaveDraft } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

describe("analysis.weaveDraft: plain weave as a sofic shift", () => {
  it("uses strict over-under alternation and forbids floats", () => {
    const path = analysis.weaveDraft.warpPath([false, true, false, true]);
    const float = analysis.weaveDraft.warpPath([false, false, true]);

    assert.equal(analysis.weaveDraft.warpAlt(false, true), true);
    assert.equal(analysis.weaveDraft.warpAlt(true, true), false);
    assert.equal(analysis.weaveDraft.completeGraphBool(false, true), true);
    assert.equal(path.kind, "sofic.path:witness");
    assert.equal(float.kind, "sofic.path-obstruction");
    assert.deepEqual(float.edge, [0, 0]);
  });

  it("reads crossings as FOUR charges and mirrors them by negation", () => {
    assert.equal(analysis.weaveDraft.crossingCharge(false, false), "absurd");
    assert.equal(analysis.weaveDraft.crossingCharge(true, true), "stable");
    assert.equal(analysis.weaveDraft.crossingCharge(true, false), "potential");
    assert.equal(analysis.weaveDraft.crossingCharge(false, true), "active");
    assert.deepEqual(analysis.weaveDraft.chargeColourWord([false, true, false]), ["active", "potential", "active"]);
  });

  it("carries defect-free charge words as sofic images", () => {
    const image = analysis.weaveDraft.chargeColouredSofic([false, true, false]);

    assert.equal(image.kind, "sofic.image:witness");
    assert.deepEqual(image.preimage, [0, 1, 0]);
    assert.deepEqual(image.image, [2, 3, 2]);
  });
});

describe("analysis.weaveDraft: swatch coherence", () => {
  it("checks column complementation and two-valued row collapse", () => {
    const swatch = [[false, true, false], [true, false, true], [false, true, false]];
    const bad = [[false, true, false], [false, true, false]];

    assert.equal(analysis.weaveDraft.columnsComplement(swatch), true);
    assert.equal(analysis.weaveDraft.plainWeaveSwatch(swatch), true);
    assert.equal(analysis.weaveDraft.entropyCollapse(swatch), true);
    assert.equal(analysis.weaveDraft.columnsComplement(bad), false);
    assert.equal(analysis.weaveDraft.plainWeaveSwatch(bad), false);
    assert.equal(analysis.weaveDraft.entropyCollapse(bad), false);
  });

  it("packages the weave-draft receipt and normalizes it as RMN data", () => {
    const receipt = analysis.weaveDraft.receipt();

    assert.equal(receipt.warpAltEqualsCompleteGraph, true);
    assert.equal(receipt.warpAltForbidsFloat, true);
    assert.equal(receipt.warpSofic, true);
    assert.equal(receipt.holeIsKBot, true);
    assert.equal(receipt.miscrossingIsKTop, true);
    assert.equal(receipt.overUnderSwapIsNegate, true);
    assert.equal(receipt.defectFreeDefinite, true);
    assert.equal(receipt.miscrossingIsInconsistency, true);
    assert.equal(receipt.defectFreeConsistent, true);
    assert.equal(receipt.overUnderSwapFixesDefect, true);
    assert.equal(receipt.chargeColouredSofic, true);
    assert.equal(receipt.entropyCollapse, true);
    assert.deepEqual(evaluateRunTerm(weaveDraft.receipt, receipt), receipt);
  });
});
