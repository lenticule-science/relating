# Relating Developer Docs

These docs are for maintainers changing `@emsenn/relating` itself.

- [Architecture](architecture.md) describes the package layers and their
  ownership.
- [CI](ci.md) records the current GitHub Actions setup.
- [TypeDoc](typedoc.md) records how API docs are generated and what warning
  policy is currently intentional.
- [Product shape](product-shape.md) names the product-shaped surfaces already
  present in code and downstream usage without overstating the frontier.
- [ADR: acting and holography](adr/2026-06-25-acting-and-holography.md) captures
  the formal placement question before any export move.
- [notes/2026-06-24-term-ir-subsystem.md](notes/2026-06-24-term-ir-subsystem.md)
  is the deeper term-IR subsystem note.
- [notes/2026-06-23-sloppy-relation-model-notation-spec.md](notes/2026-06-23-sloppy-relation-model-notation-spec.md)
  preserves the earlier RMN specification work.

Maintenance rule: keep source JSDoc and TypeDoc closest to the machine contract,
then user docs, then these developer notes. When they disagree, fix the farther
document or the code; do not let prose drift away from the export map.
