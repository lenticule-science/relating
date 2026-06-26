/**
 * Contract: finite predication fibration/Yoneda/temporal/relative-ideal
 * witnesses are derived from existing predication-site carriers and expose
 * RMN-normalizable judgments.
 */
import { describe, it } from "node:test";
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
const alphaBetaSig = signatureOfCell(alphaSupportsBeta);
const betaAlphaSig = signatureOfCell(betaSupportsAlpha);
const alphaBetaKey = cellSignatureKey(alphaBetaSig);
const betaAlphaKey = cellSignatureKey(betaAlphaSig);

const host = finiteValuationFromCells([alphaSupportsBeta, betaSupportsAlpha], {
  [alphaBetaKey]: "potential",
  [betaAlphaKey]: "active",
});
const otherHost = finiteValuationFromCells([alphaSupportsBeta, betaSupportsAlpha], {
  [alphaBetaKey]: "active",
  [betaAlphaKey]: "stable",
});
const swapIntoHost = embedding([[alphaBetaSig, betaAlphaSig]]);

describe("predicating fibration: finite arrows-first and reindex reads", () => {
  it("recovers predication objects from incoming arrows in the site-derived category", () => {
    const category = predicationCategoryShadow(site);
    const same = yonedaRecovery(category, alphaBetaKey, alphaBetaKey);
    const distinct = yonedaRecovery(category, alphaBetaKey, betaAlphaKey);

    assert.equal(category.kind, "predication.categoryShadow");
    assert.ok(category.arrows.some((arrow) => arrow.generator === "converse"));
    assert.equal(same.kind, "predication.yonedaRecovery:witness");
    assert.equal(same.sameObject, true);
    assert.equal(same.sameIncomingBundle, true);
    assert.equal(same.objectRecoveredFromArrows, true);
    assert.equal(distinct.sameObject, false);
    assert.equal(distinct.sameIncomingBundle, false);
    assert.equal(distinct.objectRecoveredFromArrows, true);
  });

  it("models fibration reindexing as finite precomposition and preserves bilattice operations", () => {
    const reindexed = reindexWitness(swapIntoHost, host);
    const hom = reindexBilatticeHomomorphism(swapIntoHost, host, otherHost);
    const transpose = grothendieckTranspose(swapIntoHost, host);

    assert.equal(reindexed.kind, "predication.reindex:witness");
    assert.equal(reindexed.resource.values[alphaBetaKey], "active");
    assert.equal(reindexed.cellwise, true);

    assert.equal(hom.kind, "predication.reindexBilatticeHom:witness");
    assert.equal(hom.preservesMeetK, true);
    assert.equal(hom.preservesJoinK, true);
    assert.equal(hom.preservesMeetT, true);
    assert.equal(hom.preservesJoinT, true);
    assert.equal(hom.preservesNegation, true);
    assert.equal(hom.preservesFusion, true);
    assert.equal(hom.preservesResidual, true);

    assert.equal(transpose.kind, "predication.grothendieckTranspose:witness");
    assert.equal(transpose.fiberUniform, true);
    assert.equal(transpose.identityReindex, true);
    assert.equal(transpose.compositeReindex, true);
    assert.equal(transpose.homomorphismValued, true);
  });

  it("models temporal two-category and theory-relative ideal finite witnesses", () => {
    const source = temporalZeroCell(2, "resource");
    const middle = temporalZeroCell(1, "intermediate");
    const target = temporalZeroCell(0, "host");
    const left = temporalOneCell(source, middle, "include-resource");
    const right = temporalOneCell(middle, target, "include-host");
    const temporal = temporalTwoCategory(left, right);
    const ideal = relativeIdeal(swapIntoHost, host);

    assert.equal(temporal.kind, "predication.temporalTwoCategory:witness");
    assert.equal(temporal.leftIdentity, true);
    assert.equal(temporal.rightIdentity, true);
    assert.equal(temporal.associativity, true);
    assert.equal(temporal.twoCellCategory, true);
    assert.equal(temporal.beckChevalley, true);

    assert.equal(ideal.kind, "predication.relativeIdeal:witness");
    assert.equal(ideal.ideal.values[alphaBetaKey], "active");
    assert.equal(ideal.isReindex, true);
    assert.equal(ideal.cellwise, true);
    assert.equal(ideal.boundedByTop, true);
    assert.equal(ideal.noNewContent, true);
  });
});

describe("predicating RMN terms normalize finite fibration carriers", () => {
  it("normalizes predicating witness carriers", () => {
    const category = predicationCategoryShadow(site);
    const yoneda = yonedaRecovery(category, alphaBetaKey, betaAlphaKey);
    const reindexed = reindexWitness(swapIntoHost, host);
    const hom = reindexBilatticeHomomorphism(swapIntoHost, host, otherHost);
    const transpose = grothendieckTranspose(swapIntoHost, host);
    const temporal = temporalTwoCategory(
      temporalOneCell(temporalZeroCell(2, "resource"), temporalZeroCell(1, "intermediate"), "include-resource"),
      temporalOneCell(temporalZeroCell(1, "intermediate"), temporalZeroCell(0, "host"), "include-host"),
    );
    const ideal = relativeIdeal(swapIntoHost, host);

    assert.deepEqual(evaluateRunTerm(predicating.yonedaRecovery, yoneda), yoneda);
    assert.deepEqual(evaluateRunTerm(predicating.reindex, reindexed), reindexed);
    assert.deepEqual(evaluateRunTerm(predicating.reindexBilatticeHomomorphism, hom), hom);
    assert.deepEqual(evaluateRunTerm(predicating.grothendieckTranspose, transpose), transpose);
    assert.deepEqual(evaluateRunTerm(predicating.temporalTwoCategory, temporal), temporal);
    assert.deepEqual(evaluateRunTerm(predicating.relativeIdeal, ideal), ideal);
  });
});
