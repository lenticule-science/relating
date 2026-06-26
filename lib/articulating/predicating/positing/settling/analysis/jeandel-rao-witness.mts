/**
 * analysis/jeandel-rao-witness - finite Jeandel-Rao AP cohomology witnesses.
 *
 * This is the executable finite shadow of:
 * - RelMath.Aperiodic.Witness.JeandelRao
 *
 * It models the one-vertex Anderson-Putnam cochain complexes from the Lean
 * module, checks the degree-1 coboundary, and packages the two nonzero H1
 * witness cochains. It does not claim Jeandel-Rao aperiodicity, persistence
 * through the desubstitution/direct-limit system, or completeness of cl-inv.
 */
import {
  count,
  fromNatural,
  intNegate,
  intZero,
  magnitude,
  monus,
  natEqual,
  rank,
  sign,
  successor,
  type Matrix,
  type Integer,
  type Natural,
} from "./exact-number.mjs";

export interface OneVertexComplex {
  readonly kind: "jeandelRao.oneVertexComplex";
  readonly name: string;
  readonly edges: readonly string[];
  readonly faces: readonly string[];
  readonly d2: Matrix;
  readonly h1RankClaim?: Natural;
}

export interface Cochain {
  readonly kind: "jeandelRao.cochain";
  readonly complex: string;
  readonly values: Readonly<Record<string, number>>;
}

export interface NonzeroH1Witness {
  readonly kind: "jeandelRao.nonzeroH1:witness";
  readonly theorem:
    | "RelMath.Aperiodic.Witness.jeandelRaoMarker01_nonzero_h1_shadow"
    | "RelMath.Aperiodic.Witness.markerRing_b3_nonzero_h1_shadow";
  readonly complex: OneVertexComplex;
  readonly cochain: Cochain;
  readonly delta1: readonly number[];
  readonly isCocycle: true;
  readonly nonzeroEdge: string;
  readonly nonzeroValue: number;
  readonly delta0Vanishes: true;
  readonly h1Rank: Natural;
  readonly h1RankMatchesLeanClaim: boolean;
  readonly representsNonzeroH1: true;
  readonly scopeBoundary:
    "finite local AP witness only; no Jeandel-Rao aperiodicity or direct-limit persistence";
}

export interface JeandelRaoWitnessReceipt {
  readonly kind: "jeandelRao.receipt:witness";
  readonly decoratedPhi: NonzeroH1Witness;
  readonly markerRingB3: NonzeroH1Witness;
  readonly decoratedPullbackBoundary:
    "phi is documented as geometric decorated pullback of b3, not a runtime chain map";
  readonly persistenceBoundary:
    "open thm:jeandel-rao-persistence";
}

const assertSafeInteger = (value: number, label: string): void => {
  if (!Number.isSafeInteger(value)) throw new RangeError(`${label}: expected a safe integer`);
};

const natFromNumber = (value: number): Natural => {
  if (!Number.isSafeInteger(value) || value < 0) throw new RangeError("jeandelRao: expected a safe natural");
  let n: Natural = count([]);
  for (let i = 0; i < value; i += 1) n = successor(n);
  return n;
};

const intFromNumber = (value: number): Integer => {
  assertSafeInteger(value, "jeandelRao.integer");
  if (value === 0) return intZero;
  const magnitudeValue = fromNatural(natFromNumber(Math.abs(value)));
  return value < 0 ? intNegate(magnitudeValue) : magnitudeValue;
};

const exactRow = (values: readonly number[]): readonly Integer[] => Object.freeze(values.map(intFromNumber));

const intToNumber = (value: Integer): number => sign(value) * magnitude(value).members.length;

const assertComplexShape = (complex: OneVertexComplex): void => {
  if (complex.d2.length !== complex.faces.length) {
    throw new TypeError("jeandelRao: d2 must have one row per face");
  }
  for (const row of complex.d2) {
    if (row.length !== complex.edges.length) {
      throw new TypeError("jeandelRao: each d2 row must have one column per edge");
    }
  }
};

const valueAt = (cochain: Cochain, edge: string): number => {
  const value = cochain.values[edge] ?? 0;
  assertSafeInteger(value, `jeandelRao.${cochain.complex}.${edge}`);
  return value;
};

/** The decorated marker-domino witness complex `jrComplex`. */
export const jrComplex: OneVertexComplex = Object.freeze({
  kind: "jeandelRao.oneVertexComplex" as const,
  name: "jrComplex",
  edges: Object.freeze(["e0", "e1", "e2", "e3", "e4", "e5"]),
  faces: Object.freeze(["f0", "f1", "f2"]),
  d2: Object.freeze([
    exactRow([1, -1, 1, -1, 0, 0]),
    exactRow([0, 0, 1, -1, 1, -1]),
    exactRow([0, 0, 1, -1, 1, -1]),
  ]),
});

