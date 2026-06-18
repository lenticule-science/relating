import test from "node:test";
import assert from "node:assert/strict";

import * as root from "./index.mjs";

test("the root import surface carries ordinary public carriers and morphisms", () => {
  assert.equal("algebra" in root, false);
  assert.equal("topology" in root, false);
  assert.equal(typeof root.mark, "function");
  assert.equal(typeof root.articulate, "function");
  assert.equal(typeof root.predicate, "function");
  assert.equal(typeof root.posit, "function");
  assert.equal(typeof root.settle, "function");
  assert.equal(typeof root.induceRelation, "function");
});
