/**
 * Contract: RelMath.Cohomology.TransfiniteCellComplex is exposed as a finite
 * cell-complex colimit and finite-prefix settling-continuity receipt.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { evaluateRunTerm, transfiniteCellComplex } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

describe("analysis.transfiniteCellComplex: finite subcomplex colimit and continuity", () => {
  it("generates finite downward-closed subcomplexes from cells", () => {
    const generated = analysis.transfiniteCellComplex.generatedFiniteSubcomplex(
      analysis.transfiniteCellComplex.defaultComplex,
      ["face"],
    );

    assert.deepEqual([...generated.cells].sort(), ["edge", "face", "v0", "v1"]);
    assert.equal(analysis.transfiniteCellComplex.subcomplexIncludes(
      analysis.transfiniteCellComplex.generatedFiniteSubcomplex(analysis.transfiniteCellComplex.defaultComplex, ["edge"]),
      generated,
    ), true);
  });

  it("packages the finite-subcomplex directed colimit laws", () => {
    const receipt = analysis.transfiniteCellComplex.transfiniteComplexReceipt();

    assert.equal(receipt.everyCellFiniteDimensional, true);
    assert.equal(receipt.faceDimensionDrops, true);
    assert.equal(receipt.generatedSubcomplexesDownwardClosed, true);
    assert.equal(receipt.everyCellInSomeFiniteSubcomplex, true);
    assert.equal(receipt.finiteSubcomplexesDirected, true);
    assert.equal(receipt.inColimitIffSomeFinite, true);
    assert.equal(receipt.noLimitCellsBeyondUnion, true);
  });

  it("computes the finite-prefix limit join as a least upper bound", () => {
    const continuity = analysis.transfiniteCellComplex.settlingContinuityReceipt();

    assert.equal(continuity.upperBound, true);
    assert.equal(continuity.leastUpperBoundOnSamples, true);
    assert.equal(continuity.noNewContentAtLimit, true);
    assert.equal(continuity.closureOrbitContinuous, true);
    assert.deepEqual(continuity.limitJoin.values, { x: "potential", y: "stable" });
  });

  it("normalizes the combined receipt as RMN data", () => {
    const receipt = analysis.transfiniteCellComplex.receipt();

    assert.equal(receipt.kind, "transfiniteCellComplex.receipt:witness");
    assert.equal(receipt.colimit.frontier, "omega-one cardinality and arbitrary covering families remain proof-side");
    assert.equal(receipt.continuity.boundary, "finite-prefix-limit-model");
    assert.deepEqual(evaluateRunTerm(transfiniteCellComplex.receipt, receipt), receipt);
  });
});
