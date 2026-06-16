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

test("articulating and predicating do not inspect arbitrary Mark payloads", () => {
  const opaque = new Proxy(Object.freeze({}), {
    get() {
      throw new Error("core inspected an opaque Mark payload");
    },
    getOwnPropertyDescriptor() {
      throw new Error("core inspected an opaque Mark payload");
    },
    getPrototypeOf() {
      throw new Error("core inspected an opaque Mark payload");
    },
    ownKeys() {
      throw new Error("core inspected an opaque Mark payload");
    },
  });
  const carrier = utterance(mark(opaque), mark(opaque));
  const articulation = articulate(carrier);
  const predication = predicate(articulation);

  assert.equal(carrier.token.mark.value, opaque);
  assert.equal(carrier.claim.mark.value, opaque);
  assert.equal(articulation.potentialAperiodicArticulationCell[0], carrier);
  assert.equal(predication.kind, "predication.transfiniteCategory");
});
