import assert from "node:assert/strict";
import Ajv from "ajv";

import {
  chu,
  descent,
  evaluate,
  evaluateRunTerm,
  fca,
  hasTy,
  inst,
  isClosed,
  measurement,
  readerTerms,
  rename,
  settlingTerms,
  subst,
  tm,
  ty,
  TySchema,
  TmSchema,
  termSize,
  termUses,
} from "@emsenn/relating";
import {
  carrierToTerm,
  termToCarrier,
} from "@emsenn/relating/evaluating/projecting";

const summarize = (name, term) => ({
  name,
  closed: isClosed(term),
  size: termSize(term),
  uses: termUses(term),
});

const identity = tm.lam(tm.var(0));
const pairFirst = tm.app(tm.lam(tm.fst(tm.var(0))), tm.pair(tm.charge("potential"), tm.charge("active")));
const joined = tm.joinK(tm.charge("potential"), tm.charge("active"));
const ajv = new Ajv({ schemas: [TySchema] });
const validateTy = ajv.compile(TySchema);
const validateTm = ajv.compile(TmSchema);
const notationType = ty.arrow(ty.unit(), ty.prod(ty.base(), ty.unit()));
const openProjection = tm.fst(tm.var(0));
const renamedProjection = rename((index) => index + 1, openProjection);
const substitutedProjection = subst((index) => index === 0 ? tm.star() : tm.var(index), openProjection);
const instantiatedProjection = inst(tm.fst(tm.var(0)), tm.pair(tm.charge("potential"), tm.charge("active")));
const inputCarrier = { status: "potential", tags: ["alpha", "beta"] };
const bridged = carrierToTerm(inputCarrier);
const projectedStatus = evaluate(tm.field("status", bridged));
const runTermOutput = evaluateRunTerm(tm.lam(tm.field("status", tm.var(0))), inputCarrier);
const closedType = ty.arrow(ty.base(), ty.base());

assert.equal(validateTy(notationType), true);
assert.equal(validateTm(identity), true);
assert.equal(validateTm(["lambda", ["var", 0]]), false);
assert.deepEqual(renamedProjection, tm.fst(tm.var(1)));
assert.deepEqual(substitutedProjection, tm.fst(tm.star()));
assert.deepEqual(evaluate(instantiatedProjection), tm.charge("potential"));
assert.equal(isClosed(identity), true);
assert.equal(hasTy([], identity, closedType), true);
assert.deepEqual(evaluate(pairFirst), tm.charge("potential"));
assert.deepEqual(evaluate(joined), tm.charge("stable"));
assert.deepEqual(termToCarrier(bridged), inputCarrier);
assert.deepEqual(projectedStatus, tm.charge("potential"));
assert.equal(runTermOutput, "potential");

console.log(JSON.stringify({
  product: "relating.rmn-products",
  notation: {
    tySchemaId: TySchema.$id,
    tmSchemaId: TmSchema.$id,
    validType: validateTy(notationType),
    validIdentityTerm: validateTm(identity),
    rejectsUnknownTag: !validateTm(["lambda", ["var", 0]]),
    rename: renamedProjection,
    subst: substitutedProjection,
    instNormalForm: evaluate(instantiatedProjection),
  },
  core: {
    identity: summarize("λx.x", identity),
    identityHasBaseArrowType: hasTy([], identity, closedType),
    pairProjectionNormalForm: evaluate(pairFirst),
    chargeJoinNormalForm: evaluate(joined),
  },
  bridge: {
    input: inputCarrier,
    encodedUses: termUses(bridged),
    statusNormalForm: projectedStatus,
    roundTrip: termToCarrier(bridged),
    runTermOutput,
  },
  descent: summarize("descent.articulate", descent.articulate),
  settling: summarize("settlingTerms.free", settlingTerms.free),
  reader: summarize("readerTerms.readClassification", readerTerms.readClassification),
  measurement: summarize("measurement.classifyRegime", measurement.classifyRegime),
  fca: summarize("fca.formalConcept", fca.formalConcept),
  chu: summarize("chu.dual", chu.dual),
}, null, 2));
