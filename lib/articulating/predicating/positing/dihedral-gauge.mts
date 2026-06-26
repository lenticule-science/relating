/**
 * positing/dihedral-gauge — D4 as the value-level symmetry surface of FOUR.
 *
 * The FOUR charge algebra has two visible gauges. `bilattice-charge` carries the
 * Klein-four gauge K4 = `{ id, negation, conflation, double }`: the symmetries
 * that act within the two orders. Each K4 element preserves or reverses the
 * knowledge order and the truth order, but it carries knowledge order to
 * knowledge order and truth order to truth order; it never leaves an order. K4 is
 * missing the one symmetry of FOUR that exchanges the two orders.
 *
 * `orderSwapValue` is that missing symmetry: keep the truth side, complement the
 * falsity side. It witnesses the order-isomorphism
 * `(FOUR, knowledge) ~= (FOUR, truth)`, swapping `absurd <-> active` and
 * `potential <-> stable`. It belongs to neither order's automorphism group
 * precisely because it exchanges them.
 *
 * Adjoining `orderSwapValue` to K4 yields the order-eight dihedral gauge: the
 * full symmetry group of FOUR as a doubly ordered set, the bilattice square. The
 * order-preserving coset is K4. The order-swapping coset is
 * `{ order-swap, order-swap-negation, order-swap-conflation, order-swap-double }`,
 * each acting as `gauge(k, orderSwapValue(value))`. The defining dihedral
 * relation exposed here is `order-swap · negation · order-swap = conflation`;
 * the swapped coset contains the two diagonal reflections and the two quarter
 * rotations.
 *
 * The public API is deliberately value-level. The order-swap complements one
 * evidence side, and accumulated witness lists do not carry enough information to
 * perform that complement lawfully. Use this module to read the finite symmetry
 * algebra of admitted charge values, not to rewrite evidence carriers.
 *
 * The Lean side has the fuller proof object in `RelMath.Positing.D4Gauge`, with
 * `KleinFourGauge` and `OrderSwapDuality` supplying the upstream pieces. This
 * module is the Node carrier surface: names, action, multiplication by action
 * composition, fixed sets, coset effects, and witness-shaped reads for the
 * cross-order isomorphism and the defining conjugation law.
 *
 * @packageDocumentation
 */
import {
  charge,
  chargeSideName,
  chargeValue,
  chargeValueNames,
  chargeValues,
  conflateValue,
  gauge,
  gaugeElementNames,
  leqKnowledge,
  leqTruth,
  negateValue,
  sameChargeValue,
  type ChargeSideName,
  type ChargeValue,
  type ChargeValueName,
  type GaugeElementName,
} from "./bilattice-charge.mjs";

const flipSide = (name: ChargeSideName): ChargeSideName => (name === "present" ? "absent" : "present");

/** The charge value at the given side coordinates — the reverse of a value's
 * `coordinates`, resolved over the four values (no posited table). */
function valueAtCoordinates(truth: ChargeSideName, falsity: ChargeSideName): ChargeValue {
  const found = chargeValues.find(
    (value) => chargeSideName(value.coordinates[0]) === truth && chargeSideName(value.coordinates[1]) === falsity,
  );
  if (!found) throw new TypeError(`valueAtCoordinates: no charge value at [${truth}, ${falsity}]`);
  return found;
}

/**
 * The order-swap involution σ: ⟨truth, falsity⟩ ↦ ⟨truth, ¬falsity⟩ — keep the
 * truth side, complement the falsity side. The cross-order iso
 * (FOUR, ≤knowledge) ≅ (FOUR, ≤truth); it swaps `absurd ↔ active` and
 * `potential ↔ stable`, and belongs to neither order's automorphism group.
 */
export function orderSwapValue(value: ChargeValue): ChargeValue {
  return valueAtCoordinates(chargeSideName(value.coordinates[0]), flipSide(chargeSideName(value.coordinates[1])));
}

/** A D₄ gauge element: the Klein-four coset `GaugeElementName` plus the order-swap
 * coset `order-swap · K₄`. */
export type DihedralElementName =
  | GaugeElementName
  | "order-swap"
  | "order-swap-negation"
  | "order-swap-conflation"
  | "order-swap-double";

const orderSwapCoset = ["order-swap", "order-swap-negation", "order-swap-conflation", "order-swap-double"] as const;

