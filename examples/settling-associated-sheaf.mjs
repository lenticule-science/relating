import * as analysis from "@emsenn/relating/analysis";

const receipt = analysis.settlingAssociatedSheaf.receipt();

console.log("Settling-associated sheaf finite receipt");
console.log({
  dT: receipt.masks.dT.cells,
  dTop: receipt.masks.dTop.cells,
  dK: receipt.masks.dK.cells,
  restrictedTruthPart: receipt.restriction.restricted.coefficients,
  truthPart: receipt.ses.truthPart.coefficients,
  topPart: receipt.ses.topPart.coefficients,
  reconstructed: receipt.ses.reconstructed.coefficients,
  sampleSize: receipt.ses.sampleSize,
  kernelPiIffVanishesOnTopOnSample: receipt.ses.kernelPiIffVanishesOnTopOnSample,
  frontier: receipt.openFrontier,
});
