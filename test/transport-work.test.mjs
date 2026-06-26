/**
 * Contract: each transport reads its own work-type through the σ×Δ skillful-work
 * quartet. The four transports are the four work types, and their determination
 * charges are the four Belnap corners. A live claim session reads `Derivation`
 * while it stays consistent and drops to `Inquiry` the moment a cell conflicts.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  workType,
  determination,
  sessionWork,
  TRANSPORT_WORK,
  openSession,
  claim,
} from "@emsenn/relating/running";

describe("the four transports are the four work types", () => {
  it("names each transport's work from its σ×Δ nuclei", () => {
    assert.equal(workType(TRANSPORT_WORK["request-response"]), "Procedure"); // σ, ¬Δ
    assert.equal(workType(TRANSPORT_WORK["event-stream"]), "Process"); // σ, Δ
    assert.equal(workType(TRANSPORT_WORK["claim-session"]), "Derivation"); // ¬σ, Δ
    assert.equal(workType(TRANSPORT_WORK["open-session"]), "Inquiry"); // ¬σ, ¬Δ
  });

  it("the determination charges are the four distinct Belnap corners", () => {
    const charges = Object.values(TRANSPORT_WORK).map(determination);
    assert.deepEqual(new Set(charges), new Set(["potential", "stable", "active", "absurd"]));
    // both nuclei closed ⇒ ⊤ (stable); neither ⇒ ⊥ (absurd)
    assert.equal(determination({ meaningClosed: true, executionClosed: true }), "stable");
    assert.equal(determination({ meaningClosed: false, executionClosed: false }), "absurd");
  });
});

describe("a live claim session reads its own work-type", () => {
  it("is `Derivation` while consistent, `Inquiry` once a cell conflicts", () => {
    let s = openSession();
    assert.equal(workType(sessionWork(s)), "Derivation"); // empty: derives, no branch
    s = claim(s, "sky", "potential");
    assert.equal(workType(sessionWork(s)), "Derivation"); // one-sided: still Derivation
    s = claim(s, "sky", "active"); // a contradicting claim ⇒ ⊤ conflict ⇒ a branch
    assert.equal(workType(sessionWork(s)), "Inquiry"); // drops to Inquiry
  });
});
