import { predicationCellCoincidenceHolds } from "../../../../algebra/index.mjs";
import { count, natEqual, natIsZero, type Natural } from "../../../../algebra/index.mjs";
import {
  aperiodicClosureRegime,
  finiteOrdinalJudgment,
  finiteClosureRegime,
  isLimitOrdinal,
  isZeroOrdinal,
  limitOrdinal,
  scottClosureRegime,
  successorOrdinal,
  transfiniteClosureRegime,
  zeroOrdinal,
  type ClosureRegime,
  type FiniteOrdinalJudgment,
  type Ordinal,
  type OrdinalLabel,
} from "./closure.mjs";
import { rankIdentity, rankVanishing, type RankIdentityJudgment, type RankVanishingJudgment } from "./cohomology.mjs";
import type { Valuation } from "../fiber.mjs";
import { cellSet, type Cell, type CellSet } from "../../../../algebra/index.mjs";
import { chargeValue, sameChargeValue, valueOf } from "../../../../algebra/index.mjs";

/**
 * The ordinal index of a settling stage: wraps an Ordinal as the stage
 * coordinate in the transfinite settling sequence.
 */
export interface SettlingStageOrdinalCarrier {
  readonly kind: "predication.settling.stageOrdinal";
  readonly ordinal: Ordinal;
}

/**
 * The designated cells accumulated at a settling stage: a CellSet of the cells
 * whose truth coordinate is present by that stage.
 */
export interface SettlingStageDesignatedCellsCarrier {
  readonly kind: "predication.settling.stageDesignatedCells";
  readonly cells: CellSet;
}

/**
 * Witness that a stage ordinal is finite: pairs the stage ordinal carrier with
 * its natural-number value.
 */
export interface SettlingFiniteStageWitness {
  readonly kind: "predication.settling.finiteStage:witness";
  readonly stage: SettlingStageOrdinalCarrier;
  readonly value: Natural;
}

/**
 * Obstruction recording that a stage ordinal is not finite: carries the stage
 * ordinal and the finite-ordinal reading that failed to be a witness.
 */
export interface SettlingFiniteStageObstruction {
  readonly kind: "predication.settling.finiteStage-obstruction";
  readonly stage: SettlingStageOrdinalCarrier;
  readonly reading: FiniteOrdinalJudgment;
}

/**
 * Judgment on whether a settling stage ordinal is finite: either a
 * SettlingFiniteStageWitness or a SettlingFiniteStageObstruction.
 */
export type SettlingFiniteStageJudgment = SettlingFiniteStageWitness | SettlingFiniteStageObstruction;

/**
 * Shape tag for the initial (zero-ordinal) settling stage: carries the stage
 * ordinal carrier.
 */
export interface SettlingInitialStage {
  readonly kind: "predication.settling.stage.initial";
  readonly ordinal: SettlingStageOrdinalCarrier;
}

/**
 * Shape tag for a successor settling stage: carries the stage ordinal carrier.
 */
export interface SettlingSuccessorStage {
  readonly kind: "predication.settling.stage.successor";
  readonly ordinal: SettlingStageOrdinalCarrier;
}

/** Shape tag for a limit settling stage: carries the stage ordinal carrier. */
export interface SettlingLimitStage {
  readonly kind: "predication.settling.stage.limit";
  readonly ordinal: SettlingStageOrdinalCarrier;
}

/**
 * The shape of a settling stage by its ordinal kind: initial, successor, or
 * limit.
 */
export type SettlingStageShape = SettlingInitialStage | SettlingSuccessorStage | SettlingLimitStage;

/**
 * Input describing one settling stage before normalization: its ordinal
 * carrier, computed shape, and the designated cells carrier supplied for that
 * stage.
 */
export interface SettlingStageInputCarrier {
  readonly kind: "predication.settling.stageInput";
  readonly ordinal: SettlingStageOrdinalCarrier;
  readonly shape: SettlingStageShape;
  readonly designated: SettlingStageDesignatedCellsCarrier;
}

/**
 * A normalized settling stage: its ordinal carrier, shape, and the CellSet of
 * cells designated at that stage.
 */
