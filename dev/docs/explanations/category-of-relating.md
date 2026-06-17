# Category of Relating: Module Allocation Map

This is a migration map for renaming and reallocating the package around the
category of `relating`.

The normative package-design rules behind this migration live in
`dev/docs/guides/category-theoretic-node-packaging.md`. The local rules below
specialize that document to `@emsenn/relating`; when they appear to conflict,
the normative guide controls and this map should be corrected.

The package is no longer named `@emsenn/relationality`; its public package
identity is `@emsenn/relating`. That rename is not branding. It reflects the
mathematical object the package is trying to implement: the category whose base
object is `Mark`, whose base admission carrier is `Utterance = (Token, Claim)`,
and whose base morphism is `articulate`.

Every exported class or function should eventually answer three questions:

- What is its domain?
- What is its codomain?
- How does it normalize back to Mark/Utterance/articulate?

If a symbol cannot answer those questions, it is probably implementation
furniture, a representation boundary, or in the wrong module.

The guide's free-data rules are especially strict here: arbitrary runtime data
belongs only inside `Mark` or at a representation boundary before a codec has
witnessed or rejected it. Core relating modules must work over carriers and
morphisms, and public morphisms must normalize back to
`Mark -> Utterance -> articulate`.

## Research Chain

The current research corpus gives the generator chain in categorical language:

```text
potential-aperiodic-articulation-cell
  --predicating-->
potential-transfinite-predication-cell
  --positing-->
potential-scott-continuous-posit-cell
  --settling-->
finite-settlement-cell
```

The schema descriptions are important:

- `predicating` is a morphism from a potential articulation cell plus a
  decomposition into a potential transfinite predication cell. It generates the
  transfinite predication category.
- `positing` is a morphism from a potential transfinite predication cell plus a
  posit into a potential Scott-continuous posit cell. It raises value through a
  knowledge-order join with evidence.
- `settling` is a morphism from a potential Scott-continuous posit cell into a
  finite settlement cell. It is a finite-step algebraic outcome when there is
  something to settle.

That chain should be the spine of the source tree.

The first on-disk spine now exists as categorical barrels:

```text
src/articulating/index.mts
src/articulating/predicating/index.mts
src/articulating/predicating/positing/index.mts
src/articulating/predicating/positing/settling/index.mts
```

These files currently re-export existing implementations. They are not the end
state; they are the public surface that lets implementation files migrate
symbol by symbol without lying about the package's containment structure.

## Current Implementation Buckets Are Not the Public Category

Several internal source directories are still implementation staging areas:

```text
algebra  -> foundational carriers, bilattice charge, predication, exact numbers
logic    -> bilattice linear logic and typed theory
topology -> admission, predication fiber, closure, settling, fixed points, reads
geometry -> spatial/temporal geometry of settled carriers
analysis -> spectral/evidence/differential/conservation reads
codecs   -> representation boundaries
scripts  -> callable boundary morphisms
```

That layout builds, but it is not the public category of relating. Public paths
must name actual categorical objects, morphism layers, generated structures, and
representation boundaries. Internal files may remain staging while public
exports move to the paths that state their domain and codomain.

## Target Reallocation

The user's proposed shift is the right pressure:

```text
current algebra   -> target topology
current topology  -> target logic
current topology  -> target geometry
current geometry  -> target analysis
```

Interpreted as module allocation:

