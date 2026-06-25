import {
  actionIrAudit,
  actions,
  induceBins,
  morphismCarrier,
} from "@emsenn/relating";

const apex = induceBins(actions, { packageName: "@emsenn/relating" });

function actionByVerb(verb) {
  const found = actions.find((candidate) => candidate.verb === verb);
  if (found === undefined) throw new Error(`missing action: ${verb}`);
  return found;
}

function inspectVerb(verb) {
  const carrier = morphismCarrier(actionByVerb(verb));
  const result = apex.dispatch(["inspect"], JSON.stringify(carrier));
  if (result.code !== 0) throw new Error(result.stderr);
  return JSON.parse(result.stdout);
}

const audit = actionIrAudit(actions);
const morphisms = audit.filter((entry) => entry.relation === "morphism");
const boundaries = audit.filter((entry) => entry.relation === "boundary");

console.log(JSON.stringify({
  product: "relating.morphism-inspection",
  actionFamily: {
    total: actions.length,
    morphisms: morphisms.length,
    boundaries: boundaries.length,
    freeCarrierMorphisms: morphisms.filter((entry) => !entry.hasRunTerm).length,
  },
  reports: {
    conflateCharge: inspectVerb("conflate-charge"),
    inspect: inspectVerb("inspect"),
  },
}, null, 2));