export interface SettlingStage {
  readonly kind: "predication.settling.stage";
  readonly ordinal: SettlingStageOrdinalCarrier;
  readonly shape: SettlingStageShape;
  readonly designated: CellSet;
}

/**
 * A settling stage refined to limit shape: a SettlingStage whose shape is a
 * SettlingLimitStage.
 */
export type SettlingLimitStageCarrier = SettlingStage & { readonly shape: SettlingLimitStage };

/**
 * Cofinality witness marking the settling sequence as having countable
 * cofinality.
 */
export interface CountableSettlingCofinalityCarrier {
  readonly kind: "predication.settling.cofinality.countable";
}

/**
 * Cofinality witness marking the settling sequence as having uncountable
 * cofinality (kappa >= omega-1), the standing required for the aperiodic
 * regime.
 */
export interface UncountableSettlingCofinalityCarrier {
  readonly kind: "predication.settling.cofinality.uncountable";
}

/**
 * The declared cofinality of a settling sequence: either countable or
 * uncountable.
 */
export type SettlingCofinalityCarrier =
  | CountableSettlingCofinalityCarrier
  | UncountableSettlingCofinalityCarrier;

/**
 * A complete settling: the normalized sequence of stages together with its
 * declared cofinality witness.
 */
export interface SettlementFiltration {
  readonly kind: "predication.settlement.filtration";
  readonly stages: readonly SettlingStage[];
  readonly cofinality: SettlingCofinalityCarrier;
}

/**
 * The cells gained at one settling stage: the stage ordinal, the source stage,
 * and the CellSet of cells added relative to the previous stage.
 */
export interface SettlingIncrement {
  readonly kind: "predication.settling.increment";
  readonly stage: SettlingStageOrdinalCarrier;
  readonly source: SettlingStage;
  readonly added: CellSet;
}

/**
 * The limit stages of a settling: the list of limit-shaped stages and their
 * count as a rank.
 */
export interface SettlingLimitStagesCarrier {
  readonly kind: "predication.settling.limitStages";
  readonly stages: readonly SettlingLimitStageCarrier[];
  readonly rank: Natural;
}

/**
 * The firings occurring at limit stages: the increments whose source is a limit
 * stage and added cells, with their count as a rank.
 */
export interface NonScottSettlingFiringsCarrier {
  readonly kind: "predication.settling.nonScottFirings";
  readonly firings: readonly SettlingIncrement[];
  readonly rank: Natural;
}

/**
 * A generator of the first cohomology of a settling: one cell added at a
 * non-Scott limit-stage firing, paired with that source stage.
 */
export interface SettlingFirstCohomologyGenerator {
  readonly kind: "predication.settling.firstCohomologyGenerator";
  readonly stage: SettlingStage;
  readonly cell: Cell;
}

/**
 * The degree-1 cohomology of a settling: the generators from non-Scott
 * limit-stage firings, their count as a rank, and the rank-vanishing judgment
 * on that rank.
 */
export interface SettlingFirstCohomology {
  readonly kind: "predication.settling.firstCohomology";
  readonly generators: readonly SettlingFirstCohomologyGenerator[];
  readonly rank: Natural;
  readonly degree: 1;
  readonly vanishing: RankVanishingJudgment;
}

/**
 * One cell lost across the graded gap: a cell added at a non-Scott limit-stage
 * firing, paired with that source stage.
 */
export interface GradedGapLoss {
  readonly kind: "predication.settling.gradedGapLoss";
  readonly stage: SettlingStage;
  readonly cell: Cell;
}

/**
 * The graded gap of a settling: the list of cells lost at non-Scott limit-stage
 * firings and their count as a rank.
 */
export interface GradedGapCarrier {
  readonly kind: "predication.settling.gradedGap";
  readonly lost: readonly GradedGapLoss[];
  readonly rank: Natural;
}

/**
 * One step of the closure invariant: a non-Scott limit stage and the CellSet of
 * cells added at it.
 */
export interface SettlingClosureInvariantStep {
  readonly kind: "predication.settling.closureInvariantStep";
  readonly stage: SettlingStage;
  readonly additions: CellSet;
}

/**
 * The closure invariant of a settling: the sequence of non-Scott additions, one
 * step per non-Scott limit-stage firing.
 */
