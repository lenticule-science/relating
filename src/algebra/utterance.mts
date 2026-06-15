import { claimCoincidenceHolds, markCoincidenceHolds, tokenCoincidenceHolds } from "./carrier-coincidence.mjs";

/**
 * A mark: an immutable, frozen carrier wrapping a single value. The value must
 * be present (not undefined); marks are the atomic content of tokens and
 * claims.
 */
export class Mark {
  readonly kind = "utterance.mark" as const;
  readonly value: unknown;

  constructor(value: unknown) {
    if (value === undefined) throw new TypeError("Mark: value must be present");
    this.value = value;
    Object.freeze(this);
  }
}

/**
 * A token: an immutable, frozen left-hand utterance carrier holding a single
 * mark.
 */
export class Token {
  readonly kind = "utterance.token" as const;
  readonly hand = "left" as const;
  readonly mark: Mark;

  constructor(mark: Mark) {
    this.mark = mark;
    Object.freeze(this);
  }
}

/**
 * A claim: an immutable, frozen right-hand utterance carrier holding a single
 * mark.
 */
export class Claim {
  readonly kind = "utterance.claim" as const;
  readonly hand = "right" as const;
  readonly mark: Mark;

  constructor(mark: Mark) {
    this.mark = mark;
    Object.freeze(this);
  }
}

/**
 * An utterance: a carrier pairing a left-hand token with a right-hand claim.
 */
export interface UtteranceCarrier {
  readonly kind: "utterance.carrier";
  readonly token: Token;
  readonly claim: Claim;
}

/**
 * An articulation: a carrier wrapping an utterance together with its
 * polarization, exposing the utterance's token as the positive pole and its
 * claim as the negative pole.
 */
export interface ArticulationCarrier {
  readonly kind: "utterance.articulation";
  readonly utterance: UtteranceCarrier;
  readonly polarization: {
    readonly positive: Token;
    readonly negative: Claim;
  };
}

/**
 * A potential carrier: holds an arbitrary readonly array of cells as unrealized
 * potential content.
 */
export interface PotentialCarrier {
  readonly kind: "utterance.potential";
  readonly potential: readonly unknown[];
}

/**
 * An utterance potential carrier: a potential carrier whose contents are
 * exactly a token and a claim, the unrealized form of an utterance.
 */
export interface UtterancePotentialCarrier {
  readonly kind: "utterance.potential";
  readonly potential: readonly [Token, Claim];
}

/**
 * A potential: either a general PotentialCarrier or an
 * UtterancePotentialCarrier.
 */
export type Potential = PotentialCarrier | UtterancePotentialCarrier;

/**
 * A witness that two marks are identical: holds the left and right Mark found
 * to coincide.
 */
export interface MarkIdentityWitness {
  readonly kind: "utterance.markIdentity:witness";
  readonly left: Mark;
  readonly right: Mark;
}

/**
 * An obstruction to mark identity: holds the left and right Mark found not to
 * coincide.
 */
export interface MarkIdentityObstruction {
  readonly kind: "utterance.markIdentity-obstruction";
  readonly left: Mark;
  readonly right: Mark;
}

/**
 * The result of judging two marks identical: either a MarkIdentityWitness or a
 * MarkIdentityObstruction.
 */
export type MarkIdentityJudgment = MarkIdentityWitness | MarkIdentityObstruction;

/**
 * A witness that two tokens are identical: holds the left and right Token found
 * to coincide.
 */
export interface TokenIdentityWitness {
  readonly kind: "utterance.tokenIdentity:witness";
  readonly left: Token;
  readonly right: Token;
}

/**
 * An obstruction to token identity: holds the left and right Token found not to
 * coincide.
 */
export interface TokenIdentityObstruction {
  readonly kind: "utterance.tokenIdentity-obstruction";
  readonly left: Token;
  readonly right: Token;
}

/**
 * The result of judging two tokens identical: either a TokenIdentityWitness or
 * a TokenIdentityObstruction.
 */
export type TokenIdentityJudgment = TokenIdentityWitness | TokenIdentityObstruction;

/**
 * A witness that two claims are identical: holds the left and right Claim found
 * to coincide.
 */
export interface ClaimIdentityWitness {
  readonly kind: "utterance.claimIdentity:witness";
  readonly left: Claim;
  readonly right: Claim;
}

/**
 * An obstruction to claim identity: holds the left and right Claim found not to
 * coincide.
 */
export interface ClaimIdentityObstruction {
  readonly kind: "utterance.claimIdentity-obstruction";
  readonly left: Claim;
  readonly right: Claim;
}

/**
 * The result of judging two claims identical: either a ClaimIdentityWitness or
 * a ClaimIdentityObstruction.
 */
