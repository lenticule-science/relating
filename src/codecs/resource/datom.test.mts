import test from "node:test";
import assert from "node:assert/strict";
import { charge, chargeValue, mark, valueOf } from "../../algebra/index.mjs";
import { parse, eavtToCell, cellToEavt, serialize, toEavt, isEavtShape, type ChargedCell } from "./datom.mjs";
import { canonical } from "./json.mjs";

const doc = `["alice","knows","bob",1]\n["alice","knows","bob",2]\n["alice","knows","carol",3]`;

test("a witness log admits no negative: every datom derives to potential", () => {
  for (const cell of parse(doc).map(eavtToCell)) {
    assert.equal(valueOf(cell.charge).name, "potential");
  }
});

test("a witness log never lands evidence on the falsity side: you cannot witness an absence", () => {
  for (const cell of parse(doc).map(eavtToCell)) {
    assert.equal(cell.charge.evidence[1].length, 0);
  }
});

test("datoms carry no operation: a witness log round-trips through cells unchanged", () => {
  const back = serialize(parse(doc).flatMap((d) => cellToEavt(eavtToCell(d))));
  assert.equal(back.trim(), parse(doc).map((d) => canonical([...d])).join("\n"));
});

test("EAVT accepts tuple and object spellings of the same boundary witness", () => {
  assert.deepEqual(toEavt(["alice", "knows", "bob", 1]), ["alice", "knows", "bob", 1]);
  assert.deepEqual(toEavt({ e: "alice", a: "knows", v: "bob", t: 1 }), ["alice", "knows", "bob", 1]);
});

test("EAVT object spelling must witness all four coordinates", () => {
  assert.throws(() => toEavt({ e: "alice", a: "knows", v: "bob" }), /expected \[entity, attribute, value, time\]/);
  assert.throws(() => toEavt({ e: "alice", a: "knows", t: 1 }), /expected \[entity, attribute, value, time\]/);
  assert.equal(isEavtShape({ e: "alice", a: "knows", v: "bob" }), false);
});

test("writing a charged cell emits only its present-side witnesses, never the absent side", () => {
  // a stable (told-both) cell: a witness on each coordinate.
  const charged: ChargedCell = {
    cell: { subject: "alice", predicate: "knows", object: "bob" },
    charge: charge(chargeValue("stable"), [[mark("affirmer")], [mark("denier")]]),
  };
  const datoms = cellToEavt(charged);
  assert.equal(datoms.length, 1, "only the one present-side witness becomes a datom");
  assert.equal(datoms[0]![3], "affirmer");
});

test("writing EAVT refuses non-JSON time witnesses instead of casting arbitrary marks", () => {
  const charged: ChargedCell = {
    cell: { subject: "alice", predicate: "knows", object: "bob" },
    charge: charge(chargeValue("potential"), [[mark(Symbol("not-json"))], []]),
  };
  assert.throws(() => cellToEavt(charged), /not JSON-serializable/);
});

test("an absurd cell witnesses nothing: it yields no datoms", () => {
  const charged: ChargedCell = {
    cell: { subject: "x", predicate: "p", object: "y" },
    charge: charge(chargeValue("absurd")),
  };
  assert.equal(cellToEavt(charged).length, 0);
});
