# Action Apex

The action apex is the package's "declare once, project many ways" surface.

The public import is `@emsenn/relating/acting`. In source, the implementation
now lives under `src/holography/acting/`: the formal reading is that an induced
action family is one holographic apex whose boundary faces are projections.

An action declaration carries:

- a verb
- boundary codecs
- optional carrier domain and codomain
- optional RMN `runTerm`
- summaries and descriptions
- the executable body the dispatcher calls

`induceBins` reads a package's actions, resources, and prompts and produces one
discovery carrier. That carrier is the apex: every projected face reads from it
or from the same action list.

## Faces

The current acting surface projects the apex to:

- CLI dispatch through `relate`
- HTTP action routes through `routeRequest` and `serve`
- OpenAPI paths
- MCP tools, resources, and prompts
- browser forms
- invocation witnesses
- carrier-node mounts

These are not separate operation definitions. They are boundary faces of the one
action family.

## What The Discovery Carrier Contains

`ActionDiscovery` contains:

- `bins`: one endpoint record per action
- `resources`: registered resources plus derived carrier/action schema resources
- `prompts`: registered prompts plus derived action prompts
- `utterances`: relational facts about the package and its legs

When an action carries `runTerm`, the endpoint projection includes that term. This
makes the behavior visible to discovery rather than hidden behind a callback.

## Smallest Probe

Run:

```sh
pnpm run build
node examples/action-apex.mjs
```

That example induces the package's registered actions and prints:

- total action count
- first verbs
- how many carrier morphisms still lack RMN bodies
- boundary examples and why they are boundaries
- one dispatch result through the induced apex

Run:

```sh
node examples/operation-substrate.mjs
```

for a minimal package-shaped action family with one carrier-to-carrier morphism.
