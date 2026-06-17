import assert from "node:assert/strict";
import test from "node:test";

import {
  articulate,
  cell,
  cellIdentity,
  claim,
  induce,
  isArticulationCarrier,
  knowledgeLeastMemeOfSingleUtterance,
  mark,
  materializePredicationCategory,
  predicate,
  predicateOfClaim,
  predicationCarrier,
  readCharge,
  settleOneTraced,
  singleUtteranceTopology,
  specializationMorphism,
  token,
  utterance,
} from "../../../../index.mjs";
import { isCell, natEqual, natOne } from "../../../../algebra/index.mjs";
import {
  composePredicateWordPotential,
  derivationValidity,
  deriveInBase,
  predicateWordArrow,
  theoryOfBase,
} from "../../../../logic/index.mjs";
import { potentialCarrier } from "../../../../index.mjs";

const tm = (value: string) => token(mark(value));
const cl = (value: string) => claim(mark(value));
const pr = (value: string) => predicateOfClaim(cl(value));

test("utterance constructors expose stable runtime carrier shapes", () => {
  const left = mark("token");
  const right = mark("claim");
  const carrier = utterance(left, right);
  const articulation = articulate(carrier);
  const open = potentialCarrier([left, right]);
  const openedCarrier = potentialCarrier(carrier);
  const potentialCell = articulation.potentialAperiodicArticulationCell;

  assert.equal(articulation.kind, "utterance.aperiodicArticulationCategory");
  assert.equal(potentialCell[0], carrier);
  assert.deepEqual(potentialCell[1], [[], []]);
  assert.equal(isArticulationCarrier(articulation), true);
  assert.equal(open.kind, "utterance.potential");
  assert.equal(open.potential[0]?.kind, "utterance.token");
  assert.equal(open.potential[1]?.kind, "utterance.claim");
  assert.deepEqual(openedCarrier.potential, [carrier.token, carrier.claim]);
  assert.equal(Object.isFrozen(carrier), true);
  assert.equal(Object.isFrozen(articulation), true);
});

test("typed theory derives judgments over predication carriers", () => {
  const socrates = tm("socrates");
  const human = tm("human");
  const a = tm("a");
  const b = tm("b");
  const c = tm("c");
  const p = pr("p");
  const q = pr("q");
  const base = predicationCarrier([specializationMorphism(socrates, human)]).base;
  const theory = theoryOfBase(base);
  const derivability = deriveInBase(base, human, socrates);
  const potential = composePredicateWordPotential({
    kind: "typedTheory.predicateWordPotential",
    potential: [
      predicateWordArrow(a, p, b),
      predicateWordArrow(b, q, c),
    ],
  });

  assert.equal(theory.rules[0]?.trace.morphisms[0]?.kind, "typedTheory.inferenceMorphism.specialization");
  assert.equal(derivability.kind, "typedTheory.derivationSearch:witness");
  if (derivability.kind !== "typedTheory.derivationSearch:witness") throw new TypeError("expected derivation witness");
  assert.equal(derivability.derivation.kind, "typedTheory.derivation");
  assert.equal(natEqual(derivability.derivation.length, natOne), true);
  assert.equal(derivationValidity(theory, derivability.derivation).kind, "typedTheory.derivationCheck:witness");
  assert.equal(potential.potential.length, 3);
});

test("meme-topology helpers wire single-utterance and witnessed APIs", () => {
  const topology = induce([utterance(mark({ subject: "socrates", object: "truth" }), mark("speaks"))]);
  const left = mark("token");
  const right = mark("claim");
  const carrier = utterance(left, right);
  const single = singleUtteranceTopology(left, right);
  const expected = materializePredicationCategory(predicate(articulate(carrier)));
  const witnessed = single.witnesses[0];
  const settled = knowledgeLeastMemeOfSingleUtterance([left, right]);
  const traced = settleOneTraced(carrier);

  assert.equal(topology.kind, "meme-topology.carrier");
  assert.equal(topology.proofs.kind, "typedTheory.proof.carrier");
  assert.equal(topology.fixedPointReadings.knowledgeLeast.extremum.sheaf.section.fibers.length, 1);
  assert.equal(single.kind, "meme-topology.carrier");
  assert.equal(single.proofs.kind, "typedTheory.proof.carrier");
  assert.equal(single.fixedPoints.knowledge.least.sheaf.section.fibers.length, 1);
  assert.equal(witnessed?.kind, "utterance.carrier");
  assert.equal(isCell(settled.cell), true);
  assert.equal(cellIdentity(traced.meme.cell, expected.cells.cells[0]!).kind, "predication.cellIdentity:witness");
  assert.equal(settled.kind, "predication.fiber.meme");
  assert.equal(traced.kind, "meme-topology.singleSettling.carrier");
  assert.equal(traced.meme.kind, "predication.fiber.meme");
});
