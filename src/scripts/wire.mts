/**
 * scripts/wire — the shell-boundary helpers shared by the relationality verbs.
 *
 * Pure functions only. The I/O (reading stdin, parsing argv) happens when a
 * verb CALLS these, never on import, so the package's `sideEffects: false`
 * invariant still holds and nothing here runs unless a bin entrypoint runs it.
 *
 * Two interchange formats cross the wire, and only these two:
 *   - the utterance LOG — evaluate's input; the composition point (logs
 *     concatenate, evidence is monotone). Codec: dehydrate/rehydrateUtterances.
 *   - the section READING — evaluate's output, read's input/output: one
 *     `{subject, predicate, object, charge}` record per line (JSONL), charge in
 *     the four value names. Faithful: every cell, including `absurd`, survives.
 * The `datom`/`eavt` resource codec is a separate concern — a monotone witness
 * log for ingesting external fact streams — never the pipe glue between verbs,
 * and never an export of a derived reading: you do not turn settled charges
 * back into witnesses.
 */
import { valueOf } from "../algebra/index.mjs";
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
import { canonical } from "../codecs/resource/json.mjs";

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
  for await (const chunk of process.stdin) chunks.push(chunk as Buffer);
  return Buffer.concat(chunks).toString("utf8");
}

const nonBlank = (text: string): string[] => text.split("\n").filter((line) => line.trim() !== "");

/**
 * Read an utterance log: either the log object `{kind, utterances}`, a bare
 * array of encoded utterances, or JSONL of `{token, claim}` pairs. Empty input
 * is the empty log — `evaluate` of nothing is the empty relationality.
 *
 * Observations are re-admissible: a settled section record
 * `{subject, predicate, object, charge}` — `evaluate`'s OWN output — is admitted
 * as a fresh utterance (`token = {subject, object}`, `claim = predicate`). A
 * mark is anything, so the result of one settling is admissible evidence for the
 * next, and `evaluate | … | evaluate` composes — relationality induced on
 * relationality. Re-admission is a fresh affirmation (every claim affirms); the
 * prior charge is the observation, re-derived, never re-injected as a negative.
 */
function toEncodedUtterance(value: JsonValue): JsonValue {
  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    const record = value as { readonly [k: string]: JsonValue };
    if ("token" in record && "claim" in record) return { token: record["token"], claim: record["claim"] };
    if ("subject" in record && "predicate" in record) {
      const token = "object" in record ? { subject: record["subject"], object: record["object"] } : record["subject"];
      return { token: token ?? null, claim: record["predicate"] ?? null };
    }
  }
  return value;
}

export function readLog(text: string): readonly UtteranceCarrier[] {
  const trimmed = text.trim();
  if (trimmed === "") return rehydrateUtterances({ kind: "meme-topology.utteranceLog", utterances: [] });
  let doc: JsonValue | undefined;
  try {
    doc = JSON.parse(trimmed) as JsonValue;
  } catch {
    doc = undefined;
  }
  if (doc !== undefined && typeof doc === "object" && doc !== null && !Array.isArray(doc)) {
    const record = doc as { readonly [k: string]: JsonValue };
    if (record["kind"] === "meme-topology.utteranceLog") return rehydrateUtterances(doc);
  }
  const lines: readonly JsonValue[] = Array.isArray(doc) ? doc : nonBlank(trimmed).map((line) => JSON.parse(line) as JsonValue);
  return rehydrateUtterances({ kind: "meme-topology.utteranceLog", utterances: lines.map(toEncodedUtterance) });
}

/** Induce a carrier from log text — the closure endomorphism, folded. */
export const evaluateLog = (text: string): MemeTopologyCarrier => induce(readLog(text));

const termValue = (term: { readonly mark: { readonly value: unknown } }): JsonValue => term.mark.value as JsonValue;

/** A section entry rendered as a wire record (term values + charge name). */
export function recordOf(entry: SectionEntry): SectionRecord {
  return {
    subject: termValue(entry.cell.subject),
    predicate: termValue(entry.cell.predicate),
    object: termValue(entry.cell.object),
    charge: valueOf(entry.charge).name,
  };
}

/** Read a section reading back from JSONL — `read`'s input (evaluate's output). */
export function readRecords(text: string): SectionRecord[] {
  return nonBlank(text).map((line) => {
    const value = JSON.parse(line) as { readonly [k: string]: JsonValue };
    return {
      subject: value["subject"] ?? null,
      predicate: value["predicate"] ?? null,
      object: value["object"] ?? null,
      charge: value["charge"] as ChargeValueName,
    };
  });
}

/** Stable key for a cell, so two readings can be aligned term-by-term. */
export const cellKey = (record: SectionRecord): string =>
  canonical(record.subject) + "␟" + canonical(record.predicate) + "␟" + canonical(record.object);

/** Render records to the requested output format. Default jsonl is the wire reading. */
export function formatRecords(records: readonly SectionRecord[], output: string): string {
  switch (output) {
    case "json":
      return JSON.stringify(records) + "\n";
    case "table":
      return ["subject\tpredicate\tobject\tcharge"]
        .concat(records.map((r) => [r.subject, r.predicate, r.object, r.charge].map((v) => canonical(v as JsonValue)).join("\t")))
        .join("\n") + "\n";
    case "jsonl":
    case "":
      return records.map((r) => JSON.stringify(r)).join("\n") + (records.length ? "\n" : "");
    default:
      throw new Error(`unknown --output=${output} (expected jsonl, json, or table)`);
  }
}

export type { OrderName, BoundName, ChargeValueName, MemeTopologyCarrier };
export { sectionOf };
