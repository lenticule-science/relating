import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { claim, mark, token, predicating } from "@emsenn/relating/articulating";
import { converseFoldCandidateCensus } from "@emsenn/relating/settling";

const relation = predicating.predicateOfClaim(claim(mark("relates")));
const a = token(mark("a"));
const b = token(mark("b"));

const filtration = (cells) => Object.freeze({
  kind: "predication.settlement.filtration",
  cells: Object.freeze(cells),
  specializations: Object.freeze([]),
});

describe("converse fold candidate census", () => {
  it("admits entities whose settled incident support is converse-complete", () => {
    const result = converseFoldCandidateCensus(filtration([
      predicating.cell(a, relation, b),
      predicating.cell(b, relation, a),
    ]));

    assert.equal(result.limitation, "canonical-converse-only");
    assert.equal(result.candidates.length, 2);
    assert.equal(result.obstructions.length, 0);
  });

  it("returns explicit obstructions for missing converse partners", () => {
    const result = converseFoldCandidateCensus(filtration([
      predicating.cell(a, relation, b),
    ]));

    assert.equal(result.candidates.length, 0);
    assert.equal(result.obstructions.length, 2);
    for (const obstruction of result.obstructions) {
      assert.equal(obstruction.missingConverse.length, 1);
      assert.equal(obstruction.limitation, "canonical-converse-only");
    }
  });
});
