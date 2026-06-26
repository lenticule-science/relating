import * as analysis from "@emsenn/relating/analysis";

const receipt = analysis.crdtCalm.receipt();

console.log("CRDT/CALM finite convergence receipt");
console.log(JSON.stringify({
  convergence: {
    h1VanishesFinite: receipt.convergence.h1VanishesFinite,
    merge: receipt.convergence.merge,
    confluenceJoin: receipt.convergence.confluence.join,
    quiescentIffClosureFixed: receipt.convergence.quiescentIffClosureFixed,
    biconditionalFrontier: receipt.convergence.biconditionalFrontier,
  },
  monotoneCoordinationFree: {
    orbitLength: receipt.monotoneCoordinationFree.orbit.length,
    orbitMonotone: receipt.monotoneCoordinationFree.orbitMonotone,
    coordinationFree: receipt.monotoneCoordinationFree.coordinationFree,
  },
  overlap: {
    preimageCount: receipt.overlap.cosettling.preimages.length,
    overlapJoinClosed: receipt.overlap.overlapJoinClosed,
  },
  frontier: receipt.openFrontier,
}, null, 2));
