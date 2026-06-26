import assert from "node:assert/strict";

import {
  actionIrAudit,
  actions,
  freeTsActions,
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
const freeCarrierMorphisms = freeTsActions(actions);
const conflateCharge = inspectVerb("conflate-charge");
const inspect = inspectVerb("inspect");
const inspectAudit = audit.find((entry) => entry.verb === "inspect");

assert.equal(freeCarrierMorphisms.length, 0);
assert.equal(conflateCharge.hasRunTerm, true);
assert.equal(conflateCharge.termClosed, true);
assert.equal(conflateCharge.domain, "relating/articulating/predicating/positing/charge-value-name");
assert.equal(conflateCharge.codomain, "relating/articulating/predicating/positing/charge-value-name");
assert.ok(conflateCharge.termUses.includes("conflate"));
assert.equal(inspect.hasRunTerm, false);
assert.equal(inspect.termClosed, undefined);
assert.equal(inspectAudit?.relation, "boundary");
assert.equal(inspectAudit?.reason, "untyped boundary");

console.log(JSON.stringify({
  product: "relating.morphism-inspection",
  actionFamily: {
    total: actions.length,
    morphisms: morphisms.length,
    boundaries: boundaries.length,
    freeCarrierMorphisms: freeCarrierMorphisms.length,
  },
  reports: {
    conflateCharge,
    inspect,
  },
  boundaryAudit: {
    inspect: inspectAudit,
  },
}, null, 2));
