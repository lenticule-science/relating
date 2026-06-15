import {
  asChargeValue,
  chargeValue,
  sameChargeValue,
  negateValue,
  joinKnowledgeValue,
  type ChargeValue,
} from "./bilattice-charge.mjs";
import { type EntitySet, type PredicateSet } from "./predication.mjs";
import { fromCount, type Natural } from "./exact-number.mjs";

export type RelationSameness<T> = (left: T, right: T) => boolean;

export interface RelationReadWitness<Point = unknown, State = unknown> {
  readonly kind: "bilattice.relation.read:witness";
  readonly point: Point;
  readonly state: State;
  readonly value: ChargeValue;
}

export interface RelationReadObstruction<Point = unknown, State = unknown> {
  readonly kind: "bilattice.relation.read-obstruction";
  readonly point: Point;
  readonly state: State;
  readonly absent: ChargeValue;
}

export type RelationReadJudgment<Point = unknown, State = unknown> =
  | RelationReadWitness<Point, State>
  | RelationReadObstruction<Point, State>;

export interface RelationCarrier<Point = unknown, State = unknown> {
  readonly kind: "bilattice.relation.carrier";
  readonly points: EntitySet<Point>;
  readonly states: PredicateSet<State>;
  readonly absent: ChargeValue;
  readonly samePoint: RelationSameness<Point>;
  readonly sameState: RelationSameness<State>;
  readonly read: (point: Point, state: State) => RelationReadJudgment<Point, State>;
  readonly at: (point: Point, state: State) => ChargeValue;
}

export interface RelationMatrixEntry<Point = unknown, State = unknown> {
  readonly kind: "bilattice.relation.matrixEntry";
  readonly point: Point;
  readonly state: State;
  readonly value: ChargeValue;
}

export interface RelationMatrixEntryWitness<Point = unknown, State = unknown> {
  readonly kind: "bilattice.relation.matrixEntry:witness";
  readonly entry: RelationMatrixEntry<Point, State>;
}

export interface RelationMatrixEntryObstruction<Point = unknown, State = unknown> {
  readonly kind: "bilattice.relation.matrixEntry-obstruction";
  readonly point: Point;
  readonly state: State;
}

export type RelationMatrixEntryJudgment<Point = unknown, State = unknown> =
  | RelationMatrixEntryWitness<Point, State>
  | RelationMatrixEntryObstruction<Point, State>;

export interface RelationMatrixCarrier<Point = unknown, State = unknown> {
  readonly kind: "bilattice.relation.matrix";
  readonly points: EntitySet<Point>;
  readonly states: PredicateSet<State>;
  readonly values: readonly RelationMatrixEntry<Point, State>[];
  readonly rank: Natural;
  readonly samePoint: RelationSameness<Point>;
  readonly sameState: RelationSameness<State>;
}

export interface PointProfileEntry<State = unknown> {
  readonly kind: "bilattice.relation.pointProfileEntry";
  readonly state: State;
  readonly value: ChargeValue;
}

export interface PointProfileCarrier<Point = unknown, State = unknown> {
  readonly kind: "bilattice.relation.pointProfile";
  readonly point: Point;
  readonly entries: readonly PointProfileEntry<State>[];
  readonly rank: Natural;
}

export interface StateProfileEntry<Point = unknown> {
  readonly kind: "bilattice.relation.stateProfileEntry";
  readonly point: Point;
  readonly value: ChargeValue;
}

export interface StateProfileCarrier<Point = unknown, State = unknown> {
  readonly kind: "bilattice.relation.stateProfile";
  readonly state: State;
  readonly entries: readonly StateProfileEntry<Point>[];
  readonly rank: Natural;
}

export interface StateExtensionCarrier<Point = unknown, State = unknown> {
  readonly kind: "bilattice.relation.stateExtension";
  readonly state: State;
  readonly points: EntitySet<Point>;
  readonly rank: Natural;
}

export type RelationForward<SourcePoint = unknown, TargetPoint = unknown> = (point: SourcePoint) => TargetPoint;
export type RelationBackward<TargetState = unknown, SourceState = unknown> = (state: TargetState) => SourceState;

export type RelationReadFunction<Point = unknown, State = unknown> = (point: Point, state: State) => RelationReadJudgment<Point, State>;

export interface RelationOptions<Point = unknown, State = unknown> {
  readonly absent?: ChargeValue;
  readonly samePoint: RelationSameness<Point>;
  readonly sameState: RelationSameness<State>;
}

export interface RelationTransform<SourcePoint = unknown, SourceState = unknown, TargetPoint = unknown, TargetState = unknown> {
  readonly kind: "bilattice.relation.transform";
  readonly source: RelationCarrier<SourcePoint, SourceState>;
  readonly target: RelationCarrier<TargetPoint, TargetState>;
  readonly forward: RelationForward<SourcePoint, TargetPoint>;
  readonly backward: RelationBackward<TargetState, SourceState>;
}

