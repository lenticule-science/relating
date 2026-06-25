// holography/projecting/feed — the parameterizable "get this, witness it here" driver.
//
// A Feed is the only thing a caller writes: a name, a cellizer turning one
// observation into grain-of-change EAVT cells, and which attributes are
// functional. The two tiers — witness (append-only log) and state (current
// projection) — are then generic over any feed. This driver is the thin
// orchestration over the pure projection (./state) and the fs binding (./store):
// read → project → write.

import type { EAVTRecord } from "../../codecs/eavt.mjs";
import type { JsonValue } from "../../codecs/json.mjs";
import type { Witness } from "./cells.mjs";
import { projectContentDocuments, type ContentProjection } from "./content.mjs";
import { projectStateView, type StateView } from "./state.mjs";
import { appendWitnesses, readWitnessLog, writeContentDocument, writeJsonAtomic, type WitnessStore } from "./store.mjs";

/** A feed: how to witness one observation, and which attributes are functional. */
export interface Feed<Observation> {
  /** Stable feed name; used as the file stem under log, state, record, and content tiers. */
  readonly name: string;
  /** Turn one observation, witnessed at `at`, into EAVT cells. */
  readonly cellize: (observation: Observation, at: Witness) => readonly EAVTRecord[];
  /** Attributes holding one value at a time (latest witness wins on projection). */
  readonly functional: readonly string[];
}

/** Witness one observation: append only the cells new since the last witness.
 *  Returns the count of genuinely new rows — this feed's per-witness growth. */
export function witnessObservation<Observation>(
  store: WitnessStore,
  feed: Feed<Observation>,
  observation: Observation,
  at: Witness,
): { readonly appended: number } {
  return appendWitnesses(store, feed.name, feed.cellize(observation, at));
}

/** Read the append-only witness log, fold functional attributes to their latest
 *  value, and atomically write the feed's current view to the state tier. */
export function projectFeedState<Observation>(store: WitnessStore, feed: Feed<Observation>): StateView {
  const view = projectStateView(readWitnessLog(store, feed.name), new Set(feed.functional));
  writeJsonAtomic(store.stateDir, feed.name, view as unknown as JsonValue);
  return view;
}

/** Project the feed's bulk into the content tier: take the cut the projection
 *  accepts and write each accepted entity to its own term-addressed document
 *  (default: markdown with YAML frontmatter). Returns the paths written. By
 *  default the source is the read-model projected from the log; pass `opts.view`
 *  to project a previously settled view instead. */
export function projectFeedContent<Observation>(
  store: WitnessStore,
  feed: Feed<Observation>,
  opts: { readonly projection?: ContentProjection; readonly view?: StateView } = {},
): readonly string[] {
  const view = opts.view ?? projectStateView(readWitnessLog(store, feed.name), new Set(feed.functional));
  const documents = projectContentDocuments(view, opts.projection);
  return Object.freeze(documents.map((document) => writeContentDocument(store, document)));
}
