/**
 * Contract: the transfinite transport over a WebSocket frame loop. Each text frame
 * is a claim `{cell, charge}` advancing the monotone session; the reply is the
 * settled judgement (per-cell verdict, contested cells, regime). A contradicting
 * claim flips a cell to ⊤ (`stable`) and the session to `transfinite`, with nothing
 * retracted. The pure core (`exchangeClaim`) is split from the frame encoder.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  openSession,
  exchangeClaim,
  parseClaimMessage,
  judgementFrame,
} from "@emsenn/relating/running";

const msg = (cell, charge) => JSON.stringify({ cell, charge });

describe("the WS claim/judgement exchange", () => {
  it("advances the session and replies with the judgement", () => {
    const { session, reply } = exchangeClaim(openSession(), msg("sky", "potential"));
    const verdict = JSON.parse(reply);
    assert.equal(verdict.judgement.sky, "potential");
    assert.equal(verdict.regime, "scott");
    assert.deepEqual(verdict.conflicts, []);
    assert.equal(session.claims.length, 1);
  });

  it("flips to ⊤ / transfinite on a contradicting claim, with no retraction", () => {
    const first = exchangeClaim(openSession(), msg("sky", "potential"));
    const second = exchangeClaim(first.session, msg("sky", "active"));
    const verdict = JSON.parse(second.reply);
    assert.equal(verdict.judgement.sky, "stable"); // ⊤ (both for and against)
    assert.equal(verdict.regime, "transfinite");
    assert.deepEqual(verdict.conflicts, ["sky"]);
    assert.equal(second.session.claims.length, 2); // both claims still in the log
  });

  it("rejects a malformed claim message", () => {
    assert.throws(() => parseClaimMessage(JSON.stringify({ cell: "x", charge: "nope" })), /claim/);
    assert.throws(() => parseClaimMessage(JSON.stringify({ charge: "potential" })), /claim/);
  });

  it("encodes a judgement reply as a WebSocket text frame", () => {
    const frame = judgementFrame("hello");
    assert.ok(Buffer.isBuffer(frame));
    assert.equal(frame[0], 0x81); // FIN + opcode 0x1 (text)
  });
});