export interface SettlingClosureInvariant {
  readonly kind: "predication.settling.closureInvariant";
  readonly nonScottAdditions: readonly SettlingClosureInvariantStep[];
}

/**
 * Witness that two settlings have equivalent closure invariants: carries both
 * closure invariants compared.
 */
export interface SettlingClosureEquivalenceWitness {
  readonly kind: "predication.settling.closureEquivalence:witness";
  readonly left: SettlingClosureInvariant;
  readonly right: SettlingClosureInvariant;
}

/**
 * Obstruction recording that two settlings have differing closure invariants:
 * carries both closure invariants compared.
 */
export interface SettlingClosureEquivalenceObstruction {
  readonly kind: "predication.settling.closureEquivalence-obstruction";
  readonly left: SettlingClosureInvariant;
  readonly right: SettlingClosureInvariant;
}

/**
 * Judgment on whether two settlings share a closure invariant: either a
 * SettlingClosureEquivalenceWitness or a SettlingClosureEquivalenceObstruction.
 */
export type SettlingClosureEquivalenceJudgment = SettlingClosureEquivalenceWitness | SettlingClosureEquivalenceObstruction;

/**
 * The classification of a settling: its settling depth, closure regime,
 * cofinality witness, limit stages, and non-Scott firings.
 */
export interface SettlingClassification {
  readonly kind: "predication.settling.classification";
  readonly depth: SettlingStageOrdinalCarrier;
  readonly regime: ClosureRegime;
  readonly cofinality: SettlingCofinalityCarrier;
  readonly limitStages: SettlingLimitStagesCarrier;
  readonly nonScottFirings: NonScottSettlingFiringsCarrier;
}

const dedupCells = (values: readonly Cell[]): readonly Cell[] => {
  const out: Cell[] = [];
  for (const cell of values) if (!out.some((item) => predicationCellCoincidenceHolds(item, cell))) out.push(cell);
  return Object.freeze(out);
};

const withoutCells = (left: readonly Cell[], right: readonly Cell[]): readonly Cell[] =>
  Object.freeze(left.filter((item) => !right.some((other) => predicationCellCoincidenceHolds(item, other))));

/**
 * Stage ordinal carrier for the initial stage, wrapping the zero ordinal.
 */
export const settlingInitialStageOrdinal: SettlingStageOrdinalCarrier = Object.freeze({
  kind: "predication.settling.stageOrdinal" as const,
  ordinal: zeroOrdinal,
});

/** Wraps an arbitrary ordinal as a settling stage ordinal carrier. */
export const settlingStageOrdinal = (ordinal: Ordinal): SettlingStageOrdinalCarrier => Object.freeze({
  kind: "predication.settling.stageOrdinal" as const,
  ordinal,
});

/**
 * Constructs the stage ordinal carrier for the successor of the given stage's
 * ordinal.
 */
export const settlingSuccessorStageOrdinal = (stage: SettlingStageOrdinalCarrier): SettlingStageOrdinalCarrier => Object.freeze({
  kind: "predication.settling.stageOrdinal" as const,
  ordinal: successorOrdinal(stage.ordinal),
});

/**
 * Constructs the stage ordinal carrier for a limit ordinal built from the given
 * label and fundamental sequence.
 */
export const settlingLimitStageOrdinal = (
  label: OrdinalLabel,
  fundamentalSequence: (n: Natural) => Ordinal,
): SettlingStageOrdinalCarrier => settlingStageOrdinal(limitOrdinal(label, fundamentalSequence));

/** Countable cofinality witness for a settling. */
export const countableSettlingCofinality: CountableSettlingCofinalityCarrier = Object.freeze({
  kind: "predication.settling.cofinality.countable" as const,
});

/** Uncountable cofinality witness for a settling. */
export const uncountableSettlingCofinality: UncountableSettlingCofinalityCarrier = Object.freeze({
  kind: "predication.settling.cofinality.uncountable" as const,
});

/**
 * Judges whether the given stage ordinal (or stage) is finite, returning a
 * witness with its natural value or an obstruction carrying the finite-ordinal
 * reading.
 */
