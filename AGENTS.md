# AGENTS — @emsenn/relationality

The relational substrate, operationalized: paraconsistent, transfinitely-valued
linear logic of relations. Merges the former meme-* packages into one, each now
a module subpath.

## Before touching this package

- Read `package.json` — the `description`, `exports`, and `dependencies` are the contract.
- Run `pnpm run check` before any edit; `pnpm run verify` before committing.
- Tests are theorem-shaped: the test name is a claim the test proves.

## Public surface

- `@emsenn/relationality` (root: each module re-exported as a namespace)
- `@emsenn/relationality/algebra`
- `@emsenn/relationality/logic`
- `@emsenn/relationality/topology` (+ `/topology/dynamics`, `/topology/arithmetic`, `/topology/internal`)
- `@emsenn/relationality/geometry`
- `@emsenn/relationality/analysis`
- `@emsenn/relationality/codecs`

## Internal module graph (relative imports only — never `@emsenn/relationality/*` from within)

- `algebra` — foundation, depends on nothing
- `logic` → `algebra`
- `topology` → `algebra`, `logic`
- `geometry` → `algebra`, `topology`
- `analysis` → `algebra`, `topology`
- `codecs` — standalone (node:path only)

## Invariants to preserve

- This package performs no I/O it was not handed (fetch, clock, fs all enter as values).
- No runtime dependency may be added without a corresponding new export or documented rationale.
- `sideEffects: false` — no module-level side effects.
- `./topology/internal` carries NO semver promise: importing it is forking, not extending.
