/**
 * codecs/path/object/attribute/file/flatfile/serialization
 *
 * Serialization restricts a flatfile to a concrete external data format.
 * JSON, JSONL, EAVT, Datom, TOML, and Turtle live below this node.
 */
import { restrict, type Projector } from "../../../../../../../codecs/holography/index.mjs";
import { flatfileProjector } from "../index.mjs";

export const serializationProjector: Projector<unknown> = restrict(flatfileProjector, {
  type: "serialization",
});

export { flatfileProjector } from "../index.mjs";
