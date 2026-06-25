# ADR: Acting And Holography

## Status

Proposed.

## Context

The `acting` surface currently owns actions, dispatch, induced bins, HTTP,
OpenAPI, MCP, browser forms, carrier-node mounting, serving, and invocation
witnessing.

The `holography` surface owns projection lattices: resources are recognized,
read, and written as carried types, and witness logs are projected into state,
records, and content.

The formal question is whether the action machinery under `src/acting/` is
actually a holographic projection layer. An induced action apex is a single
mathematical object whose faces are CLI, HTTP, OpenAPI, MCP, form HTML, carrier
nodes, and witness feeds. That sounds holographic: each face is a projection of
the same carrier/morphism registry.

## Decision Pressure

There are two true statements in tension:

- Acting is the current public boundary vocabulary. Downstream packages import
  `@emsenn/relating/acting`, and the root export re-exports `action`,
  `dispatch`, `serve`, and `induceBins`.
- Holography is the better formal home for "one object, many faithful
  projections" when the object is read as mathematics rather than as transport.

## Proposed Direction

Treat the current `acting` module as the operational boundary facade and document
its formal interpretation as a holographic projection of the action apex.

Do not move files in the same pass as documentation and CI. Instead:

1. Keep `@emsenn/relating/acting` as the stable operational import.
2. Introduce a future `@emsenn/relating/holography/acting` or
   `@emsenn/relating/holography/projecting/actions` surface only when the package
   can migrate exports intentionally.
3. Move pure projection machinery first: OpenAPI, MCP descriptors, HTML forms,
   carrier-node indexes, and discovery projections.
4. Leave process bindings and transport loops at an operational boundary:
   `dispatch`, `serve`, `routeRequest`, and `serveCarrierManifold` may remain as
   acting facades over holographic projectors.
5. Preserve the root imports until the normative surface is changed deliberately.

## Formal Reading

An `Action` is a morphism carrier with optional executable realization. An
`InducedBins` value is the apex formed from a finite action family. CLI, HTTP,
OpenAPI, MCP, HTML, and witness feeds are projections of that apex into boundary
representations.

Under that reading, "acting" is not wrong. It is the enacted boundary face of a
holographic object. The formal library should probably name the projection
machinery under holography, while the ergonomic package should continue to offer
acting as the place where users run things.

## Consequences

- No immediate breaking import changes.
- Documentation can now teach acting as projection, not as ad hoc transport glue.
- Future moves can be reviewed file by file against a formal criterion:
  projection constructors move toward holography; host bindings remain at the
  acting boundary.
