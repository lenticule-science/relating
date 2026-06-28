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
import { wireCodec, wireByMediaType, WIRE_CODEC_NAMES } from "./codecs.mjs";
import { mediaTypeCorner, negotiateRepresentation } from "../writing/http/negotiation/index.mjs";
import type { Action } from "./action.mjs";
import type { ActionDiscovery, ActionEndpoint, InducedBins } from "./induce.mjs";
import { resourceDescriptor, type ResourceCarrier } from "./resource.mjs";
import { promptDescriptor, type PromptCarrier } from "./prompt.mjs";
import type { DispatchOptions, DispatchResult } from "./dispatch.mjs";
import { registeredCategory } from "./category.mjs";
import type { EAVTRecord } from "../writing/eavt.mjs";
import { streamWitnessLog } from "../ledger/stream.mjs";
import { invocationStore } from "./invocation.mjs";
import { readWitnessLog } from "../ledger/store.mjs";
import { attachClaimSession } from "./ws-session.mjs";
import { sseFrame } from "../writing/http/sse/index.mjs";
import {
  freeSettlementFiltration,
  type SettlementFiltration,
  type SettlementFiltrationGenerators,
} from "../../lib/articulating/predicating/positing/settling/index.mjs";
import { articulate, mark, utterance } from "../../lib/articulating/utterance.mjs";
import { predicate } from "../../lib/articulating/predicating/predication.mjs";
import { posit } from "../../lib/articulating/predicating/positing/fiber.mjs";
import { fixedPoints } from "../../lib/articulating/predicating/positing/settling/fixed-point.mjs";
import { documentOfFixedPoint } from "../../lib/articulating/predicating/positing/settling/document.mjs";
import { completeGraphWeights } from "../../lib/articulating/predicating/positing/settling/analysis/index.mjs";
import {
  htmlCarrierOf,
  profile_forms_render_fiber,
  renderHtmlFiber,
  type CssClassFactorMap,
  type CssDeclaration,
  type CssSystem,
  type HtmlCarrierNode,
  type RenderProfile,
} from "../writing/html.mjs";

/**
 * Pure routed response returned by the serving projection.
 *
 * This is deliberately smaller than `node:http.ServerResponse`: the router
 * computes only status, content type, and body bytes. The `serve*` helpers bind
 * this value to Node's mutable socket API at the edge.
 */
export interface ServedResponse {
  /** HTTP status code to write at the binding boundary. */
  readonly status: number;
  /** Full response media type, usually including `charset=utf-8`. */
  readonly type: string;
  /** Serialized response body. */
  readonly body: string;
  /** Extra response headers (e.g. SSE `cache-control`/`connection`); merged after `type`. */
  readonly headers?: Readonly<Record<string, string>> | undefined;
}

/**
 * Pure routed request consumed by the serving projection.
 *
 * `accept` drives corner-aware content negotiation when no explicit
 * `output-format` is selected; absent, the action's declared output is served.
 * This keeps the core router testable without an HTTP listener while still
 * preserving the one header that changes the representation face.
 */
export interface ServedRequest {
  /** HTTP method as observed by the binding. */
  readonly method: string;
  /** URL pathname, optionally including the configured `basePath`. */
  readonly path: string;
  /** Query parameters flattened to the last string value per key. */
  readonly query: Readonly<Record<string, string>>;
  /** Request body already decoded as UTF-8 text by the binding. */
  readonly body: string;
  /** Optional HTTP `Accept` header used for representation negotiation. */
  readonly accept?: string | undefined;
  /** Optional `Last-Event-ID` for resuming the SSE feed from the next row. */
  readonly lastEventId?: string | undefined;
}

/**
 * Options shared by pure routing and live HTTP bindings.
 *
 * Dispatch options flow through unchanged, so a routed HTTP/MCP/form call can be
 * witnessed in the same append-only ledger as CLI dispatch. The extra fields
 * affect only mounted paths and generated descriptive documents.
 */
export interface ServeOptions extends DispatchOptions {
  /** URL prefix this induced apex is mounted under. */
  readonly basePath?: string;
  /** OpenAPI title; defaults to the induced package name. */
  readonly title?: string;
  /** OpenAPI/MCP server version string; defaults to `0.0.0`. */
  readonly version?: string;
  /** Reads the current witness log for the `GET /feed` Scott transport; the live
   *  bindings inject today's invocation log. Absent ⇒ the feed is empty. */
  readonly witnessLog?: (() => readonly EAVTRecord[]) | undefined;
}

const ACTION_HTML_COMPLETION = "ordinal.closure.regime.finite" as const;

const actionHtmlProfile: RenderProfile = Object.freeze({
  kind: "rendering.profile" as const,
  name: "relating-action-html",
  allowedElements: Object.freeze([
    "a",
    "button",
    "code",
    "form",
    "h1",
    "h2",
    "header",
    "label",
    "li",
    "main",
    "nav",
    "ol",
    "p",
    "section",
    "small",
    "span",
    "textarea",
  ]),
  allowedStyleBehavior: Object.freeze(["static"] as const),
  allowedCompletionRegimes: Object.freeze([ACTION_HTML_COMPLETION]),
  obligations: Object.freeze(["same-action-apex", "manual-call-boundary", "no-sidecar-renderer"]),
  preservationLaws: Object.freeze([
    "preserve-addresses",
    "preserve-order",
    "preserve-references",
    "preserve-valuation-sites",
    "carrier-not-document",
    "css-settles",
  ] as const),
});

type ActionHtmlNode = Omit<HtmlCarrierNode, "kind" | "semanticAddress" | "valuationSite">;

const actionDecl = (nodeId: string, property: string, value: string, sourceOrder: number): CssDeclaration => Object.freeze({
  kind: "rendering.css.declaration" as const,
  nodeId,
  property,
  value,
  sourceOrder,
});

function actionClassFactorMap(nodes: readonly HtmlCarrierNode[]): CssClassFactorMap {
  return Object.freeze({
    kind: "rendering.css.classFactorMap" as const,
    constraintGraph: completeGraphWeights(nodes.length),
    nodeIds: Object.freeze(nodes.map((node) => node.nodeId)),
    classes: Object.freeze(nodes.map((_node, index) => index)),
    alphabet: Object.freeze(nodes.map((node, index) => `rel-action-${node.element}-${index}`)),
  });
}

