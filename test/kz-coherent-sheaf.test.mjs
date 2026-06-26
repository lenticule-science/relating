/**
 * Contract: KZ-coherent sheaf exposes finite strict/Scott KZ 2-cells,
 * section-map equality, descent closure under restriction, and RMN
 * normalization.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  evaluateRunTerm,
  kzCoherentSheaf,
} from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

describe("analysis.kzCoherentSheaf: finite KZ descent receipts", () => {
  it("recognizes strict KZ 2-cells as extensional equality of parallel one-cells", () => {
    const left = analysis.kzCoherentSheaf.oneCell("left", "start", "done", "advance");
    const right = analysis.kzCoherentSheaf.oneCell("right", "start", "done", "advance");
    const receipt = analysis.kzCoherentSheaf.kz2Cell(left, right);

    assert.equal(receipt.parallel, true);
    assert.equal(receipt.extensionalEquality, true);
    assert.equal(receipt.invertible, true);
    assert.throws(
      () => analysis.kzCoherentSheaf.kz2Cell(left, analysis.kzCoherentSheaf.oneCell("other", "start", "done", "retreat")),
      /not KZ-connected/u,
    );
  });

  it("identifies section maps on KZ-connected parallel routes", () => {
    const receipt = analysis.kzCoherentSheaf.kzCoherenceReceipt(analysis.kzCoherentSheaf.defaultSheaf);

    assert.equal(receipt.kind, "kzSheaf.coherence:witness");
    assert.equal(receipt.identifiesParallel, true);
    assert.equal(receipt.everySheafCoherentStrict, true);
    assert.equal(receipt.kzCells.length, 4);
  });

  it("keeps KZ coherence closed under finite restriction/postcomposition", () => {
    const receipt = analysis.kzCoherentSheaf.descentReceipt();

    assert.equal(receipt.closedUnderRestriction, true);
    assert.equal(receipt.strictRegimeUniversality, true);
    assert.equal(receipt.sourceCoherent.identifiesParallel, true);
    assert.equal(receipt.restrictedCoherent.identifiesParallel, true);
  });

  it("normalizes the combined KZ-coherent sheaf receipt as RMN data", () => {
    const receipt = analysis.kzCoherentSheaf.receipt();

    assert.equal(receipt.kind, "kzSheaf.receipt:witness");
    assert.equal(receipt.aperiodicFrontier, "non-trivial aperiodic 2-cells remain proof-side");
    assert.deepEqual(evaluateRunTerm(kzCoherentSheaf.receipt, receipt), receipt);
  });
});
