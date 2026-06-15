import { relationFromMatrix, relationMatrix, stateExtension, type RelationCarrier, type StateExtensionCarrier } from "./bilattice-relation.mjs";
import { entitySet, predicateSet } from "./predication.mjs";
import { chargeValue, type ChargeValue } from "./bilattice-charge.mjs";

export interface MembershipPredicate {
  readonly kind: "exactNumber.membershipPredicate";
}

export const membershipPredicate = (): MembershipPredicate =>
  Object.freeze({ kind: "exactNumber.membershipPredicate" as const });

export const sameMembershipPredicate = (left: MembershipPredicate, right: MembershipPredicate): boolean =>
  left.kind === right.kind;

export interface Natural {
  readonly kind: "exactNumber.natural";
  readonly members: readonly Natural[];
}

function internNatural(memberList: readonly Natural[]): Natural {
  const uniqueMembers: Natural[] = [];
  for (const member of memberList) {
    if (!uniqueMembers.some((item) => natEqual(item, member))) {
      uniqueMembers.push(member);
    }
  }
  uniqueMembers.sort((left, right) => left.members.length - right.members.length);
  return Object.freeze({
    kind: "exactNumber.natural" as const,
    members: Object.freeze(uniqueMembers),
  });
}

export const natZero: Natural = internNatural([]);
// The von Neumann successor n ∪ {n}. n's predecessors are already a canonical
// (deduped, length-sorted) set and n is strictly larger than all of them, so
// appending n preserves the invariant: no re-dedup or re-sort needed. Routing
// through internNatural here repeats that work on every step, turning
// construction into O(value³); building the set directly makes it O(value²).
export const successor = (n: Natural): Natural =>
  Object.freeze({ kind: "exactNumber.natural" as const, members: Object.freeze([...n.members, n]) });
export const natOne: Natural = successor(natZero);
export const members = (n: Natural): readonly Natural[] => Object.freeze([...n.members]);
export const natIsZero = (n: Natural): boolean => n.members.length === 0;
export function natEqual(left: Natural, right: Natural): boolean {
  return toCount(left) === toCount(right);
}
export const isMember = (member: Natural, n: Natural): boolean => toCount(member) < toCount(n);
export const natLeq = (left: Natural, right: Natural): boolean => toCount(left) <= toCount(right);
export const natLess = (left: Natural, right: Natural): boolean => toCount(left) < toCount(right);
export const natCompare = (left: Natural, right: Natural): -1 | 0 | 1 =>
  natEqual(left, right) ? 0 : natLess(left, right) ? -1 : 1;

export const predecessor = (n: Natural): Natural =>
  natIsZero(n) ? natZero : n.members.reduce((left, right) => (left.members.length >= right.members.length ? left : right));

// Addition is the primitive recursion n + 0 = n, n + succ(m) = succ(n + m),
// performed by peeling successors off `right` and applying them to `left`.
// It never leaves the construction — no round-trip through `number`. Iterative
// to avoid stack depth proportional to `right`.
export function natAdd(left: Natural, right: Natural): Natural {
  let sum = left;
  let remaining = right;
  while (!natIsZero(remaining)) {
    sum = successor(sum);
    remaining = predecessor(remaining);
  }
  return sum;
}

// Multiplication still routes through `number`; it is the multiplicative
// structure whose intermediates (e.g. integer determinants) blow up far past
// what the extension can construct, so it belongs to the exact-integer ring
// being split out (see the Ring<T> seam below), not to concept-counting.
export function natMultiply(left: Natural, right: Natural): Natural {
  return fromCount(toCount(left) * toCount(right));
}

// Truncated subtraction: peel both down together; if `left` empties first the
// result is zero. Stays within the set the whole way.
export function monus(left: Natural, right: Natural): Natural {
  let difference = left;
  let remaining = right;
  while (!natIsZero(remaining) && !natIsZero(difference)) {
    difference = predecessor(difference);
    remaining = predecessor(remaining);
  }
  return difference;
}

