import { claimCoincidenceHolds, markCoincidenceHolds, tokenCoincidenceHolds } from "./carrier-coincidence.mjs";

export class Mark {
  readonly kind = "utterance.mark" as const;
  readonly value: unknown;

  constructor(value: unknown) {
    if (value === undefined) throw new TypeError("Mark: value must be present");
    this.value = value;
    Object.freeze(this);
  }
}

export class Token {
  readonly kind = "utterance.token" as const;
  readonly hand = "left" as const;
  readonly mark: Mark;

  constructor(mark: Mark) {
    this.mark = mark;
    Object.freeze(this);
  }
}

export class Claim {
  readonly kind = "utterance.claim" as const;
  readonly hand = "right" as const;
  readonly mark: Mark;

  constructor(mark: Mark) {
    this.mark = mark;
    Object.freeze(this);
  }
}

export interface UtteranceCarrier {
  readonly kind: "utterance.carrier";
  readonly token: Token;
  readonly claim: Claim;
}

export interface ArticulationCarrier {
  readonly kind: "utterance.articulation";
  readonly utterance: UtteranceCarrier;
  readonly polarization: {
    readonly positive: Token;
    readonly negative: Claim;
  };
}

export interface PotentialCarrier {
  readonly kind: "utterance.potential";
  readonly potential: readonly unknown[];
}

export interface UtterancePotentialCarrier {
  readonly kind: "utterance.potential";
  readonly potential: readonly [Token, Claim];
}

export type Potential = PotentialCarrier | UtterancePotentialCarrier;

export interface MarkIdentityWitness {
  readonly kind: "utterance.markIdentity:witness";
  readonly left: Mark;
  readonly right: Mark;
}

export interface MarkIdentityObstruction {
  readonly kind: "utterance.markIdentity-obstruction";
  readonly left: Mark;
  readonly right: Mark;
}

export type MarkIdentityJudgment = MarkIdentityWitness | MarkIdentityObstruction;

export interface TokenIdentityWitness {
  readonly kind: "utterance.tokenIdentity:witness";
  readonly left: Token;
  readonly right: Token;
}

export interface TokenIdentityObstruction {
  readonly kind: "utterance.tokenIdentity-obstruction";
  readonly left: Token;
  readonly right: Token;
}

export type TokenIdentityJudgment = TokenIdentityWitness | TokenIdentityObstruction;

export interface ClaimIdentityWitness {
  readonly kind: "utterance.claimIdentity:witness";
  readonly left: Claim;
  readonly right: Claim;
}

export interface ClaimIdentityObstruction {
  readonly kind: "utterance.claimIdentity-obstruction";
  readonly left: Claim;
  readonly right: Claim;
}

export type ClaimIdentityJudgment = ClaimIdentityWitness | ClaimIdentityObstruction;

export function mark(value: unknown): Mark {
  return new Mark(value);
}

export function token(markCarrier: Mark): Token {
  return new Token(markCarrier);
}

export function claim(markCarrier: Mark): Claim {
  return new Claim(markCarrier);
}

export function markIdentity(left: Mark, right: Mark): MarkIdentityJudgment {
  return markCoincidenceHolds(left, right)
    ? Object.freeze({ kind: "utterance.markIdentity:witness" as const, left, right })
    : Object.freeze({ kind: "utterance.markIdentity-obstruction" as const, left, right });
}

export function tokenIdentity(left: Token, right: Token): TokenIdentityJudgment {
  return tokenCoincidenceHolds(left, right)
    ? Object.freeze({ kind: "utterance.tokenIdentity:witness" as const, left, right })
    : Object.freeze({ kind: "utterance.tokenIdentity-obstruction" as const, left, right });
}

export function claimIdentity(left: Claim, right: Claim): ClaimIdentityJudgment {
  return claimCoincidenceHolds(left, right)
    ? Object.freeze({ kind: "utterance.claimIdentity:witness" as const, left, right })
    : Object.freeze({ kind: "utterance.claimIdentity-obstruction" as const, left, right });
}

export function utterance(left: Mark, right: Mark): UtteranceCarrier {
  return Object.freeze({ kind: "utterance.carrier" as const, token: token(left), claim: claim(right) });
}

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
