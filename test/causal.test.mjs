/**
 * Contract: finite Lorentzian causal-set reads mirror the computable RelMath
 * Causal/Myrheim-Meyer surface and expose RMN-normalizable carrier judgments.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { causal, evaluateRunTerm } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

function naturalToNumber(value) {
  let count = 0;
  let current = value;
  while (!analysis.natIsZero(current)) {
    count += 1;
    current = analysis.predecessor(current);
  }
  return count;
}

function integerToNumber(value) {
  return naturalToNumber(value.pos) - naturalToNumber(value.neg);
}

function rationalToString(value) {
  const numerator = integerToNumber(value.num);
  const denominator = integerToNumber(value.den);
  return denominator === 1 ? String(numerator) : `${numerator}/${denominator}`;
}

describe("analysis.causal: RelMath Lorentzian causal-set finite reads", () => {
  it("settles the diamond, chain, and antichain Myrheim-Meyer witnesses", () => {
    const diamond = analysis.causal.settleCausalSet(analysis.causal.diamondCausalSet);
    const chain = analysis.causal.settleCausalSet(analysis.causal.chainCausalSet);
    const antichain = analysis.causal.settleCausalSet(analysis.causal.antichainCausalSet);

    assert.equal(diamond.kind, "lorentzian.causalSettle:witness");
    assert.equal(diamond.apexCount, 5);
    assert.equal(diamond.eulerCharacteristic, 5);
    assert.equal(diamond.nscCount, 0);
    assert.equal(diamond.h1Vanishes, true);
    assert.equal(rationalToString(diamond.orderingFraction), "5/6");

    assert.equal(chain.kind, "lorentzian.causalSettle:witness");
    assert.equal(chain.apexCount, 6);
    assert.equal(rationalToString(chain.orderingFraction), "1");

    assert.equal(antichain.kind, "lorentzian.causalSettle:witness");
    assert.equal(antichain.apexCount, 0);
    assert.equal(rationalToString(antichain.orderingFraction), "0");
  });

  it("computes transitive closure and obstructs closed timelike curves", () => {
    const chainSeed = {
      kind: "lorentzian.causalSet",
      events: ["a", "b", "c"],
      links: [{ from: "a", to: "b" }, { from: "b", to: "c" }],
    };
    const closed = {
      kind: "lorentzian.causalSet",
      events: ["a", "b"],
      links: [{ from: "a", to: "b" }, { from: "b", to: "a" }],
    };

    const settled = analysis.causal.settleCausalSet(chainSeed);
    const obstruction = analysis.causal.settleCausalSet(closed);

    assert.equal(settled.kind, "lorentzian.causalSettle:witness");
    assert.deepEqual(settled.closure, [
      { from: "a", to: "b" },
      { from: "a", to: "c" },
      { from: "b", to: "c" },
    ]);
    assert.equal(obstruction.kind, "lorentzian.causalSettle-obstruction");
    assert.equal(obstruction.reason, "closed-timelike-curve");
  });

  it("carries the geometry/topology independence witness", () => {
    const witness = analysis.causal.geometryIndependentOfTopology;

    assert.equal(witness.kind, "lorentzian.myrheimMeyer.geometryIndependentOfTopology:witness");
    assert.equal(witness.sharedClassifying.h1Vanishes, true);
    assert.equal(rationalToString(witness.diamondOrderingFraction), "5/6");
    assert.equal(rationalToString(witness.chainOrderingFraction), "1");
    assert.equal(rationalToString(witness.antichainOrderingFraction), "0");
  });

  it("models cone fields, causal Laplacian, light observations, and causal net receipts", () => {
    const cone = analysis.causal.coneFieldReceipt(analysis.causal.diamondCausalSet);
    const alexandrov = analysis.causal.causalAlexandrovReceipt(analysis.causal.diamondCausalSet);
    const laplacian = analysis.causal.causalLaplacianReceipt(analysis.causal.diamondCausalSet, ["a"]);
    const observation = analysis.causal.lightObservationReceipt(analysis.causal.diamondCausalSet);
    const portrait = analysis.causal.diamondSpectralPortraitReceipt();
    const net = analysis.causal.causalNetReceipt(analysis.causal.diamondCausalSet);
    const microlocal = analysis.causal.microlocalSupportReceipt(analysis.causal.diamondCausalSet, ["a"]);

    assert.equal(cone.kind, "lorentzian.coneField:witness");
    assert.deepEqual(cone.spacelikePairs, [["b", "c"]]);
    assert.equal(cone.orderLaws.antisymmetric, true);
    assert.equal(alexandrov.kind, "lorentzian.causalAlexandrov:witness");
    assert.equal(alexandrov.futureConesOpen, true);

    assert.equal(laplacian.kind, "lorentzian.causalLaplacian:witness");
    assert.deepEqual(laplacian.closure, ["a", "b", "c", "d"]);
    assert.equal(laplacian.gapOne, true);

    assert.equal(observation.kind, "lorentzian.lightObservation:witness");
    assert.equal(observation.separating, true);
    assert.deepEqual(observation.signatures.find((row) => row.event === "b").future, ["b", "d"]);

    assert.equal(portrait.kind, "lorentzian.diamondSpectralPortrait:witness");
    assert.deepEqual(portrait.spacelikeMiddlePair, ["b", "c"]);
    assert.deepEqual(portrait.futureCounts, [3, 1, 1, 0]);

    assert.equal(net.kind, "lorentzian.causalNet:witness");
    assert.equal(net.diamondIsotony, true);
    assert.equal(microlocal.kind, "lorentzian.microlocalSupport:witness");
    assert.equal(microlocal.h1FlatWhenVanishes, true);
  });

  it("carries paraconsistent report and real-shadow boundary receipts", () => {
    const report = analysis.causal.paraconsistentConeReportReceipt();
    const shadow = analysis.causal.myrheimMeyerRealShadowReceipt();

    assert.equal(report.kind, "lorentzian.paraconsistentConeReport:witness");
    assert.equal(report.booleanConsistent, true);
    assert.equal(report.contradictoryMerge, "stable");

    assert.equal(shadow.kind, "lorentzian.myrheimMeyerRealShadow:witness");
    assert.equal(rationalToString(shadow.rationalOrderingFraction), "5/6");
    assert.equal(shadow.dimensionInverse, "documented-boundary");
  });
});

describe("causal RMN terms normalize finite Lorentzian carriers", () => {
  it("normalizes settlement and geometry/topology witnesses", () => {
    const diamond = analysis.causal.settleCausalSet(analysis.causal.diamondCausalSet);
    const independence = analysis.causal.geometryIndependentOfTopology;
    const cone = analysis.causal.coneFieldReceipt(analysis.causal.diamondCausalSet);
    const alexandrov = analysis.causal.causalAlexandrovReceipt(analysis.causal.diamondCausalSet);
    const laplacian = analysis.causal.causalLaplacianReceipt(analysis.causal.diamondCausalSet, ["a"]);
    const observation = analysis.causal.lightObservationReceipt(analysis.causal.diamondCausalSet);
    const portrait = analysis.causal.diamondSpectralPortraitReceipt();
    const net = analysis.causal.causalNetReceipt(analysis.causal.diamondCausalSet);
    const report = analysis.causal.paraconsistentConeReportReceipt();
    const microlocal = analysis.causal.microlocalSupportReceipt(analysis.causal.diamondCausalSet, ["a"]);
    const shadow = analysis.causal.myrheimMeyerRealShadowReceipt();

    assert.deepEqual(evaluateRunTerm(causal.settle, diamond), diamond);
    assert.deepEqual(evaluateRunTerm(causal.geometryIndependentOfTopology, independence), independence);
    assert.deepEqual(evaluateRunTerm(causal.coneField, cone), cone);
    assert.deepEqual(evaluateRunTerm(causal.alexandrov, alexandrov), alexandrov);
    assert.deepEqual(evaluateRunTerm(causal.laplacian, laplacian), laplacian);
    assert.deepEqual(evaluateRunTerm(causal.lightObservation, observation), observation);
    assert.deepEqual(evaluateRunTerm(causal.diamondSpectralPortrait, portrait), portrait);
    assert.deepEqual(evaluateRunTerm(causal.net, net), net);
    assert.deepEqual(evaluateRunTerm(causal.paraconsistentConeReport, report), report);
    assert.deepEqual(evaluateRunTerm(causal.microlocalSupport, microlocal), microlocal);
    assert.deepEqual(evaluateRunTerm(causal.myrheimMeyerRealShadow, shadow), shadow);
  });
});
