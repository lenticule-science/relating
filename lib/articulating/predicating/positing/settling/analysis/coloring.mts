/**
 * settling/analysis/coloring — proper graph coloring and the chromatic number.
 *
 * A PROPER coloring assigns colors to the vertices of a bare weighted graph (adjacency = a positive
 * weight) so that adjacent vertices DIFFER; the CHROMATIC NUMBER `χ(G)` is the least number of colors
 * admitting one. Computed exactly by backtracking (NP-hard in general, exact and fine for the finite
 * graphs the corpus carries). A proper coloring is, dynamically, a factor map from the graph to a
 * finite palette — for a tiling adjacency graph, a factor of the tiling system onto a finite shift
 * (the "what information does a coloring encode" reading). Grounding: Evans-Gawlak-Ramsey-Strungaru-
 * Trang, "Colourings of aperiodic tilings" (exact vertex/edge/face chromatic numbers for chair,
 * Ammann-Beenker, pinwheel); the Four Color Theorem / Vizing bound the planar-tiling case.
 *
 * NB the adjacency must be a GENUINE relation (geometric tile-adjacency, predication edges), not one
 * derived from a two-valued vertex attribute — such a graph is 2-colored by the attribute itself and
 * its chromatic number is degenerate.
 */
import { intIsZero, type Matrix } from "./exact-number.mjs";

/** A proper `k`-coloring: a color `0…k-1` per vertex with adjacent vertices differing. */
export interface ProperColoringWitness {
  readonly kind: "meme-analysis.coloring.proper:witness";
  readonly colors: readonly number[];
  readonly colorCount: number;
}
/** No proper `k`-coloring exists (the graph needs more than `k` colors). */
export interface ProperColoringObstruction {
  readonly kind: "meme-analysis.coloring.proper-obstruction";
  readonly colorCount: number;
}
/** The result of a proper-coloring search. */
export type ProperColoringJudgment = ProperColoringWitness | ProperColoringObstruction;

const adjacent = (weights: Matrix, left: number, right: number): boolean =>
  left !== right && !intIsZero(weights[left]![right]!);

/** Whether the bare weighted graph admits a proper `k`-coloring (adjacent vertices differ), by
 *  backtracking. A witness carries the per-vertex color assignment; an obstruction reports the `k`. */
export function properColoring(weights: Matrix, colorCount: number): ProperColoringJudgment {
  const vertices = weights.length;
  const colors = new Array<number>(vertices).fill(-1);
  const extend = (vertex: number): boolean => {
    if (vertex === vertices) return true;
    for (let color = 0; color < colorCount; color += 1) {
      let legal = true;
      for (let prior = 0; prior < vertex; prior += 1) {
        if (adjacent(weights, prior, vertex) && colors[prior] === color) { legal = false; break; }
      }
      if (legal) {
        colors[vertex] = color;
        if (extend(vertex + 1)) return true;
        colors[vertex] = -1;
      }
    }
    return false;
  };
  if (vertices > 0 && colorCount <= 0) return Object.freeze({ kind: "meme-analysis.coloring.proper-obstruction" as const, colorCount });
  return extend(0)
    ? Object.freeze({ kind: "meme-analysis.coloring.proper:witness" as const, colors: Object.freeze(colors.slice()), colorCount })
    : Object.freeze({ kind: "meme-analysis.coloring.proper-obstruction" as const, colorCount });
}

/** The CHROMATIC NUMBER `χ(G)` — the least number of colors admitting a proper vertex coloring, exact
 *  by ascending search. `χ ≤ |V|`; edgeless → 1, bipartite → 2, an odd cycle → 3, complete `Kₙ` → `n`. */
export function chromaticNumber(weights: Matrix): number {
  const vertices = weights.length;
  if (vertices === 0) return 0;
  for (let colorCount = 1; colorCount <= vertices; colorCount += 1) {
    if (properColoring(weights, colorCount).kind === "meme-analysis.coloring.proper:witness") return colorCount;
  }
  return vertices;
}

/** The NUMBER of proper `k`-colorings of the graph — the chromatic polynomial `P(G, k)` evaluated at
 *  `k` — counted exactly by backtracking. `0` ⟺ `k < χ(G)`; for the edgeless graph it is `kⁿ`; for `Kₙ`
 *  it is the falling factorial `k(k-1)⋯(k-n+1)`. */
export function countProperColorings(weights: Matrix, colorCount: number): number {
  const vertices = weights.length;
  if (vertices === 0) return 1;
  const colors = new Array<number>(vertices).fill(-1);
  let count = 0;
  const extend = (vertex: number): void => {
    if (vertex === vertices) { count += 1; return; }
    for (let color = 0; color < colorCount; color += 1) {
      let legal = true;
      for (let prior = 0; prior < vertex; prior += 1) {
        if (adjacent(weights, prior, vertex) && colors[prior] === color) { legal = false; break; }
      }
      if (legal) { colors[vertex] = color; extend(vertex + 1); colors[vertex] = -1; }
    }
  };
  extend(0);
  return count;
}

/**
 * The COLORING ENTROPY at `k` colors: `log₂ P(G, k) / |V|` — the bits of information a proper
 * `k`-coloring carries PER VERTEX. A proper coloring is a factor of the graph onto a `k`-symbol
 * palette; this is the per-tile entropy of that factor. As the tiling patch grows, the per-tile
 * coloring entropy converges to the topological entropy of the coloring shift — a tiling-space
 * invariant FINER than the chromatic number (two tilings can share `χ` but differ in how much
 * freedom a coloring has). `0` when no proper `k`-coloring exists (`k < χ`) or the graph is empty.
 */
export function coloringEntropy(weights: Matrix, colorCount: number): number {
  const vertices = weights.length;
  if (vertices === 0) return 0;
  const count = countProperColorings(weights, colorCount);
  return count === 0 ? 0 : Math.log2(count) / vertices;
}
