import * as analysis from "@emsenn/relating/analysis";

const receipt = analysis.alexandrovHusainov.receipt();

console.log("Alexandrov/Husainov finite receipt");
console.log(JSON.stringify({
  topology: {
    points: receipt.topology.poset.points,
    openCount: receipt.topology.opens.length,
    principalSeed: analysis.alexandrovHusainov.principalUpSet(receipt.topology.poset, "seed").points,
    specializationRecoversOrder: receipt.topology.specializationRecoversOrder,
  },
  continuousMonotone: {
    monotone: receipt.continuousMonotone.monotone,
    preimagesOfOpensAreOpen: receipt.continuousMonotone.preimagesOfOpensAreOpen,
    continuousIffMonotoneOnFiniteMaps: receipt.continuousMonotone.continuousIffMonotoneOnFiniteMaps,
  },
  husainov: receipt.husainov,
  frontier: receipt.openFrontier,
}, null, 2));
