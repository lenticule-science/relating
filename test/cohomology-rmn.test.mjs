/**
 * Contract: finite predication cohomology exposes exact H0/H1, Laplacian,
 * bigraded, and settlement-H1 carriers as RMN-normalizable receipts.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  bigradedCohomologyOfCharges,
  cell,
  chargeValue,
  claim,
  cohomologyLaplacianOfCells,
  cohomologyOfCells,
  cohomologyTerms,
  evaluateRunTerm,
  mark,
  predicateOfClaim,
  rankComparison,
  rankIdentity,
  rankVanishing,
  token,
} from "@emsenn/relating";

function naturalToNumber(value) {
  return value.members.length;
}

function jsonCarrier(value) {
  return JSON.parse(JSON.stringify(value));
}

const alpha = token(mark("alpha"));
const beta = token(mark("beta"));
const gamma = token(mark("gamma"));
const relates = predicateOfClaim(claim(mark("relates")));

const alphaBeta = cell(alpha, relates, beta);
const betaGamma = cell(beta, relates, gamma);
const gammaAlpha = cell(gamma, relates, alpha);

const pathCells = [alphaBeta, betaGamma];
const cycleCells = [alphaBeta, betaGamma, gammaAlpha];

describe("predication cohomology: finite H0/H1 and Laplacian reads", () => {
  it("computes exact H0/H1 ranks for path and cycle complexes", () => {
    const path = cohomologyOfCells(pathCells);
    const cycle = cohomologyOfCells(cycleCells);

    assert.equal(path.kind, "predication.cohomology.carrier");
    assert.equal(naturalToNumber(path.entities.length ? path.zeroCohomology.rank : { members: [] }), 1);
    assert.equal(naturalToNumber(path.firstCohomology.rank), 0);
    assert.equal(path.firstCohomology.vanishing.kind, "predication.cohomology.rankVanishing:witness");

    assert.equal(cycle.kind, "predication.cohomology.carrier");
    assert.equal(naturalToNumber(cycle.zeroCohomology.rank), 1);
    assert.equal(naturalToNumber(cycle.firstCohomology.rank), 1);
    assert.equal(cycle.firstCohomology.vanishing.kind, "predication.cohomology.rankVanishing-obstruction");
  });

  it("computes Laplacian rank identities over the same finite complex", () => {
    const laplacian = cohomologyLaplacianOfCells(cycleCells);

    assert.equal(laplacian.kind, "predication.cohomology.laplacian");
    assert.equal(naturalToNumber(laplacian.incidenceRank), 2);
    assert.equal(naturalToNumber(laplacian.laplacianRank), 2);
    assert.equal(laplacian.zeroCohomologyKernelRank.kind, "predication.cohomology.rankIdentity:witness");
    assert.equal(laplacian.firstCohomologyCokernelRank.kind, "predication.cohomology.rankIdentity:witness");
  });
});

describe("bigraded and rank cohomology receipts", () => {
  it("separates collapse witnesses from contradiction-row obstructions", () => {
    const collapsed = bigradedCohomologyOfCharges([
      chargeValue("potential"),
      chargeValue("active"),
    ]);
    const obstructed = bigradedCohomologyOfCharges([
      chargeValue("potential"),
      chargeValue("stable"),
      chargeValue("absurd"),
    ]);

    assert.equal(collapsed.truth, 2);
    assert.equal(collapsed.contradiction, 0);
    assert.equal(collapsed.collapse.kind, "predication.bigradedCohomology.collapse:witness");
    assert.equal(obstructed.truth, 1);
    assert.equal(obstructed.contradiction, 1);
    assert.equal(obstructed.collapse.kind, "predication.bigradedCohomology.collapse-obstruction");
  });

  it("keeps rank judgments as carrier-shaped evidence", () => {
    const cycle = cohomologyOfCells(cycleCells);
    const path = cohomologyOfCells(pathCells);

    assert.equal(rankVanishing(path.firstCohomology.rank).kind, "predication.cohomology.rankVanishing:witness");
    assert.equal(rankVanishing(cycle.firstCohomology.rank).kind, "predication.cohomology.rankVanishing-obstruction");
    assert.equal(rankIdentity(cycle.zeroCohomology.rank, path.zeroCohomology.rank).kind, "predication.cohomology.rankIdentity:witness");
    assert.equal(rankComparison(path.firstCohomology.rank, cycle.firstCohomology.rank).kind, "predication.cohomology.rankComparison.below");
  });
});

describe("cohomology RMN terms normalize finite carriers", () => {
  it("normalizes finite cohomology, Laplacian, bigraded, and H1 carriers", () => {
    const cohomology = cohomologyOfCells(cycleCells);
    const laplacian = cohomologyLaplacianOfCells(cycleCells);
    const bigraded = bigradedCohomologyOfCharges([chargeValue("potential"), chargeValue("stable")]);
    const comparison = rankComparison(cohomology.firstCohomology.rank, cohomology.zeroCohomology.rank);
    const settlingFirst = Object.freeze({
      kind: "predication.settling.firstCohomology",
      generators: Object.freeze([Object.freeze({
        kind: "predication.settling.firstCohomologyGenerator",
        stage: Object.freeze({ kind: "settling.stage.ordinal", label: "omega" }),
        cell: gammaAlpha,
      })]),
      rank: cohomology.firstCohomology.rank,
      degree: 1,
      vanishing: cohomology.firstCohomology.vanishing,
    });

    assert.deepEqual(evaluateRunTerm(cohomologyTerms.carrier, cohomology), jsonCarrier(cohomology));
    assert.deepEqual(evaluateRunTerm(cohomologyTerms.laplacian, laplacian), jsonCarrier(laplacian));
    assert.deepEqual(evaluateRunTerm(cohomologyTerms.bigraded, bigraded), jsonCarrier(bigraded));
    assert.deepEqual(evaluateRunTerm(cohomologyTerms.rankVanishing, cohomology.firstCohomology.vanishing), jsonCarrier(cohomology.firstCohomology.vanishing));
    assert.deepEqual(evaluateRunTerm(cohomologyTerms.rankIdentity, laplacian.firstCohomologyCokernelRank), jsonCarrier(laplacian.firstCohomologyCokernelRank));
    assert.deepEqual(evaluateRunTerm(cohomologyTerms.rankComparison, comparison), jsonCarrier(comparison));
    assert.deepEqual(evaluateRunTerm(cohomologyTerms.settlingFirst, settlingFirst), jsonCarrier(settlingFirst));
  });
});