export function settlingFiniteStageJudgment(stage: SettlingStageOrdinalCarrier | SettlingStage): SettlingFiniteStageJudgment {
  const stageOrdinal = stage.kind === "predication.settling.stage" ? stage.ordinal : stage;
  const reading = finiteOrdinalJudgment(stageOrdinal.ordinal);
  return reading.kind === "ordinal.closure.finiteOrdinal:witness"
    ? Object.freeze({
      kind: "predication.settling.finiteStage:witness" as const,
      stage: stageOrdinal,
      value: reading.value,
    })
    : Object.freeze({
      kind: "predication.settling.finiteStage-obstruction" as const,
      stage: stageOrdinal,
      reading,
    });
}

/**
 * Returns whether two stage ordinal carriers are both finite and equal in
 * natural value.
 */
export function sameSettlingStageOrdinal(left: SettlingStageOrdinalCarrier, right: SettlingStageOrdinalCarrier): boolean {
  const leftFinite = settlingFiniteStageJudgment(left);
  const rightFinite = settlingFiniteStageJudgment(right);
  return leftFinite.kind === "predication.settling.finiteStage:witness"
    && rightFinite.kind === "predication.settling.finiteStage:witness"
    && natEqual(leftFinite.value, rightFinite.value);
}

/** Constructs the initial stage shape for the given stage ordinal carrier. */
export const settlingInitialStageShape = (ordinal: SettlingStageOrdinalCarrier): SettlingInitialStage => Object.freeze({
  kind: "predication.settling.stage.initial" as const,
  ordinal,
});

/** Constructs the successor stage shape for the given stage ordinal carrier. */
export const settlingSuccessorStageShape = (ordinal: SettlingStageOrdinalCarrier): SettlingSuccessorStage => Object.freeze({
  kind: "predication.settling.stage.successor" as const,
  ordinal,
});

/** Constructs the limit stage shape for the given stage ordinal carrier. */
export const settlingLimitStageShape = (ordinal: SettlingStageOrdinalCarrier): SettlingLimitStage => Object.freeze({
  kind: "predication.settling.stage.limit" as const,
  ordinal,
});

/**
 * Selects the stage shape from the stage ordinal: initial for zero, limit for a
 * limit ordinal, otherwise successor.
 */
export const settlingStageShape = (ordinal: SettlingStageOrdinalCarrier): SettlingStageShape => {
  if (isZeroOrdinal(ordinal.ordinal)) return settlingInitialStageShape(ordinal);
  if (isLimitOrdinal(ordinal.ordinal)) return settlingLimitStageShape(ordinal);
  return settlingSuccessorStageShape(ordinal);
};

/**
 * Constructs a designated-cells carrier from a cell list, deduplicating
 * coincident cells into a CellSet.
 */
export const settlingStageDesignatedCells = (designated: readonly Cell[]): SettlingStageDesignatedCellsCarrier => Object.freeze({
  kind: "predication.settling.stageDesignatedCells" as const,
  cells: cellSet(dedupCells(designated)),
});

/**
 * Assembles a stage input from an ordinal carrier, designated-cells carrier,
 * and shape, defaulting the shape to the one derived from the ordinal.
 */
export const settlingStageInput = (
  ordinal: SettlingStageOrdinalCarrier,
  designated: SettlingStageDesignatedCellsCarrier,
  shape: SettlingStageShape = settlingStageShape(ordinal),
): SettlingStageInputCarrier => Object.freeze({
  kind: "predication.settling.stageInput" as const,
  ordinal,
  shape,
  designated,
});

/**
 * Constructs the initial stage input from a list of designated cells, using the
 * zero-ordinal carrier and initial shape.
 */
export const settlingInitialStageInput = (designated: readonly Cell[]): SettlingStageInputCarrier => {
  const ordinal = settlingInitialStageOrdinal;
  return settlingStageInput(ordinal, settlingStageDesignatedCells(designated), settlingInitialStageShape(ordinal));
};

/**
 * Constructs a successor stage input following the given previous stage, with
 * the successor of its ordinal and the supplied designated cells.
 */
export const settlingSuccessorStageInput = (
  previous: SettlingStageInputCarrier | SettlingStage,
  designated: readonly Cell[],
): SettlingStageInputCarrier => {
  const ordinal = settlingSuccessorStageOrdinal(previous.ordinal);
  return settlingStageInput(ordinal, settlingStageDesignatedCells(designated), settlingSuccessorStageShape(ordinal));
};

