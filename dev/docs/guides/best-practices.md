# Best practices: consuming @emsenn/relating

The package `exports` map is categorical: exported modules should name the
classes that serve as domains and codomains of the apex and extrema in the
category of relating, plus the representation boundaries that carry them.
Consumers should see the same morphism surface whether they are shell users,
API users, MCP users, or TypeScript importers.

## Import the Script Surface

Use the root package or `./scripts` for the public morphisms:

```ts
import { evalRelation, scriptActions, scriptMorphisms } from "@emsenn/relating";
import { evalRelation as evalRelationFromScripts } from "@emsenn/relating/scripts";
```

These morphisms are pure boundary-document-in/boundary-document-out operations
over the same formats the bins speak. In TypeScript the boundary document is a
`string` because Node or the adapter has decoded the POSIX/API/MCP byte stream,
usually as UTF-8. That does not make a Mark payload a string. The morphisms do
not read files, touch stdin/stdout, fetch, or consult the clock. Callers provide
already-read boundary documents and an explicit timestamp value. The finite
`scriptActions` list is the callable action vocabulary for shell/API/MCP
adapters.

Use the EAVT/Datom resource codec when building a transport adapter:

```ts
import { parseLines, toEavt, serialize, type EAVT } from "@emsenn/relating/codecs/resource";
```

Do not import from `dist` directly or from implementation subpaths that are not
listed in `package.json` `exports`.

## Public Subpaths

The export map is the public categorical surface. The callable shell/API/MCP
morphism surface is the script-facing part of it:

- `@emsenn/relating`
- `@emsenn/relating/scripts`

The transport boundary is:

- `@emsenn/relating/codecs/resource`

The topology, generated-logic, generated-geometry, analysis, codec, and
holography exports are not a separate "research" contract. They are exported
when they name domain/codomain classes, extrema/apex carriers, generated
structures, morphism families, or representation boundaries used by the
category of relating. They are not automatically callable script actions; to
become shell/API/MCP-callable, a function must be registered as a morphism with
the `(action, token, ?claim)` shape.

Prefer the nested relating surfaces for new categorical imports:

```ts
import { articulate, mark, utterance } from "@emsenn/relating/articulating";
import { predicate } from "@emsenn/relating/articulating/predicating";
import { posit } from "@emsenn/relating/articulating/predicating/positing";
import { informationDistribution } from "@emsenn/relating/analysis/evidence";
import { substitutionCarrier } from "@emsenn/relating/topology/dynamics/substitution";
```

Import those categorical surfaces from their explicit subpaths, not from the
root package. The root package is reserved for the callable script morphism
surface so TypeScript importers see the same default surface as shell/API/MCP
callers.

## Executable Wrappers

The three bins are executable wrappers around `@emsenn/relating/scripts`:

- `eval-relation`
- `relating-read`
- `relating-compare`

The wrappers own stdin/stdout, path arguments, and default clock stamps. The
script subpath owns the pure callable morphism. This keeps shell,
HTTP/OpenAPI, MCP, and TypeScript importers on the same EAVT/Datom transport
when they choose that boundary.

## Standalone Package Boundary

`@emsenn/relating` must build from its own directory, without assuming it
lives inside the larger workspace. The local `tsconfig.json` carries the
package's strict compiler options directly, and the declaration-copy helper
lives at `scripts/package-boundary/copy-dmts-to-dts.mjs`.

The build emits `.d.mts` because the sources are `.mts`, then copies matching
`.d.ts` files because the public `exports` map advertises `.d.ts` declaration
paths. If you add, rename, or remove an export, verify that the built `dist`
file and declaration path both exist.

Use the normal handoff gates from the package root:

```sh
pnpm run verify
pnpm pack --pack-destination /tmp
```

## The I/O-as-Values Discipline

The library performs no I/O it was not handed. Fetch, clock, and filesystem
effects belong at the caller or executable boundary.

- A bin may read stdin and may stamp output time.
- `evalRelation` receives already-read token/claim boundary documents and a
  timestamp value.
- Resource codecs parse or serialize bytes they were handed; they do not open
  paths.

This is what lets a log replay deterministically and what makes every read a
function of the supplied carrier.

## Tests Are Theorem-Shaped

A test name is a falsifiable claim the test proves. When extending usage or
reporting a bug, phrase it the same way: a single falsifiable claim.

Run before handing off:

```sh
pnpm run verify
pnpm run test
```

## Common Pitfalls

- Treating implementation modules or transport formats as the categorical
  contract. The export map is the categorical surface; EAVT/Datom is a
  representation boundary.
- Trying to admit a charge directly. Evidence enters as an utterance; charges
  are derived by the descent and emitted as readings.
- Treating contradiction as an error. A both-affirmed-and-denied cell is a
  representable reading, not an exception.
