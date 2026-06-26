import * as analysis from "@emsenn/relating/analysis";

const receipt = analysis.dFrame.receipt();

console.log("D-frame finite receipt");
console.log({
  powerset: {
    universe: receipt.powerset.universe,
    subsetCount: receipt.powerset.subsetCount,
    meetDistributesOverFiniteSup: receipt.powerset.meetDistributesOverFiniteSup,
  },
  canonical: {
    universe: receipt.canonical.universe,
    conDownwardClosed: receipt.canonical.conDownwardClosed,
    totUpwardClosed: receipt.canonical.totUpwardClosed,
  },
  valuedSheaf: {
    positiveSupport: receipt.valuedSheaf.positiveSupport.elements,
    negativeSupport: receipt.valuedSheaf.negativeSupport.elements,
    settledSupport: receipt.valuedSheaf.settledSupport.elements,
    topSharedByBothSides: receipt.valuedSheaf.topSharedByBothSides,
    restrictionTop: receipt.valuedSheaf.restrictionTop.elements,
  },
  frontier: receipt.openFrontier,
});
