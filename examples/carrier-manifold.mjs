import {
  action,
  induceBins,
} from "@emsenn/relating";
import {
  carrierNodeTree,
  routeCarrierManifold,
  tileCarrierNodes,
} from "@emsenn/relating/acting";

const carrierId = "example/carrier-manifold/widget";

const makeWidget = action({
  verb: "make-widget",
  inputFormat: "string",
  outputFormat: "json",
  codomainSchema: { $ref: carrierId },
  summary: "Admit a widget from boundary text.",
  run: (value) => ({ id: String(value).trim() }),
});

const useWidget = action({
  verb: "use-widget",
  inputFormat: "json",
  outputFormat: "json",
  domainSchema: { $ref: carrierId },
  codomainSchema: { $ref: carrierId },
  summary: "Endomorphically rewrite a widget at its carrier node.",
  run: (widget) => ({ id: `${widget.id}:used` }),
});

const mounts = [
  { name: "maker", induced: induceBins([makeWidget], { packageName: "maker" }) },
  { name: "user", induced: induceBins([useWidget], { packageName: "user" }) },
];

const paths = Object.fromEntries(tileCarrierNodes(mounts));
const node = carrierNodeTree(mounts).find((candidate) => candidate.id === carrierId);
const index = routeCarrierManifold(mounts, { method: "GET", path: `/${carrierId}`, query: {}, body: "" });
const openapi = routeCarrierManifold(mounts, { method: "GET", path: `/${carrierId}/openapi.json`, query: {}, body: "" });
const mcp = routeCarrierManifold(mounts, {
  method: "POST",
  path: `/${carrierId}/mcp`,
  query: {},
  body: '{"jsonrpc":"2.0","id":1,"method":"tools/list"}',
});
const post = routeCarrierManifold(mounts, {
  method: "POST",
  path: `/${carrierId}/use-widget`,
  query: {},
  body: '{"id":"seed"}',
});

const openapiBody = JSON.parse(openapi.body);
const mcpBody = JSON.parse(mcp.body);

console.log(JSON.stringify({
  product: "relating.carrier-manifold",
  carrier: carrierId,
  paths,
  node: {
    path: node?.path,
    mountNames: node?.mounts.map((mount) => mount.name),
    endo: node?.endo,
  },
  faces: {
    indexStatus: index.status,
    openapiPaths: Object.keys(openapiBody.paths),
    mcpTools: mcpBody.result.tools.map((tool) => tool.name),
    dispatch: {
      status: post.status,
      body: JSON.parse(post.body),
    },
  },
}, null, 2));
