import assert from "node:assert/strict";

import {
  cell,
  chargeValue,
  claim,
  collatz,
  evaluateRunTerm,
  graphColoring,
  internalReal,
  mark,
  predicateOfClaim,
  token,
} from "@emsenn/relating";
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

const three = analysis.count(["alpha", "beta", "gamma"]);
const one = analysis.fromNatural(analysis.natOne);
const zero = analysis.intZero;
const matrix = Object.freeze([
  Object.freeze([one, one]),
  Object.freeze([one, zero]),
]);

const determinant = analysis.determinant(matrix);
const rank = analysis.rank(matrix);
const characteristic = analysis.charPoly(matrix);
const reciprocal = analysis.polyReciprocal(characteristic);
const selfReciprocity = analysis.selfReciprocity(characteristic);
const inversion = analysis.inversionSymmetry(characteristic);
const rootLocation = analysis.rootLocation(characteristic);
const pisot = analysis.pisotRoot(characteristic);
const dominantRoot = analysis.dominantRootConvergence(characteristic);
const mahler = analysis.mahlerMeasure(characteristic);
const matrixPisot = analysis.matrixPisot(matrix);

const alpha = token(mark("alpha"));
const beta = token(mark("beta"));
const gamma = token(mark("gamma"));
const relates = predicateOfClaim(claim(mark("relates")));
const section = Object.freeze({
  kind: "meme-topology.section.carrier",
  order: "knowledge",
  bound: "least",
  entries: Object.freeze([
    Object.freeze({
      kind: "meme-topology.section.entry",
      cell: cell(alpha, relates, beta),
      charge: chargeValue("stable"),
    }),
  ]),
});
const graph = analysis.relationGraph(section);
const laplacian = analysis.laplacianOf(graph);
const components = analysis.componentCount(graph);
const spectrum = analysis.spectrumPolynomial(graph);
const trees = analysis.treeCount(graph);
const harmonicFlat = analysis.harmonic(graph, [analysis.ratZero, analysis.ratZero]);
const harmonicSloped = analysis.harmonic(graph, [analysis.ratZero, analysis.ratOne]);
const triangleGraph = analysis.completeGraphWeights(3);
const triangleColoring = analysis.properColoring(triangleGraph, 3);
const triangleFactorMap = analysis.coloringFactorMap(triangleGraph, [0, 1, 2]);
const k4Chromatic = analysis.completeGraphChromatic(4);
const triangleParity = analysis.handshakeDegreeParity(triangleGraph);
const triangleOddWalk = analysis.oddClosedWalkBipartiteObstruction(triangleGraph, 0, [1, 2, 0]);

const cycleSection = Object.freeze({
  kind: "meme-topology.section.carrier",
  order: "knowledge",
  bound: "least",
  entries: Object.freeze([
    Object.freeze({
      kind: "meme-topology.section.entry",
      cell: cell(alpha, relates, beta),
      charge: chargeValue("stable"),
    }),
    Object.freeze({
      kind: "meme-topology.section.entry",
      cell: cell(beta, relates, gamma),
      charge: chargeValue("stable"),
    }),
    Object.freeze({
      kind: "meme-topology.section.entry",
      cell: cell(gamma, relates, alpha),
      charge: chargeValue("stable"),
    }),
  ]),
});
const network = analysis.conservation.flowNetwork(cycleSection);
const circulatingFlow = [analysis.ratOne, analysis.ratOne, analysis.ratOne];
const leakingFlow = [analysis.ratOne, analysis.ratZero, analysis.ratZero];
const conservedFlow = analysis.conservation.conserved(network, circulatingFlow);
const leakingFlowJudgment = analysis.conservation.conserved(network, leakingFlow);
const completedFlow = analysis.conservation.complete(
  network,
  [analysis.ratOne, analysis.ratOne, analysis.ratZero],
  2,
);
const costOne = analysis.graded(analysis.ratOne, "cost");
const costMinusOne = analysis.graded(analysis.ratNegate(analysis.ratOne), "cost");
const latencyOne = analysis.graded(analysis.ratOne, "latency");
const gradedBalanced = analysis.conservation.gradedConserved([costOne, costMinusOne]);
const gradedAmbiguous = analysis.conservation.gradedComplete([costOne, latencyOne]);

