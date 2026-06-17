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
- `@emsenn/relating/articulating/predicating/geometry`
- `@emsenn/relating/articulating/predicating/geometry/spatial`
- `@emsenn/relating/articulating/predicating/typed-theory`
- `@emsenn/relating/articulating/predicating/positing`
- `@emsenn/relating/articulating/predicating/positing/logic`
- `@emsenn/relating/articulating/predicating/positing/settling`
- `@emsenn/relating/articulating/predicating/positing/settling/analysis`
- `@emsenn/relating/articulating/predicating/positing/settling/analysis/arithmetic`
- `@emsenn/relating/articulating/predicating/positing/settling/geometry`
- `@emsenn/relating/articulating/predicating/positing/settling/geometry/temporal`
- `@emsenn/relating/analysis`
- `@emsenn/relating/analysis/conservation`
- `@emsenn/relating/analysis/differential`
- `@emsenn/relating/analysis/evidence`
- `@emsenn/relating/analysis/laplacian`
- `@emsenn/relating/analysis/spectral`
- `@emsenn/relating/codecs`
- `@emsenn/relating/codecs/exact-number`
- `@emsenn/relating/codecs/html`
- `@emsenn/relating/codecs/resource`
- `@emsenn/relating/codecs/toml`
- `@emsenn/relating/codecs/turtle`
- `@emsenn/relating/holography`

## Root

The root entry is the ordinary public package API. It rolls up public carrier
constructors, carrier types, readers, and morphisms from the categorical module
indexes, and also exposes the callable script morphism registry:

```ts
export {
  mark,
  utterance,
  cell,
  chargeValue,
  induce,
  sectionOf,
  evalRelation,
  scriptActions,
  scriptMorphisms,
} from "@emsenn/relating";
```

Use explicit subpaths only when you intentionally depend on a module boundary.
`@emsenn/relating/topology` is not a package export; settlement and closure APIs
live under the settling module chain and roll up through root.

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
