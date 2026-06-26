import assert from "node:assert/strict";

import {
  mark,
  token,
  claim,
  predicateOfClaim,
  cell,
  predicationSite,
  signatureOfCell,
  cellSignatureKey,
  predicationCategoryShadow,
  yonedaRecovery,
  finiteValuationFromCells,
  embedding,
  reindexWitness,
  reindexBilatticeHomomorphism,
  grothendieckTranspose,
  temporalZeroCell,
  temporalOneCell,
  temporalTwoCategory,
  relativeIdeal,
  evaluateRunTerm,
  predicating,
} from "@emsenn/relating";

const alpha = token(mark("alpha"));
const beta = token(mark("beta"));
const supports = predicateOfClaim(claim(mark("supports")));
const alphaSupportsBeta = cell(alpha, supports, beta);
const betaSupportsAlpha = cell(beta, supports, alpha);
const site = predicationSite([alphaSupportsBeta, betaSupportsAlpha]);
const alphaBeta = signatureOfCell(alphaSupportsBeta);
const betaAlpha = signatureOfCell(betaSupportsAlpha);
const alphaBetaKey = cellSignatureKey(alphaBeta);
const betaAlphaKey = cellSignatureKey(betaAlpha);

const category = predicationCategoryShadow(site);
const yoneda = yonedaRecovery(category, alphaBetaKey, betaAlphaKey);
const host = finiteValuationFromCells([alphaSupportsBeta, betaSupportsAlpha], {
  [alphaBetaKey]: "potential",
  [betaAlphaKey]: "active",
});
const otherHost = finiteValuationFromCells([alphaSupportsBeta, betaSupportsAlpha], {
  [alphaBetaKey]: "active",
  [betaAlphaKey]: "stable",
});
const includeOpposite = embedding([[alphaBeta, betaAlpha]]);
const reindexed = reindexWitness(includeOpposite, host);
const hom = reindexBilatticeHomomorphism(includeOpposite, host, otherHost);
const transpose = grothendieckTranspose(includeOpposite, host);
const temporal = temporalTwoCategory(
  temporalOneCell(temporalZeroCell(2, "resource"), temporalZeroCell(1, "intermediate"), "include-resource"),
  temporalOneCell(temporalZeroCell(1, "intermediate"), temporalZeroCell(0, "host"), "include-host"),
);
const ideal = relativeIdeal(includeOpposite, host);

assert.equal(yoneda.objectRecoveredFromArrows, true);
assert.equal(reindexed.resource.values[alphaBetaKey], "active");
assert.equal(hom.preservesResidual, true);
assert.equal(transpose.compositeReindex, true);
assert.equal(temporal.beckChevalley, true);
assert.equal(ideal.noNewContent, true);
assert.deepEqual(evaluateRunTerm(predicating.yonedaRecovery, yoneda), yoneda);
assert.deepEqual(evaluateRunTerm(predicating.reindex, reindexed), reindexed);
assert.deepEqual(evaluateRunTerm(predicating.reindexBilatticeHomomorphism, hom), hom);
assert.deepEqual(evaluateRunTerm(predicating.grothendieckTranspose, transpose), transpose);
assert.deepEqual(evaluateRunTerm(predicating.temporalTwoCategory, temporal), temporal);
assert.deepEqual(evaluateRunTerm(predicating.relativeIdeal, ideal), ideal);

console.log(JSON.stringify({
  product: "relating.predicating-fibration",
  category: {
    objects: category.objects.length,
    arrows: category.arrows.length,
    hasConverse: category.arrows.some((arrow) => arrow.generator === "converse"),
  },
  yoneda: {
    left: yoneda.left,
    right: yoneda.right,
    recovered: yoneda.objectRecoveredFromArrows,
    sameIncomingBundle: yoneda.sameIncomingBundle,
  },
  fibration: {
    reindex: reindexed.kind,
    resourceValue: reindexed.resource.values[alphaBetaKey],
    bilatticeHom: hom.kind,
    grothendieckTranspose: transpose.kind,
  },
  temporal: {
    witness: temporal.kind,
    beckChevalley: temporal.beckChevalley,
  },
  relativeIdeal: {
    witness: ideal.kind,
    noNewContent: ideal.noNewContent,
    idealValue: ideal.ideal.values[alphaBetaKey],
  },
}, null, 2));
