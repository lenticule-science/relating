// holography/projecting — the witness ledger as boundary→bulk holography.
//
//   <logDir>/<feed>.jsonl    append-only EAVT witnesses (the boundary / write-model)
//   <stateDir>/<feed>.json   the current view, projected from the log (bulk / read-model)
//   <recordDir>/<feed>.jsonl settled invariants (Datoms), log compacted (bulk)
//   <contentDir>/<term>/<term>.<type>  per-entity content cut of the bulk
//
// This is event sourcing in the corpus's own vocabulary: the append-only log is
// the write-model, the projected state is the read-model, the record tier is the
// settled snapshot, and the content tier is a per-entity cut of the bulk
// (default: markdown with YAML frontmatter). The projection morphisms are PURE;
// ./store is the single effectful binding. A caller defines a Feed and the tiers
// are generic over it — the same machine that witnesses a domain feed witnesses
// a package's invocations.

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
