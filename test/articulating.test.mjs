/**
 * Contract: the articulation base — `mark`, `utterance`, `articulate`, and the
 * token/claim coincidence judgments. These are the admission boundary every
 * downstream faculty builds on, so the promises here are load-bearing.
 *
 * Tested through the published package surface (`@emsenn/relating`),
 * never internal `dist/` paths; each test states the behavior the API guarantees.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  mark, utterance, articulate, token, claim,
  tokenIdentity, claimIdentity, coincides, isArticulationCell,
} from "@emsenn/relating";

describe("mark / utterance / articulate", () => {
  it("an utterance carries its two marks as a left token and a right claim", () => {
    const u = utterance(mark("s"), mark("p"));
    assert.equal(u.kind, "utterance.carrier");
    assert.equal(u.token.mark.value, "s");
    assert.equal(u.claim.mark.value, "p");
  });

  it("a mark rejects an absent value (the atom must be present)", () => {
    assert.throws(() => mark(undefined), TypeError);
  });

  it("articulate opens the articulation cell on exactly the utterance, both slots empty (initial object)", () => {
    const cell = articulate(utterance(mark("s"), mark("p")));
    assert.equal(cell.kind, "utterance.articulation.cell");
    const [carrier, pairing] = cell.potentialAperiodicArticulationCell;
    assert.equal(carrier.token.mark.value, "s");
    assert.equal(carrier.claim.mark.value, "p");
    assert.deepEqual(pairing, [[], []]);
    assert.equal(isArticulationCell(cell), true);
  });

  it("isArticulationCell rejects a non-cell", () => {
    assert.equal(isArticulationCell({ kind: "nope" }), false);
  });
});

describe("coincidence is structural, not by reference", () => {
  it("coincides compares values, surviving a JSON round-trip of equal payloads", () => {
    assert.equal(coincides("x", "x"), true);
    assert.equal(coincides("x", "y"), false);
    // distinct objects with equal content coincide (key order is irrelevant)
    assert.equal(coincides({ a: 1, b: 2 }, { b: 2, a: 1 }), true);
    assert.equal(coincides([1, 2], [1, 2]), true);
    assert.equal(coincides({ a: 1 }, { a: 2 }), false);
  });

  it("tokenIdentity witnesses coincident marks and obstructs distinct ones", () => {
    assert.equal(tokenIdentity(token(mark("x")), token(mark("x"))).kind, "utterance.coincidence:witness");
    assert.equal(tokenIdentity(token(mark("x")), token(mark("y"))).kind, "utterance.coincidence-obstruction");
    // structural, not reference: two separately-built marks with equal content coincide
    assert.equal(tokenIdentity(token(mark({ a: 1 })), token(mark({ a: 1 }))).kind, "utterance.coincidence:witness");
  });

  it("claimIdentity mirrors tokenIdentity on the right hand", () => {
    assert.equal(claimIdentity(claim(mark("p")), claim(mark("p"))).kind, "utterance.coincidence:witness");
    assert.equal(claimIdentity(claim(mark("p")), claim(mark("q"))).kind, "utterance.coincidence-obstruction");
  });
});
