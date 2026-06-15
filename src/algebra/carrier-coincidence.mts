import type { Claim, Mark, Token } from "./utterance.mjs";
import type {
  Cell,
  PredicationBaseObject,
  PredicationNode,
  PredicationPredicate,
  PredicationTerm,
} from "./predication.mjs";

/**
 * A witness that two marks coincide: holds the left and right Mark whose values
 * were found to coincide.
 */
export interface MarkCoincidenceWitness {
  readonly kind: "carrier.coincidence.mark:witness";
  readonly left: Mark;
  readonly right: Mark;
}

/**
 * An obstruction to mark coincidence: holds the left and right Mark whose
 * values were found not to coincide.
 */
export interface MarkCoincidenceObstruction {
  readonly kind: "carrier.coincidence.mark-obstruction";
  readonly left: Mark;
  readonly right: Mark;
}

/**
 * The result of comparing two marks: either a MarkCoincidenceWitness or a
 * MarkCoincidenceObstruction.
 */
export type MarkCoincidenceJudgment = MarkCoincidenceWitness | MarkCoincidenceObstruction;

/**
 * A witness that two tokens coincide: holds the left and right Token whose
 * marks were found to coincide.
 */
export interface TokenCoincidenceWitness {
  readonly kind: "carrier.coincidence.token:witness";
  readonly left: Token;
  readonly right: Token;
}

/**
 * An obstruction to token coincidence: holds the left and right Token whose
 * marks were found not to coincide.
 */
export interface TokenCoincidenceObstruction {
  readonly kind: "carrier.coincidence.token-obstruction";
  readonly left: Token;
  readonly right: Token;
}

/**
 * The result of comparing two tokens: either a TokenCoincidenceWitness or a
 * TokenCoincidenceObstruction.
 */
export type TokenCoincidenceJudgment = TokenCoincidenceWitness | TokenCoincidenceObstruction;

/**
 * A witness that two claims coincide: holds the left and right Claim whose
 * marks were found to coincide.
 */
export interface ClaimCoincidenceWitness {
  readonly kind: "carrier.coincidence.claim:witness";
  readonly left: Claim;
  readonly right: Claim;
}

/**
 * An obstruction to claim coincidence: holds the left and right Claim whose
 * marks were found not to coincide.
 */
export interface ClaimCoincidenceObstruction {
  readonly kind: "carrier.coincidence.claim-obstruction";
  readonly left: Claim;
  readonly right: Claim;
}

/**
 * The result of comparing two claims: either a ClaimCoincidenceWitness or a
 * ClaimCoincidenceObstruction.
 */
export type ClaimCoincidenceJudgment = ClaimCoincidenceWitness | ClaimCoincidenceObstruction;

/**
 * A witness that two predication terms coincide: holds the left and right
 * PredicationTerm found to coincide.
 */
export interface PredicationTermCoincidenceWitness {
  readonly kind: "carrier.coincidence.predicationTerm:witness";
  readonly left: PredicationTerm;
  readonly right: PredicationTerm;
}

/**
 * An obstruction to predication-term coincidence: holds the left and right
 * PredicationTerm found not to coincide.
 */
export interface PredicationTermCoincidenceObstruction {
  readonly kind: "carrier.coincidence.predicationTerm-obstruction";
  readonly left: PredicationTerm;
  readonly right: PredicationTerm;
}

/**
 * The result of comparing two predication terms: either a
 * PredicationTermCoincidenceWitness or a PredicationTermCoincidenceObstruction.
 */
export type PredicationTermCoincidenceJudgment = PredicationTermCoincidenceWitness | PredicationTermCoincidenceObstruction;

/**
 * A witness that two predication predicates coincide: holds the left and right
 * PredicationPredicate found to coincide.
 */
export interface PredicationPredicateCoincidenceWitness {
  readonly kind: "carrier.coincidence.predicationPredicate:witness";
  readonly left: PredicationPredicate;
  readonly right: PredicationPredicate;
}

/**
 * An obstruction to predication-predicate coincidence: holds the left and right
 * PredicationPredicate found not to coincide.
 */
export interface PredicationPredicateCoincidenceObstruction {
  readonly kind: "carrier.coincidence.predicationPredicate-obstruction";
  readonly left: PredicationPredicate;
  readonly right: PredicationPredicate;
}

/**
 * The result of comparing two predication predicates: either a
 * PredicationPredicateCoincidenceWitness or a
 * PredicationPredicateCoincidenceObstruction.
 */
export type PredicationPredicateCoincidenceJudgment = PredicationPredicateCoincidenceWitness | PredicationPredicateCoincidenceObstruction;

/**
 * A witness that two predication cells coincide: holds the left and right Cell
 * found to coincide.
 */