const control = analysis.differential.control([
  {
    id: "analysis.exact-carrier-output",
    way: "settlement-analysis",
    severity: "error",
    scopes: ["analysis"],
    claim: "analytical reads return carrier-shaped evidence instead of booleans",
  },
]);
const [exactCarrierNorm] = analysis.differential.normsFor(control, "analysis");
const chargedFinding = analysis.differential.finding(
  exactCarrierNorm,
  "stable",
  "the bench exposes both witness and obstruction carriers",
  [conservedFlow.kind, leakingFlowJudgment.kind],
);

const values = [
  chargeValue("potential"),
  chargeValue("active"),
  chargeValue("stable"),
  chargeValue("stable"),
];
const distribution = analysis.chargeDistribution(values);
const coordinates = analysis.evidenceCoordinates(distribution);
const mixed = analysis.mixedness(
  distribution,
  analysis.chargeDistribution([
    chargeValue("stable"),
    chargeValue("stable"),
    chargeValue("stable"),
    chargeValue("stable"),
  ]),
);
const scalarCancellation = analysis.internalReal.scalarCancellation(
  3,
  analysis.fromRatio(1, 3),
  analysis.fromRatio(2, 3),
);
const logStepBound = analysis.internalReal.logStepBound(8, 2);
const logMonotone = analysis.internalReal.logMonotone(2, 3, 5, 2);
const goldenCassini = analysis.internalReal.goldenCassini(4);
const goldenGap = analysis.internalReal.goldenConvergentLogGap(4, 2);
const metallicGap = analysis.internalReal.metallicConvergentGap(2, 2);
const sqrtApproximation = analysis.internalReal.sqrtSeqApproximation(2, 2);
const metallicRoot = analysis.internalReal.metallicRoot(3);
const edgeColouringEntropy = analysis.internalReal.edgeColouringEntropy;
const triangleColouringEntropy = analysis.internalReal.triangleColouringEntropy(2);
const collatzAffine = analysis.collatz.affineTraceParityWord(7, 5);
const collatzFirstPassage = analysis.collatz.firstPassageWord(["O", "E"]);
const collatzParentBarrier = analysis.collatz.parentBarrier(["O"]);
const collatzShortcut = analysis.collatz.shortcutOddPart(5);
const collatzQuiescence = analysis.collatz.reachedQuiescence(1, 2);
const collatzResidue = analysis.collatz.residueCharacterization(1, 1, 4);
const collatzPadovan = analysis.collatz.padovanLeFibSeq(10);

