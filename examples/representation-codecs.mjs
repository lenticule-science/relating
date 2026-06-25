import assert from "node:assert/strict";

import { charge, chargeValue } from "@emsenn/relating";
import {
  canonical,
  createMarkdown,
  escapeText,
  iriRef,
  markdownDataform,
  projectRadial,
  projectSchemaAssertions,
  chargePalette,
  radialProjector,
  resolveJsonPointer,
  slug,
  turtleLiteral,
  unfoldSchema,
} from "@emsenn/relating/codecs";

const canonicalBytes = canonical({ status: "ready", title: "Representation Codecs" });
const canonicalBytesReordered = canonical({ title: "Representation Codecs", status: "ready" });
assert.equal(canonicalBytes, canonicalBytesReordered);

const schemaRows = unfoldSchema({
  type: "object",
  required: ["title"],
  additionalProperties: false,
  properties: {
    title: { type: "string" },
    status: { enum: ["draft", "ready"] },
  },
}, {
  base: "example/representation-codecs/note",
  t: "schema:1",
});
const projectedSchema = projectSchemaAssertions(schemaRows, {
  id: "example/representation-codecs/note",
});
assert.equal(projectedSchema.contradictions.length, 0);
assert.equal(resolveJsonPointer(projectedSchema.schema, "/properties/status/enum/1"), "ready");

const markdown = createMarkdown({
  slug: "relating-codecs",
  title: "Representation Codecs",
  status: "ready",
  tags: ["codec", "projector"],
  body: "# Representation Codecs\n\nOne value, several representations.\n",
});
const dataform = markdownDataform(markdown, {
  subject: "relating-codecs",
  witness: "examples/representation-codecs.md",
});
assert.equal(dataform.subject, "relating-codecs");
assert.equal(dataform.frontmatter.title, "Representation Codecs");
assert.equal(dataform.conformant, true);

const iri = iriRef("https://561.group/codec space");
const literal = turtleLiteral("ready\nnow");
const escaped = escapeText("<stable & active>");
const normalizedSlug = slug("Representation Codecs!");
assert.equal(iri, "<https://561.group/codec%20space>");
assert.equal(literal, "\"ready\\nnow\"");
assert.equal(escaped, "&lt;stable &amp; active&gt;");
assert.equal(normalizedSlug, "representation-codecs");

const chargedOf = (name) => charge(chargeValue(name));
const radialSvg = projectRadial({
  title: "Representation codec charges",
  rings: [
    {
      ordinal: 0,
      segments: [
        { e: "json", a: "canonicalizes", v: "bytes", orbit: "diagonal", charge: chargedOf("potential") },
        { e: "schema", a: "folds", v: "assertions", orbit: "off-diagonal", charge: chargedOf("stable") },
      ],
    },
    {
      ordinal: 1,
      segments: [
        { e: "markdown", a: "projects", v: "cells", orbit: "off-diagonal", charge: chargedOf("active") },
      ],
    },
  ],
}, {
  center: "base",
});
assert.equal(radialProjector.recognize({ path: "codec.svg", content: radialSvg }), true);
assert.match(radialSvg, /data-codec="radial"/);

console.log(JSON.stringify({
  product: "relating.representation-codecs",
  canonical: {
    bytes: canonicalBytes,
    stableAcrossKeyOrder: canonicalBytes === canonicalBytesReordered,
  },
  schema: {
    rows: schemaRows.length,
    id: projectedSchema.schema?.$id,
    statusReadyPointer: resolveJsonPointer(projectedSchema.schema, "/properties/status/enum/1"),
  },
  markdown: {
    subject: dataform.subject,
    format: dataform.format,
    assertions: dataform.assertions.length,
    conformant: dataform.conformant,
  },
  text: {
    iri,
    literal,
    escaped,
    slug: normalizedSlug,
  },
  radial: {
    recognized: radialProjector.recognize({ path: "codec.svg", content: radialSvg }),
    bytes: radialSvg.length,
    palette: {
      potential: chargePalette.potential,
      active: chargePalette.active,
      stable: chargePalette.stable,
    },
  },
}, null, 2));
