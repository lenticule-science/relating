import test from "node:test";
import assert from "node:assert/strict";
import { chargeValue, induce, mark, utterance } from "../index.mjs";
import { ratEqual, ratAdd, ratIsZero } from "../algebra/index.mjs";
import { fromRatio, toCount } from "../codecs/index.mjs";
import {
  absoluteContinuity,
  chargeDistribution,
  chargeJoint,
  chargeTriple,
  coordinateDistortion,
  evidenceCoordinates,
  evidenceDelta,
  expectedDistortion,
  independence,
  informationDistribution,
  mixedness,
  screeningOff,
} from "./evidence.mjs";
import {
  entropyBitsAtBoundary,
  klBitsAtBoundary,
  mutualInformationBitsAtBoundary,
} from "../codecs/evidence.mjs";

const absurd = chargeValue("absurd");
const potential = chargeValue("potential");
const active = chargeValue("active");
const stable = chargeValue("stable");

test("a charge distribution is an exact histogram over the canonical support", () => {
  const distribution = chargeDistribution([potential, potential, active, stable]);
  assert.equal(toCount(distribution.total), 4);
  assert.deepEqual(distribution.bins.map((bin) => toCount(bin.count)), [0, 2, 1, 1]);
  assert.ok(ratEqual(distribution.bins[1]!.probability, fromRatio(1, 2)));
  assert.ok(ratEqual(distribution.bins[2]!.probability, fromRatio(1, 4)));
  assert.ok(Object.isFrozen(distribution) && Object.isFrozen(distribution.bins));
  assert.throws(() => chargeDistribution([]), TypeError);
});

test("evidence coordinates are exact expectations of the bedrock charge coordinates", () => {
  const coordinates = evidenceCoordinates(chargeDistribution([potential, potential, active, stable]));
  assert.ok(ratEqual(coordinates.truth, fromRatio(3, 4)));
  assert.ok(ratEqual(coordinates.falsity, fromRatio(1, 2)));
  assert.ok(ratEqual(coordinates.knowledge, fromRatio(5, 4)));
  assert.ok(ratEqual(coordinates.conflict, fromRatio(1, 4)));
});

test("a belief update is an exact movement of evidence coordinates", () => {
  const delta = evidenceDelta(
    chargeDistribution([potential, potential]),
    chargeDistribution([stable, stable]),
  );
  assert.ok(ratIsZero(delta.truthDelta));
  assert.ok(ratEqual(delta.falsityDelta, fromRatio(1, 1)));
  assert.ok(ratEqual(delta.knowledgeDelta, fromRatio(1, 1)));
  assert.ok(ratEqual(delta.conflictDelta, fromRatio(1, 1)));
});

test("the informational horizon is an absolute-continuity obstruction", () => {
  const narrow = chargeDistribution([potential, active]);
  const wide = chargeDistribution([potential, active, stable]);
  assert.equal(absoluteContinuity(narrow, wide).kind, "meme-analysis.evidence.absoluteContinuity:witness");
  const horizon = absoluteContinuity(wide, narrow);
  assert.equal(horizon.kind, "meme-analysis.evidence.absoluteContinuity-obstruction");
  if (horizon.kind === "meme-analysis.evidence.absoluteContinuity-obstruction") {
    assert.deepEqual(horizon.escaping, ["stable"]);
  }
  // The float boundary read is infinite exactly on the obstruction.
  assert.equal(klBitsAtBoundary(wide, narrow), Number.POSITIVE_INFINITY);
  assert.ok(Number.isFinite(klBitsAtBoundary(narrow, wide)));
});

test("mixedness is the exact entropy order", () => {
  const point = chargeDistribution([potential]);
  const uniformTwo = chargeDistribution([potential, active]);
  const spread = mixedness(uniformTwo, point);
  assert.equal(spread.kind, "meme-analysis.evidence.mixedness");
  if (spread.kind === "meme-analysis.evidence.mixedness") {
    assert.equal(spread.relation, "leftMoreMixed");
  }
  // Mixedness sees probability shape, not labels.
  const relabeled = mixedness(
    chargeDistribution([potential, potential, active]),
    chargeDistribution([stable, stable, absurd]),
  );
  assert.equal(relabeled.kind, "meme-analysis.evidence.mixedness");
  if (relabeled.kind === "meme-analysis.evidence.mixedness") {
    assert.equal(relabeled.relation, "equallyMixed");
  }
});

