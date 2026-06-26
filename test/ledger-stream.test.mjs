/**
 * Contract: the Scott transport. An append-only EAVT witness log streams as
 * resumable Server-Sent Events — each row one `datom` event keyed by its content
 * identity. Streaming is monotone (extending the log only extends the output) and
 * `Last-Event-ID` resumes from the next row, the coordination-free κ=ω session.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { streamWitnessLog, EAVT_EVENT, feedResponse } from "@emsenn/relating/running";
import { eavtId } from "@emsenn/relating/writing";

const rows = [
  { e: "alice", a: "greet", v: 1, t: "t1" },
  { e: "bob", a: "greet", v: 2, t: "t2" },
  { e: "cara", a: "greet", v: 3, t: "t3" },
];

const frames = (sse) => (sse.match(/data:/g) ?? []).length;

describe("the EAVT log streams as resumable SSE", () => {
  it("emits one event per row, named by EAVT_EVENT", () => {
    const out = streamWitnessLog(rows);
    assert.equal(frames(out), 3);
    assert.ok(out.includes(EAVT_EVENT)); // the `datom` event name
    assert.ok(out.includes(eavtId(rows[0])) && out.includes(eavtId(rows[2])));
  });

  it("resumes after Last-Event-ID, not re-sending earlier rows", () => {
    const resumed = streamWitnessLog(rows, eavtId(rows[0]));
    assert.equal(frames(resumed), 2);
    assert.ok(!resumed.includes(eavtId(rows[0])));
    assert.ok(resumed.includes(eavtId(rows[1])));
  });

  it("is monotone: extending the log only extends the output", () => {
    const full = streamWitnessLog(rows);
    const more = streamWitnessLog([...rows, { e: "dan", a: "greet", v: 4, t: "t4" }]);
    assert.ok(more.startsWith(full)); // the prefix is byte-identical (Scott/CALM)
    assert.equal(frames(more), 4);
  });

  it("replays in full on an unknown Last-Event-ID (safe default)", () => {
    assert.equal(frames(streamWitnessLog(rows, "no-such-id")), 3);
  });

  it("feedResponse is the served SSE value: status, event-stream headers, frame body", () => {
    const res = feedResponse(rows);
    assert.equal(res.status, 200);
    assert.ok(Object.values(res.headers).join(" ").includes("event-stream"));
    assert.equal(res.body, streamWitnessLog(rows));
    // resumable: a Last-Event-ID narrows the body to the remaining rows
    assert.equal(frames(feedResponse(rows, eavtId(rows[0])).body), 2);
  });
});