// Euclidean division by repeated subtraction (anthyphairesis) — the original,
// set-theoretic Euclidean algorithm, with no float division.
export function natDivmod(n: Natural, d: Natural): { readonly quotient: Natural; readonly remainder: Natural } {
  if (natIsZero(d)) throw new RangeError("natural divmod: division by zero");
  let quotientValue = natZero;
  let remainder = n;
  while (natLeq(d, remainder)) {
    remainder = monus(remainder, d);
    quotientValue = successor(quotientValue);
  }
  return Object.freeze({ quotient: quotientValue, remainder });
}

export function gcd(left: Natural, right: Natural): Natural {
  let a = left;
  let b = right;
  while (!natIsZero(b)) {
    const remainder = natDivmod(a, b).remainder;
    a = b;
    b = remainder;
  }
  return a;
}

export function asExtension(n: Natural): RelationCarrier<Natural, MembershipPredicate> {
  const membership = membershipPredicate();
  const universe = [...n.members, n];
  const points = entitySet(universe, natEqual);
  const states = predicateSet([membership], sameMembershipPredicate);
  const entries: Array<readonly [Natural, MembershipPredicate, ChargeValue]> = n.members.map((member) => [member, membership, chargeValue("potential")] as const);
  entries.push([n, membership, chargeValue("absurd")] as const);
  return relationFromMatrix(relationMatrix(points, states, entries, { samePoint: natEqual, sameState: sameMembershipPredicate }));
}

export const extensionOf = (n: Natural): StateExtensionCarrier<Natural, MembershipPredicate> => {
  const extension = asExtension(n);
  return stateExtension(extension, extension.states.predicates[0]!);
};

export const toCount = (n: Natural): number => n.members.length;

export function fromCount(count: number): Natural {
  if (!Number.isInteger(count) || count < 0) throw new RangeError("fromCount: expected a non-negative integer boundary read");
  let natural = natZero;
  for (let index = 0; index < count; index += 1) natural = successor(natural);
  return natural;
}

export interface Integer {
  readonly kind: "exactNumber.integer";
  readonly pos: Natural;
  readonly neg: Natural;
}

function balance(pos: Natural, neg: Natural): Integer {
  return Object.freeze(natLeq(neg, pos)
    ? { kind: "exactNumber.integer" as const, pos: monus(pos, neg), neg: natZero }
    : { kind: "exactNumber.integer" as const, pos: natZero, neg: monus(neg, pos) });
}

export const integer = (pos: Natural, neg: Natural): Integer => balance(pos, neg);
export const fromNatural = (n: Natural): Integer => Object.freeze({ kind: "exactNumber.integer" as const, pos: n, neg: natZero });
export const intZero: Integer = fromNatural(natZero);
export const intOne: Integer = fromNatural(natOne);
export const intNegate = (z: Integer): Integer => Object.freeze({ kind: "exactNumber.integer" as const, pos: z.neg, neg: z.pos });
export const intAdd = (left: Integer, right: Integer): Integer =>
  balance(natAdd(left.pos, right.pos), natAdd(left.neg, right.neg));
export const intSubtract = (left: Integer, right: Integer): Integer => intAdd(left, intNegate(right));
export const intMultiply = (left: Integer, right: Integer): Integer =>
  balance(
    natAdd(natMultiply(left.pos, right.pos), natMultiply(left.neg, right.neg)),
    natAdd(natMultiply(left.pos, right.neg), natMultiply(left.neg, right.pos)),
  );
export const intEqual = (left: Integer, right: Integer): boolean => natEqual(left.pos, right.pos) && natEqual(left.neg, right.neg);
export const equivalent = (left: Integer, right: Integer): boolean =>
  natEqual(natAdd(left.pos, right.neg), natAdd(right.pos, left.neg));
export const intIsZero = (z: Integer): boolean => natIsZero(z.pos) && natIsZero(z.neg);
export const isPositive = (z: Integer): boolean => !natIsZero(z.pos);
export const isNegative = (z: Integer): boolean => !natIsZero(z.neg);
export const sign = (z: Integer): -1 | 0 | 1 => isPositive(z) ? 1 : isNegative(z) ? -1 : 0;
export const magnitude = (z: Integer): Natural => intIsZero(z) ? z.pos : isPositive(z) ? z.pos : z.neg;