| Current surface | Target role | Reason |
| --- | --- | --- |
| `algebra/utterance` | base topology of relating | `Mark`, `Token`, `Claim`, `Utterance`, and `articulate` are the base object, carrier, and morphism. They are not merely algebraic utilities. |
| `algebra/predication` | topology of predication objects | `Cell = E x Pi x E`, predication carriers, specialization, and coherence are object/cell-set structure produced by predicating. |
| `algebra/bilattice-charge` | logic/value object over positing | FOUR is the charge/value carrier used when evidence is posited and settled. It should not be an admission primitive. |
| `algebra/bilattice-relation` | logic/Chu-style relation object | Four-valued relations and adjoint transforms are logical relation structure, not basic data. |
| `algebra/exact-number`, `algebra/graded` | settling/analysis/arithmetic boundary | Exact arithmetic supports ranks, spectra, grading, and quantitative reads of settled extrema. It should sit where those reads need it, not as the root object layer. |
| `logic/*` | logic of consequence | These are already closer to the target logic layer, but they should be checked against the predicating/positing/settling chain. |
| `topology/meme-topology` | logic of induction/settling | `induce` and `extend` fold utterances through articulate -> predicate -> posit -> settle. This is the logical engine over the base topology. |
| `topology/predication-fiber`, `predication-valuation-*` | logic and geometry boundary | Fibers, sheaves, fixed points, and valuation closure express the internal geometry of the logic. Some should remain logic; some may become geometry. |
| `topology/predication-cohomology`, `predication-settling`, `ordinal-closure` | geometry of closure | Ordinal stages, cohomology, fixed-point gaps, and settling traces are geometric structure over the logical carrier. |
| `geometry/*` | analysis substrate | Current geometry already reads spatial/temporal structure of settled carriers. It likely belongs under analysis once topology and logic are separated properly. |
| `analysis/*` | analysis reads | Spectral, Laplacian, evidence, differential, and conservation reads are downstream projections over the geometric/logical carrier. |
| `codecs/*` | representation boundaries | Codecs are not the category's object hierarchy. They witness that a Mark or derived read can cross JSON, EAVT, HTML, TOML, Turtle, paths, or files. |
| `scripts/*` | callable morphism boundary | Scripts are the shell/API/MCP/importer callable surface over `(action, token, ?claim)`. |

## Proposed Future Shape

This is a target shape, not yet a completed move:

```text
src/
  topology/
    mark, token, claim, utterance, articulate
    predication object spaces and cell sets
  logic/
    predicating
    positing
    settling
    bilattice charge logic
    typed consequence
  geometry/
    fibers, sheaves, closure traces, ordinal stages
    cohomology and fixed-point-gap geometry
  analysis/
    exact arithmetic needed by reads
    spectral/evidence/differential/conservation projections
  codecs/
    JSON/EAVT/Datom/HTML/TOML/Turtle/path boundaries
  scripts/
    POSIX wrappers over articulate/predicate/posit/settle
```

The important part is not the folder names. The important part is that every
module boundary follows domain and codomain:

```text
Mark
  -> Utterance
    -> articulate
      -> predicating
        -> positing
          -> settling
            -> geometry of the settled carrier
              -> analysis reads
                -> representation boundaries
```

## Migration Rules

These are the package-specific form of the general category-theoretic Node
packaging rules.

1. Do not move a symbol because its current file name feels old.
2. Move a symbol only after identifying its domain, codomain, and normalization
   path back to Mark/Utterance/articulate.
3. Keep `Mark` arbitrary. A move must not introduce Mark payload inspection into
   the core.
4. Keep admission as Utterance. Subject/predicate/object terms are derived
   readings or predication-cell positions, not primitive input declarations.
5. Keep scripts uniform: every callable boundary morphism accepts
   `(token, ?claim)` and emits a boundary document, EAVT by default.
6. Keep codecs as representation witnesses, not mathematical object layers.
7. Treat public exports as categorical surfaces. If a symbol is not a domain,
   codomain, apex/extremum carrier, morphism, or representation boundary, do not
   export it.

## First Concrete Moves

The first safe moves are contract and surface moves:

- Rename the package identity to `@emsenn/relating`.
- Keep root import script-only.
- Keep `./topology/internal` package-local, not exported.
- Export the nested articulating/predicating/positing/settling barrels.
- Keep `src/algebra/index.mts` as an internal source barrel, not a package
  export, because `algebra` does not name the category's public object,
  morphism, closure, read, or representation boundary.
- Promote symbols from that internal source only through categorical surfaces
  that state their domain, codomain, and normalization path.

Actual file moves should begin only when tests can prove the old and new import
surfaces preserve the same carrier/morphism behavior.
