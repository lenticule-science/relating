export type ChargeValueName = "absurd" | "potential" | "active" | "stable";
export type ChargeSideName = "absent" | "present";

export interface ChargeSide {
  readonly kind: "bilattice-charge.side";
  readonly name: ChargeSideName;
}

export type ChargeCoordinates = readonly [truth: ChargeSide, falsity: ChargeSide];

export interface ChargeValue {
  readonly kind: "bilattice-charge.value";
  readonly name: ChargeValueName;
  readonly coordinates: ChargeCoordinates;
}

export interface ChargeCarrier {
  readonly kind: "bilattice-charge.carrier";
  readonly value: ChargeCoordinates;
  readonly evidence: readonly [readonly unknown[], readonly unknown[]];
}

export interface ChargeFiniteAlgebraCarrier {
  readonly kind: "bilattice-charge.finiteAlgebra";
  readonly sides: readonly ChargeSide[];
  readonly values: readonly ChargeValue[];
}

export interface ChargePair {
  readonly left: ChargeCarrier;
  readonly right: ChargeCarrier;
}

export interface FiringPatternSelfDualityWitness {
  readonly kind: "bilattice-charge.firingPatternSelfDuality:witness";
  readonly labeling: readonly ChargeValue[];
  readonly gaugeElement: GaugeElementName;
  readonly fixed: readonly ChargeValue[];
}

export interface FiringPatternSelfDualityObstruction {
  readonly kind: "bilattice-charge.firingPatternSelfDuality-obstruction";
  readonly labeling: readonly ChargeValue[];
  readonly gaugeElement: GaugeElementName;
  readonly fixed: readonly ChargeValue[];
  readonly moving: readonly ChargeValue[];
}

export type FiringPatternSelfDualityJudgment = FiringPatternSelfDualityWitness | FiringPatternSelfDualityObstruction;

export const chargeSideNames = (): readonly ChargeSideName[] =>
  Object.freeze(["absent", "present"] as const satisfies readonly ChargeSideName[]);

export const chargeValueNames = (): readonly ChargeValueName[] =>
  Object.freeze(["absurd", "potential", "active", "stable"] as const satisfies readonly ChargeValueName[]);

export const chargeSide = (name: ChargeSideName): ChargeSide => Object.freeze({
  kind: "bilattice-charge.side" as const,
  name,
});

const chargeCoordinatesByName: Record<ChargeValueName, readonly [truth: ChargeSideName, falsity: ChargeSideName]> = {
  absurd: ["absent", "absent"],
  potential: ["present", "absent"],
  active: ["absent", "present"],
  stable: ["present", "present"],
};

export function chargeValue(name: ChargeValueName): ChargeValue {
  const [truth, falsity] = chargeCoordinatesByName[name];
  return Object.freeze({
    kind: "bilattice-charge.value" as const,
    name,
    coordinates: Object.freeze([chargeSide(truth), chargeSide(falsity)] as const),
  });
}

export const chargeValues = (): readonly ChargeValue[] =>
  Object.freeze(chargeValueNames().map(chargeValue));

export const chargeFiniteAlgebra = (): ChargeFiniteAlgebraCarrier => Object.freeze({
  kind: "bilattice-charge.finiteAlgebra" as const,
  sides: Object.freeze(chargeSideNames().map(chargeSide)),
  values: chargeValues(),
});

export const chargeSideName = (side: ChargeSide): ChargeSideName => side.name;
export const chargeValueName = (value: ChargeValue): ChargeValueName => value.name;

const sameChargeSide = (left: ChargeSide, right: ChargeSide): boolean => left.name === right.name;
const presentSide = (side: ChargeSide): boolean => sameChargeSide(side, chargeSide("present"));
const absentSide = (side: ChargeSide): boolean => sameChargeSide(side, chargeSide("absent"));
const joinSide = (left: ChargeSide, right: ChargeSide): ChargeSide =>
  presentSide(left) || presentSide(right) ? chargeSide("present") : chargeSide("absent");