/** The decorated cochain `phi`, supported on `e2` and `e3`. */
export const phi: Cochain = Object.freeze({
  kind: "jeandelRao.cochain" as const,
  complex: jrComplex.name,
  values: Object.freeze({ e2: 1, e3: 1 }),
});

/** The marker-ring quotient complex. */
export const markerRingComplex: OneVertexComplex = Object.freeze({
  kind: "jeandelRao.oneVertexComplex" as const,
  name: "markerRingComplex",
  edges: Object.freeze(["q0", "q1", "q2", "q3", "q4", "q5", "q6"]),
  faces: Object.freeze(["g0", "g1", "g2", "g3"]),
  d2: Object.freeze([
    exactRow([0, 1, -1, 0, 0, 0, 0]),
    exactRow([0, 0, 0, 0, 0, 0, 0]),
    exactRow([0, 0, 1, 0, 0, -1, 0]),
    exactRow([0, -1, 0, 0, 0, 1, 0]),
  ]),
  h1RankClaim: count([0, 1, 2, 3, 4]),
});

/** The isolated marker-ring class `b3 = q1 + q2 + q5`. */
export const b3: Cochain = Object.freeze({
  kind: "jeandelRao.cochain" as const,
  complex: markerRingComplex.name,
  values: Object.freeze({ q1: 1, q2: 1, q5: 1 }),
});

/** The degree-1 coboundary `delta1(cochain)(face) = sum_e d2(face,e) * cochain(e)`. */
export function delta1(complex: OneVertexComplex, cochain: Cochain): readonly number[] {
  assertComplexShape(complex);
  if (cochain.complex !== complex.name) {
    throw new TypeError("jeandelRao.delta1: cochain belongs to a different complex");
  }
  return Object.freeze(complex.d2.map((row) => {
    let total = 0;
    row.forEach((coefficient, index) => {
      total += intToNumber(coefficient) * valueAt(cochain, complex.edges[index]!);
    });
    assertSafeInteger(total, "jeandelRao.delta1");
    return total;
  }));
}

export function isCocycle(complex: OneVertexComplex, cochain: Cochain): boolean {
  return delta1(complex, cochain).every((value) => value === 0);
}

export function nonzeroSupport(complex: OneVertexComplex, cochain: Cochain): readonly string[] {
  if (cochain.complex !== complex.name) {
    throw new TypeError("jeandelRao.nonzeroSupport: cochain belongs to a different complex");
  }
  return Object.freeze(complex.edges.filter((edge) => valueAt(cochain, edge) !== 0));
}

/** Since the AP complexes are one-vertex, `delta0 = 0`; H1 rank is `|edges| - rank(delta1)`. */
export function h1Rank(complex: OneVertexComplex): Natural {
  assertComplexShape(complex);
  return monus(count(complex.edges), rank(complex.d2));
}

export function nonzeroH1Witness(
  theorem: NonzeroH1Witness["theorem"],
  complex: OneVertexComplex,
  cochain: Cochain,
): NonzeroH1Witness {
  const boundary = delta1(complex, cochain);
  if (!boundary.every((value) => value === 0)) {
    throw new TypeError("jeandelRao.nonzeroH1Witness: cochain is not closed");
  }
  const support = nonzeroSupport(complex, cochain);
  const nonzeroEdge = support[0];
  if (nonzeroEdge === undefined) {
    throw new TypeError("jeandelRao.nonzeroH1Witness: cochain is zero");
  }
  const rankValue = h1Rank(complex);
  return Object.freeze({
    kind: "jeandelRao.nonzeroH1:witness" as const,
    theorem,
    complex,
    cochain,
    delta1: boundary,
    isCocycle: true as const,
    nonzeroEdge,
    nonzeroValue: valueAt(cochain, nonzeroEdge),
    delta0Vanishes: true as const,
    h1Rank: rankValue,
    h1RankMatchesLeanClaim: complex.h1RankClaim === undefined ? true : natEqual(rankValue, complex.h1RankClaim),
    representsNonzeroH1: true as const,
    scopeBoundary: "finite local AP witness only; no Jeandel-Rao aperiodicity or direct-limit persistence" as const,
  });
}

export function decoratedPhiWitness(): NonzeroH1Witness {
  return nonzeroH1Witness(
    "RelMath.Aperiodic.Witness.jeandelRaoMarker01_nonzero_h1_shadow",
    jrComplex,
    phi,
  );
}

export function markerRingB3Witness(): NonzeroH1Witness {
  return nonzeroH1Witness(
    "RelMath.Aperiodic.Witness.markerRing_b3_nonzero_h1_shadow",
    markerRingComplex,
    b3,
  );
}

export function receipt(): JeandelRaoWitnessReceipt {
  return Object.freeze({
    kind: "jeandelRao.receipt:witness" as const,
    decoratedPhi: decoratedPhiWitness(),
    markerRingB3: markerRingB3Witness(),
    decoratedPullbackBoundary: "phi is documented as geometric decorated pullback of b3, not a runtime chain map" as const,
    persistenceBoundary: "open thm:jeandel-rao-persistence" as const,
  });
}
