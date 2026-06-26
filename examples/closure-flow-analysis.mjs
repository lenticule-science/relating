import assert from "node:assert/strict";

import { evaluateRunTerm, flow as rmnFlow } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

const seed = analysis.flow.valuation(["x", "y", "z"], {
  x: "absurd",
  y: "potential",
  z: "active",
});

const blowup = analysis.flow.firingBlowup(analysis.flow.truthSideClosureOperator, seed, 0);
const nsc = analysis.flow.nscFiring(analysis.flow.forallAntecedentOperator, analysis.flow.botTopPrefix);
const noNsc = analysis.flow.scottClosureNoNsc(analysis.flow.truthSideClosureOperator);
const dynamics = analysis.flow.closureFlowDynamics(analysis.flow.truthSideClosureOperator, seed, 3);
const curvature = analysis.flow.curvatureRegime("ordinal.closure.regime.transfinite");
const lyapunov = analysis.flow.freeEnergyLyapunov(analysis.flow.truthSideClosureOperator, seed);
const laplacianizer = analysis.flow.laplacianizer(analysis.flow.truthSideClosureOperator, seed);
const omega = analysis.flow.transfiniteOmegaContinuity(analysis.flow.truthSideClosureOperator, seed);

assert.equal(blowup.kind, "flow.firingBlowup:witness");
assert.equal(nsc.kind, "flow.nscFiring:witness");
assert.equal(noNsc.kind, "flow.scottClosureNoNsc:witness");
assert.equal(lyapunov.energies[0], 2);
assert.equal(lyapunov.energies[1], 0);
assert.deepEqual(evaluateRunTerm(rmnFlow.firingBlowup, blowup), blowup);
assert.deepEqual(evaluateRunTerm(rmnFlow.nscFiring, nsc), nsc);
assert.deepEqual(evaluateRunTerm(rmnFlow.scottClosureNoNsc, noNsc), noNsc);
assert.deepEqual(evaluateRunTerm(rmnFlow.closureFlowDynamics, dynamics), dynamics);
assert.deepEqual(evaluateRunTerm(rmnFlow.curvatureRegime, curvature), curvature);
assert.deepEqual(evaluateRunTerm(rmnFlow.freeEnergyLyapunov, lyapunov), lyapunov);
assert.deepEqual(evaluateRunTerm(rmnFlow.laplacianizer, laplacianizer), laplacianizer);
assert.deepEqual(evaluateRunTerm(rmnFlow.transfiniteOmegaContinuity, omega), omega);

console.log(JSON.stringify({
  product: "relating.closure-flow-analysis",
  finiteFlow: {
    blowup: blowup.kind,
    firingTypes: blowup.localData.map((entry) => [entry.cell, entry.firingType]),
    dynamics: {
      firingSteps: dynamics.firingSteps,
      smoothSteps: dynamics.smoothSteps,
      settlesAt: dynamics.settlesAt,
    },
  },
  nsc: {
    witness: nsc.kind,
    opSup: nsc.opSup,
    supAfterMap: nsc.supAfterMap,
    closureNoNsc: noNsc.kind,
  },
  curvature: {
    regime: curvature.regime,
    cohomologyVanishes: curvature.cohomologyVanishes,
    curvatureRank: curvature.curvatureRank,
  },
  lyapunov: {
    energies: lyapunov.energies,
    antitone: lyapunov.antitone,
    boundedSteps: lyapunov.boundedSteps,
  },
  laplacianizer: {
    laplacianIsClosure: laplacianizer.laplacianIsClosure,
    harmonicEqualsFixed: laplacianizer.harmonicEqualsFixed,
  },
  omega: {
    boundary: omega.boundary,
    noNscAtOmega: omega.noNscAtOmega,
  },
}, null, 2));