export interface RelationTransformForwardDomainObstruction<Point = unknown, TargetPoint = unknown> {
  readonly kind: "bilattice.relation.transform.forwardDomain-obstruction";
  readonly point: Point;
  readonly mapped: TargetPoint;
}

export interface RelationTransformBackwardDomainObstruction<State = unknown, SourceState = unknown> {
  readonly kind: "bilattice.relation.transform.backwardDomain-obstruction";
  readonly state: State;
  readonly mapped: SourceState;
}

export interface RelationTransformAdjointnessObstruction<Point = unknown, State = unknown> {
  readonly kind: "bilattice.relation.transform.adjointness-obstruction";
  readonly point: Point;
  readonly state: State;
  readonly left: ChargeValue;
  readonly right: ChargeValue;
}

export type RelationTransformObstructionAtom<SourcePoint = unknown, SourceState = unknown, TargetPoint = unknown, TargetState = unknown> =
  | RelationTransformForwardDomainObstruction<SourcePoint, TargetPoint>
  | RelationTransformBackwardDomainObstruction<TargetState, SourceState>
  | RelationTransformAdjointnessObstruction<SourcePoint, TargetState>;

export interface RelationTransformWitness<SourcePoint = unknown, SourceState = unknown, TargetPoint = unknown, TargetState = unknown> {
  readonly kind: "bilattice.relation.transform:witness";
  readonly source: RelationCarrier<SourcePoint, SourceState>;
  readonly target: RelationCarrier<TargetPoint, TargetState>;
  readonly forward: RelationForward<SourcePoint, TargetPoint>;
  readonly backward: RelationBackward<TargetState, SourceState>;
}

export interface RelationTransformObstruction<SourcePoint = unknown, SourceState = unknown, TargetPoint = unknown, TargetState = unknown> {
  readonly kind: "bilattice.relation.transform-obstruction";
  readonly source: RelationCarrier<SourcePoint, SourceState>;
  readonly target: RelationCarrier<TargetPoint, TargetState>;
  readonly failures: readonly RelationTransformObstructionAtom<SourcePoint, SourceState, TargetPoint, TargetState>[];
  readonly rank: Natural;
}

export type RelationTransformJudgment<SourcePoint = unknown, SourceState = unknown, TargetPoint = unknown, TargetState = unknown> =
  | RelationTransformWitness<SourcePoint, SourceState, TargetPoint, TargetState>
  | RelationTransformObstruction<SourcePoint, SourceState, TargetPoint, TargetState>;

export function relation<Point, State>(
  points: EntitySet<Point>,
  states: PredicateSet<State>,
  read: RelationReadFunction<Point, State>,
  options: RelationOptions<Point, State>,
): RelationCarrier<Point, State> {
  const samePoint = options.samePoint;
  const sameState = options.sameState;
  const absent = asChargeValue(options.absent ?? chargeValue("active"));
  const carrierRead = (point: Point, state: State): RelationReadJudgment<Point, State> => {
    if (!states.predicates.some((candidate) => sameState(candidate, state))) {
      return Object.freeze({
        kind: "bilattice.relation.read-obstruction" as const,
        point,
        state,
        absent,
      });
    }
    return read(point, state);
  };
  return Object.freeze({
    kind: "bilattice.relation.carrier" as const,
    points,
    states,
    absent,
    samePoint,
    sameState,
    read: carrierRead,
    at: (point: Point, state: State): ChargeValue => {
      const reading = carrierRead(point, state);
      return reading.kind === "bilattice.relation.read:witness" ? asChargeValue(reading.value) : reading.absent;
    },
  });
}

export function relationRead<Point, State>(
  point: Point,
  state: State,
  value: ChargeValue,
): RelationReadWitness<Point, State> {
  return Object.freeze({
    kind: "bilattice.relation.read:witness" as const,
    point,
    state,
    value: asChargeValue(value),
  });
}

export function relationReadAbsence<Point, State>(
  point: Point,
  state: State,
  absent: ChargeValue,
): RelationReadObstruction<Point, State> {
  return Object.freeze({
    kind: "bilattice.relation.read-obstruction" as const,
    point,
    state,
    absent: asChargeValue(absent),
  });
}

