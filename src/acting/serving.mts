/**
 * acting/serving — the four transports as functorial images of the apex.
 *
 * `induceBins` gives one `InducedBins` carrier (the coproduct apex of a module's
 * actions). This module projects it, with no second ontology, to:
 *   - CLI         — `dispatch` (elsewhere; the `relate` bin)
 *   - HTTP        — `POST /:verb` (body→stdin, stdout→response), `GET /` discovery, `GET /health`
 *   - OpenAPI     — `GET /openapi.json` (a 3.1.1 document derived from the actions)
 *   - MCP         — `POST /mcp` (tools, resources, and prompts over one apex)
 *   - web UX      — `GET /:verb` (a basic HTML form) and `GET /` (the index)
 *
 * The MCP projection is the full standard knowledge-vault surface: `tools/list`
 * and `tools/call` run the morphisms; `resources/list` and `resources/read`
 * serve the package's schemas and discovery carrier; `prompts/list` and
 * `prompts/get` serve the guided per-action (and registered) prompts. All three
 * are functorial images of the same `induceBins` apex — no second ontology.
 *
 * Every routed POST goes through `dispatch`, so an HTTP/MCP/form call is a
 * scripted play and is witnessed as EAVT exactly like a CLI call. Pure routing
 * (`routeRequest`) is separated from the thin `node:http` binding (`serve`).
 */
import { createServer, type IncomingMessage, type Server } from "node:http";
import { wireCodec } from "./codecs.mjs";
import type { Action } from "./action.mjs";
import type { ActionDiscovery, ActionEndpoint, InducedBins } from "./induce.mjs";
import { resourceDescriptor, type ResourceCarrier } from "./resource.mjs";
import { promptDescriptor, type PromptCarrier } from "./prompt.mjs";
import type { DispatchOptions } from "./dispatch.mjs";

/** A routed response: status, content type, and body. */
export interface ServedResponse {
  readonly status: number;
  readonly type: string;
  readonly body: string;
}

/** A routed request: method, path, query string, and body. */
export interface ServedRequest {
  readonly method: string;
  readonly path: string;
  readonly query: Readonly<Record<string, string>>;
  readonly body: string;
}

/** Options for serving (the witnessing data root flows to dispatch). */
export interface ServeOptions extends DispatchOptions {
  readonly basePath?: string;
  readonly title?: string;
  readonly version?: string;
}

/** Minimal HTML text escape for the web-UX projection. */
function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch] ?? ch));
}

export const json = (value: unknown, status = 200): ServedResponse => ({ status, type: "application/json; charset=utf-8", body: `${JSON.stringify(value, null, 2)}\n` });
export const html = (body: string, status = 200): ServedResponse => ({ status, type: "text/html; charset=utf-8", body });
export const text = (body: string, status: number): ServedResponse => ({ status, type: "text/plain; charset=utf-8", body });

/** The OpenAPI 3.1.1 document derived from the discovery carrier. */
export function actionOpenApi(induced: InducedBins, options: ServeOptions = {}): Record<string, unknown> {
  const base = (options.basePath ?? "").replace(/\/+$/, "");
  const paths: Record<string, unknown> = {};
  for (const endpoint of induced.discovery.bins) {
    paths[`${base}/${endpoint.name}`] = {
      post: {
        operationId: endpoint.name,
        ...(endpoint.summary === undefined ? {} : { summary: endpoint.summary }),
        ...(endpoint.description === undefined ? {} : { description: endpoint.description }),
        requestBody: {
          required: true,
          content: { [endpoint.input]: { schema: endpoint.domainSchema ?? {} } },
        },
        responses: {
          "200": { description: "OK", content: { [endpoint.output]: { schema: endpoint.codomainSchema ?? {} } } },
          "400": { description: "Bad Request" },
        },
      },
    };
  }
  return {
    openapi: "3.1.1",
    info: { title: options.title ?? induced.discovery.package, version: options.version ?? "0.0.0" },
    paths,
  };
}

/** The MCP tools list derived from the actions (one tool per verb). */
export function actionMcpTools(actions: readonly Action[]): readonly Record<string, unknown>[] {
  return actions.map((act) => ({
    name: act.verb,
    ...(act.summary === undefined ? {} : { description: act.summary }),
    inputSchema: {
      type: "object",
      properties: { input: act.domainSchema ?? { description: `The ${act.inputFormat} input carrier for ${act.verb}.` } },
      required: ["input"],
    },
    ...(act.codomainSchema === undefined ? {} : { outputSchema: act.codomainSchema }),
  }));
}

