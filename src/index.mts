/**
 * @emsenn/relationality — the relational substrate, operationalized.
 *
 * Paraconsistent, transfinitely-valued linear logic of relations. This package
 * merges the former meme-* library packages into one, each now a module
 * subpath:
 *
 *   - `@emsenn/relationality/algebra`   — the pure algebraic substrate:
 *     bilattice charges and the relations on them, exact arithmetic
 *     (Natural → Rational → Matrix), predication (cells = E×Π×E), and the
 *     initial articulation objects (marks, tokens, claims, utterances).
 *   - `@emsenn/relationality/logic`     — bilattice linear logic (fusion ⊗,
 *     residuum ⇒, par ⅋, negation) and the typed theory over it.
 *   - `@emsenn/relationality/topology`  — the inductive carrier and the
 *     closure/settling engine: `induce`/`extend` fold an utterance log through
 *     the descent (articulate → predicate → posit → settle) into a frozen
 *     carrier, with ordinal closure, valuation sheaves, and fixed-point reads.
 *     Engine surfaces live at `./topology/dynamics`, `./topology/arithmetic`,
 *     and (no semver promise) `./topology/internal`.
 *   - `@emsenn/relationality/geometry`  — the spatial geometry (exact
 *     arithmetic in real quadratic fields, 1-D cut-and-project schemes) and the
 *     temporal/causal geometry of a settling.
 *   - `@emsenn/relationality/analysis`  — the spectral geometry of carriers:
 *     the combinatorial Laplacian on the relation graph of sections, harmonic
 *     modes, and evidence readings.
 *   - `@emsenn/relationality/codecs`    — the serialization-boundary codec
 *     between an addressable term and a byte-safe filesystem address/path.
 *
 * The root re-exports each module under its own namespace for discoverability;
 * import the subpaths directly for the flat symbol surface of each module.
 */
export * as algebra from "./algebra/index.mjs";
export * as logic from "./logic/index.mjs";
export * as topology from "./topology/index.mjs";
export * as geometry from "./geometry/index.mjs";
export * as analysis from "./analysis/index.mjs";
export * as codecs from "./codecs/index.mjs";
export * as holography from "./holography/index.mjs";
