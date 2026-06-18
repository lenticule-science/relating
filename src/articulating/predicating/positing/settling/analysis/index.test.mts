import assert from "node:assert/strict";
import test from "node:test";

import { chargeValue } from "../../index.mjs";
import { fromRatio, toCount } from "../../../../../codecs/index.mjs";
import {
  absoluteContinuity,
  chargeDistribution,
  evidenceCoordinates,
  graded,
  gradedAdd,
  gradedEqual,
  ratEqual,
} from "./index.mjs";

test("analysis reads exact evidence coordinates from public charge carriers", () => {
  const distribution = chargeDistribution([
    chargeValue("potential"),
    chargeValue("stable"),
  ]);
  const coordinates = evidenceCoordinates(distribution);

  assert.equal(distribution.kind, "meme-analysis.evidence.distribution");
  assert.equal(toCount(distribution.total), 2);
  assert.equal(distribution.bins.length, 4);
  assert.equal(coordinates.kind, "meme-analysis.evidence.coordinates");
  assert.equal(ratEqual(coordinates.truth, fromRatio(1, 1)), true);
  assert.equal(ratEqual(coordinates.falsity, fromRatio(1, 2)), true);
  assert.equal(ratEqual(coordinates.knowledge, fromRatio(3, 2)), true);
  assert.equal(ratEqual(coordinates.conflict, fromRatio(1, 2)), true);
});

test("analysis decides support containment without decimal or boolean collapse", () => {
  const from = chargeDistribution([chargeValue("stable")]);
  const to = chargeDistribution([chargeValue("potential")]);
  const judgment = absoluteContinuity(from, to);

  assert.equal(judgment.kind, "meme-analysis.evidence.absoluteContinuity-obstruction");
  assert.deepEqual(judgment.escaping, ["stable"]);
});

test("graded rationals add only within their public grade", () => {
  const left = graded(fromRatio(1, 2), "truth");
  const right = graded(fromRatio(1, 3), "truth");
  const other = graded(fromRatio(1, 6), "falsity");

  assert.equal(gradedEqual(gradedAdd(left, right), graded(fromRatio(5, 6), "truth")), true);
  assert.throws(() => gradedAdd(left, other), /grade mismatch: truth vs falsity/);
});
