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
- [Operation substrate](operation-substrate.md) explains the carrier/action/RMN
  shape behind the smallest behavior-as-data example.
- [API surface](api-surface.md) explains the public subpaths and what each owns.
- [Action apex](action-apex.md) explains how one action family projects to CLI,
  HTTP, OpenAPI, MCP, forms, witnesses, and carrier-node mounts.
- [CLI and server](cli-and-server.md) shows the executable boundary.
- [Term IR](term-ir.md) explains when to use `runTerm` and how it relates to
  ordinary TypeScript functions.
- [Examples](examples.md) maps the runnable example files to the package surfaces.

The shortest rule: import through the package `exports` map, declare data as
carriers, write carrier-to-carrier behavior as `runTerm` when possible, and let
the boundary project the same action to the needed transport.
