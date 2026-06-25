/**
 * @packageDocumentation
 *
 * settling/analysis — analytical reads of settled carriers.
 *
 * Analysis is downstream of settlement: it reads extrema and derived geometry
 * (exact arithmetic, graded sectors, spectral root structure, differential
 * controls) without defining the primitive carriers it analyzes.
 *
 * The public package handle is `@emsenn/relating/analysis`. The same namespace
 * is also available from the root import as `analysis`.
 *
 * This surface is carrier-valued and exact. It is useful for reading relation
 * geometry and evidence distributions after settlement, but it is not a
 * drop-in floating-point numerical library.
 *
 * @example
 * ```js
 * import * as analysis from "@emsenn/relating/analysis";
 * import { chargeValue } from "@emsenn/relating";
 *
 * const n = analysis.count(["a", "b", "c"]);
 * n.kind; // "exactNumber.natural"
 *
 * const distribution = analysis.chargeDistribution([
 *   chargeValue("potential"),
 *   chargeValue("active"),
 *   chargeValue("stable"),
 * ]);
 *
 * analysis.evidenceCoordinates(distribution).kind;
 * // "meme-analysis.evidence.coordinates"
 * ```
 */
export * from "./exact-number.mjs";
export * from "./graded.mjs";
export * from "./spectral.mjs";
export * from "./laplacian.mjs";
export * from "./evidence.mjs";
export * as arithmetic from "./arithmetic.mjs";
export * as differential from "./differential.mjs";
export * as conservation from "./conservation.mjs";
