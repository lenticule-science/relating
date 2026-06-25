/**
 * acting/dispatch — the one dispatcher behind the single `relate` binary.
 *
 * `node:util.parseArgs` reads argv: the first positional is the verb, `--input-format`/
 * `--output-format` select wire codecs (overriding the action's defaults), and any other
 * flags are the action's arguments. The dispatcher reads stdin once, decodes by
 * the selected input codec, runs the pure morphism, encodes by the output codec,
 * and — when a data root is given — witnesses the play as EAVT (E=caller,
 * A=verb+args, V=return, T=now). Witnessing happens HERE, at the scripted
 * boundary; a direct in-process `action.run(...)` is never witnessed.
 *
 * This replaces every per-script `readStdin`/`jsonResource`/`import.meta.url`
 * tail with one place.
 */
import { parseArgs } from "node:util";
import type { JsonRecord, JsonValue } from "../../codecs/json.mjs";
import { morphismCarrier } from "../../typing/index.mjs";
import { type Action } from "./action.mjs";
import { wireCodec } from "./codecs.mjs";
import { witnessInvocation } from "./invocation.mjs";

/** Options governing one dispatch. */
export interface DispatchOptions {
  /** When set, witness each play under this data root. Omit to disable witnessing. */
  readonly dataRoot?: string;
  /** The invocation-log namespace (the package term). Default "relating". */
  readonly namespace?: string;
  /** The caller descriptor recorded as E. Default `{ transport: "cli" }`. */
  readonly caller?: JsonValue;
  /** The program name prefixed onto dispatch error messages. Default "relate". */
  readonly program?: string;
  /** The boundary clock stamping T. Default `new Date().toISOString()`. */
  readonly now?: () => string;
}

/** The outcome of one dispatch. */
export interface DispatchResult {
  readonly code: number;
  readonly stdout: string;
  readonly stderr: string;
}

function isPromiseLike<T>(value: T | Promise<T>): value is Promise<T> {
  return typeof value === "object" && value !== null && "then" in value && typeof (value as { then?: unknown }).then === "function";
}

/** Index a catalog of actions by verb. */
export function actionsByVerb(actions: readonly Action[]): ReadonlyMap<string, Action> {
  return new Map(actions.map((act) => [act.verb, act]));
}

function nowIso(): string {
  return new Date().toISOString(); // law-allow: wall-clock-as-data — T is the play's stamped input, not an ordering
}

/** Collect non-codec flags as the action's argument record. */
function argRecord(values: Readonly<Record<string, unknown>>): JsonRecord {
  const args: { [key: string]: JsonValue } = {};
  for (const [key, value] of Object.entries(values)) {
    if (key === "input-format" || key === "output-format" || value === undefined) continue;
    if (typeof value === "string" || typeof value === "boolean") args[key] = value;
    else if (Array.isArray(value)) args[key] = value.filter((item): item is string => typeof item === "string");
  }
  return Object.freeze(args);
}