function actionDocument(token: string, claim: string): ReturnType<typeof documentOfFixedPoint> {
  return documentOfFixedPoint(
    fixedPoints(posit(predicate(articulate(utterance(mark(token), mark(claim)))))),
  );
}

function actionHtmlFiber(
  title: string,
  token: string,
  claim: string,
  nodeInputs: readonly ActionHtmlNode[],
  declarations: readonly CssDeclaration[],
  roots: readonly string[],
): string {
  const document = actionDocument(token, claim);
  if (document.kind !== "settledDocument.fixedPoint") {
    throw new TypeError(`actionHtmlFiber: document did not settle: ${document.reason}`);
  }
  const address = document.addresses[0]?.key;
  const valuationSite = document.valuationSites[0]?.address;
  if (address === undefined || valuationSite === undefined) {
    throw new TypeError("actionHtmlFiber: document settled without an address");
  }
  const nodes: readonly HtmlCarrierNode[] = Object.freeze(nodeInputs.map((node) => Object.freeze({
    ...node,
    kind: "rendering.htmlCarrier.node" as const,
    semanticAddress: address,
    valuationSite,
  })));
  const carrier = htmlCarrierOf(document, nodes);
  if (carrier.kind !== "rendering.htmlCarrier") {
    throw new TypeError(`actionHtmlFiber: carrier obstructed: ${carrier.reason}:${carrier.key}`);
  }
  const system: CssSystem<typeof carrier> = Object.freeze({
    kind: "rendering.css.system" as const,
    carrier,
    completionRegime: ACTION_HTML_COMPLETION,
    declarations: Object.freeze(declarations),
    classFactorMap: actionClassFactorMap(nodes),
  });
  const fiber = profile_forms_render_fiber(actionHtmlProfile, carrier, system, "static");
  if (fiber.kind !== "rendering.profile_forms_render_fiber:witness") {
    throw new TypeError(`actionHtmlFiber: profile obstructed: ${fiber.reason}:${fiber.key}`);
  }
  return renderHtmlFiber(fiber, {
    title,
    roots,
    metadata: Object.freeze({ "render-domain": "relating.running.actions" }),
  }).html;
}

function actionChrome(nodeIds: {
  readonly main: string;
  readonly header: string;
  readonly title: string;
  readonly nav: string;
}): CssDeclaration[] {
  let order = 0;
  const add = (nodeId: string, property: string, value: string): CssDeclaration =>
    actionDecl(nodeId, property, value, order++);
  return [
    add(nodeIds.main, "box-sizing", "border-box"),
    add(nodeIds.main, "max-width", "980px"),
    add(nodeIds.main, "margin", "0 auto"),
    add(nodeIds.main, "padding", "40px 24px 56px"),
    add(nodeIds.main, "font-family", "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"),
    add(nodeIds.main, "color", "#16201d"),
    add(nodeIds.main, "line-height", "1.5"),
    add(nodeIds.header, "border-bottom", "1px solid #d7ded9"),
    add(nodeIds.header, "padding-bottom", "18px"),
    add(nodeIds.header, "margin-bottom", "24px"),
    add(nodeIds.title, "font-size", "clamp(1.65rem, 3vw, 2.4rem)"),
    add(nodeIds.title, "line-height", "1.08"),
    add(nodeIds.title, "margin", "0 0 12px"),
    add(nodeIds.title, "font-weight", "680"),
    add(nodeIds.nav, "display", "flex"),
    add(nodeIds.nav, "flex-wrap", "wrap"),
    add(nodeIds.nav, "gap", "10px"),
    add(nodeIds.nav, "align-items", "center"),
    add(nodeIds.nav, "font-size", "0.94rem"),
  ];
}

/** Project a value to a JSON routed response. */
export const json = (value: unknown, status = 200): ServedResponse => ({ status, type: "application/json; charset=utf-8", body: `${JSON.stringify(value, null, 2)}\n` });
/** Project HTML text to a routed response. */
export const html = (body: string, status = 200): ServedResponse => ({ status, type: "text/html; charset=utf-8", body });
/** Project plain text to a routed response. */
export const text = (body: string, status: number): ServedResponse => ({ status, type: "text/plain; charset=utf-8", body });

/** The content corner the settled value commits to: the corner of the action's
 *  declared output wire. A value crosses the boundary down this corner but never up
 *  — negotiation may settle it to a lower corner, never fabricate a richer one. */
function valueCorner(endpoint: ActionEndpoint): import("../writing/projector.mjs").Corner {
  const codec = wireByMediaType(endpoint.output);
  return codec?.corner ?? mediaTypeCorner(endpoint.output);
}

/** Choose the wire to emit a response down, honoring the bilattice asymmetry.
 *
 *  An explicit `output-format` is a NAMED selection and always wins (the caller
 *  asked for that wire by name). Otherwise, when an `Accept` header is present, the
 *  offered wires are negotiated against it BUT restricted to those whose content
 *  corner does not exceed the settled value's: a `data` value may be served as
 *  json but never as turtle/rmn (`assertion`), because that would fabricate
 *  assertivity the value does not carry. With no `Accept` and no explicit format,
 *  the action's declared output is served. Returns the wire NAME for dispatch and
 *  the media type to label the response. */
function negotiateOutputWire(
  endpoint: ActionEndpoint,
  explicitOutName: string | undefined,
  accept: string | undefined,
): { readonly name: string | undefined; readonly mediaType: string } {
  if (explicitOutName !== undefined) {
    return { name: explicitOutName, mediaType: wireCodec(explicitOutName).mediaType };
  }
  if (accept === undefined || accept.trim() === "") {
    return { name: undefined, mediaType: endpoint.output };
  }
  const offered = WIRE_CODEC_NAMES.map((n) => wireCodec(n).mediaType);
  const chosen = negotiateRepresentation(accept, offered, valueCorner(endpoint));
  if (chosen === null) return { name: undefined, mediaType: endpoint.output };
  const codec = wireByMediaType(chosen);
  // The declared output already matches the negotiated representation: serve it as-is.
  if (codec === undefined || codec.mediaType === endpoint.output) {
    return { name: undefined, mediaType: endpoint.output };
  }
  return { name: codec.name, mediaType: codec.mediaType };
}

