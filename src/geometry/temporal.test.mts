import test from "node:test";
import assert from "node:assert/strict";
import { cell, claim, induce, mark, token, utterance } from "../topology/index.mjs";
import {
  settling,
  settlingInitialStageInput,
  settlingSuccessorStageInput,
} from "../topology/dynamics.mjs";
import { toNumber } from "../algebra/index.mjs";
import {
  causalCone,
  causalOrder,
  causalSeparation,
  orderingFraction,
} from "./temporal.mjs";

const term = (name: string) => token(mark(name));
const relate = (subject: string, object: string) => cell(term(subject), claim(mark("p")), term(object));

// Four events over three stages:
//   stage 0: (a p b)
//   stage 1: (b p c) — shares b with stage 0; (d p d) — shares nothing
//   stage 2: (c p d) — shares c with (b p c), shares d with (d p d)
const ab = relate("a", "b");
const bc = relate("b", "c");
const dd = relate("d", "d");
const cd = relate("c", "d");

const builtSettling = () => {
  const initial = settlingInitialStageInput([ab]);
  const middle = settlingSuccessorStageInput(initial, [ab, bc, dd]);
  const last = settlingSuccessorStageInput(middle, [ab, bc, dd, cd]);
  return settling([initial, middle, last]);
};

test("causal order is the transitive closure of stage-increasing term adjacency", () => {
  const order = causalOrder(builtSettling());
  assert.equal(order.events.length, 4);

  const direct = causalSeparation(order, ab, bc);
  assert.equal(direct.kind, "meme-geometry.temporal.separation.timelike");

  // Transitivity: (a p b) precedes (c p d) through (b p c).
  const transitive = causalSeparation(order, ab, cd);
  assert.equal(transitive.kind, "meme-geometry.temporal.separation.timelike");
  if (transitive.kind === "meme-geometry.temporal.separation.timelike") {
    assert.equal(transitive.earlier.stageIndex, 0);
    assert.equal(transitive.later.stageIndex, 2);
  }

  // Orientation is order-independent: asking backwards finds the same arrow.
  const backwards = causalSeparation(order, cd, ab);
  assert.equal(backwards.kind, "meme-geometry.temporal.separation.timelike");
  if (backwards.kind === "meme-geometry.temporal.separation.timelike") {
    assert.equal(backwards.earlier.stageIndex, 0);
  }
});

test("different stages without a term path stay spacelike", () => {
  const order = causalOrder(builtSettling());
  // (a p b) fires before (d p d) but shares no term and no path reaches it.
  const separation = causalSeparation(order, ab, dd);
  assert.equal(separation.kind, "meme-geometry.temporal.separation.spacelike");
  // Same stage, no shared term: spacelike.
  const sameStage = causalSeparation(order, bc, dd);
  assert.equal(sameStage.kind, "meme-geometry.temporal.separation.spacelike");
});

test("a cell that never fired is an obstruction, not a spacelike claim", () => {
  const order = causalOrder(builtSettling());
  const separation = causalSeparation(order, ab, relate("x", "y"));
  assert.equal(separation.kind, "meme-geometry.temporal.separation-obstruction");
  const cone = causalCone(order, relate("x", "y"));
  assert.equal(cone.kind, "meme-geometry.temporal.cone-obstruction");
});

test("cones collect exactly the causal past and future", () => {
  const order = causalOrder(builtSettling());
  const atApex = causalCone(order, cd);
  assert.equal(atApex.kind, "meme-geometry.temporal.cone");
  if (atApex.kind === "meme-geometry.temporal.cone") {
    assert.equal(atApex.past.length, 3);
    assert.equal(atApex.future.length, 0);
  }
  const atOrigin = causalCone(order, ab);
  assert.equal(atOrigin.kind, "meme-geometry.temporal.cone");
  if (atOrigin.kind === "meme-geometry.temporal.cone") {
    assert.equal(atOrigin.past.length, 0);
    assert.equal(atOrigin.future.length, 2);
  }
});

test("ordering fraction is exact: 4 comparable pairs of 6", () => {
  const order = causalOrder(builtSettling());
  const judgment = orderingFraction(order);
  assert.equal(judgment.kind, "meme-geometry.temporal.orderingFraction");
  if (judgment.kind === "meme-geometry.temporal.orderingFraction") {
    assert.equal(judgment.comparablePairs, 4);
    assert.equal(judgment.totalPairs, 6);
    assert.equal(toNumber(judgment.fraction), 2 / 3);
  }
});

test("causal order reads a real induced settling without inventing precedence", () => {
  const carrier = induce([
    utterance(mark({ subject: "sun", object: "stone" }), mark("warms")),
    utterance(mark({ subject: "river", object: "reed" }), mark("cools")),
  ]);
  const order = causalOrder(carrier.settling);
  assert.equal(order.events.length, 2);
  const separation = causalSeparation(order, order.events[0]!.cell, order.events[1]!.cell);
  assert.equal(separation.kind, "meme-geometry.temporal.separation.spacelike");
});
