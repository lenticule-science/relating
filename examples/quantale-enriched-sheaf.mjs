import * as analysis from "@emsenn/relating/analysis";

const receipt = analysis.quantaleEnrichedSheaf.receipt();

console.log("Quantale-enriched sheaf finite receipt");
console.log(JSON.stringify({
  quantale: {
    carrier: receipt.quantale.carrier,
    one: receipt.quantale.one,
    multiplication: receipt.quantale.multiplication,
    mulDistributesOverSup: receipt.quantale.mulDistributesOverSup,
    mulMonotone: receipt.quantale.mulMonotone,
  },
  qcategory: {
    oneObject: receipt.qcategory.oneObject.objects,
    discreteObjects: receipt.qcategory.discrete.objects,
    discreteHomAB: analysis.quantaleEnrichedSheaf.hom(receipt.qcategory.discrete, "a", "b"),
    compositionPreservesHoms: receipt.qcategory.compositionPreservesHoms,
  },
  fuzzyEquivalence: receipt.fuzzyEquivalence,
  h0: receipt.h0,
  frontier: receipt.openFrontier,
}, null, 2));
