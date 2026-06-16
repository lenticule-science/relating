import test from "node:test";
import assert from "node:assert/strict";
import {
  graded,
  gradedAbs,
  gradedAdd,
  gradedCompare,
  gradedEqual,
  gradedIsZero,
  gradedNegate,
  gradedScale,
  gradedSubtract,
  gradedTimes,
  gradedZero,
  sameGrade,
} from "./graded.mjs";
import { fromRatio, ratFromInt } from "../codecs/index.mjs";

const charge = (num: number, den = 1) => graded(fromRatio(num, den), "charge");

test("addition is exact within a sector and inverts to zero", () => {
  assert.ok(gradedEqual(gradedAdd(charge(1, 2), charge(1, 2)), charge(1)));
  assert.ok(gradedIsZero(gradedAdd(charge(3, 4), gradedNegate(charge(3, 4)))));
  assert.ok(gradedIsZero(gradedZero("spin")));
  assert.equal(gradedZero("spin").grade, "spin");
});

test("a sector mismatch is a TypeError, never a silent coercion", () => {
  // Superselection: a charge and a spin do not superpose.
  assert.throws(() => gradedAdd(graded(ratFromInt(1), "charge"), graded(ratFromInt(1), "spin")), TypeError);
  assert.throws(() => gradedSubtract(graded(ratFromInt(1), "charge"), graded(ratFromInt(1), "spin")), TypeError);
  assert.throws(() => gradedCompare(graded(ratFromInt(1), "charge"), graded(ratFromInt(1), "spin")), TypeError);
  assert.equal(sameGrade(charge(1), charge(2)), true);
  assert.equal(sameGrade(charge(1), graded(ratFromInt(1), "spin")), false);
});

test("scaling preserves the sector; the graded product pairs sectors into a third", () => {
  // Dimensional multiplication: a velocity times a duration is a distance.
  const velocity = graded(ratFromInt(10), "velocity");
  const duration = graded(ratFromInt(5), "duration");
  assert.ok(gradedEqual(gradedTimes(velocity, duration, "distance"), graded(ratFromInt(50), "distance")));
  // Scaling by an ungraded one-half halves the value, sector intact.
  assert.ok(gradedEqual(gradedScale(charge(50), fromRatio(1, 2)), charge(25)));
  assert.equal(gradedScale(charge(50), fromRatio(1, 2)).grade, "charge");
});

test("absolute value and comparison read the value under a fixed sector", () => {
  assert.ok(gradedEqual(gradedAbs(charge(-3, 4)), charge(3, 4)));
  assert.equal(gradedCompare(charge(1, 2), charge(3, 4)), -1);
  assert.equal(gradedCompare(charge(3, 4), charge(3, 4)), 0);
});
