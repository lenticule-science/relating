/**
 * articulating — the base object surface of the category of relating.
 *
 * A Mark is arbitrary; a Token and Claim carry Marks; an Utterance pairs them;
 * `articulate` opens the aperiodic articulation category at its potential
 * cell. Predicating lives inside this articulation surface.
 */
export {
  Mark,
  Token,
  Claim,
  mark,
  token,
  claim,
  utterance,
  articulate,
  potentialCarrier,
  isArticulationCarrier,
  tokenIdentity,
  claimIdentity,
} from "../algebra/utterance.mjs";
export type {
  UtteranceCarrier,
  TokenArticulationSlot,
  ClaimArticulationSlot,
  AperiodicArticulationPairing,
  AperiodicArticulationCell,
  PotentialAperiodicArticulationCell,
  AperiodicArticulationCategory,
  ArticulationCarrier,
  UtterancePotentialCarrier,
  Potential,
  TokenIdentityWitness,
  TokenIdentityObstruction,
  TokenIdentityJudgment,
  ClaimIdentityWitness,
  ClaimIdentityObstruction,
  ClaimIdentityJudgment,
} from "../algebra/utterance.mjs";

export * as predicating from "./predicating/index.mjs";
