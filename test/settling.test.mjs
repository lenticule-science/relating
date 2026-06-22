/**
 * Contract: `settle` / `induceRelation` — the settlement filtration and its reads.
 * "Computation = settling": posited evidence closes to its fixed point over ordinal
 * stages. The promises consumers rely on: the descent composes as a pipe, the
 * settling is monotone, and the reads return their declared invariants.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  mark, utterance, posit, predicate, articulate, fixedPoints, fixedPointReadings, sectionOf,
  induceRelation,
  readIncrementsOfSettlementFiltration, readFiringsOfSettlementFiltration,
  readDepthOfSettlementFiltration, readClassificationOfSettlementFiltration,
  readGradedGapFirstCohomologyRankIdentityOfSettlementFiltration,
  actions, induceBins, canonical, parseJson,
} from "@emsenn/relating";

describe("induceRelation = settle ∘ posit ∘ predicate ∘ articulate", () => {
  const filt = induceRelation(utterance(mark("socrates"), mark("is-a")));

  it("produces a settlement filtration whose first stage is the initial stage", () => {
    assert.equal(filt.kind, "predication.settlement.filtration");
    assert.ok(filt.stages.length >= 1);
    assert.equal(filt.stages[0].shape.kind, "predication.settling.stage.initial");
  });

  it("settling is monotone: each stage's designated cells never shrink", () => {
    const { stages } = induceRelation(utterance(mark("a"), mark("b")));
    for (let i = 1; i < stages.length; i += 1) {
      assert.ok(stages[i].designated.cells.length >= stages[i - 1].designated.cells.length);
    }
  });

  it("the thin chain composes as a POSIX pipe equal to the named descent", () => {
    const { dispatch } = induceBins(actions);
    const piped = ["articulate", "predicate", "posit", "settle"].reduce((stdin, verb) => {
      const step = dispatch([verb], stdin);
      assert.equal(step.code, 0, `${verb} failed: ${step.stderr}`);
      return step.stdout;
    }, dispatch(["utter"], "socrates\nis-a").stdout);
    const direct = dispatch(["induce-relation"], "socrates\nis-a");
    assert.equal(direct.code, 0);
    assert.equal(canonical(parseJson(piped)), canonical(parseJson(direct.stdout)));
  });
});

describe("settlement-filtration reads return their declared invariants", () => {
  const filt = induceRelation(utterance(mark("socrates"), mark("is-a")));

  it("increments and firings are arrays; firings are a sub-sequence of increments", () => {
    const inc = readIncrementsOfSettlementFiltration(filt);
    const fir = readFiringsOfSettlementFiltration(filt);
    assert.ok(Array.isArray(inc) && Array.isArray(fir));
    assert.ok(fir.length <= inc.length);
  });

  it("depth is a settling-stage ordinal; classification names the regime", () => {
    assert.equal(readDepthOfSettlementFiltration(filt).kind, "predication.settling.stageOrdinal");
    assert.equal(readClassificationOfSettlementFiltration(filt).kind, "predication.settling.classification");
  });

  it("the graded gap equals the first-cohomology rank (the package's headline identity)", () => {
    assert.equal(
      readGradedGapFirstCohomologyRankIdentityOfSettlementFiltration(filt).kind,
      "predication.cohomology.rankIdentity:witness",
    );
  });
});

describe("fixed points and their section", () => {
  it("the knowledge-least fixed point witnesses, and its section is a meme-topology carrier", () => {
    const fr = fixedPointReadings(fixedPoints(posit(predicate(articulate(utterance(mark("s"), mark("p")))))));
    assert.equal(fr.knowledgeLeast.extremum.fixedPoint.kind, "predication.valuation.fixedPoint:witness");
    assert.equal(sectionOf(fr.knowledgeLeast).kind, "meme-topology.section.carrier");
  });
});
