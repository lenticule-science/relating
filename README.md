# @emsenn/relating

Relating is one coherent boundary system: actions are registered once, induced into
one apex, and projected to CLI, HTTP, OpenAPI, MCP, web UX, and generated API docs.

- **One dispatcher, four transports.** The `relate` binary reads stdin once,
  decodes by the selected codec, runs the pure morphism, encodes stdout, and
  witnesses scripted plays as EAVT. `relate-serve` binds the same induced apex to
  HTTP, OpenAPI, MCP, and the browser form surface.
- **Carriers are TypeBox declarations.** A carrier is authored once with
  `carrier(id, shape)`. That value supplies the `Static<>` TypeScript type source,
  the JSON Schema document with its bare `$id`, and the Ajv runtime validator. The
  `*.json` schema documents served by OpenAPI/MCP are outputs serialized from the
  registry, not hand-authored inputs.
- **Actions are morphisms.** `action({ domain, codomain, run, ... })` reads
  carrier `$id`s from the carrier objects and records them as schema refs.
  `composes(producer, consumer)` is true exactly when
  `producer.codomain.id === consumer.domain.id`.
- **The MCP knowledge-vault surface comes from the same apex.** Tools run
  actions, resources include registered carrier schemas and discovery, and prompts
  are derived from action declarations unless explicitly registered.

Use the package `exports` map and source JSDoc as the normative API. The export map
is the categorical surface; codecs are representation boundaries, not ontology.
