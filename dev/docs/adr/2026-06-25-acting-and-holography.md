# ADR: Acting And Holography

## Status

Accepted for the current source layout.

## Context

The public `@emsenn/relating/acting` surface owns actions, dispatch, induced
bins, HTTP, OpenAPI, MCP, browser forms, carrier-node mounting, serving, and
invocation witnessing.

The `holography` surface owns projection lattices: resources are recognized,
read, and written as carried types, and witness logs are projected into state,
records, and content.

The formal question was whether the action machinery formerly under
`src/acting/` is actually a holographic projection layer. An induced action apex
is a single
mathematical object whose faces are CLI, HTTP, OpenAPI, MCP, form HTML, carrier
nodes, and witness feeds. That sounds holographic: each face is a projection of
the same carrier/morphism registry.

The current source tree has taken that step: the implementation lives under
`src/holography/acting/`, while the package export remains
`@emsenn/relating/acting`.

## Decision Pressure

There are two true statements in tension:

- Acting is the current public boundary vocabulary. Downstream packages import
  `@emsenn/relating/acting`, and the root export re-exports `action`,
  `dispatch`, `serve`, and `induceBins`.
- Holography is the better formal home for "one object, many faithful
  projections" when the object is read as mathematics rather than as transport.

## Decision

Treat `@emsenn/relating/acting` as the operational boundary facade and
`src/holography/acting/` as its formal implementation home. The public import
names the user action boundary; the source location records that action
transports, descriptors, forms, carrier-node routes, and witness feeds are
projections of one induced apex.

Current rules:

1. Keep `@emsenn/relating/acting` as the stable operational import.
2. Do not introduce a second public alias such as
   `@emsenn/relating/holography/acting` merely because the source moved; that
   would create two user handles for one surface.
3. Keep projection constructors and host bindings together in
   `src/holography/acting/` while the public surface is one action apex.
4. Preserve root re-exports of `action`, `dispatch`, `serve`, and `induceBins`
   until the normative user surface is changed deliberately.
5. When splitting further, use the formal criterion: pure projection
   constructors may become a more specific holography submodule; process loops
   remain the action boundary users run.

## Formal Reading

An `Action` is a morphism carrier with optional executable realization. An
`InducedBins` value is the apex formed from a finite action family. CLI, HTTP,
OpenAPI, MCP, HTML, and witness feeds are projections of that apex into boundary
representations.

Under that reading, "acting" is not wrong. It is the enacted boundary face of a
holographic object. The formal source tree names the projection machinery under
holography, while the ergonomic package continues to offer acting as the place
where users run things.

## Consequences

- No breaking import changes: public `/acting` remains the handle.
- TypeDoc and source navigation now show `src/holography/acting/` as the
  implementation home.
- Documentation can teach acting as projection, not as ad hoc transport glue.
- Future moves can be reviewed file by file against the formal criterion above.
