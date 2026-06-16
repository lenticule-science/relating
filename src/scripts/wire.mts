/**
 * scripts/wire — the shell-boundary helpers shared by the relating verbs.
 *
 * Pure functions only. The I/O (reading stdin, parsing argv) happens when a
 * verb CALLS these, never on import, so the package's `sideEffects: false`
 * invariant still holds and nothing here runs unless a bin entrypoint runs it.
 *
 * Three interchange formats cross the wire:
 *   - the utterance LOG — evaluate's input; the composition point (logs
 *     concatenate, evidence is monotone). Codec: dehydrate/rehydrateUtterances.
 *   - the section READING — the internal script view: one
 *     `{subject, predicate, object, charge}` record per line (JSONL), charge in
 *     the four value names. Faithful: every cell, including `absurd`, survives.
 *   - EAVT witness rows — `[e,a,v,t]` tuples or `{e,a,v,t}` objects at the
 *     codec boundary. They enter as token `e`, claim `{a,v,t}`. Emitted EAVT
 *     rows carry the settled reading as a richer value: `[subject, predicate,
 *     {object, charge}, time]`.
 * A derived reading can be re-admitted for shell composition, but it remains a
 * new utterance about a prior reading: token `subject`, claim
 * `{predicate, object, charge}`. The prior charge is carried as observed data,
 * never injected as primitive falsity.
 */
import { asChargeValueName, valueOf, type Mark } from "../algebra/index.mjs";
import {
  induce,
  sectionOf,
  rehydrateUtterances,
  type UtteranceCarrier,
  type MemeTopologyCarrier,
  type SectionEntry,
  type OrderName,
  type BoundName,
  type ChargeValueName,
  type JsonValue,
} from "../topology/index.mjs";
import { canonical, isJsonRecord, parse as parseJson } from "../codecs/resource/json.mjs";

/** A settled cell rendered for the wire: term values plus the charge name. */
export interface SectionRecord {
  readonly subject: JsonValue;
  readonly predicate: JsonValue;
  readonly object: JsonValue;
  readonly charge: ChargeValueName;
}

/** Parsed argv: `--key=value` and bare `--flag` (empty value), plus positionals. */
export interface Args {
  readonly flags: ReadonlyMap<string, string>;
  readonly positionals: readonly string[];
}

export function parseArgs(argv: readonly string[]): Args {
  const flags = new Map<string, string>();
  const positionals: string[] = [];
  for (const token of argv) {
    if (token.startsWith("--")) {
      const eq = token.indexOf("=");
      if (eq === -1) flags.set(token.slice(2), "");
      else flags.set(token.slice(2, eq), token.slice(eq + 1));
    } else {
      positionals.push(token);
    }
  }
  return { flags, positionals };
}

/** Read all of stdin as UTF-8 — the filter's input when no path arg is given. */
export async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf8");
}

const nonBlank = (text: string): string[] => text.split("\n").filter((line) => line.trim() !== "");
const isEavtRow = (value: JsonValue): value is readonly [JsonValue, JsonValue, JsonValue, JsonValue] =>
  Array.isArray(value) && value.length === 4;
const isDatomRow = (value: JsonValue): value is readonly [JsonValue, JsonValue, JsonValue, JsonValue, JsonValue] =>
  Array.isArray(value) && value.length === 5;
export function parseOrderName(value: string | undefined, fallback = "knowledge"): OrderName {
  const name = value === undefined || value === "" ? fallback : value;
  if (name === "knowledge" || name === "truth") return name;
  throw new TypeError(`order: expected knowledge or truth, got ${JSON.stringify(name)}`);
}

export function parseBoundName(value: string | undefined, fallback = "least"): BoundName {
  const name = value === undefined || value === "" ? fallback : value;
  if (name === "least" || name === "greatest") return name;
  throw new TypeError(`bound: expected least or greatest, got ${JSON.stringify(name)}`);
}

export function parseChargeValueName(value: string | undefined): ChargeValueName | undefined {
  if (value === undefined || value === "") return undefined;
  return asChargeValueName(value);
}

function readChargeValueName(value: JsonValue | undefined, fallback?: ChargeValueName): ChargeValueName {
  if (value === undefined) {
    if (fallback !== undefined) return fallback;
    throw new TypeError("section record: expected charge value name");
  }
  if (typeof value !== "string") throw new TypeError("section record: expected charge value name");
  return asChargeValueName(value);
}

/**
 * Read an utterance log: either the log object `{kind, utterances}`, a bare
 * array of encoded utterances, or JSONL of `{token, claim}` pairs. Empty input
 * is the empty log — `evaluate` of nothing is the empty relating.
 *
 * Observations are re-admissible: a settled section record
 * `{subject, predicate, object, charge}` — `evaluate`'s own output — is admitted
 * as a fresh utterance (`token = subject`, `claim = {predicate, object, charge}`).
 * An EAVT row is admitted as (`token = e`, `claim = {a, v, t}`). A mark is
 * anything, so these rich claims are admissible evidence for the next pass, but
 * the core still never unpacks them into predication slots.
 */
