import type { Claim, Mark, Token } from "./utterance.mjs";
import type {
  Cell,
  PredicationBaseObject,
  PredicationNode,
  PredicationPredicate,
  PredicationTerm,
} from "./predication.mjs";

export interface MarkCoincidenceWitness {
  readonly kind: "carrier.coincidence.mark:witness";
  readonly left: Mark;
  readonly right: Mark;
}

export interface MarkCoincidenceObstruction {
  readonly kind: "carrier.coincidence.mark-obstruction";
  readonly left: Mark;
  readonly right: Mark;
}

export type MarkCoincidenceJudgment = MarkCoincidenceWitness | MarkCoincidenceObstruction;

export interface TokenCoincidenceWitness {
  readonly kind: "carrier.coincidence.token:witness";
  readonly left: Token;
  readonly right: Token;
}

export interface TokenCoincidenceObstruction {
  readonly kind: "carrier.coincidence.token-obstruction";
  readonly left: Token;
  readonly right: Token;
}

export type TokenCoincidenceJudgment = TokenCoincidenceWitness | TokenCoincidenceObstruction;

export interface ClaimCoincidenceWitness {
  readonly kind: "carrier.coincidence.claim:witness";
  readonly left: Claim;
  readonly right: Claim;
}

export interface ClaimCoincidenceObstruction {
  readonly kind: "carrier.coincidence.claim-obstruction";
  readonly left: Claim;
  readonly right: Claim;
}

export type ClaimCoincidenceJudgment = ClaimCoincidenceWitness | ClaimCoincidenceObstruction;

export interface PredicationTermCoincidenceWitness {
  readonly kind: "carrier.coincidence.predicationTerm:witness";
  readonly left: PredicationTerm;
  readonly right: PredicationTerm;
}

export interface PredicationTermCoincidenceObstruction {
  readonly kind: "carrier.coincidence.predicationTerm-obstruction";
  readonly left: PredicationTerm;
  readonly right: PredicationTerm;
}

export type PredicationTermCoincidenceJudgment = PredicationTermCoincidenceWitness | PredicationTermCoincidenceObstruction;

export interface PredicationPredicateCoincidenceWitness {
  readonly kind: "carrier.coincidence.predicationPredicate:witness";
  readonly left: PredicationPredicate;
  readonly right: PredicationPredicate;
}

export interface PredicationPredicateCoincidenceObstruction {
  readonly kind: "carrier.coincidence.predicationPredicate-obstruction";
  readonly left: PredicationPredicate;
  readonly right: PredicationPredicate;
}

export type PredicationPredicateCoincidenceJudgment = PredicationPredicateCoincidenceWitness | PredicationPredicateCoincidenceObstruction;

export interface PredicationCellCoincidenceWitness {
  readonly kind: "carrier.coincidence.predicationCell:witness";
  readonly left: Cell;
  readonly right: Cell;
}

export interface PredicationCellCoincidenceObstruction {
  readonly kind: "carrier.coincidence.predicationCell-obstruction";
  readonly left: Cell;
  readonly right: Cell;
}

export type PredicationCellCoincidenceJudgment = PredicationCellCoincidenceWitness | PredicationCellCoincidenceObstruction;

export interface PredicationNodeCoincidenceWitness {
  readonly kind: "carrier.coincidence.predicationNode:witness";
  readonly left: PredicationNode;
  readonly right: PredicationNode;
}

export interface PredicationNodeCoincidenceObstruction {
  readonly kind: "carrier.coincidence.predicationNode-obstruction";
  readonly left: PredicationNode;
  readonly right: PredicationNode;
}

export type PredicationNodeCoincidenceJudgment = PredicationNodeCoincidenceWitness | PredicationNodeCoincidenceObstruction;

export interface PredicationBaseObjectCoincidenceWitness {
  readonly kind: "carrier.coincidence.predicationBaseObject:witness";
  readonly left: PredicationBaseObject;
  readonly right: PredicationBaseObject;
}

export interface PredicationBaseObjectCoincidenceObstruction {
  readonly kind: "carrier.coincidence.predicationBaseObject-obstruction";
  readonly left: PredicationBaseObject;
  readonly right: PredicationBaseObject;
}

export type PredicationBaseObjectCoincidenceJudgment =
  | PredicationBaseObjectCoincidenceWitness
  | PredicationBaseObjectCoincidenceObstruction;

/** A mark is a value: marks coincide on value structure, never on reference,
 *  so a rehydrated mark coincides with the mark it was dehydrated from. */
const markValueCoincides = (left: unknown, right: unknown): boolean => {
  if (Object.is(left, right)) return true;
  if (typeof left !== "object" || typeof right !== "object" || left === null || right === null) return false;
  if (Array.isArray(left) || Array.isArray(right)) {
    return Array.isArray(left) && Array.isArray(right)
      && left.length === right.length
      && left.every((item, index) => markValueCoincides(item, right[index]));
  }
  const leftKeys = Object.keys(left).sort();
  const rightKeys = Object.keys(right).sort();
  return leftKeys.length === rightKeys.length
    && leftKeys.every((key, index) => key === rightKeys[index]
      && markValueCoincides((left as Record<string, unknown>)[key], (right as Record<string, unknown>)[key]));
};

