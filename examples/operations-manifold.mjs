import assert from "node:assert/strict";

import { Type } from "@sinclair/typebox";
import { action, carrier, induceBins } from "@emsenn/relating";
import {
  actionMcpHandle,
  operationsManifoldGraphOf,
  operationsManifoldOf,
  operationsManifoldUri,
} from "@emsenn/relating/running";

const rawCarrier = carrier("example/operations-manifold/raw", {
  kind: Type.Literal("example.operationsManifold.raw"),
  id: Type.String(),
  title: Type.String(),
});

const sharedCarrier = carrier("example/operations-manifold/shared", {
  kind: Type.Literal("example.operationsManifold.shared"),
  id: Type.String(),
  title: Type.String(),
});

const reportCarrier = carrier("example/operations-manifold/report", {
  kind: Type.Literal("example.operationsManifold.report"),
  id: Type.String(),
  summary: Type.String(),
});

const normalize = action({
  verb: "normalize-operation",
  domain: rawCarrier,
  codomain: sharedCarrier,
  summary: "Project a raw operation into the shared carrier.",
  run: (input) => ({
    kind: "example.operationsManifold.shared",
    id: input.id,
    title: input.title,
  }),
});

const report = action({
  verb: "report-operation",
  domain: sharedCarrier,
  codomain: reportCarrier,
  summary: "Read a shared operation as a report carrier.",
  run: (input) => ({
    kind: "example.operationsManifold.report",
    id: input.id,
    summary: input.title,
  }),
});

const source = induceBins([normalize], { packageName: "example/operations-manifold/source" });
const sink = induceBins([report], { packageName: "example/operations-manifold/sink" });
const sourceManifold = operationsManifoldOf(source.discovery);
const sinkManifold = operationsManifoldOf(sink.discovery);
const graph = operationsManifoldGraphOf([sourceManifold, sinkManifold]);

const sourceUri = operationsManifoldUri("example/operations-manifold/source");
const resourceList = actionMcpHandle(source, { jsonrpc: "2.0", id: 1, method: "resources/list" }, {});
const resourceRead = actionMcpHandle(source, {
  jsonrpc: "2.0",
  id: 2,
  method: "resources/read",
  params: { uri: sourceUri },
}, {});
const resourceBody = JSON.parse(resourceRead.result.contents[0].text);

assert.ok(resourceList.result.resources.some((resource) => resource.uri === sourceUri));
assert.equal(sourceManifold.extrema.outgoing[0].carrier, "example/operations-manifold/shared");
assert.equal(sinkManifold.extrema.incoming[0].carrier, "example/operations-manifold/shared");
assert.equal(graph.edges.length, 1);
assert.deepEqual(graph.edges[0], {
  fromPackage: "example/operations-manifold/source",
  from: "normalize-operation",
  toPackage: "example/operations-manifold/sink",
  to: "report-operation",
  carrier: "example/operations-manifold/shared",
  relation: "codomain-domain",
});
assert.equal(resourceBody.kind, "relating.operations-manifold");
assert.equal(resourceBody.extrema.outgoing[0].carrier, "example/operations-manifold/shared");

console.log(JSON.stringify({
  product: "relating.operations-manifold",
  source: {
    package: sourceManifold.package,
    bins: sourceManifold.apex.bins,
    incoming: sourceManifold.extrema.incoming.map((extremum) => extremum.carrier),
    outgoing: sourceManifold.extrema.outgoing.map((extremum) => extremum.carrier),
    resources: sourceManifold.apex.resources.length,
    utterances: sourceManifold.utterances.length,
  },
  sink: {
    package: sinkManifold.package,
    bins: sinkManifold.apex.bins,
    incoming: sinkManifold.extrema.incoming.map((extremum) => extremum.carrier),
    outgoing: sinkManifold.extrema.outgoing.map((extremum) => extremum.carrier),
  },
  graph: {
    packages: graph.packages.length,
    edges: graph.edges,
    incomingFrontier: graph.frontier.incoming.map((frontier) => frontier.carrier),
    outgoingFrontier: graph.frontier.outgoing.map((frontier) => frontier.carrier),
    utterances: graph.utterances.length,
  },
  mcpResource: {
    uri: sourceUri,
    listed: resourceList.result.resources.some((resource) => resource.uri === sourceUri),
    kind: resourceBody.kind,
    outgoingCarrier: resourceBody.extrema.outgoing[0].carrier,
  },
}, null, 2));
