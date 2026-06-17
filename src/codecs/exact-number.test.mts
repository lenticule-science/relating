import test from "node:test";
import assert from "node:assert/strict";
import {
  fromDecimalString,
  fromInt,
  fromRatio,
  integerToDecimalString,
  parseDecimal,
  ratToExactString,
  toDecimalString,
} from "./exact-number.mjs";
import { fromInteger, ratEqual } from "../articulating/carriers.mjs";

test("a decimal string parses to an exact rational with its place-count", () => {
  const half = parseDecimal("0.5");
  assert.equal(half.places, 1);
  assert.ok(ratEqual(half.value, fromRatio(1, 2)));

  assert.ok(ratEqual(fromDecimalString("-12.34"), fromRatio(-1234, 100)));
  assert.ok(ratEqual(fromDecimalString("100"), fromRatio(100, 1)));
  assert.equal(parseDecimal("100").places, 0);
  assert.throws(() => parseDecimal("1.2.3"), RangeError);
});

test("exact thirds round-trip through the rational, never through a float", () => {
  const third = fromRatio(1, 3);
  // 1/3 + 1/3 + 1/3 is exactly one — the whole point of staying in carriers.
  assert.equal(ratToExactString(third), "1/3");
  assert.equal(integerToDecimalString(fromInt(-4096)), "-4096");
});

test("the audit string is exact; the fixed-point string rounds half-up", () => {
  assert.equal(ratToExactString(fromRatio(7, 2)), "7/2");
  assert.equal(toDecimalString(fromRatio(7, 2), 2), "3.50");
  assert.equal(toDecimalString(fromRatio(2, 3), 2), "0.67");
  assert.equal(toDecimalString(fromInteger(fromInt(-5)), 0), "-5");
  assert.equal(toDecimalString(fromRatio(1, 2), 0), "1");
});