export interface PredicationCellCoincidenceWitness {
  readonly kind: "carrier.coincidence.predicationCell:witness";
  readonly left: Cell;
  readonly right: Cell;
}

/**
 * An obstruction to predication-cell coincidence: holds the left and right Cell
 * found not to coincide.
 */
export interface PredicationCellCoincidenceObstruction {
  readonly kind: "carrier.coincidence.predicationCell-obstruction";
  readonly left: Cell;
  readonly right: Cell;
}

/**
 * The result of comparing two predication cells: either a
 * PredicationCellCoincidenceWitness or a PredicationCellCoincidenceObstruction.
 */
export type PredicationCellCoincidenceJudgment = PredicationCellCoincidenceWitness | PredicationCellCoincidenceObstruction;

/**
 * A witness that two predication nodes coincide: holds the left and right
 * PredicationNode found to coincide.
 */
export interface PredicationNodeCoincidenceWitness {
  readonly kind: "carrier.coincidence.predicationNode:witness";
  readonly left: PredicationNode;
  readonly right: PredicationNode;
}

/**
 * An obstruction to predication-node coincidence: holds the left and right
 * PredicationNode found not to coincide.
 */
export interface PredicationNodeCoincidenceObstruction {
  readonly kind: "carrier.coincidence.predicationNode-obstruction";
  readonly left: PredicationNode;
  readonly right: PredicationNode;
}

/**
 * The result of comparing two predication nodes: either a
 * PredicationNodeCoincidenceWitness or a PredicationNodeCoincidenceObstruction.
 */
export type PredicationNodeCoincidenceJudgment = PredicationNodeCoincidenceWitness | PredicationNodeCoincidenceObstruction;

/**
 * A witness that two predication base objects coincide: holds the left and
 * right PredicationBaseObject found to coincide.
 */
export interface PredicationBaseObjectCoincidenceWitness {
  readonly kind: "carrier.coincidence.predicationBaseObject:witness";
  readonly left: PredicationBaseObject;
  readonly right: PredicationBaseObject;
}

/**
 * An obstruction to predication-base-object coincidence: holds the left and
 * right PredicationBaseObject found not to coincide.
 */
export interface PredicationBaseObjectCoincidenceObstruction {
  readonly kind: "carrier.coincidence.predicationBaseObject-obstruction";
  readonly left: PredicationBaseObject;
  readonly right: PredicationBaseObject;
}

/**
 * The result of comparing two predication base objects: either a
 * PredicationBaseObjectCoincidenceWitness or a
 * PredicationBaseObjectCoincidenceObstruction.
 */
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

/**
 * Compares two marks by deep value structure (never by reference) and returns a
 * witness when their values coincide, otherwise an obstruction.
 */
export function markCoincidence(left: Mark, right: Mark): MarkCoincidenceJudgment {
  return markValueCoincides(left.value, right.value)
    ? Object.freeze({ kind: "carrier.coincidence.mark:witness" as const, left, right })
    : Object.freeze({ kind: "carrier.coincidence.mark-obstruction" as const, left, right });
}

/**
 * Returns true when markCoincidence of the two marks yields a witness, i.e.
 * their values coincide.
 */
export const markCoincidenceHolds = (left: Mark, right: Mark): boolean =>
  markCoincidence(left, right).kind === "carrier.coincidence.mark:witness";

/**
 * Compares two tokens by their marks and returns a witness when the marks
 * coincide, otherwise an obstruction.
 */
export function tokenCoincidence(left: Token, right: Token): TokenCoincidenceJudgment {
  return markCoincidenceHolds(left.mark, right.mark)
    ? Object.freeze({ kind: "carrier.coincidence.token:witness" as const, left, right })
    : Object.freeze({ kind: "carrier.coincidence.token-obstruction" as const, left, right });
}

/**
 * Returns true when tokenCoincidence of the two tokens yields a witness, i.e.
 * their marks coincide.
 */
export const tokenCoincidenceHolds = (left: Token, right: Token): boolean =>
  tokenCoincidence(left, right).kind === "carrier.coincidence.token:witness";

/**
 * Compares two claims by their marks and returns a witness when the marks
 * coincide, otherwise an obstruction.
 */
export function claimCoincidence(left: Claim, right: Claim): ClaimCoincidenceJudgment {
  return markCoincidenceHolds(left.mark, right.mark)
    ? Object.freeze({ kind: "carrier.coincidence.claim:witness" as const, left, right })
    : Object.freeze({ kind: "carrier.coincidence.claim-obstruction" as const, left, right });
}

/**
 * Returns true when claimCoincidence of the two claims yields a witness, i.e.
 * their marks coincide.
 */
export const claimCoincidenceHolds = (left: Claim, right: Claim): boolean =>
  claimCoincidence(left, right).kind === "carrier.coincidence.claim:witness";

