import { natIsZero } from "../../../../articulating/carriers.mjs";
import {
  aperiodicClosureRegime,
  finiteClosureRegime,
  scottClosureRegime,
  transfiniteClosureRegime,
  type ClosureRegime,
} from "./closure.mjs";
import { settlingFirings } from "./increment.mjs";
import { nonScottSettlingFirings, settlingLimitStages } from "./limit.mjs";
import { settlingFiniteStageJudgment } from "./ordinal.mjs";
import type {
  SettlementFiltration,
  SettlingClassification,
  SettlingFiniteStageJudgment,
  SettlingStageOrdinalCarrier,
} from "./object.mjs";

/** The sole mint site of the aperiodic regime. Aperiodicity (κ ≥ ω₁) is only
 *  ever declared into the system through the carrier's cofinality witness —
 *  same epistemic standing as an attestation; bounded iteration can witness
 *  only the stabilizing regimes, and its exhaustion is an obstruction. */
export function classifySettling(carrier: SettlementFiltration): SettlingClassification {
  const firingStages = settlingFirings(carrier);
  const depth = firingStages.length ? firingStages[firingStages.length - 1]!.stage : carrier.stages[0]!.ordinal;
  const limitStages = settlingLimitStages(carrier);
  const nonScottFirings = nonScottSettlingFirings(carrier);
  const regime: ClosureRegime = natIsZero(nonScottFirings.rank)
    ? (natIsZero(limitStages.rank) ? finiteClosureRegime : scottClosureRegime)
    : (carrier.cofinality.kind === "predication.settling.cofinality.uncountable" ? aperiodicClosureRegime : transfiniteClosureRegime);
  return Object.freeze({
    kind: "predication.settling.classification" as const,
    depth,
    regime,
    cofinality: carrier.cofinality,
    limitStages,
    nonScottFirings,
  });
}

/**
 * The settling depth: the depth field of the settling's classification, i.e.
 * the ordinal of its last firing.
 */
export const settlingDepth = (carrier: SettlementFiltration): SettlingStageOrdinalCarrier => classifySettling(carrier).depth;

/**
 * The finite-stage judgment applied to a settling's depth: a witness with its
 * natural value when finite, otherwise an obstruction.
 */
export const settlingDepthFiniteJudgment = (carrier: SettlementFiltration): SettlingFiniteStageJudgment =>
  settlingFiniteStageJudgment(settlingDepth(carrier));
