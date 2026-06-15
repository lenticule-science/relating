import {
  predicationBaseObjectCoincidenceHolds,
  predicationPredicateCoincidenceHolds,
  predicationTermCoincidenceHolds,
} from "../algebra/index.mjs";
import {
  isSpecializationMorphism,
  type BaseCategory,
  type Cell,
  type PredicationBaseObject,
  type PredicationPredicate,
  type PredicationTerm,
  type PredicationDatum,
} from "../algebra/index.mjs";
import { fromCount, type Natural } from "../algebra/index.mjs";

export interface SpecializationInferenceMorphism {
  readonly kind: "typedTheory.inferenceMorphism.specialization";
}

export interface ConverseInferenceMorphism {
  readonly kind: "typedTheory.inferenceMorphism.converse";
}

export interface SubjectProjectionInferenceMorphism {
  readonly kind: "typedTheory.inferenceMorphism.subjectProjection";
}

export interface ObjectProjectionInferenceMorphism {
  readonly kind: "typedTheory.inferenceMorphism.objectProjection";
}

export type InferenceMorphism =
  | SpecializationInferenceMorphism
  | ConverseInferenceMorphism
  | SubjectProjectionInferenceMorphism
  | ObjectProjectionInferenceMorphism;

export interface InferenceMorphismIdentityWitness {
  readonly kind: "typedTheory.inferenceMorphismIdentity:witness";
  readonly left: InferenceMorphism;
  readonly right: InferenceMorphism;
}

export interface InferenceMorphismIdentityObstruction {
  readonly kind: "typedTheory.inferenceMorphismIdentity-obstruction";
  readonly left: InferenceMorphism;
  readonly right: InferenceMorphism;
}

export type InferenceMorphismIdentityJudgment = InferenceMorphismIdentityWitness | InferenceMorphismIdentityObstruction;

export interface InferenceTraceCarrier {
  readonly kind: "typedTheory.inferenceTrace";
  readonly morphisms: readonly InferenceMorphism[];
}

export interface InferenceRule {
  readonly kind: "typedTheory.inferenceRule";
  readonly domain: PredicationBaseObject;
  readonly trace: InferenceTraceCarrier;
  readonly codomain: PredicationBaseObject;
}

export interface InferenceRuleIdentityWitness {
  readonly kind: "typedTheory.inferenceRuleIdentity:witness";
  readonly left: InferenceRule;
  readonly right: InferenceRule;
}

export interface InferenceRuleIdentityObstruction {
  readonly kind: "typedTheory.inferenceRuleIdentity-obstruction";
  readonly left: InferenceRule;
  readonly right: InferenceRule;
}

export type InferenceRuleIdentityJudgment = InferenceRuleIdentityWitness | InferenceRuleIdentityObstruction;

export interface TypedTheoryCarrier {
  readonly kind: "typedTheory.carrier";
  readonly objects: readonly PredicationBaseObject[];
  readonly rules: readonly InferenceRule[];
}

export interface DerivationStep {
  readonly kind: "typedTheory.derivationStep";
  readonly premise: PredicationBaseObject;
  readonly rule: InferenceRule;
  readonly conclusion: PredicationBaseObject;
}

export interface Derivation {
  readonly kind: "typedTheory.derivation";
  readonly theory: TypedTheoryCarrier;
  readonly premise: PredicationBaseObject;
  readonly conclusion: PredicationBaseObject;
  readonly steps: readonly DerivationStep[];
  readonly length: Natural;
}

export interface DerivationIdentityWitness {
  readonly kind: "typedTheory.derivationIdentity:witness";
  readonly left: Derivation;
  readonly right: Derivation;
}

export interface DerivationIdentityObstruction {
  readonly kind: "typedTheory.derivationIdentity-obstruction";
  readonly left: Derivation;
  readonly right: Derivation;
}

export type DerivationIdentityJudgment = DerivationIdentityWitness | DerivationIdentityObstruction;

export interface DerivationSearchWitness {
  readonly kind: "typedTheory.derivationSearch:witness";
  readonly theory: TypedTheoryCarrier;
  readonly premise: PredicationBaseObject;
  readonly conclusion: PredicationBaseObject;
  readonly derivation: Derivation;
}

