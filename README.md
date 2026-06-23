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
- **Actions are morphisms.** `action({ domain, codomain, run | runTerm, ... })`
  reads carrier `$id`s from the carrier objects and records them as schema refs.
  `composes(producer, consumer)` is true exactly when
  `producer.codomain.id === consumer.domain.id`.
- **A morphism's body is an IR term** (`./term`). `runTerm` is a value of the
  typed-total LISP this package carries: a JSON s-expression shadow of the proven
  `RelMath.CHL.Tm` calculus (de-Bruijn STLC — `var`/`lam`/`app`/`pair`/`fst`/`snd`/
  `star`) extended with domain constants (`mark`, the FOUR `charge` algebra,
  `settle`) and structural primitives (`field` projection, `append`, `coincide`,
  `cond`, and `fold` — the one structural recursion). `evaluate` reduces it; the four
  faces all run the *same* IR through one `dispatch`, so a morphism's logic is
  language-neutral data, not per-transport code. The whole relation descent —
  `articulate → predicate → posit → settle` (and `induce-relation`, `relate-relations`,
  `coincide`) is expressed this way, as are the nine `read-*-of-settlement-filtration`
  **measurement** readers (the settling closure materialized in the IR via `fold`, the
  invariants computed by genuine fold/filter/count, the regime routed through the
  Lean-grounded `classifyRegime`).
- **The term layer is also the proof calculus.** `hasTy(ctx, term, type)` is
  `RelMath.CHL.HasTy` as a decidable bidirectional checker: a well-typed CHL-core term
  IS a proof of its type-as-proposition (Curry–Howard). It is the trusted
  proof-verification floor a proof search (e.g. `@emsenn/knowing`'s `find`) is checked
  against — a found proof is trustworthy because it type-checks.
- **Reading external content is relating's, via `/holography/projecting`.** The content
  tier has a writer *and* a reader (`readContentResource`/`listContentEntries`/
  `readContentTree`/`confine`, the one effectful fs binding); a faculty that reads a
  corpus binds these + the markdown codec rather than re-implementing fs.
- **Carriers present their generators (a free ⊣ forgetful adjunction).** A carrier
  past the early stages is a *free construction* over a small generating set, so
  the stored/wire form keeps only the generators and the derived structure is
  re-derived on read: `present…` forgets to the generators, `free…` rebuilds the
  full object (`free ∘ present ≅ id` — "no free data past Mark and Articulating").
  E.g. a predication site stores `{cells, specializations}`; its
  `entities`/`predicates`/`base` are `freePredicationSite`'s materialization.
- **Lean is the proof authority.** The calculus and the FOUR algebra are checked
  against `RelMath` (`lean/`) by committed golden vectors (`test/fixtures/lean-*.jsonl`,
  emitted by `conformance/ConformanceVectors.lean`); carrier-specific morphisms are
  checked differential against the real TS operation on the real carrier.
- **The MCP knowledge-vault surface comes from the same apex.** Tools run
  actions, resources include registered carrier schemas and discovery, and prompts
  are derived from action declarations unless explicitly registered.

Use the package `exports` map and source JSDoc as the normative API. The export map
is the categorical surface; codecs are representation boundaries, not ontology.
