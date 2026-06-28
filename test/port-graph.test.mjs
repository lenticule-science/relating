/**
 * Contract: RelMath.Aperiodic.PortGraph and CondensateMatter are exposed as
 * finite lenticule/thread and material-rigidity receipts.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { evaluateRunTerm, portGraph } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

describe("analysis.portGraph: finite lenticule thread laws", () => {
  it("uses the plain weave alternation as the one-hole port transition", () => {
    const through = analysis.portGraph.threadPass("bead", false, true);
    const foldBack = analysis.portGraph.threadPass("bead", true, true);
    const receipt = analysis.portGraph.portGraphReceipt([through, foldBack]);

    assert.equal(analysis.portGraph.holeTransition(false, true), true);
    assert.equal(analysis.portGraph.holeTransition(true, true), false);
    assert.equal(analysis.portGraph.legalThreadPass(through), true);
    assert.equal(analysis.portGraph.legalThreadPass(foldBack), false);
    assert.equal(receipt.legal, false);
    assert.equal(receipt.holeTransitionEqualsWarpAlt, true);
    assert.equal(receipt.legalIffDistinct, true);
    assert.equal(receipt.threadLegalNil, true);
  });

  it("reads occupation as the condensate FOUR charge and mirror-fixed poles", () => {
    const receipt = analysis.portGraph.portGraphReceipt();

    assert.equal(analysis.portGraph.condensate(0), "absurd");
    assert.equal(analysis.portGraph.condensate(1), "potential");
    assert.equal(analysis.portGraph.condensate(2), "stable");
    assert.equal(receipt.emptyConsistent, true);
    assert.equal(receipt.singleConsistent, true);
    assert.equal(receipt.overOccupationInconsistency, true);
    assert.equal(receipt.mirrorFixesEmpty, true);
    assert.equal(receipt.mirrorFixesCondensatePole, true);
    assert.equal(receipt.mirrorFixesCondensate, true);
  });
});

describe("analysis.portGraph: condensate matter receipts", () => {
  it("counts rigidity exactly at over-occupied lenticules", () => {
    const receipt = analysis.portGraph.condensateMatterReceipt([0, 1, 2, 4]);
    const floppy = analysis.portGraph.condensateMatterReceipt([0, 1, 1]);

    assert.equal(receipt.rigidity, 2);
    assert.deepEqual(receipt.overOccupied, [2, 4]);
    assert.equal(receipt.condensateInconsistencyIff, true);
    assert.equal(receipt.rigidIffOveroccupied, true);
    assert.equal(receipt.floppyOfAllLeOne, true);
    assert.equal(floppy.rigidity, 0);
    assert.equal(floppy.floppyOfAllLeOne, true);
  });

  it("normalizes port-graph receipts as RMN data", () => {
    const thread = [analysis.portGraph.threadPass("bead", false, true)];
    const local = analysis.portGraph.portGraphReceipt(thread);
    const material = analysis.portGraph.condensateMatterReceipt([0, 2, 3]);

    assert.deepEqual(evaluateRunTerm(portGraph.receipt, local), local);
    assert.deepEqual(evaluateRunTerm(portGraph.condensateMatter, material), material);
  });
});

describe("analysis.portGraph: port-growth Bratteli tower receipts", () => {
  const nativeMatrix = (matrix) => matrix.map((row) => row.map(analysis.toInt));

  it("computes substitution matrices and telescopes levelwise growth", () => {
    const receipt = analysis.portGraph.portGrowthReceipt(analysis.portGraph.padovanMatrix, 1, 2);

    assert.deepEqual(nativeMatrix(analysis.portGraph.padovanMatrix), [
      [0, 1, 0],
      [0, 0, 1],
      [1, 1, 0],
    ]);
    assert.deepEqual(nativeMatrix(analysis.portGraph.fibonacciMatrix), [
      [1, 1],
      [1, 0],
    ]);
    assert.equal(receipt.portGrowthZero, true);
    assert.equal(receipt.portGrowthSucc, true);
    assert.equal(receipt.matPowAdd, true);
    assert.equal(receipt.portGrowthTelescopes, true);
    assert.deepEqual(nativeMatrix(receipt.growthSum), nativeMatrix(receipt.composed));
  });

  it("packages Padovan renormalization and FOUR Chu incidence", () => {
    const receipt = analysis.portGraph.portGrowthReceipt();

    assert.equal(receipt.portGrowthRenormPadovan, true);
    assert.deepEqual(nativeMatrix(receipt.padovanGrowth3), nativeMatrix(receipt.padovanRenormalized));
    assert.deepEqual(receipt.padovanChuIncidence, [
      ["absurd", "potential", "absurd"],
      ["absurd", "absurd", "potential"],
      ["potential", "potential", "absurd"],
    ]);
    assert.equal(receipt.portGrowthEdgesChu, true);
  });
});

describe("analysis.portGraph: port-growth time receipts", () => {
  it("reads the Bratteli level order as a strict discrete time section", () => {
    const receipt = analysis.portGraph.portGrowthTimeReceipt([0, 1, 2, 3]);

    assert.equal(analysis.portGraph.levelPrec(1, 2), true);
    assert.equal(analysis.portGraph.levelPrec(2, 2), false);
    assert.equal(analysis.portGraph.timeSection([0, 1, 2, 3], 3), 3);
    assert.deepEqual(receipt.timeSection, { 0: 0, 1: 1, 2: 2, 3: 3 });
    assert.equal(receipt.levelPrecTransitive, true);
    assert.equal(receipt.levelPrecIrreflexive, true);
    assert.equal(receipt.portGrowthTimeStrictMono, true);
    assert.equal(receipt.chainTimeSectionEqLevel, true);
  });

  it("normalizes port-growth receipts as RMN data", () => {
    const growth = analysis.portGraph.portGrowthReceipt();
    const time = analysis.portGraph.portGrowthTimeReceipt();

    assert.deepEqual(evaluateRunTerm(portGraph.growth, growth), growth);
    assert.deepEqual(evaluateRunTerm(portGraph.time, time), time);
  });
});

describe("analysis.portGraph: Vershik adic successor receipts", () => {
  it("computes the little-endian odometer successor and serial index", () => {
    assert.deepEqual(analysis.portGraph.vershik([false, false]), [true, false]);
    assert.deepEqual(analysis.portGraph.vershik([true, false]), [false, true]);
    assert.deepEqual(analysis.portGraph.vershik([true, true]), [false, false]);

    assert.equal(analysis.portGraph.vershikToNat([false, false]), 0);
    assert.equal(analysis.portGraph.vershikToNat([true, false]), 1);
    assert.equal(analysis.portGraph.vershikToNat([false, true]), 2);
    assert.equal(analysis.portGraph.vershikToNat([true, true]), 3);
  });

  it("packages length, successor, wrap, and two-level cycle laws", () => {
    const receipt = analysis.portGraph.portVershikReceipt([true, false]);
    const wrap = analysis.portGraph.portVershikReceipt([true, true]);

    assert.deepEqual(receipt.successor, [false, true]);
    assert.equal(receipt.serialIndex, 1);
    assert.equal(receipt.successorIndex, 2);
    assert.equal(receipt.successorIncrements, true);
    assert.equal(receipt.lengthPreserved, true);
    assert.equal(receipt.vershikSuccWhenNotMaximal, true);
    assert.equal(receipt.maximalWraps, true);
    assert.equal(receipt.twoCycle, true);
    assert.deepEqual(wrap.successor, [false, false]);
    assert.equal(wrap.successorIncrements, true);
  });

  it("normalizes Vershik receipts as RMN data", () => {
    const receipt = analysis.portGraph.portVershikReceipt([false, true]);

    assert.deepEqual(evaluateRunTerm(portGraph.vershik, receipt), receipt);
  });
});
