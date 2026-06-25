import {
  articulate,
  mark,
  posit,
  predicate,
  readClassificationOfSettlementFiltration,
  readFirstCohomologyOfSettlementFiltration,
  readGradedGapOfSettlementFiltration,
  settle,
  utterance,
} from "@emsenn/relating";

const admitted = utterance(mark("socrates"), mark("is mortal"));
const articulated = articulate(admitted);
const predicated = predicate(articulated);
const posited = posit(predicated);
const settled = settle(posited);

const classification = readClassificationOfSettlementFiltration(settled);
const h1 = readFirstCohomologyOfSettlementFiltration(settled);
const gradedGap = readGradedGapOfSettlementFiltration(settled);

console.log(JSON.stringify({
  product: "relating.descent",
  descent: [
    admitted.kind,
    articulated.kind,
    predicated.kind,
    posited.kind,
    settled.kind,
  ],
  settlement: {
    stages: settled.stages.length,
    regime: classification.regime.kind,
    cofinality: classification.cofinality.kind,
    h1Rank: h1.rank.members.length,
    gradedGapRank: gradedGap.rank.members.length,
  },
}, null, 2));