/** All eight D₄ element names: the order-preserving K₄ coset, then the order-swapping
 * K₄·σ coset. */
export const dihedralElementNames: readonly DihedralElementName[] =
  Object.freeze([...gaugeElementNames, ...orderSwapCoset]);

const isGaugeElementName = (element: DihedralElementName): element is GaugeElementName =>
  (gaugeElementNames as readonly string[]).includes(element);

/**
 * Apply a D₄ element to a charge value. The order-preserving coset K₄ acts by
 * `gauge`; the order-swapping coset K₄·σ acts by `gauge(k, σ value)` — σ first, then
 * the Klein-four part.
 */
export function dihedral(element: DihedralElementName, value: ChargeValue): ChargeValue {
  switch (element) {
    case "order-swap":
      return orderSwapValue(value);
    case "order-swap-negation":
      return gauge("negation", orderSwapValue(value));
    case "order-swap-conflation":
      return gauge("conflation", orderSwapValue(value));
    case "order-swap-double":
      return gauge("double", orderSwapValue(value));
    default:
      return gauge(element, value);
  }
}

const permutationOf = (element: DihedralElementName): readonly ChargeValueName[] =>
  chargeValueNames.map((name) => dihedral(element, chargeValue(name)).name);

const elementForPermutation = (permutation: readonly ChargeValueName[]): DihedralElementName | undefined =>
  dihedralElementNames.find((element) => permutationOf(element).every((image, index) => image === permutation[index]));

/**
 * The dihedral multiplication g·h, DERIVED from the action: the unique element whose
 * action equals `dihedral(g, dihedral(h, ·))`. Throws if the composite leaves D₄ —
 * which it cannot, so a successful return also witnesses closure.
 */
export function dihedralMul(left: DihedralElementName, right: DihedralElementName): DihedralElementName {
  const composite = chargeValueNames.map((name) => dihedral(left, dihedral(right, chargeValue(name))).name);
  const found = elementForPermutation(composite);
  if (!found) throw new TypeError(`dihedralMul: ${left}·${right} left D₄ — the gauge is not closed`);
  return found;
}

/** The charge values fixed by a D₄ element. */
export const dihedralFixedSet = (element: DihedralElementName): readonly ChargeValue[] =>
  Object.freeze(chargeValues.filter((value) => sameChargeValue(dihedral(element, value), value)));

/** Whether a D₄ element preserves each order or exchanges the two orders. */
export type DihedralOrderEffectName = "order-preserving" | "order-swapping";

/** The order effect of a D₄ element: K₄ preserves each order, K₄·σ swaps them. */
export const dihedralOrderEffect = (element: DihedralElementName): DihedralOrderEffectName =>
  isGaugeElementName(element) ? "order-preserving" : "order-swapping";

const leqKnowledgeValue = (left: ChargeValue, right: ChargeValue): boolean => leqKnowledge(charge(left), charge(right));
const leqTruthValue = (left: ChargeValue, right: ChargeValue): boolean => leqTruth(charge(left), charge(right));

/** A witness that σ carries the knowledge order to the truth order at a pair. */
export interface OrderSwapIsoWitness {
  readonly kind: "dihedral-gauge.orderSwapIso:witness";
  readonly left: ChargeValue;
  readonly right: ChargeValue;
  readonly swappedLeft: ChargeValue;
  readonly swappedRight: ChargeValue;
  readonly knowledgeLeq: boolean;
}

/** An obstruction: σ fails to carry the knowledge order to the truth order at a pair. */
export interface OrderSwapIsoObstruction {
  readonly kind: "dihedral-gauge.orderSwapIso-obstruction";
  readonly left: ChargeValue;
  readonly right: ChargeValue;
  readonly swappedLeft: ChargeValue;
  readonly swappedRight: ChargeValue;
  readonly knowledgeLeq: boolean;
  readonly truthLeqSwapped: boolean;
}

/** The result of testing σ's cross-order iso at a pair. */
export type OrderSwapIsoJudgment = OrderSwapIsoWitness | OrderSwapIsoObstruction;

/**
 * Witness that σ is the cross-order isomorphism at `(left, right)`:
 * `left ≤knowledge right ⟺ σ left ≤truth σ right`.
 */
