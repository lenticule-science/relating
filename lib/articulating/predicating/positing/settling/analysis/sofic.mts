/**
 * settling/analysis/sofic — finite symbolic-dynamics witnesses.
 *
 * This is the executable shadow of `RelMath.Aperiodic.SoficShift`: an SFT is a
 * finite directed transition graph, an admissible word is a directed walk, and a
 * sofic word is the 1-block factor image of such a walk. The surface stays finite
 * and exact: it checks words, computes factor images, and carries the golden-mean
 * and Fibonacci/decorated sofic witnesses as serializable receipts.
 */

export type DirectedGraph = readonly (readonly boolean[])[];
export type Word = readonly number[];
export type FactorMap = readonly number[];

const requireNatIndex = (name: string, value: number): void => {
  if (!Number.isSafeInteger(value) || value < 0) throw new RangeError(`${name}: expected a non-negative safe integer`);
};

function requireGraph(graph: DirectedGraph): void {
  if (!Array.isArray(graph)) throw new TypeError("sofic graph: expected an adjacency matrix");
  for (const row of graph) {
    if (!Array.isArray(row) || row.length !== graph.length) {
      throw new TypeError("sofic graph: expected a square boolean adjacency matrix");
    }
    for (const entry of row) {
      if (typeof entry !== "boolean") throw new TypeError("sofic graph: adjacency entries must be boolean");
    }
  }
}

function requireWord(graph: DirectedGraph, word: Word): void {
  for (const [index, symbol] of word.entries()) {
    requireNatIndex(`word[${index}]`, symbol);
    if (symbol >= graph.length) throw new RangeError(`word[${index}]: symbol is outside the graph alphabet`);
  }
}

function firstFailedTransition(graph: DirectedGraph, word: Word): number | null {
  for (let index = 0; index + 1 < word.length; index += 1) {
    if (graph[word[index]!]![word[index + 1]!] !== true) return index;
  }
  return null;
}

export interface PathWitness {
  readonly kind: "sofic.path:witness";
  readonly word: readonly number[];
  readonly length: number;
  readonly transitions: number;
  readonly admissible: true;
}

export interface PathObstruction {
  readonly kind: "sofic.path-obstruction";
  readonly word: readonly number[];
  readonly length: number;
  readonly transitions: number;
  readonly admissible: false;
  readonly failedAt: number;
  readonly edge: readonly [number, number];
}

export type PathJudgment = PathWitness | PathObstruction;

/** Check whether a finite word is a directed walk in the transition graph. */
export function path(graph: DirectedGraph, word: Word): PathJudgment {
  requireGraph(graph);
  requireWord(graph, word);
  const frozenWord = Object.freeze([...word]);
  const failedAt = firstFailedTransition(graph, word);
  if (failedAt === null) {
    return Object.freeze({
      kind: "sofic.path:witness" as const,
      word: frozenWord,
      length: word.length,
      transitions: Math.max(0, word.length - 1),
      admissible: true as const,
    });
  }
  return Object.freeze({
    kind: "sofic.path-obstruction" as const,
    word: frozenWord,
    length: word.length,
    transitions: Math.max(0, word.length - 1),
    admissible: false as const,
    failedAt,
    edge: Object.freeze([word[failedAt]!, word[failedAt + 1]!] as const),
  });
}

export interface SoficImageWitness {
  readonly kind: "sofic.image:witness";
  readonly preimage: readonly number[];
  readonly image: readonly number[];
  readonly factor: readonly number[];
  readonly path: PathWitness;
}

export interface SoficImageObstruction {
  readonly kind: "sofic.image-obstruction";
  readonly reason: "path" | "factor-domain";
  readonly preimage: readonly number[];
  readonly image: readonly number[];
  readonly factor: readonly number[];
  readonly path: PathJudgment;
}

export type SoficImageJudgment = SoficImageWitness | SoficImageObstruction;

/** Compute the 1-block factor image of an admissible SFT word. */
export function soficImage(graph: DirectedGraph, factor: FactorMap, preimage: Word): SoficImageJudgment {
  requireGraph(graph);
  requireWord(graph, preimage);
  for (const [index, symbol] of factor.entries()) {
    requireNatIndex(`factor[${index}]`, symbol);
  }
  const pathJudgment = path(graph, preimage);
  const factorDomain = preimage.every((symbol) => symbol < factor.length);
  const image = factorDomain ? Object.freeze(preimage.map((symbol) => factor[symbol]!)) : Object.freeze([] as number[]);
  const base = {
    preimage: Object.freeze([...preimage]),
    image,
    factor: Object.freeze([...factor]),
    path: pathJudgment,
  };
  if (pathJudgment.kind === "sofic.path:witness" && factorDomain) {
    return Object.freeze({ kind: "sofic.image:witness" as const, ...base, path: pathJudgment });
  }
  return Object.freeze({
    kind: "sofic.image-obstruction" as const,
    ...base,
    reason: factorDomain ? "path" as const : "factor-domain" as const,
  });
}

/** Golden-mean alphabet: `0 = a`, `1 = b`; the only forbidden adjacent pair is `bb`. */
export const goldenMeanGraph: DirectedGraph = Object.freeze([
  Object.freeze([true, true]),
  Object.freeze([true, false]),
]);

/** The Fibonacci substitution `a -> ab`, `b -> a`, encoded over `0=a`, `1=b`. */
export function fibSubstitute(word: Word): readonly number[] {
  for (const [index, symbol] of word.entries()) {
    if (symbol !== 0 && symbol !== 1) throw new RangeError(`fibSubstitute word[${index}]: expected 0 or 1`);
  }
  return Object.freeze(word.flatMap((symbol) => symbol === 0 ? [0, 1] : [0]));
}

