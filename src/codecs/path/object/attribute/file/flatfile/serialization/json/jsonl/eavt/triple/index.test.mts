import test from "node:test";
import assert from "node:assert/strict";

import {
  assertTriple,
  dedupeTriples,
  tripleFromDatom,
  tripleFromEavt,
  tripleId,
} from "./index.mjs";

test("SPO triples validate, content-address, and dedupe by canonical JSON shape", () => {
  const triple = assertTriple({ s: "ada", p: "knows", o: "charles" });

  assert.deepEqual(triple, { s: "ada", p: "knows", o: "charles" });
  assert.equal(tripleId(triple), tripleId({ o: "charles", p: "knows", s: "ada" }));
  assert.deepEqual(dedupeTriples([triple, { o: "charles", p: "knows", s: "ada" }]), [triple]);
  assert.throws(() => assertTriple({ s: "ada", p: "knows" }), /exactly \{s,p,o\}/);
});

test("SPO triples project from EAVT and object-datom JSON rows", () => {
  const triple = { s: "ada", p: "knows", o: "charles" };

  assert.deepEqual(tripleFromEavt({ e: "ada", a: "knows", v: "charles", t: "tx-1" }), triple);
  assert.deepEqual(tripleFromDatom({ e: "ada", a: "knows", v: "charles", tx: "tx-1", op: "assert" }), triple);
});
