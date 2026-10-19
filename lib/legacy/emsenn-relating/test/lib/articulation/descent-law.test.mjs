import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { articulate, mark, predicating, utterance } from "@emsenn/relating/articulating";
import { freeSettlementFiltration, induceRelation, settle } from "@emsenn/relating/settling";

describe("material descent law", () => {
  it("induceRelation is settle after posit after predicate after articulate", () => {
    const admitted = utterance(mark("token"), mark("claim"));
    const expanded = settle(predicating.positing.posit(predicating.predicate(articulate(admitted))));
    assert.deepEqual(freeSettlementFiltration(induceRelation(admitted)), expanded);
  });
});
