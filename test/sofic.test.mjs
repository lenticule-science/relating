/**
 * Contract: finite sofic-shift reads mirror RelMath.Aperiodic.SoficShift and
 * expose RMN-normalizable carrier judgments.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { evaluateRunTerm, sofic } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

describe("analysis.sofic: finite symbolic-dynamics reads", () => {
  it("checks SFT paths and 1-block factor images", () => {
    const path = analysis.sofic.path(analysis.sofic.goldenMeanGraph, [0, 1, 0]);
    const obstruction = analysis.sofic.path(analysis.sofic.goldenMeanGraph, [0, 1, 1]);
    const image = analysis.sofic.soficImage(analysis.sofic.goldenMeanGraph, [2, 3], [0, 1, 0]);

    assert.equal(path.kind, "sofic.path:witness");
    assert.equal(path.transitions, 2);
    assert.equal(obstruction.kind, "sofic.path-obstruction");
    assert.equal(obstruction.failedAt, 1);
    assert.deepEqual(obstruction.edge, [1, 1]);
    assert.equal(image.kind, "sofic.image:witness");
    assert.deepEqual(image.image, [2, 3, 2]);
  });

  it("carries the golden-mean and Fibonacci substitution witnesses", () => {
    const forbidden = analysis.sofic.goldenForbidsBB([0]);
    const fib = analysis.sofic.fibSubstituteGolden([0, 1, 0]);

    assert.equal(forbidden.kind, "sofic.goldenMean.forbidsBB:witness");
    assert.deepEqual(forbidden.word, [1, 1, 0]);
    assert.equal(forbidden.path.kind, "sofic.path-obstruction");
    assert.deepEqual(analysis.sofic.fibSubstitute([0, 1, 0]), [0, 1, 0, 0, 1]);
    assert.equal(fib.kind, "sofic.fibonacciSubstitution.golden:witness");
    assert.deepEqual(fib.substituted, [0, 1, 0, 0, 1]);
    assert.equal(fib.path.kind, "sofic.path:witness");
  });

  it("carries the decorated deep-sofic cover for golden-admissible Fibonacci words", () => {
    const deep = analysis.sofic.fibDeepSofic([0, 1, 0]);
    const badSource = analysis.sofic.fibDeepSofic([1, 1]);

    assert.equal(deep.kind, "sofic.fibonacciSubstitution.deep:witness");
    assert.deepEqual(deep.decorated, [0, 1, 2, 0, 1]);
    assert.deepEqual(deep.sofic.image, deep.substituted);
    assert.equal(deep.forgetsToSubstitution, true);
    assert.equal(badSource.kind, "sofic.fibonacciSubstitution.deep-obstruction");
    assert.equal(badSource.reason, "source");
  });

  it("carries finite local rules across graph factors, colorings, and sofic images", () => {
    const source = Object.freeze([
      Object.freeze([false, true, false]),
      Object.freeze([false, false, true]),
      Object.freeze([false, false, false]),
    ]);
    const target = analysis.sofic.completePaletteGraph(2);
    const factor = Object.freeze([0, 1, 0]);
    const word = Object.freeze([0, 1, 2]);

    const hom = analysis.sofic.graphHom(source, target, factor);
    const badHom = analysis.sofic.graphHom(target, target, [0, 0]);
    const mapped = analysis.sofic.mapPathByGraphHom(source, target, factor, word);
    const receipt = analysis.sofic.finiteLocalRuleReceipt();

    assert.equal(hom.kind, "sofic.graphHom:witness");
    assert.equal(hom.preservesEdges, true);
    assert.equal(badHom.kind, "sofic.graphHom-obstruction");
    assert.equal(badHom.reason, "edge");
    assert.deepEqual(analysis.sofic.composeFactorMaps(factor, [1, 0]), [1, 0, 1]);

    assert.equal(mapped.kind, "sofic.graphHom.mapPath:witness");
    assert.deepEqual(mapped.targetWord, [0, 1, 0]);
    assert.equal(mapped.targetPath.kind, "sofic.path:witness");

    assert.equal(receipt.kind, "sofic.finiteLocalRule:witness");
    assert.equal(receipt.sourceModule, "RelMath.Aperiodic.FiniteLocalRule");
    assert.equal(receipt.identity.preservesEdges, true);
    assert.deepEqual(receipt.composedHom.factor, [1, 0, 1]);
    assert.deepEqual(receipt.mappedPath.targetWord, [0, 1, 0]);
    assert.equal(receipt.colorPullback.fourColouringPullback, true);
    assert.deepEqual(receipt.colorPullback.pulledBackColors, [0, 1, 0]);
    assert.deepEqual(receipt.properColoringPath.targetWord, [0, 1, 0]);
    assert.deepEqual(receipt.factorOfSftIsSofic.image, [0, 1, 0]);
  });
});

describe("sofic RMN terms normalize finite symbolic-dynamics carriers", () => {
  it("normalizes sofic witness and obstruction receipts", () => {
    const path = analysis.sofic.path(analysis.sofic.goldenMeanGraph, [0, 1, 0]);
    const image = analysis.sofic.soficImage(analysis.sofic.goldenMeanGraph, [2, 3], [0, 1, 0]);
    const forbidden = analysis.sofic.goldenForbidsBB();
    const fib = analysis.sofic.fibSubstituteGolden([0, 1, 0]);
    const deep = analysis.sofic.fibDeepSofic([0, 1, 0]);
    const localRule = analysis.sofic.finiteLocalRuleReceipt();

    assert.deepEqual(evaluateRunTerm(sofic.path, path), path);
    assert.deepEqual(evaluateRunTerm(sofic.image, image), image);
    assert.deepEqual(evaluateRunTerm(sofic.goldenForbidsBB, forbidden), forbidden);
    assert.deepEqual(evaluateRunTerm(sofic.fibSubstituteGolden, fib), fib);
    assert.deepEqual(evaluateRunTerm(sofic.fibDeepSofic, deep), deep);
    assert.deepEqual(evaluateRunTerm(sofic.finiteLocalRule, localRule), localRule);
  });
});
