import {
  chu,
  descent,
  fca,
  isClosed,
  measurement,
  readerTerms,
  settlingTerms,
  termSize,
  termUses,
} from "@emsenn/relating";

const summarize = (name, term) => ({
  name,
  closed: isClosed(term),
  size: termSize(term),
  uses: termUses(term),
});

console.log(JSON.stringify({
  product: "relating.rmn-products",
  descent: summarize("descent.articulate", descent.articulate),
  settling: summarize("settlingTerms.free", settlingTerms.free),
  reader: summarize("readerTerms.readClassification", readerTerms.readClassification),
  measurement: summarize("measurement.classifyRegime", measurement.classifyRegime),
  fca: summarize("fca.formalConcept", fca.formalConcept),
  chu: summarize("chu.dual", chu.dual),
}, null, 2));
