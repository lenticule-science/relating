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
  `projectFeedRecord`, `projectFeedContent`
- examples: `examples/action-apex.mjs`, `examples/operation-substrate.mjs`

Product reading: a package API does not have to begin as a bag of route handlers.
It can begin as a small typed category: objects, morphisms, pure term bodies where
possible, and boundary projections derived from the one registry.

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

Product reading: a runtime algebra for contradiction-preserving evidence. It
does not collapse conflict; it keeps evidence-for and evidence-against together.

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

## Carrier Manifold

Carrier-node mounting serves package apices at carrier `$id` paths. It lets
several packages co-mount behavior at the same carrier node while preserving the
same OpenAPI/MCP/HTML/dispatch faces.

Public handles:

- `carrierNodeTree`
- `tileCarrierNodes`
- `routeCarrierManifold`
- `serveCarrierManifold`

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

## Frontier Product Candidates

These are visible in Lean/content but should not be documented as package
features until their Node carriers/actions exist:

- aperiodic-regime and universality tools
- richer sheaf/cohomology calculators beyond the current settlement readers
- Collatz closure settlement material
- value-category-parametric settling beyond the implemented FOUR/reader surface
- a packaged proof-tree cockpit that binds RelMath, TypeDoc, action discovery,
  and examples into one browsable artifact
