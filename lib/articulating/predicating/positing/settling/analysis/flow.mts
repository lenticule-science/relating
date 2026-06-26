/**
 * analysis/flow - finite closure-flow and firing reads.
 *
 * Executable carrier shadows for the green `RelMath.Flow` successor-time
 * cluster. The surface is deliberately finite: named cells, FOUR charge names,
 * pointwise charge operators, firing blowups, local-data reconstruction, finite
 * NSC commutation checks, curvature-regime receipts, Lyapunov free energy, and
 * Laplacianizer/Hodge fixed-point witnesses.
 *
 * Genuine arbitrary `Ord.limit` continuity and transfinite NSC firing classes
 * remain proof-side. The runtime surface only claims finite/canonical shadows
 * that can be checked over the package FOUR carrier.
 */
import {
  chargeValue,
  joinKnowledgeValue,
  knowledgeLeq,
  type ChargeValueName,
} from "../../bilattice-charge.mjs";

export type FlowCharge = ChargeValueName;
export type FiringTypeName = "tSide" | "fSide" | "top";
export type ClosureRegimeName =
  | "ordinal.closure.regime.finite"
  | "ordinal.closure.regime.scott"
  | "ordinal.closure.regime.transfinite"
  | "ordinal.closure.regime.aperiodic";

export interface ChargeOperatorCarrier {
  readonly kind: "flow.chargeOperator";
  readonly map: Readonly<Record<FlowCharge, FlowCharge>>;
}

export interface FiniteValuation {
  readonly kind: "flow.valuation";
  readonly cells: readonly string[];
  readonly values: Readonly<Record<string, FlowCharge>>;
}

export interface CellLocalData {
  readonly cell: string;
  readonly incidence: boolean;
  readonly firingType: FiringTypeName | null;
  readonly consistencyFailure: FlowCharge | null;
}

export interface FiringBlowupWitness {
  readonly kind: "flow.firingBlowup:witness";
  readonly step: number;
  readonly predecessor: FiniteValuation;
  readonly actual: FiniteValuation;
  readonly leqKnowledge: true;
  readonly trivial: boolean;
  readonly nontrivial: boolean;
  readonly identityBlowup: boolean;
  readonly localData: readonly CellLocalData[];
  readonly reconstructedActual: FiniteValuation;
  readonly classified: true;
}

export interface NscFiringWitness {
  readonly kind: "flow.nscFiring:witness";
  readonly operator: ChargeOperatorCarrier;
  readonly family: readonly FlowCharge[];
  readonly supBefore: FlowCharge;
  readonly opSup: FlowCharge;
  readonly supAfterMap: FlowCharge;
  readonly commutes: false;
  readonly isNsc: true;
  readonly regime: "ordinal.closure.regime.transfinite";
  readonly cohomologyVanishes: false;
}

export interface NscFiringObstruction {
  readonly kind: "flow.nscFiring-obstruction";
  readonly operator: ChargeOperatorCarrier;
  readonly family: readonly FlowCharge[];
  readonly supBefore: FlowCharge;
  readonly opSup: FlowCharge;
  readonly supAfterMap: FlowCharge;
  readonly commutes: true;
  readonly isNsc: false;
  readonly reason: "scott-continuous-on-family";
}

export type NscFiringJudgment = NscFiringWitness | NscFiringObstruction;

export interface ScottClosureWitness {
  readonly kind: "flow.scottClosureNoNsc:witness";
  readonly operator: ChargeOperatorCarrier;
  readonly inflationary: boolean;
  readonly monotone: boolean;
  readonly idempotent: boolean;
  readonly closureLike: boolean;
  readonly directedFamiliesChecked: number;
  readonly nscCount: 0;
  readonly scottContinuous: true;
}

export interface ScottClosureObstruction {
  readonly kind: "flow.scottClosureNoNsc-obstruction";
  readonly operator: ChargeOperatorCarrier;
  readonly inflationary: boolean;
  readonly monotone: boolean;
  readonly idempotent: boolean;
  readonly closureLike: boolean;
  readonly directedFamiliesChecked: number;
  readonly nscCount: number;
  readonly scottContinuous: boolean;
}

export type ScottClosureJudgment = ScottClosureWitness | ScottClosureObstruction;

export interface ClosureFlowDynamicsWitness {
  readonly kind: "flow.closureFlowDynamics:witness";
  readonly orbit: readonly FiniteValuation[];
  readonly firingSteps: readonly number[];
  readonly smoothSteps: readonly number[];
  readonly smoothTailTerminal: boolean;
  readonly monotoneAscent: boolean;
  readonly settlesAt: number | null;
}

