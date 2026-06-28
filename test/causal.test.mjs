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
    const interval = analysis.causal.causalIntervalReceipt(analysis.causal.diamondCausalSet);
    const alexandrov = analysis.causal.causalAlexandrovReceipt(analysis.causal.diamondCausalSet);
    const topology = analysis.causal.causalAlexandrovTopologyReceipt(analysis.causal.diamondCausalSet);
    const laplacian = analysis.causal.causalLaplacianReceipt(analysis.causal.diamondCausalSet, ["a"]);
    const observation = analysis.causal.lightObservationReceipt(analysis.causal.diamondCausalSet);
    const portrait = analysis.causal.diamondSpectralPortraitReceipt();
    const net = analysis.causal.causalNetReceipt(analysis.causal.diamondCausalSet);
    const microlocal = analysis.causal.microlocalSupportReceipt(analysis.causal.diamondCausalSet, ["a"]);

    assert.equal(cone.kind, "lorentzian.coneField:witness");
    assert.deepEqual(cone.spacelikePairs, [["b", "c"]]);
    assert.equal(cone.orderLaws.antisymmetric, true);
    assert.equal(interval.kind, "lorentzian.causalInterval:witness");
    assert.deepEqual(interval.layerProfile, [2, 0, 1]);
    assert.equal(interval.diamondLayersPartitionPast, true);
    assert.equal(alexandrov.kind, "lorentzian.causalAlexandrov:witness");
    assert.equal(alexandrov.futureConesOpen, true);
    assert.equal(topology.kind, "lorentzian.causalAlexandrovTopology:witness");
    assert.equal(topology.causalContinuousIffMonotone, true);
    assert.deepEqual(topology.futureCones.find((row) => row.event === "a").closedFuture, ["a", "b", "c", "d"]);

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

  it("computes finite Mobius, Benincasa-Dowker, and curvature receipts from the causal order", () => {
    const top = "d";
    const field = { a: 2, b: 3, c: 5, d: 7 };
    const bd = analysis.causal.benincasaDowkerReceipt();
    const wave = analysis.causal.causalDalembertianReceipt();
    const endogenous = analysis.causal.endogenousCoefficientReceipt();
    const mobius = analysis.causal.causalMobiusReceipt();
    const eh = analysis.causal.einsteinHilbertReceipt();
    const lambek = analysis.causal.lambekCurvatureReceipt();
    const ricci = analysis.causal.lambekRicciReceipt();
    const cohomology = analysis.causal.causalCohomologyReceipt();
    const h2 = analysis.causal.causalCohomologyH2Receipt();
    const hn = analysis.causal.causalCohomologyNReceipt();
    const wiring = analysis.causal.curvatureActionWiringReceipt();
    const distance = analysis.causal.causalDistanceReceipt();
    const bdgMobius = analysis.causal.bdgMobiusActionReceipt();

    assert.equal(analysis.causal.causalMobius(analysis.causal.diamondCausalSet, "a", top), 1);
    assert.equal(analysis.causal.causalMobius(analysis.causal.diamondCausalSet, "b", top), -1);
    assert.equal(analysis.causal.causalMobius(analysis.causal.diamondCausalSet, "c", top), -1);
    assert.deepEqual(analysis.causal.pastLayer(analysis.causal.diamondCausalSet, top, 0), ["b", "c"]);
    assert.deepEqual(analysis.causal.pastLayer(analysis.causal.diamondCausalSet, top, 2), ["a"]);
    assert.equal(analysis.causal.mobiusLayerCoefficient(analysis.causal.diamondCausalSet, top, 0), -2);
    assert.equal(analysis.causal.mobiusLayerCoefficient(analysis.causal.diamondCausalSet, top, 2), 1);
    assert.equal(analysis.causal.dalembertianStrict(analysis.causal.diamondCausalSet, field, top), -6);
    assert.equal(analysis.causal.dalembertianBD(analysis.causal.diamondCausalSet, analysis.causal.cDiamond, field, top), -6);

    assert.equal(bd.kind, "lorentzian.benincasaDowker:witness");
    assert.deepEqual(bd.mobiusProfileAtTop, { a: 1, b: -1, c: -1 });
    assert.deepEqual(bd.layerCoefficientsAtTop, { 0: -2, 2: 1 });
    assert.deepEqual(bd.bdCoeff2Moments, [0, 0, 2]);
    assert.deepEqual(bd.bdCoeff4PlainMoments, [0, -1, -17]);
    assert.equal(bd.diamondStrictEqualsBD, true);

    assert.equal(mobius.sourceModule, "RelMath.Lorentzian.CausalMobius");
    assert.equal(mobius.theorems.includes("RelMath.Lorentzian.CausalMobius.mobius_orthogonality_causal"), true);
    assert.equal(mobius.theorems.includes("RelMath.Lorentzian.CausalMobius.mobius_eq_hallSum"), true);
    assert.deepEqual(mobius.mobiusProfileAtTop, { a: 1, b: -1, c: -1 });
    assert.deepEqual(mobius.layerCoefficientsAtTop, { 0: -2, 2: 1 });
    assert.equal(mobius.intervalOrthogonalityAtDiamond, true);
    assert.equal(mobius.saturatedOrthogonalityAtDiamond, true);
    assert.equal(mobius.mobiusSelfAtTop, 1);
    assert.equal(mobius.offOrderZeroAtMiddle, 0);
    assert.deepEqual(mobius.chainCountAtApex, [1, 2, 0]);
    assert.equal(mobius.hallSumAtApex, 1);
    assert.equal(mobius.mobiusEqualsHallSumAtApex, true);

    assert.equal(wave.kind, "lorentzian.causalDalembertian:witness");
    assert.equal(wave.zeroFieldAnnihilated, true);
    assert.equal(wave.additiveAtTop, true);
    assert.equal(wave.expectationCommutes, true);
    assert.equal(wave.unitFieldAtTop, 0);
    assert.equal(wave.strictPastAtTop, -1);

    assert.equal(endogenous.kind, "lorentzian.endogenousCoefficients:witness");
    assert.deepEqual(endogenous.endoCoeffAtTop, [-2, 0, 1]);
    assert.equal(endogenous.strictActionAtTop, -1);
    assert.equal(endogenous.actionIsLayerSum, true);
    assert.equal(endogenous.factorsThroughDiamondCoefficients, true);

    assert.equal(eh.kind, "lorentzian.einsteinHilbert:witness");
    assert.deepEqual(eh.localCurvature, { a: 1, b: 0, c: 0, d: 0 });
    assert.equal(eh.bdAction, 1);

    assert.equal(lambek.kind, "lorentzian.lambekCurvature:witness");
    assert.deepEqual(lambek.rowCurvature, { a: 0, b: 0, c: 0, d: 1 });
    assert.deepEqual(lambek.curvatureDefect, { a: 1, b: 0, c: 0, d: -1 });
    assert.equal(lambek.totalDefect, 0);

    assert.equal(ricci.kind, "lorentzian.lambekRicci:witness");
    assert.deepEqual(ricci.boundaryTensor, { "a,d": -1, "d,a": 1 });
    assert.equal(ricci.diagonalVanishes, true);
    assert.equal(ricci.antisymmetric, true);
    assert.deepEqual(ricci.scalarTrace, { a: 1, b: 0, c: 0, d: -1 });
    assert.equal(ricci.tensorTotal, 0);

    assert.equal(cohomology.sourceModule, "RelMath.Lorentzian.CausalCohomology");
    assert.equal(cohomology.delta1Delta0Zero, true);
    assert.equal(h2.sourceModule, "RelMath.Lorentzian.CausalCohomologyH2");
    assert.equal(h2.delta2Delta1Zero, true);
    assert.equal(hn.sourceModule, "RelMath.Lorentzian.CausalCohomologyN");
    assert.equal(hn.deltaSquaresToZeroAllDegrees, true);
    assert.equal(wiring.sourceModule, "RelMath.Lorentzian.CurvatureActionWiring");
    assert.equal(wiring.totalSymRicci, 2 * wiring.bdAction);
    assert.equal(distance.sourceModule, "RelMath.Lorentzian.CausalDistance");
    assert.equal(distance.theorems.includes("RelMath.Lorentzian.CausalDistance.reverse_triangle_general"), true);
    assert.equal(distance.theorems.includes("RelMath.Lorentzian.CausalDistance.longestChain_saturated"), true);
    assert.deepEqual(distance.properTimes, { "a,b": 1, "b,d": 1, "a,d": 2, "b,c": 0 });
    assert.equal(distance.saturatedFuelAtCardinality, true);
    assert.equal(distance.strictStepAddsTick, true);
    assert.equal(distance.concatReverseTriangle, true);
    assert.equal(distance.generalReverseTriangleAtDiamond, true);
    assert.equal(distance.reverseTriangleAtDiamond, true);
    assert.equal(bdgMobius.sourceModule, "RelMath.Lorentzian.BDGMobiusAction");
    assert.equal(bdgMobius.strictActionAtTop, bdgMobius.bdLayerActionAtTop);
    assert.equal(bdgMobius.fullBdAction, bdgMobius.eventCountPlusStrictActions);
  });

  it("computes the finite sprinkling-average layer sums", () => {
    const receipt = analysis.causal.sprinklingAverageReceipt();

    assert.equal(receipt.kind, "lorentzian.sprinklingAverage:witness");
    assert.deepEqual(receipt.diamondOccupationProfile, [2, 0, 1]);
    assert.equal(receipt.diamondBd2LayerSum, 3);
    assert.equal(receipt.diamondCDiamondLayerSum, -1);
    assert.deepEqual(receipt.bdCoeff2MomentResponse, [0, 0, 2]);
    assert.equal(receipt.pairSprinklingAverage, 3);
    assert.equal(receipt.expectationCommutesWithLayerSum, true);
  });
});

