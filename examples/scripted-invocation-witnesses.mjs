import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";
import { tmpdir } from "node:os";

import { action, carrierFrom, induceBins, tm } from "@emsenn/relating";
import { invocationStore, projectInvocations } from "@emsenn/relating/running";

const namespace = "example/scripted-invocation-witnesses";
const at = "2026-06-25T12:34:56.000Z";
const dataRoot = mkdtempSync(path.join(tmpdir(), "rel-invocation-"));

const noteCarrier = carrierFrom({
  $id: "example/scripted-invocation-witnesses/note",
  title: "ScriptedInvocationNote",
  description: "A note carrier for the invocation-witness example.",
  type: "object",
  required: ["kind", "title", "body", "summary"],
  properties: {
    kind: { const: "example.scripted-invocation.note" },
    title: { type: "string" },
    body: { type: "string" },
    summary: { type: "string" },
  },
  additionalProperties: false,
});

const summaryCarrier = carrierFrom({
  $id: "example/scripted-invocation-witnesses/summary",
  title: "ScriptedInvocationSummary",
  description: "The summary field read from an invocation-witness example note.",
  type: "string",
});

const summarize = action({
  verb: "summarize-invocation-note",
  inputFormat: "json",
  outputFormat: "json",
  domain: noteCarrier,
  codomain: summaryCarrier,
  summary: "Read a note summary and witness the scripted boundary play.",
  description: "A tiny IR-backed morphism used to show direct run versus dispatch witnessing.",
  runTerm: tm.lam(tm.field("summary", tm.var(0))),
});

const induced = induceBins([summarize], { packageName: namespace });
const input = {
  kind: "example.scripted-invocation.note",
  title: "Invocation witnesses",
  body: "A boundary play can leave one EAVT row.",
  summary: "Dispatch writes the witness; direct run does not.",
};

const { store, feed } = invocationStore(dataRoot, namespace, at);
const logFile = path.join(store.logDir, `${feed}.jsonl`);

try {
  const direct = summarize.run(input, {});
  assert.equal(direct, input.summary);
  assert.equal(existsSync(logFile), false);

  const result = induced.dispatch(
    ["summarize-invocation-note"],
    JSON.stringify(input),
    {
      dataRoot,
      namespace,
      caller: { transport: "example", office: "docs" },
      now: () => at,
    },
  );

  assert.equal(result.code, 0);
  assert.equal(JSON.parse(result.stdout), input.summary);
  assert.equal(existsSync(logFile), true);

  const rows = readFileSync(logFile, "utf8").trim().split("\n").map((line) => JSON.parse(line));
  assert.equal(rows.length, 1);
  assert.deepEqual(rows[0].e, { transport: "example", office: "docs" });
  assert.equal(rows[0].a.verb, "summarize-invocation-note");
  assert.deepEqual(rows[0].a.args, {});
  assert.equal(rows[0].a.action.kind, "relating.action");
  assert.equal(rows[0].a.action.verb, "summarize-invocation-note");
  assert.deepEqual(rows[0].a.action.runTerm, summarize.runTerm);
  assert.equal(rows[0].v, input.summary);
  assert.equal(rows[0].t, at);

  const projected = projectInvocations(store, feed);
  const projectedEntities = Object.keys(projected);
  assert.equal(projectedEntities.length, 1);

  console.log(JSON.stringify({
    product: "relating.scripted-invocation-witnesses",
    directRun: {
      returned: direct,
      wroteWitness: false,
    },
    dispatch: {
      code: result.code,
      stdout: JSON.parse(result.stdout),
      wroteWitness: true,
    },
    witness: {
      feed,
      relativeLog: path.relative(dataRoot, logFile).split(path.sep).join("/"),
      caller: rows[0].e,
      verb: rows[0].a.verb,
      value: rows[0].v,
      hasMorphismCarrier: rows[0].a.action.kind === "relating.action",
      hasRunTerm: rows[0].a.action.runTerm !== undefined,
    },
    projection: {
      entities: projectedEntities.length,
      firstEntity: projectedEntities[0],
    },
  }, null, 2));
} finally {
  rmSync(dataRoot, { recursive: true, force: true });
}
