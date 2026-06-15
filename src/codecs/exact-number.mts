/**
 * codecs/exact-number — the relational-number ↔ JS-number codec.
 *
 * The single boundary where exact carrier numbers (Natural / Integer / Rational
 * / Matrix) cross to and from machine `number`. Core algebra/topology/geometry/
 * analysis never import these — they speak carriers. Scripts, displays, tests,
 * and inherently-numeric boundary routines (Shannon bits, quadratic-irrational
 * floats, ordinal labels) decode and encode here.
 *
 * Formerly the door cluster at the foot of algebra/exact-number; relocated so the
 * foundation's own modules are `number`-free and the boundary is named.
 */

import {
  fromInteger,
  fromNatural,
  intNegate,
  natZero,
  rational,
  successor,
  type Integer,
  type Matrix,
  type Natural,
  type Rational,
} from "../algebra/index.mjs";

/** Decode — a natural's member-count as a native number. */
export const toCount = (n: Natural): number => n.members.length;

/** Encode — a non-negative JS integer as a natural by iterated successor. */
export function fromCount(value: number): Natural {
  if (!Number.isInteger(value) || value < 0) throw new RangeError("fromCount: expected a non-negative integer boundary read");
  let natural = natZero;
  for (let index = 0; index < value; index += 1) natural = successor(natural);
  return natural;
}

/** Decode — an integer to a native number: positive-part count minus negative-part count. */
export const toInt = (z: Integer): number => toCount(z.pos) - toCount(z.neg);

/** Encode — a native number as an integer: non-negative as a positive part, negative as its negation. */
export const fromInt = (value: number): Integer =>
  value >= 0 ? fromNatural(fromCount(value)) : intNegate(fromNatural(fromCount(-value)));

/** Encode — a native integer as a rational with denominator one. */
export const ratFromInt = (value: number): Rational => fromInteger(fromInt(value));

/** Encode — native numerator and denominator as a reduced rational. */
export const fromRatio = (num: number, den: number): Rational => rational(fromInt(num), fromInt(den));

/** Decode — a rational's native floating-point value: numerator over denominator. Lossy. */
export const toNumber = (q: Rational): number => toInt(q.num) / toInt(q.den);

/** Encode — rows of native integers as an exact integer Matrix. */
export const fromInts = (rows: readonly (readonly number[])[]): Matrix =>
  Object.freeze(rows.map((row) => Object.freeze(row.map(fromInt))));