export interface DerivationSearchObstruction {
  readonly kind: "typedTheory.derivationSearch-obstruction";
  readonly theory: TypedTheoryCarrier;
  readonly premise: PredicationBaseObject;
  readonly conclusion: PredicationBaseObject;
  readonly explored: readonly PredicationBaseObject[];
  readonly rank: Natural;
}

export type DerivationSearchJudgment = DerivationSearchWitness | DerivationSearchObstruction;

export interface TypingJudgmentWitness {
  readonly kind: "typedTheory.typing:witness";
  readonly theory: TypedTheoryCarrier;
  readonly premise: PredicationBaseObject;
  readonly conclusion: PredicationBaseObject;
  readonly derivation: Derivation;
}

export interface TypingJudgmentObstruction {
  readonly kind: "typedTheory.typing-obstruction";
  readonly theory: TypedTheoryCarrier;
  readonly premise: PredicationBaseObject;
  readonly conclusion: PredicationBaseObject;
  readonly search: DerivationSearchObstruction;
}

export type TypingJudgment = TypingJudgmentWitness | TypingJudgmentObstruction;

export interface DerivationObstruction {
  readonly kind: "typedTheory.derivation-obstruction";
  readonly theory: TypedTheoryCarrier;
  readonly at: PredicationBaseObject;
  readonly step: DerivationStep;
}

export interface DerivationClosure {
  readonly kind: "typedTheory.derivationClosure";
  readonly theory: TypedTheoryCarrier;
  readonly generated: readonly InferenceRule[];
  readonly generatedRank: Natural;
  readonly residual: readonly InferenceRule[];
  readonly residualRank: Natural;
}

export interface DerivationCheckWitness {
  readonly kind: "typedTheory.derivationCheck:witness";
  readonly theory: TypedTheoryCarrier;
  readonly derivation: Derivation;
}

export type DerivationCheckJudgment = DerivationCheckWitness | DerivationObstruction;

export interface TypedTheoryProofCarrier {
  readonly kind: "typedTheory.proof.carrier";
  readonly theory: TypedTheoryCarrier;
  readonly closure: DerivationClosure;
  readonly judgments: readonly TypingJudgment[];
  readonly obstructions: readonly TypingJudgmentObstruction[];
  readonly rank: Natural;
}

export type PredicateWord = readonly PredicationPredicate[];

export interface PredicateWordArrow {
  readonly kind: "typedTheory.predicateWordArrow";
  readonly subject: PredicationTerm;
  readonly word: PredicateWord;
  readonly object: PredicationTerm;
}

export interface PredicateWordCarrier {
  readonly kind: "typedTheory.predicateWord.carrier";
  readonly arrows: readonly PredicateWordArrow[];
}

export interface PredicateWordPotential {
  readonly kind: "typedTheory.predicateWordPotential";
  readonly potential: readonly PredicateWordArrow[];
}

export interface PredicateWordResidue {
  readonly kind: "typedTheory.predicateWordResidue";
  readonly saturated: PredicateWordCarrier;
  readonly atomic: PredicateWordCarrier;
  readonly composites: readonly PredicateWord[];
}

export const cellOf = (subject: PredicationTerm, predicate: PredicationPredicate, object: PredicationTerm): Cell => ({ subject, predicate, object });

const inferenceRule = (
  morphism: InferenceMorphism,
  domain: PredicationBaseObject,
  codomain: PredicationBaseObject,
  trace: InferenceTraceCarrier = inferenceTrace([morphism]),
): InferenceRule => Object.freeze({
  kind: "typedTheory.inferenceRule" as const,
  domain,
  trace,
  codomain,
});

export const specializationInferenceMorphism = (): SpecializationInferenceMorphism => Object.freeze({
  kind: "typedTheory.inferenceMorphism.specialization" as const,
});

export const converseInferenceMorphism = (): ConverseInferenceMorphism => Object.freeze({
  kind: "typedTheory.inferenceMorphism.converse" as const,
});

