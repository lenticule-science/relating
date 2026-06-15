/**
 * ../logic/index.mjs — bilattice linear logic (fusion ⊗, residuum ⇒, par ⅋,
 * negation) and typed theory (inference rules, derivations, typing judgments,
 * predicate words).
 *
 * This is the logical layer of the meme chain.  Everything here is pure
 * consequence structure; there is no settlement, no sheaf construction, no
 * closure engine.  Those live in ../topology/index.mjs, which depends on this
 * package.
 */
export * from "./bilattice-linear-logic.mjs";
export * from "./typed-theory.mjs";