export type ClaimIdentityJudgment = ClaimIdentityWitness | ClaimIdentityObstruction;

/** Constructs a Mark wrapping the given value. */
export function mark(value: unknown): Mark {
  return new Mark(value);
}

/** Constructs a Token from the given mark. */
export function token(markCarrier: Mark): Token {
  return new Token(markCarrier);
}

/** Constructs a Claim from the given mark. */
export function claim(markCarrier: Mark): Claim {
  return new Claim(markCarrier);
}

/**
 * Judges whether two marks are identical: returns a witness when their values
 * coincide, otherwise an obstruction.
 */
export function markIdentity(left: Mark, right: Mark): MarkIdentityJudgment {
  return markCoincidenceHolds(left, right)
    ? Object.freeze({ kind: "utterance.markIdentity:witness" as const, left, right })
    : Object.freeze({ kind: "utterance.markIdentity-obstruction" as const, left, right });
}

/**
 * Judges whether two tokens are identical: returns a witness when their marks
 * coincide, otherwise an obstruction.
 */
export function tokenIdentity(left: Token, right: Token): TokenIdentityJudgment {
  return tokenCoincidenceHolds(left, right)
    ? Object.freeze({ kind: "utterance.tokenIdentity:witness" as const, left, right })
    : Object.freeze({ kind: "utterance.tokenIdentity-obstruction" as const, left, right });
}

/**
 * Judges whether two claims are identical: returns a witness when their marks
 * coincide, otherwise an obstruction.
 */
export function claimIdentity(left: Claim, right: Claim): ClaimIdentityJudgment {
  return claimCoincidenceHolds(left, right)
    ? Object.freeze({ kind: "utterance.claimIdentity:witness" as const, left, right })
    : Object.freeze({ kind: "utterance.claimIdentity-obstruction" as const, left, right });
}

/**
 * Constructs an utterance carrier from two marks: the left mark becomes a token
 * and the right mark becomes a claim.
 */
export function utterance(left: Mark, right: Mark): UtteranceCarrier {
  return Object.freeze({ kind: "utterance.carrier" as const, token: token(left), claim: claim(right) });
}

/**
 * Articulates an utterance carrier: returns an articulation that wraps the
 * utterance and exposes its token as the positive pole and its claim as the
 * negative pole.
 */
export function articulate(carrier: UtteranceCarrier): ArticulationCarrier {
  return Object.freeze({
    kind: "utterance.articulation" as const,
    utterance: carrier,
    polarization: Object.freeze({
      positive: carrier.token,
      negative: carrier.claim,
    }),
  });
}

/**
 * Builds a potential carrier from its input: an utterance carrier yields its
 * token and claim as potential, a [left mark, right mark] pair is converted to
 * a token and claim, and a { cells } object yields a copy of its cells. Throws
 * when a pair's elements are not marks.
 */
export function potentialCarrier(input: UtteranceCarrier | readonly [Mark, Mark]): UtterancePotentialCarrier;
export function potentialCarrier(input: { readonly cells: readonly unknown[] }): PotentialCarrier;
export function potentialCarrier(input: UtteranceCarrier | readonly [Mark, Mark] | { readonly cells: readonly unknown[] }): PotentialCarrier | UtterancePotentialCarrier {
  if (typeof input === "object" && input !== null && "kind" in input && input.kind === "utterance.carrier") {
    return Object.freeze({ kind: "utterance.potential" as const, potential: Object.freeze([input.token, input.claim] as const) });
  }
  if (typeof input === "object" && input !== null && "cells" in input) {
    return Object.freeze({ kind: "utterance.potential" as const, potential: Object.freeze([...input.cells]) });
  }
  const pair = input as readonly [Mark, Mark];
  if (!(pair[0] instanceof Mark) || !(pair[1] instanceof Mark)) {
    throw new TypeError("potentialCarrier: expected [left mark, right mark]");
  }
  return Object.freeze({ kind: "utterance.potential" as const, potential: Object.freeze([token(pair[0]), claim(pair[1])] as const) });
}

/**
 * Type guard: returns true when the value has the articulation shape - an
 * utterance carrier and a polarization whose positive is a Token and negative
 * is a Claim.
 */
export function isArticulationCarrier(value: unknown): value is ArticulationCarrier {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<ArticulationCarrier>;
  return candidate.kind === "utterance.articulation"
    && typeof candidate.utterance === "object"
    && candidate.utterance !== null
    && (candidate.utterance as UtteranceCarrier).kind === "utterance.carrier"
    && typeof candidate.polarization === "object"
    && candidate.polarization !== null
    && candidate.polarization.positive instanceof Token
    && candidate.polarization.negative instanceof Claim;
}