export function relationMatrix<Point, State>(
  points: EntitySet<Point>,
  states: PredicateSet<State>,
  entries: Iterable<readonly [point: Point, state: State, value: ChargeValue]>,
  options: Pick<RelationOptions<Point, State>, "samePoint" | "sameState">,
): RelationMatrixCarrier<Point, State> {
  const samePoint = options.samePoint;
  const sameState = options.sameState;
  const values: RelationMatrixEntry<Point, State>[] = [];
  for (const [point, state, value] of entries) {
    const existing = values.find((entry) => samePoint(entry.point, point) && sameState(entry.state, state));
    // Duplicate (point, state) entries knowledge-join: conflicting charges
    // settle to stable and the constructor is order-insensitive. Replacing
    // the earlier entry would resolve the contradiction to whichever side
    // was iterated last.
    const entry = Object.freeze({
      kind: "bilattice.relation.matrixEntry" as const,
      point,
      state,
      value: existing ? joinKnowledgeValue(existing.value, asChargeValue(value)) : asChargeValue(value),
    });
    if (existing) values.splice(values.indexOf(existing), 1, entry);
    else values.push(entry);
  }
  return Object.freeze({
    kind: "bilattice.relation.matrix" as const,
    points,
    states,
    values: Object.freeze(values),
    rank: fromCount(values.length),
    samePoint,
    sameState,
  });
}

export function matrixEntryReading<Point, State>(
  matrix: RelationMatrixCarrier<Point, State>,
  point: Point,
  state: State,
): RelationMatrixEntryJudgment<Point, State> {
  const entry = matrix.values.find((candidate) => matrix.samePoint(candidate.point, point) && matrix.sameState(candidate.state, state));
  return entry
    ? Object.freeze({ kind: "bilattice.relation.matrixEntry:witness" as const, entry })
    : Object.freeze({ kind: "bilattice.relation.matrixEntry-obstruction" as const, point, state });
}

export function relationFromMatrix<Point, State>(
  matrix: RelationMatrixCarrier<Point, State>,
  options: { readonly absent?: ChargeValue } = {},
): RelationCarrier<Point, State> {
  return relation(
    matrix.points,
    matrix.states,
    (point, state) => {
      const reading = matrixEntryReading(matrix, point, state);
      return reading.kind === "bilattice.relation.matrixEntry:witness"
        ? relationRead(point, state, reading.entry.value)
        : relationReadAbsence(point, state, asChargeValue(options.absent ?? chargeValue("active")));
    },
    { ...options, samePoint: matrix.samePoint, sameState: matrix.sameState },
  );
}

export function isRelationCarrier(value: unknown): value is RelationCarrier {
  return !!value && typeof value === "object" && (value as RelationCarrier).kind === "bilattice.relation.carrier";
}

export function pointProfile<Point, State>(carrier: RelationCarrier<Point, State>, point: Point): PointProfileCarrier<Point, State> {
  const entries = Object.freeze(carrier.states.predicates.map((state) => Object.freeze({
    kind: "bilattice.relation.pointProfileEntry" as const,
    state,
    value: carrier.at(point, state),
  })));
  return Object.freeze({
    kind: "bilattice.relation.pointProfile" as const,
    point,
    entries,
    rank: fromCount(entries.length),
  });
}

export function stateProfile<Point, State>(carrier: RelationCarrier<Point, State>, state: State): StateProfileCarrier<Point, State> {
  const entries = Object.freeze(carrier.points.entities.map((point) => Object.freeze({
    kind: "bilattice.relation.stateProfileEntry" as const,
    point,
    value: carrier.at(point, state),
  })));
  return Object.freeze({
    kind: "bilattice.relation.stateProfile" as const,
    state,
    entries,
    rank: fromCount(entries.length),
  });
}

export function stateExtension<Point, State>(carrier: RelationCarrier<Point, State>, state: State): StateExtensionCarrier<Point, State> {
  // A point belongs to the extension when its truth coordinate is present:
  // potential AND stable. The stable point holds the state, contradictorily.
  const points = Object.freeze(stateProfile(carrier, state).entries.filter((entry) =>
    sameChargeValue(entry.value, chargeValue("potential")) || sameChargeValue(entry.value, chargeValue("stable"))).map((entry) => entry.point));
  return Object.freeze({
    kind: "bilattice.relation.stateExtension" as const,
    state,
    points: Object.freeze({
      kind: "predication.entitySet" as const,
      entities: points,
    }),
    rank: fromCount(points.length),
  });
}

export function transpose<Point, State>(carrier: RelationCarrier<Point, State>): RelationCarrier<State, Point> {
  return relation(
    { kind: "predication.entitySet" as const, entities: carrier.states.predicates },
    { kind: "predication.predicateSet" as const, predicates: carrier.points.entities },
    (state, point) => relationRead(state, point, carrier.at(point, state)),
    { absent: carrier.absent, samePoint: carrier.sameState, sameState: carrier.samePoint },
  );
}

export function dual<Point, State>(carrier: RelationCarrier<Point, State>): RelationCarrier<State, Point> {
  return relation(
    { kind: "predication.entitySet" as const, entities: carrier.states.predicates },
    { kind: "predication.predicateSet" as const, predicates: carrier.points.entities },
    (state, point) => relationRead(state, point, negateValue(carrier.at(point, state))),
    { absent: negateValue(carrier.absent), samePoint: carrier.sameState, sameState: carrier.samePoint },
  );
}

