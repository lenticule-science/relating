import assert from "node:assert/strict";
import test from "node:test";

import {
  articulate,
  mark,
  utterance,
  predicating,
} from "./index.mjs";
import {
  materializePredicationCategory,
  predicate,
  positing,
} from "./predicating/index.mjs";
import {
  posit,
  settling,
} from "./predicating/positing/index.mjs";
import {
  settlingStageOrdinal,
  zeroOrdinal,
} from "../topology/internal.mjs";

test("articulating contains predicating, positing, and settling surfaces", () => {
  const carrier = utterance(mark("alice"), mark("knows"));
  const articulation = articulate(carrier);
  const predication = predicate(articulation);
  const positioned = posit(materializePredicationCategory(predication));
  const stage = settlingStageOrdinal(zeroOrdinal());

  assert.equal(articulation.kind, "utterance.aperiodicArticulationCategory");
  assert.equal(predication.kind, "predication.transfiniteCategory");
  assert.equal(positioned.kind, "predication.fiber.carrier");
  assert.equal(stage.kind, "predication.settling.stageOrdinal");
  assert.equal(typeof predicating.predicate, "function");
  assert.equal(typeof positing.posit, "function");
  assert.equal(typeof settling.settlingStageOrdinal, "function");
});
