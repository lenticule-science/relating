# API Surface

The `exports` map is the public contract. Prefer explicit subpaths when a module
is responsible for a boundary or representation.

## Root

`@emsenn/relating` rolls up the common category surface:

- articulating, predicating, positing, and settling carriers and morphisms
- FOUR charge algebra helpers
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

Reach here when you need to inspect or build the category registry itself.

## Acting

`@emsenn/relating/acting` owns the action boundary:

- `action(spec)`, the public wrapper that validates codecs and evaluates
  `runTerm`
- `dispatch(...)`, the one argv/stdin boundary runner
- `induceBins(...)`, the action-family apex that projects discovery, resources,
  prompts, endpoint metadata, and a bound dispatch function
- HTTP, OpenAPI, MCP, and form projections
- carrier-node manifold routing and serving
- invocation witnessing

Acting is the current home for executable projections. See the developer ADR on
acting and holography before moving this surface.

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

## Expressing

`@emsenn/relating/expressing/*` owns Relation Model Notation:

- `expressing/notating`: term and type constructors
- `expressing/evaluating`: reduction, evaluation, type checking, and term reads
- `expressing/projecting`: carrier-to-term and term-to-carrier bridges

Carrier morphism bodies should live here as data whenever the operation is pure.
