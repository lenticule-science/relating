/**
 * Contract: the order-swap σ and the dihedral gauge D₄ of FOUR. σ is the cross-order
 * iso (≤knowledge ≅ ≤truth) that K₄ lacks; adjoining it gives the order-8 dihedral
 * symmetry of the bilattice square. These promises mirror lean/RelMath's incoming
 * `d4_is_dihedral` and `d4_is_aut_four`: the dihedral relation σ∼σ = −, faithful
 * order-8 closure, and the K₄ (order-preserving) vs K₄·σ (order-swapping) split.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  chargeValue,
  chargeValueNames,
  sameChargeValue,
  orderSwapValue,
  dihedral,
  dihedralElementNames,
  dihedralMul,
  dihedralOrderEffect,
  orderSwapIso,
  dihedralConjugation,
  dihedralSwapsOrders,
} from "@emsenn/relating";

const values = chargeValueNames.map(chargeValue);
const k4 = ["id", "negation", "conflation", "double"];
const swapCoset = ["order-swap", "order-swap-negation", "order-swap-conflation", "order-swap-double"];
const permutationOf = (g) => chargeValueNames.map((n) => dihedral(g, chargeValue(n)).name);

describe("order-swap σ", () => {
  it("is the involution that swaps absurd↔active and potential↔stable", () => {
    assert.equal(orderSwapValue(chargeValue("absurd")).name, "active");
    assert.equal(orderSwapValue(chargeValue("active")).name, "absurd");
    assert.equal(orderSwapValue(chargeValue("potential")).name, "stable");
    assert.equal(orderSwapValue(chargeValue("stable")).name, "potential");
    for (const v of values) assert.ok(sameChargeValue(orderSwapValue(orderSwapValue(v)), v));
  });

  it("is the cross-order iso at every pair: a ≤knowledge b ⟺ σa ≤truth σb", () => {
    for (const left of values) {
      for (const right of values) {
        assert.equal(orderSwapIso(left, right).kind, "dihedral-gauge.orderSwapIso:witness");
      }
    }
  });
});

describe("dihedral gauge D₄", () => {
  it("has exactly eight elements that act as eight distinct permutations (faithful)", () => {
    assert.equal(dihedralElementNames.length, 8);
    const seen = new Set(dihedralElementNames.map((g) => permutationOf(g).join(",")));
    assert.equal(seen.size, 8);
  });

  it("is closed, and the derived multiplication realizes composition of the action", () => {
    for (const g of dihedralElementNames) {
      for (const h of dihedralElementNames) {
        const gh = dihedralMul(g, h);
        assert.ok(dihedralElementNames.includes(gh));
        for (const v of values) {
          assert.ok(sameChargeValue(dihedral(gh, v), dihedral(g, dihedral(h, v))));
        }
      }
    }
  });

  it("has `id` as two-sided identity and is genuinely non-abelian", () => {
    for (const g of dihedralElementNames) {
      assert.equal(dihedralMul("id", g), g);
      assert.equal(dihedralMul(g, "id"), g);
    }
    assert.notEqual(
      dihedralMul("order-swap", "negation"),
      dihedralMul("negation", "order-swap"),
    );
  });

  it("satisfies the defining dihedral relation σ∼σ = − at every value", () => {
    for (const v of values) {
      assert.equal(dihedralConjugation(v).kind, "dihedral-gauge.conjugation:witness");
    }
  });

  it("splits into the order-preserving K₄ and the order-swapping K₄·σ coset", () => {
    for (const g of k4) {
      assert.equal(dihedralOrderEffect(g), "order-preserving");
      // K₄ preserves each order — it does not swap them.
      assert.equal(dihedralSwapsOrders(g).kind, "dihedral-gauge.swapsOrders-obstruction");
    }
    for (const g of swapCoset) {
      assert.equal(dihedralOrderEffect(g), "order-swapping");
      // K₄·σ exchanges the two orders — the Priestley swap, the non-trivial D₄/K₄ class.
      assert.equal(dihedralSwapsOrders(g).kind, "dihedral-gauge.swapsOrders:witness");
    }
  });
});
