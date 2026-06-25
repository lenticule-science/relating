import {
  descent,
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
}, null, 2));