const meetSide = (left: ChargeSide, right: ChargeSide): ChargeSide =>
  presentSide(left) && presentSide(right) ? chargeSide("present") : chargeSide("absent");
const complementSide = (side: ChargeSide): ChargeSide => presentSide(side) ? chargeSide("absent") : chargeSide("present");
const leqSide = (left: ChargeSide, right: ChargeSide): boolean => absentSide(left) || presentSide(right);

export function isChargeValueName(value: unknown): value is ChargeValueName {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(chargeCoordinatesByName, value);
}

export function isChargeSide(value: unknown): value is ChargeSide {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<ChargeSide>;
  return candidate.kind === "bilattice-charge.side" && isChargeSideName(candidate.name);
}

export function isChargeSideName(value: unknown): value is ChargeSideName {
  return value === "absent" || value === "present";
}

export function isChargeValue(value: unknown): value is ChargeValue {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<ChargeValue>;
  return candidate.kind === "bilattice-charge.value"
    && isChargeValueName(candidate.name)
    && Array.isArray(candidate.coordinates)
    && candidate.coordinates.length === 2
    && isChargeSide(candidate.coordinates[0])
    && isChargeSide(candidate.coordinates[1]);
}

export function isCharge(value: unknown): value is ChargeCarrier {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<ChargeCarrier>;
  return candidate.kind === "bilattice-charge.carrier"
    && Array.isArray(candidate.value)
    && candidate.value.length === 2
    && isChargeSide(candidate.value[0])
    && isChargeSide(candidate.value[1])
    && Array.isArray(candidate.evidence)
    && candidate.evidence.length === 2
    && Array.isArray(candidate.evidence[0])
    && Array.isArray(candidate.evidence[1]);
}

export function asChargeValueName(value: unknown): ChargeValueName {
  if (!isChargeValueName(value)) {
    throw new TypeError(`not a bilattice charge value name: ${JSON.stringify(value)} (expected one of ${chargeValueNames().join(", ")})`);
  }
  return value;
}

export function asChargeValue(value: unknown): ChargeValue {
  if (isChargeValue(value)) return value;
  return chargeValue(asChargeValueName(value));
}

export function charge(value: ChargeValue, evidence: readonly [readonly unknown[], readonly unknown[]] = [[], []]): ChargeCarrier {
  const [truth, falsity] = value.coordinates;
  return Object.freeze({
    kind: "bilattice-charge.carrier" as const,
    value: Object.freeze([truth, falsity] as const),
    evidence: Object.freeze([Object.freeze([...evidence[0]]), Object.freeze([...evidence[1]])] as const),
  });
}

export const present = (c: ChargeCarrier): ChargeCoordinates => c.value;

export const sameChargeValue = (left: ChargeValue, right: ChargeValue): boolean => left.name === right.name;

export function sameCharge(left: ChargeCarrier, right: ChargeCarrier): boolean {
  return sameChargeValue(valueOf(left), valueOf(right));
}

export function valueOf(c: ChargeCarrier): ChargeValue {
  const [truth, falsity] = c.value;
  if (presentSide(truth) && presentSide(falsity)) return chargeValue("stable");
  if (presentSide(truth)) return chargeValue("potential");
  if (presentSide(falsity)) return chargeValue("active");
  return chargeValue("absurd");
}

export const bottom = (): ChargeCarrier => charge(chargeValue("absurd"));
export const witnessedPotential = (witness: unknown): ChargeCarrier => charge(chargeValue("potential"), [[witness], []]);

export function negate(c: ChargeCarrier): ChargeCarrier {
  return Object.freeze({
    kind: "bilattice-charge.carrier" as const,
    value: Object.freeze([c.value[1], c.value[0]] as const),
    evidence: Object.freeze([c.evidence[1], c.evidence[0]] as const),
  });
}

export function conflate(c: ChargeCarrier): ChargeCarrier {
  return Object.freeze({
    kind: "bilattice-charge.carrier" as const,
    value: Object.freeze([complementSide(c.value[1]), complementSide(c.value[0])] as const),
    evidence: c.evidence,
  });
}

