/**
 * Contract: FCA operators — intentOfExtent (primeA), extentOfIntent (primeB),
 * closeExtent (B∘A), isConceptPair, formalConcept — against the Galois-connection
 * properties proven in RelMath.Order.FormalConceptAnalysis.
 *
 * Test context:
 *   Cells: a–p, a–q, b–p, b–r, c–p
 *   (subject "x" has predicate "y" iff the cell "x–y" appears above)
 *
 * Expected derivations:
 *   intentOf(["a","b","c"]) = ["p"]         (only p shared by all three)
 *   intentOf(["a"])          = ["p","q"]
 *   intentOf(["b"])          = ["p","r"]
 *   intentOf(["a","b"])      = ["p"]
 *   extentOf(["p"])          = ["a","b","c"]
 *   extentOf(["p","q"])      = ["a"]
 *   extentOf(["p","r"])      = ["b"]
 *   closeExtent(["a","b"])   = ["a","b","c"]  (B∘A: intent=["p"], then extentOf=["a","b","c"])
 *   closeExtent(["a"])       = ["a"]           (already closed: intent=["p","q"], extentOf=["a"])
 *   isConceptPair({extent:["a","b","c"], intent:["p"]}) = true
 *   isConceptPair({extent:["a"],         intent:["p","q"]}) = true
 *   isConceptPair({extent:["a","b"],     intent:["p"]}) = false  (extentOf(["p"])=["a","b","c"])
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { fca, evaluateRunTerm } from "@emsenn/relating";

// ── test context ──────────────────────────────────────────────────────────────

const cells = [
  { subject: "a", predicate: "p", object: "a" },
  { subject: "a", predicate: "q", object: "a" },
  { subject: "b", predicate: "p", object: "b" },
  { subject: "b", predicate: "r", object: "b" },
  { subject: "c", predicate: "p", object: "c" },
];

const run = (term, input) => evaluateRunTerm(term, input);

// ── intentOfExtent (primeA) ───────────────────────────────────────────────────

describe("fca.intentOfExtent — RelMath.FCA.primeA: attributes shared by all objects in extent", () => {
  it("full extent yields the single shared predicate", () => {
    const result = run(fca.intentOfExtent, { cells, extent: ["a", "b", "c"] });
    assert.deepEqual(result, ["p"]);
  });

  it("singleton extent yields all predicates of that subject", () => {
    const result = run(fca.intentOfExtent, { cells, extent: ["a"] });
    assert.deepEqual(result, ["p", "q"]);
  });

  it("two-subject extent intersects their predicates", () => {
    const result = run(fca.intentOfExtent, { cells, extent: ["a", "b"] });
    assert.deepEqual(result, ["p"]);
  });

  it("empty extent yields all predicates (vacuously every predicate is shared)", () => {
    const result = run(fca.intentOfExtent, { cells, extent: [] });
    assert.deepEqual(new Set(result), new Set(["p", "q", "r"]));
  });
});

// ── extentOfIntent (primeB) ───────────────────────────────────────────────────

describe("fca.extentOfIntent — RelMath.FCA.primeB: objects bearing all attributes in intent", () => {
  it("single-predicate intent yields all subjects that have it", () => {
    const result = run(fca.extentOfIntent, { cells, intent: ["p"] });
    assert.deepEqual(result, ["a", "b", "c"]);
  });

  it("two-predicate intent intersects to subjects bearing both", () => {
    const pq = run(fca.extentOfIntent, { cells, intent: ["p", "q"] });
    assert.deepEqual(pq, ["a"]);

    const pr = run(fca.extentOfIntent, { cells, intent: ["p", "r"] });
    assert.deepEqual(pr, ["b"]);
  });

  it("empty intent yields all subjects (vacuously every subject qualifies)", () => {
    const result = run(fca.extentOfIntent, { cells, intent: [] });
    assert.deepEqual(new Set(result), new Set(["a", "b", "c"]));
  });
});

// ── Galois connection: A ⊆ B(A(A)) ───────────────────────────────────────────

describe("fca: Galois connection — A ⊆ primeB(primeA(A)) (RelMath.FCA.galois_connection)", () => {
  it("every input extent is contained in its double-closure", () => {
    for (const extent of [["a"], ["b"], ["a", "b"], ["a", "b", "c"]]) {
      const intent = run(fca.intentOfExtent, { cells, extent });
      const doubled = run(fca.extentOfIntent, { cells, intent });
      // Every original subject must appear in the double-closure
      for (const s of extent) {
        assert.ok(doubled.includes(s), `${s} should be in extentOf(intentOf(${JSON.stringify(extent)}))`);
      }
    }
  });
});

// ── closeExtent (B∘A) ────────────────────────────────────────────────────────

describe("fca.closeExtent — RelMath.FCA.closeA: the closure operator B∘A", () => {
  it("closing {a,b} yields the full extent (only p is shared, and all three have p)", () => {
    const result = run(fca.closeExtent, { cells, extent: ["a", "b"] });
    assert.deepEqual(new Set(result), new Set(["a", "b", "c"]));
  });

  it("closing a single-subject extent yields its own closed extent", () => {
    const aResult = run(fca.closeExtent, { cells, extent: ["a"] });
    assert.deepEqual(aResult, ["a"]);  // intentOf(["a"])=["p","q"], extentOf(["p","q"])=["a"]

    const bResult = run(fca.closeExtent, { cells, extent: ["b"] });
    assert.deepEqual(bResult, ["b"]);
  });

  it("closure is idempotent: closeExtent(closeExtent(A)) = closeExtent(A)", () => {
    for (const extent of [["a"], ["b"], ["a", "b"], ["c"]]) {
      const once = run(fca.closeExtent, { cells, extent });
      const twice = run(fca.closeExtent, { cells, extent: once });
      assert.deepEqual(
        new Set(twice), new Set(once),
        `idempotent on extent ${JSON.stringify(extent)}`,
      );
    }
  });
});

// ── isConceptPair ─────────────────────────────────────────────────────────────

describe("fca.isConceptPair — the formal-concept condition (RelMath.FCA)", () => {
  it("accepts valid formal concepts", () => {
    assert.equal(
      run(fca.isConceptPair, { cells, extent: ["a", "b", "c"], intent: ["p"] }),
      true,
    );
    assert.equal(
      run(fca.isConceptPair, { cells, extent: ["a"], intent: ["p", "q"] }),
      true,
    );
    assert.equal(
      run(fca.isConceptPair, { cells, extent: ["b"], intent: ["p", "r"] }),
      true,
    );
  });

  it("rejects a pair where the extent is not closed (proper sub-extent)", () => {
    // extentOf(["p"]) = ["a","b","c"], not ["a","b"]
    assert.equal(
      run(fca.isConceptPair, { cells, extent: ["a", "b"], intent: ["p"] }),
      false,
    );
  });

  it("rejects a pair where the intent is wrong", () => {
    // intentOf(["a","b","c"]) = ["p"], not ["p","q"]
    assert.equal(
      run(fca.isConceptPair, { cells, extent: ["a", "b", "c"], intent: ["p", "q"] }),
      false,
    );
  });
});

// ── formalConcept ─────────────────────────────────────────────────────────────

describe("fca.formalConcept — construct a formal concept from a seed extent", () => {
  it("produced concept always satisfies isConceptPair", () => {
    for (const extent of [["a"], ["b"], ["a", "b"], ["c"], []]) {
      const concept = run(fca.formalConcept, { cells, extent });
      const valid = run(fca.isConceptPair, {
        cells,
        extent: concept.extent,
        intent: concept.intent,
      });
      assert.equal(valid, true, `concept from ${JSON.stringify(extent)} must be valid`);
    }
  });

  it("concept from seed {a,b} closes to the full {a,b,c} extent", () => {
    const concept = run(fca.formalConcept, { cells, extent: ["a", "b"] });
    assert.deepEqual(new Set(concept.extent), new Set(["a", "b", "c"]));
    assert.deepEqual(concept.intent, ["p"]);
    assert.equal(concept.kind, "predication.fca.concept");
  });

  it("concept from seed {a} stays {a} (already closed)", () => {
    const concept = run(fca.formalConcept, { cells, extent: ["a"] });
    assert.deepEqual(concept.extent, ["a"]);
    assert.deepEqual(new Set(concept.intent), new Set(["p", "q"]));
  });
});
