# API Surface

The `exports` map is the public contract. Prefer explicit subpaths when a module
is responsible for a boundary or representation.

## Root

`@emsenn/relating` rolls up the common category surface:

- articulating, predicating, positing, and settling carriers and morphisms
- finite FOUR-valued relation matrices, profiles, duals, and transforms
- FOUR charge algebra helpers
- D4 gauge and order-swap helpers for the FOUR value square
- boundary action registration and dispatch
- carrier declaration helpers
- Relation Model Notation constructors and evaluators
- JSON codec helpers

Use it for normal downstream package work.

## Typing

`@emsenn/relating/typing` owns the single-source carrier kernel:

- `carrier(id, shape)`
- `schemaCarrier(id, schema)`
- `action(spec)` at the registry layer
- `registeredCategory`
- `morphismCarrier(action)`
- `actionIrAudit(actions)` and `freeTsActions(actions)`

Reach here when you need to inspect or build the category registry itself. For a
boundary-level inspection of a serialized action body, dispatch the registered
`inspect` action over `morphismCarrier(action)`.

## Acting

`@emsenn/relating/acting` is the public action-boundary subpath. Its source now
lives under `src/holography/acting` because an induced action family is treated
as one apex whose CLI, HTTP, OpenAPI, MCP, form, dispatch, and witness faces are
projections.

- `action(spec)`, the public wrapper that validates codecs and evaluates
  `runTerm`
- `dispatch(...)`, the one argv/stdin boundary runner
- `induceBins(...)`, the action-family apex that projects discovery, resources,
  prompts, endpoint metadata, and a bound dispatch function
- HTTP, OpenAPI, MCP, and form projections
- carrier-node manifold routing and serving
- invocation witnessing

The public package handle remains `/acting`; the implementation home records the
formal reading that these executable boundaries are holographic projections.

## Holography

`@emsenn/relating/holography` owns projection lattices: a resource is recognized,
read, and written as a carried type through projector morphisms.

`@emsenn/relating/holography/projecting` owns witness-log projections:

- append-only witness logs
- projected state views
- settled record tiers
- content-document cuts
- the one effectful filesystem store binding

See [Witness projection](witness-projection.md) for the user-facing shape of
that log-to-view-to-content path.

## Codecs

`@emsenn/relating/codecs` and its subpaths own representation boundaries. Codecs
translate between carriers and wire formats; they do not define the ontology of
the carrier.

The codec barrel also exposes `quadraticToNumber` for the lossy native-number
read of the exact spatial geometry surface. Exact quadratic arithmetic itself is
under `@emsenn/relating/articulating` at `predicating.geometry.spatial`.

## Analysis

`@emsenn/relating/analysis` owns exact analytical reads downstream of settlement:

- exact naturals, integers, rationals, matrices, determinants, characteristic
  polynomials, Smith normal form, and rank
- graded rationals and conservation checks
- relation-graph Laplacians, harmonic judgments, component counts, spectrum
  polynomials, and spanning-tree counts
- FOUR charge distributions, evidence coordinates, majorization/mixedness,
  independence, distortion, and screening-off

Use it when you need carrier-valued analysis, not floating-point numerical
helpers.

## Expressing

`@emsenn/relating/expressing/*` owns Relation Model Notation:

- `expressing/notating`: term and type constructors
- `expressing/evaluating`: reduction, evaluation, type checking, and term reads
- `expressing/evaluating/connecting`: Formal Concept Analysis Galois-connection terms
- `expressing/evaluating/pairing`: finite Chu-space pairing terms over FOUR
- `expressing/projecting`: carrier-to-term and term-to-carrier bridges

Carrier morphism bodies should live here as data whenever the operation is pure.
