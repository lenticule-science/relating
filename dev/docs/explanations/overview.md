# Overview: what @emsenn/relating models

This is an explanation, not a tutorial. It describes the domain the package
operationalizes, the responsibility of each module subpath, how the subpaths
depend on one another, and the mental model a reader needs before using any of
the named exports.

## The domain

`@emsenn/relating` is the relational substrate, operationalized as one
package. It is a paraconsistent, transfinitely-valued linear logic of relations.
Three words in that sentence carry the whole model:

- Relational. The thing being computed over is a relation between terms - a
  cell `Cell = E x Pi x E` (subject, predicate, object). Nothing has a value on
  its own; values live on relations.
- Paraconsistent. A relation is not true-or-false. Its standing is a bilattice
  charge - a point with two axes (knowledge and truth). Contradiction is a
  representable value, not an error: a cell can be both affirmed and denied
  (absurd) and the engine keeps computing.
- Transfinitely-valued. Settling a body of evidence is a closure that runs to a
  fixed point, and that closure is indexed by ordinals - finite, omega, omega
  squared - so a settling that does not stabilize in finitely many steps still
  has a defined limit.

The one admission rule frames everything else: evidence enters only by
articulating utterances. There is no verb that admits a charge, a polarity, or
a denial directly. Charges, edges, sections, and contradictions are all derived
by folding an utterance log through the descent
`articulate -> predicate -> posit -> settle` into a frozen carrier, then reading
the carrier's fixed-point sections. If you want to change what the system
believes, you add an utterance; you never write a charge.

## The mental model

1. You build utterances (the only input).
2. You `induce`/`extend` them into a frozen `MemeTopologyCarrier`. This runs the
   descent: articulate the marks, predicate them into cells, posit them into a
   valuation fiber, and settle that fiber to its fixed points under ordinal
   closure.
3. You read the carrier. Reads are pure projections of the four fixed-point
   sections (knowledge/truth, least/greatest); everything legible is a function
   of the settled carrier, never a side channel.

Exactness is a through-line invariant. Distributions are histograms over a
canonical support, spectra are exact polynomials, divergences are charges - not
floats. Where two things are genuinely incomparable, the package returns an
explicit judgment object rather than collapsing to a number.

## The modules and what each owns

The former `meme-*` libraries are now subpaths of this one package. Each
exported subpath is a flat symbol surface. The root package is reserved for the
callable script morphism surface.

### ./algebra - the algebraic substrate

The foundation: pure structure and operation, no settling and no closure
engine. It owns:

- bilattice charges and the binary relations on charge (the knowledge and truth
  orders, joins/meets, negation, conflation);
- exact arithmetic, layered Natural -> Rational -> Matrix;
- predication (cells `E x Pi x E`), coherence, and specialization;
- the initial articulation objects - marks, tokens, claims, utterances - and
  their identity judgments.

A token mark valued `{ subject, object }` articulates a relational cell; a
relational claim of the specialization concept also installs the specialization
edge. These are the rich primitives; everything downstream is derived from them.

### ./logic - bilattice linear logic

The logical layer: pure consequence structure, again with no settlement, no
sheaf construction, no closure engine. It owns the linear connectives over the
bilattice - fusion (tensor), residuum (implication), par, negation - and the
typed theory on top: inference rules, derivations, typing judgments, and
predicate words.

### ./topology - the inductive carrier and the settling engine

The center of the package. `induce`/`extend` fold an utterance log through the
descent into a frozen `MemeTopologyCarrier`; the section reads render any of the
four fixed-point sections. This subpath owns the curated app surface for the
whole settling story: admission (`normalizeUtterance`), construction (`posit`,
presheaf/sheaf from valuation), fixed points (`knowledgeLeastFixedPoint` and the
other three extrema, plus gap reads), reading (`readCharge`, information
entries), the section layer (`sectionOf`, `partitionSection`, `topologyVitals`),
the charge-value boundary, numbers at the edge, and utterance-log persistence
(`dehydrateUtterances`/`rehydrateUtterances`).

Three further engine surfaces hang off it:

- `./topology/dynamics` - ordinal closure, valuation closure, settling, firing,
  cohomology, consistency, and the fixed-point gap.