export function intDivmod(left: Integer, right: Integer): { readonly quotient: Integer; readonly remainder: Integer } {
  if (intIsZero(right)) throw new RangeError("integer divmod: division by zero");
  const quotientMagnitude = natDivmod(magnitude(left), magnitude(right)).quotient;
  const quotient = sign(left) * sign(right) < 0 ? intNegate(fromNatural(quotientMagnitude)) : fromNatural(quotientMagnitude);
  return Object.freeze({ quotient, remainder: intSubtract(left, intMultiply(quotient, right)) });
}

export const quotient = (left: Integer, right: Integer): Integer => intDivmod(left, right).quotient;
export const divides = (divisor: Integer, value: Integer): boolean => intIsZero(intDivmod(value, divisor).remainder);
export const intCompare = (left: Integer, right: Integer): -1 | 0 | 1 => sign(intSubtract(left, right));
export const toInt = (z: Integer): number => toCount(z.pos) - toCount(z.neg);
export const fromInt = (value: number): Integer =>
  value >= 0 ? fromNatural(fromCount(value)) : intNegate(fromNatural(fromCount(-value)));

export interface Rational {
  readonly kind: "exactNumber.rational";
  readonly num: Integer;
  readonly den: Integer;
}

function canonicalRational(num: Integer, den: Integer): Rational {
  if (intIsZero(den)) throw new RangeError("rational: zero denominator");
  const s = sign(num) * sign(den);
  const mNum = magnitude(num);
  const mDen = magnitude(den);
  if (natIsZero(mNum)) return Object.freeze({ kind: "exactNumber.rational" as const, num: intZero, den: intOne });
  const factor = gcd(mNum, mDen);
  const normalizedNum = fromNatural(natDivmod(mNum, factor).quotient);
  return Object.freeze({
    kind: "exactNumber.rational" as const,
    num: s < 0 ? intNegate(normalizedNum) : normalizedNum,
    den: fromNatural(natDivmod(mDen, factor).quotient),
  });
}

export const rational = (num: Integer, den: Integer): Rational => canonicalRational(num, den);
export const fromInteger = (z: Integer): Rational => Object.freeze({ kind: "exactNumber.rational" as const, num: z, den: intOne });
export const ratZero: Rational = fromInteger(intZero);
export const ratOne: Rational = fromInteger(intOne);
export const ratNegate = (q: Rational): Rational => Object.freeze({ kind: "exactNumber.rational" as const, num: intNegate(q.num), den: q.den });
export const reciprocal = (q: Rational): Rational => canonicalRational(q.den, q.num);
export const ratAdd = (left: Rational, right: Rational): Rational =>
  canonicalRational(intAdd(intMultiply(left.num, right.den), intMultiply(right.num, left.den)), intMultiply(left.den, right.den));
export const ratSubtract = (left: Rational, right: Rational): Rational => ratAdd(left, ratNegate(right));
export const ratMultiply = (left: Rational, right: Rational): Rational =>
  canonicalRational(intMultiply(left.num, right.num), intMultiply(left.den, right.den));
export const divide = (left: Rational, right: Rational): Rational => ratMultiply(left, reciprocal(right));
export const ratEqual = (left: Rational, right: Rational): boolean =>
  intEqual(left.num, right.num) && intEqual(left.den, right.den);
export const ratIsZero = (q: Rational): boolean => intIsZero(q.num);
export const ratSign = (q: Rational): -1 | 0 | 1 => sign(q.num);
export const ratCompare = (left: Rational, right: Rational): -1 | 0 | 1 => ratSign(ratSubtract(left, right));
export const ratFromInt = (value: number): Rational => fromInteger(fromInt(value));
export const fromRatio = (num: number, den: number): Rational => canonicalRational(fromInt(num), fromInt(den));
export const toNumber = (q: Rational): number => toInt(q.num) / toInt(q.den);

export type Matrix = readonly (readonly Integer[])[];

