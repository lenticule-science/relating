/**
 * Spectral geometry of the relation graph.
 *
 * The relation graph of a section — terms as vertices, weighted by how many
 * cells relate each pair — carries a combinatorial Laplacian, and everything
 * spectral that is exactly computable ships here:
 *
 * - the deviation operator: (Lf)(x) = Σ_y w(x,y)·(f(x) − f(y)) — how an
 *   observable at a term deviates from its relational neighborhood;
 * - harmonic judgment: Lf = 0 exactly — the harmonic modes of the topology's
 *   spectral geometry as a witness/obstruction, not a float threshold;
 * - the component count as a spectral fact: the multiplicity of the zero
 *   eigenvalue is the rank deficiency of L, computed exactly over ℤ;
 * - the characteristic polynomial, exact integer coefficients — the entire
 *   exact content of the spectrum. Numeric eigenvalues are its roots, and
 *   reading them is a boundary question;
 * - the weighted spanning-tree count (a reduced-Laplacian determinant) —
 *   an exact integer complexity of the relation graph.
 *
 * Reflexive cells (a term related to itself) contribute nothing to
 * deviation and are ignored by the Laplacian. Observables at this surface
 * are integer-valued; deviation is linear, so a rational observable is
 * read by clearing denominators.
 */

import {
  predicationTermIdentity,
  sectionOf,
  type MemeTopologyCarrier,
  type PredicationTerm,
  type SectionCarrier,
} from "../topology/index.mjs";
import {
  charPoly,
  determinant,
  fromInt,
  fromInts,
  matmul,
  rank,
  toCount,
  toInt,
  type Integer,
  type Matrix,
} from "../algebra/index.mjs";

const sameTerm = (left: PredicationTerm, right: PredicationTerm): boolean =>
  predicationTermIdentity(left, right).kind === "predication.termIdentity:witness";

export interface RelationGraphCarrier {
  readonly kind: "meme-analysis.laplacian.graph";
  readonly terms: readonly PredicationTerm[];
  /** weights[i][j] = number of cells relating terms i and j (i ≠ j);
   *  reflexive cells are not edges. Exact small integers. */
  readonly weights: readonly (readonly number[])[];
}

/** The relation graph of a section: distinct terms, weighted adjacency. */
export function relationGraph(section: SectionCarrier): RelationGraphCarrier {
  if (section.entries.length === 0) throw new TypeError("an empty section presents no relation graph");
  const terms: PredicationTerm[] = [];
  const indexOf = (term: PredicationTerm): number => {
    const found = terms.findIndex((candidate) => sameTerm(candidate, term));
    if (found !== -1) return found;
    terms.push(term);
    return terms.length - 1;
  };
  const pairs: (readonly [number, number])[] = [];
  for (const entry of section.entries) {
    const subject = indexOf(entry.cell.subject);
    const object = indexOf(entry.cell.object);
    if (subject !== object) pairs.push([subject, object]);
  }
  const weights = terms.map((_, row) => terms.map((__, column) =>
    pairs.filter(([a, b]) => (a === row && b === column) || (a === column && b === row)).length));
  return Object.freeze({
    kind: "meme-analysis.laplacian.graph" as const,
    terms: Object.freeze(terms),
    weights: Object.freeze(weights.map((row) => Object.freeze(row))),
  });
}

/** The relation graph of a carrier, read at the knowledge-least section. */
export function carrierRelationGraph(carrier: MemeTopologyCarrier): RelationGraphCarrier {
  return relationGraph(sectionOf(carrier, "knowledge", "least"));
}

/** The combinatorial Laplacian L = D − W, exact integer entries. */
export function laplacianOf(graph: RelationGraphCarrier): Matrix {
  return fromInts(graph.weights.map((row, index) =>
    row.map((weight, column) =>
      column === index ? row.reduce((sum, value) => sum + value, 0) : -weight)));
}

const requireObservable = (graph: RelationGraphCarrier, values: readonly number[]): void => {
  if (values.length !== graph.terms.length) {
    throw new TypeError("an observable assigns a value to every term of the graph");
  }
  if (!values.every(Number.isInteger)) {
    throw new TypeError("observables are integer-valued at this surface; clear denominators");
  }
};

/** The deviation operator applied to an observable: how each term's value
 *  deviates from its relational neighborhood. Exact. */
export function deviationOf(graph: RelationGraphCarrier, values: readonly number[]): readonly number[] {
  requireObservable(graph, values);
  const column = matmul(laplacianOf(graph), fromInts(values.map((value) => [value])));
  return Object.freeze(column.map((row) => toInt(row[0]!)));
}

export interface HarmonicWitness {
  readonly kind: "meme-analysis.laplacian.harmonic:witness";
  readonly graph: RelationGraphCarrier;
  readonly values: readonly number[];
}

export interface HarmonicObstruction {
  readonly kind: "meme-analysis.laplacian.harmonic-obstruction";
  readonly graph: RelationGraphCarrier;
  readonly values: readonly number[];
  /** The first term whose deviation is nonzero, with that deviation. */
  readonly atTerm: PredicationTerm;
  readonly deviation: number;
}

export type HarmonicJudgment = HarmonicWitness | HarmonicObstruction;

/** Harmonic judgment: the observable is a harmonic mode exactly when its
 *  deviation vanishes at every term. */
export function harmonic(graph: RelationGraphCarrier, values: readonly number[]): HarmonicJudgment {
  const deviations = deviationOf(graph, values);
  const failing = deviations.findIndex((value) => value !== 0);
  if (failing !== -1) {
    return Object.freeze({
      kind: "meme-analysis.laplacian.harmonic-obstruction" as const,
      graph,
      values: Object.freeze([...values]),
      atTerm: graph.terms[failing]!,
      deviation: deviations[failing]!,
    });
  }
  return Object.freeze({
    kind: "meme-analysis.laplacian.harmonic:witness" as const,
    graph,
    values: Object.freeze([...values]),
  });
}

/** The number of connected components — the multiplicity of the zero
 *  eigenvalue of L, computed exactly as its rank deficiency over ℤ. */
export function componentCount(graph: RelationGraphCarrier): number {
  return graph.terms.length - toCount(rank(laplacianOf(graph)));
}

/** The characteristic polynomial of L, lowest degree first, exact integer
 *  coefficients — the entire exact content of the spectrum. Its numeric
 *  roots are the eigenvalues; reading them is a boundary question. */
export function spectrumPolynomial(graph: RelationGraphCarrier): readonly Integer[] {
  return charPoly(laplacianOf(graph));
}

/** The weighted spanning-tree count: the determinant of the Laplacian with
 *  one term struck (Matrix-Tree). Zero exactly when the graph is
 *  disconnected. A graph on one term has the empty tree: one. */
export function treeCount(graph: RelationGraphCarrier): Integer {
  if (graph.terms.length === 1) return fromInt(1);
  const laplacian = laplacianOf(graph);
  const reduced = laplacian.slice(1).map((row) => row.slice(1));
  return determinant(fromInts(reduced.map((row) => row.map((entry) => toInt(entry)))));
}