function toEncodedUtterance(value: JsonValue): JsonValue {
  if (isEavtRow(value)) {
    return { token: value[0]!, claim: { a: value[1]!, v: value[2]!, t: value[3]! } };
  }
  if (isJsonRecord(value)) {
    if ("token" in value && "claim" in value) return { token: value["token"], claim: value["claim"] };
    if ("e" in value && "a" in value && "v" in value && "t" in value) {
      return { token: value["e"], claim: { a: value["a"], v: value["v"], t: value["t"] } };
    }
    if ("subject" in value && "predicate" in value) {
      return {
        token: value["subject"] ?? null,
        claim: {
          predicate: value["predicate"] ?? null,
          object: value["object"] ?? null,
          charge: value["charge"] ?? null,
        },
      };
    }
  }
  return value;
}

export function readLog(text: string): readonly UtteranceCarrier[] {
  const trimmed = text.trim();
  if (trimmed === "") return rehydrateUtterances({ kind: "meme-topology.utteranceLog", utterances: [] });
  let doc: JsonValue | undefined;
  try {
    doc = parseJson(trimmed);
  } catch {
    doc = undefined;
  }
  if (doc !== undefined && isJsonRecord(doc)) {
    if (doc["kind"] === "meme-topology.utteranceLog") return rehydrateUtterances(doc);
  }
  const lines: readonly JsonValue[] = Array.isArray(doc) && !isEavtRow(doc)
    ? doc
    : doc === undefined
      ? nonBlank(trimmed).map(parseJson)
      : [doc];
  return rehydrateUtterances({ kind: "meme-topology.utteranceLog", utterances: lines.map(toEncodedUtterance) });
}

/** Induce a carrier from log text — the closure endomorphism, folded. */
export const evaluateLog = (text: string): MemeTopologyCarrier => induce(readLog(text));

function requireJsonValue(markCarrier: Mark, label: string): JsonValue {
  const value = markCarrier.value;
  if (isJsonValue(value)) return value;
  throw new TypeError(`wire: ${label} mark is not JSON-serializable`);
}

function isJsonValue(value: Mark["value"]): value is JsonValue {
  if (value === undefined) return false;
  if (value === null) return true;
  const kind = typeof value;
  if (kind === "string" || kind === "boolean") return true;
  if (kind === "number") return Number.isFinite(value);
  if (kind !== "object") return false;
  if (Array.isArray(value)) return value.every(isJsonValue);
  if (Object.getPrototypeOf(value) !== Object.prototype) return false;
  return Object.values(value).every(isJsonValue);
}

const termValue = (term: { readonly mark: Mark }, label: string): JsonValue => requireJsonValue(term.mark, label);

/** A section entry rendered as a wire record (term values + charge name). */
export function recordOf(entry: SectionEntry): SectionRecord {
  return {
    subject: termValue(entry.cell.subject, "subject"),
    predicate: termValue(entry.cell.predicate, "predicate"),
    object: termValue(entry.cell.object, "object"),
    charge: valueOf(entry.charge).name,
  };
}

/** Read a section reading back from JSONL — `read`'s input (evaluate's output). */
export function readRecords(text: string): SectionRecord[] {
  return nonBlank(text).map((line) => {
    const value = parseJson(line);
    if (isEavtRow(value)) {
      const rich = value[2]!;
      if (isJsonRecord(rich) && "object" in rich) {
        return {
          subject: value[0]!,
          predicate: value[1]!,
          object: rich["object"] ?? null,
          charge: readChargeValueName(rich["charge"], "potential"),
        };
      }
      return { subject: value[0]!, predicate: value[1]!, object: rich, charge: "potential" };
    }
    if (isDatomRow(value)) {
      return {
        subject: value[0]!,
        predicate: value[1]!,
        object: value[2]!,
        charge: readChargeValueName(value[4]),
      };
    }
    if (!isJsonRecord(value)) throw new TypeError("section record: expected object, EAVT, or Datom");
    return {
      subject: value["subject"] ?? null,
      predicate: value["predicate"] ?? null,
      object: value["object"] ?? null,
      charge: readChargeValueName(value["charge"]),
    };
  });
}

/** Stable key for a cell, so two readings can be aligned term-by-term. */
export const cellKey = (record: SectionRecord): string =>
  canonical(record.subject) + "␟" + canonical(record.predicate) + "␟" + canonical(record.object);

/** Parse a CLI JSON value, falling back to a string when the token is not JSON text. */
export function parseJsonFlag(value: string): JsonValue {
  try {
    return parseJson(value);
  } catch {
    return value;
  }
}

/** Render records to the requested output format. Default eavt is the wire reading. */
export function formatRecords(records: readonly SectionRecord[], output: string, time: JsonValue): string {
  switch (output) {
    case "eavt":
    case "":
      return records
        .map((r) => canonical([r.subject, r.predicate, { object: r.object, charge: r.charge }, time]))
        .join("\n") + (records.length ? "\n" : "");
    case "datom":
      return records
        .map((r) => canonical([r.subject, r.predicate, r.object, time, r.charge]))
        .join("\n") + (records.length ? "\n" : "");
    case "json":
      return JSON.stringify(records) + "\n";
    case "table":
      return ["subject\tpredicate\tobject\tcharge"]
        .concat(records.map((r) => [r.subject, r.predicate, r.object, r.charge].map((v) => canonical(v)).join("\t")))
        .join("\n") + "\n";
    case "jsonl":
      return records.map((r) => JSON.stringify(r)).join("\n") + (records.length ? "\n" : "");
    default:
      throw new Error(`unrecognized --output=${output} (expected eavt, datom, jsonl, json, or table)`);
  }
}

export type { OrderName, BoundName, ChargeValueName, MemeTopologyCarrier };
export { sectionOf };
