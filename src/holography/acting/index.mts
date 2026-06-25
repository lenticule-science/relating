/**
 * @packageDocumentation
 *
 * acting — the boundary: actions (cocone legs), the dispatcher, induceBins, and
 * invocation witnessing.
 *
 * Register each operation once as an `action`; `induceBins` assembles the
 * coproduct apex (the discovery carrier) from which CLI/OpenAPI/MCP/web are
 * projected; one `dispatch` (node:util.parseArgs) runs any verb and witnesses the
 * play as EAVT in the package's own ledger.
 *
 * Formally, this module is the operational facade over a holographic object: a
 * finite action family has one apex, and CLI, HTTP, OpenAPI, MCP, form HTML,
 * carrier-node routes, and witness logs are faithful projections of that apex.
 *
 * The source lives under `src/holography/acting` to record that formal reading.
 * The public package handle remains `@emsenn/relating/acting`, because users run
 * action boundaries; they do not need two import names for the same apex.
 */
export {
  action,
  composes,
  compose,
  isAction,
  fact,
  actionUtterances,
  type Action,
  type ActionSpec,
} from "./action.mjs";

export {
  stringCodec,
  jsonCodec,
  eavtCodec,
  formCodec,
  wireCodec,
  WIRE_CODEC_NAMES,
  type WireCodec,
} from "./codecs.mjs";

export {
  dispatch,
  dispatchAsync,
  actionsByVerb,
  type DispatchOptions,
  type DispatchResult,
} from "./dispatch.mjs";

export {
  resource,
  isResource,
  resourceDescriptor,
  resourceUtterances,
  literalResource,
  type ResourceCarrier,
  type ResourceSpec,
  type ResourceDescriptor,
} from "./resource.mjs";

export {
  prompt,
  isPrompt,
  promptDescriptor,
  promptUtterances,
  actionPrompt,
  userMessage,
  type PromptCarrier,
  type PromptSpec,
  type PromptDescriptor,
  type PromptArgument,
  type PromptMessage,
} from "./prompt.mjs";

export {
  induceBins,
  collectActions,
  collectResources,
  collectPrompts,
  type InducedBins,
  type InduceOptions,
  type ActionEndpoint,
  type ActionDiscovery,
} from "./induce.mjs";

export {
  witnessInvocation,
  invocationStore,
  invocationFeed,
  projectInvocations,
  type Invocation,
} from "./invocation.mjs";

export {
  serve,
  serveAsync,
  routeRequest,
  routeRequestAsync,
  serveManifold,
  serveManifoldAsync,
  routeManifold,
  routeManifoldAsync,
  tileManifold,
  actionOpenApi,
  actionMcpTools,
  actionMcpResources,
  actionMcpPrompts,
  actionMcpHandle,
  actionMcpHandleAsync,
  actionFormHtml,
  actionIndexHtml,
  type ServeOptions,
  type ServedRequest,
  type ServedResponse,
  type ManifoldMount,
} from "./serving.mjs";

export {
  carrierNodeTree,
  tileCarrierNodes,
  routeCarrierManifold,
  routeCarrierManifoldAsync,
  serveCarrierManifold,
  serveCarrierManifoldAsync,
  domainNodeOf,
  isEndoMount,
  aggregateNodeApex,
  carrierManifoldIndexHtml,
  type CarrierMount,
  type CarrierNode,
} from "./mounting.mjs";
