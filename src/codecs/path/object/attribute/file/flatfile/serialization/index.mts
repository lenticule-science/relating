/**
 * codecs/path/object/attribute/file/flatfile/serialization
 *
 * Serialization restricts a flatfile to a concrete external data format.
 * HTML, JSON, JSONL, EAVT, Datom, TOML, and Turtle live below this node.
 */
export { flatfileProjector, serializationProjector } from "./projector.mjs";
export { htmlProjector } from "./html/projector.mjs";
