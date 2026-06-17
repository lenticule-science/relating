/**
 * ../geometry/index.mjs — geometry barrel for the meme chain.
 *
 * Spatial: exact arithmetic in real quadratic fields and one-dimensional
 * cut-and-project schemes over ℤ². Quadratic rationals provide the minimal
 * coordinate system in which irrational slopes are exactly decidable.
 *
 * Temporal geometry is implemented under the settling category, but re-exported
 * here so existing geometry consumers keep a stable import surface.
 */
export * from "./spatial.mjs";
export * from "../articulating/predicating/positing/settling/geometry/temporal.mjs";
