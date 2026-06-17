import assert from "node:assert/strict";
import test from "node:test";
import {
  cohereSchemaAssertions,
  foldSchema,
  mergeSchemaAssertions,
  projectSchemaAssertions,
  resolveJsonPointer,
  schemaProjector,
  schemaAssertionEavtId,
  schemaAssertionTriple,
  serializeSchemaAssertions,
  unfoldSchema,
} from "./index.mjs";

test("JSON Schema assertions unfold, merge, cohere, and project as EAVT rows", () => {
  const schema = {
    type: "object",
    additionalProperties: false,
    required: ["name"],
    properties: { name: { type: "string", minLength: 1 } },
  };
  const assertions = unfoldSchema(schema, { base: "schema:note", t: "tx-1" });
  const merged = mergeSchemaAssertions(assertions, [assertions[0]!]);
  const projected = projectSchemaAssertions(merged, { id: "schema:note" });

  assert.equal(merged.length, assertions.length);
  assert.equal(schemaAssertionEavtId(assertions[0]!), schemaAssertionEavtId(merged.find((row) => row.e === assertions[0]!.e && row.a === assertions[0]!.a)!));
  assert.deepEqual(foldSchema(merged), schema);
  assert.deepEqual(cohereSchemaAssertions(merged).contradictions, []);
  assert.deepEqual(projected.schema, { $schema: "https://json-schema.org/draft/2020-12/schema", $id: "schema:note", ...schema });
  assert.equal(serializeSchemaAssertions(assertions).endsWith("\n"), true);
  assert.deepEqual(schemaAssertionTriple(assertions[0]!), { s: assertions[0]!.e, p: assertions[0]!.a, o: assertions[0]!.v });
});

test("JSON Schema assertion coherence surfaces contradictory values", () => {
  const left = unfoldSchema({ type: "object" }, { base: "schema:note", t: "tx-1" });
  const right = unfoldSchema({ type: "string" }, { base: "schema:note", t: "tx-2" });
  const result = cohereSchemaAssertions([...left, ...right]);

  assert.equal(result.schema, null);
  assert.equal(result.contradictions.length, 1);
  assert.deepEqual(result.contradictions[0]?.values, ["object", "string"]);
});

test("JSON Schema projector restricts JSON flatfiles by schema filename", () => {
  assert.equal(schemaProjector.recognize({ path: "note.schema.json", content: '{"type":"object"}' }), true);
  assert.equal(schemaProjector.recognize({ path: "note.json", content: '{"type":"object"}' }), false);
  assert.equal(schemaProjector.recognize({ path: "note.schema.json", content: '{"type":' }), false);
  assert.equal(schemaProjector.parent?.type, "json");
});

test("JSON Schema codec resolves local JSON Pointer fragments without file I/O", () => {
  const schema = {
    "$defs": {
      "name/type": { type: "string" },
      "tilde~key": { const: true },
    },
    properties: [{ type: "number" }],
  };

  assert.deepEqual(resolveJsonPointer(schema, "#/$defs/name~1type"), { type: "string" });
  assert.deepEqual(resolveJsonPointer(schema, "/$defs/tilde~0key"), { const: true });
  assert.deepEqual(resolveJsonPointer(schema, "#/properties/0"), { type: "number" });
  assert.equal(resolveJsonPointer(schema, "not-a-pointer"), undefined);
});
