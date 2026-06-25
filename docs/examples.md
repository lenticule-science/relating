# Examples

The runnable examples live in `examples/` and are checked by `npm run examples`
after a build.

From the package directory:

```sh
pnpm run build
pnpm run examples
```

From the workspace root:

```sh
pnpm --filter @emsenn/relating run build
pnpm --filter @emsenn/relating run examples
```

## `examples/descent.mjs`

Runs the ordinary function-level descent:

```text
utterance -> articulate -> predicate -> posit -> settle
```

It prints the carrier kinds and a compact settlement summary: stage count,
closure regime, cofinality, first-cohomology rank, and graded-gap rank.

## `examples/action-apex.mjs`

Induces the package action list into one apex, dispatches `conflate-charge`, and
prints action-boundary facts. This is the smallest example of the package's
transport generator: one action declaration list becomes dispatch/OpenAPI/MCP/HTML
faces.

## `examples/term-products.mjs`

Inspects the exported RMN term catalogs: `descent`, `settlingTerms`,
`readerTerms`, `measurement`, `fca`, and `chu`. It prints whether representative
terms are closed, their node count, and their opcode vocabulary.

This is the "proof body as data" product surface.

## `examples/operation-substrate.mjs`

Declares a tiny `Note -> Summary` morphism:

- `carrier` declares the note object once
- `schemaCarrier` declares the string summary carrier
- `action` registers an IR-backed `summarize-note` morphism
- `induceBins` projects discovery resources, prompts, endpoint metadata, and a
  bound dispatch function from that one action

It is the smallest example of the package's operation-substrate shape: a typed
object, a typed morphism, behavior as `runTerm`, and boundary projections from
one registry.

## `examples/morphism-inspection.mjs`

Serializes public action declarations with `morphismCarrier`, dispatches the
result through the package's own `inspect` action, and prints an action-family
audit summary.

It is the smallest example of action bodies as inspectable package data:
carrier-to-carrier morphisms report their declared `$id`s and RMN body shape,
while host-only boundaries remain visible as boundaries.

## `examples/carrier-kernel.mjs`

Declares a note carrier and summary carrier, then prints the kernel projections:

- carrier `$id` and process-local registration
- Ajv validation success and error text
- schema-registry `$id` and JSON-pointer resolution
- action composition by carrier identity
- `morphismCarrier` serialization without the executable closure

It is the smallest example of the package's object floor before the action apex
projects transports.

## `examples/witness-projection.mjs`

Builds a tiny claim feed and runs the holography projection path:

```text
observation -> EAVT witness log -> state view -> content document
```

It shows three substrate facts:

- a byte-identical repeated observation appends zero rows
- functional attributes project to the latest witnessed value
- non-functional attributes accumulate witnessed values, then content projection
  cuts the current state into a term-addressed markdown document

## `examples/four-charge-algebra.mjs`

Runs the FOUR value core directly from the package root API. It prints:

- the four value names
- a `potential`/`active` knowledge join settling to `stable`
- evidence preserved on both positive and negative sides
- sample knowledge-order and truth-order comparisons
- representative gauge operations and fixed points

## `examples/relation-matrix.mjs`

Builds a sparse FOUR-valued point/state relation matrix, turns it into a
relation carrier, and prints:

- duplicate-cell knowledge join
- matrix lookup obstruction for an absent cell
- point and state profiles
- state extension
- transpose and dual reads
- checked identity transform witness

This is the smallest example of relation material as carrier-shaped data rather
than a boolean graph query.

## `examples/formal-concept-analysis.mjs`

Runs the FCA term catalog over a tiny predication context. It prints:

- the intent shared by an extent
- the extent induced by an intent
- idempotent extent closure
- a constructed formal concept
- basic term introspection for the `formalConcept` RMN body

This is the smallest example of Lean-grounded Boolean FCA as executable RMN
terms over predication-cell-shaped data.

## `examples/chu-spaces.mjs`

Runs the Chu-space term catalog over a finite FOUR-valued matrix. It prints:

- the point/state shape of the space
- the dual space's swapped point/state axes
- lookup results for present and absent matrix entries
- the double-dual equality witness
- term introspection for the `dual` and `lookup` RMN bodies

This is the smallest example of finite Chu-space duality as executable package
data over the FOUR charge algebra.

## `examples/settlement-analysis.mjs`

Runs the public `@emsenn/relating/analysis` subpath over exact analytical
carriers. It prints:

- a von Neumann natural count
- determinant, rank, and characteristic polynomial for a small integer matrix
- exact FOUR evidence-coordinate expectations
- a majorization/mixedness comparison

This is the smallest example of settlement/evidence analysis as carrier-valued
data rather than floats or booleans.

## `examples/representation-codecs.mjs`

Runs the codec catalog across several boundary forms. It prints:

- canonical JSON bytes stable across key order
- schema assertion rows folded into a projected JSON Schema document
- markdown frontmatter/body projected to assertions and cells
- Turtle IRI/literal output, HTML escaping, and slug normalization
- radial SVG projection recognized by `radialProjector`

This is the smallest example of the package's representation-boundary product:
values cross into bytes, documents, and visuals through explicit codecs.

## `examples/carrier-manifold.mjs`

Builds a tiny carrier-node namespace:

- a source apex falls back to `/maker`
- a widget endomorphism mounts at `/example/carrier-manifold/widget`
- the carrier node projects index, OpenAPI, MCP, and POST dispatch faces

It is the smallest example of package composition by carrier identity rather
than controller naming.

## `examples/lean-conformance.mjs`

Reads the committed Lean-emitted fixtures and replays representative rows
through the public package API. It prints:

- fixture counts for FOUR, CHL, domain primitives, and measurement cores
- `potential joinK active = stable` as computed by Lean and Node
- agreement on a CHL development sample
- closure-regime classification through both RMN and TypeScript

It is the smallest example of the package's Lean oracle bridge.
