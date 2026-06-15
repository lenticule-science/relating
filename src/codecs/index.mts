import { join, sep } from "node:path";

/**
 * An addressable term: either a slash-separated string path or a readonly array
 * of path parts.
 */
export type AddressTerm = string | readonly unknown[];

const JSON_TERM_PREFIX = "~json:";
const STRING_TERM_PREFIX = "~string:";
const ESC = "~";
const SAFE = /[A-Za-z0-9._-]/;
const encoder = new TextEncoder();
const decoder = new TextDecoder();

const canonical = (value: unknown): unknown => {
  if (value === undefined) throw new TypeError("termKey: undefined is not an addressable term");
  if (typeof value === "function") throw new TypeError("termKey: functions are not addressable terms");
  if (typeof value === "symbol") throw new TypeError("termKey: symbols are not addressable terms");
  if (typeof value === "bigint") throw new TypeError("termKey: bigints are not addressable terms");
  if (typeof value === "number" && !Number.isFinite(value)) throw new TypeError("termKey: non-finite numbers are not addressable terms");
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(canonical);
  const out: Record<string, unknown> = {};
  for (const name of Object.keys(value as Record<string, unknown>).sort()) out[name] = canonical((value as Record<string, unknown>)[name]);
  return out;
};

/**
 * The canonical key for a term: returns plain strings unchanged (escaping any
 * that collide with the reserved prefixes), and serializes non-strings to a
 * stable JSON form with object keys sorted. Throws for undefined, functions,
 * symbols, bigints, and non-finite numbers.
 */
export function termKey(term: unknown): string {
  if (typeof term === "string") {
    return term.startsWith(JSON_TERM_PREFIX) || term.startsWith(STRING_TERM_PREFIX)
      ? `${STRING_TERM_PREFIX}${term}`
      : term;
  }
  return `${JSON_TERM_PREFIX}${JSON.stringify(canonical(term))}`;
}

const escapeByte = (byte: number): string => ESC + byte.toString(16).padStart(2, "0");

/**
 * Encodes a string into a single filesystem-safe path segment: keeps ASCII
 * alphanumerics and "._-", percent-style escapes everything else as "~hh" hex
 * bytes, and special-cases the empty string, ".", "..", and a leading ".".
 */
export function sanitizeSegment(value: string): string {
  if (value === "") return `${ESC}e`;
  if (value === ".") return `${ESC}2e`;
  if (value === "..") return `${ESC}2e${ESC}2e`;
  let out = "";
  let first = true;
  for (const character of value) {
    if (character === ESC) out += escapeByte(character.charCodeAt(0));
    else if (first && character === ".") out += escapeByte(character.charCodeAt(0));
    else if (character.length === 1 && character.charCodeAt(0) < 128 && SAFE.test(character)) out += character;
    else for (const byte of encoder.encode(character)) out += escapeByte(byte);
    first = false;
  }
  return out;
}

/**
 * Decodes a path segment produced by sanitizeSegment back into its original
 * string, reversing the "~hh" hex escapes. Throws on malformed escapes or
 * disallowed raw bytes.
 */
export function desanitizeSegment(segmentText: string): string {
  if (segmentText === `${ESC}e`) return "";
  const bytes: number[] = [];
  for (let index = 0; index < segmentText.length;) {
    if (segmentText[index] === ESC) {
      const hex = segmentText.slice(index + 1, index + 3);
      if (!/^[0-9a-f]{2}$/i.test(hex)) throw new TypeError(`desanitizeSegment: invalid escape ${segmentText.slice(index, index + 3)}`);
      bytes.push(parseInt(hex, 16));
      index += 3;
    } else {
      const character = segmentText[index]!;
      if (!SAFE.test(character)) throw new TypeError(`desanitizeSegment: invalid raw byte ${JSON.stringify(character)}`);
      for (const byte of encoder.encode(character)) bytes.push(byte);
      index += 1;
    }
  }
  return decoder.decode(new Uint8Array(bytes));
}

/**
 * Converts a term into a single filesystem-safe path segment: the term's
 * canonical key passed through sanitizeSegment.
 */
export const segment = (term: unknown): string => sanitizeSegment(termKey(term));

