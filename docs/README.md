# Relating User Docs

These docs are for users of `@emsenn/relating`: downstream packages, scripts, and
services that need to declare carriers, register morphisms, dispatch actions, or
project resources.

Start here:

- [Getting started](getting-started.md) walks through a carrier and action.
- [What This Package Is](what-this-package-is.md) explains the RelMath/content
  descent this Node package is projecting.
- [Internal products](internal-products.md) names the product-shaped surfaces
  already present in the package.
- [Carrier kernel](carrier-kernel.md) explains the single-source object and
  schema-registry floor.
- [Operation substrate](operation-substrate.md) explains the carrier/action/RMN
  shape behind the smallest behavior-as-data example.
- [Morphism inspection](morphism-inspection.md) explains how serialized action
  declarations can be inspected through the package's own action apex.
- [Witness projection](witness-projection.md) explains the append-only
  observation log, current state view, and content-document cut.
- [API surface](api-surface.md) explains the public subpaths and what each owns.
- [Action apex](action-apex.md) explains how one action family projects to CLI,
  HTTP, OpenAPI, MCP, forms, witnesses, and carrier-node mounts.
- [Carrier manifold](carrier-manifold.md) explains carrier `$id` namespace
  mounting for action apices.
- [FOUR charge algebra](four-charge-algebra.md) explains the paraconsistent
  value core and its two orders.
- [Dihedral gauge](dihedral-gauge.md) explains the D4 symmetry surface generated
  by the FOUR gauge and the order-swap between knowledge and truth order.
- [Relation matrix](relation-matrix.md) explains finite FOUR-valued relation
  matrices, profile reads, duality, and checked transforms.
- [Spatial geometry](spatial-geometry.md) explains exact quadratic-field
  cut-and-project model-set samples.
- [Formal Concept Analysis](formal-concept-analysis.md) explains the executable
  FCA Galois pair over predication-cell-shaped data.
- [Chu spaces over FOUR](chu-spaces.md) explains finite Chu-space duality as
  executable RMN terms over the FOUR charge algebra.
- [Settlement analysis](settlement-analysis.md) explains exact analytical reads
  over settlement and evidence carriers.
- [Representation codecs](representation-codecs.md) explains the JSON, schema,
  markdown, RDF/text, and radial SVG boundary surfaces.
- [Lean conformance](lean-conformance.md) explains which package surfaces are
  checked against Lean-emitted golden vectors.
- [CLI and server](cli-and-server.md) shows the executable boundary.
- [Term IR](term-ir.md) explains when to use `runTerm` and how it relates to
  ordinary TypeScript functions.
- [Examples](examples.md) maps the runnable example files to the package surfaces.

The shortest rule: import through the package `exports` map, declare data as
carriers, write carrier-to-carrier behavior as `runTerm` when possible, and let
the boundary project the same action to the needed transport.