/** Run one dispatch: argv + stdin → stdout, witnessing the play when configured. */
export function dispatch(
  actions: readonly Action[],
  argv: readonly string[],
  stdin: string,
  options: DispatchOptions = {},
): DispatchResult {
  const catalog = actionsByVerb(actions);
  const verbs = [...catalog.keys()].sort().join(", ");
  const program = options.program ?? "relate";

  // First pass: discover the verb from the positionals (permissive).
  let verb: string | undefined;
  try {
    verb = parseArgs({ args: [...argv], allowPositionals: true, strict: false }).positionals[0];
  } catch (error) {
    return { code: 2, stdout: "", stderr: `${program}: ${error instanceof Error ? error.message : String(error)}\n` };
  }
  if (verb === undefined) return { code: 2, stdout: "", stderr: `${program}: a verb is required; known: ${verbs}\n` };
  const act = catalog.get(verb);
  if (act === undefined) return { code: 2, stdout: "", stderr: `${program}: unknown verb ${JSON.stringify(verb)}; known: ${verbs}\n` };

  // Second pass: configure the codec flags and the action's declared valued options.
  const optionsConfig: Record<string, { type: "string" }> = { "input-format": { type: "string" }, "output-format": { type: "string" } };
  for (const name of act.options) optionsConfig[name] = { type: "string" };
  let values: Record<string, unknown>;
  try {
    values = parseArgs({ args: [...argv], options: optionsConfig, allowPositionals: true, strict: false }).values as Record<string, unknown>;
  } catch (error) {
    return { code: 2, stdout: "", stderr: `${program} ${verb}: ${error instanceof Error ? error.message : String(error)}\n` };
  }

  const inName = typeof values["input-format"] === "string" ? (values["input-format"] as string) : act.inputFormat;
  const outName = typeof values["output-format"] === "string" ? (values["output-format"] as string) : act.outputFormat;
  const args = argRecord(values);

  let stdout: string;
  let value: unknown;
  try {
    const input = wireCodec(inName).decode(stdin);
    const runValue = act.run(input, args);
    if (isPromiseLike(runValue)) {
      throw new TypeError("async action requires dispatchAsync");
    }
    value = runValue;
    stdout = wireCodec(outName).encode(value as JsonValue);
  } catch (error) {
    return { code: 1, stdout: "", stderr: `${program} ${verb}: ${error instanceof Error ? error.message : String(error)}\n` };
  }

  if (options.dataRoot !== undefined) {
    const at = (options.now ?? nowIso)();
    witnessInvocation(options.dataRoot, options.namespace ?? "relating", {
      caller: options.caller ?? { transport: "cli" },
      verb,
      args,
      action: morphismCarrier(act),
      value: value as JsonValue,
      at,
    });
  }

  return { code: 0, stdout, stderr: "" };
}

/** Run one dispatch, allowing the action body to await external effects. */
export async function dispatchAsync(
  actions: readonly Action[],
  argv: readonly string[],
  stdin: string,
  options: DispatchOptions = {},
): Promise<DispatchResult> {
  const catalog = actionsByVerb(actions);
  const verbs = [...catalog.keys()].sort().join(", ");
  const program = options.program ?? "relate";

  let verb: string | undefined;
  try {
    verb = parseArgs({ args: [...argv], allowPositionals: true, strict: false }).positionals[0];
  } catch (error) {
    return { code: 2, stdout: "", stderr: `${program}: ${error instanceof Error ? error.message : String(error)}\n` };
  }
  if (verb === undefined) return { code: 2, stdout: "", stderr: `${program}: a verb is required; known: ${verbs}\n` };
  const act = catalog.get(verb);
  if (act === undefined) return { code: 2, stdout: "", stderr: `${program}: unknown verb ${JSON.stringify(verb)}; known: ${verbs}\n` };

  const optionsConfig: Record<string, { type: "string" }> = { "input-format": { type: "string" }, "output-format": { type: "string" } };
  for (const name of act.options) optionsConfig[name] = { type: "string" };
  let values: Record<string, unknown>;
  try {
    values = parseArgs({ args: [...argv], options: optionsConfig, allowPositionals: true, strict: false }).values as Record<string, unknown>;
  } catch (error) {
    return { code: 2, stdout: "", stderr: `${program} ${verb}: ${error instanceof Error ? error.message : String(error)}\n` };
  }

  const inName = typeof values["input-format"] === "string" ? (values["input-format"] as string) : act.inputFormat;
  const outName = typeof values["output-format"] === "string" ? (values["output-format"] as string) : act.outputFormat;
  const args = argRecord(values);

  let value: unknown;
  let stdout: string;
  try {
    const input = wireCodec(inName).decode(stdin);
    value = await act.run(input, args);
    stdout = wireCodec(outName).encode(value as JsonValue);
  } catch (error) {
    return { code: 1, stdout: "", stderr: `${program} ${verb}: ${error instanceof Error ? error.message : String(error)}\n` };
  }

  if (options.dataRoot !== undefined) {
    const at = (options.now ?? nowIso)();
    witnessInvocation(options.dataRoot, options.namespace ?? "relating", {
      caller: options.caller ?? { transport: "cli" },
      verb,
      args,
      action: morphismCarrier(act),
      value: value as JsonValue,
      at,
    });
  }

  return { code: 0, stdout, stderr: "" };
}