/**
 * Constructs a limit stage input at the given ordinal carrier with the supplied
 * designated cells; throws if the ordinal is not a limit ordinal.
 */
export const settlingLimitStageInput = (
  ordinal: SettlingStageOrdinalCarrier,
  designated: readonly Cell[],
): SettlingStageInputCarrier => {
  if (!isLimitOrdinal(ordinal.ordinal)) throw new TypeError("settlingLimitStageInput: expected limit ordinal");
  return settlingStageInput(ordinal, settlingStageDesignatedCells(designated), settlingLimitStageShape(ordinal));
};

const isSettlingLimitStage = (stage: SettlingStage): stage is SettlingStage & { readonly shape: SettlingLimitStage } =>
  stage.shape.kind === "predication.settling.stage.limit";

/**
 * Builds a settlement filtration from a sequence of stage inputs and an optional
 * cofinality witness, normalizing each into a stage; throws if there are no
 * stages, if stage 0 is not initial, or if any stage drops cells designated by
 * its predecessor.
 */
export function settling(
  stages: readonly SettlingStageInputCarrier[],
  cofinality: SettlingCofinalityCarrier = countableSettlingCofinality,
): SettlementFiltration {
  if (stages.length === 0) throw new TypeError("settling: need at least one stage");
  if (stages[0]!.shape.kind !== "predication.settling.stage.initial") throw new TypeError("settling: stage 0 must be initial");
  const normalized: SettlingStage[] = [];
  for (let index = 0; index < stages.length; index += 1) {
    const stage = stages[index]!;
    const designated = stage.designated.cells;
    if (index > 0) {
      const previous = stages[index - 1]!.designated.cells.cells;
      if (withoutCells(previous, designated.cells).length > 0) throw new TypeError(`settling: stage ${index} drops cells`);
    }
    normalized.push(Object.freeze({
      kind: "predication.settling.stage" as const,
      ordinal: stage.ordinal,
      shape: stage.shape,
      designated,
    }));
  }
  return Object.freeze({
    kind: "predication.settlement.filtration" as const,
    stages: Object.freeze(normalized),
    cofinality,
  });
}

/**
 * The cells designated by a valuation: every cell whose charge value is
 * potential or stable, collected across all fibers; stable is retained so the
 * held contradiction is not collapsed to falsity.
 */
export function designatedCells(valuation: Valuation): readonly Cell[] {
  // Designated = truth coordinate present: potential AND stable. Excluding
  // stable would resolve the held contradiction to the falsity side — the
  // classical collapse the bilattice exists to refuse.
  return Object.freeze(valuation.fibers.flatMap((fiber) =>
    fiber.assignments
      .filter((assignment) => {
        const value = valueOf(assignment.charge);
        return sameChargeValue(value, chargeValue("potential")) || sameChargeValue(value, chargeValue("stable"));
      })
      .map((assignment) => assignment.cell)));
}

/**
 * The per-stage increments of a settling: for each stage, the cells added
 * relative to the previous stage (all designated cells at stage 0).
 */
export function settlingIncrements(carrier: SettlementFiltration): readonly SettlingIncrement[] {
  return Object.freeze(carrier.stages.map((stage, index) => Object.freeze({
    kind: "predication.settling.increment" as const,
    stage: stage.ordinal,
    source: stage,
    added: cellSet(index === 0 ? stage.designated.cells : withoutCells(stage.designated.cells, carrier.stages[index - 1]!.designated.cells)),
  })));
}

/**
 * The settling increments that actually add cells: the increments whose added
 * CellSet is non-empty.
 */
export const settlingFirings = (carrier: SettlementFiltration): readonly SettlingIncrement[] =>
  Object.freeze(settlingIncrements(carrier).filter((increment) => increment.added.cells.length > 0));

/**
 * The limit stages of a settlement filtration: the limit-shaped stages and their
 * count as a rank.
 */
export const settlingLimitStages = (carrier: SettlementFiltration): SettlingLimitStagesCarrier => {
  const stages = Object.freeze(carrier.stages.filter(isSettlingLimitStage));
  return Object.freeze({
    kind: "predication.settling.limitStages" as const,
    stages,
    rank: count(stages),
  });
};

