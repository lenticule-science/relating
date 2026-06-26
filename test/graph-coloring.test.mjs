/**
 * Contract: finite graph-coloring/chromatic/extremal reads mirror the green
 * RelMath combinatorics surface and expose RMN-normalizable carrier judgments.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { evaluateRunTerm, graphColoring } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

describe("analysis coloring: RelMath finite graph-coloring reads", () => {
  it("computes proper colorings, chromatic numbers, and complete-graph counts", () => {
    const edge = analysis.completeGraphWeights(2);
    const triangle = analysis.completeGraphWeights(3);
    const k4 = analysis.completeGraphWeights(4);

    const edgeOne = analysis.properColoring(edge, 1);
    const edgeTwo = analysis.properColoring(edge, 2);
    const triangleThree = analysis.properColoring(triangle, 3);

    assert.equal(edgeOne.kind, "meme-analysis.coloring.proper-obstruction");
    assert.equal(edgeTwo.kind, "meme-analysis.coloring.proper:witness");
    assert.deepEqual(edgeTwo.colors, [0, 1]);
    assert.equal(triangleThree.kind, "meme-analysis.coloring.proper:witness");
    assert.equal(analysis.chromaticNumber(edge), 2);
    assert.equal(analysis.chromaticNumber(triangle), 3);
    assert.equal(analysis.chromaticNumber(k4), 4);
    assert.equal(analysis.countProperColorings(triangle, 3), 6);
    assert.equal(analysis.countProperColorings(k4, 4), 24);
  });

  it("models proper coloring as a factor map into a complete palette graph", () => {
    const triangle = analysis.completeGraphWeights(3);
    const witness = analysis.coloringFactorMap(triangle, [0, 1, 2]);
    const obstruction = analysis.coloringFactorMap(triangle, [0, 0, 1]);

    assert.equal(witness.kind, "meme-analysis.coloring.factorMap:witness");
    assert.equal(witness.proper, true);
    assert.equal(witness.graphHom, true);
    assert.equal(witness.equivalent, true);

    assert.equal(obstruction.kind, "meme-analysis.coloring.factorMap-obstruction");
    assert.equal(obstruction.reason, "not-proper");
    assert.equal(obstruction.proper, false);
    assert.equal(obstruction.graphHom, false);
    assert.equal(obstruction.equivalent, true);
  });

  it("models complete-graph extremal chromatic witnesses and FOUR as K4", () => {
    const k4 = analysis.completeGraphChromatic(4);

    assert.equal(k4.kind, "meme-analysis.coloring.completeGraphChromatic:witness");
    assert.equal(k4.vertexCount, 4);
    assert.equal(k4.chromaticNumber, 4);
    assert.equal(k4.selfColoring.kind, "meme-analysis.coloring.proper:witness");
    assert.equal(k4.properColoringCountAtSelfPalette, 24);
    assert.equal(k4.lowerBoundByInjection, true);
    assert.equal(k4.requiresAllColours, true);
    assert.deepEqual(analysis.k4RequiresFour, k4);
  });

  it("models handshake parity and odd closed walk obstruction to bipartiteness", () => {
    const edge = analysis.completeGraphWeights(2);
    const triangle = analysis.completeGraphWeights(3);
    const selfLoop = Object.freeze([Object.freeze([analysis.intOne])]);

    const edgeParity = analysis.handshakeDegreeParity(edge);
    const triangleParity = analysis.handshakeDegreeParity(triangle);
    const selfLoopObstruction = analysis.handshakeDegreeParity(selfLoop);
    const oddWalk = analysis.oddClosedWalkBipartiteObstruction(triangle, 0, [1, 2, 0]);

    assert.equal(edgeParity.kind, "meme-analysis.coloring.handshakeDegreeParity:witness");
    assert.deepEqual(edgeParity.degrees, [1, 1]);
    assert.equal(edgeParity.degreeSum, 2);
    assert.equal(edgeParity.oddDegreeCount, 2);
    assert.equal(edgeParity.oddDegreeCountEven, true);

    assert.equal(triangleParity.kind, "meme-analysis.coloring.handshakeDegreeParity:witness");
    assert.deepEqual(triangleParity.degrees, [2, 2, 2]);
    assert.equal(triangleParity.degreeSumEven, true);
    assert.equal(triangleParity.oddDegreeCountEven, true);

    assert.equal(selfLoopObstruction.kind, "meme-analysis.coloring.handshakeDegreeParity-obstruction");
    assert.equal(selfLoopObstruction.reason, "not-irreflexive");

    assert.equal(oddWalk.kind, "meme-analysis.coloring.oddClosedWalkBipartiteObstruction:witness");
    assert.equal(oddWalk.validWalk, true);
    assert.equal(oddWalk.closed, true);
    assert.equal(oddWalk.oddLength, true);
    assert.equal(oddWalk.notBipartite, true);
  });

  it("finds a monochromatic triangle in every finite K6 Ramsey coloring", () => {
    const coloring = Object.freeze(Array.from({ length: 6 }, (_, row) =>
      Object.freeze(Array.from({ length: 6 }, (_, column) => row === column ? false : column % 2 === 0))));

    const ramsey = analysis.ramseyThreeThree(coloring);

    assert.equal(ramsey.kind, "meme-analysis.ramsey.r33:witness");
    assert.equal(ramsey.vertexCount, 6);
    assert.equal(ramsey.edges.every((edge) => edge === ramsey.color), true);
  });
});

describe("graphColoring RMN terms normalize finite graph-coloring carriers", () => {
  it("normalizes graph-coloring witnesses and obstructions", () => {
    const edge = analysis.completeGraphWeights(2);
    const triangle = analysis.completeGraphWeights(3);

    const proper = analysis.properColoring(edge, 2);
    const properObstruction = analysis.properColoring(edge, 1);
    const factor = analysis.coloringFactorMap(triangle, [0, 1, 2]);
    const complete = analysis.completeGraphChromatic(4);
    const parity = analysis.handshakeDegreeParity(triangle);
    const oddWalk = analysis.oddClosedWalkBipartiteObstruction(triangle, 0, [1, 2, 0]);
    const ramsey = analysis.ramseyThreeThree(Object.freeze(Array.from({ length: 6 }, () =>
      Object.freeze(Array.from({ length: 6 }, () => true)))));

    assert.deepEqual(evaluateRunTerm(graphColoring.properColoring, proper), proper);
    assert.deepEqual(evaluateRunTerm(graphColoring.properColoring, properObstruction), properObstruction);
    assert.deepEqual(evaluateRunTerm(graphColoring.factorMap, factor), factor);
    assert.deepEqual(evaluateRunTerm(graphColoring.completeGraphChromatic, complete), complete);
    assert.deepEqual(evaluateRunTerm(graphColoring.handshakeDegreeParity, parity), parity);
    assert.deepEqual(evaluateRunTerm(graphColoring.oddClosedWalkBipartiteObstruction, oddWalk), oddWalk);
    assert.deepEqual(evaluateRunTerm(graphColoring.ramseyThreeThree, ramsey), ramsey);
  });
});