/**
 * Compares two predication terms of the same hand - left terms by token
 * coincidence, right terms by claim coincidence - and returns a witness when
 * they coincide, otherwise an obstruction; terms of differing hands never
 * coincide.
 */
export function predicationTermCoincidence(left: PredicationTerm, right: PredicationTerm): PredicationTermCoincidenceJudgment {
  const witness = left.hand === "left" && right.hand === "left"
    ? tokenCoincidenceHolds(left, right)
    : left.hand === "right" && right.hand === "right" && claimCoincidenceHolds(left, right);
  return witness
    ? Object.freeze({ kind: "carrier.coincidence.predicationTerm:witness" as const, left, right })
    : Object.freeze({ kind: "carrier.coincidence.predicationTerm-obstruction" as const, left, right });
}

/**
 * Returns true when predicationTermCoincidence of the two terms yields a
 * witness.
 */
export const predicationTermCoincidenceHolds = (left: PredicationTerm, right: PredicationTerm): boolean =>
  predicationTermCoincidence(left, right).kind === "carrier.coincidence.predicationTerm:witness";

/**
 * Compares two predication predicates by claim coincidence and returns a
 * witness when they coincide, otherwise an obstruction.
 */
export function predicationPredicateCoincidence(
  left: PredicationPredicate,
  right: PredicationPredicate,
): PredicationPredicateCoincidenceJudgment {
  return claimCoincidenceHolds(left, right)
    ? Object.freeze({ kind: "carrier.coincidence.predicationPredicate:witness" as const, left, right })
    : Object.freeze({ kind: "carrier.coincidence.predicationPredicate-obstruction" as const, left, right });
}

/**
 * Returns true when predicationPredicateCoincidence of the two predicates
 * yields a witness.
 */
export const predicationPredicateCoincidenceHolds = (left: PredicationPredicate, right: PredicationPredicate): boolean =>
  predicationPredicateCoincidence(left, right).kind === "carrier.coincidence.predicationPredicate:witness";

/**
 * Compares two predication cells componentwise - subject and object by term
 * coincidence, predicate by predicate coincidence - and returns a witness when
 * all three coincide, otherwise an obstruction.
 */
export function predicationCellCoincidence(left: Cell, right: Cell): PredicationCellCoincidenceJudgment {
  const witness = predicationTermCoincidenceHolds(left.subject, right.subject)
    && predicationPredicateCoincidenceHolds(left.predicate, right.predicate)
    && predicationTermCoincidenceHolds(left.object, right.object);
  return witness
    ? Object.freeze({ kind: "carrier.coincidence.predicationCell:witness" as const, left, right })
    : Object.freeze({ kind: "carrier.coincidence.predicationCell-obstruction" as const, left, right });
}

/**
 * Returns true when predicationCellCoincidence of the two cells yields a
 * witness.
 */
export const predicationCellCoincidenceHolds = (left: Cell, right: Cell): boolean =>
  predicationCellCoincidence(left, right).kind === "carrier.coincidence.predicationCell:witness";

/**
 * Compares two predication nodes positionally - term at index 0 and 2 by term
 * coincidence, predicate at index 1 by predicate coincidence - and returns a
 * witness when all three coincide, otherwise an obstruction.
 */
export function predicationNodeCoincidence(left: PredicationNode, right: PredicationNode): PredicationNodeCoincidenceJudgment {
  const witness = predicationTermCoincidenceHolds(left[0], right[0])
    && predicationPredicateCoincidenceHolds(left[1], right[1])
    && predicationTermCoincidenceHolds(left[2], right[2]);
  return witness
    ? Object.freeze({ kind: "carrier.coincidence.predicationNode:witness" as const, left, right })
    : Object.freeze({ kind: "carrier.coincidence.predicationNode-obstruction" as const, left, right });
}

/**
 * Returns true when predicationNodeCoincidence of the two nodes yields a
 * witness.
 */
export const predicationNodeCoincidenceHolds = (left: PredicationNode, right: PredicationNode): boolean =>
  predicationNodeCoincidence(left, right).kind === "carrier.coincidence.predicationNode:witness";

const isPredicationNode = (value: PredicationBaseObject): value is PredicationNode =>
  Array.isArray(value);

/**
 * Compares two predication base objects by their shape: node against node by
 * node coincidence, term against term by term coincidence; a node compared with
 * a non-node never coincides. Returns a witness when they coincide, otherwise
 * an obstruction.
 */
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

/**
 * Returns true when predicationBaseObjectCoincidence of the two base objects
 * yields a witness.
 */
export const predicationBaseObjectCoincidenceHolds = (
  left: PredicationBaseObject,
  right: PredicationBaseObject,
): boolean =>
  predicationBaseObjectCoincidence(left, right).kind === "carrier.coincidence.predicationBaseObject:witness";
