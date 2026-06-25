# Term IR

Relation Model Notation is the package's JSON term language for pure morphism
bodies. It shadows the CHL term calculus and is evaluated by
`evaluateRunTerm`.

Use `runTerm` when an action is a carrier-to-carrier morphism:

```ts
import { action, tm } from "@emsenn/relating";

export const identity = action({
  verb: "identity",
  domain: someCarrier,
  codomain: someCarrier,
  runTerm: tm.lam(tm.var(0)),
});
```

Use a TypeScript `run` body when the action is a boundary:

- it admits external data
- it encodes or decodes a representation
- it touches I/O
- it talks to a host process or transport
- it has no lawful carrier-to-carrier domain/codomain yet

The migration audit helpers make this distinction visible:

```ts
import { actionIrAudit, freeTsActions } from "@emsenn/relating";
```

`freeTsActions(actions)` should trend toward true boundaries only.

## Why It Matters

`runTerm` is data. It can be inspected, serialized as a morphism carrier, served
through the action boundary, compared with Lean-emitted vectors, and reused
across CLI, HTTP, MCP, and tests without rewriting the operation per transport.

That makes the morphism body part of the category, rather than a hidden closure
behind one transport.