export const subjectProjectionInferenceMorphism = (): SubjectProjectionInferenceMorphism => Object.freeze({
  kind: "typedTheory.inferenceMorphism.subjectProjection" as const,
});

export const objectProjectionInferenceMorphism = (): ObjectProjectionInferenceMorphism => Object.freeze({
  kind: "typedTheory.inferenceMorphism.objectProjection" as const,
});

export function inferenceTrace(morphisms: readonly InferenceMorphism[]): InferenceTraceCarrier {
  return Object.freeze({
    kind: "typedTheory.inferenceTrace" as const,
    morphisms: Object.freeze([...morphisms]),
  });
}

export function inferenceRules(witnesses: readonly PredicationDatum[]): readonly InferenceRule[] {
  const out: InferenceRule[] = [];
  for (const witness of witnesses) {
    if (isSpecializationMorphism(witness)) out.push(inferenceRule(specializationInferenceMorphism(), witness.domain, witness.codomain));
    else {
      const cell = witness;
      const node = Object.freeze([cell.subject, cell.predicate, cell.object] as const);
      out.push(inferenceRule(converseInferenceMorphism(), node, Object.freeze([cell.object, cell.predicate, cell.subject] as const)));
      out.push(inferenceRule(subjectProjectionInferenceMorphism(), node, cell.subject));
      out.push(inferenceRule(objectProjectionInferenceMorphism(), node, cell.object));
    }
  }
  return Object.freeze(out);
}

const ruleOfBaseEdge = (morphism: InferenceMorphism) => (edge: { readonly domain: PredicationBaseObject; readonly codomain: PredicationBaseObject }): InferenceRule =>
  inferenceRule(morphism, edge.domain, edge.codomain);

export function theoryOfBase(base: BaseCategory): TypedTheoryCarrier {
  return Object.freeze({
    kind: "typedTheory.carrier" as const,
    objects: base.objects,
    rules: Object.freeze([
      ...base.specialization.map(ruleOfBaseEdge(specializationInferenceMorphism())),
      ...base.converse.map(ruleOfBaseEdge(converseInferenceMorphism())),
      ...base.subjectProjection.map(ruleOfBaseEdge(subjectProjectionInferenceMorphism())),
      ...base.objectProjection.map(ruleOfBaseEdge(objectProjectionInferenceMorphism())),
    ]),
  });
}

export function theoryOfData(data: readonly PredicationDatum[]): TypedTheoryCarrier {
  const rules = inferenceRules(data);
  const objects: PredicationBaseObject[] = [];
  for (const rule of rules) {
    if (!objects.some((object) => predicationBaseObjectCoincidenceHolds(object, rule.domain))) objects.push(rule.domain);
    if (!objects.some((object) => predicationBaseObjectCoincidenceHolds(object, rule.codomain))) objects.push(rule.codomain);
  }
  return Object.freeze({
    kind: "typedTheory.carrier" as const,
    objects: Object.freeze(objects),
    rules,
  });
}

export function inferenceMorphismIdentity(left: InferenceMorphism, right: InferenceMorphism): InferenceMorphismIdentityJudgment {
  const witness = (): InferenceMorphismIdentityWitness => Object.freeze({
    kind: "typedTheory.inferenceMorphismIdentity:witness" as const,
    left,
    right,
  });
  const obstruction = (): InferenceMorphismIdentityObstruction => Object.freeze({
    kind: "typedTheory.inferenceMorphismIdentity-obstruction" as const,
    left,
    right,
  });
  switch (left.kind) {
    case "typedTheory.inferenceMorphism.specialization":
      switch (right.kind) {
        case "typedTheory.inferenceMorphism.specialization":
          return witness();
        default:
          return obstruction();
      }
    case "typedTheory.inferenceMorphism.converse":
      switch (right.kind) {
        case "typedTheory.inferenceMorphism.converse":
          return witness();
        default:
          return obstruction();
      }
    case "typedTheory.inferenceMorphism.subjectProjection":
      switch (right.kind) {
        case "typedTheory.inferenceMorphism.subjectProjection":
          return witness();
        default:
          return obstruction();
      }
    case "typedTheory.inferenceMorphism.objectProjection":
      switch (right.kind) {
        case "typedTheory.inferenceMorphism.objectProjection":
          return witness();
        default:
          return obstruction();
      }
  }
}

