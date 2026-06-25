/**
 * @packageDocumentation
 *
 * geometry/spatial — exact spatial geometry of the predication base.
 *
 * Real quadratic fields ℚ(√d) and the 1-D cut-and-project schemes that produce
 * aperiodic order from an irrational slope and an internal acceptance window.
 * `modelSet` and `refutePeriod` are finite sampled reads: they produce concrete
 * witnesses over a bounded site radius, not global aperiodicity proofs.
 *
 * @example
 * ```ts
 * import { predicating } from "@emsenn/relating/articulating";
 * import { fromRatio } from "@emsenn/relating/codecs";
 *
 * const { spatial } = predicating.geometry;
 * const slope = spatial.quadraticRational(5, fromRatio(1, 2), fromRatio(1, 2));
 * const scheme = spatial.cutProjectScheme(slope);
 * const window = spatial.acceptanceWindow(
 *   spatial.quadraticFromInts(5, 0, 0),
 *   spatial.quadraticFromInts(5, 1, 0),
 * );
 *
 * spatial.gapSpectrum(spatial.modelSet(scheme, window, 4)).word;
 * ```
 */
export * from "./quadratic.mjs";
export * from "./cut-and-project.mjs";
