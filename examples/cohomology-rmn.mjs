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

const cycleCells = [
  cell(alpha, relates, beta),
  cell(beta, relates, gamma),
  cell(gamma, relates, alpha),
];

const cohomology = cohomologyOfCells(cycleCells);
const laplacian = cohomologyLaplacianOfCells(cycleCells);
const bigraded = bigradedCohomologyOfCharges([
  chargeValue("potential"),
  chargeValue("active"),
  chargeValue("stable"),
]);

assert.equal(naturalToNumber(cohomology.zeroCohomology.rank), 1);
assert.equal(naturalToNumber(cohomology.firstCohomology.rank), 1);
assert.equal(laplacian.firstCohomologyCokernelRank.kind, "predication.cohomology.rankIdentity:witness");
assert.equal(bigraded.collapse.kind, "predication.bigradedCohomology.collapse-obstruction");
assert.deepEqual(evaluateRunTerm(cohomologyTerms.carrier, cohomology), jsonCarrier(cohomology));
assert.deepEqual(evaluateRunTerm(cohomologyTerms.laplacian, laplacian), jsonCarrier(laplacian));
assert.deepEqual(evaluateRunTerm(cohomologyTerms.bigraded, bigraded), jsonCarrier(bigraded));

console.log(JSON.stringify({
  product: "relating.cohomology-rmn",
  finiteComplex: {
    cells: cohomology.cells.length,
    entities: cohomology.entities.length,
    h0Rank: naturalToNumber(cohomology.zeroCohomology.rank),
    h1Rank: naturalToNumber(cohomology.firstCohomology.rank),
    h1Vanishing: cohomology.firstCohomology.vanishing.kind,
  },
  laplacian: {
    incidenceRank: naturalToNumber(laplacian.incidenceRank),
    laplacianRank: naturalToNumber(laplacian.laplacianRank),
    h0KernelIdentity: evaluateRunTerm(cohomologyTerms.rankIdentity, laplacian.zeroCohomologyKernelRank).kind,
    h1CokernelIdentity: evaluateRunTerm(cohomologyTerms.rankIdentity, laplacian.firstCohomologyCokernelRank).kind,
  },
  bigraded: {
    truthRow: bigraded.truth,
    contradictionRow: bigraded.contradiction,
    collapse: evaluateRunTerm(cohomologyTerms.bigraded, bigraded).collapse.kind,
  },
}, null, 2));