assert.equal(naturalToNumber(three), 3);
assert.equal(integerToNumber(determinant), -1);
assert.equal(naturalToNumber(rank), 2);
assert.deepEqual(characteristic.map(integerToNumber), [-1, -1, 1]);
assert.deepEqual(reciprocal.map(integerToNumber), [1, -1, -1]);
assert.equal(selfReciprocity.kind, "spectral.polynomialIdentity-obstruction");
assert.equal(inversion.rootIntersection.kind, "spectral.polynomialRootIntersection-obstruction");
assert.equal(integerToNumber(inversion.rootIntersection.resultant), -4);
assert.equal(rootLocation.kind, "spectral.rootLocation:witness");
assert.equal(naturalToNumber(rootLocation.expanding), 1);
assert.equal(naturalToNumber(rootLocation.contracting), 1);
assert.equal(naturalToNumber(rootLocation.neutral), 0);
assert.equal(pisot.kind, "spectral.pisotRoot:witness");
assert.equal(dominantRoot.kind, "spectral.dominantRootConvergence:witness");
assert.equal(rationalToString(dominantRoot.value), "233/144");
assert.equal(mahler.kind, "spectral.mahlerMeasure.dominantRoot:witness");
assert.equal(rationalToString(mahler.value), "233/144");
assert.equal(matrixPisot.roots.kind, "spectral.pisotRoot:witness");
assert.deepEqual(laplacian.map((row) => row.map(integerToNumber)), [[1, -1], [-1, 1]]);
assert.equal(naturalToNumber(components), 1);
assert.deepEqual(spectrum.map(integerToNumber), [0, -2, 1]);
assert.equal(integerToNumber(trees), 1);
assert.equal(harmonicFlat.kind, "meme-analysis.laplacian.harmonic:witness");
assert.equal(harmonicSloped.kind, "meme-analysis.laplacian.harmonic-obstruction");
assert.equal(rationalToString(harmonicSloped.deviation), "-1");
assert.equal(triangleColoring.kind, "meme-analysis.coloring.proper:witness");
assert.equal(analysis.chromaticNumber(triangleGraph), 3);
assert.equal(analysis.countProperColorings(triangleGraph, 3), 6);
assert.equal(triangleFactorMap.kind, "meme-analysis.coloring.factorMap:witness");
assert.equal(k4Chromatic.kind, "meme-analysis.coloring.completeGraphChromatic:witness");
assert.equal(k4Chromatic.chromaticNumber, 4);
assert.equal(triangleParity.kind, "meme-analysis.coloring.handshakeDegreeParity:witness");
assert.equal(triangleOddWalk.kind, "meme-analysis.coloring.oddClosedWalkBipartiteObstruction:witness");
assert.deepEqual(evaluateRunTerm(graphColoring.factorMap, triangleFactorMap), triangleFactorMap);
assert.deepEqual(evaluateRunTerm(graphColoring.completeGraphChromatic, k4Chromatic), k4Chromatic);
assert.equal(network.edges.length, 3);
assert.equal(conservedFlow.kind, "meme-analysis.conservation.conserved:witness");
assert.equal(leakingFlowJudgment.kind, "meme-analysis.conservation.conserved-obstruction");
assert.deepEqual(leakingFlowJudgment.divergence.map(rationalToString), ["-1", "1", "0"]);
assert.equal(completedFlow.kind, "meme-analysis.conservation.completion:witness");
assert.deepEqual(completedFlow.flow.map(rationalToString), ["1", "1", "1"]);
assert.equal(gradedBalanced.kind, "meme-analysis.conservation.graded:witness");
assert.equal(gradedAmbiguous.kind, "meme-analysis.conservation.graded-completion-obstruction");
assert.equal(gradedAmbiguous.reason, "ambiguous");
assert.equal(chargedFinding.charge, "stable");
assert.equal(naturalToNumber(distribution.total), 4);
assert.equal(rationalToString(coordinates.truth), "3/4");
assert.equal(rationalToString(coordinates.falsity), "3/4");
assert.equal(rationalToString(coordinates.conflict), "1/2");
assert.equal(mixed.kind, "meme-analysis.evidence.mixedness");
assert.equal(scalarCancellation.kind, "internalReal.scalarCancellation:witness");
assert.equal(logStepBound.kind, "internalReal.logStepBound:witness");
assert.equal(rationalToString(logStepBound.rhs), "10/3");
assert.equal(logMonotone.kind, "internalReal.logMonotone:witness");
assert.equal(goldenCassini.kind, "internalReal.goldenCassini:witness");
assert.equal(goldenGap.kind, "internalReal.goldenConvergentLogGap:witness");
assert.equal(metallicGap.kind, "internalReal.metallicConvergentGap:witness");
assert.equal(sqrtApproximation.kind, "internalReal.sqrtSeqApproximation:witness");
assert.equal(rationalToString(sqrtApproximation.approximation), "4/3");
assert.equal(metallicRoot.kind, "internalReal.metallicRoot:witness");
assert.equal(metallicRoot.radicand, 13);
assert.deepEqual(evaluateRunTerm(internalReal.sqrtSeqApproximation, sqrtApproximation), sqrtApproximation);
assert.deepEqual(evaluateRunTerm(internalReal.metallicRoot, metallicRoot), metallicRoot);
assert.equal(edgeColouringEntropy.kind, "internalReal.edgeColouringEntropy:witness");
assert.equal(triangleColouringEntropy.kind, "internalReal.triangleColouringEntropy:approximation");
assert.equal(collatzAffine.kind, "collatz.affineTraceParityWord:witness");
assert.equal(collatzAffine.holds, true);
assert.equal(collatzFirstPassage.kind, "collatz.firstPassage:witness");
assert.equal(collatzParentBarrier.kind, "collatz.parentBarrier:witness");
assert.equal(collatzShortcut.kind, "collatz.shortcutOddPart:witness");
assert.equal(collatzQuiescence.kind, "collatz.reachedQuiescence:witness");
assert.equal(collatzResidue.kind, "collatz.residueCharacterization:witness");
assert.equal(collatzPadovan.kind, "collatz.padovanLeFibSeq:witness");
assert.deepEqual(evaluateRunTerm(collatz.affineTraceParityWord, collatzAffine), collatzAffine);
assert.deepEqual(evaluateRunTerm(collatz.padovanLeFibSeq, collatzPadovan), collatzPadovan);