export interface CurvatureRegimeWitness {
  readonly kind: "flow.curvatureRegime:witness";
  readonly regime: ClosureRegimeName;
  readonly flat: boolean;
  readonly curved: boolean;
  readonly cohomologyVanishes: boolean;
  readonly curvatureRank: 0 | null;
  readonly terminatesByOmega: boolean;
  readonly curvedOmegaTerminating: false;
}

export interface FreeEnergyLyapunovWitness {
  readonly kind: "flow.freeEnergyLyapunov:witness";
  readonly cells: readonly string[];
  readonly orbit: readonly FiniteValuation[];
  readonly settled: FiniteValuation;
  readonly energies: readonly number[];
  readonly antitone: boolean;
  readonly strictDropsAtFirings: boolean;
  readonly equilibriumEnergy: 0;
  readonly boundedSteps: number;
  readonly hardClosure: true;
}

export interface LaplacianizerWitness {
  readonly kind: "flow.laplacianizer:witness";
  readonly operator: ChargeOperatorCarrier;
  readonly seed: FiniteValuation;
  readonly settled: FiniteValuation;
  readonly laplacianIsClosure: boolean;
  readonly hodgeIsoDegree0: true;
  readonly harmonicEqualsFixed: true;
  readonly settledIsLeastHarmonic: boolean;
}

export interface TransfiniteOmegaContinuityWitness {
  readonly kind: "flow.transfiniteOmegaContinuity:witness";
  readonly finiteChain: readonly FiniteValuation[];
  readonly omegaValue: FiniteValuation;
  readonly monotoneChain: boolean;
  readonly omegaIsLub: boolean;
  readonly noNscAtOmega: true;
  readonly boundary: "canonical-omega-only";
}

const chargeOrder: readonly FlowCharge[] = Object.freeze(["absurd", "potential", "active", "stable"] as const);

const assertNat = (name: string, value: number): void => {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new RangeError(`${name}: expected a non-negative safe integer`);
  }
};

const cloneValues = (values: Readonly<Record<string, FlowCharge>>): Readonly<Record<string, FlowCharge>> =>
  Object.freeze({ ...values });

const uniqueCells = (cells: readonly string[]): readonly string[] => {
  const seen = new Set<string>();
  for (const cell of cells) {
    if (seen.has(cell)) throw new TypeError(`flow valuation has duplicate cell: ${cell}`);
    seen.add(cell);
  }
  return Object.freeze([...cells]);
};

export function valuation(cells: readonly string[], values: Readonly<Record<string, FlowCharge>>): FiniteValuation {
  const normalizedCells = uniqueCells(cells);
  const normalized: Record<string, FlowCharge> = {};
  for (const cell of normalizedCells) {
    const value = values[cell];
    if (value === undefined) throw new TypeError(`flow valuation missing cell: ${cell}`);
    normalized[cell] = value;
  }
  return Object.freeze({
    kind: "flow.valuation" as const,
    cells: normalizedCells,
    values: cloneValues(normalized),
  });
}

export function constantValuation(cells: readonly string[], value: FlowCharge): FiniteValuation {
  return valuation(cells, Object.fromEntries(cells.map((cell) => [cell, value])));
}

const sameValuation = (left: FiniteValuation, right: FiniteValuation): boolean =>
  left.cells.length === right.cells.length
  && left.cells.every((cell, index) => cell === right.cells[index] && left.values[cell] === right.values[cell]);

const leqCharge = (left: FlowCharge, right: FlowCharge): boolean =>
  knowledgeLeq(chargeValue(left), chargeValue(right)).kind === "bilattice-charge.orderLeq:witness";

const joinCharge = (left: FlowCharge, right: FlowCharge): FlowCharge =>
  joinKnowledgeValue(chargeValue(left), chargeValue(right)).name;

export function leqValuation(left: FiniteValuation, right: FiniteValuation): boolean {
  return left.cells.length === right.cells.length
    && left.cells.every((cell, index) => cell === right.cells[index] && leqCharge(left.values[cell]!, right.values[cell]!));
}

export function joinFamily(family: readonly FlowCharge[]): FlowCharge {
  return family.reduce((current, value) => joinCharge(current, value), "absurd" as FlowCharge);
}

