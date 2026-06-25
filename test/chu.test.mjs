/**
 * Contract: Chu spaces over FOUR — dual, lookup, dualInvolution — against the
 * *-autonomous properties proven in RelMath.Order.LinearLogicChu and
 * RelMath.Positing.
 *
 * Test context:
 *   Space C:
 *     pts: ["a", "b"]
 *     sts: ["x", "y"]
 *     r: a-x=active, a-y=potential, b-x=stable, b-y=absurd
 *
 *   Negation table (RelMath.Positing.negate — coordinate swap ⟨a₁,a₂⟩→⟨a₂,a₁⟩):
 *     negate(absurd)    = absurd    (⟨0,0⟩ fixed)
 *     negate(potential) = active    (⟨0,1⟩ → ⟨1,0⟩)
 *     negate(active)    = potential (⟨1,0⟩ → ⟨0,1⟩)
 *     negate(stable)    = stable    (⟨1,1⟩ fixed)
 *
 *   Expected dual C⊥:
 *     pts: ["x", "y"],  sts: ["a", "b"]
 *     r: x-a=potential, y-a=active, x-b=stable, y-b=absurd
 *
 *   Expected dual(dual(C)) = C  (RelMath.Chu.dual_involution)
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { chu, evaluateRunTerm } from "@emsenn/relating";

// ── test context ──────────────────────────────────────────────────────────────

const space = {
  pts: ["a", "b"],
  sts: ["x", "y"],
  r: [
    { pt: "a", st: "x", charge: "active" },
    { pt: "a", st: "y", charge: "potential" },
    { pt: "b", st: "x", charge: "stable" },
    { pt: "b", st: "y", charge: "absurd" },
  ],
};

const run = (term, input) => evaluateRunTerm(term, input);

// ── chu.dual — basic structure ────────────────────────────────────────────────

describe("chu.dual — RelMath.Chu.dual_involution: swap pts↔sts, negate charges", () => {
  it("swaps pts and sts", () => {
    const d = run(chu.dual, space);
    assert.deepEqual(d.pts, space.sts);
    assert.deepEqual(d.sts, space.pts);
  });

  it("dual r has same entry count as original r", () => {
    const d = run(chu.dual, space);
    assert.equal(d.r.length, space.r.length);
  });

  it("transposes pt and st coordinates of each entry", () => {
    const d = run(chu.dual, space);
    // original: a-x=active → dual: x-a=?
    const axEntry = d.r.find((e) => e.pt === "x" && e.st === "a");
    assert.ok(axEntry, "dual should have a (x,a) entry");
    const ayEntry = d.r.find((e) => e.pt === "y" && e.st === "a");
    assert.ok(ayEntry, "dual should have a (y,a) entry");
  });

  it("negates active → potential (RelMath.Positing.negate)", () => {
    const d = run(chu.dual, space);
    // original a-x = active; dual x-a = negate(active) = potential
    const entry = d.r.find((e) => e.pt === "x" && e.st === "a");
    assert.equal(entry?.charge, "potential");
  });

  it("negates potential → active", () => {
    const d = run(chu.dual, space);
    // original a-y = potential; dual y-a = negate(potential) = active
    const entry = d.r.find((e) => e.pt === "y" && e.st === "a");
    assert.equal(entry?.charge, "active");
  });

  it("leaves stable fixed under negation", () => {
    const d = run(chu.dual, space);
    // original b-x = stable; dual x-b = negate(stable) = stable
    const entry = d.r.find((e) => e.pt === "x" && e.st === "b");
    assert.equal(entry?.charge, "stable");
  });

  it("leaves absurd fixed under negation", () => {
    const d = run(chu.dual, space);
    // original b-y = absurd; dual y-b = negate(absurd) = absurd
    const entry = d.r.find((e) => e.pt === "y" && e.st === "b");
    assert.equal(entry?.charge, "absurd");
  });
});

// ── chu.dual — the involution (RelMath.Chu.dual_involution) ───────────────────

describe("chu.dual — dual(dual(C)) = C for all test spaces", () => {
  it("double-dual returns the original space for the main test space", () => {
    const dd = run(chu.dual, run(chu.dual, space));
    assert.deepEqual(dd.pts, space.pts);
    assert.deepEqual(dd.sts, space.sts);
    assert.equal(dd.r.length, space.r.length);
    for (const orig of space.r) {
      const back = dd.r.find((e) => e.pt === orig.pt && e.st === orig.st);
      assert.ok(back, `should have (${orig.pt},${orig.st}) entry`);
      assert.equal(back.charge, orig.charge, `charge at (${orig.pt},${orig.st}) should round-trip`);
    }
  });

  it("double-dual on a space with only active/potential entries round-trips", () => {
    const ap = {
      pts: ["p"],
      sts: ["q"],
      r: [{ pt: "p", st: "q", charge: "active" }],
    };
    const dd = run(chu.dual, run(chu.dual, ap));
    assert.equal(dd.r[0].charge, "active");
    assert.deepEqual(dd.pts, ap.pts);
    assert.deepEqual(dd.sts, ap.sts);
  });

  it("double-dual on an empty r preserves empty r", () => {
    const empty = { pts: ["a"], sts: ["x"], r: [] };
    const dd = run(chu.dual, run(chu.dual, empty));
    assert.deepEqual(dd.pts, empty.pts);
    assert.deepEqual(dd.sts, empty.sts);
    assert.deepEqual(dd.r, []);
  });
});

// ── chu.lookup — matrix access ────────────────────────────────────────────────

describe("chu.lookup — evaluate the FOUR-valued matrix at a (pt, st) cell", () => {
  it("finds an active entry", () => {
    const result = run(chu.lookup, { space, pt: "a", st: "x" });
    assert.equal(result, "active");
  });

  it("finds a potential entry", () => {
    const result = run(chu.lookup, { space, pt: "a", st: "y" });
    assert.equal(result, "potential");
  });

  it("finds a stable entry", () => {
    const result = run(chu.lookup, { space, pt: "b", st: "x" });
    assert.equal(result, "stable");
  });

  it("finds an absurd entry (genuine absurd in the matrix)", () => {
    const result = run(chu.lookup, { space, pt: "b", st: "y" });
    assert.equal(result, "absurd");
  });

  it("returns absurd for a pt not in pts (not found)", () => {
    const result = run(chu.lookup, { space, pt: "z", st: "x" });
    assert.equal(result, "absurd");
  });

  it("returns absurd for a st not in sts (not found)", () => {
    const result = run(chu.lookup, { space, pt: "a", st: "z" });
    assert.equal(result, "absurd");
  });
});

// ── chu.dualInvolution — the theorem witness ──────────────────────────────────

describe("chu.dualInvolution — dual(dual(C)) = C as a proof-witness term", () => {
  it("returns true for the main test space", () => {
    const result = run(chu.dualInvolution, space);
    assert.equal(result, true);
  });

  it("returns true for a space with only stable charges", () => {
    const stable = {
      pts: ["a"], sts: ["x"],
      r: [{ pt: "a", st: "x", charge: "stable" }],
    };
    assert.equal(run(chu.dualInvolution, stable), true);
  });

  it("returns true for an empty-r space", () => {
    const empty = { pts: [], sts: [], r: [] };
    assert.equal(run(chu.dualInvolution, empty), true);
  });
});

// ── Galois key: lookup(dual(C), st, pt) = negate(lookup(C, pt, st)) ──────────

describe("chu: the Chu matrix adjointness — r⊥(st, pt) = negate(r(pt, st))", () => {
  it("holds for all (pt, st) pairs in the test space", () => {
    const d = run(chu.dual, space);
    for (const { pt, st, charge } of space.r) {
      // lookup(dual(C), st, pt) should equal negate(charge)
      const dualCharge = run(chu.lookup, { space: d, pt: st, st: pt });
      // compute expected negate manually:
      const negated = {
        active: "potential",
        potential: "active",
        stable: "stable",
        absurd: "absurd",
      }[charge];
      assert.equal(
        dualCharge,
        negated,
        `dual.r(${st},${pt}) should be negate(r(${pt},${st})) = negate(${charge}) = ${negated}`,
      );
    }
  });
});
