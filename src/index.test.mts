import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import * as root from "./index.mjs";
import { mark } from "./algebra/index.mjs";
import { isJsonRecord, parse as parseJson } from "./codecs/resource/json.mjs";
import { induce } from "./topology/index.mjs";

const time = "2026-06-16T00:00:00.000Z";

test("the root import surface is the script morphism surface", () => {
  const log = `{"token":"alice","claim":"knows"}\n`;
  const evaluated = root.evalRelation(log, undefined, { time });

  assert.equal(evaluated, `["alice","knows",{"charge":"potential","object":"alice"},"${time}"]\n`);
  assert.deepEqual(root.scriptActions, ["scripts.settle", "scripts.read", "scripts.compare"]);
  assert.equal(root.scriptMorphisms["scripts.read"](evaluated, undefined, { subject: "alice", time }), evaluated);
  assert.equal(root.evalRelation(log, "", { action: "scripts.compare", time }).includes('"charge":"active"'), true);
  assert.equal("algebra" in root, false);
  assert.equal("topology" in root, false);
  assert.equal(typeof mark, "function");
  assert.equal(typeof induce, "function");
});

test("the package export map states the categorical public surfaces", () => {
  const packageJson = parseJson(readFileSync(join(process.cwd(), "package.json"), "utf8"));
  assert.equal(isJsonRecord(packageJson), true);
  if (!isJsonRecord(packageJson)) throw new TypeError("package.json must be a JSON object");
  assert.equal(packageJson["name"], "@emsenn/relating");
  const exportsMap = packageJson["exports"];
  assert.equal(isJsonRecord(exportsMap), true);
  if (!isJsonRecord(exportsMap)) throw new TypeError("package exports must be a JSON object");

  assert.deepEqual(
    [
      ".",
      "./articulating",
      "./articulating/predicating",
      "./articulating/predicating/positing",
      "./articulating/predicating/positing/settling",
      "./scripts",
    ].map((subpath) => subpath in exportsMap),
    [true, true, true, true, true, true],
  );
  assert.equal("./topology/internal" in exportsMap, false);
  assert.equal("./package.json" in exportsMap, true);
});