const segmentsOf = (term: AddressTerm): string[] => {
  if (Array.isArray(term)) return term.map((part) => String(part));
  return String(term).split("/").map((part) => part.trim()).filter(Boolean);
};

const typeOf = (type: unknown): string => {
  const text = String(type ?? "").trim().replace(/^\.+/, "");
  if (!text) throw new TypeError("address: a typed filepath needs a type");
  return text;
};

const addressOfSegments = (root: string, segments: readonly string[], type: unknown): string => {
  if (segments.length === 0) throw new TypeError("address: the empty term has no address");
  const leaf = segments[segments.length - 1]!;
  return join(root, ...segments, `${leaf}.${typeOf(type)}`);
};

/**
 * The typed filepath for a term under a root: joins the root with each
 * sanitized term segment and appends a leaf file named after the last segment
 * with the given type as its extension. Throws on an empty term or missing
 * type.
 */
export function address(root: string, term: AddressTerm, type: unknown): string {
  return addressOfSegments(root, segmentsOf(term).map(sanitizeSegment), type);
}

/**
 * The address of a term's append-only log under a root: its typed filepath with
 * the "jsonl" type.
 */
export const logPath = (root: string, term: AddressTerm): string => address(root, term, "jsonl");

const termSegmentsOfPath = (root: string, path: string): string[] => {
  const relative = path.startsWith(root) ? path.slice(root.length) : path;
  const parts = relative.split(sep).filter(Boolean);
  parts.pop();
  return parts.map(desanitizeSegment);
};

/**
 * The slash-separated term recovered from a filepath under a root: strips the
 * root prefix and the leaf filename, desanitizes the remaining segments, and
 * joins them with "/". Inverse of address for the directory portion.
 */
export function termOf(root: string, path: string): string {
  return termSegmentsOfPath(root, path).join("/");
}

/**
 * The typed filepath for a term given as already-split parts: coerces each part
 * to a string, sanitizes it as a segment, and builds the address under the root
 * the same way as address. A single non-array part is treated as a one-element
 * list.
 */
export function addressNested(root: string, parts: unknown | readonly unknown[], type: unknown): string {
  const list = Array.isArray(parts) ? parts : [parts];
  return addressOfSegments(root, list.map((part) => sanitizeSegment(String(part))), type);
}

/**
 * The term parts recovered from a filepath under a root: the desanitized path
 * segments as an array, without joining them. Inverse of addressNested for the
 * directory portion.
 */
export function termOfNested(root: string, path: string): string[] {
  return termSegmentsOfPath(root, path);
}

/**
 * A slash-separated term built from a namespace and optional parts: sanitizes
 * the namespace and each part as a segment and joins them with "/". A single
 * non-array part is treated as a one-element list.
 */
export function composeTerm(namespace: unknown, parts: unknown | readonly unknown[] = []): string {
  const list = Array.isArray(parts) ? parts : [parts];
  return [sanitizeSegment(String(namespace)), ...list.map((part) => sanitizeSegment(String(part)))].join("/");
}

/**
 * The frozen decomposition of a slash-separated term: its first segment
 * desanitized into the namespace and the remaining segments desanitized into
 * parts. The empty term yields an empty namespace and no parts. Inverse of
 * composeTerm.
 */
export function decomposeTerm(term: unknown): Readonly<{ readonly namespace: string; readonly parts: readonly string[] }> {
  const atoms = String(term).split("/").filter(Boolean);
  if (atoms.length === 0) return Object.freeze({ namespace: "", parts: Object.freeze([]) });
  return Object.freeze({
    namespace: desanitizeSegment(atoms[0]!),
    parts: Object.freeze(atoms.slice(1).map(desanitizeSegment)),
  });
}

/**
 * The namespace of a slash-separated term: its first segment desanitized, or
 * the empty string when the term has no segments.
 */
export function namespaceOf(term: unknown): string {
  const head = String(term).split("/").filter(Boolean)[0];
  return head === undefined ? "" : desanitizeSegment(head);
}

/**
 * Whether a term belongs to a namespace: true when the term's first segment
 * equals the sanitized namespace.
 */
export function withinNamespace(term: unknown, namespace: unknown): boolean {
  const head = String(term).split("/").filter(Boolean)[0];
  return head !== undefined && head === sanitizeSegment(String(namespace));
}

export * as resource from "./resource/index.mjs";