export function settleStateProfile(
  carrier: RelationCarrier<unknown, unknown>,
  state: unknown,
  join: (left: ChargeValue, right: ChargeValue) => ChargeValue = joinKnowledgeValue,
  identity: ChargeValue = chargeValue("absurd"),
): ChargeValue {
  return stateProfile(carrier, state).entries.reduce((acc, entry) => join(acc, entry.value), identity);
}

export function settlePointProfile(
  carrier: RelationCarrier<unknown, unknown>,
  point: unknown,
  join: (left: ChargeValue, right: ChargeValue) => ChargeValue = joinKnowledgeValue,
  identity: ChargeValue = chargeValue("absurd"),
): ChargeValue {
  return pointProfile(carrier, point).entries.reduce((acc, entry) => join(acc, entry.value), identity);
}

export function checkRelationTransform<SourcePoint, SourceState, TargetPoint, TargetState>(
  source: RelationCarrier<SourcePoint, SourceState>,
  target: RelationCarrier<TargetPoint, TargetState>,
  forward: RelationForward<SourcePoint, TargetPoint>,
  backward: RelationBackward<TargetState, SourceState>,
): RelationTransformJudgment<SourcePoint, SourceState, TargetPoint, TargetState> {
  const failures: RelationTransformObstructionAtom<SourcePoint, SourceState, TargetPoint, TargetState>[] = [];
  for (const point of source.points.entities) {
    const mapped = forward(point);
    if (!target.points.entities.some((candidate) => target.samePoint(candidate, mapped))) {
      failures.push(Object.freeze({ kind: "bilattice.relation.transform.forwardDomain-obstruction" as const, point, mapped }));
    }
  }
  for (const state of target.states.predicates) {
    const mapped = backward(state);
    if (!source.states.predicates.some((candidate) => source.sameState(candidate, mapped))) {
      failures.push(Object.freeze({ kind: "bilattice.relation.transform.backwardDomain-obstruction" as const, state, mapped }));
    }
  }
  if (failures.length > 0) {
    return Object.freeze({
      kind: "bilattice.relation.transform-obstruction" as const,
      source,
      target,
      failures: Object.freeze(failures),
      rank: fromCount(failures.length),
    });
  }
  for (const point of source.points.entities) {
    for (const state of target.states.predicates) {
      const left = target.at(forward(point), state);
      const right = source.at(point, backward(state));
      if (!sameChargeValue(left, right)) {
        failures.push(Object.freeze({ kind: "bilattice.relation.transform.adjointness-obstruction" as const, point, state, left, right }));
      }
    }
  }
  if (failures.length > 0) {
    return Object.freeze({
      kind: "bilattice.relation.transform-obstruction" as const,
      source,
      target,
      failures: Object.freeze(failures),
      rank: fromCount(failures.length),
    });
  }
  return Object.freeze({
    kind: "bilattice.relation.transform:witness" as const,
    source,
    target,
    forward,
    backward,
  });
}

export function relationTransform<SourcePoint, SourceState, TargetPoint, TargetState>(
  source: RelationCarrier<SourcePoint, SourceState>,
  target: RelationCarrier<TargetPoint, TargetState>,
  forward: RelationForward<SourcePoint, TargetPoint>,
  backward: RelationBackward<TargetState, SourceState>,
): RelationTransform<SourcePoint, SourceState, TargetPoint, TargetState> {
  const check = checkRelationTransform(source, target, forward, backward);
  if (check.kind === "bilattice.relation.transform-obstruction") throw new TypeError(`relationTransform: not adjoint (${check.failures.length} violation(s))`);
  return Object.freeze({ kind: "bilattice.relation.transform" as const, source, target, forward, backward });
}

export function isRelationTransform(value: unknown): value is RelationTransform {
  return !!value && typeof value === "object" && (value as RelationTransform).kind === "bilattice.relation.transform";
}

export function idTransform<Point, State>(carrier: RelationCarrier<Point, State>): RelationTransform<Point, State, Point, State> {
  return relationTransform(carrier, carrier, (point) => point, (state) => state);
}

export function composeTransforms(left: RelationTransform, right: RelationTransform): RelationTransform {
  if (left.target !== right.source) throw new TypeError("composeTransforms: left.target must be right.source");
  return relationTransform(
    left.source,
    right.target,
    (point) => right.forward(left.forward(point)),
    (state) => left.backward(right.backward(state)),
  );
}

export function dualTransform(transform: RelationTransform): RelationTransform {
  return relationTransform(
    dual(transform.target),
    dual(transform.source),
    transform.backward,
    transform.forward,
  );
}
