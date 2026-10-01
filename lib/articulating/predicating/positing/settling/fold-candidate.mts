/**
 * fold-candidate — read-only converse-partner completeness over settled relations.
 *
 * A SettlementFiltrationGenerators value is already the generator presentation of
 * a terminal settled form. Reconstruct its knowledge fixed point, then classify
 * each entity by the canonical converse portion of partner completeness:
 * every non-bottom incident cell (s,p,o) must have non-bottom (o,p,s).
 *
 * This is deliberately narrower than the full abstract partner relation from the
 * four-position theory, which may include additional declared symmetric pairs.
 * It does not mutate the predicate category or promote any predicate atom.
 */
import { bottom, sameCharge } from "../bilattice-charge.mjs";
import { chargeAt, posit } from "../fiber.mjs";
import {
  cell as predicationCell,
  freePredicationSite,
  termCoincides,
  type Cell,
  type PredicationTerm,
} from "../../predication.mjs";
import { knowledgeClosureTrace, type SettlementFiltrationGenerators } from "./valuation-closure.mjs";

export interface ConverseFoldCandidate {
  readonly kind: "predication.vocabularyFold.converseCandidate";
  readonly entity: PredicationTerm;
  readonly support: readonly Cell[];
  readonly limitation: "canonical-converse-only";
}

export interface ConverseFoldCandidateObstruction {
  readonly kind: "predication.vocabularyFold.converseCandidate-obstruction";
  readonly entity: PredicationTerm;
  readonly support: readonly Cell[];
  readonly missingConverse: readonly Cell[];
  readonly limitation: "canonical-converse-only";
}

export interface ConverseFoldCandidateCensus {
  readonly kind: "predication.vocabularyFold.converseCandidateCensus";
  readonly candidates: readonly ConverseFoldCandidate[];
  readonly obstructions: readonly ConverseFoldCandidateObstruction[];
  readonly limitation: "canonical-converse-only";
}

const uniqueTerms = (cells: readonly Cell[]): readonly PredicationTerm[] => {
  const terms: PredicationTerm[] = [];
  for (const cell of cells) {
    for (const term of [cell.subject, cell.object]) {
      if (!terms.some((other) => termCoincides(other, term))) terms.push(term);
    }
  }
  return Object.freeze(terms);
};

const incident = (entity: PredicationTerm, cell: Cell): boolean =>
  termCoincides(entity, cell.subject) || termCoincides(entity, cell.object);

/**
 * Read fold candidates from a settled relation using canonical converse
 * partneredness only.
 *
 * Settledness is guaranteed by reconstructing the fixed point represented by the
 * SettlementFiltration generators. Partner completeness is then a finite support
 * check. Missing converse partners remain explicit obstructions.
 */
export function converseFoldCandidateCensus(
  generators: SettlementFiltrationGenerators,
): ConverseFoldCandidateCensus {
  const site = freePredicationSite({
    kind: "predication.site",
    cells: generators.cells,
    specializations: generators.specializations,
  });
  const valuation = knowledgeClosureTrace(posit(site)).fixedPointStage.valuation;
  const supported = Object.freeze(
    valuation.fibers
      .flatMap((fiber) => fiber.assignments)
      .filter((assignment) => !sameCharge(assignment.charge, bottom))
      .map((assignment) => assignment.cell),
  );

  const candidates: ConverseFoldCandidate[] = [];
  const obstructions: ConverseFoldCandidateObstruction[] = [];

  for (const entity of uniqueTerms(supported)) {
    const support = Object.freeze(supported.filter((cell) => incident(entity, cell)));
    const missingConverse = Object.freeze(support
      .map((cell) => predicationCell(cell.object, cell.predicate, cell.subject))
      .filter((partner) => sameCharge(chargeAt(valuation, partner), bottom)));

    if (missingConverse.length === 0) {
      candidates.push(Object.freeze({
        kind: "predication.vocabularyFold.converseCandidate" as const,
        entity,
        support,
        limitation: "canonical-converse-only" as const,
      }));
    } else {
      obstructions.push(Object.freeze({
        kind: "predication.vocabularyFold.converseCandidate-obstruction" as const,
        entity,
        support,
        missingConverse,
        limitation: "canonical-converse-only" as const,
      }));
    }
  }

  return Object.freeze({
    kind: "predication.vocabularyFold.converseCandidateCensus" as const,
    candidates: Object.freeze(candidates),
    obstructions: Object.freeze(obstructions),
    limitation: "canonical-converse-only" as const,
  });
}