export function orderSwapIso(left: ChargeValue, right: ChargeValue): OrderSwapIsoJudgment {
  const swappedLeft = orderSwapValue(left);
  const swappedRight = orderSwapValue(right);
  const knowledgeLeq = leqKnowledgeValue(left, right);
  const truthLeqSwapped = leqTruthValue(swappedLeft, swappedRight);
  return knowledgeLeq === truthLeqSwapped
    ? Object.freeze({
        kind: "dihedral-gauge.orderSwapIso:witness" as const,
        left,
        right,
        swappedLeft,
        swappedRight,
        knowledgeLeq,
      })
    : Object.freeze({
        kind: "dihedral-gauge.orderSwapIso-obstruction" as const,
        left,
        right,
        swappedLeft,
        swappedRight,
        knowledgeLeq,
        truthLeqSwapped,
      });
}

/** A witness of the defining dihedral relation σ∼σ = − at a value. */
export interface DihedralConjugationWitness {
  readonly kind: "dihedral-gauge.conjugation:witness";
  readonly value: ChargeValue;
  readonly conjugate: ChargeValue;
  readonly conflation: ChargeValue;
}

/** An obstruction: σ∼σ disagrees with − at a value. */
export interface DihedralConjugationObstruction {
  readonly kind: "dihedral-gauge.conjugation-obstruction";
  readonly value: ChargeValue;
  readonly conjugate: ChargeValue;
  readonly conflation: ChargeValue;
}

/** The result of testing the dihedral relation σ∼σ = − at a value. */
export type DihedralConjugationJudgment = DihedralConjugationWitness | DihedralConjugationObstruction;

/**
 * Witness the defining dihedral relation σ∼σ = − at a value: conjugating negation by
 * the order-swap yields conflation. This is the relation that makes ⟨K₄, σ⟩ the
 * dihedral group D₄ rather than an abelian extension.
 */
export function dihedralConjugation(value: ChargeValue): DihedralConjugationJudgment {
  const conjugate = orderSwapValue(negateValue(orderSwapValue(value)));
  const conflation = conflateValue(value);
  return sameChargeValue(conjugate, conflation)
    ? Object.freeze({ kind: "dihedral-gauge.conjugation:witness" as const, value, conjugate, conflation })
    : Object.freeze({ kind: "dihedral-gauge.conjugation-obstruction" as const, value, conjugate, conflation });
}

const knowledgeComparable = (left: ChargeValue, right: ChargeValue): boolean =>
  leqKnowledgeValue(left, right) || leqKnowledgeValue(right, left);
const truthComparable = (left: ChargeValue, right: ChargeValue): boolean =>
  leqTruthValue(left, right) || leqTruthValue(right, left);

/** A witness that a D₄ element exchanges the two orders (it lies in the coset K₄·σ). */
export interface DihedralSwapsOrdersWitness {
  readonly kind: "dihedral-gauge.swapsOrders:witness";
  readonly element: DihedralElementName;
}

/** An obstruction: a D₄ element preserves each order (it lies in K₄), shown by the
 * first pair whose knowledge-comparability it does not send to truth-comparability. */
export interface DihedralSwapsOrdersObstruction {
  readonly kind: "dihedral-gauge.swapsOrders-obstruction";
  readonly element: DihedralElementName;
  readonly left: ChargeValue;
  readonly right: ChargeValue;
}

/** The result of testing whether a D₄ element exchanges the two orders. */
export type DihedralSwapsOrdersJudgment = DihedralSwapsOrdersWitness | DihedralSwapsOrdersObstruction;

/**
 * Witness that a D₄ element is in the order-swapping coset K₄·σ — the non-trivial
 * class of `D₄/K₄ ≅ ℤ/2`. Direction-agnostically: for every pair, `a, b` are
 * knowledge-comparable ⟺ `g a, g b` are truth-comparable (so `g` carries the
 * ≤knowledge-incomparable pair {potential, active} onto the ≤truth-incomparable pair
 * {absurd, stable}). The first failing pair is the obstruction, which every
 * order-preserving K₄ element produces.
 */
export function dihedralSwapsOrders(element: DihedralElementName): DihedralSwapsOrdersJudgment {
  for (const left of chargeValues) {
    for (const right of chargeValues) {
      if (knowledgeComparable(left, right) !== truthComparable(dihedral(element, left), dihedral(element, right))) {
        return Object.freeze({ kind: "dihedral-gauge.swapsOrders-obstruction" as const, element, left, right });
      }
    }
  }
  return Object.freeze({ kind: "dihedral-gauge.swapsOrders:witness" as const, element });
}
