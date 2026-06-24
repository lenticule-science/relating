/**
 * expressing — Relation Model Notation (RMN) as a bounded subsystem.
 *
 * The three sub-areas and their submodule paths:
 *
 *   @emsenn/relating/expressing/notating    — the grammar (Ty, Tm, constructors)
 *   @emsenn/relating/expressing/evaluating  — the engine (step, dev, evaluate, type checker)
 *   @emsenn/relating/expressing/projecting  — the bridge (JSON ↔ Tm)
 *
 *   @emsenn/relating/expressing/evaluating/descending  — descent morphism terms
 *   @emsenn/relating/expressing/evaluating/reading     — settlement reader terms
 *   @emsenn/relating/expressing/evaluating/measuring   — Lean-grounded invariant terms
 *   @emsenn/relating/expressing/evaluating/counting    — von Neumann nat terms
 *   @emsenn/relating/expressing/evaluating/settling    — free settling term
 *
 * This index rolls up the engine and bridge surfaces for consumers who just want
 * "the RMN runtime" without cherry-picking sub-paths.
 */
export * from "./notating/index.mjs";
export * from "./evaluating/index.mjs";
export * from "./projecting/index.mjs";
