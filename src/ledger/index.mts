/**
 * @packageDocumentation
 *
 * ledger (RWIL) is the witness ledger as boundary-to-bulk holography — a first-class
 * capability peer to `writing`/`evaluating`/`running`, not a child of `running`. The
 * witness ROW codecs (EAVT/Datom/triple) live in `writing`; this is their projection
 * engine. Reached at `@emsenn/relating/ledger`.
 *
 * ```text
 * <logDir>/<feed>.jsonl      append-only EAVT witnesses
 * <stateDir>/<feed>.json     current view projected from the log
 * <recordDir>/<feed>.jsonl   settled Datoms, with the live log compacted
 * <contentDir>/<term>/...    per-entity content cuts of the projected bulk
 * ```
 *
 * This is event sourcing in the package's own vocabulary. The log is the
 * write-model. State is the current read-model. Records are received
 * judgements about witnessed cells. Content is a cut of the same bulk into
 * ordinary documents.
 *
 * A caller authors one {@link Feed}: a feed name, a cellizer from observations
 * to EAVT rows, and the attributes whose latest witness should win. The
 * projection functions are pure folds over witnessed rows; `store` is the one
 * filesystem binding. The same witness log can also be projected as resumable
 * Server-Sent Events through {@link streamWitnessLog}. That split is the
 * product: agents and packages can share append-only traces while deriving JSON
 * state, records, content files, and live transport frames without inventing
 * separate persistence stories.
 */

export { cell, attributesOf, type Witness } from "./cells.mjs";
export { projectStateView, type EntityView, type StateView } from "./state.mjs";
export {
  type WitnessStore,
  feedPath,
  ensureStoreDirs,
  readWitnessLog,
  appendWitnesses,
  writeFileAtomic,
  writeJsonAtomic,
  writeContentDocument,
  confine,
  readContentResource,
  listContentEntries,
  readContentTree,
  type ContentEntry,
  appendJsonl,
  readJsonl,
  readJsonFile,
  commitRecord,
} from "./store.mjs";
export {
  markdownContent,
  projectContentDocuments,
  type ContentDocument,
  type ContentProjection,
} from "./content.mjs";
export { witnessObservation, projectFeedState, projectFeedContent, type Feed } from "./feed.mjs";
export { streamWitnessLog, EAVT_EVENT, feedResponse, type FeedResponse } from "./stream.mjs";
export {
  readingDescriptorSchema,
  readingDescriptorCarrier,
  logReadingDescriptorSchema,
  logReadingDescriptorCarrier,
  coherenceReportSchema,
  coherenceReportCarrier,
  logCoherenceReportSchema,
  logCoherenceReportCarrier,
  sameWitness,
  sameWitnessLog,
  cohere,
  cohereLog,
  assertCoherent,
  assertLogCoherent,
  readingAsLogReading,
  registerReading,
  registerLogReading,
  readingById,
  logReadingById,
  readings,
  logReadings,
  type ReadingDescriptor,
  type LogReadingDescriptor,
  type RWILWitness,
  type RWILWitnessLog,
  type Reading,
  type LogReading,
  type CoherenceReport,
  type LogCoherenceReport,
} from "./reading.mjs";
export * from "./provenance.mjs";
export * from "./time-anchor.mjs";
export * from "./memento.mjs";
