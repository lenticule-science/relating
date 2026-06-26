import assert from "node:assert/strict";

import {
  actionIrAudit,
  actions,
  freeTsActions,
  induceBins,
} from "@emsenn/relating";
import {
  actionIndexHtml,
  actionMcpHandle,
  actionOpenApi,
  wireCodec,
  WIRE_CODEC_NAMES,
} from "@emsenn/relating/running";

const induced = induceBins(actions, { packageName: "@emsenn/relating" });
const dispatchResult = induced.dispatch(["conflate-charge"], "\"stable\"");
const openapi = actionOpenApi(induced);
const tools = actionMcpHandle(induced, { jsonrpc: "2.0", id: 1, method: "tools/list" }, {});
const html = actionIndexHtml(induced.discovery, "");
const audit = actionIrAudit(actions);
const morphisms = audit.filter((entry) => entry.relation === "morphism");
const boundaries = audit.filter((entry) => entry.relation === "boundary");
const conflateTool = tools.result.tools.find((tool) => tool.name === "conflate-charge");

assert.equal(Object.keys(openapi.paths).length, actions.length);
assert.equal(tools.result.tools.length, actions.length);
assert.ok(html.includes("conflate-charge"));
assert.equal(conflateTool?.outputSchema?.$ref, "relating/articulating/predicating/positing/charge-value-name");

console.log(JSON.stringify({
  product: "relating.action-apex",
  actionCount: actions.length,
  faces: {
    discoveryBins: induced.discovery.bins.length,
    openapiPaths: Object.keys(openapi.paths).length,
    mcpTools: tools.result.tools.length,
    htmlMentionsConflateCharge: html.includes("conflate-charge"),
  },
  firstVerbs: induced.discovery.bins.slice(0, 8).map((bin) => bin.name),
  morphismAudit: {
    morphisms: morphisms.length,
    boundaries: boundaries.length,
    freeCarrierMorphisms: freeTsActions(actions).length,
  },
  wireVocabulary: WIRE_CODEC_NAMES.map((name) => {
    const codec = wireCodec(name);
    return {
      name,
      mediaType: codec.mediaType.split(";")[0],
      corner: codec.corner,
      rung: codec.rung,
    };
  }),
  boundaryExamples: audit
    .filter((entry) => entry.relation === "boundary")
    .slice(0, 4)
    .map((entry) => ({ verb: entry.verb, reason: entry.reason, hasRunTerm: entry.hasRunTerm })),
  dispatch: {
    verb: "conflate-charge",
    input: "stable",
    output: JSON.parse(dispatchResult.stdout),
  },
}, null, 2));
