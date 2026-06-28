/**
 * Contract: the live bindings mount the Scott and transfinite transports. `serve`
 * exposes `GET /feed` (the EAVT witness log as resumable SSE) and a WebSocket
 * upgrade running one bounded claim session per connection (each text frame a claim,
 * each reply the settled judgement, flipping to ⊤/transfinite on conflict).
 */
import { describe, it, after } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import net from "node:net";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import {
  action,
  actionFormHtml,
  actionIndexHtml,
  induceBins,
  serve,
  serveManifold,
  routeRequest,
  streamWitnessLog,
  attachClaimSession,
} from "@emsenn/relating/running";

const servers = [];
const dirs = [];
after(() => {
  for (const s of servers) {
    s.closeAllConnections?.();
    s.close();
  }
  for (const d of dirs) rmSync(d, { recursive: true, force: true });
});

const listen = (server) =>
  new Promise((resolve) => {
    servers.push(server);
    server.listen(0, "127.0.0.1", () => resolve(server.address().port));
  });

describe("the web UX transport: HTML render fiber", () => {
  it("renders action discovery and forms through the canonical render profile fiber", () => {
    const induced = induceBins([action({ verb: "echo", inputFormat: "json", outputFormat: "json", run: (x) => x })], { packageName: "test" });
    const index = actionIndexHtml(induced.discovery, "");
    const form = actionFormHtml(induced.discovery.bins[0], "");

    assert.match(index, /meta name="render-profile" content="relating-action-html"/);
    assert.match(index, /<style>\.rel-action-/);
    assert.match(index, /data-render-node="main"/);
    assert.doesNotMatch(index, /<!doctype html><meta charset=utf-8>/i);

    assert.match(form, /meta name="render-profile" content="relating-action-html"/);
    assert.match(form, /<form[^>]+enctype="text\/plain"/);
    assert.match(form, /<textarea/);
  });
});

describe("the Scott transport: GET /feed", () => {
  it("routes the witness log to a resumable SSE response (pure)", () => {
    const rows = [
      { e: "alice", a: "echo", v: 1, t: "t1" },
      { e: "bob", a: "echo", v: 2, t: "t2" },
    ];
    const induced = induceBins([action({ verb: "echo", inputFormat: "json", run: (x) => x })]);
    const res = routeRequest(
      induced,
      { method: "GET", path: "/feed", query: {}, body: "" },
      { witnessLog: () => rows },
    );
    assert.equal(res.status, 200);
    assert.ok(res.type.includes("text/event-stream"));
    assert.ok(res.headers["cache-control"] === "no-cache");
    assert.equal(res.body, streamWitnessLog(rows));
  });

  it("serves the live invocation feed over HTTP after a witnessed call", async () => {
    const dataRoot = mkdtempSync(path.join(tmpdir(), "rel-feed-"));
    dirs.push(dataRoot);
    const echo = action({ verb: "echo", inputFormat: "json", outputFormat: "json", run: (x) => x });
    const induced = induceBins([echo], { packageName: "test" });
    const port = await listen(serve([echo], { induced, dataRoot, namespace: "test" }));
    // a witnessed call writes one EAVT row to today's log
    await fetch(`http://127.0.0.1:${port}/echo`, { method: "POST", body: '{"hi":1}' });
    const res = await fetch(`http://127.0.0.1:${port}/feed`);
    assert.equal(res.status, 200);
    assert.ok((res.headers.get("content-type") ?? "").includes("text/event-stream"));
    assert.ok((await res.text()).includes("datom")); // the EAVT row event
  });

  it("serves a per-mount feed under serveManifold", async () => {
    const dataRoot = mkdtempSync(path.join(tmpdir(), "rel-mfeed-"));
    dirs.push(dataRoot);
    const echo = action({ verb: "echo", inputFormat: "json", outputFormat: "json", run: (x) => x });
    const mount = { name: "alpha", induced: induceBins([echo], { packageName: "alpha" }) };
    const port = await listen(serveManifold([mount], { dataRoot, namespace: "alpha" }));
    await fetch(`http://127.0.0.1:${port}/alpha/echo`, { method: "POST", body: '{"hi":1}' });
    const res = await fetch(`http://127.0.0.1:${port}/alpha/feed`);
    assert.equal(res.status, 200);
    assert.ok((res.headers.get("content-type") ?? "").includes("text/event-stream"));
    assert.ok((await res.text()).includes("datom"));
  });
});

describe("the transfinite transport: WebSocket claim session", () => {
  const textFrame = (s) => {
    const p = Buffer.from(s, "utf-8");
    return Buffer.concat([Buffer.from([0x81, p.length]), p]); // fin+text, unmasked
  };

  it("upgrades, advances on claims, and flips to ⊤/transfinite on conflict", async () => {
    const server = attachClaimSession(createServer((_req, res) => res.end()));
    const port = await listen(server);
    const sock = net.connect(port, "127.0.0.1");
    await new Promise((r) => sock.once("connect", r));

    let buf = Buffer.alloc(0);
    const waitFor = (needle) =>
      new Promise((resolve, reject) => {
        const to = setTimeout(() => reject(new Error(`timeout waiting for ${needle}`)), 2000);
        const onData = (chunk) => {
          buf = Buffer.concat([buf, chunk]);
          if (buf.toString("utf-8").includes(needle)) {
            clearTimeout(to);
            sock.off("data", onData);
            resolve();
          }
        };
        sock.on("data", onData);
      });

    sock.write(
      "GET / HTTP/1.1\r\nUpgrade: websocket\r\nConnection: Upgrade\r\n" +
        "Sec-WebSocket-Key: dGhlIHNhbXBsZQ==\r\n\r\n",
    );
    await waitFor("101 Switching Protocols");

    sock.write(textFrame(JSON.stringify({ cell: "sky", charge: "potential" })));
    await waitFor('"regime":"scott"'); // first claim: consistent ⇒ scott

    sock.write(textFrame(JSON.stringify({ cell: "sky", charge: "active" })));
    await waitFor('"regime":"transfinite"'); // contradiction ⇒ ⊤ conflict ⇒ transfinite

    sock.on("error", () => {}); // swallow the post-close ECONNRESET
    await new Promise((resolve) => {
      sock.once("close", resolve);
      sock.destroy();
    });
  });
});
