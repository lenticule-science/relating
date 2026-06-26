/**
 * @packageDocumentation
 *
 * settling/analysis — analytical reads of settled carriers.
 *
 * Analysis is downstream of settlement: it reads extrema and derived geometry
 * (exact arithmetic, graded sectors, finite relation-graph Laplacians,
 * first-order conservation reads, spectral root structure, differential
 * controls) without defining the primitive carriers it analyzes.
 *
 * The public package handle is `@emsenn/relating/analysis`. The same namespace
 * is also available from the root import as `analysis`.
 *
 * This surface is carrier-valued and exact. It is useful for reading relation
 * geometry, spectral root-location judgments, harmonic and conservation
 * witness/obstruction data, charged control findings, and evidence
 * distributions after settlement, but it is not a drop-in floating-point
 * numerical library.
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
 *
 * // `section` is a SectionCarrier from settlement.
 * const graph = analysis.relationGraph(section);
 * analysis.harmonic(graph, [analysis.ratZero, analysis.ratZero]).kind;
 * // "meme-analysis.laplacian.harmonic:witness"
 *
 * // `matrix` is an exact integer Matrix.
 * analysis.pisotRoot(analysis.charPoly(matrix)).kind;
 * // "spectral.pisotRoot:witness"
 *
 * const network = analysis.conservation.flowNetwork(section);
 * analysis.conservation.conserved(network, network.edges.map(() => analysis.ratZero)).kind;
 * // "meme-analysis.conservation.conserved:witness"
 * ```
 */
export * from "./exact-number.mjs";
export * from "./graded.mjs";
export * from "./spectral.mjs";
export * from "./laplacian.mjs";
export * from "./information.mjs";
export * from "./coloring.mjs";
export * from "./evidence.mjs";
export * as causal from "./causal.mjs";
export * as collatz from "./collatz.mjs";
export * as dFrame from "./d-frame.mjs";
export * as flow from "./flow.mjs";
export * as internalReal from "./internal-real.mjs";
export * as knasterTarski from "./knaster-tarski.mjs";
export * as laxSlack from "./lax-slack.mjs";
export * as linearAlgebra from "./linear-algebra.mjs";
export * as closureRule from "./closure-rule-system.mjs";
export * as discrete from "./discrete-set-number-graph.mjs";
export * as fcaLambek from "./fca-lambek-circle.mjs";
export * as lambek from "./lambek-calculus.mjs";
export * as numberTheory from "./number-theory.mjs";
export * as orderInfra from "./order-infra.mjs";
export * as ordinalClosure from "./ordinal-closure.mjs";
export * as scottCoalgebra from "./scott-coalgebra.mjs";
export * as residuatedLattice from "./residuated-lattice.mjs";
export * as sofic from "./sofic.mjs";
export * as twistProduct from "./twist-product.mjs";
export * as algebraHierarchy from "./algebra-hierarchy.mjs";
export * as aperiodicClassification from "./aperiodic-classification.mjs";
export * as coordinationCohomology from "./coordination-cohomology.mjs";
export * as frobeniusTqft from "./frobenius-tqft.mjs";
export * as jeandelRaoWitness from "./jeandel-rao-witness.mjs";
export * as pairwiseStoneClopen from "./pairwise-stone-clopen.mjs";
export * as settlingAssociatedSheaf from "./settling-associated-sheaf.mjs";
export * as negativeParaconsistentSheaf from "./negative-paraconsistent-sheaf.mjs";
export * as quantaleEnrichedSheaf from "./quantale-enriched-sheaf.mjs";
export * as alexandrovHusainov from "./alexandrov-husainov.mjs";
export * as crdtCalm from "./crdt-cohomological-calm.mjs";
export * as kzCoherentSheaf from "./kz-coherent-sheaf.mjs";
export * as bigradedDiamond from "./bigraded-diamond.mjs";
export * as bigradedCohomology from "./bigraded-cohomology.mjs";
export * as arithmetic from "./arithmetic.mjs";
export * as differential from "./differential.mjs";
export * as conservation from "./conservation.mjs";
