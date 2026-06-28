/**
 * Contract: finite causal time sections mirror
 * RelMath.Lorentzian.RegimeTimeSection.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { evaluateRunTerm, regimeTimeSection } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

describe("analysis.regimeTimeSection: past-count time functions", () => {
  it("computes the diamond section and strict monotonicity", () => {
    const carrier = analysis.causal.diamondCausalSet;
    const profile = analysis.regimeTimeSection.timeProfile(carrier);
    const receipt = analysis.regimeTimeSection.regimeTimeSectionReceipt(carrier);

    assert.deepEqual(profile, { a: 0, b: 1, c: 1, d: 3 });
    assert.equal(analysis.regimeTimeSection.timeSection(carrier, "a"), 0);
    assert.equal(analysis.regimeTimeSection.timeSection(carrier, "d"), 3);
    assert.equal(analysis.regimeTimeSection.timeSectionStrictMonotone(carrier), true);
    assert.deepEqual(receipt.diamondTimeSection, { a: 0, b: 1, c: 1, d: 3 });
    assert.deepEqual(receipt.diamondStrictPairs, ["a<b", "a<c", "a<d", "b<d", "c<d"]);
    assert.equal(receipt.ordinalBound, "finite-sub-omega");
    assert.equal(receipt.stableCausalityBoundary, "aperiodic biconditional remains frontier");
  });

  it("normalizes the regime time-section receipt as RMN data", () => {
    const receipt = analysis.regimeTimeSection.regimeTimeSectionReceipt();

    assert.deepEqual(evaluateRunTerm(regimeTimeSection.receipt, receipt), receipt);
  });
});
