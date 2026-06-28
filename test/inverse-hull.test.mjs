/**
 * Contract: RelMath.Aperiodic.InverseHull is exposed for the constant H1Class
 * Anderson-Putnam inverse system and its seam map.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { evaluateRunTerm, inverseHull } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

describe("analysis.inverseHull: constant AP hull threads", () => {
  it("builds coherent constant threads and reads every stage by projection", () => {
    const cls = analysis.aperiodicClassification.h1Class(7);
    const thread = analysis.inverseHull.constThread(cls, [3, 0, 3, 2]);

    assert.deepEqual(thread.sampleStages, [0, 2, 3]);
    assert.equal(thread.coherent, true);
    assert.equal(analysis.inverseHull.projAt(thread, 9).coord, 7);
    assert.equal(analysis.inverseHull.seamMap(thread).coord, 7);
  });

  it("separates constant threads by their finite stage readings", () => {
    const left = analysis.inverseHull.constThread(analysis.aperiodicClassification.h1Class(2));
    const same = analysis.inverseHull.constThread(analysis.aperiodicClassification.h1Class(2), [4, 5]);
    const different = analysis.inverseHull.constThread(analysis.aperiodicClassification.h1Class(3));

    assert.equal(analysis.inverseHull.threadExtensional(left, same), true);
    assert.equal(analysis.inverseHull.threadExtensional(left, different), false);
    assert.equal(analysis.inverseHull.hullSeparatedByStages(left, same, [0, 1, 5]), true);
    assert.equal(analysis.inverseHull.hullSeparatedByStages(left, different, [0, 1, 5]), true);
  });

  it("packages seam surjectivity, clInv pairing, and nontriviality", () => {
    const receipt = analysis.inverseHull.receipt(5);

    assert.equal(receipt.seam.coord, 5);
    assert.equal(receipt.seamMapConstThread, true);
    assert.equal(receipt.seamMapSurjective, true);
    assert.equal(receipt.threadExtensional, true);
    assert.equal(receipt.hullSeparatedByStages, true);
    assert.equal(receipt.hullPairsClInv, true);
    assert.equal(receipt.apHullHasDistinctThreads, true);
    assert.equal(receipt.zeroThread.clInv.coord, 0);
    assert.equal(receipt.oneThread.clInv.coord, 1);
  });

  it("normalizes inverse-hull receipts as RMN data", () => {
    const receipt = analysis.inverseHull.receipt();

    assert.deepEqual(evaluateRunTerm(inverseHull.receipt, receipt), receipt);
  });
});
