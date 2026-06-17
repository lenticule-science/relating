# AGENTS — @emsenn/relating

Relating, operationalized: a paraconsistent, transfinitely-valued linear logic
of relations. The package export map is the categorical surface: exports name
domain/codomain classes, extrema/apex carriers, morphisms, and representation
boundaries; scripts expose callable morphisms over the same surface.

## Before touching this package

- Read `package.json` — the `description`, `exports`, and `dependencies` are the contract.
- Run `pnpm run verify` before committing.
- Tests are theorem-shaped: the test name is a claim the test proves.

## Public surface

- `@emsenn/relating` (root: ordinary public API apex; rolls up carrier constructors, carrier types, readers, and morphisms)
- `@emsenn/relating/articulating` (+ `/predicating`, `/predicating/geometry`, `/predicating/geometry/spatial`, `/predicating/typed-theory`, `/predicating/positing`, `/predicating/positing/logic`, `/predicating/positing/settling`, `/predicating/positing/settling/geometry`, `/predicating/positing/settling/geometry/temporal`)
- `@emsenn/relating/articulating/predicating/positing/settling/analysis` (+ `/analysis/arithmetic`)
- `@emsenn/relating/analysis` (+ `/analysis/conservation`, `/analysis/differential`, `/analysis/evidence`, `/analysis/laplacian`, `/analysis/spectral`)
- `@emsenn/relating/codecs` (+ `/codecs/exact-number`, `/codecs/html`, `/codecs/resource`, `/codecs/toml`, `/codecs/turtle`)
- `@emsenn/relating/holography`
- `@emsenn/relating/scripts`

## Internal module graph (relative imports only — never `@emsenn/relating/*` from within)

- `algebra` — current foundation bucket; target role: topology/object carriers
- `logic` — current consequence bucket; target role: post-topology logic
- `topology` — package-local implementation files for settlement/closure while source moves under settling; not a package export
- `geometry` — current spatial/temporal reads; target role: analysis substrate
- `analysis` — current analytic reads; target role: reads over geometry
- `codecs` — standalone (node:path only)

## Invariants to preserve

- This package performs no I/O it was not handed (fetch, clock, fs all enter as values).
- No runtime dependency may be added without a corresponding new export or documented rationale.
- `sideEffects: false` — no module-level side effects.
- `src/topology/` is not an implementation surface; any remaining files there
  are historical tests awaiting relocation.
