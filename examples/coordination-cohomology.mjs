import * as analysis from "@emsenn/relating/analysis";

const receipt = analysis.coordinationCohomology.receipt();

console.log("Coordination cohomology cover-nerve receipt");
console.log({
  cycle: {
    entities: receipt.cycle.nerve.entities,
    cells: receipt.cycle.nerve.cells,
    components: receipt.cycle.nerve.components,
    h1Rank: receipt.cycle.h1Rank,
    coordinationCost: receipt.cycle.coordinationCost,
  },
  forest: {
    entities: receipt.forest.nerve.entities,
    cells: receipt.forest.nerve.cells,
    components: receipt.forest.nerve.components,
    coordinationFree: receipt.forest.coordinationFree,
  },
  tree: {
    vertices: receipt.tree.vertices,
    edges: receipt.tree.edges,
    h1Rank: receipt.tree.h1Rank,
  },
  laplacian: {
    incidenceRank: receipt.laplacian.incidenceRank,
    h0KernelRank: receipt.laplacian.h0KernelRank,
    h1CokernelRank: receipt.laplacian.h1CokernelRank,
  },
  frontier: receipt.openFrontier,
});
