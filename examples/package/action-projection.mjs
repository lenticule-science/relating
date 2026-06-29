import { actions } from "@emsenn/relating/actions";
import { actionMcpHandle, induceBins, operationsManifoldUri } from "@emsenn/relating/running";
import { actionOpenApi } from "@emsenn/relating/projections";

const induced = induceBins(actions, { packageName: "@emsenn/relating" });
const openapi = actionOpenApi(induced);
const manifoldUri = operationsManifoldUri("@emsenn/relating");
const tools = actionMcpHandle(induced, { jsonrpc: "2.0", id: 1, method: "tools/list" }, {});
const resources = actionMcpHandle(induced, { jsonrpc: "2.0", id: 2, method: "resources/read", params: { uri: manifoldUri } }, {});

console.log(JSON.stringify({
  openapi: {
    version: openapi.openapi,
    pathCount: Object.keys(openapi.paths).length,
  },
  mcp: {
    toolCount: tools.result.tools.length,
    operationsManifold: JSON.parse(resources.result.contents[0].text).kind,
  },
}, null, 2));
