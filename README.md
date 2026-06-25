# @emsenn/relating

`@emsenn/relating` is the relational substrate for the 561 Group Node ecosystem.
It gives downstream packages one category-shaped boundary system: carriers are
declared once, morphisms are registered once, and the same surface projects to
CLI, HTTP, OpenAPI, MCP, browser forms, TypeDoc, and durable witnesses.

The package is intentionally small at the runtime edge. It depends on TypeBox and
Ajv, targets Node `>=22.18`, ships ESM with declaration files, and uses an
`exports` map as its public API contract.

## What To Import

Use the root import for the ordinary relational API:

```ts
import {
  utterance,
  articulate,
  predicate,
  posit,
  settle,
  carrier,
  action,
  induceBins,
  dispatch,
  tm,
  evaluateRunTerm,
} from "@emsenn/relating";
```

Use subpaths when you are working at a specific boundary:

| Subpath | Use it for |
| --- | --- |
| `@emsenn/relating` | The common carrier, morphism, charge, settlement, action, and term surface. |
| `@emsenn/relating/typing` | The TypeBox/Ajv carrier kernel and morphism registry. |
| `@emsenn/relating/acting` | Boundary actions, dispatch, CLI/HTTP/MCP/OpenAPI projections, and carrier-node mounting. |
| `@emsenn/relating/holography` | Projection lattices from resources into typed carried content. |
| `@emsenn/relating/holography/projecting` | Witness-log, state, record, and content projection helpers. |
| `@emsenn/relating/codecs` | JSON, EAVT, markdown, HTTP, XML, SVG, and related representation codecs. |
| `@emsenn/relating/analysis` | Exact settlement/evidence analysis: naturals, rationals, matrices, Laplacians, spectra, and distributions. |
| `@emsenn/relating/expressing/*` | Relation Model Notation, the CHL-style term calculus, evaluation, and carrier projection. |

The export map is the normative API. Internal paths under `src/` are not.

## Core Model

The package carries one descent:

```text
Mark -> Utterance -> ArticulationCell -> PredicationSite -> PositPresheaf -> SettlementFiltration
```

Only admission introduces opaque `Mark` data. Everything downstream is a typed
carrier-to-carrier morphism. The standard actions expose that descent as a pipe:

```sh
printf "token\nclaim" \
  | relate utter \
  | relate articulate \
  | relate predicate \
  | relate posit \
  | relate settle
```

`induce-relation` is the same descent as one named play.

## Carrier And Action Discipline

A carrier is authored once:

```ts
import { Type } from "@sinclair/typebox";
import { carrier } from "@emsenn/relating";

export const readingCarrier = carrier("example/reading", {
  kind: Type.Literal("example.reading"),
  value: Type.String(),
});
```

That one value supplies the static TypeScript type source, JSON Schema with a
bare `$id`, and Ajv validation. Actions consume carrier objects at their domain
and codomain:

```ts
import { action, tm } from "@emsenn/relating";

export const echoReading = action({
  verb: "echo-reading",
  domain: readingCarrier,
  codomain: readingCarrier,
  runTerm: tm.lam(tm.var(0)),
});
```

Carrier morphisms should prefer `runTerm`: Relation Model Notation is the
language-neutral body that dispatch, HTTP, MCP, tests, and Lean-backed
conformance can all inspect. Free TypeScript `run` bodies are reserved for true
boundary admissions, codecs, transports, or effects.

## Commands

From the workspace root:

```sh
pnpm --filter @emsenn/relating run check
pnpm --filter @emsenn/relating run build
pnpm --filter @emsenn/relating test
pnpm --filter @emsenn/relating run verify
pnpm --filter @emsenn/relating run docs:api
```

The package resolves by name through `dist/`, so rebuild before running tests
after source or fixture changes.

## Documentation

- User docs start at [docs/README.md](docs/README.md).
- Product-shaped orientation starts at [docs/internal-products.md](docs/internal-products.md).
- Morphism inspection docs are at [docs/morphism-inspection.md](docs/morphism-inspection.md).
- Dihedral gauge docs are at [docs/dihedral-gauge.md](docs/dihedral-gauge.md).
- Relation matrix docs are at [docs/relation-matrix.md](docs/relation-matrix.md).
- Spatial geometry docs are at [docs/spatial-geometry.md](docs/spatial-geometry.md).
- Exact analysis docs are at [docs/settlement-analysis.md](docs/settlement-analysis.md).
- Runnable examples live in [examples/](examples/README.md).
- Developer docs start at [dev/docs/README.md](dev/docs/README.md).
- The acting/holography placement question is tracked in
  [dev/docs/adr/2026-06-25-acting-and-holography.md](dev/docs/adr/2026-06-25-acting-and-holography.md).

The source JSDoc and generated TypeDoc are the closest documentation to the
machine contract. Handwritten docs explain how to use and evolve that contract;
they should not contradict the package `exports` map or source declarations.