console.log(JSON.stringify({
  product: "relating.settlement-analysis",
  exact: {
    count: naturalToNumber(three),
    determinant: integerToNumber(determinant),
    rank: naturalToNumber(rank),
    characteristicPolynomial: characteristic.map(integerToNumber),
  },
  spectral: {
    polynomial: characteristic.map(integerToNumber),
    reciprocal: reciprocal.map(integerToNumber),
    selfReciprocity: selfReciprocity.kind,
    reciprocalIntersection: {
      kind: inversion.rootIntersection.kind,
      resultant: integerToNumber(inversion.rootIntersection.resultant),
    },
    rootLocation: {
      kind: rootLocation.kind,
      expanding: naturalToNumber(rootLocation.expanding),
      contracting: naturalToNumber(rootLocation.contracting),
      neutral: naturalToNumber(rootLocation.neutral),
    },
    pisot: pisot.kind,
    dominantRoot: {
      kind: dominantRoot.kind,
      value: rationalToString(dominantRoot.value),
    },
    mahler: {
      kind: mahler.kind,
      value: rationalToString(mahler.value),
    },
    matrixPisot: matrixPisot.roots.kind,
  },
  graph: {
    terms: graph.terms.length,
    laplacian: laplacian.map((row) => row.map(integerToNumber)),
    components: naturalToNumber(components),
    spectrumPolynomial: spectrum.map(integerToNumber),
    spanningTrees: integerToNumber(trees),
    harmonicWitness: harmonicFlat.kind,
    harmonicObstruction: {
      kind: harmonicSloped.kind,
      deviation: rationalToString(harmonicSloped.deviation),
    },
    coloring: {
      triangleChromaticNumber: analysis.chromaticNumber(triangleGraph),
      triangleProperColoringsAt3: analysis.countProperColorings(triangleGraph, 3),
      factorMap: evaluateRunTerm(graphColoring.factorMap, triangleFactorMap).kind,
      k4RequiresFour: evaluateRunTerm(graphColoring.completeGraphChromatic, k4Chromatic).kind,
      oddDegreeCountEven: triangleParity.oddDegreeCountEven,
      oddClosedWalkObstruction: triangleOddWalk.kind,
    },
  },
  conservation: {
    edges: network.edges.length,
    circulation: conservedFlow.kind,
    leak: {
      kind: leakingFlowJudgment.kind,
      divergence: leakingFlowJudgment.divergence.map(rationalToString),
    },
    completed: {
      kind: completedFlow.kind,
      inferred: rationalToString(completedFlow.inferred),
      flow: completedFlow.flow.map(rationalToString),
    },
    graded: {
      balanced: gradedBalanced.kind,
      ambiguousCompletion: gradedAmbiguous.reason,
    },
  },
  differential: {
    applicableNorms: analysis.differential.normsFor(control, "analysis").length,
    finding: {
      norm: chargedFinding.norm,
      charge: chargedFinding.charge,
      severity: chargedFinding.severity,
    },
  },
  evidence: {
    total: naturalToNumber(distribution.total),
    truth: rationalToString(coordinates.truth),
    falsity: rationalToString(coordinates.falsity),
    knowledge: rationalToString(coordinates.knowledge),
    conflict: rationalToString(coordinates.conflict),
    mixedness: mixed.relation,
  },
  internalReal: {
    scalarCancellation: scalarCancellation.kind,
    logStepBound: {
      kind: logStepBound.kind,
      lhs: rationalToString(logStepBound.lhs),
      rhs: rationalToString(logStepBound.rhs),
    },
    logMonotone: logMonotone.kind,
    goldenCassini: {
      kind: goldenCassini.kind,
      left: goldenCassini.left,
      right: goldenCassini.right,
    },
    goldenConvergentLogGap: {
      kind: goldenGap.kind,
      fibonacci: goldenGap.fibonacci,
      square: goldenGap.square,
      bound: rationalToString(goldenGap.bound),
    },
    metallicConvergentGap: {
      kind: metallicGap.kind,
      denominator: metallicGap.denominator,
      gap: rationalToString(metallicGap.gap),
      telescopingBound: rationalToString(metallicGap.telescopingBound),
    },
    sqrtSeqApproximation: {
      kind: evaluateRunTerm(internalReal.sqrtSeqApproximation, sqrtApproximation).kind,
      approximation: rationalToString(sqrtApproximation.approximation),
      square: rationalToString(sqrtApproximation.square),
      gap: rationalToString(sqrtApproximation.gap),
      gapBound: rationalToString(sqrtApproximation.gapBound),
    },
    metallicRoot: {
      kind: evaluateRunTerm(internalReal.metallicRoot, metallicRoot).kind,
      radicand: metallicRoot.radicand,
      leftConstant: metallicRoot.leftConstant,
      rightConstant: metallicRoot.rightConstant,
      sqrtCoefficient: metallicRoot.sqrtCoefficient,
    },
    edgeColouringEntropy: {
      kind: edgeColouringEntropy.kind,
      properColourings: edgeColouringEntropy.properColourings,
      entropy: rationalToString(edgeColouringEntropy.entropy),
    },
    triangleColouringEntropy: {
      kind: triangleColouringEntropy.kind,
      properColourings: triangleColouringEntropy.properColourings,
      entropyApprox: rationalToString(triangleColouringEntropy.entropyApprox),
    },
  },
  collatz: {
    affineTrace: {
      kind: evaluateRunTerm(collatz.affineTraceParityWord, collatzAffine).kind,
      word: collatzAffine.word,
      trace: collatzAffine.trace,
      iterate: collatzAffine.iterate,
      holds: collatzAffine.holds,
    },
    firstPassage: collatzFirstPassage.kind,
    parentBarrier: {
      kind: collatzParentBarrier.kind,
      D: collatzParentBarrier.D,
      M: collatzParentBarrier.M,
    },
    shortcutOddPart: {
      exponent: collatzShortcut.exponent,
      oddPart: collatzShortcut.oddPart,
    },
    quiescence: collatzQuiescence.kind,
    residue: {
      kind: collatzResidue.kind,
      residue: collatzResidue.residue,
      equivalent: collatzResidue.equivalent,
    },
    padovan: {
      kind: evaluateRunTerm(collatz.padovanLeFibSeq, collatzPadovan).kind,
      padovan: collatzPadovan.padovan,
      fibSeq: collatzPadovan.fibSeq,
    },
  },
}, null, 2));
