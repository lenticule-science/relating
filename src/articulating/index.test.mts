import assert from "node:assert/strict";
import test from "node:test";

import {
  articulate,
  mark,
  utterance,
  predicating,
} from "./index.mjs";
import {
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
} from "./predicating/positing/settling/index.mjs";

test("articulating contains predicating, positing, and settling surfaces", () => {
  const carrier = utterance(mark("alice"), mark("knows"));
  const articulation = articulate(carrier);
  const predication = predicate(articulation);
  const positioned = posit(predication);
  const settled = settling.settle(positioned);
  const stage = settlingStageOrdinal(zeroOrdinal);

  assert.equal(articulation.kind, "utterance.articulation.cell");
  assert.equal(predication.kind, "predication.site");
  assert.equal(positioned.kind, "predication.posit.presheaf");
  assert.equal(positioned.fiber.kind, "predication.fiber.carrier");
  assert.equal(settled.kind, "predication.settlement.filtration");
  assert.equal(stage.kind, "predication.settling.stageOrdinal");
  assert.equal(typeof predicating.predicate, "function");
  assert.equal(typeof positing.posit, "function");
  assert.equal(typeof settling.settle, "function");
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

  assert.equal(articulation.potentialAperiodicArticulationCell[0], carrier);
  assert.equal(predication.kind, "predication.site");
});
