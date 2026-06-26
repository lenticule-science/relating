import * as analysis from "@emsenn/relating/analysis";

const receipt = analysis.negativeParaconsistentSheaf.receipt();

console.log("Negative-paraconsistent sheaf finite receipt");
console.log(JSON.stringify({
  mirror: {
    dNeg: receipt.mirror.dNeg.cells,
    dKOfNegated: receipt.mirror.dKOfNegated.cells,
    dFonly: receipt.mirror.dFonly.cells,
    dTOfNegated: receipt.mirror.dTOfNegated.cells,
    topSeamFixed: receipt.mirror.topSeamFixed,
    negationInvolutive: receipt.mirror.negationInvolutive,
    chargeMirrorTable: receipt.mirror.chargeMirrorTable,
  },
  split: {
    dNeg: receipt.split.dNeg.cells,
    dFonly: receipt.split.dFonly.cells,
    dTop: receipt.split.dTop.cells,
    fPart: receipt.split.fPart.coefficients,
    topPart: receipt.split.topPart.coefficients,
    splitReconstructs: receipt.split.splitReconstructs,
  },
  restriction: {
    restricted: receipt.restriction.restricted.coefficients,
    restrictedVanishesOffDNeg: receipt.restriction.restrictedVanishesOffDNeg,
    restrictionComposesByMeet: receipt.restriction.restrictionComposesByMeet,
  },
  frontier: receipt.openFrontier,
}, null, 2));
