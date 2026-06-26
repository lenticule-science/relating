import * as analysis from "@emsenn/relating/analysis";

const receipt = analysis.kzCoherentSheaf.receipt();

console.log("KZ-coherent sheaf finite descent receipt");
console.log(JSON.stringify({
  coherence: {
    kzCellCount: receipt.coherence.kzCells.length,
    identifiesParallel: receipt.coherence.identifiesParallel,
    everySheafCoherentStrict: receipt.coherence.everySheafCoherentStrict,
  },
  descent: {
    closedUnderRestriction: receipt.descent.closedUnderRestriction,
    strictRegimeUniversality: receipt.descent.strictRegimeUniversality,
    sourceSections: receipt.descent.source.sections,
    restrictedSections: receipt.descent.restricted.sections,
  },
  frontier: receipt.openFrontier,
}, null, 2));
