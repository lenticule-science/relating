import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  articulate,
  mark,
  posit,
  predicate,
  settle,
  utterance,
  type ArticulationCell,
  type PositPresheaf,
  type PredicationSite,
} from "../src/index.mjs";
import { canonical, requireJsonValue } from "../src/codecs/path/object/attribute/file/flatfile/serialization/json/index.mjs";

const articulateScript = fileURLToPath(new URL("./articulate-utterance.mjs", import.meta.url));
const predicateScript = fileURLToPath(new URL("./predicate-articulation-cell.mjs", import.meta.url));
const positScript = fileURLToPath(new URL("./posit-predication-site.mjs", import.meta.url));
const settleScript = fileURLToPath(new URL("./settle-posit-presheaf.mjs", import.meta.url));

function run(script: string, input: string) {
  return spawnSync(process.execPath, [script], {
    input,
    encoding: "utf8",
  });
}

function scriptJson(value: unknown, label: string) {
  return requireJsonValue(JSON.parse(JSON.stringify(value)), label);
}

function expectedPredicationSite(): PredicationSite {
  const cell = articulate(utterance(mark("alpha"), mark("beta\n")));
  return predicate(scriptJson(cell, "articulation cell") as unknown as ArticulationCell);
}

function expectedPositPresheaf(): PositPresheaf {
  return posit(scriptJson(expectedPredicationSite(), "predication site") as unknown as PredicationSite);
}

test("posit-predication-site pipes predicate-articulation-cell output into posit", () => {
  const articulated = run(articulateScript, "alpha\nbeta\n");
  assert.equal(articulated.status, 0);
  const predicated = run(predicateScript, articulated.stdout);
  assert.equal(predicated.status, 0);

  const positioned = run(positScript, predicated.stdout);
  assert.equal(positioned.status, 0);
  assert.equal(positioned.stderr, "");

  assert.equal(positioned.stdout, `${canonical(scriptJson(expectedPositPresheaf(), "posit presheaf"))}\n`);
});

test("settle-posit-presheaf pipes posit-predication-site output into settle", () => {
  const articulated = run(articulateScript, "alpha\nbeta\n");
  assert.equal(articulated.status, 0);
  const predicated = run(predicateScript, articulated.stdout);
  assert.equal(predicated.status, 0);
  const positioned = run(positScript, predicated.stdout);
  assert.equal(positioned.status, 0);

  const settled = run(settleScript, positioned.stdout);
  assert.equal(settled.status, 0);
  assert.equal(settled.stderr, "");

  const expected = settle(scriptJson(expectedPositPresheaf(), "posit presheaf") as unknown as PositPresheaf);
  assert.equal(settled.stdout, `${canonical(scriptJson(expected, "settlement filtration"))}\n`);
});

test("posit-predication-site rejects non-site JSON resources", () => {
  const result = run(positScript, "{\"kind\":\"wrong\"}\n");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /^posit-predication-site:/);
  assert.equal(result.stdout, "");
});

test("settle-posit-presheaf rejects non-presheaf JSON resources", () => {
  const result = run(settleScript, "{\"kind\":\"wrong\"}\n");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /^settle-posit-presheaf:/);
  assert.equal(result.stdout, "");
});
