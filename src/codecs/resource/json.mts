/**
 * codecs/resource/json — JSON values, canonical (deterministic) serialization,
 * and the jsonl line codec the record formats (datom, eavt) write through.
 * Equal values → equal bytes (sorted keys, no insignificant whitespace).
 */
export type JsonValue =
  | null
  | boolean
  | number
  | string
  | readonly JsonValue[]
  | { readonly [key: string]: JsonValue };

/** Parse one JSON document. */
export const parse = (text: string): JsonValue => JSON.parse(text) as JsonValue;

/** Canonical serialization: object keys sorted, no insignificant whitespace. */
export function canonical(value: JsonValue): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return "[" + value.map(canonical).join(",") + "]";
  const object = value as { readonly [key: string]: JsonValue };
  const keys = Object.keys(object).sort();
  return "{" + keys.map((k) => JSON.stringify(k) + ":" + canonical(object[k]!)).join(",") + "}";
}

/** The non-blank lines of a document. */
export const nonBlankLines = (content: string): string[] =>
  content.split("\n").filter((line) => line.trim() !== "");

/** Parse a jsonl document into its values: one json value per non-blank line. */
export const parseLines = (content: string): JsonValue[] => nonBlankLines(content).map(parse);

/** Serialize values to a jsonl document: one canonical value per newline-terminated line. */
export const serializeLines = (values: readonly JsonValue[]): string =>
  values.map((v) => canonical(v) + "\n").join("");
