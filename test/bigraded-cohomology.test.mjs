/**
 * Contract: RelMath.Positing.BigradedCohomology has a finite charge-list
 * receipt for the trichotomy and negation gauge laws.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { bigradedCohomology, evaluateRunTerm } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

describe("analysis.bigradedCohomology: finite charge-list receipts", () => {
  it("classifies the mixed bigraded regime and gauge action", () => {
    const receipt = analysis.bigradedCohomology.receipt(
      analysis.bigradedCohomology.workedMixedCharges,
    );

    assert.equal(receipt.kind, "bigradedCohomology.receipt:witness");
    assert.equal(receipt.truthContent, true);
    assert.equal(receipt.inconsistencyContent, true);
    assert.equal(receipt.regime, "mixed");
    assert.deepEqual(receipt.negated, ["active", "stable", "absurd"]);
    assert.equal(receipt.gaugeFixesInconsistency, true);
    assert.equal(receipt.gaugeFlipsTruthToFalse, true);
    assert.equal(receipt.classicalGaugeMoved, true);
  });

  it("recognizes paraconsistent points as gauge-stable", () => {
    const receipt = analysis.bigradedCohomology.receipt(
      analysis.bigradedCohomology.workedParaconsistentCharges,
    );

    assert.equal(receipt.regime, "paraconsistent");
    assert.equal(receipt.truthContent, false);
    assert.equal(receipt.inconsistencyContent, true);
    assert.equal(receipt.paraconsistentGaugeStable, true);
    assert.deepEqual(receipt.negated, receipt.charges);
  });

  it("classifies local MLD by the bilattice negation gauge", () => {
    const receipt = analysis.bigradedCohomology.localMldClassificationReceipt();

    assert.equal(receipt.sourceModule, "RelMath.Positing.LocalMldClassification");
    assert.deepEqual(receipt.gaugeOrbits, [["absurd"], ["potential", "active"], ["stable"]]);
    assert.equal(receipt.converseIncluded, true);
  });

  it("splits knowledge sections into truth and top sections at degree zero", () => {
    const receipt = analysis.bigradedCohomology.truthKnowledgeSectionDecompositionReceipt();

    assert.equal(receipt.kind, "bigradedCohomology.truthKnowledgeSectionDecomposition:witness");
    assert.equal(receipt.knowledgeSupported, true);
    assert.equal(receipt.truthSupported, true);
    assert.equal(receipt.topSupported, true);
    assert.equal(receipt.mergeSplitIdentity, true);
    assert.equal(receipt.splitMergeIdentityOnSamples, true);
    assert.equal(receipt.h1Vanishes, true);
    assert.equal(receipt.hnAboveOneZero, true);
    assert.equal(receipt.degenerateLes, true);
    assert.equal(receipt.sampleSize, 9);
    assert.deepEqual(receipt.truthSection.coefficients, [
      { cell: "both-cell", coefficient: 0 },
      { cell: "empty-cell", coefficient: 0 },
      { cell: "false-cell", coefficient: 0 },
      { cell: "truth-cell", coefficient: 2 },
    ]);
    assert.deepEqual(receipt.topSection.coefficients, [
      { cell: "both-cell", coefficient: 5 },
      { cell: "empty-cell", coefficient: 0 },
      { cell: "false-cell", coefficient: 0 },
      { cell: "truth-cell", coefficient: 0 },
    ]);
  });
});

describe("bigradedCohomology RMN terms normalize finite receipts", () => {
  it("normalizes the bigraded cohomology receipt", () => {
    const receipt = analysis.bigradedCohomology.receipt(
      analysis.bigradedCohomology.workedMixedCharges,
    );

    assert.deepEqual(evaluateRunTerm(bigradedCohomology.receipt, receipt), receipt);
  });

  it("normalizes the truth-knowledge decomposition receipt", () => {
    const receipt = analysis.bigradedCohomology.truthKnowledgeSectionDecompositionReceipt();

    assert.deepEqual(evaluateRunTerm(bigradedCohomology.truthKnowledgeSectionDecomposition, receipt), receipt);
  });

  it("normalizes the local MLD classification receipt", () => {
    const receipt = analysis.bigradedCohomology.localMldClassificationReceipt();

    assert.deepEqual(evaluateRunTerm(bigradedCohomology.localMldClassification, receipt), receipt);
  });
});
