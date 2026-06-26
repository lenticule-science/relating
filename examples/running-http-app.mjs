import assert from "node:assert/strict";
import { Readable } from "node:stream";

import {
  createProjectedEventHub,
  jsonRepr,
  readJsonBody,
  textRepr,
  wellKnown,
  writeSseComment,
  writeSseEvent,
} from "@emsenn/relating/running/http";

const app = wellKnown([
  {
    name: "relating",
    produces: ["application/json; charset=utf-8"],
    repr: jsonRepr({
      product: "relating.running-http-app",
      surface: "http app object language",
    }),
  },
  {
    name: "status",
    repr: (_remainder, _ctx) => textRepr("stable\n"),
  },
]);

const relatingResource = app.resources.find((resource) => resource.match === "/.well-known/relating");
const statusResource = app.resources.find((resource) => resource.match === "/.well-known/status");
const relating = await relatingResource.handler({ params: {} });
const status = await statusResource.handler({ params: {} });

const topicSink = {
  chunks: [],
  write(chunk) {
    this.chunks.push(String(chunk));
    return true;
  },
};
const allSink = {
  chunks: [],
  write(chunk) {
    this.chunks.push(String(chunk));
    return true;
  },
};
const hub = createProjectedEventHub();
const unsubscribeTopic = hub.subscribe(topicSink, { topics: ["settlement"] });
hub.subscribe(allSink);
hub.publish([
  { type: "finding", topic: "docs", id: 1 },
  { type: "settlement", topic: "settlement", id: 2 },
]);
const subscribersBefore = hub.size();
const aliveAfterKeepAlive = hub.keepAlive();
unsubscribeTopic();
const subscribersAfter = hub.size();

const manualSink = { chunks: [], write(chunk) { this.chunks.push(String(chunk)); return true; } };
const manualEventOk = writeSseEvent(manualSink, "reading", { value: "stable" }, "42");
const manualCommentOk = writeSseComment(manualSink, "still-open");

const req = Readable.from([Buffer.from(JSON.stringify({ action: "inspect", body: "visible" }))]);
req.headers = { "content-type": "application/json; charset=utf-8" };
const parsed = await readJsonBody(req, { maxBytes: 1024 });

assert.equal(relating.type, "application/json; charset=utf-8");
assert.ok(String(relating.body).includes("relating.running-http-app"));
assert.equal(status.body, "stable\n");
assert.equal(topicSink.chunks.filter((chunk) => chunk.includes("event: settlement")).length, 1);
assert.equal(topicSink.chunks.some((chunk) => chunk.includes("finding")), false);
assert.equal(allSink.chunks.filter((chunk) => chunk.startsWith("event: ")).length, 2);
assert.equal(subscribersBefore, 2);
assert.equal(aliveAfterKeepAlive, 2);
assert.equal(subscribersAfter, 1);
assert.equal(manualEventOk, true);
assert.equal(manualCommentOk, true);
assert.equal(parsed.action, "inspect");

console.log(JSON.stringify({
  product: "relating.running-http-app",
  wellKnown: {
    resources: app.resources.length,
    relatingType: relating.type,
    statusBody: status.body,
  },
  sse: {
    topicChunks: topicSink.chunks.length,
    allEvents: allSink.chunks.filter((chunk) => chunk.startsWith("event: ")).length,
    subscribersBefore,
    aliveAfterKeepAlive,
    subscribersAfter,
    manualWrites: manualSink.chunks.length,
  },
  body: {
    parsed,
  },
}, null, 2));
