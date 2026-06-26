import assert from "node:assert/strict";

import {
  chargeValue,
  chargeValueName,
  checkRelationTransform,
  composeTransforms,
  dual,
  dualTransform,
  idTransform,
  matrixEntryReading,
  pointProfile,
  relationFromMatrix,
  relationMatrix,
  stateExtension,
  stateProfile,
  transpose,
} from "@emsenn/relating";

const same = (left, right) => left === right;
const entitySet = (...entities) => Object.freeze({ kind: "predication.entitySet", entities: Object.freeze(entities) });
const predicateSet = (...predicates) => Object.freeze({ kind: "predication.predicateSet", predicates: Object.freeze(predicates) });
const name = (value) => chargeValueName(value);
const namedEntries = (entries, key) => entries.map((entry) => ({ [key]: entry[key], value: name(entry.value) }));

const matrix = relationMatrix(
  entitySet("alpha", "beta"),
  predicateSet("warm", "cold"),
  [
    ["alpha", "warm", chargeValue("potential")],
    ["alpha", "warm", chargeValue("active")],
    ["beta", "warm", chargeValue("active")],
    ["beta", "cold", chargeValue("stable")],
  ],
  { samePoint: same, sameState: same },
);

const carrier = relationFromMatrix(matrix);
const alphaWarm = matrixEntryReading(matrix, "alpha", "warm");
const missing = matrixEntryReading(matrix, "alpha", "cold");
const alphaProfile = pointProfile(carrier, "alpha");
const warmProfile = stateProfile(carrier, "warm");
const warmExtension = stateExtension(carrier, "warm");
const transposed = transpose(carrier);
const dualized = dual(carrier);
const identity = checkRelationTransform(carrier, carrier, (point) => point, (state) => state);
const identityTransform = idTransform(carrier);
const composedIdentity = composeTransforms(identityTransform, identityTransform);
const dualIdentity = dualTransform(identityTransform);
const shiftedTarget = relationFromMatrix(relationMatrix(
  entitySet("alpha", "beta"),
  predicateSet("warm", "cold"),
  [
    ["alpha", "warm", chargeValue("potential")],
    ["beta", "warm", chargeValue("active")],
    ["beta", "cold", chargeValue("stable")],
  ],
  { samePoint: same, sameState: same },
));
const nonAdjoint = checkRelationTransform(carrier, shiftedTarget, (point) => point, (state) => state);

assert.equal(matrix.values.length, 3);
assert.equal(alphaWarm.kind, "bilattice.relation.matrixEntry:witness");
assert.equal(name(alphaWarm.entry.value), "stable");
assert.equal(missing.kind, "bilattice.relation.matrixEntry-obstruction");
assert.deepEqual(namedEntries(alphaProfile.entries, "state"), [
  { state: "warm", value: "stable" },
  { state: "cold", value: "active" },
]);
assert.deepEqual(namedEntries(warmProfile.entries, "point"), [
  { point: "alpha", value: "stable" },
  { point: "beta", value: "active" },
]);
assert.deepEqual(warmExtension.points.entities, ["alpha"]);
assert.equal(name(transposed.at("warm", "alpha")), "stable");
assert.equal(name(dualized.at("warm", "beta")), "potential");
assert.equal(identity.kind, "bilattice.relation.transform:witness");
assert.equal(identityTransform.kind, "bilattice.relation.transform");
assert.equal(composedIdentity.kind, "bilattice.relation.transform");
assert.equal(dualIdentity.kind, "bilattice.relation.transform");
assert.equal(nonAdjoint.kind, "bilattice.relation.transform-obstruction");
assert.equal(nonAdjoint.rank.members.length, 1);
assert.equal(nonAdjoint.failures[0]?.kind, "bilattice.relation.transform.adjointness-obstruction");

console.log(JSON.stringify({
  product: "relating.relation-matrix",
  matrix: {
    populatedCells: matrix.values.length,
    duplicateJoin: name(alphaWarm.entry.value),
    absentLookup: missing.kind,
  },
  profiles: {
    pointAlpha: namedEntries(alphaProfile.entries, "state"),
    stateWarm: namedEntries(warmProfile.entries, "point"),
    warmExtension: warmExtension.points.entities,
  },
  duality: {
    transposeWarmAlpha: name(transposed.at("warm", "alpha")),
    dualWarmBeta: name(dualized.at("warm", "beta")),
  },
  transform: {
    identityCheck: identity.kind,
    identityCarrier: identityTransform.kind,
    composedIdentity: composedIdentity.kind,
    dualIdentity: dualIdentity.kind,
    nonAdjoint: {
      kind: nonAdjoint.kind,
      rank: nonAdjoint.rank.members.length,
      firstFailure: nonAdjoint.failures[0]?.kind,
      point: nonAdjoint.failures[0]?.point,
      state: nonAdjoint.failures[0]?.state,
      left: name(nonAdjoint.failures[0]?.left),
      right: name(nonAdjoint.failures[0]?.right),
    },
  },
}, null, 2));
