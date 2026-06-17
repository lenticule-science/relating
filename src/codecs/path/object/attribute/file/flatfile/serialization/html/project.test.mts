import test from "node:test";
import assert from "node:assert/strict";

import { charge, chargeValue, mark } from "../../../../../../../../articulating/carriers.mjs";
import { fromCells, pack, project } from "./index.mjs";

test("HTML projection renders only projectable witness marks", () => {
  const dataform = fromCells("alice", [{
    cell: { subject: "alice", predicate: "knows", object: "bob" },
    charge: charge(chargeValue("stable"), [[mark({ source: "log" })], [mark({ const: "audit" })]]),
  }], { mode: "audit" });

  const html = project(dataform);

  assert.match(html, /data-value="stable"/);
  assert.match(html, /source/);
  assert.match(html, /audit/);
});

test("HTML projection refuses opaque witness marks instead of stringifying them", () => {
  const dataform = fromCells("alice", [{
    cell: { subject: "alice", predicate: "knows", object: "bob" },
    charge: charge(chargeValue("potential"), [[mark(Symbol("opaque"))], []]),
  }], { mode: "audit" });

  assert.throws(() => project(dataform), /witness mark is not HTML-projectable/);
});

test("HTML packet identity canonicalizes object-valued frontier terms", () => {
  const leftDataform = fromCells("alice", [{
    cell: { subject: "alice", predicate: "knows", object: { z: 1, a: { const: "x" } } },
    charge: charge(chargeValue("potential"), [[mark("source")], []]),
  }]);
  const rightDataform = fromCells("alice", [{
    cell: { subject: "alice", predicate: "knows", object: { a: { const: "x" }, z: 1 } },
    charge: charge(chargeValue("potential"), [[mark("source")], []]),
  }]);

  const left = pack(leftDataform, { source: "test" });
  const right = pack(rightDataform, { source: "test" });

  assert.equal(left.identity, right.identity);
});