const mergeEvidence = (left: readonly unknown[], right: readonly unknown[]): readonly unknown[] => {
  const out: unknown[] = [];
  for (const witness of [...left, ...right]) if (!out.some((item) => Object.is(item, witness))) out.push(witness);
  return Object.freeze(out);
};

export function joinKnowledge(left: ChargeCarrier, right: ChargeCarrier): ChargeCarrier {
  return Object.freeze({
    kind: "bilattice-charge.carrier" as const,
    value: Object.freeze([joinSide(left.value[0], right.value[0]), joinSide(left.value[1], right.value[1])] as const),
    evidence: Object.freeze([mergeEvidence(left.evidence[0], right.evidence[0]), mergeEvidence(left.evidence[1], right.evidence[1])] as const),
  });
}

export function meetKnowledge(left: ChargeCarrier, right: ChargeCarrier): ChargeCarrier {
  return Object.freeze({
    kind: "bilattice-charge.carrier" as const,
    value: Object.freeze([meetSide(left.value[0], right.value[0]), meetSide(left.value[1], right.value[1])] as const),
    evidence: Object.freeze([mergeEvidence(left.evidence[0], right.evidence[0]), mergeEvidence(left.evidence[1], right.evidence[1])] as const),
  });
}

export function joinTruth(left: ChargeCarrier, right: ChargeCarrier): ChargeCarrier {
  return Object.freeze({
    kind: "bilattice-charge.carrier" as const,
    value: Object.freeze([joinSide(left.value[0], right.value[0]), meetSide(left.value[1], right.value[1])] as const),
    evidence: Object.freeze([mergeEvidence(left.evidence[0], right.evidence[0]), mergeEvidence(left.evidence[1], right.evidence[1])] as const),
  });
}

export function meetTruth(left: ChargeCarrier, right: ChargeCarrier): ChargeCarrier {
  return Object.freeze({
    kind: "bilattice-charge.carrier" as const,
    value: Object.freeze([meetSide(left.value[0], right.value[0]), joinSide(left.value[1], right.value[1])] as const),
    evidence: Object.freeze([mergeEvidence(left.evidence[0], right.evidence[0]), mergeEvidence(left.evidence[1], right.evidence[1])] as const),
  });
}

export const joinKnowledgeValue = (left: ChargeValue, right: ChargeValue): ChargeValue => valueOf(joinKnowledge(charge(left), charge(right)));
export const meetKnowledgeValue = (left: ChargeValue, right: ChargeValue): ChargeValue => valueOf(meetKnowledge(charge(left), charge(right)));
export const joinTruthValue = (left: ChargeValue, right: ChargeValue): ChargeValue => valueOf(joinTruth(charge(left), charge(right)));
export const meetTruthValue = (left: ChargeValue, right: ChargeValue): ChargeValue => valueOf(meetTruth(charge(left), charge(right)));
export const negateValue = (value: ChargeValue): ChargeValue => valueOf(negate(charge(value)));
export const conflateValue = (value: ChargeValue): ChargeValue => valueOf(conflate(charge(value)));

export function leqKnowledge(left: ChargeCarrier, right: ChargeCarrier): boolean {
  return leqSide(left.value[0], right.value[0]) && leqSide(left.value[1], right.value[1]);
}

export function compareKnowledge(pair: ChargePair): ChargeCarrier {
  if (!leqKnowledge(pair.left, pair.right)) {
    throw new TypeError("compareKnowledge: no knowledge-order witness; left has knowledge not present in right");
  }
  return pair.right;
}

export const aggregate = (pair: ChargePair): ChargeCarrier => joinKnowledge(pair.left, pair.right);

export function leqTruth(left: ChargeCarrier, right: ChargeCarrier): boolean {
  return leqSide(left.value[0], right.value[0]) && leqSide(right.value[1], left.value[1]);
}

export function isTop(c: ChargeCarrier): boolean {
  return presentSide(c.value[0]) && presentSide(c.value[1]);
}

