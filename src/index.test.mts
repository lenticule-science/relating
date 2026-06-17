import assert from "node:assert/strict";
import test from "node:test";

import * as root from "./index.mjs";

const time = "2026-06-16T00:00:00.000Z";

test("the root import surface carries scripts and ordinary public carriers", () => {
  const log = `{"token":"alice","claim":"knows"}\n`;
  const evaluated = root.evalRelation(log, undefined, { time });

  assert.equal(evaluated, `["alice","knows",{"charge":"potential","object":"alice"},"${time}"]\n`);
  assert.deepEqual(root.scriptActions, ["scripts.settle", "scripts.read", "scripts.compare"]);
  assert.equal(root.scriptMorphisms["scripts.read"](evaluated, undefined, { subject: "alice", time }), evaluated);
  assert.equal(root.evalRelation(log, "", { action: "scripts.compare", time }).includes('"charge":"active"'), true);
  assert.equal("algebra" in root, false);
  assert.equal("topology" in root, false);
  assert.equal(typeof root.mark, "function");
  assert.equal(typeof root.induce, "function");
});