const polyNormalize = (poly: readonly Integer[]): readonly Integer[] => {
  let high = poly.length - 1;
  while (high > 0 && intIsZero(poly[high]!)) high -= 1;
  return Object.freeze(poly.slice(0, high + 1));
};

const polyPad = (left: readonly Integer[], right: readonly Integer[], op: (a: Integer, b: Integer) => Integer): readonly Integer[] => {
  const length = Math.max(left.length, right.length);
  return polyNormalize(Array.from({ length }, (_, index) => op(left[index] ?? intZero, right[index] ?? intZero)));
};

const polyAdd = (left: readonly Integer[], right: readonly Integer[]): readonly Integer[] => polyPad(left, right, intAdd);
const polySub = (left: readonly Integer[], right: readonly Integer[]): readonly Integer[] => polyPad(left, right, intSubtract);
const polyMul = (left: readonly Integer[], right: readonly Integer[]): readonly Integer[] => {
  const result: Integer[] = Array.from({ length: left.length + right.length - 1 }, () => intZero);
  for (let leftIndex = 0; leftIndex < left.length; leftIndex += 1) {
    for (let rightIndex = 0; rightIndex < right.length; rightIndex += 1) {
      result[leftIndex + rightIndex] = intAdd(result[leftIndex + rightIndex]!, intMultiply(left[leftIndex]!, right[rightIndex]!));
    }
  }
  return polyNormalize(result);
};

interface Ring<T> {
  readonly zero: T;
  readonly add: (left: T, right: T) => T;
  readonly sub: (left: T, right: T) => T;
  readonly mul: (left: T, right: T) => T;
}

const integerRing: Ring<Integer> = Object.freeze({ zero: intZero, add: intAdd, sub: intSubtract, mul: intMultiply });
const polyRing: Ring<readonly Integer[]> = Object.freeze({ zero: Object.freeze([intZero]), add: polyAdd, sub: polySub, mul: polyMul });

function det<T>(matrix: readonly (readonly T[])[], ring: Ring<T>): T {
  const n = matrix.length;
  if (n === 1) return matrix[0]![0]!;
  let acc = ring.zero;
  for (let column = 0; column < n; column += 1) {
    const minor = matrix.slice(1).map((row) => row.filter((_, index) => index !== column));
    const term = ring.mul(matrix[0]![column]!, det(minor, ring));
    acc = column % 2 === 0 ? ring.add(acc, term) : ring.sub(acc, term);
  }
  return acc;
}

function integerDeterminant(matrix: Matrix): Integer {
  const n = matrix.length;
  if (n === 0) return intOne;
  if (n === 1) return matrix[0]![0]!;
  const work: Integer[][] = matrix.map((row) => [...row]);
  let signValue = intOne;
  let previousPivot = intOne;

  for (let pivotIndex = 0; pivotIndex < n - 1; pivotIndex += 1) {
    let pivotRow = pivotIndex;
    while (pivotRow < n && intIsZero(work[pivotRow]![pivotIndex]!)) pivotRow += 1;
    if (pivotRow === n) return intZero;
    if (pivotRow !== pivotIndex) {
      [work[pivotIndex], work[pivotRow]] = [work[pivotRow]!, work[pivotIndex]!];
      signValue = intNegate(signValue);
    }

    const pivot = work[pivotIndex]![pivotIndex]!;
    for (let row = pivotIndex + 1; row < n; row += 1) {
      for (let column = pivotIndex + 1; column < n; column += 1) {
        const numerator = intSubtract(
          intMultiply(work[row]![column]!, pivot),
          intMultiply(work[row]![pivotIndex]!, work[pivotIndex]![column]!),
        );
        work[row]![column] = quotient(numerator, previousPivot);
      }
      work[row]![pivotIndex] = intZero;
    }
    previousPivot = pivot;
  }

  return intMultiply(signValue, work[n - 1]![n - 1]!);
}

export const matTranspose = (matrix: Matrix): Matrix =>
  Object.freeze(matrix[0]!.map((_, column) => Object.freeze(matrix.map((row) => row[column]!))));

