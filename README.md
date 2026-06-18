# @emsenn/relating

Relating is a paraconsistent, transfinitely-valued linear logic of relations, exposed as categorical TypeScript surfaces and POSIX-pipeable JSON-resource morphisms.

This package is early alpha.
It is installable and buildable as a standalone package, but it is marked `private` and `UNLICENSED`; it is not prepared for public npm publication.

## Requirements

- Node.js `>=22.18`
- A package manager that installs npm dependencies.
  The examples below use pnpm; the package scripts also run under `npm run`.

## Install from a downloaded copy

From a source checkout:

```sh
pnpm install
pnpm run verify
```

The same package scripts can be run through npm:

```sh
npm install
npm run verify
```

`verify` typechecks the package and builds `dist`.
The build is intentionally self-contained: it uses this package's local `tsconfig.json` and emits the native NodeNext boundary directly (`.mjs` plus `.d.mts` from `.mts` sources), not files or declaration shims from a parent workspace.

To test the install artifact:

```sh
pnpm run verify
pnpm pack --pack-destination /tmp
npm install /tmp/emsenn-relating-0.0.0.tgz
```

`pack` runs the package's `prepack` script, so the tarball rebuilds `dist` before selecting files.
This protects the install artifact from stale or missing build output.

## Import surface

The import surface is categorical.
Exported modules expose the classes that serve as domains and codomains of the apex and extrema in the relating category; the executable/script surface exposes callable morphisms over those same carriers.
Programmatic consumers that want the shell/API/MCP behavior should use the same public morphisms as the bins:

```ts
import { articulate, predicate, posit, settle } from "@emsenn/relating";
```

The EAVT/Datom JSON codecs are available for transport adapters:

```ts
import { parseLines, toEavt } from "@emsenn/relating/codecs/path/object/attribute/file/flatfile/serialization/json/jsonl/eavt";
```

Do not import from `dist` directly or from implementation modules that are not listed in `package.json` `exports`.

## Public subpaths

The export map is the public categorical surface:

- `@emsenn/relating`

Transport adapters should use:

- `@emsenn/relating/codecs`
- `@emsenn/relating/codecs/path`
- `@emsenn/relating/codecs/path/object/attribute/file/flatfile/serialization/json`
- `@emsenn/relating/codecs/path/object/attribute/file/flatfile/serialization/json/schema`
- `@emsenn/relating/codecs/path/object/attribute/file/flatfile/serialization/json/jsonl`
- `@emsenn/relating/codecs/path/object/attribute/file/flatfile/serialization/json/jsonl/eavt`
- `@emsenn/relating/codecs/path/object/attribute/file/flatfile/serialization/json/jsonl/eavt/triple`
- `@emsenn/relating/codecs/path/object/attribute/file/flatfile/serialization/json/jsonl/datom`
- `@emsenn/relating/codecs/path/object/attribute/file/flatfile/text/markdown`
- `@emsenn/relating/codecs/path/object/attribute/file/flatfile/serialization/toml`
- `@emsenn/relating/codecs/path/object/attribute/file/flatfile/serialization/turtle`

The package also exports carrier/morphism class subpaths such as `./analysis/evidence`, `./analysis/laplacian`, `./analysis/spectral`, `./articulating/predicating/typed-theory`, `./articulating/predicating/geometry/spatial`, `./articulating/predicating/positing/logic`, `./articulating/predicating/positing/settling/analysis`, and `./codecs/html`.
Those exports are not a separate "research" contract; they are the exposed domain/codomain classes and boundary codecs that the script morphisms act over.
Adding or removing one should be justified by whether it names a real carrier, extremum, apex, morphism-generated structure, or representation boundary in the category of relating.

The first nested categorical surface is also exported:

- `@emsenn/relating/articulating`
- `@emsenn/relating/articulating/predicating`
- `@emsenn/relating/articulating/predicating/positing`
- `@emsenn/relating/articulating/predicating/positing/settling`

These are currently barrels over the older implementation files.
They mark the intended containment chain on disk before the implementation files are moved symbol by symbol.

The root import is the ordinary public package API.
It rolls up public carrier constructors, carrier types, readers, and morphisms from those module indexes.
Import categorical subpaths only when you intentionally depend on that module boundary.

## Runtime discipline

The library performs no I/O it was not handed.
Fetching, clocks, filesystem reads, and filesystem writes belong at the caller boundary.
Relating functions operate over values you pass in and return values for you to persist or project.

The command-line tools are pipeable wrappers around relating morphisms.
The descent scripts read one boundary document from stdin and emit the next carrier:

- `articulate-utterance`
- `predicate-articulation-cell`
- `posit-predication-site`
- `settle-posit-presheaf`

The settlement-filtration read scripts read a `SettlementFiltration` JSON resource from stdin and emit the named read:

- `read-increments-of-settlement-filtration`
- `read-firings-of-settlement-filtration`
- `read-limit-stages-of-settlement-filtration`
- `read-non-scott-firings-of-settlement-filtration`
- `read-first-cohomology-of-settlement-filtration`
- `read-closure-invariant-of-settlement-filtration`
- `read-graded-gap-of-settlement-filtration`
- `read-graded-gap-first-cohomology-rank-identity-of-settlement-filtration`
- `read-classification-of-settlement-filtration`
- `read-depth-of-settlement-filtration`
- `read-depth-finite-stage-judgment-of-settlement-filtration`
- `read-firing-events-of-settlement-filtration`
- `read-causal-order-of-settlement-filtration`

The package-root `scripts/` directory owns these executable wrappers.
They perform stdin/stdout boundary work only, then call the package morphisms.

In the TypeScript API, the script input/output type is a decoded boundary document.
It is represented as `string` because Node or the adapter has decoded the POSIX/API/MCP byte stream, not because relational Marks are strings.

## Developer notes

Tests are theorem-shaped: the test name is the claim the test proves.

Run before handing off:

```sh
pnpm run verify
pnpm run test
```

For deeper docs, see:

- `dev/docs/explanations/overview.md`
- `dev/docs/explanations/category-of-relating.md`
- `dev/docs/guides/category-theoretic-node-packaging.md`
- `dev/docs/guides/best-practices.md`
- `dev/docs/references/api.md`
