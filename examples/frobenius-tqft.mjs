import { evaluateRunTerm, frobeniusTqft } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

const receipt = analysis.frobeniusTqft.receipt();
const normalized = evaluateRunTerm(frobeniusTqft.receipt, receipt);

console.log(JSON.stringify({
  product: "relating.frobenius-tqft",
  lawSample: {
    size: normalized.laws.sample.length,
    checkedPairs: normalized.laws.checkedPairs,
    frobeniusCompatibility: normalized.laws.frobeniusCompatibility,
  },
  degree: {
    h0: normalized.degree.h0Example,
    h1: normalized.degree.h1Example,
    h2: normalized.degree.h2Example,
    counitReadsTop: normalized.degree.counitReadsTop,
  },
  tqft: {
    circleValue: normalized.tqft.circleValue,
    multiplication: normalized.tqft.multiplication,
    generatorsMatch: normalized.tqft.generatorsMatch,
  },
  k4Grades: normalized.k4Grading.gradeCount,
  frontiers: normalized.openFrontier,
}, null, 2));
