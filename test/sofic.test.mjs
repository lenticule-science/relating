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
});

describe("sofic RMN terms normalize finite symbolic-dynamics carriers", () => {
  it("normalizes sofic witness and obstruction receipts", () => {
    const path = analysis.sofic.path(analysis.sofic.goldenMeanGraph, [0, 1, 0]);
    const image = analysis.sofic.soficImage(analysis.sofic.goldenMeanGraph, [2, 3], [0, 1, 0]);
    const forbidden = analysis.sofic.goldenForbidsBB();
    const fib = analysis.sofic.fibSubstituteGolden([0, 1, 0]);
    const deep = analysis.sofic.fibDeepSofic([0, 1, 0]);

    assert.deepEqual(evaluateRunTerm(sofic.path, path), path);
    assert.deepEqual(evaluateRunTerm(sofic.image, image), image);
    assert.deepEqual(evaluateRunTerm(sofic.goldenForbidsBB, forbidden), forbidden);
    assert.deepEqual(evaluateRunTerm(sofic.fibSubstituteGolden, fib), fib);
    assert.deepEqual(evaluateRunTerm(sofic.fibDeepSofic, deep), deep);
  });
});
