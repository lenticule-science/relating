import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { articulate, mark, predicate, utterance, type ArticulationCell } from "../src/index.mjs";
import { canonical, requireJsonValue } from "../src/codecs/path/object/attribute/file/flatfile/serialization/json/index.mjs";

const articulateScript = fileURLToPath(new URL("./articulate-utterance.mjs", import.meta.url));
const predicateScript = fileURLToPath(new URL("./predicate-articulation-cell.mjs", import.meta.url));

function run(script: string, input: string) {
  return spawnSync(process.execPath, [script], {
    input,
    encoding: "utf8",
  });
}

function scriptJson(value: unknown, label: string) {
  return requireJsonValue(JSON.parse(JSON.stringify(value)), label);
}

test("predicate-articulation-cell pipes articulate-utterance output into predicate", () => {
  const articulated = run(articulateScript, "alpha\nbeta\n");
  assert.equal(articulated.status, 0);

  const predicated = run(predicateScript, articulated.stdout);
  assert.equal(predicated.status, 0);
  assert.equal(predicated.stderr, "");

  const cell = articulate(utterance(mark("alpha"), mark("beta\n")));
  const expected = predicate(scriptJson(cell, "articulation cell") as unknown as ArticulationCell);
  assert.equal(predicated.stdout, `${canonical(scriptJson(expected, "predication site"))}\n`);
});

test("predicate-articulation-cell rejects non-articulation JSON resources", () => {
  const result = run(predicateScript, "{\"kind\":\"wrong\"}\n");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /^predicate-articulation-cell:/);
  assert.equal(result.stdout, "");
});
