import { Type } from "@sinclair/typebox";
import {
  action,
  actionIrAudit,
  carrier,
  freeTsActions,
  induceBins,
  isClosed,
  schemaCarrier,
  termSize,
  termUses,
  tm,
} from "@emsenn/relating";

const noteCarrier = carrier("example/operation-substrate/note", {
  kind: Type.Literal("example.note"),
  title: Type.String(),
  body: Type.String(),
  summary: Type.String(),
});

const summaryCarrier = schemaCarrier(
  "example/operation-substrate/summary",
  Type.String({
    $id: "example/operation-substrate/summary",
    title: "ExampleSummary",
    description: "The summary field read from an example note carrier.",
  }),
);

const summarize = action({
  verb: "summarize-note",
  inputFormat: "json",
  outputFormat: "json",
  domain: noteCarrier,
  codomain: summaryCarrier,
  summary: "Read the summary field from a note carrier.",
  description: "A tiny IR-backed morphism: Note -> Summary.",
  runTerm: tm.lam(tm.field("summary", tm.var(0))),
});

const induced = induceBins([summarize], { packageName: "example/operation-substrate" });
const input = {
  kind: "example.note",
  title: "Relating",
  body: "Behavior can be carried as typed data.",
  summary: "Typed morphism, many projections.",
};
const result = induced.dispatch(["summarize-note"], JSON.stringify(input));
const endpoint = induced.discovery.bins.find((bin) => bin.name === "summarize-note");
const audit = actionIrAudit([summarize])[0];

console.log(JSON.stringify({
  product: "relating.operation-substrate",
  carrierIds: {
    domain: noteCarrier.id,
    codomain: summaryCarrier.id,
  },
  action: {
    verb: summarize.verb,
    relation: audit.relation,
    hasRunTerm: audit.hasRunTerm,
    freeCarrierMorphisms: freeTsActions([summarize]).length,
  },
  runTerm: {
    closed: isClosed(summarize.runTerm),
    size: termSize(summarize.runTerm),
    uses: termUses(summarize.runTerm),
  },
  projection: {
    endpoint: {
      name: endpoint?.name,
      method: endpoint?.method,
      input: endpoint?.input,
      output: endpoint?.output,
      hasRunTerm: endpoint?.runTerm !== undefined,
    },
    resources: induced.discovery.resources.length,
    prompts: induced.discovery.prompts.length,
    utterances: induced.discovery.utterances.length,
  },
  dispatch: {
    code: result.code,
    stdout: JSON.parse(result.stdout),
  },
}, null, 2));