- `./topology/arithmetic` - substitution dynamics (substitution rules, orbits,
  abelianization, gauge labelings, induced permutations). Note that exact
  arithmetic itself lives in `./algebra`, and spectral analysis lives in
  `./analysis`; this subpath is specifically substitution dynamics.
The package-local `./topology/internal.mjs` barrel is the engine, not the
contract. Everything in every module is reachable from there, including
plumbing the curated barrels withhold (coincidence booleans, carrier assembly
constructors, closure-engine internals, unspecified modal operators, and
set-encoding internals). It is intentionally not a package export; needing it
from outside the package means a carrier or morphism should be promoted to a
real public subpath.

### ./geometry - the spatial and temporal geometry of a settling

- Spatial: exact arithmetic in real quadratic fields and one-dimensional
  cut-and-project schemes over Z^2. Quadratic rationals are the minimal
  coordinate system in which irrational slopes are exactly decidable.
- Temporal: the causal order of a settling. Time is the settling itself; space
  is the predication base. The causal order proves - does not interpret - that
  a settling has Lorentzian-like causal structure.

### ./analysis - the spectral geometry of carriers

Takes a `MemeTopologyCarrier` as input and computes the combinatorial Laplacian
on the relation graph of a section: terms are vertices weighted by cell
multiplicity, yielding exact harmonic modes, component count, characteristic
polynomial, and spanning-tree count (Matrix-Tree). It also exposes evidence
readings and `./analysis/differential` - measuring a subject against a
descriptive control catalog, reading each norm as a bilattice charge (potential
holds, active diverges, stable contested, absurd no-evidence) rather than as
pass/fail.

### ./codecs - the serialization-boundary codec

Standalone (uses `node:path` only). It is the codec between an addressable term
and a byte-safe filesystem address/path: `termKey`, `sanitizeSegment`/
`desanitizeSegment`, `address`/`termOf`, `logPath`, and the
namespace/compose/decompose helpers. Two carrier-bearing subpaths build on it:

- `./codecs/html` - the Semantic Hypertext Packet (SHP) codec, a carrier<->HTML
  holography projector (`project` writes cells to HTML, `markup` reads HTML back
  to charged cells, `htmlProjector` binds both).
- `./codecs/resource` - a typed-resource lattice, a restriction tower of
  holography projectors from `path` down through `file`, `flatfile`, `json`,
  `jsonl` to the carrier-bearing `datom`/`eavt` leaves.

### ./holography - the projection kernel

The substrate the codecs specialize. A `Projector<T>` reads a boundary
`Resource` (a path plus its content) into carried items of type `T` and writes
them back; a type is DEFINED by these morphisms (Yoneda), not by a folder.
`restrict` composes a child whose recognition entails the parent's
(`recognize_child = recognize_parent and local`, Curry-Howard directionality);
`classify` derives a resource's most specific type. The kernel imports nothing
and does not name the relational carrier - a relational carrier is the natural
`T`, but the kernel stays generic.

## How the modules depend on each other

Relative imports only - within the package, a module never imports
`@emsenn/relating/*`, only sibling `.mjs` paths.

```
algebra        foundation, depends on nothing
logic       -> algebra
topology    -> algebra, logic
geometry    -> algebra, topology
analysis    -> algebra, topology
holography     imports nothing (generic kernel)
codecs         standalone (node:path); ./codecs/html and ./codecs/resource
               build on holography (and on algebra for the carrier-bearing leaves)
```

The dependency direction is the meaning: structure (algebra) before consequence
(logic) before settling (topology) before the geometry, analysis, and codecs
that read a settled carrier.

This overview describes the current source layout. The intended reallocation
toward the category of relating is tracked in
`dev/docs/explanations/category-of-relating.md`.

## Why "no I/O it was not handed"

The package performs no I/O it was not given. fetch, clock, and fs all enter as
values. A holography `Resource` is a path plus already-loaded content - the
projector does not open files. The codec computes a path string; it does not
write to it. This is what makes a settling a pure function of its utterance log,
and it is why the model can promise that every legible read is a function of the
frozen carrier.