export function isBottom(c: ChargeCarrier): boolean {
  return absentSide(c.value[0]) && absentSide(c.value[1]);
}

export type GaugeElementName = "id" | "negation" | "conflation" | "double";

export const gaugeElementNames = (): readonly GaugeElementName[] =>
  Object.freeze(["id", "negation", "conflation", "double"] as const satisfies readonly GaugeElementName[]);

export function gauge(sigma: GaugeElementName, value: ChargeValue): ChargeValue {
  if (sigma === "negation") return negateValue(value);
  if (sigma === "conflation") return conflateValue(value);
  if (sigma === "double") return negateValue(conflateValue(value));
  return value;
}

export const fixedSet = (sigma: GaugeElementName): readonly ChargeValue[] =>
  Object.freeze(chargeValues().filter((value) => sameChargeValue(gauge(sigma, value), value)));

export function firingPatternSelfDuality(labeling: readonly ChargeValue[], sigma: GaugeElementName): FiringPatternSelfDualityJudgment {
  const fixed = fixedSet(sigma);
  const moving = Object.freeze(labeling.filter((value) => !fixed.some((fixedValue) => sameChargeValue(fixedValue, value))));
  return moving.length === 0
    ? Object.freeze({
      kind: "bilattice-charge.firingPatternSelfDuality:witness" as const,
      labeling: Object.freeze([...labeling]),
      gaugeElement: sigma,
      fixed,
    })
    : Object.freeze({
      kind: "bilattice-charge.firingPatternSelfDuality-obstruction" as const,
      labeling: Object.freeze([...labeling]),
      gaugeElement: sigma,
      fixed,
      moving,
    });
}

export interface ChargeValueIdentityWitness {
  readonly kind: "bilattice-charge.valueIdentity:witness";
  readonly left: ChargeValue;
  readonly right: ChargeValue;
}

export interface ChargeValueIdentityObstruction {
  readonly kind: "bilattice-charge.valueIdentity-obstruction";
  readonly left: ChargeValue;
  readonly right: ChargeValue;
}

export type ChargeValueIdentityJudgment = ChargeValueIdentityWitness | ChargeValueIdentityObstruction;

export function chargeValueIdentity(left: ChargeValue, right: ChargeValue): ChargeValueIdentityJudgment {
  return sameChargeValue(left, right)
    ? Object.freeze({ kind: "bilattice-charge.valueIdentity:witness" as const, left, right })
    : Object.freeze({ kind: "bilattice-charge.valueIdentity-obstruction" as const, left, right });
}

export interface OrderLeqWitness {
  readonly kind: "bilattice-charge.orderLeq:witness";
  readonly order: "knowledge" | "truth";
  readonly left: ChargeValue;
  readonly right: ChargeValue;
  /** The join computation that witnesses the bound: join(left, right) coincides with right. */
  readonly join: ChargeValue;
}

export interface OrderLeqObstruction {
  readonly kind: "bilattice-charge.orderLeq-obstruction";
  readonly order: "knowledge" | "truth";
  readonly left: ChargeValue;
  readonly right: ChargeValue;
  /** The counterexample: join(left, right) differs from right. */
  readonly join: ChargeValue;
}

export type OrderLeqJudgment = OrderLeqWitness | OrderLeqObstruction;

const orderLeq = (
  order: "knowledge" | "truth",
  join: (left: ChargeValue, right: ChargeValue) => ChargeValue,
) => (left: ChargeValue, right: ChargeValue): OrderLeqJudgment => {
  const joined = join(left, right);
  return sameChargeValue(joined, right)
    ? Object.freeze({ kind: "bilattice-charge.orderLeq:witness" as const, order, left, right, join: joined })
    : Object.freeze({ kind: "bilattice-charge.orderLeq-obstruction" as const, order, left, right, join: joined });
};

export const knowledgeLeq = orderLeq("knowledge", joinKnowledgeValue);
export const truthLeq = orderLeq("truth", joinTruthValue);