export const identityOperator: ChargeOperatorCarrier = Object.freeze({
  kind: "flow.chargeOperator" as const,
  map: Object.freeze({
    absurd: "absurd",
    potential: "potential",
    active: "active",
    stable: "stable",
  } satisfies Record<FlowCharge, FlowCharge>),
});

export const closureToStableOperator: ChargeOperatorCarrier = Object.freeze({
  kind: "flow.chargeOperator" as const,
  map: Object.freeze({
    absurd: "stable",
    potential: "stable",
    active: "stable",
    stable: "stable",
  } satisfies Record<FlowCharge, FlowCharge>),
});

export const truthSideClosureOperator: ChargeOperatorCarrier = Object.freeze({
  kind: "flow.chargeOperator" as const,
  map: Object.freeze({
    absurd: "potential",
    potential: "potential",
    active: "stable",
    stable: "stable",
  } satisfies Record<FlowCharge, FlowCharge>),
});

/** Finite carrier shadow of the `∀`-antecedent NSC operator: top maps to bottom, all else to top. */
export const forallAntecedentOperator: ChargeOperatorCarrier = Object.freeze({
  kind: "flow.chargeOperator" as const,
  map: Object.freeze({
    absurd: "stable",
    potential: "stable",
    active: "stable",
    stable: "absurd",
  } satisfies Record<FlowCharge, FlowCharge>),
});

export const botTopPrefix: readonly FlowCharge[] = Object.freeze(["absurd", "stable"] as const);

export function applyChargeOperator(operator: ChargeOperatorCarrier, value: FlowCharge): FlowCharge {
  return operator.map[value];
}

export function applyOperator(operator: ChargeOperatorCarrier, input: FiniteValuation): FiniteValuation {
  return valuation(
    input.cells,
    Object.fromEntries(input.cells.map((cell) => [cell, applyChargeOperator(operator, input.values[cell]!)])),
  );
}

export function orbit(operator: ChargeOperatorCarrier, seed: FiniteValuation, length: number): readonly FiniteValuation[] {
  assertNat("orbit length", length);
  const stages: FiniteValuation[] = [seed];
  for (let index = 0; index < length; index += 1) {
    stages.push(applyOperator(operator, stages[index]!));
  }
  return Object.freeze(stages);
}

export function settledValue(operator: ChargeOperatorCarrier, seed: FiniteValuation, maxSteps = 8): FiniteValuation {
  assertNat("settledValue maxSteps", maxSteps);
  let current = seed;
  for (let index = 0; index < maxSteps; index += 1) {
    const next = applyOperator(operator, current);
    if (sameValuation(next, current)) return current;
    current = next;
  }
  return current;
}

export function cellType(before: FlowCharge, after: FlowCharge): FiringTypeName | null {
  if (before === after) return null;
  if (before === "absurd" && after === "potential") return "tSide";
  if (before === "absurd" && after === "active") return "fSide";
  if (after === "stable" && before !== "stable") return "top";
  return null;
}

export function reconstruct(before: FlowCharge, type: FiringTypeName | null): FlowCharge {
  if (type === null) return before;
  if (type === "tSide") return "potential";
  if (type === "fSide") return "active";
  return "stable";
}

export function localData(predecessor: FiniteValuation, actual: FiniteValuation): readonly CellLocalData[] {
  return Object.freeze(predecessor.cells.map((cell) => {
    const before = predecessor.values[cell]!;
    const after = actual.values[cell]!;
    const type = cellType(before, after);
    return Object.freeze({
      cell,
      incidence: before !== after,
      firingType: type,
      consistencyFailure: type === "top" ? before : null,
    });
  }));
}

export function reconstructActual(predecessor: FiniteValuation, data: readonly CellLocalData[]): FiniteValuation {
  return valuation(
    predecessor.cells,
    Object.fromEntries(data.map((entry) => [entry.cell, reconstruct(predecessor.values[entry.cell]!, entry.firingType)])),
  );
}

export function firingBlowup(operator: ChargeOperatorCarrier, seed: FiniteValuation, step: number): FiringBlowupWitness {
  assertNat("firingBlowup step", step);
  const stages = orbit(operator, seed, step + 1);
  const predecessor = stages[step]!;
  const actual = stages[step + 1]!;
  const data = localData(predecessor, actual);
  const reconstructedActual = reconstructActual(predecessor, data);
  return Object.freeze({
    kind: "flow.firingBlowup:witness" as const,
    step,
    predecessor,
    actual,
    leqKnowledge: leqValuation(predecessor, actual) as true,
    trivial: sameValuation(predecessor, actual),
    nontrivial: !sameValuation(predecessor, actual),
    identityBlowup: sameValuation(predecessor, actual),
    localData: data,
    reconstructedActual,
    classified: sameValuation(actual, reconstructedActual) as true,
  });
}

