import assert from "node:assert/strict";

import {
  canonical,
  evaluateRunTerm,
  freeSettlementFiltration,
  induceRelation,
  isClosed,
  mark,
  readClassificationOfSettlementFiltration,
  readClosureInvariantOfSettlementFiltration,
  readDepthFiniteStageJudgmentOfSettlementFiltration,
  readDepthOfSettlementFiltration,
  readFirstCohomologyOfSettlementFiltration,
  readGradedGapFirstCohomologyRankIdentityOfSettlementFiltration,
  readGradedGapOfSettlementFiltration,
  readLimitStagesOfSettlementFiltration,
  readNonScottFiringsOfSettlementFiltration,
  readerTerms,
  relateRelations,
  termSize,
  termUses,
  utterance,
} from "@emsenn/relating";

const relation = (subject, predicate) =>
  induceRelation(utterance(mark(subject), mark(predicate)));

const generators = relateRelations(
  relation("alpha", "supports"),
  relation("beta", "supports"),
);

const materialized = freeSettlementFiltration(generators);
const readers = {
  readClassification: readClassificationOfSettlementFiltration,
  readDepth: readDepthOfSettlementFiltration,
  readDepthFiniteStageJudgment: readDepthFiniteStageJudgmentOfSettlementFiltration,
  readLimitStages: readLimitStagesOfSettlementFiltration,
  readNonScottFirings: readNonScottFiringsOfSettlementFiltration,
  readFirstCohomology: readFirstCohomologyOfSettlementFiltration,
  readGradedGap: readGradedGapOfSettlementFiltration,
  readGradedGapFirstCohomologyRankIdentity:
    readGradedGapFirstCohomologyRankIdentityOfSettlementFiltration,
  readClosureInvariant: readClosureInvariantOfSettlementFiltration,
};

const agreements = Object.fromEntries(Object.entries(readers).map(([name, read]) => {
  const termOutput = evaluateRunTerm(readerTerms[name], generators);
  const directOutput = read(materialized);
  assert.equal(canonical(termOutput), canonical(directOutput), name);
  return [name, {
    kind: termOutput.kind,
    bytes: canonical(termOutput).length,
  }];
}));

const classification = evaluateRunTerm(readerTerms.readClassification, generators);
const firstCohomology = evaluateRunTerm(readerTerms.readFirstCohomology, generators);
const gradedGap = evaluateRunTerm(readerTerms.readGradedGap, generators);
const rankIdentity = evaluateRunTerm(
  readerTerms.readGradedGapFirstCohomologyRankIdentity,
  generators,
);

assert.equal(classification.regime.kind, "ordinal.closure.regime.finite");
assert.equal(canonical(firstCohomology.rank), canonical(gradedGap.rank));
assert.equal(rankIdentity.kind, "predication.cohomology.rankIdentity:witness");

console.log(JSON.stringify({
  product: "relating.settlement-reader-terms",
  input: {
    kind: generators.kind,
    cells: generators.cells.length,
    specializations: generators.specializations.length,
  },
  materialized: {
    stages: materialized.stages.length,
    cofinality: materialized.cofinality.kind,
  },
  agreements,
  classification: {
    regime: classification.regime.kind,
    depth: classification.depth.ordinal.kind,
    nonScottRank: classification.nonScottFirings.rank.members.length,
  },
  cohomology: {
    firstRank: firstCohomology.rank.members.length,
    gradedGapRank: gradedGap.rank.members.length,
    rankIdentity: rankIdentity.kind,
  },
  termBodies: {
    readClassification: {
      closed: isClosed(readerTerms.readClassification),
      nodes: termSize(readerTerms.readClassification),
      uses: termUses(readerTerms.readClassification),
    },
    readFirstCohomology: {
      closed: isClosed(readerTerms.readFirstCohomology),
      nodes: termSize(readerTerms.readFirstCohomology),
      uses: termUses(readerTerms.readFirstCohomology),
    },
  },
}, null, 2));
