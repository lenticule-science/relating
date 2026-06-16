# @emsenn/relating — API reference

This reference is intentionally small until the package has an in-repo API
reference generator again. Do not paste stale generated signatures here:
incorrect public-surface docs are worse than no generated reference.

## Public Surface

The package `exports` map is the contract. Exported subpaths name categorical
carriers, extrema/apex surfaces, morphisms, and representation boundaries.

- `@emsenn/relating`
- `@emsenn/relating/scripts`
- `@emsenn/relating/articulating`
- `@emsenn/relating/articulating/predicating`
- `@emsenn/relating/articulating/predicating/positing`
- `@emsenn/relating/articulating/predicating/positing/settling`
- `@emsenn/relating/algebra`
- `@emsenn/relating/logic`
- `@emsenn/relating/topology`
- `@emsenn/relating/topology/dynamics`
- `@emsenn/relating/topology/arithmetic`
- `@emsenn/relating/geometry`
- `@emsenn/relating/analysis`
- `@emsenn/relating/analysis/differential`
- `@emsenn/relating/codecs`
- `@emsenn/relating/codecs/html`
- `@emsenn/relating/codecs/resource`
- `@emsenn/relating/codecs/toml`
- `@emsenn/relating/codecs/turtle`
- `@emsenn/relating/holography`

## Root

The root entry exports only the callable script morphism surface:

```ts
export {
  evalRelation,
  scriptActions,
  scriptMorphisms,
  type BoundaryDocument,
  type EvaluateOptions,
  type PackageExports,
  type ScriptAction,
  type ScriptMorphism,
  type ScriptMorphismRegistry,
} from "@emsenn/relating";
```

Carrier modules are available through their explicit package subpaths, not as
root namespaces. This keeps root TypeScript importers aligned with shell,
OpenAPI, and MCP callers: the root is the script morphism surface.

## Scripts

The script subpath is the uniform callable morphism surface for shell, API,
OpenAPI, and MCP adapters:

```ts
export type ScriptAction = "scripts.settle" | "scripts.read" | "scripts.compare";

export type BoundaryDocument = string;

export type ScriptMorphism = (
  tokenDocument: BoundaryDocument,
  claimDocument: BoundaryDocument | undefined,
  options: EvaluateOptions,
) => BoundaryDocument;

export type ScriptMorphismRegistry = {
  readonly [action in ScriptAction]: ScriptMorphism;
};

export declare const scriptActions: readonly ScriptAction[];
export declare const scriptMorphisms: ScriptMorphismRegistry;

export declare function evalRelation(
  tokenDocument: BoundaryDocument,
  claimDocument: BoundaryDocument | undefined,
  options: EvaluateOptions,
): BoundaryDocument;
```

Each script morphism accepts a decoded boundary document for the token and an
optional decoded boundary document for the claim. Here `string` means the
POSIX/API/MCP byte stream after the executable or adapter decodes it, usually as
UTF-8. It does not mean the relational Mark payload is a string.

The default transport is EAVT/Datom at the executable boundary; the library does
not read stdin, open files, or consult the clock.

## Mark

`Mark` is the only package carrier whose payload is arbitrary:

```ts
export class Mark {
  readonly kind: "utterance.mark";
  readonly value: unknown;
  constructor(value: unknown);
}

export declare function mark(value: unknown): Mark;
```

Core relating code must not compare or inspect arbitrary Mark payloads.
Representation boundaries such as JSON, EAVT, HTML, TOML, or Turtle may inspect
a payload only to prove it inhabits that boundary's carrier.

## Boundary Discipline

Generated API docs must preserve these invariants:

- no `unknown` outside `Mark`;
- no public helper names that bypass `(action, token, ?claim)`;
- no claim that JSON is the Mark carrier;
- no subject/predicate/object declarations as primitive admissions;
- no I/O in importable modules unless the I/O handle is supplied as a value.