const inferenceMorphismsCoincide = (left: InferenceMorphism, right: InferenceMorphism): boolean =>
  inferenceMorphismIdentity(left, right).kind === "typedTheory.inferenceMorphismIdentity:witness";

const sameTrace = (left: InferenceTraceCarrier, right: InferenceTraceCarrier): boolean =>
  left.morphisms.length === right.morphisms.length
  && left.morphisms.every((morphism, index) => inferenceMorphismsCoincide(morphism, right.morphisms[index]!));

function inferenceRulesCoincide(left: InferenceRule, right: InferenceRule): boolean {
  return predicationBaseObjectCoincidenceHolds(left.domain, right.domain)
    && predicationBaseObjectCoincidenceHolds(left.codomain, right.codomain)
    && sameTrace(left.trace, right.trace);
}

export function inferenceRuleIdentity(left: InferenceRule, right: InferenceRule): InferenceRuleIdentityJudgment {
  return inferenceRulesCoincide(left, right)
    ? Object.freeze({
      kind: "typedTheory.inferenceRuleIdentity:witness" as const,
      left,
      right,
    })
    : Object.freeze({
      kind: "typedTheory.inferenceRuleIdentity-obstruction" as const,
      left,
      right,
    });
}

const sameGeneratedRule = (left: InferenceRule, right: InferenceRule): boolean =>
  predicationBaseObjectCoincidenceHolds(left.domain, right.domain)
  && predicationBaseObjectCoincidenceHolds(left.codomain, right.codomain);

const composeRule = (left: InferenceRule, right: InferenceRule): InferenceRule =>
  Object.freeze({
    kind: "typedTheory.inferenceRule" as const,
    domain: left.domain,
    trace: inferenceTrace([...left.trace.morphisms, ...right.trace.morphisms]),
    codomain: right.codomain,
  });

export function composeInferenceRules(rules: readonly InferenceRule[]): readonly InferenceRule[] {
  const out: InferenceRule[] = [...rules];
  for (const left of rules) {
    for (const right of rules) {
      if (!predicationBaseObjectCoincidenceHolds(left.codomain, right.domain)) continue;
      const rule = composeRule(left, right);
      if (!out.some((existing) => sameGeneratedRule(existing, rule))) out.push(rule);
    }
  }
  return Object.freeze(out);
}

export function derivationClosure(theory: TypedTheoryCarrier): DerivationClosure {
  let rules = Object.freeze([...theory.rules]);
  for (;;) {
    const next = composeInferenceRules(rules);
    if (sameGeneratedRuleSet(next, rules)) {
      const closedTheory = Object.freeze({ ...theory, rules });
      const residual = Object.freeze(rules.filter((rule) => !theory.rules.some((original) => sameGeneratedRule(original, rule))));
      return Object.freeze({
        kind: "typedTheory.derivationClosure" as const,
        theory: closedTheory,
        generated: rules,
        generatedRank: fromCount(rules.length),
        residual,
        residualRank: fromCount(residual.length),
      });
    }
    rules = next;
  }
}

const sameGeneratedRuleSet = (left: readonly InferenceRule[], right: readonly InferenceRule[]): boolean =>
  left.length === right.length && left.every((rule) => right.some((other) => sameGeneratedRule(rule, other)));

const derivationSearchWitness = (
  theory: TypedTheoryCarrier,
  premise: PredicationBaseObject,
  conclusion: PredicationBaseObject,
  derivation: Derivation,
): DerivationSearchWitness => Object.freeze({
  kind: "typedTheory.derivationSearch:witness" as const,
  theory,
  premise,
  conclusion,
  derivation,
});

const derivationSearchObstruction = (
  theory: TypedTheoryCarrier,
  premise: PredicationBaseObject,
  conclusion: PredicationBaseObject,
  explored: readonly PredicationBaseObject[],
): DerivationSearchObstruction => Object.freeze({
  kind: "typedTheory.derivationSearch-obstruction" as const,
  theory,
  premise,
  conclusion,
  explored: Object.freeze([...explored]),
  rank: fromCount(explored.length),
});

