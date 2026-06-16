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

/** A string-keyed JSON object carrier. */
export type JsonRecord = { readonly [key: string]: JsonValue };

type JsonDocumentCandidate = JsonValue | object | undefined;

/** Parse one JSON document. */
export function parse(text: string): JsonValue {
  const value: JsonDocumentCandidate = JSON.parse(text);
  if (isJsonValue(value)) return value;
  throw new TypeError("json: parsed value is not a JSON value");
}

export function isJsonRecord(value: JsonValue): value is JsonRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isPlainJsonRecord(value: JsonDocumentCandidate): value is JsonRecord {
  return value !== null
    && typeof value === "object"
    && !Array.isArray(value)
    && Object.getPrototypeOf(value) === Object.prototype;
}

function isJsonValue(value: JsonDocumentCandidate): value is JsonValue {
  if (value === null) return true;
  const kind = typeof value;
  if (kind === "string" || kind === "boolean") return true;
  if (kind === "number") return Number.isFinite(value);
  if (kind !== "object" || value === undefined) return false;
  if (Array.isArray(value)) return value.every(isJsonValue);
  if (!isPlainJsonRecord(value)) return false;
  return Object.values(value).every(isJsonValue);
}

/** Canonical serialization: object keys sorted, no insignificant whitespace. */
export function canonical(value: JsonValue): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return "[" + value.map(canonical).join(",") + "]";
  return "{" + Object.entries(value)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, item]) => JSON.stringify(key) + ":" + canonical(item))
    .join(",") + "}";
}

/** The non-blank lines of a document. */
export const nonBlankLines = (content: string): string[] =>
  content.split("\n").filter((line) => line.trim() !== "");

/** Parse a jsonl document into its values: one json value per non-blank line. */
export const parseLines = (content: string): JsonValue[] => nonBlankLines(content).map(parse);

/** Serialize values to a jsonl document: one canonical value per newline-terminated line. */
export const serializeLines = (values: readonly JsonValue[]): string =>
  values.map((v) => canonical(v) + "\n").join("");
