# Relating User Docs

These docs are for users of `@emsenn/relating`: downstream packages, scripts, and
services that need to declare carriers, register morphisms, dispatch actions, or
project resources.

Start here:

- [Getting started](getting-started.md) walks through a carrier and action.
- [What This Package Is](what-this-package-is.md) explains the RelMath/content
  descent this Node package is projecting.
- [Agency architecture](agency-architecture.md) climbs the whole faculty family
  from one action up through capability, faculty, face, edge, bulk, and boundary.
- [Internal products](internal-products.md) names the product-shaped surfaces
  already present in the package.
- [Carrier kernel](carrier-kernel.md) explains the single-source object and
  schema-registry floor.
- [Schema realization](schema-realization.md) explains the forgetful projection
  from JSON Schema predicates into structural TypeScript-shaped data.
- [Operation substrate](operation-substrate.md) explains the carrier/action/RMN
  shape behind the smallest behavior-as-data example.
- [Morphism inspection](morphism-inspection.md) explains how serialized action
  declarations can be inspected through the package's own action apex.
- [Witness projection](witness-projection.md) explains the append-only
  observation log, current state view, Datom record tier, and content-document
  cut.
- [Scripted invocation witnesses](scripted-invocation-witnesses.md) explains
  the one-EAVT-row trace written by dispatched CLI/HTTP/MCP/form plays.
- [API surface](api-surface.md) explains the public subpaths and what each owns.
- [Action apex](action-apex.md) explains how one action family projects to CLI,
  HTTP, OpenAPI, MCP, forms, witnesses, and carrier-node mounts.
- [Graded wire codecs](wire-codecs.md) explains the finite stdin/stdout wire
  vocabulary, projector-derived corners/rungs, and HTTP output negotiation.
- [Action knowledge vault](action-knowledge-vault.md) explains the MCP
  tools/resources/prompts projection of one induced action apex.
- [Operations manifold topology](operations-manifold.md) explains action-family
  carrier extrema, local composition edges, cross-package graph edges, and
  frontier reads.
- [Carrier manifold](carrier-manifold.md) explains carrier `$id` namespace
  mounting for action apices.
- [FOUR charge algebra](four-charge-algebra.md) explains the paraconsistent
  value core and its two orders.
- [Bigraded settling cohomology](bigraded-settling-cohomology.md) explains the
  current FOUR-census read into truth and contradiction rows.
- [Dihedral gauge](dihedral-gauge.md) explains the D4 symmetry surface generated
  by the FOUR gauge and the order-swap between knowledge and truth order.
- [Diataxis FOUR read](diataxis-four.md) explains tutorial / how-to /
  explanation / reference as a value-level read over the package FOUR charge
  square.
- [Relation matrix](relation-matrix.md) explains finite FOUR-valued relation
  matrices, profile reads, duality, and checked transforms.
- [Spatial geometry](spatial-geometry.md) explains exact quadratic-field
  cut-and-project model-set samples.
- [Typed theory consequence](typed-theory-consequence.md) explains finite
  derivation search, closure, and predicate-word residue over predication data.
- [Predication fiber logic](predication-fiber-logic.md) explains finite
  FOUR-valued predicate fibers, cellwise linear fusion/residuum, and generator
  preservation checks.
- [Formal Concept Analysis](formal-concept-analysis.md) explains the executable
  FCA Galois pair over predication-cell-shaped data.
- [Chu spaces over FOUR](chu-spaces.md) explains finite Chu-space duality as
  executable RMN terms over the FOUR charge algebra.
- [Settlement analysis](settlement-analysis.md) explains exact analytical reads
  over settlement and evidence carriers.
- [Fixed-point topology](fixed-point-topology.md) explains knowledge/truth
  least/greatest fixed points, gaps, section reads, and topology vitals.
- [Firing causality](firing-causality.md) explains charge-valued firing
  cohomology, firing-orbit reads, finite causal order, cones, spacelike/timelike
  separation, and exact ordering fractions.
- [Closure regime workbench](closure-regime.md) explains the bounded ordinal
  closure engine and its finite / Scott / transfinite regime reads.
- [Learning depth](learning-depth.md) explains rote / automatization /
  conceptual-change / adaptive-expertise as a read over closure-regime data.
- [Observed learning cycle](learning-cycle.md) explains ascent and
  nontrivial-return reads over a closure carrier's recorded orbit.
- [Value-category settling](value-category-settling.md) explains finite/sample
  law judgments for `V`-parametric settling over Boolean and FOUR examples.
- [Optimization settling](optimization-settling.md) explains optimization as
  value-category settling: measure, constraints, improvement, optimum, and
  fixed-point witnesses.
- [Probability and stochastic settling](probability-stochastic-settling.md)
  explains finite counting-measure probability, conditioning as reindexing, and
  Markov stationarity as a settling fixed point.
- [Substitution dynamics](substitution-dynamics.md) explains the finite
  substitution-rule, incidence-matrix, and step-N recurrence workbench.
- [Representation codecs](representation-codecs.md) explains the JSON, schema,
  markdown, RDF/text, and radial SVG boundary surfaces.
- [Relational HTML](relational-html.md) explains the RMN-only executable HTML
  gate for documents and open message streams.
- [Holography projector lattice](projector-lattice.md) explains resource
  recognition, restriction, entailment, and deepest-projector classification.
- [Radial SVG projection](radial-svg-projection.md) explains charged
  predication valuation to deterministic self-describing SVG.
- [HTTP boundary codecs](http-boundary-codecs.md) explains the pure HTTP field,
  negotiation, cookie, stream-frame, and MCP-envelope representation surface.
- [Running HTTP app](running-http-app.md) explains the small HTTP app object
  language for representations, resources, body readers, `.well-known`
  resources, and projected SSE events.
- [Runtime transport work](runtime-transport-work.md) explains request/response,
  event stream, bounded claim session, and conflicted/open session as the four
  work types of the runtime boundary.
- [Lean conformance](lean-conformance.md) explains which package surfaces are
  checked against Lean-emitted golden vectors.
- [CLI and server](cli-and-server.md) shows the executable boundary.
- [Term IR](term-ir.md) explains when to use `runTerm` and how it relates to
  ordinary TypeScript functions.
- [Carrier-term projection](carrier-term-projection.md) explains the
  deterministic bridge between JSON carrier values and RMN value terms.
- [Settlement reader terms](settlement-reader-terms.md) explains the `read .
  free` RMN catalog over settlement-filtration generators.
- [Examples](examples.md) maps the runnable example files to the package surfaces.

The shortest rule: import through the package `exports` map, declare data as
carriers, write carrier-to-carrier behavior as `runTerm` when possible, and let
the boundary project the same action to the needed transport.
