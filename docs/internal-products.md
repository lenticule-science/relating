# Internal Products

This package already contains several product-shaped surfaces. They are not
separate packages yet, and this document does not claim they are finished
commercial products. It names what is already real enough to explain, run, and
improve.

The phrase "product" here means "a coherent capability with public handles,
examples, and a verification story." It does not mean the surface has been split
into its own package or promised as a standalone business object.

## Typed Operation Substrate

The cross-cutting product is the operation substrate itself: carriers define the
objects, actions define typed morphisms, RMN can carry pure behavior as data, and
`induceBins` projects one registry to CLI, HTTP, OpenAPI, MCP, browser forms,
dispatch, and witnesses.

Public handles:

- carriers: `carrier`, `schemaCarrier`, `registeredCategory`
- actions: `action`, `actions`, `induceBins`, `dispatch`
- terms: `tm`, `evaluateRunTerm`, `isClosed`, `termSize`, `termUses`
- witnesses and projections: `witnessInvocation`, `projectFeedState`,
  `projectFeedContent`, `commitRecord`
- examples: `examples/action-apex.mjs`, `examples/operation-substrate.mjs`

Product reading: a package API does not have to begin as a bag of route handlers.
It can begin as a small typed category: objects, morphisms, pure term bodies where
possible, and boundary projections derived from the one registry.

Settling-substrate reading: the package should not be sold as "a relations
library" or "a route generator." The sharper product claim is that sparse
predications, FOUR-valued evidence, action witnesses, and content/state
projections can share one canonical substrate. The visible tools are lawful
shadows of that substrate, not separate implementations of graph database,
workflow engine, audit log, and content pipeline.

## Carrier Kernel

The carrier kernel is the object floor of the package. A carrier declaration is
one TypeBox schema value which also supplies the JSON Schema `$id`, Ajv
validator, process-local registry entry, and composition address.

Public handles:

- `carrier`, `schemaCarrier`
- `registeredCategory`
- `schemaRegistry`, `schemaId`
- `morphismCarrier`, `morphismSchemaCarrier`
- example: `examples/carrier-kernel.mjs`

Product reading: a schema-first category kernel for Node packages. It collapses
static type source, runtime validation, schema identity, and registry lookup into
one authored value. It is not the full transport system; it is the floor the
transport system stands on.

## Relational Descent Engine

The descent engine turns an admitted utterance into a settled relation:

```text
utter -> articulate -> predicate -> posit -> settle
```

Public handles:

- functions: `utterance`, `articulate`, `predicate`, `posit`, `settle`
- action verbs: `utter`, `articulate`, `predicate`, `posit`, `settle`,
  `induce-relation`
- example: `examples/descent.mjs`

Product reading: a tiny proof-producing relation engine. It admits two marks,
derives a predication site, admits evidence as value, settles the result, and
reads invariants of the settlement.

## FOUR Charge Algebra

The charge algebra is the package's paraconsistent value core. It carries the
knowledge and truth orders, joins/meets for both orders, negation, conflation,
and Lean-backed conformance vectors.

Public handles:

- `chargeValue`, `joinKnowledgeValue`, `meetKnowledgeValue`
- `joinTruthValue`, `meetTruthValue`
- `negateValue`, `conflateValue`
- `leqKnowledge`, `leqTruth`
- action verb: `conflate-charge`
- example: `examples/four-charge-algebra.mjs`

Product reading: a runtime algebra for contradiction-preserving evidence. It
does not collapse conflict; it keeps evidence-for and evidence-against together.

## Relation Matrix Carrier

The relation matrix surface materializes finite point/state relations with
FOUR-valued cells. Sparse duplicate cells join in the knowledge order, rows and
columns read as profiles, state extension reads truth-coordinate presence, and
`transpose`/`dual` expose the same Chu-style axis swap used in RelMath.

Public handles:

- `relationMatrix`, `matrixEntryReading`, `relationFromMatrix`
- `pointProfile`, `stateProfile`, `stateExtension`
- `transpose`, `dual`
- `checkRelationTransform`, `relationTransform`, `idTransform`,
  `composeTransforms`, `dualTransform`
- example: `examples/relation-matrix.mjs`

Product reading: a paraconsistent relation workbench small enough to be a Node
API. It is not a graph database, and it is not the full Lean Chu category
runtime; it is the carrier/operator layer for finite FOUR-valued relations and
their checked adjoint transforms.

## Spatial Geometry