/** The MCP resources list derived from the apex (schemas, discovery, registered). */
export function actionMcpResources(induced: InducedBins): readonly Record<string, unknown>[] {
  return induced.resources.map((res: ResourceCarrier) => ({ ...resourceDescriptor(res) }));
}

/** The MCP prompts list derived from the apex (per-action + registered). */
export function actionMcpPrompts(induced: InducedBins): readonly Record<string, unknown>[] {
  return induced.prompts.map((pr: PromptCarrier) => ({ ...promptDescriptor(pr) }));
}

function mcpResult(id: unknown, result: unknown): Record<string, unknown> {
  return { jsonrpc: "2.0", id, result };
}
function mcpError(id: unknown, code: number, message: string): Record<string, unknown> {
  return { jsonrpc: "2.0", id, error: { code, message } };
}

function promptArguments(value: unknown): Record<string, string> {
  if (typeof value !== "object" || value === null) return {};
  const out: Record<string, string> = {};
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    out[key] = typeof raw === "string" ? raw : JSON.stringify(raw);
  }
  return out;
}

/** The boundary document for an action's input from an MCP `arguments.input`. */
function stdinOf(value: unknown): string {
  return typeof value === "string" ? value : JSON.stringify(value);
}

/** Handle one MCP JSON-RPC message against the induced actions. */
export function actionMcpHandle(induced: InducedBins, message: unknown, options: ServeOptions): Record<string, unknown> | undefined {
  if (typeof message !== "object" || message === null) return mcpError(null, -32600, "invalid request");
  const record = message as Record<string, unknown>;
  const id = record["id"];
  const method = record["method"];
  if (record["jsonrpc"] !== "2.0" || typeof method !== "string") return mcpError(id ?? null, -32600, "invalid request");
  if (id === undefined) return undefined; // notification
  if (method === "initialize") {
    return mcpResult(id, { protocolVersion: "2025-06-18", serverInfo: { name: induced.discovery.package, version: options.version ?? "0.0.0" }, capabilities: { tools: {}, resources: {}, prompts: {} } });
  }
  if (method === "ping") return mcpResult(id, {});
  if (method === "tools/list") return mcpResult(id, { tools: actionMcpTools(induced.actions) });
  if (method === "tools/call") {
    const params = (record["params"] ?? {}) as Record<string, unknown>;
    const name = String(params["name"] ?? "");
    const args = (params["arguments"] ?? {}) as Record<string, unknown>;
    const result = induced.dispatch([name], stdinOf(args["input"]), options);
    if (result.code !== 0) return mcpResult(id, { isError: true, content: [{ type: "text", text: result.stderr.trim() }] });
    return mcpResult(id, { content: [{ type: "text", text: result.stdout.trim() }] });
  }
  if (method === "resources/list") return mcpResult(id, { resources: actionMcpResources(induced) });
  if (method === "resources/read") {
    const params = (record["params"] ?? {}) as Record<string, unknown>;
    const uri = String(params["uri"] ?? "");
    const res = induced.resources.find((candidate) => candidate.uri === uri);
    if (res === undefined) return mcpError(id, -32602, `no such resource: ${uri}`);
    let text: string;
    try {
      text = res.read();
    } catch (error) {
      return mcpError(id, -32603, `resource read failed: ${error instanceof Error ? error.message : String(error)}`);
    }
    return mcpResult(id, { contents: [{ uri: res.uri, mimeType: res.mimeType, text }] });
  }
  if (method === "prompts/list") return mcpResult(id, { prompts: actionMcpPrompts(induced) });
  if (method === "prompts/get") {
    const params = (record["params"] ?? {}) as Record<string, unknown>;
    const name = String(params["name"] ?? "");
    const pr = induced.prompts.find((candidate) => candidate.name === name);
    if (pr === undefined) return mcpError(id, -32602, `no such prompt: ${name}`);
    let messages: readonly { readonly role: string; readonly content: { readonly type: "text"; readonly text: string } }[];
    try {
      messages = pr.compose(promptArguments(params["arguments"]));
    } catch (error) {
      return mcpError(id, -32603, `prompt compose failed: ${error instanceof Error ? error.message : String(error)}`);
    }
    return mcpResult(id, { ...(pr.description === undefined ? {} : { description: pr.description }), messages });
  }
  return mcpError(id, -32601, "method not found");
}

