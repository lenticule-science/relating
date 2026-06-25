# Representation Codecs

The codec surface is the package's representation boundary kit. It admits values
into wire/document forms, canonicalizes them where order should not matter, and
projects selected representations through holography projectors.

This is not the package ontology. Carriers, actions, predication cells, charges,
and settlements are the ontology. Codecs are the gates where those things cross
JSON, JSONL, Markdown, TOML, Turtle, HTML/XML/SVG, paths, schemas, and HTTP
header grammars.

Useful handles:

- canonical JSON: `canonical`, `parseJson`, `jsonProjector`, `jsonlProjector`
- EAVT/object rows: `toEavt`, `mergeEavtLogs`, `unfoldJson`, `foldJson`
- schema traces: `unfoldSchema`, `projectSchemaAssertions`,
  `resolveJsonPointer`
- markdown cuts: `createMarkdown`, `markdownDataform`, `markdownProjector`
- text/RDF boundaries: `escapeText`, `escapeAttr`, `slug`, `iriRef`,
  `turtleLiteral`
- SVG/radial projection: `projectSvg`, `projectRadial`, `radialProjector`,
  `radialFromValuation`, `radialFromClosureStages`

## Example

```js
import { charge, chargeValue } from "@emsenn/relating";
import { canonical, projectRadial } from "@emsenn/relating/codecs";

canonical({ b: 2, a: 1 }); // "{\"a\":1,\"b\":2}"

const supported = charge(chargeValue("potential"));

const svg = projectRadial({
  rings: [{
    ordinal: 0,
    segments: [{
      e: "json",
      a: "canonicalizes",
      v: "bytes",
      orbit: "diagonal",
      charge: supported,
    }],
  }],
});
```

For a runnable version with schema, markdown, Turtle/HTML, and radial SVG
projection, see
[`examples/representation-codecs.mjs`](../examples/representation-codecs.mjs).

## Product Reading

Most Node libraries treat codecs as glue: parse here, stringify there, hope the
bytes are close enough. In `@emsenn/relating`, codecs are closer to boundary
witnesses. They answer:

- can this value inhabit this representation?
- are these bytes canonical for this JSON value?
- can this document be unfolded into trace rows and folded back?
- can this SVG be recognized as the radial projection vocabulary?
- can a representation be mounted as a holography projector?

That is a real product surface because downstream packages can reuse the same
representation laws instead of reauthoring small, drifting codecs.

## Verification Reading

The codec tests cover observable behavior rather than private implementation
shape:

- canonical JSON is key-order independent and idempotent
- TOML decodes and encodes a value tree
- Turtle and markup escaping neutralize representation syntax
- EAVT/datom folds hold contradictions as FOUR-valued charge instead of erasing
  them
- radial SVG projection is deterministic, self-describing, charge-colored, and
  recognized by `radialProjector`

This is standards-facing engineering, not a Lean-conformance surface. The
authority here is the representation contract and the package tests.
