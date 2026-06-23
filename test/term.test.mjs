/**
 * Contract: the IR term layer's structural primitives beyond the CHL core —
 * `fold` (the one structural recursion) and the von Neumann `nat` builders derived
 * over it. `fold`/`count` rebuild relating's exact-number serialization, so they are
 * checked differential against the real `analysis.count`/`successor` on the real carrier
 * (not self-consistency); the Lean-grounded invariant cores are covered in
 * lean-conformance.test.mjs.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  tm,
  nat,
  evaluate,
  evaluateRunTerm,
  carrierToTerm,
  termToCarrier,
  analysis,
  joinKnowledgeValue,
  chargeValue,
  settlingTerms,
  readerTerms,
  freeSettlementFiltration,
  induceRelation,
  relateRelations,
  utterance,
  mark,
  canonical,
  readClassificationOfSettlementFiltration,
  readDepthOfSettlementFiltration,
  readDepthFiniteStageJudgmentOfSettlementFiltration,
  readLimitStagesOfSettlementFiltration,
  readNonScottFiringsOfSettlementFiltration,
  readFirstCohomologyOfSettlementFiltration,
  readGradedGapOfSettlementFiltration,
  readGradedGapFirstCohomologyRankIdentityOfSettlementFiltration,
  readClosureInvariantOfSettlementFiltration,
} from "@emsenn/relating";

describe("the fold primitive left-folds a curried combiner over an array term", () => {
  const arrayTerm = (items) => carrierToTerm(items);

  it("folds the empty array to the initial accumulator", () => {
    const out = evaluate(tm.fold(tm.lam(tm.lam(tm.var(1))), tm.mark("seed"), carrierToTerm([])));
    assert.deepEqual(out, tm.mark("seed"));
  });

  it("threads the accumulator left-to-right: fold (λacc.λx. x) keeps the LAST element", () => {
    // λacc.λelem. elem  (var0)  -> returns the last element
    const last = tm.lam(tm.lam(tm.var(0)));
    const out = evaluateRunTerm(tm.lam(tm.fold(last, tm.mark("none"), tm.var(0))), ["a", "b", "c"]);
    assert.deepEqual(out, "c");
  });

  it("folds a domain primitive: knowledge-join over a list of charges = their join", () => {
    // λacc.λelem. joinK acc elem, seeded at absurd (knowledge bottom).
    const joinAll = tm.lam(tm.fold(
      tm.lam(tm.lam(tm.joinK(tm.var(1), tm.var(0)))),
      tm.charge("absurd"),
      tm.var(0),
    ));
    for (const charges of [["potential", "active"], ["stable", "absurd", "potential"], ["potential"]]) {
      const ir = evaluateRunTerm(joinAll, charges);
      const ts = charges.reduce((acc, c) => joinKnowledgeValue(acc, chargeValue(c)), chargeValue("absurd")).name;
      assert.equal(ir, ts, JSON.stringify(charges));
    }
  });
});

describe("nat: the von Neumann naturals as IR builders, faithful to relating's exact-number", () => {
  it("count is byte-identical to analysis.count for every length", () => {
    for (let len = 0; len <= 12; len += 1) {
      const list = Array.from({ length: len }, (_, i) => ({ i, nested: [i] }));
      const ir = evaluateRunTerm(nat.count, list);
      const real = analysis.count(list.map((_, i) => i));
      assert.deepEqual(ir, real, `length ${len}`);                       // value-faithful
      assert.equal(JSON.stringify(ir), JSON.stringify(real), `length ${len}`); // byte-identical
    }
  });

  it("successor builds n ∪ {n}, matching analysis.successor", () => {
    let real = analysis.natZero;
    let irNat = nat.zero;
    for (let i = 0; i < 6; i += 1) {
      assert.deepEqual(termToCarrier(evaluate(irNat)), real, `successor^${i}`);
      real = analysis.successor(real);
      irNat = nat.successor(irNat);
    }
  });

  it("the count differential bites when the fold combiner is wrong (skips successor)", () => {
    // A broken count that returns the seed regardless — disagrees from length 1 up.
    const brokenCount = tm.lam(tm.fold(tm.lam(tm.lam(tm.var(1))), nat.zero, tm.var(0)));
    const real = analysis.count([0, 1, 2]);
    const broken = evaluateRunTerm(brokenCount, [{ a: 1 }, { b: 2 }, { c: 3 }]);
    assert.notDeepEqual(broken, real);
  });
});

describe("settlingTerms.free: the settling closure materialized in the IR", () => {
  const u = (s, p) => induceRelation(utterance(mark(s), mark(p)));
  const cases = () => {
    const five = [1, 2, 3, 4].reduce((acc, i) => relateRelations(acc, u("a" + i, "p" + i)), u("a0", "p0"));
    const dup = relateRelations(u("dup", "same"), u("dup", "same"));
    return [
      ["one utterance", u("socrates", "is-a")],
      ["union of five", five],
      ["coincident duplicate", dup],          // exercises the coincidence dedup → 1 cell
      ["unicode marks", u("σ", "∈")],
      ["object-valued marks", induceRelation(utterance(mark({ x: 1 }), mark([1, 2])))],
    ];
  };

  it("is byte-identical to freeSettlementFiltration across the descent domain", () => {
    for (const [label, slim] of cases()) {
      const real = freeSettlementFiltration(slim);
      const ir = evaluateRunTerm(settlingTerms.free, slim);
      // Faithfulness is on the wire: real `free` carries class-instance predicates
      // (`new Predicate`), the IR rebuild plain objects — identical serialized, distinct
      // prototypes. Compare the canonical bytes and the parsed wire forms.
      assert.equal(canonical(ir), canonical(real), label);                       // byte-identical
      assert.deepEqual(JSON.parse(canonical(ir)), JSON.parse(canonical(real)), label); // value-faithful
    }
  });

  it("re-derives a single initial stage with the coincidence-deduped designated cell set", () => {
    const ir = evaluateRunTerm(settlingTerms.free, relateRelations(u("dup", "same"), u("dup", "same")));
    assert.equal(ir.stages.length, 1);
    assert.equal(ir.stages[0].shape.kind, "predication.settling.stage.initial");
    assert.equal(ir.stages[0].designated.cells.length, 1);   // two coincident cells → one
    assert.equal(ir.cofinality.kind, "predication.settling.cofinality.countable");
  });

  it("the free differential bites when the closure is wrong (undeduped cells)", () => {
    const dup = relateRelations(u("dup", "same"), u("dup", "same"));
    const real = freeSettlementFiltration(dup);
    // Carry the raw (undeduped) cells straight into the stage — disagrees on the dedup.
    const undeduped = tm.lam(tm.field("cells", tm.var(0)));
    const rawCells = evaluateRunTerm(undeduped, dup);
    assert.notDeepEqual(rawCells, real.stages[0].designated.cells);
  });
});

describe("readerTerms: the nine measurement readers as IR `read ∘ free` terms", () => {
  const u = (s, p) => induceRelation(utterance(mark(s), mark(p)));
  const inputs = () => {
    const five = [1, 2, 3, 4].reduce((acc, i) => relateRelations(acc, u("a" + i, "p" + i)), u("a0", "p0"));
    return [
      ["one utterance", u("socrates", "is-a")],
      ["union of five", five],
      ["coincident duplicate", relateRelations(u("dup", "same"), u("dup", "same"))],
      ["unicode marks", u("σ", "∈")],
      ["object-valued marks", induceRelation(utterance(mark({ x: 1 }), mark([1, 2])))],
    ];
  };
  const readers = {
    readClassification: readClassificationOfSettlementFiltration,
    readDepth: readDepthOfSettlementFiltration,
    readDepthFiniteStageJudgment: readDepthFiniteStageJudgmentOfSettlementFiltration,
    readLimitStages: readLimitStagesOfSettlementFiltration,
    readNonScottFirings: readNonScottFiringsOfSettlementFiltration,
    readFirstCohomology: readFirstCohomologyOfSettlementFiltration,
    readGradedGap: readGradedGapOfSettlementFiltration,
    readGradedGapFirstCohomologyRankIdentity: readGradedGapFirstCohomologyRankIdentityOfSettlementFiltration,
    readClosureInvariant: readClosureInvariantOfSettlementFiltration,
  };

  it("each is byte-identical to read ∘ freeSettlementFiltration across the descent domain", () => {
    for (const [label, slim] of inputs()) {
      for (const key of Object.keys(readers)) {
        const ir = evaluateRunTerm(readerTerms[key], slim);
        const real = readers[key](freeSettlementFiltration(slim));
        assert.equal(canonical(ir), canonical(real), `${key} on ${label}`);
        assert.deepEqual(JSON.parse(canonical(ir)), JSON.parse(canonical(real)), `${key} on ${label}`);
      }
    }
  });

  it("the regime is the Lean-grounded classifier: descent settlings are the finite regime", () => {
    const ir = evaluateRunTerm(readerTerms.readClassification, u("s", "p"));
    assert.equal(ir.regime.kind, "ordinal.closure.regime.finite");
    assert.equal(ir.depth.ordinal.kind, "ordinal.closure.ordinal.zero");
    assert.equal(ir.nonScottFirings.rank.members.length, 0);
  });

  it("the H¹ = graded-gap rank identity holds and cohomology vanishes (rank zero)", () => {
    const h1 = evaluateRunTerm(readerTerms.readFirstCohomology, u("s", "p"));
    const gap = evaluateRunTerm(readerTerms.readGradedGap, u("s", "p"));
    const identity = evaluateRunTerm(readerTerms.readGradedGapFirstCohomologyRankIdentity, u("s", "p"));
    assert.equal(canonical(h1.rank), canonical(gap.rank));                       // the headline identity
    assert.equal(identity.kind, "predication.cohomology.rankIdentity:witness");
    assert.equal(h1.vanishing.kind, "predication.cohomology.rankVanishing:witness");
  });

  it("the reader differential bites when free is bypassed (raw generators, wrong shape)", () => {
    const slim = u("s", "p");
    const real = readDepthOfSettlementFiltration(freeSettlementFiltration(slim));
    // Reading depth off the raw generators (no free) gives no such field — never the ordinal.
    const broken = evaluateRunTerm(tm.lam(tm.field("cells", tm.var(0))), slim);
    assert.notDeepEqual(broken, real);
  });
});
