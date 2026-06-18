import assert from "node:assert/strict";
import test from "node:test";

import {
  articulate,
  induceRelation,
  mark,
  posit,
  predicate,
  readClassificationOfSettlementFiltration,
  readDepthOfSettlementFiltration,
  readFirstCohomologyOfSettlementFiltration,
  readIncrementsOfSettlementFiltration,
  settle,
  singleUtteranceTopology,
  utterance,
} from "../../../../index.mjs";

test("induceRelation is the public articulate-predicate-posit-settle composite", () => {
  const carrier = utterance(mark("token"), mark("claim"));
  const explicit = settle(posit(predicate(articulate(carrier))));

  assert.deepEqual(induceRelation(carrier), explicit);
  assert.equal(induceRelation(carrier).kind, "predication.settlement.filtration");
});

test("settlement readers accept an induced relation filtration", () => {
  const filtration = induceRelation(utterance(mark("token"), mark("claim")));

  assert.equal(readIncrementsOfSettlementFiltration(filtration)[0]?.kind, "predication.settling.increment");
  assert.equal(readFirstCohomologyOfSettlementFiltration(filtration).kind, "predication.settling.firstCohomology");
  assert.equal(readClassificationOfSettlementFiltration(filtration).kind, "predication.settling.classification");
  assert.equal(readDepthOfSettlementFiltration(filtration).kind, "predication.settling.stageOrdinal");
});

test("meme topology is a separate public helper over the same relation settling", () => {
  const left = mark("token");
  const right = mark("claim");
  const topology = singleUtteranceTopology(left, right);

  assert.equal(topology.kind, "meme-topology.carrier");
  assert.deepEqual(topology.settling, induceRelation(utterance(left, right)));
});

test("induceRelation does not inspect Mark payload contents", () => {
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

  assert.equal(induceRelation(utterance(mark(opaque), mark(opaque))).kind, "predication.settlement.filtration");
});
