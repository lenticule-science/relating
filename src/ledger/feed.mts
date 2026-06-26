// holography/projecting/feed — the parameterizable "get this, witness it here" driver.
//
// A Feed is the only thing a caller writes: a name, a cellizer turning one
// observation into grain-of-change EAVT cells, and which attributes are
// functional. The two tiers — witness (append-only log) and state (current
// projection) — are then generic over any feed. This driver is the thin
// orchestration over the pure projection (./state) and the fs binding (./store):
// read → project → write.

import type { EAVTRecord } from "../writing/eavt.mjs";
import type { JsonValue } from "../writing/json.mjs";
import type { Witness } from "./cells.mjs";
import { projectContentDocuments, type ContentProjection } from "./content.mjs";
import { projectStateView, type StateView } from "./state.mjs";
import { appendWitnesses, readWitnessLog, writeContentDocument, writeJsonAtomic, type WitnessStore } from "./store.mjs";

/**
 * Description of how one observation enters the witness ledger.
 *
 * Callers provide the domain-specific part: a stable feed name, a cellizer that
 * turns one observation into EAVT rows, and the attributes whose projected state
 * should be latest-witness-wins. The package supplies append, fold, and content
 * projection machinery around that declaration.
 */
export interface Feed<Observation> {
  /** Stable feed name; used as the file stem under log, state, record, and content tiers. */
  readonly name: string;
  /** Turn one observation, witnessed at `at`, into EAVT cells. */
  readonly cellize: (observation: Observation, at: Witness) => readonly EAVTRecord[];
  /** Attributes holding one value at a time (latest witness wins on projection). */
  readonly functional: readonly string[];
}

/**
 * Witness one observation into the append-only log.
 *
 * The observation is cellized by the feed, then only rows whose content identity
 * is not already present are appended. The return value is the count of genuinely
 * new rows, which is the feed's small growth signal for this observation.
 */
export function witnessObservation<Observation>(
  store: WitnessStore,
  feed: Feed<Observation>,
  observation: Observation,
  at: Witness,
): { readonly appended: number } {
  return appendWitnesses(store, feed.name, feed.cellize(observation, at));
}

/**
 * Project a feed's current state view and write it to the state tier.
 *
 * Functional attributes collapse to their latest witnessed value. Other
 * attributes accumulate distinct witnessed values. This is the ordinary read
 * model for tools that want one JSON object instead of the whole witness log.
 */
export function projectFeedState<Observation>(store: WitnessStore, feed: Feed<Observation>): StateView {
  const view = projectStateView(readWitnessLog(store, feed.name), new Set(feed.functional));
  writeJsonAtomic(store.stateDir, feed.name, view as unknown as JsonValue);
  return view;
}

/**
 * Project a feed's state view into per-entity content documents.
 *
 * The projection supplies the acceptance cut and renderer. By default, state is
 * folded from the live log; pass `opts.view` to cut a previously settled view.
 * The function returns the paths written under the store's content tier.
 */
export function projectFeedContent<Observation>(
  store: WitnessStore,
  feed: Feed<Observation>,
  opts: { readonly projection?: ContentProjection; readonly view?: StateView } = {},
): readonly string[] {
  const view = opts.view ?? projectStateView(readWitnessLog(store, feed.name), new Set(feed.functional));
  const documents = projectContentDocuments(view, opts.projection);
  return Object.freeze(documents.map((document) => writeContentDocument(store, document)));
}
