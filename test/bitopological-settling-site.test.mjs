/**
 * Contract: RelMath.Cohomology.BitopologicalSettlingSite is exposed as the
 * finite pairwise-Stone clopen site with fixed-fiber cover laws.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { bitopologicalSettlingSite, evaluateRunTerm } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

describe("analysis.bitopologicalSettlingSite: finite fixed-fiber site", () => {
  it("derives clopen inclusion from meet and computes finite join covers", () => {
    const { top, bot } = analysis.pairwiseStoneClopen;
    const plus = analysis.pairwiseStoneClopen.clopenUp(true, false);
    const minus = analysis.pairwiseStoneClopen.clopenUp(false, true);

    assert.equal(analysis.bitopologicalSettlingSite.sub(plus, top), true);
    assert.equal(analysis.bitopologicalSettlingSite.sub(top, plus), false);
    assert.equal(analysis.bitopologicalSettlingSite.covers(top, [plus, minus]), true);
    assert.equal(analysis.bitopologicalSettlingSite.covers(top, [plus, bot]), false);
  });

  it("pulls fixed-fiber covers back by clopen meet", () => {
    const { top } = analysis.pairwiseStoneClopen;
    const plus = analysis.pairwiseStoneClopen.clopenUp(true, false);
    const minus = analysis.pairwiseStoneClopen.clopenUp(false, true);
    const pulled = analysis.bitopologicalSettlingSite.pullbackCover(top, [plus, minus], plus);

    assert.deepEqual(pulled.target, plus);
    assert.deepEqual(pulled.family, [plus, analysis.pairwiseStoneClopen.bot]);
    assert.equal(pulled.everyMemberSubTarget, true);
    assert.equal(pulled.joinEqualsTarget, true);
  });

  it("keeps temporal advancement out of the covering relation", () => {
    const temporal = analysis.bitopologicalSettlingSite.temporalCoverReceipt();

    assert.equal(temporal.advances, true);
    assert.equal(temporal.strictAdvance, true);
    assert.equal(temporal.topologyMentionsTau, false);
    assert.equal(temporal.temporalContentInMorphismsNotCovers, true);
    assert.equal(temporal.fiberCoverSeenByJ.joinEqualsTarget, true);
  });

  it("packages the finite Grothendieck-site receipt as RMN data", () => {
    const receipt = analysis.bitopologicalSettlingSite.receipt();

    assert.equal(receipt.kind, "bitopologicalSettlingSite.receipt:witness");
    assert.equal(receipt.clopens.length, 4);
    assert.equal(receipt.clopenSubPartialOrder, true);
    assert.equal(receipt.advancesPreorder, true);
    assert.equal(receipt.grothendieckBasisAxioms, true);
    assert.equal(receipt.strictRegimeFiniteFiber, true);
    assert.equal(receipt.noTemporalCovers, true);
    assert.deepEqual(evaluateRunTerm(bitopologicalSettlingSite.receipt, receipt), receipt);
  });
});