/** The HTML form for one endpoint (web UX: a textarea for the input, submit POSTs it). */
export function actionFormHtml(endpoint: ActionEndpoint, base: string): string {
  return [
    "<!doctype html><meta charset=utf-8>",
    `<title>${escapeHtml(endpoint.name)}</title>`,
    `<h1><code>${escapeHtml(endpoint.name)}</code></h1>`,
    endpoint.summary === undefined ? "" : `<p>${escapeHtml(endpoint.summary)}</p>`,
    endpoint.description === undefined ? "" : `<p><small>${escapeHtml(endpoint.description)}</small></p>`,
    `<p><small>input: <code>${escapeHtml(endpoint.input)}</code> · output: <code>${escapeHtml(endpoint.output)}</code></small></p>`,
    `<form method="post" action="${escapeHtml(base)}/${escapeHtml(endpoint.name)}" enctype="text/plain">`,
    `<p><textarea name="body" rows="8" cols="72" placeholder="the input carrier on stdin"></textarea></p>`,
    `<p><button type="submit">run</button> <a href="${escapeHtml(base) || "/"}">↩ all operations</a></p>`,
    "</form>",
  ].filter(Boolean).join("\n");
}

/** The HTML index of all operations (web UX). */
export function actionIndexHtml(discovery: ActionDiscovery, base: string): string {
  const items = discovery.bins.map((endpoint) =>
    `<li><a href="${escapeHtml(base)}/${escapeHtml(endpoint.name)}"><code>${escapeHtml(endpoint.name)}</code></a>${endpoint.summary === undefined ? "" : ` — ${escapeHtml(endpoint.summary)}`}</li>`).join("\n");
  return [
    "<!doctype html><meta charset=utf-8>",
    `<title>${escapeHtml(discovery.package)}</title>`,
    `<h1>${escapeHtml(discovery.package)}</h1>`,
    `<p><a href="${escapeHtml(base)}/openapi.json">OpenAPI</a> · <code>POST ${escapeHtml(base)}/mcp</code> (MCP) · <code>GET ${escapeHtml(base)}/health</code></p>`,
    `<ol>${items}</ol>`,
  ].join("\n");
}