The spatial geometry surface implements exact arithmetic in real quadratic
fields and finite one-dimensional cut-and-project model-set reads. It is exposed
under `@emsenn/relating/articulating` as `predicating.geometry.spatial`.

Public handles:

- `quadraticRational`, `quadraticFromInts`, `quadraticConjugate`,
  `quadraticCompare`
- `cutProjectScheme`, `latticeSite`, `physicalProjection`,
  `internalProjection`
- `acceptanceWindow`, `windowAcceptance`, `modelSet`, `restrictModelSet`
- `gapSpectrum`, `refutePeriod`
- example: `examples/spatial-geometry.mjs`

Product reading: exact aperiodic-order sampling for Node. It can build finite
model-set samples and read their gap words without leaving exact algebraic
coordinates. It is not a global aperiodicity prover or a general computational
geometry library; finite period refutations are reported as finite judgments.

## Formal Concept Analysis Terms

The FCA terms compute the Boolean Galois pair over predication-cell-shaped data:
subjects induce shared predicates, predicates induce matching subjects, and the
round trip closes an extent into a formal concept.

Public handles:

- root catalog: `fca`
- terms: `intentOfExtent`, `extentOfIntent`, `closeExtent`, `isConceptPair`,
  `formalConcept`
- subpath: `@emsenn/relating/expressing/evaluating/connecting`
- example: `examples/formal-concept-analysis.mjs`

Product reading: a concept-lattice workbench hiding inside the RMN runtime. It
lets packages compute concepts from sparse predication material without leaving
the package's total term substrate.

Verification reading: Lean proves the abstract Boolean FCA laws; the Node
surface is executable and checked by contract tests and examples, but it does
not yet have dedicated Lean-emitted golden vectors.

## Chu Space Terms

The Chu terms compute finite Chu-space operations over the FOUR charge algebra.
A space is encoded as `{ pts, r, sts }`; `r` is a flat FOUR-valued matrix of
`{ pt, st, charge }` entries.

Public handles:

- root catalog: `chu`
- terms: `dual`, `lookup`, `dualInvolution`
- subpath: `@emsenn/relating/expressing/evaluating/pairing`
- example: `examples/chu-spaces.mjs`

Product reading: finite linear-logic relation matrices as executable data. The
same paraconsistent FOUR charge core becomes the alphabet of a dualizable matrix
surface.

Verification reading: Lean proves the abstract Chu/FOUR dual-involution theorem
and related transform structure; the Node surface currently implements and tests
finite encoded `dual`, `lookup`, and `dualInvolution`, not the full Chu transform
category.

## Settlement Analysis Bench

The analysis surface reads settled or relation-shaped material into exact
carrier-valued analytical objects: natural numbers, rational quantities, integer
matrices, Laplacian graphs, spectral judgments, evidence distributions,
conservation witnesses, and charged differential findings.

Public handles:

- root namespace: `analysis`
- subpath: `@emsenn/relating/analysis`
- exact arithmetic: `count`, `successor`, `rational`, `determinant`,
  `charPoly`, `rank`
- graph/evidence reads: `relationGraph`, `laplacianOf`,
  `chargeDistribution`, `evidenceCoordinates`, `mixedness`
- example: `examples/settlement-analysis.mjs`

Product reading: an exact analysis bench for settled relation material. It is
not a general floating-point numerical library; it keeps results in the package's
carrier style so analytical facts can still be witnessed, serialized, projected,
and compared as data.

Verification reading: exact-number behavior is differentially checked by the
RMN term tests for `nat.count`/`successor`, and the broader surface is covered by
package typechecking and examples. It does not yet have Lean golden vectors for
every analysis function.

## Representation Codecs

The codec catalog is the package's representation-boundary kit. It admits and
projects values across JSON, JSONL, EAVT, schema assertions, Markdown, TOML,
Turtle, HTML/XML/SVG, paths, and HTTP-adjacent grammars without letting those
wire forms become the ontology of the package.

Public handles:

- `@emsenn/relating/codecs`
- canonical JSON: `canonical`, `parseJson`, `jsonProjector`, `jsonlProjector`
- schema traces: `unfoldSchema`, `projectSchemaAssertions`,
  `resolveJsonPointer`
- markdown projections: `createMarkdown`, `markdownDataform`,
  `markdownProjector`
- radial SVG: `projectRadial`, `radialProjector`, `radialFromValuation`,
  `radialFromClosureStages`
- example: `examples/representation-codecs.mjs`

Product reading: a standards-facing projection kit for the substrate. Downstream
packages can reuse the same canonical bytes, document cuts, trace rows, and SVG
vocabulary instead of reauthoring local serializers.

