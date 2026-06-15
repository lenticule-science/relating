# Best practices: consuming @emsenn/relationality

This is a how-to guide for using the package well. It assumes you have read the
overview. Every import below is drawn from the real `exports` map in
`package.json`.

## Import the named subpaths, never deep dist paths

The package's contract is its `exports` map. Import the published subpaths:

```ts
import { mark, token, claim, utterance } from "@emsenn/relationality/algebra";
import { induce, extend, readCharge, sectionOf } from "@emsenn/relationality/topology";
import { spectrum } from "@emsenn/relationality/analysis";
import { address, termKey, logPath } from "@emsenn/relationality/codecs";
```

Do NOT reach into `@emsenn/relationality/dist/...` or any path not listed in
`exports`. Those paths are not part of the contract; they can move on any build.
The dist layout (`tsc` output plus `copy-dmts-to-dts`) is an implementation
detail.

The root entry re-exports each module as a namespace, for discovery:

```ts
import { algebra, topology, analysis } from "@emsenn/relationality";
algebra.mark(/* ... */);
```

Prefer the namespace import only for exploration. For real code, import the
specific subpath so you get its flat symbol surface and the smallest reachable
graph.

## Which subpath to reach for, per task

- Build the primitive evidence (marks, tokens, claims, utterances), cells, and
  use the exact arithmetic or charge algebra: `@emsenn/relationality/algebra`.
- Work with the linear connectives or the typed theory:
  `@emsenn/relationality/logic`.
- Fold utterances into a carrier and read it back - the common case:
  `@emsenn/relationality/topology` (`induce`, `extend`, `readCharge`,
  `sectionOf`, `topologyVitals`, the four `*FixedPoint` reads,
  `dehydrateUtterances`/`rehydrateUtterances`).
- Ordinal/valuation closure, settling, firing, cohomology, consistency, the
  fixed-point gap: `@emsenn/relationality/topology/dynamics`.
- Substitution dynamics (rules, orbits, abelianization, gauge labelings):
  `@emsenn/relationality/topology/arithmetic`.
- Spatial (quadratic fields, cut-and-project) and temporal/causal geometry of a
  settling: `@emsenn/relationality/geometry`.
- Spectral reads of a carrier (Laplacian, harmonic modes, component count,
  tree count) and evidence readings: `@emsenn/relationality/analysis`; measure
  a subject against a control: `@emsenn/relationality/analysis/differential`.
- Term <-> filesystem-address codec: `@emsenn/relationality/codecs`; SHP
  carrier<->HTML: `@emsenn/relationality/codecs/html`; the typed-resource
  lattice: `@emsenn/relationality/codecs/resource`.
- Define your own boundary projector for a new resource type:
  `@emsenn/relationality/holography`.

The three bins - `relationality-evaluate`, `relationality-read`,
`relationality-compare` - are CLIs over the same surface; use them for ad hoc
work, the subpaths for programmatic use.

## The I/O-as-values discipline

This package performs no I/O it was not handed. fetch, clock, and fs all enter
as values. Honor this when you consume it:

- Do the reading yourself, then hand in the bytes. A holography `Resource` is
  `{ path, content }` - you load the content; the projector does not open the
  file:

  ```ts
  import { classify } from "@emsenn/relationality/holography";
  import { readFileSync } from "node:fs";
  const path = "data/observations.jsonl";
  const resource = { path, content: readFileSync(path, "utf8") };
  const projector = classify(resource, catalog);
  const items = projector?.read?.(resource) ?? [];
  ```

- The codecs compute path strings - they do not touch the disk. `address`,
  `logPath`, and `termOf` are pure string functions; you do the `writeFile`.

- A settling is a pure function of its utterance log. Hand in your utterances;
  do not expect the engine to fetch or to consult a clock. If you need the clock
  or the network in your evidence, capture those readings as utterance values
  first.

This is what lets you replay a log deterministically and what makes every read a
function of the frozen carrier.

## sideEffects:false and tree-shaking

`package.json` sets `"sideEffects": false`: no module has a module-level side
effect. A bundler may therefore drop any export you do not reference. Two
consequences:

- Import only what you use. If you import from `@emsenn/relationality/topology`
  but use only `readCharge`, the rest can be eliminated.
- Do not rely on import-for-effect. There is nothing to register or initialize
  by importing a module; importing it does nothing on its own.

## The subpath with NO semver promise

`@emsenn/relationality/topology/internal` carries no semver promise. It exposes
the engine, not the contract: coincidence booleans, carrier-assembly
constructors, closure-engine internals, unspecified modal operators,
set-encoding internals. Importing it is forking, not extending - it can change
in any release with no notice. If you find you need something only reachable
from `internal`, treat that as a signal to raise it for promotion to a curated
barrel, not as a dependency to take quietly. Everything the package promises is
reachable from the curated subpaths.

## Tests are theorem-shaped

A test name is a falsifiable claim the test proves. Read the test suite as the
package's specification; real names from this package read like:

- "the spectrum polynomial is exact: path on three terms gives lambda^3 - 4
  lambda^2 + 3 lambda"
- "component count is the zero-eigenvalue multiplicity, exactly"
- "tree count is the Matrix-Tree determinant"
- "an observation is re-admissible: a settled section record becomes a fresh
  utterance"
- "knowledge and truth bilattice joins are commutative, associative, and
  idempotent"

When you extend usage or report a bug, phrase it the same way: a single
falsifiable claim. `pnpm run check` before any edit, `pnpm run verify` before
committing.

## Common pitfalls specific to this package

- Trying to admit a charge directly. There is no verb that admits a charge, a
  polarity, or a denial. The only admission is articulating an utterance;
  charges, edges, and contradictions are derived. To deny something, articulate
  the utterance that produces the denial.
- Treating contradiction as an error. A both-affirmed-and-denied cell is the
  absurd charge - a representable value. The engine keeps settling; do not catch
  it as an exception.
- Expecting floats. Distributions are exact histograms, spectra are exact
  polynomials, divergences are charges. Where two things are genuinely
  incomparable, you get an explicit judgment object, not a NaN or a coerced
  number. Compare judgments, do not compare floats.
- Re-admission semantics. A settled section record can become a fresh utterance,
  and re-admission is additive, not a replacement - but it carries no charge as
  primitive: the prior charge is dropped and the cell is re-affirmed. Do not
  assume re-feeding a reading preserves its old charge.
- Looking for substitution arithmetic in the wrong place.
  `./topology/arithmetic` is substitution dynamics; exact number arithmetic is
  in `./algebra`; spectral polynomial analysis is in `./analysis`.
- Importing `@emsenn/relationality/*` from inside the package. Internal modules
  use relative `.mjs` imports only; the package-name subpaths are for consumers.
- Forgetting the type when building an address. `address(root, term, type)`
  throws on an empty term or a missing type; `termKey` throws for `undefined`,
  functions, symbols, bigints, and non-finite numbers. Sanitize/canonicalize
  through the codec rather than building paths by hand.
