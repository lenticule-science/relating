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
  ty,
  chl,
  chlFormerNames,
  chlFormerToCorner,
  cornerToChlFormer,
  chlQuartetIsNuclearReceipt,
  tyCarrier,
  tmCarrier,
  rename,
  subst,
  inst,
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

describe("notating: RMN syntax is schema-carried de-Bruijn data", () => {
  it("admits Ty and Tm as recursive JSON schemas", () => {
    assert.equal(tyCarrier.validate(ty.arrow(ty.unit(), ty.prod(ty.base(), ty.unit()))), true);
    assert.equal(tmCarrier.validate(tm.lam(tm.var(0))), true);
    assert.equal(tmCarrier.validate(["var", -1]), false);
    assert.equal(tmCarrier.validate(["lambda", ["var", 0]]), false);
  });

  it("renames, substitutes, and instantiates bound-variable terms structurally", () => {
    const openProjection = tm.fst(tm.var(0));

    assert.deepEqual(rename((index) => index + 1, openProjection), tm.fst(tm.var(1)));
    assert.deepEqual(subst((index) => index === 0 ? tm.star() : tm.var(index), openProjection), tm.fst(tm.star()));
    assert.deepEqual(inst(tm.fst(tm.var(0)), tm.pair(tm.charge("potential"), tm.charge("active"))), tm.fst(tm.pair(tm.charge("potential"), tm.charge("active"))));
    assert.deepEqual(evaluate(inst(tm.fst(tm.var(0)), tm.pair(tm.charge("potential"), tm.charge("active")))), tm.charge("potential"));
  });
});

describe("CHLFormer: the Curry-Howard-Lambek quartet is the recurring nuclear FOUR", () => {
  it("round-trips CHL formers through the existing four-corner index", () => {
    assert.deepEqual(chlFormerNames, ["terminal", "product", "exponential", "dual"]);
    assert.equal(chlFormerToCorner("terminal"), "potential");
    assert.equal(chlFormerToCorner("exponential"), "active");
    assert.equal(chlFormerToCorner("product"), "stable");
    assert.equal(chlFormerToCorner("dual"), "absurd");

    for (const former of chlFormerNames) {
      assert.equal(cornerToChlFormer(chlFormerToCorner(former)), former);
    }
  });

  it("packages RelMath.CHL.chl_quartet_is_nuclear as a finite receipt", () => {
    const receipt = chlQuartetIsNuclearReceipt();

    assert.equal(receipt.kind, "chl.quartetIsNuclear.receipt:witness");
    assert.equal(receipt.cornerFormerCorner, true);
    assert.equal(receipt.formerCornerFormer, true);
    assert.equal(receipt.formersCardFour, 4);
    assert.equal(receipt.cornersCardFour, 4);
    assert.equal(receipt.nuclearCornerAgree, true);
    assert.deepEqual(evaluateRunTerm(chl.quartetIsNuclear, receipt), receipt);
  });
});

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

describe("hasTy: RelMath.CHL.HasTy as a decidable bidirectional checker (the proof floor)", async () => {
  const { ty, hasTy, inferTy } = await import("@emsenn/relating");
  const A = ty.base(), U = ty.unit();

  it("accepts each typing rule's witness (proofs of their propositions)", () => {
    assert.ok(hasTy([], tm.star(), U));                                                  // star : unit
    assert.ok(hasTy([A], tm.var(0), A));                                                 // var 0 (zero)
    assert.ok(hasTy([U, A], tm.var(1), A));                                              // var 1 (succ)
    assert.ok(hasTy([], tm.lam(tm.var(0)), ty.arrow(A, A)));                             // λx.x : A→A (→-intro)
    assert.ok(hasTy([], tm.lam(tm.lam(tm.var(1))), ty.arrow(A, ty.arrow(U, A))));        // K : A→U→A
    assert.ok(hasTy([A], tm.app(tm.lam(tm.var(0)), tm.var(0)), A));                      // (λx.x) h : A (→-elim)
    assert.ok(hasTy([], tm.pair(tm.star(), tm.star()), ty.prod(U, U)));                  // ⟨*,*⟩ : U×U (×-intro)
    assert.ok(hasTy([], tm.fst(tm.pair(tm.star(), tm.star())), U));                      // fst : U (×-elim)
    assert.ok(hasTy([], tm.snd(tm.pair(tm.star(), tm.star())), U));                      // snd : U
  });

  it("rejects ill-typed terms and non-propositions", () => {
    assert.ok(!hasTy([], tm.lam(tm.var(0)), ty.arrow(A, U)));     // λx.x : A→U  (wrong codomain)
    assert.ok(!hasTy([], tm.var(0), A));                          // unbound variable
    assert.ok(!hasTy([], tm.fst(tm.star()), U));                  // fst of a non-pair
    assert.ok(!hasTy([], tm.charge("stable"), A));               // a domain primitive is not a proof
    assert.equal(inferTy([], tm.lam(tm.var(0))), null);          // a bare lam is not inferable
  });

  it("the well-typed CHL golden-vector terms all type-check at some type", () => {
    // every closed →/×/unit-only normal form the Lean calculus emits is a proof.
    assert.ok(hasTy([], tm.app(tm.lam(tm.var(0)), tm.star()), U));            // beta-id-star reduces to star : U
    assert.ok(hasTy([], tm.fst(tm.pair(tm.app(tm.lam(tm.var(0)), tm.star()), tm.star())), U));
  });
});
