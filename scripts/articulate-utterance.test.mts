import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { articulate, mark, utterance } from "../src/index.mjs";
import { canonical, requireJsonValue } from "../src/codecs/path/object/attribute/file/flatfile/serialization/json/index.mjs";

const script = fileURLToPath(new URL("./articulate-utterance.mjs", import.meta.url));

function run(input: string) {
  return spawnSync(process.execPath, [script], {
    input,
    encoding: "utf8",
  });
}

function scriptJson(value: unknown, label: string) {
  return requireJsonValue(JSON.parse(JSON.stringify(value)), label);
}

test("articulate-utterance pipes two newline-separated payloads into articulate", () => {
  const result = run("alpha\nbeta");
  assert.equal(result.status, 0);
  assert.equal(result.stderr, "");

  const expected = articulate(utterance(mark("alpha"), mark("beta")));
  assert.equal(result.stdout, `${canonical(scriptJson(expected, "articulation cell"))}\n`);
});

test("articulate-utterance preserves everything after the first newline as claim payload", () => {
  const result = run("alpha\nbeta\nmore\n");
  assert.equal(result.status, 0);

  const expected = articulate(utterance(mark("alpha"), mark("beta\nmore\n")));
  assert.equal(result.stdout, `${canonical(scriptJson(expected, "articulation cell"))}\n`);
});

test("articulate-utterance rejects input without a newline separator", () => {
  const result = run("alpha");
  assert.equal(result.status, 2);
  assert.match(result.stderr, /expected two mark payloads separated by a newline/);
  assert.equal(result.stdout, "");
});
