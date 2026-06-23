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