test("genuinely incomparable distributions are an explicit judgment, not a float", () => {
  // (3,1,1,1)/6 concentrates faster at prefix 1; (2,2,2,0)/6 at prefix 3.
  const heavyHead = chargeDistribution([potential, potential, potential, active, stable, absurd]);
  const flatBody = chargeDistribution([potential, potential, active, active, stable, stable]);
  const judgment = mixedness(heavyHead, flatBody);
  assert.equal(judgment.kind, "meme-analysis.evidence.mixedness-incomparable");
  if (judgment.kind === "meme-analysis.evidence.mixedness-incomparable") {
    assert.equal(judgment.leftExceedsAtPrefix, 1);
    assert.equal(judgment.rightExceedsAtPrefix, 3);
  }
});

test("independence is an exact factorization judgment; mutual information vanishes on the witness", () => {
  const product = chargeJoint([
    [potential, potential],
    [potential, active],
    [active, potential],
    [active, active],
  ]);
  assert.equal(independence(product).kind, "meme-analysis.evidence.independence:witness");
  assert.equal(mutualInformationBitsAtBoundary(product), 0);

  const coupled = chargeJoint([[potential, potential], [active, active]]);
  const dependence = independence(coupled);
  assert.equal(dependence.kind, "meme-analysis.evidence.independence-obstruction");
  if (dependence.kind === "meme-analysis.evidence.independence-obstruction") {
    assert.ok(ratEqual(dependence.jointProbability, fromRatio(1, 2)));
    assert.ok(ratEqual(dependence.productProbability, fromRatio(1, 4)));
  }
  // One perfectly coupled binary pair transmits exactly one bit.
  assert.equal(mutualInformationBitsAtBoundary(coupled), 1);
});

test("coordinate distortion and its expectation are exact", () => {
  assert.ok(ratIsZero(coordinateDistortion(stable, stable)));
  assert.ok(ratEqual(coordinateDistortion(potential, active), fromRatio(1, 1)));
  assert.ok(ratEqual(coordinateDistortion(potential, stable), fromRatio(1, 2)));
  assert.ok(ratIsZero(expectedDistortion(chargeJoint([[potential, potential], [active, active]]))));
  assert.ok(ratEqual(
    expectedDistortion(chargeJoint([[potential, active], [active, potential]])),
    fromRatio(1, 1),
  ));
});

test("a boundary claim is an exact screening-off judgment", () => {
  // Internal and external both copy the boundary: screened off.
  const screened = chargeTriple([
    [potential, potential, potential],
    [active, active, active],
  ]);
  assert.equal(screeningOff(screened).kind, "meme-analysis.evidence.screeningOff:witness");

  // Internal copies external while the boundary varies independently:
  // information passes around the boundary.
  const leaking = chargeTriple([
    [potential, potential, potential],
    [potential, active, potential],
    [active, potential, active],
    [active, active, active],
  ]);
  const leak = screeningOff(leaking);
  assert.equal(leak.kind, "meme-analysis.evidence.screeningOff-obstruction");
  if (leak.kind === "meme-analysis.evidence.screeningOff-obstruction") {
    assert.ok(!ratEqual(leak.throughBoundary, leak.aroundBoundary));
  }
});

test("entropy boundary reads agree with the exact structure", () => {
  assert.equal(entropyBitsAtBoundary(chargeDistribution([potential])), 0);
  const uniformTwo = entropyBitsAtBoundary(chargeDistribution([potential, active]));
  assert.ok(Math.abs(uniformTwo - 1) < 1e-12);
  const uniformFour = entropyBitsAtBoundary(chargeDistribution([absurd, potential, active, stable]));
  assert.ok(Math.abs(uniformFour - 2) < 1e-12);
});

test("a real induced carrier presents an exact information distribution", () => {
  const carrier = induce([
    utterance(mark({ subject: "sun", object: "stone" }), mark("warms")),
    utterance(mark({ subject: "river", object: "reed" }), mark("cools")),
  ]);
  const distribution = informationDistribution(
    carrier.fixedPointReadings.knowledgeLeast.information,
  );
  assert.ok(toCount(distribution.total) >= 2);
  const mass = distribution.bins.reduce(
    (sum, bin) => ratAdd(sum, bin.probability),
    fromRatio(0, 1),
  );
  assert.ok(ratEqual(mass, fromRatio(1, 1)));
});
