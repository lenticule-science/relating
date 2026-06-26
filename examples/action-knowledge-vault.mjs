import assert from "node:assert/strict";

import { Type } from "@sinclair/typebox";
import {
  action,
  carrier,
  induceBins,
  schemaCarrier,
  tm,
} from "@emsenn/relating";
import {
  actionMcpHandle,
  literalResource,
  prompt,
  userMessage,
} from "@emsenn/relating/running";

const noteCarrier = carrier("example/action-knowledge-vault/note", {
  kind: Type.Literal("example.actionKnowledgeVault.note"),
  title: Type.String(),
  body: Type.String(),
  summary: Type.String(),
});

const summaryCarrier = schemaCarrier(
  "example/action-knowledge-vault/summary",
  Type.String({
    $id: "example/action-knowledge-vault/summary",
    title: "ActionKnowledgeVaultSummary",
  }),
);

const summarize = action({
  verb: "summarize-vault-note",
  inputFormat: "json",
  outputFormat: "json",
  domain: noteCarrier,
  codomain: summaryCarrier,
  summary: "Read the summary field from a vault note.",
  description: "Tiny carrier morphism used to show tools/resources/prompts from one apex.",
  runTerm: tm.lam(tm.field("summary", tm.var(0))),
});

const guide = literalResource(
  "relating://example/action-knowledge-vault/guide",
  "Action knowledge vault guide",
  "Call summarize-vault-note with an example.actionKnowledgeVault.note carrier.\n",
  {
    mimeType: "text/plain",
    description: "Human and agent guide for the example action family.",
  },
);

const draftPrompt = prompt({
  name: "draft-vault-note",
  description: "Draft a note carrier for the vault summarizer.",
  arguments: [
    { name: "title", required: true },
    { name: "body", required: true },
  ],
  compose: (args) => [
    userMessage([
      "Draft a JSON carrier for summarize-vault-note.",
      `Title: ${args.title ?? ""}`,
      `Body: ${args.body ?? ""}`,
    ].join("\n")),
  ],
});

const induced = induceBins([summarize, guide, draftPrompt], {
  packageName: "example/action-knowledge-vault",
});

const rpc = (id, method, params = {}) =>
  actionMcpHandle(induced, { jsonrpc: "2.0", id, method, params }, {});

const input = {
  kind: "example.actionKnowledgeVault.note",
  title: "One apex",
  body: "Tools, resources, and prompts project from the same action family.",
  summary: "One induced apex, three MCP knowledge-vault faces.",
};

const toolsList = rpc(1, "tools/list");
const toolCall = rpc(2, "tools/call", {
  name: "summarize-vault-note",
  arguments: { input: JSON.stringify(input) },
});
const resourcesList = rpc(3, "resources/list");
const resourceRead = rpc(4, "resources/read", {
  uri: "relating://example/action-knowledge-vault/guide",
});
const promptsList = rpc(5, "prompts/list");
const actionPrompt = rpc(6, "prompts/get", {
  name: "summarize-vault-note",
  arguments: { input: JSON.stringify(input) },
});
const customPrompt = rpc(7, "prompts/get", {
  name: "draft-vault-note",
  arguments: { title: "One apex", body: "Make the carrier visible." },
});

const tools = toolsList.result.tools;
const resources = resourcesList.result.resources;
const prompts = promptsList.result.prompts;
const toolText = toolCall.result.content[0].text;
const guideText = resourceRead.result.contents[0].text;
const actionPromptText = actionPrompt.result.messages[0].content.text;
const customPromptText = customPrompt.result.messages[0].content.text;

assert.ok(tools.some((tool) => tool.name === "summarize-vault-note"));
assert.equal(JSON.parse(toolText), input.summary);
assert.ok(resources.some((resource) => resource.uri === guide.uri));
assert.ok(resources.some((resource) => resource.uri.endsWith("/discovery")));
assert.ok(guideText.includes("summarize-vault-note"));
assert.ok(prompts.some((entry) => entry.name === "summarize-vault-note"));
assert.ok(prompts.some((entry) => entry.name === "draft-vault-note"));
assert.ok(actionPromptText.includes("Operation: summarize-vault-note"));
assert.ok(customPromptText.includes("Draft a JSON carrier"));

console.log(JSON.stringify({
  product: "relating.action-knowledge-vault",
  apex: {
    actions: induced.actions.length,
    bins: induced.discovery.bins.length,
    resources: induced.discovery.resources.length,
    prompts: induced.discovery.prompts.length,
    utterances: induced.discovery.utterances.length,
  },
  mcp: {
    tools: tools.length,
    hasTool: tools.some((tool) => tool.name === "summarize-vault-note"),
    resources: resources.length,
    hasGuideResource: resources.some((resource) => resource.uri === guide.uri),
    hasDiscoveryResource: resources.some((resource) => resource.uri.endsWith("/discovery")),
    prompts: prompts.length,
    hasDerivedActionPrompt: prompts.some((entry) => entry.name === "summarize-vault-note"),
    hasCustomPrompt: prompts.some((entry) => entry.name === "draft-vault-note"),
  },
  call: {
    output: JSON.parse(toolText),
  },
  resource: {
    uri: guide.uri,
    bytes: guideText.length,
  },
  prompt: {
    actionMentionsOperation: actionPromptText.includes("Operation: summarize-vault-note"),
    customMentionsCarrier: customPromptText.includes("JSON carrier"),
  },
}, null, 2));
