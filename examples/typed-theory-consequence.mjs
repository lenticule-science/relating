import assert from "node:assert/strict";

import { mark, token, claim, predicating } from "@emsenn/relating/articulating";

const { typedTheory } = predicating;

const naturalNumber = (natural) => natural.members.length;
const termName = (term) => term.mark.value;

const alpha = token(mark("alpha"));
const beta = token(mark("beta"));
const gamma = token(mark("gamma"));
const supports = predicating.predicateOfClaim(claim(mark("supports")));
const refines = predicating.predicateOfClaim(claim(mark("refines")));

const supportCell = predicating.cell(alpha, supports, beta);
const supportNode = Object.freeze([alpha, supports, beta]);
const specialization = predicating.specializationMorphism(beta, gamma);

const theory = typedTheory.theoryOfData([supportCell, specialization]);
const objectJudgment = typedTheory.typing(theory, supportNode, beta);
const specializationJudgment = typedTheory.typing(theory, gamma, beta);
const obstruction = typedTheory.typing(theory, beta, gamma);
const closure = typedTheory.derivationClosure(theory);
const proof = typedTheory.typedTheoryProofCarrier(theory);

assert.equal(theory.kind, "typedTheory.carrier");
assert.equal(objectJudgment.kind, "typedTheory.typing:witness");
assert.equal(specializationJudgment.kind, "typedTheory.typing:witness");
assert.equal(obstruction.kind, "typedTheory.typing-obstruction");
assert.equal(closure.kind, "typedTheory.derivationClosure");
assert.equal(proof.obstructions.length, 0);
assert.equal(
  objectJudgment.derivation.steps[0].rule.trace.morphisms[0].kind,
  "typedTheory.inferenceMorphism.objectProjection",
);
assert.equal(
  specializationJudgment.derivation.steps.at(-1).rule.trace.morphisms.at(-1).kind,
  "typedTheory.inferenceMorphism.specialization",
);

const wordA = typedTheory.predicateWordArrow(alpha, supports, beta);
const wordB = typedTheory.predicateWordArrow(beta, refines, gamma);
const residue = typedTheory.predicateWordResidue({ arrows: [wordA, wordB] });
const composite = residue.saturated.arrows.find((arrow) =>
  predicating.termCoincides(arrow.subject, alpha)
  && predicating.termCoincides(arrow.object, gamma)
  && arrow.word.length === 2);

assert.equal(residue.kind, "typedTheory.predicateWordResidue");
assert.ok(composite);
assert.deepEqual(composite.word.map((predicate) => predicate.mark.value), ["supports", "refines"]);

console.log(JSON.stringify({
  product: "relating.typed-theory-consequence",
  theory: {
    objects: theory.objects.length,
    rules: theory.rules.length,
    closureRank: naturalNumber(closure.generatedRank),
    residualRank: naturalNumber(closure.residualRank),
    proofRank: naturalNumber(proof.rank),
  },
  derivation: {
    premise: "supportNode",
    conclusion: termName(beta),
    kind: objectJudgment.kind,
    steps: naturalNumber(objectJudgment.derivation.length),
    firstMorphism: objectJudgment.derivation.steps[0].rule.trace.morphisms[0].kind,
  },
  specializationDerivation: {
    premise: termName(gamma),
    conclusion: termName(beta),
    kind: specializationJudgment.kind,
    steps: naturalNumber(specializationJudgment.derivation.length),
  },
  obstruction: {
    kind: obstruction.kind,
    explored: naturalNumber(obstruction.search.rank),
  },
  predicateWords: {
    saturated: residue.saturated.arrows.length,
    atomic: residue.atomic.arrows.length,
    composites: residue.composites.map((word) => word.map((predicate) => predicate.mark.value)),
  },
}, null, 2));
