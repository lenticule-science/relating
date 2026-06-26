/**
 * Contract: RWIL readings are isomorphisms over a shared witness pivot.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { cohere, cohereLog, readingAsLogReading, registerReading, readings, sameWitnessLog } from "@emsenn/relating/ledger";
import {
  canonical,
  datom,
  eavtRecord,
  parseEavt,
  serializeEavt,
  spanFromWitness,
  triple,
  witnessFromSpan,
} from "@emsenn/relating/writing";

const witness = Object.freeze({
  e: "did:web:dev.emsenn.net:agents:codex",
  a: "coherence-kernel|green",
  v: "assert",
  t: "",
});

const eavtJsonlReading = registerReading(Object.freeze({
  id: "relating.eavt+jsonl",
  toWire: (row) => serializeEavt([row]),
  fromWire: (wire) => eavtRecord(parseEavt(wire)[0]),
}));

const datomReading = registerReading(Object.freeze({
  id: "relating.datom",
  toWire: (row) => datom.datom([row.e, row.a, row.v, row.t], "identity"),
  fromWire: (wire) => eavtRecord({ e: wire[0], a: wire[1], v: wire[2], t: wire[3] }),
}));

const tripleReading = registerReading(Object.freeze({
  id: "relating.triple.bulk-untimed",
  toWire: (row) => {
    if (row.t !== "") throw new TypeError("triple reading is iso only on the untimed bulk witness domain");
    return triple.tripleFromEavt(row);
  },
  fromWire: (wire) => eavtRecord({ e: wire.s, a: wire.p, v: wire.o, t: "" }),
}));

const otlpSpanReading = registerReading(Object.freeze({
  id: "relating.otlp.span",
  toWire: spanFromWitness,
  fromWire: witnessFromSpan,
}));

const ownReadings = Object.freeze([eavtJsonlReading, datomReading, tripleReading, otlpSpanReading]);

describe("the generic RWIL coherence kernel", () => {
  it("registers a small catalog of RWIL-rooted readings", () => {
    const ids = readings().map((reading) => reading.id);
    for (const reading of ownReadings) assert.ok(ids.includes(reading.id), reading.id);
  });

  it("one witness round-trips through each relating reading", () => {
    for (const reading of ownReadings) {
      assert.equal(
        canonical(reading.fromWire(reading.toWire(witness))),
        canonical(witness),
        `${reading.id} must be an iso on the witness`,
      );
    }
  });

  it("every pair of relating readings commutes through the shared witness", () => {
    for (const left of ownReadings) {
      for (const right of ownReadings) {
        const report = cohere(left, right, witness);
        assert.equal(report.ok, true, `${left.id} <-> ${right.id}`);
        assert.equal(report.leftIso, true);
        assert.equal(report.rightIso, true);
        assert.equal(report.leftToRight, true);
        assert.equal(report.rightToLeft, true);
      }
    }
  });

  it("one-row readings lift to the degenerate 1-block log-reading law", () => {
    const log = Object.freeze([witness]);
    const logReadings = ownReadings.map((reading) => readingAsLogReading(reading));

    for (const left of logReadings) {
      for (const right of logReadings) {
        const report = cohereLog(left, right, log);
        assert.equal(report.ok, true, `${left.id} <-> ${right.id}`);
        assert.equal(sameWitnessLog(report.witnessLog, log), true);
      }
    }
  });
});
