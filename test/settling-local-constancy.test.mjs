/**
 * Contract: RelMath.Cohomology.SettlingLocalConstancy is exposed as a
 * finite strict-regime equality-as-isomorphism receipt over KZ sheaves.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { evaluateRunTerm, settlingLocalConstancy } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

describe("analysis.settlingLocalConstancy: finite strict-regime local constancy", () => {
  it("models section-map isomorphism as equality in the strict slice", () => {
    const iso = analysis.settlingLocalConstancy.sectionIso("section:a", "section:a");

    assert.equal(iso.equal, true);
    assert.equal(iso.reflexive, true);
    assert.equal(iso.symmetric, true);
    assert.throws(
      () => analysis.settlingLocalConstancy.sectionIso("section:a", "section:b"),
      /requires equality/u,
    );
  });

  it("identifies predicate-local constancy with KZ coherence plus pinned identities", () => {
    const receipt = analysis.settlingLocalConstancy.predicateLocalConstancyReceipt(
      analysis.kzCoherentSheaf.defaultSheaf,
    );

    assert.equal(receipt.coherence.identifiesParallel, true);
    assert.equal(receipt.identityPinned, true);
    assert.equal(receipt.predicateUniform, true);
    assert.equal(receipt.predicateLocallyConstantIffUniform, true);
  });

  it("treats same-predicate-leg temporal variation as settling-locally constant", () => {
    const receipt = analysis.settlingLocalConstancy.settlingLocalConstancyReceipt(
      analysis.kzCoherentSheaf.defaultSheaf,
    );

    assert.equal(receipt.sectionMapsEqual, true);
    assert.equal(receipt.everySheafSettlingLocallyConstantStrict, true);
    assert.equal(receipt.temporalLegProofIrrelevant, true);
    assert.equal(receipt.samePredicateLegPairs.length, 4);
  });

  it("makes the constant sheaf predicate- and settling-locally constant", () => {
    const receipt = analysis.settlingLocalConstancy.constantSheafLocalConstancyReceipt("A");

    assert.equal(receipt.value, "A");
    assert.equal(receipt.predicateLocallyConstant.predicateUniform, true);
    assert.equal(receipt.settlingLocallyConstant.sectionMapsEqual, true);
    assert.equal(receipt.restrictionsAreIdentityIsomorphisms, true);
  });

  it("packages the strict/Scott vanishing gate and RMN normalizer", () => {
    const receipt = analysis.settlingLocalConstancy.receipt();

    assert.equal(receipt.kind, "settlingLocalConstancy.receipt:witness");
    assert.equal(receipt.site.noTemporalCovers, true);
    assert.equal(receipt.regime.h1VanishesInStrict, true);
    assert.equal(receipt.regime.h1VanishesInScott, true);
    assert.equal(receipt.regime.h1VanishesInTransfinite, false);
    assert.equal(receipt.regime.h1VanishesInAperiodic, false);
    assert.equal(receipt.frontier.length, 3);
    assert.deepEqual(evaluateRunTerm(settlingLocalConstancy.receipt, receipt), receipt);
  });
});
