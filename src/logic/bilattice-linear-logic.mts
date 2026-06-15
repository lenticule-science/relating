import {
  charge,
  chargeSide,
  chargeValue,
  joinTruthValue,
  sameChargeValue,
  valueOf,
  type ChargeCarrier,
  type ChargeSide,
  type ChargeValue,
} from "../algebra/index.mjs";

export interface ChargeConsistencyWitness {
  readonly kind: "bilattice.linearLogic.chargeConsistency:witness";
  readonly value: ChargeValue;
}

export interface ChargeConsistencyObstruction {
  readonly kind: "bilattice.linearLogic.chargeConsistency-obstruction";
  readonly value: ChargeValue;
}

export type ChargeConsistencyJudgment = ChargeConsistencyWitness | ChargeConsistencyObstruction;

export interface TruthOrderResiduationWitness {
  readonly kind: "bilattice.linearLogic.truthOrderResiduation:witness";
  readonly left: ChargeValue;
  readonly right: ChargeValue;
  readonly bound: ChargeValue;
  readonly fusionBound: ChargeValue;
  readonly residualBound: ChargeValue;
}

export interface TruthOrderResiduationObstruction {
  readonly kind: "bilattice.linearLogic.truthOrderResiduation-obstruction";
  readonly left: ChargeValue;
  readonly right: ChargeValue;
  readonly bound: ChargeValue;
  readonly fusionBound: ChargeValue;
  readonly residualBound: ChargeValue;
}

export type TruthOrderResiduationJudgment = TruthOrderResiduationWitness | TruthOrderResiduationObstruction;

const sidePresent = (side: ChargeSide): boolean => side.name === "present";
const sideMeet = (left: ChargeSide, right: ChargeSide): ChargeSide => sidePresent(left) && sidePresent(right) ? chargeSide("present") : chargeSide("absent");
const sideProduct = sideMeet;
const sideImplication = (left: ChargeSide, right: ChargeSide): ChargeSide =>
  sidePresent(left) && !sidePresent(right) ? chargeSide("absent") : chargeSide("present");

const coordinates = (value: ChargeValue): readonly [truth: ChargeSide, falsity: ChargeSide] => charge(value).value;
const valueFromCoordinates = (truth: ChargeSide, falsity: ChargeSide): ChargeValue =>
  valueOf(Object.freeze({
    kind: "bilattice-charge.carrier" as const,
    value: Object.freeze([truth, falsity] as const),
    evidence: Object.freeze([Object.freeze([]), Object.freeze([])] as const),
  }) satisfies ChargeCarrier);

export const linearMultiplicativeUnit = (): ChargeValue => chargeValue("stable");
export const consistentChargeValues = (): readonly ChargeValue[] =>
  Object.freeze([chargeValue("absurd"), chargeValue("potential"), chargeValue("active")] as const satisfies readonly ChargeValue[]);

export function linearFusionValue(left: ChargeValue, right: ChargeValue): ChargeValue {
  const [leftTruth, leftFalsity] = coordinates(left);
  const [rightTruth, rightFalsity] = coordinates(right);
  return valueFromCoordinates(
    sideProduct(leftTruth, rightTruth),
    sideMeet(sideImplication(leftTruth, rightFalsity), sideImplication(rightTruth, leftFalsity)),
  );
}

export function linearResiduumValue(left: ChargeValue, right: ChargeValue): ChargeValue {
  const [leftTruth, leftFalsity] = coordinates(left);
  const [rightTruth, rightFalsity] = coordinates(right);
  return valueFromCoordinates(
    sideMeet(sideImplication(leftTruth, rightTruth), sideImplication(rightFalsity, leftFalsity)),
    sideProduct(leftTruth, rightFalsity),
  );
}

export function linearNegationValue(value: ChargeValue): ChargeValue {
  return linearResiduumValue(value, linearMultiplicativeUnit());
}

export function linearParValue(left: ChargeValue, right: ChargeValue): ChargeValue {
  return linearNegationValue(linearFusionValue(linearNegationValue(left), linearNegationValue(right)));
}

export function chargeConsistency(value: ChargeValue): ChargeConsistencyJudgment {
  const [truth, falsity] = coordinates(value);
  return !(sidePresent(truth) && sidePresent(falsity))
    ? Object.freeze({
      kind: "bilattice.linearLogic.chargeConsistency:witness" as const,
      value,
    })
    : Object.freeze({
      kind: "bilattice.linearLogic.chargeConsistency-obstruction" as const,
      value,
    });
}

export function truthOrderResiduation(left: ChargeValue, right: ChargeValue, bound: ChargeValue): TruthOrderResiduationJudgment {
  const residualBound = linearResiduumValue(right, bound);
  const fusionBound = joinTruthValue(linearFusionValue(left, right), bound);
  const residualOrder = joinTruthValue(left, residualBound);
  const fusionLeqBound = sameChargeValue(fusionBound, bound);
  const leftLeqResidual = sameChargeValue(residualOrder, residualBound);
  return fusionLeqBound === leftLeqResidual
    ? Object.freeze({
      kind: "bilattice.linearLogic.truthOrderResiduation:witness" as const,
      left,
      right,
      bound,
      fusionBound,
      residualBound,
    })
    : Object.freeze({
      kind: "bilattice.linearLogic.truthOrderResiduation-obstruction" as const,
      left,
      right,
      bound,
      fusionBound,
      residualBound,
    });
}
