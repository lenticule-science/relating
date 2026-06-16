/**
 * ../algebra/index.mjs — bilattice charges, binary relations on charge,
 * exact arithmetic (Natural → Rational → Matrix), predication sets
 * (Cell = E×Π×E), and the initial mark/utterance objects.
 *
 * This is the algebraic substrate of the meme chain.  Everything here
 * is pure structure and operation; there is no settling, no closure
 * engine, no sheaf construction.  Those live in ../topology/index.mjs,
 * which depends on this package.
 */

export * from "./utterance.mjs";
export * from "./carrier-coincidence.mjs";
export * from "./bilattice-charge.mjs";
export * from "./bilattice-relation.mjs";
export * from "./predication.mjs";
export * from "./exact-number.mjs";
export * from "./graded.mjs";
