# Examples

Run after building the package:

```sh
pnpm run build
pnpm run examples
```

- `descent.mjs` shows the function-level utterance-to-settlement descent.
- `action-apex.mjs` shows the registered action family induced into a dispatchable
  apex.
- `term-products.mjs` inspects exported RMN term catalogs as data.
- `carrier-kernel.mjs` shows the single-source carrier object: TypeBox schema,
  Ajv validation, `$id` registry resolution, composition address, and
  serializable morphism face.
- `operation-substrate.mjs` declares a tiny carrier/action pair and projects it
  through discovery and dispatch.
- `morphism-inspection.mjs` serializes action declarations as morphism carriers
  and dispatches them through the package's own `inspect` action.
- `witness-projection.mjs` witnesses observations into an append-only EAVT log,
  projects current state, and writes a content-document cut.
- `four-charge-algebra.mjs` shows the FOUR value core, including held
  contradiction, the two orders, and gauge operations.
- `relation-matrix.mjs` shows finite FOUR-valued relation matrices: duplicate
  knowledge joins, row/column profiles, state extension, duality, and checked
  transforms.
- `spatial-geometry.mjs` shows exact quadratic-field cut-and-project geometry:
  model-set sampling, gap spectra, and finite period refutation.
- `formal-concept-analysis.mjs` shows the FCA Galois pair over
  predication-cell-shaped data as executable RMN terms.
- `chu-spaces.mjs` shows finite Chu-space duality over FOUR as executable RMN
  terms: dual, lookup, and double-dual witness.
- `settlement-analysis.mjs` shows exact settlement/evidence analysis: natural
  counts, matrix reads, and FOUR evidence distributions.
- `representation-codecs.mjs` shows canonical JSON, schema assertion
  projection, markdown dataforms, Turtle/HTML escaping, and radial SVG
  recognition through the codec catalog.
- `carrier-manifold.mjs` shows carrier `$id` mounting, including source fallback,
  an endomorphic carrier node, and OpenAPI/MCP/dispatch projection at that node.
- `lean-conformance.mjs` reads Lean-emitted golden fixtures and replays
  representative rows through the public Node/RMN API.
