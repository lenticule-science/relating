/**
 * ../analysis/index.mjs — spectral geometry of meme-topology carriers.
 *
 * The combinatorial Laplacian on the relation graph of a section: terms as
 * vertices weighted by cell multiplicity, yielding exact harmonic modes,
 * component count, characteristic polynomial, and spanning-tree count.
 *
 * This is the analytical layer of the meme chain. It takes
 * MemeTopologyCarrier as input; native-number crossing for exact number
 * carriers lives at the codecs/exact-number representation boundary.
 */
export * from "./spectral.mjs";
export * from "./laplacian.mjs";
export * from "./evidence.mjs";
export * as differential from "./differential.mjs";
export * as conservation from "./conservation.mjs";