describe("causal RMN terms normalize finite Lorentzian carriers", () => {
  it("normalizes settlement and geometry/topology witnesses", () => {
    const diamond = analysis.causal.settleCausalSet(analysis.causal.diamondCausalSet);
    const independence = analysis.causal.geometryIndependentOfTopology;
    const cone = analysis.causal.coneFieldReceipt(analysis.causal.diamondCausalSet);
    const interval = analysis.causal.causalIntervalReceipt(analysis.causal.diamondCausalSet);
    const alexandrov = analysis.causal.causalAlexandrovReceipt(analysis.causal.diamondCausalSet);
    const topology = analysis.causal.causalAlexandrovTopologyReceipt(analysis.causal.diamondCausalSet);
    const laplacian = analysis.causal.causalLaplacianReceipt(analysis.causal.diamondCausalSet, ["a"]);
    const observation = analysis.causal.lightObservationReceipt(analysis.causal.diamondCausalSet);
    const portrait = analysis.causal.diamondSpectralPortraitReceipt();
    const net = analysis.causal.causalNetReceipt(analysis.causal.diamondCausalSet);
    const report = analysis.causal.paraconsistentConeReportReceipt();
    const microlocal = analysis.causal.microlocalSupportReceipt(analysis.causal.diamondCausalSet, ["a"]);
    const shadow = analysis.causal.myrheimMeyerRealShadowReceipt();
    const bd = analysis.causal.benincasaDowkerReceipt();
    const eh = analysis.causal.einsteinHilbertReceipt();
    const sprinkling = analysis.causal.sprinklingAverageReceipt();
    const wave = analysis.causal.causalDalembertianReceipt();
    const endogenous = analysis.causal.endogenousCoefficientReceipt();
    const mobius = analysis.causal.causalMobiusReceipt();
    const lambek = analysis.causal.lambekCurvatureReceipt();
    const ricci = analysis.causal.lambekRicciReceipt();
    const cohomology = analysis.causal.causalCohomologyReceipt();
    const h2 = analysis.causal.causalCohomologyH2Receipt();
    const hn = analysis.causal.causalCohomologyNReceipt();
    const wiring = analysis.causal.curvatureActionWiringReceipt();
    const distance = analysis.causal.causalDistanceReceipt();
    const bdgMobius = analysis.causal.bdgMobiusActionReceipt();

    assert.deepEqual(evaluateRunTerm(causal.settle, diamond), diamond);
    assert.deepEqual(evaluateRunTerm(causal.geometryIndependentOfTopology, independence), independence);
    assert.deepEqual(evaluateRunTerm(causal.coneField, cone), cone);
    assert.deepEqual(evaluateRunTerm(causal.interval, interval), interval);
    assert.deepEqual(evaluateRunTerm(causal.alexandrov, alexandrov), alexandrov);
    assert.deepEqual(evaluateRunTerm(causal.alexandrovTopology, topology), topology);
    assert.deepEqual(evaluateRunTerm(causal.laplacian, laplacian), laplacian);
    assert.deepEqual(evaluateRunTerm(causal.lightObservation, observation), observation);
    assert.deepEqual(evaluateRunTerm(causal.diamondSpectralPortrait, portrait), portrait);
    assert.deepEqual(evaluateRunTerm(causal.net, net), net);
    assert.deepEqual(evaluateRunTerm(causal.paraconsistentConeReport, report), report);
    assert.deepEqual(evaluateRunTerm(causal.microlocalSupport, microlocal), microlocal);
    assert.deepEqual(evaluateRunTerm(causal.myrheimMeyerRealShadow, shadow), shadow);
    assert.deepEqual(evaluateRunTerm(causal.benincasaDowker, bd), bd);
    assert.deepEqual(evaluateRunTerm(causal.einsteinHilbert, eh), eh);
    assert.deepEqual(evaluateRunTerm(causal.sprinklingAverage, sprinkling), sprinkling);
    assert.deepEqual(evaluateRunTerm(causal.dalembertian, wave), wave);
    assert.deepEqual(evaluateRunTerm(causal.endogenousCoefficients, endogenous), endogenous);
    assert.deepEqual(evaluateRunTerm(causal.mobius, mobius), mobius);
    assert.deepEqual(evaluateRunTerm(causal.lambekCurvature, lambek), lambek);
    assert.deepEqual(evaluateRunTerm(causal.lambekRicci, ricci), ricci);
    assert.deepEqual(evaluateRunTerm(causal.cohomology, cohomology), cohomology);
    assert.deepEqual(evaluateRunTerm(causal.cohomologyH2, h2), h2);
    assert.deepEqual(evaluateRunTerm(causal.cohomologyN, hn), hn);
    assert.deepEqual(evaluateRunTerm(causal.curvatureActionWiring, wiring), wiring);
    assert.deepEqual(evaluateRunTerm(causal.distance, distance), distance);
    assert.deepEqual(evaluateRunTerm(causal.bdgMobiusAction, bdgMobius), bdgMobius);
  });
});
