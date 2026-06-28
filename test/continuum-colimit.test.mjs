/**
 * Contract: finite continuum-colimit shape mirrors
 * RelMath.Lorentzian.ContinuumColimit.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { continuumColimit, evaluateRunTerm } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

describe("analysis.continuumColimit: finite Scott colimit shape", () => {
  it("commutes monotone functionals with attained directed joins", () => {
    const family = analysis.scottCoalgebra.directedFamily(["absurd", "potential", "stable"]);
    const join = analysis.continuumColimit.actionCommutesWithJoin(family);

    assert.equal(join.joinValue, "stable");
    assert.equal(join.joinFunctionalValue, 2);
    assert.deepEqual(join.stageValues, { absurd: 0, potential: 1, stable: 2 });
    assert.equal(join.boundsEveryStage, true);
    assert.equal(join.realizedAmongStages, true);
    assert.deepEqual(analysis.continuumColimit.actionLimitAttained(join), {
      kind: "lorentzian.continuumColimit.actionLimit:witness",
      attainedAt: "stable",
      value: 2,
      dominatesEveryStage: true,
      finiteStageAttainment: true,
    });
  });

  it("packages the colimit receipt and rejects non-monotone functionals", () => {
    const family = analysis.scottCoalgebra.directedFamily(["absurd", "potential", "stable"]);
    const receipt = analysis.continuumColimit.continuumColimitReceipt(family);
    const chu = analysis.continuumColimit.chuInformationActionColimitReceipt();

    assert.equal(receipt.scottColimitNotEpsilonDelta, true);
    assert.equal(receipt.finiteCarrierForcesAttainment, true);
    assert.equal(receipt.magnitudeBoundary, "metric Ricci-scalar contraction remains frontier");
    assert.equal(chu.sourceModule, "RelMath.Lorentzian.ChuActionColimit");
    assert.equal(chu.observedKnowledge, "stable");
    assert.equal(chu.observedKnowledgeContent, 2);
    assert.equal(chu.continuumValueAttained, true);
    assert.throws(
      () => analysis.continuumColimit.actionCommutesWithJoin(family, (value) => value === "absurd" ? 10 : 0),
      /monotone charge functional/u,
    );
    assert.deepEqual(evaluateRunTerm(continuumColimit.receipt, receipt), receipt);
    assert.deepEqual(evaluateRunTerm(continuumColimit.chuInformationAction, chu), chu);
  });
});