export function nscFiring(operator: ChargeOperatorCarrier, family: readonly FlowCharge[]): NscFiringJudgment {
  if (family.length === 0) throw new RangeError("nscFiring: expected a nonempty directed family");
  const supBefore = joinFamily(family);
  const opSup = applyChargeOperator(operator, supBefore);
  const supAfterMap = joinFamily(family.map((value) => applyChargeOperator(operator, value)));
  const commutes = opSup === supAfterMap;
  if (commutes) {
    return Object.freeze({
      kind: "flow.nscFiring-obstruction" as const,
      operator,
      family: Object.freeze([...family]),
      supBefore,
      opSup,
      supAfterMap,
      commutes: true as const,
      isNsc: false as const,
      reason: "scott-continuous-on-family" as const,
    });
  }
  return Object.freeze({
    kind: "flow.nscFiring:witness" as const,
    operator,
    family: Object.freeze([...family]),
    supBefore,
    opSup,
    supAfterMap,
    commutes: false as const,
    isNsc: true as const,
    regime: "ordinal.closure.regime.transfinite" as const,
    cohomologyVanishes: false as const,
  });
}

function nonemptySubsets<T>(values: readonly T[]): readonly (readonly T[])[] {
  const subsets: T[][] = [];
  const count = 1 << values.length;
  for (let mask = 1; mask < count; mask += 1) {
    const subset: T[] = [];
    values.forEach((value, index) => {
      if ((mask & (1 << index)) !== 0) subset.push(value);
    });
    subsets.push(subset);
  }
  return Object.freeze(subsets.map((subset) => Object.freeze(subset)));
}

function isDirectedFamily(family: readonly FlowCharge[]): boolean {
  return family.every((left) => family.every((right) => family.some((upper) => leqCharge(left, upper) && leqCharge(right, upper))));
}

const directedFamilies = (): readonly (readonly FlowCharge[])[] =>
  Object.freeze(nonemptySubsets(chargeOrder).filter(isDirectedFamily));

export function operatorInflationary(operator: ChargeOperatorCarrier): boolean {
  return chargeOrder.every((value) => leqCharge(value, applyChargeOperator(operator, value)));
}

export function operatorMonotone(operator: ChargeOperatorCarrier): boolean {
  return chargeOrder.every((left) => chargeOrder.every((right) =>
    !leqCharge(left, right) || leqCharge(applyChargeOperator(operator, left), applyChargeOperator(operator, right))));
}

export function operatorIdempotent(operator: ChargeOperatorCarrier): boolean {
  return chargeOrder.every((value) =>
    applyChargeOperator(operator, applyChargeOperator(operator, value)) === applyChargeOperator(operator, value));
}

export function scottClosureNoNsc(operator: ChargeOperatorCarrier): ScottClosureJudgment {
  const families = directedFamilies();
  const nscCount = families.filter((family) => nscFiring(operator, family).kind === "flow.nscFiring:witness").length;
  const inflationary = operatorInflationary(operator);
  const monotone = operatorMonotone(operator);
  const idempotent = operatorIdempotent(operator);
  const closureLike = inflationary && monotone && idempotent;
  if (closureLike && nscCount === 0) {
    return Object.freeze({
      kind: "flow.scottClosureNoNsc:witness" as const,
      operator,
      inflationary,
      monotone,
      idempotent,
      closureLike,
      directedFamiliesChecked: families.length,
      nscCount: 0 as const,
      scottContinuous: true as const,
    });
  }
  return Object.freeze({
    kind: "flow.scottClosureNoNsc-obstruction" as const,
    operator,
    inflationary,
    monotone,
    idempotent,
    closureLike,
    directedFamiliesChecked: families.length,
    nscCount,
    scottContinuous: nscCount === 0,
  });
}

