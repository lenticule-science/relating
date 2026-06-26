/**
 * Contract: RelMath.Positing.BigradedDiamond and the finite FOUR instance of
 * RelMath.Positing.NucleusAndCommutingNuclei have an executable knowledge-
 * Heyting nuclear-square receipt.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { bigradedDiamond, evaluateRunTerm } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

describe("analysis.bigradedDiamond: finite FOUR knowledge-Heyting laws", () => {
  it("checks the knowledge-Heyting implication adjunction", () => {
    const heyting = analysis.bigradedDiamond.knowledgeHeytingReceipt();

    assert.equal(heyting.kind, "bigradedDiamond.knowledgeHeyting:witness");
    assert.deepEqual(heyting.carrier, ["absurd", "potential", "active", "stable"]);
    assert.equal(heyting.implicationAdjunction, true);
    assert.equal(analysis.bigradedDiamond.knowledgeImplication("potential", "stable"), "stable");
    assert.equal(analysis.bigradedDiamond.knowledgeImplication("stable", "potential"), "potential");
  });

  it("turns knowledge joins toward a pole into nuclei", () => {
    const nucleus = analysis.bigradedDiamond.knowledgeNucleusReceipt("potential");

    assert.equal(nucleus.pole, "potential");
    assert.equal(nucleus.action.absurd, "potential");
    assert.equal(nucleus.action.active, "stable");
    assert.deepEqual(nucleus.fixed, ["potential", "stable"]);
    assert.equal(nucleus.fixedImplicationClosed, true);
  });

  it("realizes the commuting nuclear square and Fix(pi) law", () => {
    const square = analysis.bigradedDiamond.nuclearSquareReceipt("potential", "active");

    assert.equal(square.leftPole, "potential");
    assert.equal(square.rightPole, "active");
    assert.equal(square.piAction.absurd, "stable");
    assert.deepEqual(square.jointFixed, ["stable"]);
    assert.equal(square.commutes, true);
    assert.equal(square.fixPiIffFixBoth, true);
    assert.deepEqual(square.corners.map((corner) => corner.imageAtKnowledgeBottom), [
      "absurd",
      "potential",
      "active",
      "stable",
    ]);
  });

  it("witnesses the true/false fiber family variation", () => {
    const family = analysis.bigradedDiamond.varyingFamilyReceipt();

    assert.equal(family.varies, true);
    assert.deepEqual(family.witness, {
      leftFiber: "true",
      rightFiber: "false",
      differingNucleus: "j1",
      at: "absurd",
      leftValue: "potential",
      rightValue: "stable",
    });
  });

  it("stacks the diamond as a K4-graded tower", () => {
    const tower = analysis.bigradedDiamond.towerReceipt();

    assert.equal(tower.kind, "bigradedDiamond.tower:witness");
    assert.equal(tower.gradeCount, 4);
    assert.equal(tower.axesIndependent, true);
    assert.deepEqual(tower.grades.map((grade) => [grade.grade, grade.fourCorner, grade.corner, grade.leftPole]), [
      ["id", [false, false], "potential", "absurd"],
      ["neg", [true, false], "active", "potential"],
      ["conf", [false, true], "stable", "active"],
      ["negConf", [true, true], "absurd", "stable"],
    ]);
    assert.equal(tower.crossOrderForbidsCoNucleus.knowledgeInflationary, false);
  });
});

describe("bigradedDiamond RMN terms normalize finite receipts", () => {
  it("normalizes the bigraded-diamond receipt", () => {
    const receipt = analysis.bigradedDiamond.receipt();

    assert.equal(receipt.finiteNuclearQuartetDischarged, true);
    assert.deepEqual(evaluateRunTerm(bigradedDiamond.receipt, receipt), receipt);
  });

  it("normalizes the bigraded-diamond tower receipt", () => {
    const receipt = analysis.bigradedDiamond.towerReceipt();

    assert.deepEqual(evaluateRunTerm(bigradedDiamond.tower, receipt), receipt);
  });
});
