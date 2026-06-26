/**
 * Contract: finite serialization formats mirror RelMath.Computing.FormatsFour.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { evaluateRunTerm, formatsFour } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

describe("analysis.formatsFour: RelMath FormatsFour finite hierarchy", () => {
  it("classifies eight formats by content corner and completion regime", () => {
    const receipt = analysis.formatsFour.formatsClosureHierarchy();

    assert.equal(receipt.kind, "formatsFour.closureHierarchy:witness");
    assert.equal(receipt.cardinality, 8);
    assert.equal(receipt.cornersOnto, true);
    assert.deepEqual(receipt.costRises, ["bytes", "json"]);
    assert.deepEqual(receipt.costFalls, ["json", "rdf"]);
    assert.deepEqual(receipt.topCornerMultiRegime, ["markdown", "rdf", "html"]);
    assert.equal(receipt.rmnHtmlRecoversDecidability, true);
  });
});

describe("formatsFour RMN terms normalize finite hierarchy receipts", () => {
  it("normalizes the closure-hierarchy receipt", () => {
    const receipt = analysis.formatsFour.formatsClosureHierarchy();

    assert.deepEqual(evaluateRunTerm(formatsFour.closureHierarchy, receipt), receipt);
  });
});
