# Architecture

`@emsenn/relating` is the substrate package.
It has no internal workspace dependencies and a large downstream fanout, so changes should preserve the public category surface unless an intentional migration is being performed.

## Layers

The package layers are:

1. `typing`: the single-source category kernel — `carrier`/`registry`/`realize`/
   `structural`. A carrier is one `as const` JSON-Schema literal whose `FromSchema`
   type, `$id`, and relating-owned validator are one value (no TypeBox, no Ajv,
   no codegen). Lives at `src/typing/`, public subpath `./typing` (also surfaced via
   the root and `/writing` for back-compat).
2. `articulating`: marks, utterances, articulation cells, and identity
   judgments.
3. `articulating/predicating`: predication sites, relation matrices, and
   transform readings.
4. `articulating/predicating/positing`: FOUR charges, fibers, presheaves, and
   value entry by evidence.
5. `articulating/predicating/positing/settling`: settlement filtrations,
   closures, readings, invariants, analysis, and finite dynamics.
6. `notating`: Relation Model Notation terms and types.
7. `evaluating`: term evaluation, typing, catalogs, and carrier/term projection.
8. `running`: action registration, dispatch, transport projections, carrier-node
   serving, and invocation witnessing.
9. `ledger` (RWIL): witness-log, state, record, and content projection — a
   first-class capability, not a child of `running`. The witness ROW codecs
   (EAVT/Datom/triple) live in `writing`; this is their projection engine.
   Public subpath `./ledger` (stable legacy alias `./running/ledger`).
10. `writing`: representation boundaries, pure HTTP field/frame codecs, and the
    generic projector lattice.

## Carrier Law

Use `carrier(id, shape)` or `schemaCarrier(id, schema)` as the only authored carrier declaration.
That one declaration must provide the static TypeScript source, JSON Schema, and runtime validator.

Do not reintroduce generated schema files or alternate codegen paths.

## Morphism Law

Carrier-to-carrier actions should be `runTerm` actions unless the term language is missing an actual primitive.
If a primitive is missing, add it to the term surface deliberately and verify it through the evaluator and tests.

Free TypeScript `run` belongs at boundaries: admission, codecs, transport, host-process I/O, and effectful projections.

`running` may bind an action family to HTTP, MCP, OpenAPI, or a carrier-node server.
`writing/http` must remain below that binding: it parses and serializes field values, negotiation choices, cookies, stream frames, and MCP JSON-RPC envelopes, but it does not own requests, responses, sockets, or routers.

## Verification

After source changes:

```sh
pnpm --filter @emsenn/relating run build
pnpm --filter @emsenn/relating test
```

For package-standard verification:

```sh
pnpm --filter @emsenn/relating run verify
pnpm --filter @emsenn/relating run docs:api
```

Lean-generated fixtures remain the oracle when calculus or FOUR semantics change.
Do not replace them with parallel TypeScript-only oracles.