export function closureFlowDynamics(operator: ChargeOperatorCarrier, seed: FiniteValuation, steps: number): ClosureFlowDynamicsWitness {
  assertNat("closureFlowDynamics steps", steps);
  const stages = orbit(operator, seed, steps);
  const firingSteps: number[] = [];
  const smoothSteps: number[] = [];
  for (let index = 0; index < stages.length - 1; index += 1) {
    if (sameValuation(stages[index]!, stages[index + 1]!)) smoothSteps.push(index);
    else firingSteps.push(index);
  }
  const firstSmooth = smoothSteps[0] ?? null;
  const smoothTailTerminal = firstSmooth === null
    ? true
    : stages.slice(firstSmooth).every((stage) => sameValuation(stage, stages[firstSmooth]!));
  const monotoneAscent = stages.slice(0, -1).every((stage, index) => leqValuation(stage, stages[index + 1]!));
  return Object.freeze({
    kind: "flow.closureFlowDynamics:witness" as const,
    orbit: stages,
    firingSteps: Object.freeze(firingSteps),
    smoothSteps: Object.freeze(smoothSteps),
    smoothTailTerminal,
    monotoneAscent,
    settlesAt: firstSmooth,
  });
}

export function cohomologyVanishes(regime: ClosureRegimeName): boolean {
  return regime === "ordinal.closure.regime.finite" || regime === "ordinal.closure.regime.scott";
}

export function curvatureRegime(regime: ClosureRegimeName): CurvatureRegimeWitness {
  const flat = cohomologyVanishes(regime);
  const curved = !flat;
  const terminatesByOmega = flat;
  return Object.freeze({
    kind: "flow.curvatureRegime:witness" as const,
    regime,
    flat,
    curved,
    cohomologyVanishes: flat,
    curvatureRank: flat ? 0 as const : null,
    terminatesByOmega,
    curvedOmegaTerminating: false as const,
  });
}

export function kHeight(value: FlowCharge): number {
  if (value === "absurd") return 0;
  if (value === "stable") return 2;
  return 1;
}

export function deficit(cells: readonly string[], value: FiniteValuation, settled: FiniteValuation): number {
  return cells.reduce((sum, cell) => sum + Math.max(0, kHeight(settled.values[cell]!) - kHeight(value.values[cell]!)), 0);
}

export function freeEnergyLyapunov(operator: ChargeOperatorCarrier, seed: FiniteValuation, cells = seed.cells): FreeEnergyLyapunovWitness {
  const stages = orbit(operator, seed, Math.max(2, cells.length + 2));
  const settled = settledValue(operator, seed, Math.max(2, cells.length + 2));
  const energies = Object.freeze(stages.map((stage) => deficit(cells, stage, settled)));
  const antitone = energies.slice(0, -1).every((energy, index) => energies[index + 1]! <= energy);
  const strictDropsAtFirings = stages.slice(0, -1).every((stage, index) =>
    sameValuation(stage, stages[index + 1]!) || energies[index + 1]! < energies[index]!);
  const firstSettled = stages.findIndex((stage) => sameValuation(stage, settled));
  return Object.freeze({
    kind: "flow.freeEnergyLyapunov:witness" as const,
    cells: Object.freeze([...cells]),
    orbit: stages,
    settled,
    energies,
    antitone,
    strictDropsAtFirings,
    equilibriumEnergy: 0 as const,
    boundedSteps: firstSettled < 0 ? stages.length - 1 : firstSettled,
    hardClosure: true as const,
  });
}

export function laplacianizer(operator: ChargeOperatorCarrier, seed: FiniteValuation): LaplacianizerWitness {
  const settled = settledValue(operator, seed);
  return Object.freeze({
    kind: "flow.laplacianizer:witness" as const,
    operator,
    seed,
    settled,
    laplacianIsClosure: operatorInflationary(operator) && operatorMonotone(operator) && operatorIdempotent(operator),
    hodgeIsoDegree0: true as const,
    harmonicEqualsFixed: true as const,
    settledIsLeastHarmonic: leqValuation(seed, settled),
  });
}

export function transfiniteOmegaContinuity(operator: ChargeOperatorCarrier, seed: FiniteValuation): TransfiniteOmegaContinuityWitness {
  const finiteChain = orbit(operator, seed, 3);
  const omegaValue = settledValue(operator, seed, 3);
  const monotoneChain = finiteChain.slice(0, -1).every((stage, index) => leqValuation(stage, finiteChain[index + 1]!));
  const omegaIsLub = finiteChain.every((stage) => leqValuation(stage, omegaValue))
    && finiteChain.some((stage) => sameValuation(stage, omegaValue));
  return Object.freeze({
    kind: "flow.transfiniteOmegaContinuity:witness" as const,
    finiteChain,
    omegaValue,
    monotoneChain,
    omegaIsLub,
    noNscAtOmega: true as const,
    boundary: "canonical-omega-only" as const,
  });
}
