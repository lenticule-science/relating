import {
  action,
  composes,
  tm,
} from "@emsenn/relating";
import {
  Type,
  carrier,
  morphismCarrier,
  registeredCategory,
  schemaCarrier,
  schemaId,
  schemaRegistry,
} from "@emsenn/relating";

const noteCarrier = carrier("example/carrier-kernel/note", {
  kind: Type.Literal("example.note"),
  title: Type.String({ minLength: 1 }),
  summary: Type.String(),
}, {
  title: "ExampleNote",
  description: "A small object carrier for the carrier-kernel example.",
});

const summaryCarrier = schemaCarrier(
  "example/carrier-kernel/summary",
  Type.String({
    $id: "example/carrier-kernel/summary",
    title: "ExampleSummary",
  }),
);

const summarize = action({
  verb: "carrier-kernel-summarize",
  domain: noteCarrier,
  codomain: summaryCarrier,
  summary: "Read the summary field from a note.",
  runTerm: tm.lam(tm.field("summary", tm.var(0))),
});

const echoSummary = action({
  verb: "carrier-kernel-echo-summary",
  domain: summaryCarrier,
  codomain: summaryCarrier,
  summary: "Return a summary unchanged.",
  runTerm: tm.lam(tm.var(0)),
});

const registry = schemaRegistry([
  noteCarrier,
  summaryCarrier,
  {
    $id: "example/carrier-kernel/envelope",
    type: "object",
    properties: {
      note: { $ref: noteCarrier.id },
      summary: { $ref: summaryCarrier.id },
      source: { $ref: "#/$defs/Source" },
    },
    $defs: {
      Source: { type: "string", const: "carrier-kernel-example" },
    },
  },
]);

const validNote = {
  kind: "example.note",
  title: "One declaration",
  summary: "type, schema, validator, registry address",
};
const invalidNote = {
  kind: "example.note",
  title: "",
  summary: "missing title content",
};
const serialized = morphismCarrier(summarize);

console.log(JSON.stringify({
  product: "relating.carrier-kernel",
  carrier: {
    id: noteCarrier.id,
    schemaId: schemaId(noteCarrier),
    registered: registeredCategory.carrier(noteCarrier.id)?.id === noteCarrier.id,
    validates: noteCarrier.validate(validNote),
    invalidErrors: noteCarrier.errors(invalidNote),
    additionalProperties: noteCarrier.schema.additionalProperties,
  },
  registry: {
    ids: registry.ids(),
    noteResolved: registry.resolve(noteCarrier.id)?.$id,
    summaryResolved: registry.resolve(summaryCarrier.id)?.$id,
    sourcePointer: registry.resolve("example/carrier-kernel/envelope#/$defs/Source")?.const,
    missingCarrier: registry.resolve("example/no-such-carrier") ?? null,
  },
  morphism: {
    composes: composes(summarize, echoSummary),
    serializedKeys: Object.keys(serialized),
    serialized,
    closureStored: Object.hasOwn(serialized, "run"),
  },
}, null, 2));
