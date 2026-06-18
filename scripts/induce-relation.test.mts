import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { articulate, mark, posit, predicate, settle, utterance } from "../src/index.mjs";
import { canonical, requireJsonValue } from "../src/codecs/path/object/attribute/file/flatfile/serialization/json/index.mjs";

const script = fileURLToPath(new URL("./induce-relation.mjs", import.meta.url));

function run(input: string) {
  return spawnSync(process.execPath, [script], {
    input,
    encoding: "utf8",
  });
}

function scriptJson(value: unknown, label: string) {
  return requireJsonValue(JSON.parse(JSON.stringify(value)), label);
}

function expectedSettlement(tokenPayload: string, claimPayload: string) {
  return settle(posit(predicate(articulate(utterance(mark(tokenPayload), mark(claimPayload))))));
}

test("induce-relation pipes two newline-separated payloads into induceRelation", () => {
  const result = run("alpha\nbeta");
  assert.equal(result.status, 0);
  assert.equal(result.stderr, "");

  const expected = expectedSettlement("alpha", "beta");
  assert.equal(result.stdout, `${canonical(scriptJson(expected, "settlement filtration"))}\n`);
});

test("induce-relation preserves everything after the first newline as claim payload", () => {
  const result = run("alpha\nbeta\nmore\n");
  assert.equal(result.status, 0);

  const expected = expectedSettlement("alpha", "beta\nmore\n");
  assert.equal(result.stdout, `${canonical(scriptJson(expected, "settlement filtration"))}\n`);
});

test("induce-relation rejects input without a newline separator", () => {
  const result = run("alpha");
  assert.equal(result.status, 2);
  assert.match(result.stderr, /expected two mark payloads separated by a newline/);
  assert.equal(result.stdout, "");
});