export function markCoincidence(left: Mark, right: Mark): MarkCoincidenceJudgment {
  return markValueCoincides(left.value, right.value)
    ? Object.freeze({ kind: "carrier.coincidence.mark:witness" as const, left, right })
    : Object.freeze({ kind: "carrier.coincidence.mark-obstruction" as const, left, right });
}

export const markCoincidenceHolds = (left: Mark, right: Mark): boolean =>
  markCoincidence(left, right).kind === "carrier.coincidence.mark:witness";

export function tokenCoincidence(left: Token, right: Token): TokenCoincidenceJudgment {
  return markCoincidenceHolds(left.mark, right.mark)
    ? Object.freeze({ kind: "carrier.coincidence.token:witness" as const, left, right })
    : Object.freeze({ kind: "carrier.coincidence.token-obstruction" as const, left, right });
}

export const tokenCoincidenceHolds = (left: Token, right: Token): boolean =>
  tokenCoincidence(left, right).kind === "carrier.coincidence.token:witness";

export function claimCoincidence(left: Claim, right: Claim): ClaimCoincidenceJudgment {
  return markCoincidenceHolds(left.mark, right.mark)
    ? Object.freeze({ kind: "carrier.coincidence.claim:witness" as const, left, right })
    : Object.freeze({ kind: "carrier.coincidence.claim-obstruction" as const, left, right });
}

export const claimCoincidenceHolds = (left: Claim, right: Claim): boolean =>
  claimCoincidence(left, right).kind === "carrier.coincidence.claim:witness";

export function predicationTermCoincidence(left: PredicationTerm, right: PredicationTerm): PredicationTermCoincidenceJudgment {
  const witness = left.hand === "left" && right.hand === "left"
    ? tokenCoincidenceHolds(left, right)
    : left.hand === "right" && right.hand === "right" && claimCoincidenceHolds(left, right);
  return witness
    ? Object.freeze({ kind: "carrier.coincidence.predicationTerm:witness" as const, left, right })
    : Object.freeze({ kind: "carrier.coincidence.predicationTerm-obstruction" as const, left, right });
}

export const predicationTermCoincidenceHolds = (left: PredicationTerm, right: PredicationTerm): boolean =>
  predicationTermCoincidence(left, right).kind === "carrier.coincidence.predicationTerm:witness";

export function predicationPredicateCoincidence(
  left: PredicationPredicate,
  right: PredicationPredicate,
): PredicationPredicateCoincidenceJudgment {
  return claimCoincidenceHolds(left, right)
    ? Object.freeze({ kind: "carrier.coincidence.predicationPredicate:witness" as const, left, right })
    : Object.freeze({ kind: "carrier.coincidence.predicationPredicate-obstruction" as const, left, right });
}

export const predicationPredicateCoincidenceHolds = (left: PredicationPredicate, right: PredicationPredicate): boolean =>
  predicationPredicateCoincidence(left, right).kind === "carrier.coincidence.predicationPredicate:witness";

export function predicationCellCoincidence(left: Cell, right: Cell): PredicationCellCoincidenceJudgment {
  const witness = predicationTermCoincidenceHolds(left.subject, right.subject)
    && predicationPredicateCoincidenceHolds(left.predicate, right.predicate)
    && predicationTermCoincidenceHolds(left.object, right.object);
  return witness
    ? Object.freeze({ kind: "carrier.coincidence.predicationCell:witness" as const, left, right })
    : Object.freeze({ kind: "carrier.coincidence.predicationCell-obstruction" as const, left, right });
}

export const predicationCellCoincidenceHolds = (left: Cell, right: Cell): boolean =>
  predicationCellCoincidence(left, right).kind === "carrier.coincidence.predicationCell:witness";

export function predicationNodeCoincidence(left: PredicationNode, right: PredicationNode): PredicationNodeCoincidenceJudgment {
  const witness = predicationTermCoincidenceHolds(left[0], right[0])
    && predicationPredicateCoincidenceHolds(left[1], right[1])
    && predicationTermCoincidenceHolds(left[2], right[2]);
  return witness
    ? Object.freeze({ kind: "carrier.coincidence.predicationNode:witness" as const, left, right })
    : Object.freeze({ kind: "carrier.coincidence.predicationNode-obstruction" as const, left, right });
}

export const predicationNodeCoincidenceHolds = (left: PredicationNode, right: PredicationNode): boolean =>
  predicationNodeCoincidence(left, right).kind === "carrier.coincidence.predicationNode:witness";

const isPredicationNode = (value: PredicationBaseObject): value is PredicationNode =>
  Array.isArray(value);

export function predicationBaseObjectCoincidence(
  left: PredicationBaseObject,
  right: PredicationBaseObject,
): PredicationBaseObjectCoincidenceJudgment {
  const witness = isPredicationNode(left) || isPredicationNode(right)
    ? isPredicationNode(left) && isPredicationNode(right) && predicationNodeCoincidenceHolds(left, right)
    : predicationTermCoincidenceHolds(left, right);
  return witness
    ? Object.freeze({ kind: "carrier.coincidence.predicationBaseObject:witness" as const, left, right })
    : Object.freeze({ kind: "carrier.coincidence.predicationBaseObject-obstruction" as const, left, right });
}

export const predicationBaseObjectCoincidenceHolds = (
  left: PredicationBaseObject,
  right: PredicationBaseObject,
): boolean =>
  predicationBaseObjectCoincidence(left, right).kind === "carrier.coincidence.predicationBaseObject:witness";