/**
 * The non-Scott firings of a settling: cell-adding increments whose source is a
 * limit stage, with their count as a rank.
 */
export const nonScottSettlingFirings = (carrier: SettlementFiltration): NonScottSettlingFiringsCarrier => {
  const firings = Object.freeze(settlingFirings(carrier).filter((increment) => isSettlingLimitStage(increment.source)));
  return Object.freeze({
    kind: "predication.settling.nonScottFirings" as const,
    firings,
    rank: count(firings),
  });
};

/**
 * The degree-1 cohomology of a settling: one generator per cell added at a
 * non-Scott limit-stage firing, the generator count as a rank, and the
 * rank-vanishing judgment on it.
 */
export function settlingFirstCohomology(carrier: SettlementFiltration): SettlingFirstCohomology {
  const generators = Object.freeze(nonScottSettlingFirings(carrier).firings.flatMap((increment) =>
    increment.added.cells.map((cell) => Object.freeze({
      kind: "predication.settling.firstCohomologyGenerator" as const,
      stage: increment.source,
      cell,
    }))));
  return Object.freeze({
    kind: "predication.settling.firstCohomology" as const,
    generators,
    rank: count(generators),
    degree: 1 as const,
    vanishing: rankVanishing(count(generators)),
  });
}

/**
 * The closure invariant of a settling: one step per non-Scott limit-stage
 * firing recording the source stage and its deduplicated added cells.
 */
export function settlingClosureInvariant(carrier: SettlementFiltration): SettlingClosureInvariant {
  const nonScottAdditions = Object.freeze(nonScottSettlingFirings(carrier).firings.map((increment) => Object.freeze({
    kind: "predication.settling.closureInvariantStep" as const,
    stage: increment.source,
    additions: cellSet(dedupCells(increment.added.cells)),
  })));
  return Object.freeze({
    kind: "predication.settling.closureInvariant" as const,
    nonScottAdditions,
  });
}

/**
 * Compares two settlings by closure invariant, returning a witness when their
 * non-Scott additions match stage-for-stage and cell-for-cell up to cell
 * coincidence, otherwise an obstruction.
 */
export function settlingClosureEquivalence(left: SettlementFiltration, right: SettlementFiltration): SettlingClosureEquivalenceJudgment {
  const leftInvariant = settlingClosureInvariant(left);
  const rightInvariant = settlingClosureInvariant(right);
  const leftAdditions = leftInvariant.nonScottAdditions;
  const rightAdditions = rightInvariant.nonScottAdditions;
  const equivalent = leftAdditions.length === rightAdditions.length
    && leftAdditions.every((leftStage, index) => {
      const rightStage = rightAdditions[index]!;
      return leftStage.additions.cells.length === rightStage.additions.cells.length
        && leftStage.additions.cells.every((leftCell) => rightStage.additions.cells.some((rightCell) => predicationCellCoincidenceHolds(leftCell, rightCell)));
    });
  return equivalent
    ? Object.freeze({
      kind: "predication.settling.closureEquivalence:witness" as const,
      left: leftInvariant,
      right: rightInvariant,
    })
    : Object.freeze({
      kind: "predication.settling.closureEquivalence-obstruction" as const,
      left: leftInvariant,
      right: rightInvariant,
    });
}

/**
 * The graded gap of a settling: one loss per cell added at a non-Scott
 * limit-stage firing, with the loss count as a rank.
 */
export function gradedGap(carrier: SettlementFiltration): GradedGapCarrier {
  const lost = Object.freeze(nonScottSettlingFirings(carrier).firings.flatMap((increment) =>
    increment.added.cells.map((cell) => Object.freeze({
      kind: "predication.settling.gradedGapLoss" as const,
      stage: increment.source,
      cell,
    }))));
  return Object.freeze({ kind: "predication.settling.gradedGap" as const, lost, rank: count(lost) });
}

/**
 * The rank-identity judgment comparing the first cohomology rank against the
 * graded gap rank for a settling.
 */
export const gradedGapSettlingFirstCohomologyRank = (carrier: SettlementFiltration): RankIdentityJudgment =>
  rankIdentity(settlingFirstCohomology(carrier).rank, gradedGap(carrier).rank);

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
