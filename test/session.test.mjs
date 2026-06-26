/**
 * Contract: the transfinite transport — a bounded interactive CLAIM session. It does
 * not overwrite: every claim stays in a monotone, append-only log (like the Scott
 * ledger). What moves is the JUDGEMENT — the ∨ₖ knowledge-join of all claims about a
 * cell. A cell standing `potential` (for) flips to `stable` (⊤, contested) when an
 * `active` (against) claim arrives, with the earlier claim still present. The session
 * is `scott` when nothing conflicts and `transfinite` when something does — bounded,
 * never aperiodic.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { openSession, claim, judge, conflicts, sessionRegime, settle } from "@emsenn/relating/running";

describe("a bounded claim session never overwrites", () => {
  it("opens empty and accumulates claims monotonically", () => {
    let s = openSession();
    assert.deepEqual(s, { claims: [], closed: false });
    s = claim(s, "sky", "potential"); // a claim FOR
    s = claim(s, "sky", "active"); // a claim AGAINST — does NOT remove the first
    assert.equal(s.claims.length, 2);
    assert.deepEqual(s.claims[0], { cell: "sky", charge: "potential" });
    assert.deepEqual(s.claims[1], { cell: "sky", charge: "active" });
  });

  it("changes the JUDGEMENT (for → ⊤ contested) without retracting the claim", () => {
    let s = claim(openSession(), "sky", "potential");
    assert.equal(judge(s).get("sky"), "potential"); // verdict: for
    s = claim(s, "sky", "active"); // a contradicting claim arrives
    assert.equal(judge(s).get("sky"), "stable"); // verdict flips to ⊤ (both/contested)
    assert.equal(s.claims.length, 2); // ...and BOTH claims remain in the log
  });

  it("merge is the ∨ₖ knowledge-join: idempotent and only grows", () => {
    let s = openSession();
    s = claim(s, "x", "potential");
    s = claim(s, "x", "potential"); // idempotent
    assert.equal(judge(s).get("x"), "potential");
    s = claim(s, "x", "active");
    assert.equal(judge(s).get("x"), "stable"); // grew to ⊤
    s = claim(s, "x", "potential"); // adding more for-evidence cannot un-conflict it
    assert.equal(judge(s).get("x"), "stable");
  });
});

describe("the session regime is read off the judgement", () => {
  it("is `scott` when no cell conflicts (flat, H¹=0)", () => {
    let s = openSession();
    s = claim(s, "a", "potential"); // each cell one-sided
    s = claim(s, "b", "active");
    assert.deepEqual(conflicts(s), []);
    assert.equal(sessionRegime(s), "scott");
  });

  it("is `transfinite` when a cell reaches conflict (⊤, an NSC firing)", () => {
    let s = openSession();
    s = claim(s, "a", "potential");
    s = claim(s, "a", "active"); // a and ¬a → ⊤
    assert.deepEqual(conflicts(s), ["a"]);
    assert.equal(sessionRegime(s), "transfinite");
  });
});

describe("the close handshake settles the session", () => {
  it("preserves the log and judgement but accepts no further claim", () => {
    let s = claim(openSession(), "x", "potential");
    s = settle(s);
    assert.ok(s.closed);
    const after = claim(s, "x", "active"); // ignored once closed
    assert.equal(after.claims.length, 1);
    assert.equal(judge(after).get("x"), "potential"); // verdict unchanged
  });
});
