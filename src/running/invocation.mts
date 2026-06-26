/**
 * @packageDocumentation
 *
 * running/invocation - witness a scripted play as EAVT in the package ledger.
 *
 * An invocation reached through the scripting boundary is a play of a strategy:
 * a witnessed pre-state → post-state. We record it as ONE EAVT row — E = the
 * caller, A = the morphism and its arguments, V = the return value, T = the
 * timestamp — appended best-effort to a term-addressed dated log
 * (`<dataRoot>/log/YYYY/MM/DD/YYYY-MM-DD-<namespace>-log.jsonl`). Settling that
 * log yields Datoms whose fifth slot is the reading. Witnessing never changes the
 * action's output: a failure here is swallowed (the morphism stays total).
 *
 * This is the invocation-witness product surface: CLI, HTTP, MCP, and form
 * routes that pass through dispatch can leave the same append-only trace, while
 * direct in-process `action.run(...)` remains a local function call and is not
 * witnessed. The witness is advisory and best-effort; it must never change the
 * action's return value.
 */
import path from "node:path";
import { cell, type Witness } from "../ledger/cells.mjs";
import { appendWitnesses, type WitnessStore } from "../ledger/store.mjs";
import { projectStateView, type StateView } from "../ledger/state.mjs";
import { readWitnessLog } from "../ledger/store.mjs";
import type { Feed } from "../ledger/feed.mjs";
import type { EAVTRecord } from "../writing/eavt.mjs";
import type { JsonRecord, JsonValue } from "../writing/json.mjs";
import type { MorphismCarrier } from "./category.mjs";

/** One scripted play. */
export interface Invocation {
  /** the caller — E. A transport/identity descriptor. */
  readonly caller: JsonValue;
  /** the verb — part of A. */
  readonly verb: string;
  /** the arguments — part of A. */
  readonly args: JsonRecord;
  /** the TypeBox-backed morphism carrier — includes the IR runTerm when present. */
  readonly action?: MorphismCarrier;
  /** the return value — V. */
  readonly value: JsonValue;
  /** the timestamp — T. */
  readonly at: Witness;
}

/** The invocation feed: one observation becomes one grain-of-change EAVT row. */
export const invocationFeed: Feed<Invocation> = Object.freeze({
  name: "invocations",
  functional: [],
  cellize: (invocation: Invocation, at: Witness): readonly EAVTRecord[] =>
    [cell(invocation.caller, {
      verb: invocation.verb,
      args: invocation.args,
      ...(invocation.action === undefined ? {} : { action: invocation.action }),
    }, invocation.value, at)],
});

/** The UTC date (YYYY-MM-DD) named by a witness timestamp; safe fallback otherwise. */
function dateOf(at: Witness): string {
  const text = String(at);
  return /^\d{4}-\d{2}-\d{2}/.test(text) ? text.slice(0, 10) : "0000-00-00";
}

/** A filesystem-safe leaf slug for a namespace term (drops a leading scope `@`). */
function slug(namespace: string): string {
  return namespace.replace(/^@/, "").replace(/[^A-Za-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "relating";
}

/** The dated, term-addressed witness store and feed name for a namespace's log. */
export function invocationStore(dataRoot: string, namespace: string, at: Witness): { readonly store: WitnessStore; readonly feed: string } {
  const date = dateOf(at);
  const [year, month, day] = date.split("-");
  return {
    store: Object.freeze({
      logDir: path.join(dataRoot, "log", year ?? "0000", month ?? "00", day ?? "00"),
      stateDir: path.join(dataRoot, "state"),
      recordDir: path.join(dataRoot, "record"),
    }),
    feed: `${date}-${slug(namespace)}-log`,
  };
}

/** Witness one invocation, best-effort. Never throws: a witness failure must not
 *  change the action's output. Returns how many rows were genuinely new. */
export function witnessInvocation(
  dataRoot: string,
  namespace: string,
  invocation: Invocation,
): { readonly appended: number } {
  try {
    const { store, feed } = invocationStore(dataRoot, namespace, invocation.at);
    return appendWitnesses(store, feed, invocationFeed.cellize(invocation, invocation.at));
  } catch {
    return { appended: 0 };
  }
}

/** Project the current view of an invocation log (the read-model). */
export function projectInvocations(store: WitnessStore, feed: string): StateView {
  return projectStateView(readWitnessLog(store, feed), new Set<string>());
}
