/**
 * expressing/evaluating/measuring — Lean-grounded closure-regime invariants as RMN terms.
 *
 * These reproduce abstract RelMath theorems and are golden-vectored against Lean
 * via test/fixtures/lean-measurement-golden.jsonl. Domain: `ClosureRegimeData`
 * `{ scottContinuous, finiteBase, countableCofinality }` / `ClosureRegime`.
 */
import { tm } from "../../notating/index.mjs";
import { objectTerm, stringTerm } from "../../projecting/index.mjs";

const regimeConst = (regime: string) => objectTerm([["kind", stringTerm(`ordinal.closure.regime.${regime}`)]]);

/**
 * `classifyRegime` — `RelMath.ClosureOrdinalRegime.classify` as an IR cond-chain.
 * Domain: `{ scottContinuous, finiteBase, countableCofinality }`. Codomain: relating `ClosureRegime`.
 */
export const classifyRegimeTerm = tm.lam(
  tm.cond(
    tm.field("finiteBase", tm.var(0)),
    regimeConst("finite"),
    tm.cond(
      tm.field("scottContinuous", tm.var(0)),
      regimeConst("scott"),
      tm.cond(
        tm.field("countableCofinality", tm.var(0)),
        regimeConst("transfinite"),
        regimeConst("aperiodic"),
      ),
    ),
  ),
);

/**
 * `cohomologyVanishesInRegime` — `RelMath.ClosureOrdinalRegime.cohomologyVanishes` as an IR cond-chain.
 * H¹ vanishes in strict/Scott regimes, is non-trivial in transfinite/aperiodic.
 */
export const cohomologyVanishesInRegimeTerm = tm.lam(
  tm.cond(
    tm.coincide(tm.field("kind", tm.var(0)), stringTerm("ordinal.closure.regime.finite")),
    tm.bool(true),
    tm.cond(
      tm.coincide(tm.field("kind", tm.var(0)), stringTerm("ordinal.closure.regime.scott")),
      tm.bool(true),
      tm.bool(false),
    ),
  ),
);
