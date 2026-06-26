import assert from "node:assert/strict";

import {
  Type,
  carrier,
  generateDeclaration,
  printType,
  realize,
  realizeDefs,
} from "@emsenn/relating";

const noteCarrier = carrier("example/schema-realization/note", {
  kind: Type.Literal("example.schemaRealization.note"),
  title: Type.String({ minLength: 1, pattern: "^[A-Z].*" }),
  tags: Type.Array(Type.String({ minLength: 1 })),
  status: Type.Union([
    Type.Literal("draft"),
    Type.Literal("ready"),
  ]),
}, {
  title: "SchemaRealizationNote",
  description: "A note carrier used to show schema realization.",
});

const envelopeSchema = {
  $id: "example/schema-realization/envelope",
  type: "object",
  required: ["note", "source"],
  properties: {
    note: { $ref: noteCarrier.id },
    source: { $ref: "#/$defs/Source" },
  },
  additionalProperties: false,
  $defs: {
    Source: {
      type: "object",
      required: ["system"],
      properties: {
        system: { const: "schema-realization-example" },
      },
      additionalProperties: false,
    },
  },
};

const valid = {
  kind: "example.schemaRealization.note",
  title: "Realized schema",
  tags: ["typing", "schema"],
  status: "ready",
};
const invalid = {
  kind: "example.schemaRealization.note",
  title: "",
  tags: [""],
  status: "ready",
};

const noteType = realize(noteCarrier.schema);
const envelopeType = realize(envelopeSchema);
const defs = realizeDefs(envelopeSchema);
const noteDeclaration = generateDeclaration(noteCarrier.schema, "SchemaRealizationNote");
const envelopeDeclaration = generateDeclaration(envelopeSchema, "SchemaRealizationEnvelope");

assert.equal(noteCarrier.validate(valid), true);
assert.equal(noteCarrier.validate(invalid), false);
assert.equal(noteType.kind, "object");
assert.equal(printType(noteType).includes("minLength"), false);
assert.equal(printType(noteType).includes("pattern"), false);
assert.equal(printType(noteType).includes("readonly title: string"), true);
assert.equal(envelopeType.kind, "object");
assert.equal(printType(envelopeType).includes("note: unknown"), true);
assert.equal(printType(envelopeType).includes("source: Source"), true);
assert.equal(printType(defs.get("Source")).includes("system"), true);
assert.equal(noteDeclaration.includes("export interface SchemaRealizationNote"), true);
assert.equal(envelopeDeclaration.includes("export interface Source"), true);

console.log(JSON.stringify({
  product: "relating.schema-realization",
  schema: {
    carrierId: noteCarrier.id,
    validatesGoodValue: noteCarrier.validate(valid),
    rejectsRefinementFailure: !noteCarrier.validate(invalid),
    invalidErrors: noteCarrier.errors(invalid),
  },
  realization: {
    rootKind: noteType.kind,
    printed: printType(noteType),
    envelope: printType(envelopeType),
    defs: [...defs.entries()].map(([name, type]) => ({ name, printed: printType(type) })),
  },
  declaration: {
    noteLines: noteDeclaration.trim().split("\n").length,
    envelopeLines: envelopeDeclaration.trim().split("\n").length,
    hasGeneratedWarning: noteDeclaration.includes("Do not edit by hand."),
  },
  boundary: "JSON Schema refinements remain runtime law; realization forgets them to a structural readonly TypeScript shape",
}, null, 2));
