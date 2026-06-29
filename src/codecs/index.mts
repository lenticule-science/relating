/**
 * codecs - representation boundary codecs organized by substrate and syntax.
 *
 * Paths encode the boundary morphology: textual JSON material is under
 * `text/json`, JSON Lines refinement under `text/json/jsonl`, EAVT row material
 * under `text/json/jsonl/eavt`, and XML-family projections under `text/xml`.
 */
export * as boundary from "./boundary/index.mjs";
export * as host from "./host/index.mjs";
export * as text from "./text/index.mjs";