export interface GoldenForbidsBBWitness {
  readonly kind: "sofic.goldenMean.forbidsBB:witness";
  readonly word: readonly number[];
  readonly path: PathObstruction;
  readonly forbiddenPair: readonly [1, 1];
}

/** The golden-mean SFT rejects every word beginning with `bb`. */
export function goldenForbidsBB(suffix: Word = Object.freeze([])): GoldenForbidsBBWitness {
  const word = Object.freeze([1, 1, ...suffix]);
  const pathJudgment = path(goldenMeanGraph, word);
  if (pathJudgment.kind !== "sofic.path-obstruction") {
    throw new Error("goldenForbidsBB: invariant failure, bb should be forbidden");
  }
  return Object.freeze({
    kind: "sofic.goldenMean.forbidsBB:witness" as const,
    word,
    path: pathJudgment,
    forbiddenPair: Object.freeze([1, 1] as const),
  });
}

export interface FibSubstituteGoldenWitness {
  readonly kind: "sofic.fibonacciSubstitution.golden:witness";
  readonly source: readonly number[];
  readonly substituted: readonly number[];
  readonly path: PathWitness;
}

export interface FibSubstituteGoldenObstruction {
  readonly kind: "sofic.fibonacciSubstitution.golden-obstruction";
  readonly source: readonly number[];
  readonly substituted: readonly number[];
  readonly path: PathJudgment;
}

export type FibSubstituteGoldenJudgment = FibSubstituteGoldenWitness | FibSubstituteGoldenObstruction;

/** Finite carrier for Lean `fib_substitute_golden`. */
export function fibSubstituteGolden(word: Word): FibSubstituteGoldenJudgment {
  const substituted = fibSubstitute(word);
  const pathJudgment = path(goldenMeanGraph, substituted);
  const base = {
    source: Object.freeze([...word]),
    substituted,
    path: pathJudgment,
  };
  if (pathJudgment.kind === "sofic.path:witness") {
    return Object.freeze({ kind: "sofic.fibonacciSubstitution.golden:witness" as const, ...base, path: pathJudgment });
  }
  return Object.freeze({ kind: "sofic.fibonacciSubstitution.golden-obstruction" as const, ...base });
}

/** Decorated alphabet: `0=(a,0)`, `1=(b,0)`, `2=(a,1)`. */
export const decoratedGoldenGraph: DirectedGraph = Object.freeze([
  Object.freeze([false, true, false]),
  Object.freeze([true, false, true]),
  Object.freeze([true, false, false]),
]);

/** The decorated Fibonacci substitution: `a -> (a,0)(b,0)`, `b -> (a,1)`. */
export function decoratedFibSubstitute(word: Word): readonly number[] {
  for (const [index, symbol] of word.entries()) {
    if (symbol !== 0 && symbol !== 1) throw new RangeError(`decoratedFibSubstitute word[${index}]: expected 0 or 1`);
  }
  return Object.freeze(word.flatMap((symbol) => symbol === 0 ? [0, 1] : [2]));
}

/** The forgetful decoration factor `(a,0)->a`, `(b,0)->b`, `(a,1)->a`. */
export const forgetDecoration: FactorMap = Object.freeze([0, 1, 0]);

export interface FibDeepSoficWitness {
  readonly kind: "sofic.fibonacciSubstitution.deep:witness";
  readonly source: readonly number[];
  readonly substituted: readonly number[];
  readonly decorated: readonly number[];
  readonly sourcePath: PathWitness;
  readonly decoratedPath: PathWitness;
  readonly sofic: SoficImageWitness;
  readonly forgetsToSubstitution: true;
}

export interface FibDeepSoficObstruction {
  readonly kind: "sofic.fibonacciSubstitution.deep-obstruction";
  readonly reason: "source" | "decorated" | "factor";
  readonly source: readonly number[];
  readonly substituted: readonly number[];
  readonly decorated: readonly number[];
  readonly sourcePath: PathJudgment;
  readonly decoratedPath: PathJudgment;
  readonly sofic: SoficImageJudgment;
  readonly forgetsToSubstitution: boolean;
}

export type FibDeepSoficJudgment = FibDeepSoficWitness | FibDeepSoficObstruction;

/** Finite carrier for the decorated golden-case deep sofic cover. */
export function fibDeepSofic(word: Word): FibDeepSoficJudgment {
  const sourcePath = path(goldenMeanGraph, word);
  const substituted = fibSubstitute(word);
  const decorated = decoratedFibSubstitute(word);
  const decoratedPath = path(decoratedGoldenGraph, decorated);
  const sofic = soficImage(decoratedGoldenGraph, forgetDecoration, decorated);
  const forgetsToSubstitution = sofic.kind === "sofic.image:witness"
    && sofic.image.length === substituted.length
    && sofic.image.every((symbol, index) => symbol === substituted[index]);
  const base = {
    source: Object.freeze([...word]),
    substituted,
    decorated,
    sourcePath,
    decoratedPath,
    sofic,
    forgetsToSubstitution,
  };
  if (
    sourcePath.kind === "sofic.path:witness"
    && decoratedPath.kind === "sofic.path:witness"
    && sofic.kind === "sofic.image:witness"
    && forgetsToSubstitution
  ) {
    return Object.freeze({
      kind: "sofic.fibonacciSubstitution.deep:witness" as const,
      ...base,
      sourcePath,
      decoratedPath,
      sofic,
      forgetsToSubstitution: true as const,
    });
  }
  return Object.freeze({
    kind: "sofic.fibonacciSubstitution.deep-obstruction" as const,
    ...base,
    reason: sourcePath.kind !== "sofic.path:witness" ? "source" as const
      : decoratedPath.kind !== "sofic.path:witness" ? "decorated" as const
        : "factor" as const,
  });
}
