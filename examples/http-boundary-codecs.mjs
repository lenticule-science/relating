import assert from "node:assert/strict";

import {
  bearerChallenge,
  bearerToken,
  cacheControl,
  contentRange,
  ifNoneMatch,
  linkHeader,
  mcpInitializeResult,
  mcpOk,
  mcpToolStructuredResult,
  negotiateEncoding,
  negotiateLanguage,
  negotiateType,
  parseCacheControl,
  parseContentType,
  parseCookieHeader,
  parseLinkHeader,
  parseRange,
  parseSetCookie,
  parseSseStream,
  serializeContentType,
  serializeCookieHeader,
  serializeSetCookie,
  sseEventFrame,
  sseHeaders,
} from "@emsenn/relating/writing/http";

const contentType = parseContentType("Application/JSON; Charset=\"utf-8\"");
assert.equal(contentType?.type, "application/json");
assert.equal(contentType?.params.charset, "utf-8");
assert.equal(serializeContentType(contentType), "application/json; charset=utf-8");

const selectedType = negotiateType("text/html;q=0.2, application/json;q=1", [
  "text/html",
  "application/json",
]);
const selectedEncoding = negotiateEncoding("gzip;q=0.8, br;q=1, identity;q=0.1", [
  "identity",
  "gzip",
  "br",
]);
const selectedLanguage = negotiateLanguage("fr-CA;q=0.7, en;q=1", [
  "fr-CA",
  "en-US",
]);
assert.equal(selectedType, "application/json");
assert.equal(selectedEncoding, "br");
assert.equal(selectedLanguage, "en-US");

const cache = cacheControl({
  visibility: "public",
  maxAge: 60,
  staleWhileRevalidate: 30,
});
const parsedCache = parseCacheControl(cache);
assert.equal(parsedCache.visibility, "public");
assert.equal(parsedCache.maxAge, 60);
assert.equal(parsedCache.staleWhileRevalidate, 30);

const range = parseRange("bytes=2-5", 10);
assert.notEqual(range, null);
assert.notEqual(range, 416);
assert.equal(contentRange(range, 10), "bytes 2-5/10");
assert.equal(ifNoneMatch("\"v1\", W/\"v0\"", "\"v1\""), true);

const cookieHeader = serializeCookieHeader({ session: "abc 123", mode: "study" });
const cookies = parseCookieHeader(cookieHeader);
assert.equal(cookies.session, "abc 123");
assert.equal(cookies.mode, "study");

const setCookie = serializeSetCookie("session", "abc 123", {
  path: "/",
  httpOnly: true,
  secure: true,
  sameSite: "Lax",
});
const parsedSetCookie = parseSetCookie(setCookie);
assert.equal(parsedSetCookie?.name, "session");
assert.equal(parsedSetCookie?.httpOnly, true);
assert.equal(parsedSetCookie?.secure, true);

const eventFrame = sseEventFrame({
  event: "settlement",
  id: "42",
  data: JSON.stringify({ status: "stable" }),
});
const parsedEvents = parseSseStream(eventFrame);
assert.equal(parsedEvents[0]?.event, "settlement");
assert.equal(parsedEvents[0]?.id, "42");
assert.equal(sseHeaders()["content-type"], "text/event-stream");

const challenge = bearerChallenge({
  realm: "relating",
  error: "invalid_token",
});
assert.equal(bearerToken("Bearer abc.def"), "abc.def");
assert.match(challenge, /^Bearer /);

const link = linkHeader([
  { href: "https://561.group/relating", rel: "describedby", type: "text/html" },
]);
assert.equal(parseLinkHeader(link)[0]?.params.rel, "describedby");

const mcpInit = mcpInitializeResult({
  serverInfo: { name: "relating-example", version: "0.0.0" },
});
const rpcOk = mcpOk("1", { ready: true });
const toolResult = mcpToolStructuredResult({ status: "stable" });
assert.equal(mcpInit.capabilities.tools.listChanged, false);
assert.equal(rpcOk.jsonrpc, "2.0");
assert.equal(toolResult.structuredContent?.status, "stable");

console.log(JSON.stringify({
  product: "relating.http-boundary-codecs",
  contentType: {
    parsed: contentType,
    serialized: serializeContentType(contentType),
  },
  negotiation: {
    type: selectedType,
    encoding: selectedEncoding,
    language: selectedLanguage,
  },
  caching: {
    header: cache,
    parsed: parsedCache,
    ifNoneMatchFailed: ifNoneMatch("\"v1\", W/\"v0\"", "\"v1\""),
  },
  range: {
    selected: range,
    contentRange: contentRange(range, 10),
  },
  cookies: {
    requestHeader: cookieHeader,
    names: Object.keys(cookies),
    setCookie,
    sameSite: parsedSetCookie?.sameSite,
  },
  streaming: {
    frameBytes: eventFrame.length,
    event: parsedEvents[0],
    headers: sseHeaders(),
  },
  auth: {
    token: bearerToken("Bearer abc.def"),
    challenge,
  },
  links: parseLinkHeader(link),
  mcp: {
    protocolVersion: mcpInit.protocolVersion,
    rpc: rpcOk,
    toolResult,
  },
}, null, 2));
