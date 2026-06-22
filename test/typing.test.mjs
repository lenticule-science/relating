/**
 * Contract: `typing` — objects are data, and a carrier's TypeScript type is the
 * forgetful functor `realize: Sub(J) → StructuralTypes` over its JSON Schema. The
 * promises: the schema-combinator mapping, recursion preserved as named references,
 * and the `$id`-keyed registry that resolves carriers (and pointers) across packages.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";

import { Type } from "@sinclair/typebox";
import { utteranceCarrier, utterance, mark } from "@emsenn/relating/articulating";
import { realize, generateDeclaration, schemaRegistry, schemaId, carrier } from "@emsenn/relating/typing";

describe("carrier declarations are the single source", () => {
  it("one TypeBox value yields a static type source, JSON Schema $id, and validator", () => {
    const value = utterance(mark("left"), mark("right"));
    assert.equal(utteranceCarrier.id, "relating/articulating/utterance");
    assert.equal(utteranceCarrier.schema.$id, "relating/articulating/utterance");
    assert.equal(utteranceCarrier.validate(value), true);
    assert.equal(utteranceCarrier.validate({ kind: "utterance.carrier" }), false);
  });

  it("new carriers register by $id without generated type files", () => {
    const demo = carrier("test/typing/demo", { kind: Type.Literal("demo"), value: Type.String() });
    assert.equal(demo.validate({ kind: "demo", value: "ok" }), true);
    assert.equal(schemaRegistry([demo]).resolve("test/typing/demo"), demo.schema);
    assert.equal(existsSync("src/articulating/utterance.schema.types.mts"), false);
    assert.equal(existsSync("codegen/realize-schemas.mts"), false);
  });
});

describe("realize is the forgetful functor on JSON Schema", () => {
  it("maps the schema combinators to structural types", () => {
    assert.equal(realize({ allOf: [{ type: "object" }, { type: "object" }] }).kind, "intersection");
    assert.equal(realize({ anyOf: [{ type: "string" }, { type: "number" }] }).kind, "union");
    assert.equal(realize({ oneOf: [{ type: "string" }, { type: "number" }] }).kind, "union");
    assert.equal(realize({ enum: ["a", "b"] }).kind, "union");
    assert.deepEqual(realize({ $ref: "#/$defs/Hand" }), { kind: "ref", name: "Hand" }); // never inlined
  });

  it("forgets refinements: a constrained primitive realizes to the bare primitive", () => {
    assert.deepEqual(realize({ type: "string", minLength: 3, pattern: "^x" }), { kind: "primitive", name: "string" });
  });

  it("prints recursion as a named reference, not an infinite inline expansion", () => {
    const schema = {
      type: "object",
      properties: { next: { $ref: "#/$defs/Node" } },
      $defs: { Node: { type: "object", properties: { next: { $ref: "#/$defs/Node" } } } },
    };
    const dts = generateDeclaration(schema, "Root");
    assert.match(dts, /export interface Node/);
    assert.match(dts, /next\?: Node;/);
  });
});

describe("the schema registry resolves carriers by $id", () => {
  const schema = {
    $id: "demo/thing",
    type: "object",
    properties: { hand: { $ref: "#/$defs/Hand" } },
    $defs: { Hand: { type: "string", const: "left" }, Other: { type: "string", const: "right" } },
  };

  it("schemaId reads the bare path-form identity (no domain authority)", () => {
    assert.equal(schemaId(schema), "demo/thing");
  });

  it("resolves a carrier $id to its document, a pointer into its $defs, and is total on the unknown", () => {
    const registry = schemaRegistry([schema]);
    assert.deepEqual(registry.ids(), ["demo/thing"]);
    assert.equal(registry.get("demo/thing"), schema);
    assert.equal(registry.resolve("demo/thing"), schema);
    assert.equal(registry.resolve("demo/thing#/$defs/Hand").const, "left");
    assert.equal(registry.resolve("#/$defs/Other", schema).const, "right"); // intra-doc pointer against a base
    assert.equal(registry.resolve("no/such/carrier"), undefined);           // total, not throwing
  });
});
