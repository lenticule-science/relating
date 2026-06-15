import assert from "node:assert/strict";
import test from "node:test";

import {
  address,
  addressNested,
  composeTerm,
  desanitizeSegment,
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

  assert.equal(termKey("human"), "human");
  assert.equal(segment("human being"), "human~20being");
  assert.equal(desanitizeSegment(sanitizeSegment("human being")), "human being");
  assert.equal(address("/tmp/root", "meme/topology", "json"), "/tmp/root/meme/topology/topology.json");
  assert.equal(logPath("/tmp/root", "meme/topology"), "/tmp/root/meme/topology/topology.jsonl");
  assert.equal(termOf("/tmp/root", "/tmp/root/meme/topology/topology.json"), "meme/topology");
  assert.deepEqual(termOfNested("/tmp/root", nested), ["meme/topology", "proof"]);
  assert.equal(namespaceOf(namespaced), "meme");
  assert.equal(withinNamespace(namespaced, "meme"), true);
});

test("term keys reject values that cannot be serialized safely", () => {
  assert.throws(() => termKey(undefined), /undefined/);
  assert.throws(() => termKey(Symbol("x")), /symbols/);
  assert.throws(() => termKey(Number.POSITIVE_INFINITY), /non-finite/);
});
