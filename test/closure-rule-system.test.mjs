/**
 * Contract: finite closure-rule systems mirror
 * RelMath.Closure.ClosureRuleSystem as immediate-consequence fixed points.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { closureRule, evaluateRunTerm } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

describe("analysis.closureRule: finite immediate-consequence systems", () => {
  it("settles a positive rule cascade to the least closed valuation", () => {
    const system = analysis.closureRule.closureRuleSystem(
      ["alpha", "beta", "gamma"],
      [
        analysis.closureRule.alwaysRule("alpha", "potential"),
        analysis.closureRule.closureRule(
          "alpha-enables-beta",
          [{ cell: "alpha", atLeast: "potential" }],
          { cell: "beta", charge: "active" },
        ),
        analysis.closureRule.closureRule(
          "beta-enables-gamma",
          [{ cell: "beta", atLeast: "active" }],
          { cell: "gamma", charge: "stable" },
        ),
      ],
    );
    const seed = analysis.closureRule.knowledgeLeastValuation(system.cells);
    const receipt = analysis.closureRule.closureRuleReceipt(system, seed);

    assert.equal(receipt.kind, "closureRule.system.receipt:witness");
    assert.equal(receipt.fixed, true);
    assert.equal(receipt.inflationary, true);
    assert.equal(receipt.monotone, true);
    assert.equal(receipt.ruleRespecting, true);
    assert.equal(receipt.leastClosed, true);
    assert.equal(receipt.lfp, true);
    assert.deepEqual(receipt.firedAtSeed, ["always:alpha:potential"]);
    assert.deepEqual(receipt.closed.values, {
      alpha: "potential",
      beta: "active",
      gamma: "stable",
    });
    assert.equal(receipt.orbit.length, 5);
  });

  it("exposes the always-rule worked system from the Lean module", () => {
    const receipt = analysis.closureRule.alwaysRuleReceipt("cell", "stable");

    assert.equal(receipt.fixed, true);
    assert.equal(receipt.ruleRespecting, true);
    assert.equal(receipt.closed.values.cell, "stable");
    assert.deepEqual(receipt.firedAtSeed, ["always:cell:stable"]);
  });
});

describe("closureRule RMN terms normalize finite rule receipts", () => {
  it("normalizes generic and always-rule receipts", () => {
    const generic = analysis.closureRule.closureRuleReceipt(
      analysis.closureRule.closureRuleSystem(
        ["cell"],
        [analysis.closureRule.alwaysRule("cell", "potential")],
      ),
      analysis.closureRule.knowledgeLeastValuation(["cell"]),
    );
    const always = analysis.closureRule.alwaysRuleReceipt("cell", "active");

    assert.deepEqual(evaluateRunTerm(closureRule.receipt, generic), generic);
    assert.deepEqual(evaluateRunTerm(closureRule.always, always), always);
  });
});
