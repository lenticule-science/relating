import {
  actionIrAudit,
  actions,
  freeTsActions,
  induceBins,
} from "@emsenn/relating";

const induced = induceBins(actions, { packageName: "@emsenn/relating" });
const dispatchResult = induced.dispatch(["conflate-charge"], "\"stable\"");

console.log(JSON.stringify({
  product: "relating.action-apex",
  actionCount: actions.length,
  firstVerbs: induced.discovery.bins.slice(0, 8).map((bin) => bin.name),
  freeCarrierMorphisms: freeTsActions(actions).length,
  boundaryExamples: actionIrAudit(actions)
    .filter((entry) => entry.relation === "boundary")
    .slice(0, 4)
    .map((entry) => ({ verb: entry.verb, reason: entry.reason, hasRunTerm: entry.hasRunTerm })),
  dispatch: {
    verb: "conflate-charge",
    input: "stable",
    output: JSON.parse(dispatchResult.stdout),
  },
}, null, 2));
