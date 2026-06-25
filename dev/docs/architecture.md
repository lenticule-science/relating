# Architecture

`@emsenn/relating` is the substrate package. It has no internal workspace
dependencies and a large downstream fanout, so changes should preserve the public
category surface unless an intentional migration is being performed.

## Layers

The package layers are:

1. `typing`: the single-source TypeBox/Ajv category kernel.
2. `articulating`: marks, utterances, articulation cells, and identity
   judgments.
3. `articulating/predicating`: predication sites, relation matrices, and
   transform readings.
4. `articulating/predicating/positing`: FOUR charges, fibers, presheaves, and
   value entry by evidence.
5. `articulating/predicating/positing/settling`: settlement filtrations,
   closures, readings, invariants, and analysis.
6. `expressing`: Relation Model Notation, term evaluation, typing, and
   carrier/term projection.
7. `acting`: action registration, dispatch, transport projections, carrier-node
   serving, and invocation witnessing.
8. `holography`: projection lattices and witness-log/state/content projection.
9. `codecs`: representation boundaries.

## Carrier Law

Use `carrier(id, shape)` or `schemaCarrier(id, schema)` as the only authored
carrier declaration. That one declaration must provide the static TypeScript
source, JSON Schema, and runtime validator.

Do not reintroduce generated schema files or alternate codegen paths.

## Morphism Law

Carrier-to-carrier actions should be `runTerm` actions unless the term language
is missing an actual primitive. If a primitive is missing, add it to the term
surface deliberately and verify it through the evaluator and tests.

Free TypeScript `run` belongs at boundaries: admission, codecs, transport,
host-process I/O, and effectful projections.

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

Lean-generated fixtures remain the oracle when calculus or FOUR semantics
change. Do not replace them with parallel TypeScript-only oracles.