export function derive(theory: TypedTheoryCarrier, premise: PredicationBaseObject, conclusion: PredicationBaseObject): DerivationSearchJudgment {
  if (predicationBaseObjectCoincidenceHolds(premise, conclusion)) {
    const derivation = Object.freeze({
      kind: "typedTheory.derivation" as const,
      theory,
      premise,
      conclusion,
      steps: Object.freeze([]),
      length: fromCount(0),
    });
    return derivationSearchWitness(theory, premise, conclusion, derivation);
  }
  const queue: Array<{ readonly object: PredicationBaseObject; readonly steps: readonly DerivationStep[] }> = [{ object: premise, steps: [] }];
  const seen: PredicationBaseObject[] = [premise];
  for (let index = 0; index < queue.length; index += 1) {
    const current = queue[index]!;
    for (const rule of theory.rules.filter((candidate) => predicationBaseObjectCoincidenceHolds(candidate.domain, current.object))) {
      if (seen.some((object) => predicationBaseObjectCoincidenceHolds(object, rule.codomain))) continue;
      const step = Object.freeze({
        kind: "typedTheory.derivationStep" as const,
        premise: current.object,
        rule,
        conclusion: rule.codomain,
      });
      const steps = Object.freeze([...current.steps, step]);
      if (predicationBaseObjectCoincidenceHolds(rule.codomain, conclusion)) {
        const derivation = Object.freeze({
          kind: "typedTheory.derivation" as const,
          theory,
          premise,
          conclusion,
          steps,
          length: fromCount(steps.length),
        });
        return derivationSearchWitness(theory, premise, conclusion, derivation);
      }
      seen.push(rule.codomain);
      queue.push({ object: rule.codomain, steps });
    }
  }
  return derivationSearchObstruction(theory, premise, conclusion, seen);
}

export function deriveInBase(base: BaseCategory, premise: PredicationBaseObject, conclusion: PredicationBaseObject): DerivationSearchJudgment {
  return derive(theoryOfBase(base), premise, conclusion);
}

export function typing(theory: TypedTheoryCarrier, premise: PredicationBaseObject, conclusion: PredicationBaseObject): TypingJudgment {
  const search = derive(theory, premise, conclusion);
  return search.kind === "typedTheory.derivationSearch:witness"
    ? Object.freeze({
      kind: "typedTheory.typing:witness" as const,
      theory,
      premise,
      conclusion,
      derivation: search.derivation,
    })
    : Object.freeze({
      kind: "typedTheory.typing-obstruction" as const,
      theory,
      premise,
      conclusion,
      search,
    });
}

export function derivationValidity(theory: TypedTheoryCarrier, derivation: Derivation): DerivationCheckJudgment {
  let current = derivation.premise;
  for (const step of derivation.steps) {
    const generated = theory.rules.some((rule) =>
      inferenceRulesCoincide(rule, step.rule)
      && predicationBaseObjectCoincidenceHolds(step.premise, current)
      && predicationBaseObjectCoincidenceHolds(rule.domain, current)
      && predicationBaseObjectCoincidenceHolds(rule.codomain, step.conclusion));
    if (!generated) {
      return Object.freeze({
        kind: "typedTheory.derivation-obstruction" as const,
        theory,
        at: current,
        step,
      });
    }
    current = step.conclusion;
  }
  return Object.freeze({
    kind: "typedTheory.derivationCheck:witness" as const,
    theory,
    derivation,
  });
}

export function derivationIdentity(left: Derivation, right: Derivation): DerivationIdentityJudgment {
  const same = predicationBaseObjectCoincidenceHolds(left.premise, right.premise)
    && predicationBaseObjectCoincidenceHolds(left.conclusion, right.conclusion)
    && left.steps.length === right.steps.length
    && left.steps.every((step, index) => {
      const other = right.steps[index]!;
      return inferenceRulesCoincide(step.rule, other.rule) && predicationBaseObjectCoincidenceHolds(step.conclusion, other.conclusion);
    });
  return same
    ? Object.freeze({
      kind: "typedTheory.derivationIdentity:witness" as const,
      left,
      right,
    })
    : Object.freeze({
      kind: "typedTheory.derivationIdentity-obstruction" as const,
      left,
      right,
    });
}

