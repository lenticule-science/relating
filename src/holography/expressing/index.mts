/**
 * expressing — Relation Model Notation (RMN) as a bounded subsystem.
 *
 * RMN is the behavior-as-data layer of `@emsenn/relating`. A true morphism can
 * carry its body as a closed JSON s-expression term instead of only as an opaque
 * TypeScript callback. The dispatcher evaluates the term, tests inspect it, docs
 * render it, and downstream packages can move the same body across transports.
 * This is deliberately smaller than a general programming language: the core is
 * CHL-style typed lambda calculus, extended only by total domain and structural
 * primitives the package can verify.
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
 *   @emsenn/relating/expressing/evaluating/connecting  — FCA/Galois connection terms
 *   @emsenn/relating/expressing/evaluating/pairing     — finite Chu pairing terms
 *
 * This index rolls up the engine and bridge surfaces for consumers who just want
 * "the RMN runtime" without cherry-picking sub-paths.
 */
export * from "./notating/index.mjs";
export * from "./evaluating/index.mjs";
export * from "./projecting/index.mjs";
