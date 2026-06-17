import assert from "node:assert/strict";
import test from "node:test";
import {
  assertDatomFact,
  assertObjectDatom,
  currentDatomValue,
  foldObjectDatoms,
  objectDatomId,
  objectDatomWitnesses,
  objectDatomsAsOf,
  retractDatomFact,
} from "./index.mjs";

test("object datoms assert, retract, identify, and fold current value", () => {
  const d1 = assertDatomFact("ada", "knows", "charles", "tx-1");
  const d2 = retractDatomFact("ada", "knows", "charles", "tx-2");
  const d3 = assertObjectDatom({ op: "assert", tx: "tx-3", v: "notes", a: "writes", e: "ada" });

  assert.deepEqual(d1, { e: "ada", a: "knows", v: "charles", tx: "tx-1", op: "assert" });
  assert.equal(objectDatomId(d3), objectDatomId({ e: "ada", a: "writes", v: "notes", tx: "tx-3", op: "assert" }));
  assert.deepEqual(currentDatomValue([d1, d3, d2]), [{ e: "ada", a: "writes", v: "notes" }]);
  assert.throws(() => assertObjectDatom({ e: "ada", a: "knows", v: "charles", tx: "tx-1", op: "drop" }), /op/);
});

test("object datom logs fold into charged cells with positive and negative evidence", () => {
  const d1 = assertDatomFact("ada", "knows", "charles", "tx-1");
  const d2 = retractDatomFact("ada", "knows", "charles", "tx-2");
  const d3 = retractDatomFact("ada", "knows", "charles", "tx-2");
  const d4 = assertDatomFact("ada", "writes", "notes", "tx-3");
  const section = foldObjectDatoms([d4, d1, d2, d3]);

  assert.deepEqual(section.cells, [
    {
      subject: "ada",
      predicate: "knows",
      object: "charles",
      value: "stable",
      evidence: [["tx-1"], ["tx-2"]],
    },
    {
      subject: "ada",
      predicate: "writes",
      object: "notes",
      value: "potential",
      evidence: [["tx-3"], []],
    },
  ]);
  assert.deepEqual(objectDatomWitnesses(section, { e: "ada", a: "knows", v: "charles" }), ["tx-1"]);
  assert.deepEqual(foldObjectDatoms(objectDatomsAsOf([d1, d2, d4], "tx-2")).cells.map((cell) => cell.value), ["stable"]);
});
