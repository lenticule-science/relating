/**
 * @packageDocumentation
 *
 * `@emsenn/relating/evaluating/measuring` exports Lean-grounded closure-regime
 * invariants as RMN terms.
 *
 * These reproduce abstract RelMath theorems and are golden-vectored against Lean
 * via test/fixtures/lean-measurement-golden.jsonl. Domain: `ClosureRegimeData`
 * `{ scottContinuous, finiteBase, countableCofinality }` / `ClosureRegime`.
 *
 * Product reading: measurement facts that are small enough to compute in Node
 * can still live as portable term bodies, with Lean-emitted vectors acting as
 * the oracle for the finite law surface this package actually claims.
 */
import { tm, type Tm } from "../../../lib/notating/index.mjs";
import { objectTerm, stringTerm } from "../projecting/index.mjs";
import {
  aperiodicClosureRegime,
  finiteClosureRegime,
  scottClosureRegime,
  transfiniteClosureRegime,
  type ClosureRegime,
} from "../../../lib/articulating/predicating/positing/settling/closure.mjs";
import { classifyRegime, cohomologyVanishesInRegime } from "../../../lib/articulating/predicating/positing/settling/value-category.mjs";

/** The four closure regimes, IN ORDER, sourced from lib's `ClosureRegime` carriers. The
 *  evaluating layer never re-authors the regime kind strings or the cohomology-vanishing table:
 *  both are owned by `lib/.../settling` and consumed here. */
const CLOSURE_REGIMES: readonly ClosureRegime[] = Object.freeze([
  finiteClosureRegime,
  scottClosureRegime,
  transfiniteClosureRegime,
  aperiodicClosureRegime,
]);

/** A regime-result object term whose `kind` is the lib carrier's kind (single-sourced, not a
 *  hand-written `ordinal.closure.regime.*` literal). */
const regimeConst = (regime: ClosureRegime) => objectTerm([["kind", stringTerm(regime.kind)]]);

/** The regime-result term that lib's `classifyRegime` assigns to a representative datum — each
 *  classify branch's RESULT is computed by lib, not hand-mapped from field to regime. */
const classifiedRegimeConst = (scottContinuous: boolean, finiteBase: boolean, countableCofinality: boolean) =>
  regimeConst(classifyRegime({ kind: "settling.closureRegimeData", scottContinuous, finiteBase, countableCofinality }));

/**
 * `classifyRegime` — `RelMath.ClosureOrdinalRegime.classify` as an IR cond-chain.
 * Domain: `{ scottContinuous, finiteBase, countableCofinality }`. Codomain: relating `ClosureRegime`.
 *
 * @example
 * ```ts
 * import { evaluateRunTerm, measurement } from "@emsenn/relating";
 *
 * const regime = evaluateRunTerm(measurement.classifyRegime, {
 *   kind: "settling.closureRegimeData",
 *   finiteBase: true,
 *   scottContinuous: true,
 *   countableCofinality: true,
 * });
 * // regime.kind === "ordinal.closure.regime.finite"
 * ```
 */
export const classifyRegimeTerm = tm.lam(
  tm.cond(
    tm.field("finiteBase", tm.var(0)),
    classifiedRegimeConst(true, true, true),
    tm.cond(
      tm.field("scottContinuous", tm.var(0)),
      classifiedRegimeConst(true, false, true),
      tm.cond(
        tm.field("countableCofinality", tm.var(0)),
        classifiedRegimeConst(false, false, true),
        classifiedRegimeConst(false, false, false),
      ),
    ),
  ),
);

/**
 * `cohomologyVanishesInRegime` — `RelMath.ClosureOrdinalRegime.cohomologyVanishes` as an IR cond-chain.
 * H¹ vanishes in strict/Scott regimes, is non-trivial in transfinite/aperiodic.
 *
 * @example
 * ```ts
 * import { evaluateRunTerm, measurement } from "@emsenn/relating";
 *
 * const vanishes = evaluateRunTerm(measurement.cohomologyVanishesInRegime, {
 *   kind: "ordinal.closure.regime.finite",
 * });
 * // vanishes === true
 * ```
 */
export const cohomologyVanishesInRegimeTerm = tm.lam(
  CLOSURE_REGIMES.reduceRight<Tm>(
    (elseBranch, regime) => tm.cond(
      tm.coincide(tm.field("kind", tm.var(0)), stringTerm(regime.kind)),
      tm.bool(cohomologyVanishesInRegime(regime)),
      elseBranch,
    ),
    tm.bool(false),
  ),
);