/** Route one request against the induced actions — the pure transport projection. */
export function routeRequest(induced: InducedBins, request: ServedRequest, options: ServeOptions = {}): ServedResponse {
  const base = (options.basePath ?? "").replace(/\/+$/, "");
  const path = request.path.startsWith(base) ? request.path.slice(base.length) : request.path;
  const verbOf = (p: string): string => decodeURIComponent(p.replace(/^\//, ""));

  if (request.method === "GET" && (path === "" || path === "/")) return html(actionIndexHtml(induced.discovery, base));
  if (request.method === "GET" && path === "/health") return json({ status: "ok", package: induced.discovery.package });
  if (request.method === "GET" && path === "/openapi.json") return json(actionOpenApi(induced, options));
  if (request.method === "GET" && path === "/discovery") return json(induced.discovery);

  if (request.method === "POST" && path === "/mcp") {
    let message: unknown;
    try {
      message = JSON.parse(request.body);
    } catch {
      return json(mcpError(null, -32700, "parse error"), 200);
    }
    const response = actionMcpHandle(induced, message, options);
    return response === undefined ? { status: 202, type: "application/json; charset=utf-8", body: "" } : json(response);
  }

  const verb = verbOf(path);
  const endpoint = induced.discovery.bins.find((bin) => bin.name === verb);
  if (endpoint === undefined) return text(`no such operation: ${verb}\n`, 404);

  // `input-format`/`output-format` are codec selectors; every other query field is
  // part of the input carrier, encoded as a form (`?token=foo&claim=bar` is the `form` wire).
  const outName = request.query["output-format"];
  const carrierFields = Object.entries(request.query).filter(([key]) => key !== "input-format" && key !== "output-format");

  // A GET with no carrier fields is the web-UX form; with fields it is an invocation.
  if (request.method === "GET" && carrierFields.length === 0) return html(actionFormHtml(endpoint, base));

  if (request.method === "GET" || request.method === "POST") {
    let stdin: string;
    let inName: string | undefined;
    if (carrierFields.length > 0) {
      // query/form fields ARE the input carrier, in its form encoding.
      stdin = new URLSearchParams(carrierFields).toString();
      inName = request.query["input-format"] ?? "form";
    } else {
      // a POST body: the web form posts `body=...`; a raw post is the body itself.
      stdin = request.body.startsWith("body=") ? decodeURIComponent(request.body.slice(5).replace(/\+/g, " ")) : request.body;
      inName = request.query["input-format"];
    }
    const argv = [verb, ...(inName ? ["--input-format", inName] : []), ...(outName ? ["--output-format", outName] : [])];
    const result = induced.dispatch(argv, stdin, options);
    if (result.code !== 0) return text(result.stderr, result.code === 2 ? 400 : 422);
    const outType = outName ? wireCodec(outName).mediaType : endpoint.output;
    return { status: 200, type: outType, body: result.stdout };
  }

  return text("method not allowed\n", 405);
}

// ── the manifold: a bundle of modules served as one tiled app ────────────────
//
// `serve` mounts ONE module's apex. A manifold mounts a chosen set of modules on
// one origin, each under its own name, TILED: a module mounts at the tail of
// whatever produces its domain carrier, so the URL path spells the data-flow
// composition rather than a flat `/<pkg>/<verb>` list. The wiring graph is derived
// from the schemas alone — edge producer→consumer iff a consumer action's
// `domainSchema.$ref` equals a producer action's `codomainSchema.$ref` (the carrier
// `$id`). `serve`/`routeRequest` are reused unchanged: each mount is routed by its
// existing `routeRequest` with its tiled basePath, so every mounted call is
// witnessed into its OWN package's EAVT ledger exactly as a standalone call.

/** One module mounted in a manifold: a name and its induced apex. */
export interface ManifoldMount {
  readonly name: string;
  readonly induced: InducedBins;
}

/** The `$ref` of a schema slot, when it names a carrier by `$id`. */
export function slotRef(schema: import("../codecs/json.mjs").JsonRecord | undefined): string | undefined {
  const ref = schema?.["$ref"];
  return typeof ref === "string" ? ref : undefined;
}

/** The carrier `$id`s a module's actions emit (`codomainSchema.$ref`). */
export function producedIds(induced: InducedBins): ReadonlySet<string> {
  const ids = new Set<string>();
  for (const act of induced.actions) { const r = slotRef(act.codomainSchema); if (r !== undefined) ids.add(r); }
  return ids;
}

/** The carrier `$id`s a module's actions admit (`domainSchema.$ref`). */
export function consumedIds(induced: InducedBins): ReadonlySet<string> {
  const ids = new Set<string>();
  for (const act of induced.actions) { const r = slotRef(act.domainSchema); if (r !== undefined) ids.add(r); }
  return ids;
}

/** Do any of `b`'s consumed carrier ids appear among `a`'s produced ids? */
export function feeds(a: InducedBins, b: InducedBins): boolean {
  const produced = producedIds(a);
  for (const id of consumedIds(b)) if (produced.has(id)) return true;
  return false;
}

/** The tiled basePath of each mount, keyed by name. A module mounts under a
 *  producer of its domain carrier (`/<producer>/<module>`); a source with no
 *  internal producer mounts at the root (`/<module>`). The path spells the
 *  composition. Resolution is order-independent and cycle-safe: an unplaceable
 *  module (its producer cycles, or isn't placed) falls back to a root mount. */
export function tileManifold(mounts: readonly ManifoldMount[]): ReadonlyMap<string, string> {
  const byName = new Map(mounts.map((m) => [m.name, m] as const));
  // For each module, the producer it tiles under (deterministic: first by name).
  const producerOf = new Map<string, string>();
  for (const m of mounts) {
    const producers = mounts
      .filter((p) => p.name !== m.name && feeds(p.induced, m.induced))
      .map((p) => p.name)
      .sort();
    if (producers.length > 0) producerOf.set(m.name, producers[0] as string);
  }
  const paths = new Map<string, string>();
  const place = (name: string, seen: ReadonlySet<string>): string => {
    const existing = paths.get(name);
    if (existing !== undefined) return existing;
    const producer = producerOf.get(name);
    const path = producer === undefined || seen.has(producer) || !byName.has(producer)
      ? `/${name}`
      : `${place(producer, new Set([...seen, name]))}/${name}`;
    paths.set(name, path);
    return path;
  };
  for (const m of mounts) place(m.name, new Set([m.name]));
  return paths;
}

/** The HTML index of a manifold: each mount at its tiled path. */
function manifoldIndexHtml(mounts: readonly ManifoldMount[], paths: ReadonlyMap<string, string>): string {
  const items = mounts.map((m) => {
    const base = paths.get(m.name) ?? `/${m.name}`;
    return `<li><a href="${escapeHtml(base)}"><code>${escapeHtml(base)}</code></a> — ${escapeHtml(m.induced.discovery.package)} (${m.induced.actions.length} ops)</li>`;
  }).join("\n");
  return [
    "<!doctype html><meta charset=utf-8>",
    "<title>manifold</title>",
    "<h1>manifold</h1>",
    "<p>A tiled bundle of modules; each mounts at the tail of whatever produces its domain carrier.</p>",
    `<ol>${items}</ol>`,
  ].join("\n");
}

/** Route one request against a manifold of tiled mounts — the pure projection.
 *  Selects the longest tiled basePath that prefixes the path and delegates to that
 *  mount's `routeRequest`; `serve`/`routeRequest` are reused unchanged. */
export function routeManifold(mounts: readonly ManifoldMount[], request: ServedRequest, options: ServeOptions = {}): ServedResponse {
  const root = (options.basePath ?? "").replace(/\/+$/, "");
  const path = request.path.startsWith(root) ? request.path.slice(root.length) : request.path;
  const paths = tileManifold(mounts);

  if (request.method === "GET" && (path === "" || path === "/")) return html(manifoldIndexHtml(mounts, paths));

  // Longest tiled-basePath match wins, so `/a/b/verb` routes to the mount at `/a/b`,
  // not the one at `/a`.
  const ranked = [...mounts]
    .map((m) => ({ mount: m, base: paths.get(m.name) ?? `/${m.name}` }))
    .sort((x, y) => y.base.length - x.base.length);
  for (const { mount, base } of ranked) {
    if (path === base || path.startsWith(`${base}/`)) {
      return routeRequest(mount.induced, request, { ...options, basePath: `${root}${base}` });
    }
  }
  return text(`no such module for path: ${path}\n`, 404);
}

/** Bind a manifold of mounts to a node:http server: one origin, many tiled modules. */
export function serveManifold(mounts: readonly ManifoldMount[], options: ServeOptions = {}): Server {
  const readBody = (req: IncomingMessage): Promise<string> => new Promise((resolve) => {
    let body = "";
    req.setEncoding("utf8");
    req.on("data", (chunk: string) => { body += chunk; });
    req.on("end", () => resolve(body));
  });
  return createServer((req, res) => {
    void (async () => {
      const url = new URL(req.url ?? "/", "http://localhost");
      const query: Record<string, string> = {};
      for (const [key, value] of url.searchParams) query[key] = value;
      const body = req.method === "POST" ? await readBody(req) : "";
      const response = routeManifold(mounts, { method: req.method ?? "GET", path: url.pathname, query, body }, options);
      res.writeHead(response.status, { "content-type": response.type });
      res.end(response.body);
    })();
  });
}

/** Bind the router to a node:http server. The single transport binding. */
export function serve(actions: readonly Action[], options: ServeOptions & { readonly induced?: InducedBins } = {}): Server {
  // induced may be passed in; otherwise the caller should pass actions + we induce lazily at first request.
  const inducedRef = options.induced;
  const readBody = (req: IncomingMessage): Promise<string> => new Promise((resolve) => {
    let body = "";
    req.setEncoding("utf8");
    req.on("data", (chunk: string) => { body += chunk; });
    req.on("end", () => resolve(body));
  });
  return createServer((req, res) => {
    void (async () => {
      const url = new URL(req.url ?? "/", "http://localhost");
      const query: Record<string, string> = {};
      for (const [key, value] of url.searchParams) query[key] = value;
      const body = req.method === "POST" ? await readBody(req) : "";
      const induced = inducedRef ?? (await import("./induce.mjs")).induceBins(actions);
      const response = routeRequest(induced, { method: req.method ?? "GET", path: url.pathname, query, body }, options);
      res.writeHead(response.status, { "content-type": response.type });
      res.end(response.body);
    })();
  });
}