export function typedTheoryProofCarrier(theory: TypedTheoryCarrier): TypedTheoryProofCarrier {
  const closure = derivationClosure(theory);
  const judgments = Object.freeze(closure.generated.map((rule) => typing(closure.theory, rule.domain, rule.codomain)));
  const obstructions = Object.freeze(judgments.filter((item): item is TypingJudgmentObstruction =>
    item.kind === "typedTheory.typing-obstruction"));
  return Object.freeze({
    kind: "typedTheory.proof.carrier" as const,
    theory: closure.theory,
    closure,
    judgments,
    obstructions,
    rank: fromCount(judgments.length),
  });
}

export function predicateWordArrow(subject: PredicationTerm, predicate: PredicationPredicate, object: PredicationTerm): PredicateWordArrow {
  return Object.freeze({
    kind: "typedTheory.predicateWordArrow" as const,
    subject,
    word: Object.freeze([predicate] as const),
    object,
  });
}

const predicateWordCarrier = (arrows: readonly PredicateWordArrow[]): PredicateWordCarrier => Object.freeze({
  kind: "typedTheory.predicateWord.carrier" as const,
  arrows: Object.freeze(arrows),
});

const samePredicateWord = (left: PredicateWord, right: PredicateWord): boolean =>
  left.length === right.length && left.every((predicate, index) => predicationPredicateCoincidenceHolds(predicate, right[index]!));

const samePredicateWordArrow = (left: PredicateWordArrow, right: PredicateWordArrow): boolean =>
  predicationTermCoincidenceHolds(left.subject, right.subject)
  && samePredicateWord(left.word, right.word)
  && predicationTermCoincidenceHolds(left.object, right.object);

const atomicPredicateWord = (arrow: PredicateWordArrow): boolean => arrow.word.length === 1;

export function composePredicateWords(input: PredicateWordCarrier): PredicateWordCarrier {
  const arrows: PredicateWordArrow[] = [...input.arrows];
  for (let leftIndex = 0; leftIndex < input.arrows.length; leftIndex += 1) {
    for (let rightIndex = 0; rightIndex < input.arrows.length; rightIndex += 1) {
      if (leftIndex === rightIndex) continue;
      const left = input.arrows[leftIndex]!;
      const right = input.arrows[rightIndex]!;
      if (!predicationTermCoincidenceHolds(left.object, right.subject)) continue;
      const composite = Object.freeze({
        kind: "typedTheory.predicateWordArrow" as const,
        subject: left.subject,
        word: Object.freeze([...left.word, ...right.word]),
        object: right.object,
      });
      if (!arrows.some((arrow) => samePredicateWordArrow(arrow, composite))) arrows.push(composite);
    }
  }
  return predicateWordCarrier(arrows);
}

export function composePredicateWordPotential(input: PredicateWordPotential): PredicateWordPotential {
  const composed = composePredicateWords(Object.freeze({ kind: "typedTheory.predicateWord.carrier" as const, arrows: input.potential }));
  return Object.freeze({
    kind: "typedTheory.predicateWordPotential" as const,
    potential: composed.arrows,
  });
}

export function atomicPredicateWords(input: PredicateWordCarrier): PredicateWordCarrier {
  return predicateWordCarrier(input.arrows.filter(atomicPredicateWord));
}

export function predicateWordResidue(input: { readonly arrows: readonly PredicateWordArrow[] }): PredicateWordResidue {
  const saturated = composePredicateWords(predicateWordCarrier(input.arrows));
  const atomic = atomicPredicateWords(saturated);
  return Object.freeze({
    kind: "typedTheory.predicateWordResidue" as const,
    saturated,
    atomic,
    composites: Object.freeze(saturated.arrows.filter((arrow) => arrow.word.length > 1).map((arrow) => Object.freeze(arrow.word))),
  });
}
