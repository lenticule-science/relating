/**
 * Contract: finite closure-flow/firing witnesses mirror the green RelMath Flow
 * successor-time surface and expose RMN-normalizable carrier judgments.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { evaluateRunTerm, flow as rmnFlow } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

const seed = analysis.flow.valuation(["x", "y", "z"], {
  x: "absurd",
  y: "potential",
  z: "active",
});

describe("analysis.flow: finite closure-flow and firing reads", () => {
  it("computes firing blowups, local data, and reconstruction", () => {
    const blowup = analysis.flow.firingBlowup(analysis.flow.truthSideClosureOperator, seed, 0);

    assert.equal(blowup.kind, "flow.firingBlowup:witness");
    assert.equal(blowup.leqKnowledge, true);
    assert.equal(blowup.nontrivial, true);
    assert.equal(blowup.identityBlowup, false);
    assert.deepEqual(
      blowup.actual.values,
      { x: "potential", y: "potential", z: "stable" },
    );
    assert.deepEqual(
      blowup.localData.map(({ cell, incidence, firingType, consistencyFailure }) => ({ cell, incidence, firingType, consistencyFailure })),
      [
        { cell: "x", incidence: true, firingType: "tSide", consistencyFailure: null },
        { cell: "y", incidence: false, firingType: null, consistencyFailure: null },
        { cell: "z", incidence: true, firingType: "top", consistencyFailure: "active" },
      ],
    );
    assert.deepEqual(blowup.reconstructedActual, blowup.actual);
    assert.equal(blowup.classified, true);
  });

  it("separates finite NSC witnesses from genuine closure no-NSC witnesses", () => {
    const nsc = analysis.flow.nscFiring(analysis.flow.forallAntecedentOperator, analysis.flow.botTopPrefix);
    const closureNoNsc = analysis.flow.scottClosureNoNsc(analysis.flow.truthSideClosureOperator);

    assert.equal(nsc.kind, "flow.nscFiring:witness");
    assert.equal(nsc.supBefore, "stable");
    assert.equal(nsc.opSup, "absurd");
    assert.equal(nsc.supAfterMap, "stable");
    assert.equal(nsc.isNsc, true);
    assert.equal(nsc.cohomologyVanishes, false);

    assert.equal(closureNoNsc.kind, "flow.scottClosureNoNsc:witness");
    assert.equal(closureNoNsc.closureLike, true);
    assert.equal(closureNoNsc.scottContinuous, true);
    assert.equal(closureNoNsc.nscCount, 0);
  });

  it("models monotone dynamics, curvature regimes, free energy, and Laplacianizability", () => {
    const dynamics = analysis.flow.closureFlowDynamics(analysis.flow.truthSideClosureOperator, seed, 3);
    const flat = analysis.flow.curvatureRegime("ordinal.closure.regime.finite");
    const curved = analysis.flow.curvatureRegime("ordinal.closure.regime.transfinite");
    const lyapunov = analysis.flow.freeEnergyLyapunov(analysis.flow.truthSideClosureOperator, seed);
    const laplacianizer = analysis.flow.laplacianizer(analysis.flow.truthSideClosureOperator, seed);
    const omega = analysis.flow.transfiniteOmegaContinuity(analysis.flow.truthSideClosureOperator, seed);

    assert.deepEqual(dynamics.firingSteps, [0]);
    assert.deepEqual(dynamics.smoothSteps, [1, 2]);
    assert.equal(dynamics.monotoneAscent, true);
    assert.equal(dynamics.smoothTailTerminal, true);
    assert.equal(dynamics.settlesAt, 1);

    assert.equal(flat.flat, true);
    assert.equal(flat.curvatureRank, 0);
    assert.equal(flat.cohomologyVanishes, true);
    assert.equal(curved.curved, true);
    assert.equal(curved.curvatureRank, null);
    assert.equal(curved.cohomologyVanishes, false);
    assert.equal(curved.curvedOmegaTerminating, false);

    assert.deepEqual(lyapunov.energies.slice(0, 3), [2, 0, 0]);
    assert.equal(lyapunov.antitone, true);
    assert.equal(lyapunov.strictDropsAtFirings, true);
    assert.equal(lyapunov.equilibriumEnergy, 0);
    assert.equal(lyapunov.boundedSteps, 1);

    assert.equal(laplacianizer.laplacianIsClosure, true);
    assert.equal(laplacianizer.hodgeIsoDegree0, true);
    assert.equal(laplacianizer.harmonicEqualsFixed, true);
    assert.equal(laplacianizer.settledIsLeastHarmonic, true);

    assert.equal(omega.monotoneChain, true);
    assert.equal(omega.omegaIsLub, true);
    assert.equal(omega.noNscAtOmega, true);
    assert.equal(omega.boundary, "canonical-omega-only");
  });
});

describe("flow RMN terms normalize finite closure-flow carriers", () => {
  it("normalizes flow witness and obstruction carriers", () => {
    const blowup = analysis.flow.firingBlowup(analysis.flow.truthSideClosureOperator, seed, 0);
    const nsc = analysis.flow.nscFiring(analysis.flow.forallAntecedentOperator, analysis.flow.botTopPrefix);
    const noNsc = analysis.flow.scottClosureNoNsc(analysis.flow.truthSideClosureOperator);
    const dynamics = analysis.flow.closureFlowDynamics(analysis.flow.truthSideClosureOperator, seed, 3);
    const curvature = analysis.flow.curvatureRegime("ordinal.closure.regime.transfinite");
    const lyapunov = analysis.flow.freeEnergyLyapunov(analysis.flow.truthSideClosureOperator, seed);
    const laplacianizer = analysis.flow.laplacianizer(analysis.flow.truthSideClosureOperator, seed);
    const omega = analysis.flow.transfiniteOmegaContinuity(analysis.flow.truthSideClosureOperator, seed);

    assert.deepEqual(evaluateRunTerm(rmnFlow.firingBlowup, blowup), blowup);
    assert.deepEqual(evaluateRunTerm(rmnFlow.nscFiring, nsc), nsc);
    assert.deepEqual(evaluateRunTerm(rmnFlow.scottClosureNoNsc, noNsc), noNsc);
    assert.deepEqual(evaluateRunTerm(rmnFlow.closureFlowDynamics, dynamics), dynamics);
    assert.deepEqual(evaluateRunTerm(rmnFlow.curvatureRegime, curvature), curvature);
    assert.deepEqual(evaluateRunTerm(rmnFlow.freeEnergyLyapunov, lyapunov), lyapunov);
    assert.deepEqual(evaluateRunTerm(rmnFlow.laplacianizer, laplacianizer), laplacianizer);
    assert.deepEqual(evaluateRunTerm(rmnFlow.transfiniteOmegaContinuity, omega), omega);
  });
});
