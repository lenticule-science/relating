# Examples

The runnable examples live in `examples/` and are checked by `npm run examples`
after a build.

From the package directory:

```sh
pnpm run build
pnpm run examples
```

From the workspace root:

```sh
pnpm --filter @emsenn/relating run build
pnpm --filter @emsenn/relating run examples
```

## `examples/descent.mjs`

Runs the ordinary function-level descent:

```text
utterance -> articulate -> predicate -> posit -> settle
```

It prints the carrier kinds and a compact settlement summary: stage count,
closure regime, cofinality, first-cohomology rank, and graded-gap rank.

## `examples/action-apex.mjs`

Induces the package action list into one apex, dispatches `conflate-charge`, and
prints action-boundary facts. This is the smallest example of the package's
transport generator: one action declaration list becomes dispatch/OpenAPI/MCP/HTML
faces.

## `examples/term-products.mjs`

Inspects the exported RMN term catalogs: `descent`, `settlingTerms`,
`readerTerms`, and `measurement`. It prints whether representative terms are
closed, their node count, and their opcode vocabulary.

This is the "proof body as data" product surface.

## `examples/operation-substrate.mjs`

Declares a tiny `Note -> Summary` morphism:

- `carrier` declares the note object once
- `schemaCarrier` declares the string summary carrier
- `action` registers an IR-backed `summarize-note` morphism
- `induceBins` projects discovery resources, prompts, endpoint metadata, and a
  bound dispatch function from that one action

It is the smallest example of the package's operation-substrate shape: a typed
object, a typed morphism, behavior as `runTerm`, and boundary projections from
one registry.