/**
 * Project an induced action apex to an OpenAPI 3.1.1 document.
 *
 * The paths are not authored independently: each POST operation is an action
 * endpoint, and request/response schemas are the carrier refs already present on
 * that endpoint. The component schema table is the live carrier registry, so the
 * generated document is a transport face of the category rather than a second
 * source of API truth.
 */
export function actionOpenApi(induced: InducedBins, options: ServeOptions = {}): Record<string, unknown> {
  const base = (options.basePath ?? "").replace(/\/+$/, "");
  const paths: Record<string, unknown> = {};
  for (const endpoint of induced.discovery.bins) {
    paths[`${base}/${endpoint.name}`] = {
      post: {
        operationId: endpoint.name,
        "x-settlement-regime": endpoint.settlement.regime,
        "x-settlement-transport": endpoint.settlement.transport,
        "x-settlement-finality": endpoint.settlement.finality,
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
    components: {
      schemas: Object.fromEntries(registeredCategory.carriers().map((carrier) => [carrier.id, carrier.schema])),
    },
  };
}

/**
 * Project actions to MCP tool descriptors.
 *
 * Each action becomes one tool named by its verb. The tool input is a single
 * `input` property whose schema is the action domain ref when one exists; the
 * output schema mirrors the codomain ref when present. Calls still execute
 * through dispatch, so this list is discovery metadata, not an executor.
 */
export function actionMcpTools(actions: readonly Action[]): readonly Record<string, unknown>[] {
  return actionMcpToolsWithEndpoints(actions, []);
}

function actionMcpToolsWithEndpoints(actions: readonly Action[], endpoints: readonly ActionEndpoint[]): readonly Record<string, unknown>[] {
  const byName = new Map(endpoints.map((endpoint) => [endpoint.name, endpoint] as const));
  return actions.map((act) => ({
    name: act.verb,
    ...(act.summary === undefined ? {} : { description: act.summary }),
    inputSchema: {
      type: "object",
      properties: { input: act.domainSchema ?? { description: `The ${act.inputFormat} input carrier for ${act.verb}.` } },
      required: ["input"],
    },
    ...(act.codomainSchema === undefined ? {} : { outputSchema: act.codomainSchema }),
    ...(byName.get(act.verb) === undefined ? {} : {
      "x-settlement-regime": byName.get(act.verb)!.settlement.regime,
      "x-settlement-transport": byName.get(act.verb)!.settlement.transport,
      "x-settlement-finality": byName.get(act.verb)!.settlement.finality,
    }),
  }));
}

/**
 * Project an induced apex to MCP resource descriptors.
 *
 * Resources include registered package artifacts plus resources derived by
 * `induceBins`, such as carrier schemas, action input/output schemas, discovery,
 * and the operations-manifold read.
 */
export function actionMcpResources(induced: InducedBins): readonly Record<string, unknown>[] {
  return induced.resources.map((res: ResourceCarrier) => ({ ...resourceDescriptor(res) }));
}

/**
 * Project an induced apex to MCP prompt descriptors.
 *
 * Registered prompts are preserved and per-action prompts are derived from the
 * same action metadata, keeping agent guidance coupled to the operation
 * declaration.
 */
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

/**
 * Handle one MCP JSON-RPC message against an induced apex.
 *
 * The handler implements the package's knowledge-vault face: initialize/ping,
 * `tools/list`, `tools/call`, `resources/list`, `resources/read`,
 * `prompts/list`, and `prompts/get`. Tool calls are routed through the induced
 * dispatcher, so codecs and optional witnessing stay identical to CLI/HTTP
 * dispatch. Notifications return `undefined`, matching JSON-RPC's no-response
 * rule.
 */
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
  if (method === "tools/list") return mcpResult(id, { tools: actionMcpToolsWithEndpoints(induced.actions, induced.discovery.bins) });
  if (method === "tools/call") {
    const params = (record["params"] ?? {}) as Record<string, unknown>;
    const name = String(params["name"] ?? "");
    const args = (params["arguments"] ?? {}) as Record<string, unknown>;
    const result = induced.dispatch([name], stdinOf(args["input"]), options);
    if (result.code !== 0) return mcpResult(id, { isError: true, content: [{ type: "text", text: result.stderr.trim() }] });
    const endpoint = induced.discovery.bins.find((bin) => bin.name === name);
    const text = endpoint !== undefined && endpoint.settlement.regime !== "strict-finite"
      ? JSON.stringify(partialObservation(endpoint, result.stdout, options.basePath ?? ""), null, 2)
      : result.stdout.trim();
    return mcpResult(id, { content: [{ type: "text", text }] });
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

/**
 * Async variant of `actionMcpHandle`.
 *
 * Use this when any action body may return a promise. The MCP shape is the same
 * as the synchronous handler; only tool execution awaits `dispatchAsync`.
 */
export async function actionMcpHandleAsync(induced: InducedBins, message: unknown, options: ServeOptions): Promise<Record<string, unknown> | undefined> {
  if (typeof message !== "object" || message === null) return mcpError(null, -32600, "invalid request");
  const record = message as Record<string, unknown>;
  const id = record["id"];
  const method = record["method"];
  if (record["jsonrpc"] !== "2.0" || typeof method !== "string") return mcpError(id ?? null, -32600, "invalid request");
  if (id === undefined) return undefined;
  if (method === "initialize") {
    return mcpResult(id, { protocolVersion: "2025-06-18", serverInfo: { name: induced.discovery.package, version: options.version ?? "0.0.0" }, capabilities: { tools: {}, resources: {}, prompts: {} } });
  }
  if (method === "ping") return mcpResult(id, {});
  if (method === "tools/list") return mcpResult(id, { tools: actionMcpToolsWithEndpoints(induced.actions, induced.discovery.bins) });
  if (method === "tools/call") {
    const params = (record["params"] ?? {}) as Record<string, unknown>;
    const name = String(params["name"] ?? "");
    const args = (params["arguments"] ?? {}) as Record<string, unknown>;
    const result = await induced.dispatchAsync([name], stdinOf(args["input"]), options);
    if (result.code !== 0) return mcpResult(id, { isError: true, content: [{ type: "text", text: result.stderr.trim() }] });
    const endpoint = induced.discovery.bins.find((bin) => bin.name === name);
    const text = endpoint !== undefined && endpoint.settlement.regime !== "strict-finite"
      ? JSON.stringify(partialObservation(endpoint, result.stdout, options.basePath ?? ""), null, 2)
      : result.stdout.trim();
    return mcpResult(id, { content: [{ type: "text", text }] });
  }
  if (method === "resources/list") return mcpResult(id, { resources: actionMcpResources(induced) });
  if (method === "resources/read") {
    const params = (record["params"] ?? {}) as Record<string, unknown>;
    const uri = String(params["uri"] ?? "");
    const res = induced.resources.find((candidate) => candidate.uri === uri);
    if (res === undefined) return mcpError(id, -32602, `no such resource: ${uri}`);
    try {
      return mcpResult(id, { contents: [{ uri: res.uri, mimeType: res.mimeType, text: res.read() }] });
    } catch (error) {
      return mcpError(id, -32603, `resource read failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  if (method === "prompts/list") return mcpResult(id, { prompts: actionMcpPrompts(induced) });
  if (method === "prompts/get") {
    const params = (record["params"] ?? {}) as Record<string, unknown>;
    const name = String(params["name"] ?? "");
    const pr = induced.prompts.find((candidate) => candidate.name === name);
    if (pr === undefined) return mcpError(id, -32602, `no such prompt: ${name}`);
    try {
      return mcpResult(id, { ...(pr.description === undefined ? {} : { description: pr.description }), messages: pr.compose(promptArguments(params["arguments"])) });
    } catch (error) {
      return mcpError(id, -32603, `prompt compose failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  return mcpError(id, -32601, "method not found");
}

/** Project one action endpoint into the canonical render fiber codomain. */
export function actionFormHtml(endpoint: ActionEndpoint, base: string): string {
  const actionPath = base + "/" + endpoint.name;
  const nodes: ActionHtmlNode[] = [
    { nodeId: "main", element: "main", children: ["header", "meta", "form"] },
    { nodeId: "header", element: "header", children: ["title", "nav"] },
    { nodeId: "title", element: "h1", children: ["title-code"] },
    { nodeId: "title-code", element: "code", text: endpoint.name },
    { nodeId: "nav", element: "nav", children: ["all-link"] },
    { nodeId: "all-link", element: "a", text: "All operations", attributes: { href: base || "/" } },
    {
      nodeId: "meta",
      element: "section",
      children: [
        ...(endpoint.summary === undefined ? [] : ["summary"]),
        ...(endpoint.description === undefined ? [] : ["description"]),
        "wire",
      ],
    },
    ...(endpoint.summary === undefined ? [] : [{ nodeId: "summary", element: "p", text: endpoint.summary } satisfies ActionHtmlNode]),
    ...(endpoint.description === undefined ? [] : [{ nodeId: "description", element: "p", children: ["description-small"] } satisfies ActionHtmlNode]),
    ...(endpoint.description === undefined ? [] : [{ nodeId: "description-small", element: "small", text: endpoint.description } satisfies ActionHtmlNode]),
    { nodeId: "wire", element: "p", children: ["wire-small"] },
    { nodeId: "wire-small", element: "small", children: ["input-label", "input-code", "wire-separator", "output-label", "output-code"] },
    { nodeId: "input-label", element: "span", text: "input: " },
    { nodeId: "input-code", element: "code", text: endpoint.input },
    { nodeId: "wire-separator", element: "span", text: " / " },
    { nodeId: "output-label", element: "span", text: "output: " },
    { nodeId: "output-code", element: "code", text: endpoint.output },
    { nodeId: "form", element: "form", attributes: { method: "post", action: actionPath, enctype: "text/plain" }, children: ["body-label", "body-textarea", "actions"] },
    { nodeId: "body-label", element: "label", text: "Input carrier", attributes: { for: "body" } },
    { nodeId: "body-textarea", element: "textarea", attributes: { id: "body", name: "body", rows: "10", placeholder: "the input carrier on stdin" } },
    { nodeId: "actions", element: "p", children: ["run-button"] },
    { nodeId: "run-button", element: "button", text: "Run", attributes: { type: "submit" } },
  ];
  const declarations = actionChrome({ main: "main", header: "header", title: "title", nav: "nav" });
  let order = declarations.length;
  declarations.push(
    actionDecl("meta", "margin-bottom", "22px", order++),
    actionDecl("form", "display", "grid", order++),
    actionDecl("form", "gap", "12px", order++),
    actionDecl("body-label", "font-weight", "640", order++),
    actionDecl("body-textarea", "box-sizing", "border-box", order++),
    actionDecl("body-textarea", "width", "100%", order++),
    actionDecl("body-textarea", "min-height", "220px", order++),
    actionDecl("body-textarea", "padding", "12px", order++),
    actionDecl("body-textarea", "border", "1px solid #b8c4bd", order++),
    actionDecl("body-textarea", "font", "0.95rem ui-monospace, SFMono-Regular, Consolas, monospace", order++),
    actionDecl("run-button", "width", "fit-content", order++),
    actionDecl("run-button", "padding", "9px 16px", order++),
    actionDecl("run-button", "border", "1px solid #235244", order++),
    actionDecl("run-button", "background", "#235244", order++),
    actionDecl("run-button", "color", "white", order++),
    actionDecl("run-button", "font-weight", "650", order++),
  );
  return actionHtmlFiber(endpoint.name, "action:" + endpoint.name, "renders-action-form", nodes, declarations, ["main"]);
}

/** Project an action discovery carrier into the canonical render fiber codomain. */
export function actionIndexHtml(discovery: ActionDiscovery, base: string): string {
  const endpointNodes = discovery.bins.flatMap((endpoint, index): ActionHtmlNode[] => {
    const item = "endpoint-" + index;
    const link = item + "-link";
    const code = item + "-code";
    const summary = item + "-summary";
    return [
      { nodeId: item, element: "li", children: endpoint.summary === undefined ? [link] : [link, summary] },
      { nodeId: link, element: "a", attributes: { href: base + "/" + endpoint.name }, children: [code] },
      { nodeId: code, element: "code", text: endpoint.name },
      ...(endpoint.summary === undefined ? [] : [{ nodeId: summary, element: "span", text: " - " + endpoint.summary }]),
    ];
  });
  const nodes: ActionHtmlNode[] = [
    { nodeId: "main", element: "main", children: ["header", "operations"] },
    { nodeId: "header", element: "header", children: ["title", "nav"] },
    { nodeId: "title", element: "h1", text: discovery.package },
    { nodeId: "nav", element: "nav", children: ["openapi", "mcp", "health"] },
    { nodeId: "openapi", element: "a", text: "OpenAPI", attributes: { href: base + "/openapi.json" } },
    { nodeId: "mcp", element: "code", text: "POST " + base + "/mcp" },
    { nodeId: "health", element: "code", text: "GET " + base + "/health" },
    { nodeId: "operations", element: "section", children: ["operations-title", "operation-list"] },
    { nodeId: "operations-title", element: "h2", text: "Operations" },
    { nodeId: "operation-list", element: "ol", children: endpointNodes.filter((node) => node.element === "li").map((node) => node.nodeId) },
    ...endpointNodes,
  ];
  const declarations = actionChrome({ main: "main", header: "header", title: "title", nav: "nav" });
  let order = declarations.length;
  declarations.push(
    actionDecl("operations-title", "font-size", "1rem", order++),
    actionDecl("operations-title", "letter-spacing", "0", order++),
    actionDecl("operation-list", "display", "grid", order++),
    actionDecl("operation-list", "gap", "10px", order++),
    actionDecl("operation-list", "padding-left", "1.4rem", order++),
    ...endpointNodes.filter((node) => node.element === "li").map((node) => actionDecl(node.nodeId, "padding", "8px 0", order++)),
  );
  return actionHtmlFiber(discovery.package, "package:" + discovery.package, "renders-action-discovery", nodes, declarations, ["main"]);
}

/**
 * Route one pure request against an induced action apex.
 *
 * The router provides the HTTP, OpenAPI, MCP, and HTML-form faces without owning
 * a socket. `GET /` reads the discovery carrier as HTML, `GET /openapi.json`
 * reads OpenAPI, `POST /mcp` reads the MCP JSON-RPC face, and verb routes invoke
 * the induced dispatcher. Query fields can act as form-encoded carrier input;
 * `Accept` negotiation may settle the output representation downward but cannot
 * fabricate a richer content corner.
 */

/** The Scott transport route: `GET /feed` streams the witness log as resumable SSE,
 *  resuming after `Last-Event-ID`. The log is read through `options.witnessLog`, so
 *  pure routing stays I/O-free; the live bindings inject today's invocation log. */
function feedRoute(request: ServedRequest, options: ServeOptions): ServedResponse {
  return {
    status: 200,
    type: "text/event-stream; charset=utf-8",
    headers: { "cache-control": "no-cache", connection: "keep-alive" },
    body: streamWitnessLog(options.witnessLog?.() ?? [], request.lastEventId),
  };
}

function parseOutput(stdout: string): unknown {
  try {
    return JSON.parse(stdout);
  } catch {
    return stdout;
  }
}

function continuationHandle(endpoint: ActionEndpoint, base: string): Record<string, unknown> {
  const endpointHref = endpoint.href.startsWith("/") ? endpoint.href : `/${endpoint.href}`;
  const href = base !== "" && endpointHref.startsWith(`${base}/`) ? endpointHref : `${base}${endpointHref}`;
  if (endpoint.settlement.transport === "event-stream") {
    return { kind: "sse", href, cursor: null, lastEventId: null };
  }
  if (endpoint.settlement.transport === "websocket-session") {
    return { kind: "websocket", href, subscriptionUrl: href };
  }
  return { kind: "none" };
}

function partialObservation(endpoint: ActionEndpoint, stdout: string, base: string): Record<string, unknown> {
  return {
    kind: "relating.action.partial-settlement",
    final: false,
    regime: endpoint.settlement.regime,
    closureRegime: endpoint.settlement.closureRegime,
    transport: endpoint.settlement.transport,
    partial: parseOutput(stdout),
    continuation: continuationHandle(endpoint, base),
  };
}

function isSettlementFiltration(value: unknown): value is SettlementFiltration {
  return typeof value === "object"
    && value !== null
    && (value as { readonly kind?: unknown }).kind === "predication.settlement.filtration"
    && Array.isArray((value as { readonly stages?: unknown }).stages);
}

function isSettlementFiltrationGenerators(value: unknown): value is SettlementFiltrationGenerators {
  return typeof value === "object"
    && value !== null
    && (value as { readonly kind?: unknown }).kind === "predication.settlement.filtration"
    && Array.isArray((value as { readonly cells?: unknown }).cells)
    && Array.isArray((value as { readonly specializations?: unknown }).specializations);
}

function approximationChain(stdout: string): readonly unknown[] {
  const value = parseOutput(stdout);
  if (isSettlementFiltration(value)) return value.stages;
  if (isSettlementFiltrationGenerators(value)) return freeSettlementFiltration(value).stages;
  return [value];
}

function eventIndexAfter(lastEventId: string | undefined): number {
  if (lastEventId === undefined || lastEventId.trim() === "") return 0;
  const parsed = Number(lastEventId);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed + 1 : 0;
}

function actionEventStreamResponse(endpoint: ActionEndpoint, result: DispatchResult, request: ServedRequest): ServedResponse {
  const chain = approximationChain(result.stdout);
  const from = eventIndexAfter(request.lastEventId);
  const frames = chain.slice(from).map((partial, offset) =>
    sseFrame("approximation", {
      kind: "relating.action.approximation",
      regime: endpoint.settlement.regime,
      final: false,
      partial,
    }, String(from + offset))).join("");
  return {
    status: 200,
    type: "text/event-stream; charset=utf-8",
    headers: { "cache-control": "no-cache", connection: "keep-alive" },
    body: frames,
  };
}

function wantsEventStream(request: ServedRequest): boolean {
  const transport = request.query["transport"];
  return transport === "sse"
    || transport === "event-stream"
    || (request.accept ?? "").split(",").some((part) => part.trim().toLowerCase().startsWith("text/event-stream"));
}

/** Build the witness-log reader for a live binding from its data root (today's
 *  invocation feed). Absent data root ⇒ no reader (the feed is empty). */
function witnessLogOf(options: ServeOptions): (() => readonly EAVTRecord[]) | undefined {
  const dataRoot = options.dataRoot;
  if (dataRoot === undefined) return undefined;
  return () => {
    try {
      const { store, feed } = invocationStore(dataRoot, options.namespace ?? "relating", new Date().toISOString());
      return readWitnessLog(store, feed);
    } catch {
      return [];
    }
  };
}

/** The `Last-Event-ID` header for SSE resumption, if present. */
function lastEventIdOf(req: IncomingMessage): string | undefined {
  const id = req.headers["last-event-id"];
  return typeof id === "string" ? id : undefined;
}

export function routeRequest(induced: InducedBins, request: ServedRequest, options: ServeOptions = {}): ServedResponse {
  const base = (options.basePath ?? "").replace(/\/+$/, "");
  const path = request.path.startsWith(base) ? request.path.slice(base.length) : request.path;
  const verbOf = (p: string): string => decodeURIComponent(p.replace(/^\//, ""));

  if (request.method === "GET" && (path === "" || path === "/")) return html(actionIndexHtml(induced.discovery, base));
  if (request.method === "GET" && path === "/health") return json({ status: "ok", package: induced.discovery.package });
  if (request.method === "GET" && path === "/openapi.json") return json(actionOpenApi(induced, options));
  if (request.method === "GET" && path === "/discovery") return json(induced.discovery);
  if (request.method === "GET" && path === "/feed") return feedRoute(request, options);

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
  const carrierFields = Object.entries(request.query).filter(([key]) => key !== "input-format" && key !== "output-format" && key !== "transport");

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
    // Corner-aware negotiation: an explicit `output-format` wins by name; else the
    // `Accept` header selects a wire, but never one richer than the value's corner.
    const negotiated = negotiateOutputWire(endpoint, outName, request.accept);
    const argv = [verb, ...(inName ? ["--input-format", inName] : []), ...(negotiated.name ? ["--output-format", negotiated.name] : [])];
    const result = induced.dispatch(argv, stdin, options);
    if (result.code !== 0) return text(result.stderr, result.code === 2 ? 400 : 422);
    if (endpoint.settlement.regime !== "strict-finite") {
      if (endpoint.settlement.transport === "event-stream" && wantsEventStream(request)) {
        return actionEventStreamResponse(endpoint, result, request);
      }
      return json(partialObservation(endpoint, result.stdout, base));
    }
    return { status: 200, type: negotiated.mediaType, body: result.stdout };
  }

  return text("method not allowed\n", 405);
}

/**
 * Async variant of `routeRequest`.
 *
 * Use this when any action body may return a promise. Routing, negotiation,
 * error statuses, and discovery faces are otherwise identical.
 */
export async function routeRequestAsync(induced: InducedBins, request: ServedRequest, options: ServeOptions = {}): Promise<ServedResponse> {
  const base = (options.basePath ?? "").replace(/\/+$/, "");
  const path = request.path.startsWith(base) ? request.path.slice(base.length) : request.path;
  const verbOf = (p: string): string => decodeURIComponent(p.replace(/^\//, ""));

  if (request.method === "GET" && (path === "" || path === "/")) return html(actionIndexHtml(induced.discovery, base));
  if (request.method === "GET" && path === "/health") return json({ status: "ok", package: induced.discovery.package });
  if (request.method === "GET" && path === "/openapi.json") return json(actionOpenApi(induced, options));
  if (request.method === "GET" && path === "/discovery") return json(induced.discovery);
  if (request.method === "GET" && path === "/feed") return feedRoute(request, options);

  if (request.method === "POST" && path === "/mcp") {
    let message: unknown;
    try {
      message = JSON.parse(request.body);
    } catch {
      return json(mcpError(null, -32700, "parse error"), 200);
    }
    const response = await actionMcpHandleAsync(induced, message, options);
    return response === undefined ? { status: 202, type: "application/json; charset=utf-8", body: "" } : json(response);
  }

  const verb = verbOf(path);
  const endpoint = induced.discovery.bins.find((bin) => bin.name === verb);
  if (endpoint === undefined) return text(`no such operation: ${verb}\n`, 404);

  const outName = request.query["output-format"];
  const carrierFields = Object.entries(request.query).filter(([key]) => key !== "input-format" && key !== "output-format" && key !== "transport");
  if (request.method === "GET" && carrierFields.length === 0) return html(actionFormHtml(endpoint, base));

  if (request.method === "GET" || request.method === "POST") {
    let stdin: string;
    let inName: string | undefined;
    if (carrierFields.length > 0) {
      stdin = new URLSearchParams(carrierFields).toString();
      inName = request.query["input-format"] ?? "form";
    } else {
      stdin = request.body.startsWith("body=") ? decodeURIComponent(request.body.slice(5).replace(/\+/g, " ")) : request.body;
      inName = request.query["input-format"];
    }
    const negotiated = negotiateOutputWire(endpoint, outName, request.accept);
    const argv = [verb, ...(inName ? ["--input-format", inName] : []), ...(negotiated.name ? ["--output-format", negotiated.name] : [])];
    const result = await induced.dispatchAsync(argv, stdin, options);
    if (result.code !== 0) return text(result.stderr, result.code === 2 ? 400 : 422);
    if (endpoint.settlement.regime !== "strict-finite") {
      if (endpoint.settlement.transport === "event-stream" && wantsEventStream(request)) {
        return actionEventStreamResponse(endpoint, result, request);
      }
      return json(partialObservation(endpoint, result.stdout, base));
    }
    return { status: 200, type: negotiated.mediaType, body: result.stdout };
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

/**
 * One induced package mounted into a tiled manifold.
 *
 * The mount name supplies the URL segment; the induced apex supplies every face
 * below that segment. Tiling derives placement from carrier refs rather than a
 * hand-written route tree.
 */
export interface ManifoldMount {
  /** Stable mount segment used when deriving base paths. */
  readonly name: string;
  /** The package apex to serve at the mount. */
  readonly induced: InducedBins;
}

/**
 * Read the carrier `$id` from a domain/codomain schema slot.
 *
 * Only direct `$ref` slots participate in action composition and manifold
 * tiling. Richer schema structure remains schema data; it is not treated as a
 * mount edge.
 */
export function slotRef(schema: Record<string, unknown> | undefined): string | undefined {
  const ref = schema?.["$ref"];
  return typeof ref === "string" ? ref : undefined;
}

/**
 * Carrier `$id`s emitted by a mounted package's actions.
 *
 * These are codomain refs, the local outputs a downstream module may consume.
 */
export function producedIds(induced: InducedBins): ReadonlySet<string> {
  const ids = new Set<string>();
  for (const act of induced.actions) { const r = slotRef(act.codomainSchema); if (r !== undefined) ids.add(r); }
  return ids;
}

/**
 * Carrier `$id`s admitted by a mounted package's actions.
 *
 * These are domain refs, the local inputs an upstream module may produce.
 */
export function consumedIds(induced: InducedBins): ReadonlySet<string> {
  const ids = new Set<string>();
  for (const act of induced.actions) { const r = slotRef(act.domainSchema); if (r !== undefined) ids.add(r); }
  return ids;
}

/**
 * Test whether package `a` can feed package `b` by carrier identity.
 *
 * This is the manifold-level version of action composition: an edge exists when
 * a produced carrier `$id` equals a consumed carrier `$id`.
 */
export function feeds(a: InducedBins, b: InducedBins): boolean {
  const produced = producedIds(a);
  for (const id of consumedIds(b)) if (produced.has(id)) return true;
  return false;
}

/**
 * Derive the tiled base path of each mount, keyed by mount name.
 *
 * A module mounts under a producer of its domain carrier
 * (`/<producer>/<module>`); a source with no internal producer mounts at the
 * root (`/<module>`). The path spells the composition. Resolution is
 * order-independent and cycle-safe: an unplaceable module (its producer cycles,
 * or is not placed) falls back to a root mount.
 */
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

/** Project a tiled manifold carrier into the canonical render fiber codomain. */
function manifoldIndexHtml(mounts: readonly ManifoldMount[], paths: ReadonlyMap<string, string>): string {
  const mountNodes = mounts.flatMap((m, index): ActionHtmlNode[] => {
    const base = paths.get(m.name) ?? "/" + m.name;
    const item = "mount-" + index;
    const link = item + "-link";
    const code = item + "-code";
    const summary = item + "-summary";
    return [
      { nodeId: item, element: "li", children: [link, summary] },
      { nodeId: link, element: "a", attributes: { href: base }, children: [code] },
      { nodeId: code, element: "code", text: base },
      { nodeId: summary, element: "span", text: " - " + m.induced.discovery.package + " (" + m.induced.actions.length + " ops)" },
    ];
  });
  const nodes: ActionHtmlNode[] = [
    { nodeId: "main", element: "main", children: ["header", "mounts"] },
    { nodeId: "header", element: "header", children: ["title", "nav"] },
    { nodeId: "title", element: "h1", text: "manifold" },
    { nodeId: "nav", element: "nav", text: "A tiled bundle of modules; each mounts at the tail of whatever produces its domain carrier." },
    { nodeId: "mounts", element: "section", children: ["mounts-title", "mount-list"] },
    { nodeId: "mounts-title", element: "h2", text: "Mounts" },
    { nodeId: "mount-list", element: "ol", children: mountNodes.filter((node) => node.element === "li").map((node) => node.nodeId) },
    ...mountNodes,
  ];
  const declarations = actionChrome({ main: "main", header: "header", title: "title", nav: "nav" });
  let order = declarations.length;
  declarations.push(
    actionDecl("mounts-title", "font-size", "1rem", order++),
    actionDecl("mounts-title", "letter-spacing", "0", order++),
    actionDecl("mount-list", "display", "grid", order++),
    actionDecl("mount-list", "gap", "10px", order++),
    actionDecl("mount-list", "padding-left", "1.4rem", order++),
    ...mountNodes.filter((node) => node.element === "li").map((node) => actionDecl(node.nodeId, "padding", "8px 0", order++)),
  );
  return actionHtmlFiber("manifold", "manifold", "renders-manifold-index", nodes, declarations, ["main"]);
}

/**
 * Route one pure request against a manifold of tiled mounts.
 *
 * The router selects the longest tiled base path that prefixes the URL and then
 * delegates to that mount's `routeRequest`. This keeps each mounted apex's
 * dispatch and witness namespace intact while exposing many packages on one
 * origin.
 */
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

/**
 * Async variant of `routeManifold`.
 *
 * Use this for a tiled app whose mounted actions may return promises. Placement
 * and longest-prefix routing match the synchronous manifold router.
 */
export async function routeManifoldAsync(mounts: readonly ManifoldMount[], request: ServedRequest, options: ServeOptions = {}): Promise<ServedResponse> {
  const root = (options.basePath ?? "").replace(/\/+$/, "");
  const path = request.path.startsWith(root) ? request.path.slice(root.length) : request.path;
  const paths = tileManifold(mounts);

  if (request.method === "GET" && (path === "" || path === "/")) return html(manifoldIndexHtml(mounts, paths));

  const ranked = [...mounts]
    .map((m) => ({ mount: m, base: paths.get(m.name) ?? `/${m.name}` }))
    .sort((x, y) => y.base.length - x.base.length);
  for (const { mount, base } of ranked) {
    if (path === base || path.startsWith(`${base}/`)) {
      return routeRequestAsync(mount.induced, request, { ...options, basePath: `${root}${base}` });
    }
  }
  return text(`no such module for path: ${path}\n`, 404);
}

/**
 * Bind a manifold of mounts to `node:http`: one origin, many tiled modules.
 *
 * This is only the live socket binding. The route decision still lives in
 * `routeManifold`, so tests and downstream tools can use the pure projection
 * without starting a server.
 */
export function serveManifold(mounts: readonly ManifoldMount[], options: ServeOptions = {}): Server {
  const witnessLog = witnessLogOf(options);
  const readBody = (req: IncomingMessage): Promise<string> => new Promise((resolve) => {
    let body = "";
    req.setEncoding("utf8");
    req.on("data", (chunk: string) => { body += chunk; });
    req.on("end", () => resolve(body));
  });
  const server = createServer((req, res) => {
    void (async () => {
      const url = new URL(req.url ?? "/", "http://localhost");
      const query: Record<string, string> = {};
      for (const [key, value] of url.searchParams) query[key] = value;
      const accept = req.headers["accept"];
      const body = req.method === "POST" ? await readBody(req) : "";
      const request = { method: req.method ?? "GET", path: url.pathname, query, body, accept, lastEventId: lastEventIdOf(req) };
      const response = routeManifold(mounts, request, { ...options, witnessLog });
      res.writeHead(response.status, { "content-type": response.type, ...(response.headers ?? {}) });
      res.end(response.body);
    })();
  });
  attachClaimSession(server);
  return server;
}

/**
 * Bind an async-capable tiled manifold to `node:http`.
 *
 * The binding reads UTF-8 request bodies, forwards the optional `Accept` header,
 * and delegates to `routeManifoldAsync`.
 */
export function serveManifoldAsync(mounts: readonly ManifoldMount[], options: ServeOptions = {}): Server {
  const witnessLog = witnessLogOf(options);
  const readBody = (req: IncomingMessage): Promise<string> => new Promise((resolve) => {
    let body = "";
    req.setEncoding("utf8");
    req.on("data", (chunk: string) => { body += chunk; });
    req.on("end", () => resolve(body));
  });
  const server = createServer((req, res) => {
    void (async () => {
      const url = new URL(req.url ?? "/", "http://localhost");
      const query: Record<string, string> = {};
      for (const [key, value] of url.searchParams) query[key] = value;
      const accept = req.headers["accept"];
      const body = req.method === "POST" ? await readBody(req) : "";
      const request = { method: req.method ?? "GET", path: url.pathname, query, body, accept, lastEventId: lastEventIdOf(req) };
      const response = await routeManifoldAsync(mounts, request, { ...options, witnessLog });
      res.writeHead(response.status, { "content-type": response.type, ...(response.headers ?? {}) });
      res.end(response.body);
    })();
  });
  attachClaimSession(server);
  return server;
}

/**
 * Bind one action family to `node:http`.
 *
 * This is the single-package server binding for an induced apex. Passing
 * `options.induced` reuses a precomputed apex; otherwise the action list is
 * induced lazily at request time.
 */
export function serve(actions: readonly Action[], options: ServeOptions & { readonly induced?: InducedBins } = {}): Server {
  // induced may be passed in; otherwise the caller should pass actions + we induce lazily at first request.
  const inducedRef = options.induced;
  const witnessLog = witnessLogOf(options);
  const readBody = (req: IncomingMessage): Promise<string> => new Promise((resolve) => {
    let body = "";
    req.setEncoding("utf8");
    req.on("data", (chunk: string) => { body += chunk; });
    req.on("end", () => resolve(body));
  });
  const server = createServer((req, res) => {
    void (async () => {
      const url = new URL(req.url ?? "/", "http://localhost");
      const query: Record<string, string> = {};
      for (const [key, value] of url.searchParams) query[key] = value;
      const accept = req.headers["accept"];
      const body = req.method === "POST" ? await readBody(req) : "";
      const induced = inducedRef ?? (await import("./induce.mjs")).induceBins(actions);
      const request = { method: req.method ?? "GET", path: url.pathname, query, body, accept, lastEventId: lastEventIdOf(req) };
      const response = routeRequest(induced, request, { ...options, witnessLog });
      res.writeHead(response.status, { "content-type": response.type, ...(response.headers ?? {}) });
      res.end(response.body);
    })();
  });
  attachClaimSession(server);
  return server;
}

/**
 * Bind one async-capable action family to `node:http`.
 *
 * Use this when any action body may return a promise. The socket binding is the
 * same shape as `serve`; routed execution delegates to `routeRequestAsync`.
 */
export function serveAsync(actions: readonly Action[], options: ServeOptions & { readonly induced?: InducedBins } = {}): Server {
  const inducedRef = options.induced;
  const witnessLog = witnessLogOf(options);
  const readBody = (req: IncomingMessage): Promise<string> => new Promise((resolve) => {
    let body = "";
    req.setEncoding("utf8");
    req.on("data", (chunk: string) => { body += chunk; });
    req.on("end", () => resolve(body));
  });
  const server = createServer((req, res) => {
    void (async () => {
      const url = new URL(req.url ?? "/", "http://localhost");
      const query: Record<string, string> = {};
      for (const [key, value] of url.searchParams) query[key] = value;
      const accept = req.headers["accept"];
      const body = req.method === "POST" ? await readBody(req) : "";
      const induced = inducedRef ?? (await import("./induce.mjs")).induceBins(actions);
      const request = { method: req.method ?? "GET", path: url.pathname, query, body, accept, lastEventId: lastEventIdOf(req) };
      const response = await routeRequestAsync(induced, request, { ...options, witnessLog });
      res.writeHead(response.status, { "content-type": response.type, ...(response.headers ?? {}) });
      res.end(response.body);
    })();
  });
  attachClaimSession(server);
  return server;
}
