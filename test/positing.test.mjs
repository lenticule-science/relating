/**
 * Contract: the bilattice of charge — Belnap's FOUR — and `posit`. The value
 * algebra every faculty computes with. FOUR is finite, so its laws are pinned
 * EXHAUSTIVELY (all 4 values, all 16 pairs, all 64 triples) with no dependency and
 * no oracle: the tests ARE the algebraic specification.
 *
 * Values: absurd ⊥ (neither side), potential (truth only), active (falsity only),
 * stable ⊤ (both). Knowledge order grows both sides (⊥=absurd, ⊤=stable); truth
 * order grows truth / shrinks falsity (⊥=active, ⊤=potential).
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  chargeValue, chargeValueNames, valueOf, charge, bottom, witnessedPotential, mark,
  joinKnowledge, meetKnowledge, joinTruth, meetTruth,
  negateValue, conflateValue, gauge, gaugeElementNames, fixedSet, sameChargeValue,
  leqKnowledge, leqTruth, isChargeValueName, asChargeValueName,
  posit, predicate, articulate, utterance,
} from "@emsenn/relating";

const NAMES = ["absurd", "potential", "active", "stable"];
// value-level operation names, through the public carrier API (charge → op → valueOf)
const k = (a, b) => valueOf(joinKnowledge(charge(chargeValue(a)), charge(chargeValue(b)))).name;
const km = (a, b) => valueOf(meetKnowledge(charge(chargeValue(a)), charge(chargeValue(b)))).name;
const t = (a, b) => valueOf(joinTruth(charge(chargeValue(a)), charge(chargeValue(b)))).name;
const tm = (a, b) => valueOf(meetTruth(charge(chargeValue(a)), charge(chargeValue(b)))).name;

describe("the carrier of FOUR", () => {
  it("names exactly Belnap's four values in canonical order", () => {
    assert.deepEqual(chargeValueNames, ["absurd", "potential", "active", "stable"]);
  });
  it("the knowledge bottom is absurd with no evidence", () => {
    assert.equal(valueOf(bottom).name, "absurd");
    assert.deepEqual(bottom.evidence, [[], []]);
  });
  it("name guards admit the four and reject anything else", () => {
    for (const n of NAMES) assert.equal(isChargeValueName(n), true);
    assert.equal(isChargeValueName("maybe"), false);
    assert.throws(() => asChargeValueName("maybe"), TypeError);
  });
});

describe("the knowledge lattice (bottom = absurd, top = stable)", () => {
  it("absurd is the join identity; stable absorbs", () => {
    for (const x of NAMES) { assert.equal(k("absurd", x), x); assert.equal(k("stable", x), "stable"); }
  });
  it("stable is the meet identity; absurd absorbs", () => {
    for (const x of NAMES) { assert.equal(km("stable", x), x); assert.equal(km("absurd", x), "absurd"); }
  });
  it("the orthogonal pair potential/active joins to stable and meets to absurd", () => {
    assert.equal(k("potential", "active"), "stable");
    assert.equal(km("potential", "active"), "absurd");
  });
  it("join and meet are idempotent, commutative, associative, and absorb", () => {
    for (const a of NAMES) {
      assert.equal(k(a, a), a); assert.equal(km(a, a), a);
      for (const b of NAMES) {
        assert.equal(k(a, b), k(b, a)); assert.equal(km(a, b), km(b, a));
        assert.equal(k(a, km(a, b)), a); assert.equal(km(a, k(a, b)), a); // absorption
        for (const c of NAMES) {
          assert.equal(k(k(a, b), c), k(a, k(b, c)));
          assert.equal(km(km(a, b), c), km(a, km(b, c)));
        }
      }
    }
  });
  it("≤_k agrees with join: a ≤ b iff a∨b = b; potential and active are incomparable", () => {
    for (const a of NAMES) for (const b of NAMES) {
      assert.equal(leqKnowledge(charge(chargeValue(a)), charge(chargeValue(b))), k(a, b) === b, `${a} ≤k ${b}`);
    }
    assert.equal(leqKnowledge(charge(chargeValue("absurd")), charge(chargeValue("stable"))), true);
    assert.equal(leqKnowledge(charge(chargeValue("potential")), charge(chargeValue("active"))), false);
  });
});

describe("the truth lattice (bottom = active, top = potential)", () => {
  it("active is the join identity; potential absorbs", () => {
    for (const x of NAMES) { assert.equal(t("active", x), x); assert.equal(t("potential", x), "potential"); }
  });
  it("potential is the meet identity; active absorbs", () => {
    for (const x of NAMES) { assert.equal(tm("potential", x), x); assert.equal(tm("active", x), "active"); }
  });
  it("the orthogonal pair absurd/stable joins to potential and meets to active", () => {
    assert.equal(t("absurd", "stable"), "potential");
    assert.equal(tm("absurd", "stable"), "active");
  });
  it("≤_t agrees with join: active ≤ potential, and absurd/stable are incomparable", () => {
    assert.equal(leqTruth(charge(chargeValue("active")), charge(chargeValue("potential"))), true);
    assert.equal(leqTruth(charge(chargeValue("absurd")), charge(chargeValue("stable"))), false);
  });
});

describe("the gauge group acting on FOUR", () => {
  it("negation is an involution that swaps potential/active and fixes absurd/stable", () => {
    assert.equal(negateValue(chargeValue("potential")).name, "active");
    assert.equal(negateValue(chargeValue("active")).name, "potential");
    assert.equal(negateValue(chargeValue("absurd")).name, "absurd");
    assert.equal(negateValue(chargeValue("stable")).name, "stable");
    for (const n of NAMES) assert.ok(sameChargeValue(negateValue(negateValue(chargeValue(n))), chargeValue(n)));
  });
  it("conflation is an involution that swaps absurd/stable and fixes potential/active", () => {
    assert.equal(conflateValue(chargeValue("absurd")).name, "stable");
    assert.equal(conflateValue(chargeValue("stable")).name, "absurd");
    assert.equal(conflateValue(chargeValue("potential")).name, "potential");
    for (const n of NAMES) assert.ok(sameChargeValue(conflateValue(conflateValue(chargeValue(n))), chargeValue(n)));
  });
  it("the four gauge elements form a Klein-four group: each is its own inverse, id fixes all", () => {
    assert.deepEqual([...gaugeElementNames].sort(), ["conflation", "double", "id", "negation"]);
    for (const n of NAMES) {
      assert.ok(sameChargeValue(gauge("id", chargeValue(n)), chargeValue(n)));
      for (const g of gaugeElementNames) {
        assert.ok(sameChargeValue(gauge(g, gauge(g, chargeValue(n))), chargeValue(n)), `${g}∘${g} = id at ${n}`);
      }
    }
  });
  it("negation fixes exactly {absurd, stable}", () => {
    assert.deepEqual(fixedSet("negation").map((v) => v.name).sort(), ["absurd", "stable"]);
  });
});

describe("charge carries and accumulates evidence (content-addressed, paraconsistent)", () => {
  it("a witnessed potential is truth-only and bears its one witness", () => {
    const c = witnessedPotential(mark("w"));
    assert.equal(valueOf(c).name, "potential");
    assert.equal(c.evidence[0].length, 1);
    assert.equal(c.evidence[1].length, 0);
  });
  it("knowledge-join merges evidence on each side", () => {
    const merged = joinKnowledge(witnessedPotential(mark("a")), witnessedPotential(mark("b")));
    assert.equal(valueOf(merged).name, "potential");
    assert.equal(merged.evidence[0].length, 2);
  });
  it("evidence dedupes by structural content: equal witnesses count once", () => {
    const merged = joinKnowledge(witnessedPotential(mark("w")), witnessedPotential(mark("w")));
    assert.equal(merged.evidence[0].length, 1);
  });
  it("contradiction is held, not exploded: opposing evidence joins to stable", () => {
    const truthy = witnessedPotential(mark("yes"));
    const falsy = charge(chargeValue("active"), [[], [mark("no")]]);
    const both = joinKnowledge(truthy, falsy);
    assert.equal(valueOf(both).name, "stable"); // ⊤, with evidence on both sides — no explosion
    assert.equal(both.evidence[0].length, 1);
    assert.equal(both.evidence[1].length, 1);
  });
});

describe("posit values a predication as a presheaf of fibers", () => {
  it("posits the site into a presheaf seeded with the fiber valuation", () => {
    const pres = posit(predicate(articulate(utterance(mark("s"), mark("p")))));
    assert.equal(pres.kind, "predication.posit.presheaf");
    assert.equal(pres.traces.length, 1);
  });
});
