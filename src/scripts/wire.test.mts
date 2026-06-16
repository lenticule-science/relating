import test from "node:test";
import assert from "node:assert/strict";
import { formatRecords, parseBoundName, parseChargeValueName, parseOrderName, readLog, readRecords } from "./wire.mjs";

test("an observation is re-admissible as token plus rich reading claim", () => {
  const log = readLog(`{"subject":"alice","predicate":"knows","object":"bob","charge":"potential"}`);
  assert.equal(log.length, 1);
  const utterance = log[0]!;
  assert.equal(utterance.token.mark.value, "alice");
  assert.deepEqual(utterance.claim.mark.value, { predicate: "knows", object: "bob", charge: "potential" });
});

test("re-admission carries prior charge only as observed claim data", () => {
  const log = readLog(`{"subject":"a","predicate":"p","object":"b","charge":"active"}`);
  assert.equal(log.length, 1);
  assert.equal(log[0]!.token.mark.value, "a");
  assert.deepEqual(log[0]!.claim.mark.value, { predicate: "p", object: "b", charge: "active" });
});

test("an encoded utterance log still reads as itself: re-admission is additive, not a replacement", () => {
  const log = readLog(`{"token":{"subject":"a","object":"b"},"claim":"p"}`);
  assert.equal(log.length, 1);
  assert.deepEqual(log[0]!.token.mark.value, { subject: "a", object: "b" });
});

test("EAVT rows enter as token plus attribute-value-time claim", () => {
  const tuple = readLog(`["alice","knows","bob","2026-06-16T00:00:00.000Z"]`);
  const object = readLog(`{"e":"alice","a":"knows","v":"bob","t":"2026-06-16T00:00:00.000Z"}`);

  assert.equal(tuple[0]!.token.mark.value, "alice");
  assert.deepEqual(tuple[0]!.claim.mark.value, { a: "knows", v: "bob", t: "2026-06-16T00:00:00.000Z" });
  assert.equal(object[0]!.token.mark.value, "alice");
  assert.deepEqual(object[0]!.claim.mark.value, { a: "knows", v: "bob", t: "2026-06-16T00:00:00.000Z" });
});

test("settled records emit as EAVT with the reading inside the value", () => {
  const text = formatRecords(
    [{ subject: "alice", predicate: "knows", object: "bob", charge: "potential" }],
    "eavt",
    "2026-06-16T00:00:00.000Z",
  );
  assert.equal(text, `["alice","knows",{"charge":"potential","object":"bob"},"2026-06-16T00:00:00.000Z"]\n`);
});

test("settled EAVT output reads back as a section record", () => {
  const records = readRecords(`["alice","knows",{"charge":"potential","object":"bob"},"2026-06-16T00:00:00.000Z"]\n`);
  assert.deepEqual(records, [{ subject: "alice", predicate: "knows", object: "bob", charge: "potential" }]);
});

test("Datoms read back as section records with the fifth slot as reading", () => {
  const records = readRecords(`["alice","knows","bob","2026-06-16T00:00:00.000Z","stable"]\n`);
  assert.deepEqual(records, [{ subject: "alice", predicate: "knows", object: "bob", charge: "stable" }]);
});

test("wire readings reject non-charge names instead of injecting impossible charges", () => {
  assert.throws(
    () => readRecords(`["alice","knows",{"charge":"maybe","object":"bob"},"2026-06-16T00:00:00.000Z"]\n`),
    /not a bilattice charge value name/,
  );
  assert.throws(
    () => readRecords(`["alice","knows","bob","2026-06-16T00:00:00.000Z",{"charge":"stable"}]\n`),
    /expected charge value name/,
  );
  assert.throws(
    () => readRecords(`{"subject":"alice","predicate":"knows","object":"bob"}\n`),
    /expected charge value name/,
  );
});

test("wire flag parsers witness the finite script vocabularies", () => {
  assert.equal(parseOrderName(undefined), "knowledge");
  assert.equal(parseOrderName("truth"), "truth");
  assert.equal(parseBoundName(undefined), "least");
  assert.equal(parseBoundName("greatest"), "greatest");
  assert.equal(parseChargeValueName("stable"), "stable");
  assert.equal(parseChargeValueName(undefined), undefined);
  assert.throws(() => parseOrderName("linear"), /expected knowledge or truth/);
  assert.throws(() => parseBoundName("middle"), /expected least or greatest/);
  assert.throws(() => parseChargeValueName("maybe"), /not a bilattice charge value name/);
});

test("the empty input is the empty relating", () => {
  assert.equal(readLog("").length, 0);
});
