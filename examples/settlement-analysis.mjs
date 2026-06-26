import assert from "node:assert/strict";

import {
  cell,
  chargeValue,
  claim,
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
}, null, 2));
