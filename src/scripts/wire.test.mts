import test from "node:test";
import assert from "node:assert/strict";
import { readLog } from "./wire.mjs";

test("an observation is re-admissible: a settled section record becomes a fresh utterance", () => {
  const log = readLog(`{"subject":"alice","predicate":"knows","object":"bob","charge":"potential"}`);
  assert.equal(log.length, 1);
  const utterance = log[0]!;
  assert.deepEqual(utterance.token.mark.value, { subject: "alice", object: "bob" });
  assert.equal(utterance.claim.mark.value, "knows");
});

test("re-admission carries no charge as primitive: the prior charge is dropped, the cell re-affirmed", () => {
  // an `active` observation re-enters as a plain affirmation of its cell — no negative is re-injected.
  const log = readLog(`{"subject":"a","predicate":"p","object":"b","charge":"active"}`);
  assert.equal(log.length, 1);
  assert.deepEqual(log[0]!.token.mark.value, { subject: "a", object: "b" });
});

test("an encoded utterance log still reads as itself: re-admission is additive, not a replacement", () => {
  const log = readLog(`{"token":{"subject":"a","object":"b"},"claim":"p"}`);
  assert.equal(log.length, 1);
  assert.deepEqual(log[0]!.token.mark.value, { subject: "a", object: "b" });
});

test("the empty input is the empty relationality", () => {
  assert.equal(readLog("").length, 0);
});
