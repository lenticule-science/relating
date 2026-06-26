import assert from "node:assert/strict";

import { mark, token, claim, predicating } from "@emsenn/relating/articulating";

const { positing } = predicating;
const { logic } = positing;

const alpha = token(mark("alpha"));
const beta = token(mark("beta"));
const supports = predicating.predicateOfClaim(claim(mark("supports")));
const entities = predicating.entitySet([alpha, beta], predicating.termCoincides);
const cells = positing.allCells(entities);

const valueName = (value) => positing.chargeValueName(value);
const sameTerm = predicating.termCoincides;
const isAlpha = (term) => sameTerm(term, alpha);
const isBeta = (term) => sameTerm(term, beta);
const atName = (fiber, subject, object) => valueName(fiber.at(subject, object));

const evidenceFor = positing.predicateFiber(supports, entities, (subject, object) => {
  if (isAlpha(subject) && isAlpha(object)) return positing.chargeValue("potential");
  if (isAlpha(subject) && isBeta(object)) return positing.chargeValue("active");
  if (isBeta(subject) && isAlpha(object)) return positing.chargeValue("stable");
  return positing.chargeValue("absurd");
});

const evidenceAgainst = positing.predicateFiber(supports, entities, (subject, object) => {
  if (isAlpha(subject) && isAlpha(object)) return positing.chargeValue("active");
  if (isAlpha(subject) && isBeta(object)) return positing.chargeValue("potential");
  if (isBeta(subject) && isAlpha(object)) return positing.chargeValue("potential");
  return positing.chargeValue("stable");
});

const fusion = positing.predicationFiberLinearFusion(evidenceFor, evidenceAgainst);
const residuum = positing.predicationFiberLinearResiduum(evidenceFor, evidenceAgainst);
const converse = positing.converse(entities);
const support = Object.freeze([[alpha, beta]]);
const specialization = positing.specialization(entities, support, cells);
const restricted = specialization.pullback(evidenceFor);
const expandedExists = specialization.exists(positing.truthOrder(), restricted);
const expandedForall = specialization.forall(positing.truthOrder(), restricted);

const consistency = logic.chargeConsistency(positing.chargeValue("potential"));
const contradiction = logic.chargeConsistency(positing.chargeValue("stable"));
const residuation = logic.truthOrderResiduation(
  positing.chargeValue("active"),
  positing.chargeValue("potential"),
  positing.chargeValue("potential"),
);

assert.equal(evidenceFor.kind, "predication.fiber.predicate");
assert.equal(fusion.kind, "predication.fiber.predicate");
assert.equal(residuum.kind, "predication.fiber.predicate");
assert.equal(consistency.kind, "bilattice.linearLogic.chargeConsistency:witness");
assert.equal(contradiction.kind, "bilattice.linearLogic.chargeConsistency-obstruction");
assert.equal(residuation.kind, "bilattice.linearLogic.truthOrderResiduation:witness");
assert.equal(positing.generatorPreservesLinearFusion(converse, evidenceFor, evidenceAgainst), true);
assert.equal(positing.generatorPreservesLinearResiduum(converse, evidenceFor, evidenceAgainst), true);
assert.equal(
  positing.generatorSatisfiesLinearFusionFrobenius(converse, positing.truthOrder(), evidenceFor, evidenceAgainst),
  true,
);
assert.equal(restricted.cells.length, 1);
assert.equal(atName(restricted, alpha, beta), "active");
assert.equal(atName(expandedExists, beta, beta), "active");
assert.equal(atName(expandedForall, beta, beta), "potential");

console.log(JSON.stringify({
  product: "relating.predication-fiber-logic",
  valueLogic: {
    consistency: consistency.kind,
    contradiction: contradiction.kind,
    residuation: residuation.kind,
    fusionActivePotential: valueName(logic.linearFusionValue(
      positing.chargeValue("active"),
      positing.chargeValue("potential"),
    )),
    residuumActivePotential: valueName(logic.linearResiduumValue(
      positing.chargeValue("active"),
      positing.chargeValue("potential"),
    )),
  },
  fibers: {
    cells: cells.length,
    alphaBeta: atName(evidenceFor, alpha, beta),
    betaAlpha: atName(evidenceFor, beta, alpha),
    fusionAlphaBeta: atName(fusion, alpha, beta),
    residuumAlphaBeta: atName(residuum, alpha, beta),
  },
  generators: {
    conversePreservesFusion: positing.generatorPreservesLinearFusion(converse, evidenceFor, evidenceAgainst),
    conversePreservesResiduum: positing.generatorPreservesLinearResiduum(converse, evidenceFor, evidenceAgainst),
    converseFrobenius: positing.generatorSatisfiesLinearFusionFrobenius(
      converse,
      positing.truthOrder(),
      evidenceFor,
      evidenceAgainst,
    ),
    specializationSupport: restricted.cells.length,
    existsOutsideSupport: atName(expandedExists, beta, beta),
    forallOutsideSupport: atName(expandedForall, beta, beta),
  },
  boundary: "finite FOUR-valued predicate fibers and value-level linear logic; not full Lambek/Chu proof search",
}, null, 2));