Verification reading: this surface is checked by representation contracts and
package tests, not by Lean golden vectors.

## RMN Term/Proof Kernel

Relation Model Notation is a JSON term language for pure morphism bodies. It
contains a CHL-style STLC core, domain primitives, structural operations, an
evaluator, and a decidable type checker for the CHL core.

Public handles:

- constructors: `ty`, `tm`
- reduction: `step`, `dev`, `evaluate`, `evaluateRunTerm`
- type checking: `hasTy`, `inferTy`, `checkTy`
- exported term catalogs: `descent`, `nat`, `settlingTerms`, `readerTerms`,
  `measurement`
- example: `examples/term-products.mjs`

Product reading: a portable morphism body format. An action can carry its logic
as data, so CLI, HTTP, MCP, tests, logs, and docs can inspect the same body.

## Lean Conformance Bridge

The conformance bridge is the package's proof-authority boundary. Lean emits
golden-vector rows for the finite law surfaces the Node package can compute, and
the package tests replay those rows through TypeScript and RMN.

Public handles:

- fixtures: `test/fixtures/lean-four-golden.jsonl`,
  `lean-chl-golden.jsonl`, `lean-domain-term-golden.jsonl`,
  `lean-measurement-golden.jsonl`
- Lean emitters: `lean/conformance/ConformanceVectors.lean`,
  `lean/conformance/MeasurementVectors.lean`
- test harness: `test/lean-conformance.test.mjs`
- example: `examples/lean-conformance.mjs`

Product reading: a small oracle bridge, not a blanket verification claim. FOUR
tables, CHL reduction samples, domain primitive reductions, and measurement
cores are checked against Lean-emitted rows. Carrier-specific descent and
serialization terms are checked against the real TypeScript operation and
canonical wire form because those carriers are package-specific Node artifacts.

## Action Apex

The action system registers operations once and projects them to several faces.

Public handles:

- `action`, `compose`, `composes`
- `actions`, the package's registered action list
- `induceBins`, `dispatch`
- `serve`, `routeRequest`
- OpenAPI, MCP, HTML form, and carrier-node projections under
  `@emsenn/relating/acting`
- example: `examples/action-apex.mjs`

Product reading: a transport generator for carrier morphisms. It is the place
where the package most visibly becomes "one object, many faces."

## Morphism Inspection

The inspection surface serializes an action declaration as a morphism carrier and
then reads that carrier through the package's own `inspect` action.

Public handles:

- `morphismCarrier`
- `actionIrAudit`, `freeTsActions`
- registered action verb: `inspect`
- example: `examples/morphism-inspection.mjs`

Product reading: operation review as data. A package can expose whether an
action is a carrier morphism or boundary, whether it carries an RMN body, and
which term constructors that body uses. This does not replace semantic
conformance tests; it gives docs, CI, and agent tooling a small common read over
the action substrate.

## Carrier Manifold

Carrier-node mounting serves package apices at carrier `$id` paths. It lets
several packages co-mount behavior at the same carrier node while preserving the
same OpenAPI/MCP/HTML/dispatch faces.

Public handles:

- `carrierNodeTree`
- `tileCarrierNodes`
- `routeCarrierManifold`
- `serveCarrierManifold`
- example: `examples/carrier-manifold.mjs`

Product reading: a namespace server for a category of typed data. Routes are not
chosen by controller names first; they are induced by the carrier identity a
morphism consumes.

## Holographic Witness Store

The holography/projecting surface turns append-only witness logs into current
state, records, and content-document cuts.

Public handles:

- `witnessObservation`
- `projectFeedState`
- `projectFeedContent`
- `appendWitnesses`, `readWitnessLog`, `commitRecord`
- `readContentResource`, `listContentEntries`, `readContentTree`

Product reading: a small event-sourcing and content projection kernel in the
package's own vocabulary. It is effectful only at the store binding; the
projection morphisms are ordinary data transformations.

This is also the package's most practical coordination story for agent systems:
agents should leave typed traces in a shared substrate, then read projected
state, instead of passing ever-growing conversational context to each other.

## Frontier Product Candidates

These are visible in Lean/content but should not be documented as package
features until their Node carriers/actions exist:

- aperiodic-regime and universality tools
- richer sheaf/cohomology calculators beyond the current settlement readers
- Collatz closure settlement material
- value-category-parametric settling beyond the implemented FOUR/reader surface
- a packaged proof-tree cockpit that binds RelMath, TypeDoc, action discovery,
  and examples into one browsable artifact