export const matmul = (left: Matrix, right: Matrix): Matrix =>
  Object.freeze(left.map((row) => Object.freeze(right[0]!.map((_, column) =>
    row.reduce((sum, item, index) => intAdd(sum, intMultiply(item, right[index]![column]!)), intZero)))));

export const matEqual = (left: Matrix, right: Matrix): boolean =>
  left.length === right.length
  && left.every((row, rowIndex) =>
    row.length === right[rowIndex]!.length && row.every((item, columnIndex) => intEqual(item, right[rowIndex]![columnIndex]!)));

export const determinant = (matrix: Matrix): Integer => integerDeterminant(matrix);

export function charPoly(matrix: Matrix): readonly Integer[] {
  const lambdaIMinusM: readonly (readonly (readonly Integer[])[])[] = matrix.map((row, rowIndex) =>
    Object.freeze(row.map((item, columnIndex) =>
      columnIndex === rowIndex ? Object.freeze([intNegate(item), intOne]) : Object.freeze([intNegate(item)]))));
  return det(lambdaIMinusM, polyRing);
}

export function smithNormalForm(matrix: Matrix): readonly Integer[] {
  const work: Integer[][] = matrix.map((row) => [...row]);
  const rows = work.length;
  const columns = work[0]?.length ?? 0;
  const swapRows = (left: number, right: number): void => {
    [work[left], work[right]] = [work[right]!, work[left]!];
  };
  const swapColumns = (left: number, right: number): void => {
    for (const row of work) [row[left], row[right]] = [row[right]!, row[left]!];
  };
  const addRow = (destination: number, source: number, quotientValue: Integer): void => {
    for (let column = 0; column < columns; column += 1) {
      work[destination]![column] = intSubtract(work[destination]![column]!, intMultiply(quotientValue, work[source]![column]!));
    }
  };
  const addColumn = (destination: number, source: number, quotientValue: Integer): void => {
    for (let row = 0; row < rows; row += 1) {
      work[row]![destination] = intSubtract(work[row]![destination]!, intMultiply(quotientValue, work[row]![source]!));
    }
  };

  const limit = Math.min(rows, columns);
  for (let t = 0; t < limit; t += 1) {
    let found = false;
    outer: for (let row = t; row < rows; row += 1) {
      for (let column = t; column < columns; column += 1) {
        if (!intIsZero(work[row]![column]!)) {
          swapRows(t, row);
          swapColumns(t, column);
          found = true;
          break outer;
        }
      }
    }
    if (!found) break;

    for (;;) {
      let changed = false;
      for (let row = t + 1; row < rows; row += 1) {
        if (intIsZero(work[row]![t]!)) continue;
        addRow(row, t, quotient(work[row]![t]!, work[t]![t]!));
        if (!intIsZero(work[row]![t]!)) {
          swapRows(t, row);
          changed = true;
        }
      }
      for (let column = t + 1; column < columns; column += 1) {
        if (intIsZero(work[t]![column]!)) continue;
        addColumn(column, t, quotient(work[t]![column]!, work[t]![t]!));
        if (!intIsZero(work[t]![column]!)) {
          swapColumns(t, column);
          changed = true;
        }
      }
      if (!changed) break;
    }

    let fixed = false;
    outer2: for (let row = t + 1; row < rows; row += 1) {
      for (let column = t + 1; column < columns; column += 1) {
        if (!divides(work[t]![t]!, work[row]![column]!)) {
          addRow(t, row, intNegate(intOne));
          fixed = true;
          break outer2;
        }
      }
    }
    if (fixed) t -= 1;
  }

  const factors: Integer[] = [];
  for (let index = 0; index < limit; index += 1) factors.push(fromNatural(magnitude(work[index]?.[index] ?? intZero)));
  return Object.freeze(factors);
}

export const rank = (matrix: Matrix): Natural => fromCount(smithNormalForm(matrix).filter((factor) => !intIsZero(factor)).length);

export const fromInts = (rows: readonly (readonly number[])[]): Matrix =>
  Object.freeze(rows.map((row) => Object.freeze(row.map(fromInt))));
