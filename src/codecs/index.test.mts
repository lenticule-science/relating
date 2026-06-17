import assert from "node:assert/strict";
import test from "node:test";

import {
  address,
  addressNested,
  composeTerm,
  desanitizeSegment,
  eavtLogPaths,
  logPath,
  namespaceOf,
  sanitizeSegment,
  segment,
  termKey,
  termOf,
  termOfNested,
  withinNamespace,
} from "./index.mjs";

test("addressing projects terms to serialized filesystem addresses", () => {
  const namespaced = composeTerm("meme", ["topology", "proof"]);
  const nested = addressNested("/tmp/root", ["meme/topology", "proof"], "json");
  const rich = addressNested("/tmp/root", [{ b: 2, a: 1 }, "proof"], "json");

  assert.equal(termKey("human"), "human");
  assert.equal(termKey({ b: 2, a: 1 }), '~json:{"a":1,"b":2}');
  assert.equal(termKey({ z: [{ b: 2, a: 1 }], a: true }), '~json:{"a":true,"z":[{"a":1,"b":2}]}');
  assert.equal(segment("human being"), "human~20being");
  assert.equal(desanitizeSegment(sanitizeSegment("human being")), "human being");
  assert.equal(address("/tmp/root", "meme/topology", "json"), "/tmp/root/meme/topology/topology.json");
  assert.equal(logPath("/tmp/root", "meme/topology"), "/tmp/root/meme/topology/topology.jsonl");
  assert.deepEqual(eavtLogPaths("/tmp/root", { e: "ada", a: "knows", v: "charles", t: "tx-1" }), [
    "/tmp/root/ada/ada.jsonl",
    "/tmp/root/knows/knows.jsonl",
  ]);
  assert.equal(termOf("/tmp/root", "/tmp/root/meme/topology/topology.json"), "meme/topology");
  assert.deepEqual(termOfNested("/tmp/root", nested), ["meme/topology", "proof"]);
  assert.deepEqual(termOfNested("/tmp/root", rich), ['~json:{"a":1,"b":2}', "proof"]);
  assert.equal(namespaceOf(namespaced), "meme");
  assert.equal(withinNamespace(namespaced, "meme"), true);
});

test("term keys reject non-finite JSON numbers", () => {
  assert.throws(() => termKey(Number.POSITIVE_INFINITY), /non-finite/);
});
