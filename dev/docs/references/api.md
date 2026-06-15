# @emsenn/relationality — API reference

> Generated from source by `jsnode-doc-computer reference`. Each entry is the exported symbol's verbatim signature and its leading JSDoc; regenerate after changing the public surface.

## Modules

- `@emsenn/relationality/algebra`
- `@emsenn/relationality/analysis`
- `@emsenn/relationality/codecs`
- `@emsenn/relationality/codecs/html`
- `@emsenn/relationality/codecs/resource`
- `@emsenn/relationality/geometry`
- `@emsenn/relationality/holography`
- `@emsenn/relationality/logic`
- `@emsenn/relationality/topology`

## `@emsenn/relationality/algebra`

### `aggregate` — const

```ts
export const aggregate = (pair: ChargePair): ChargeCarrier => …
```

Returns the knowledge-order join of the two charges in a pair, accumulating all of their evidence.

### `articulate` — function

```ts
export function articulate(carrier: UtteranceCarrier): ArticulationCarrier
```

Articulates an utterance carrier: returns an articulation that wraps the utterance and exposes its token as the positive pole and its claim as the negative pole.

### `ArticulationCarrier` — interface

```ts
export interface ArticulationCarrier
```

An articulation: a carrier wrapping an utterance together with its polarization, exposing the utterance's token as the positive pole and its claim as the negative pole.

### `asChargeValue` — function

```ts
export function asChargeValue(value: unknown): ChargeValue
```

Coerces the input to a ChargeValue: returns it unchanged if already a charge value, otherwise constructs the value named by it.

### `asChargeValueName` — function

```ts
export function asChargeValueName(value: unknown): ChargeValueName
```

Coerces the input to a charge value name, throwing a TypeError naming the valid names if it is not one.

### `asExtension` — function

```ts
export function asExtension(n: Natural): RelationCarrier<Natural, MembershipPredicate>
```

Builds the relation carrier for a natural's von Neumann extension: a single membership predicate charges each member "potential" and n itself "absurd", over the universe of n's members plus n.

### `BaseCategory` — interface

```ts
export interface BaseCategory
```

The base category of a predication: its objects, specialization edges, and the converse, subject-projection, and object-projection edges derived from the cells' nodes.

### `bottom` — const

```ts
export const bottom = (): ChargeCarrier => …
```

Returns the knowledge-order bottom carrier: the "absurd" value with no evidence.

### `cell` — function

```ts
export function cell(subject: PredicationTerm, predicate: PredicationPredicate, object: PredicationTerm): Cell
```

Constructs a frozen cell from a subject, predicate, and object, throwing a TypeError if any is missing or the object is null.

### `Cell` — interface

```ts
export interface Cell
```

A relational cell: a subject term, a predicate, and an object term.

### `cellIdentity` — function

```ts
export function cellIdentity(left: Cell, right: Cell): CellIdentityJudgment
```

Judges whether two cells coincide, returning a frozen witness when their carrier coincidence holds and an obstruction otherwise.

### `CellIdentityJudgment` — type-alias

```ts
export type CellIdentityJudgment = CellIdentityWitness | CellIdentityObstruction
```

The judgment of cell identity: either a witness of coincidence or an obstruction.

### `CellIdentityObstruction` — interface

```ts
export interface CellIdentityObstruction
```

Obstruction recording that two cells do not coincide, tagged "predication.cellIdentity-obstruction" and carrying the two cells.

### `CellIdentityWitness` — interface

```ts
export interface CellIdentityWitness
```

Witness that two cells coincide, tagged "predication.cellIdentity:witness" and carrying the two cells.

### `cellSet` — function

```ts
export function cellSet(cells: readonly Cell[]): CellSet
```

Builds a cell set from cells, deduplicating by cell coincidence and deriving the entity set of subjects and objects and the predicate set of predicates.

### `CellSet` — interface

```ts
export interface CellSet
```

A deduplicated set of cells together with the entity set of their subjects and objects and the predicate set of their predicates.

### `charge` — function

```ts
export function charge(value: ChargeValue, evidence: readonly [readonly unknown[], readonly unknown[]] = [[], []]): ChargeCarrier
```

Constructs a frozen ChargeCarrier from a value and optional evidence: copies the value's truth/falsity coordinates and freezes copies of the two evidence witness lists, defaulting to empty.

### `ChargeCarrier` — interface

```ts
export interface ChargeCarrier
```

A charge bearing evidence: its value is the truth/falsity coordinate pair, and its evidence is a pair of witness lists for the truth and falsity sides respectively.

### `ChargeCoordinates` — type-alias

```ts
export type ChargeCoordinates = readonly [truth: ChargeSide, falsity: ChargeSide]
```

A bilattice charge point: a readonly pair of sides, the first the truth coordinate and the second the falsity coordinate.

### `chargeFiniteAlgebra` — const

```ts
export const chargeFiniteAlgebra = (): ChargeFiniteAlgebraCarrier => …
```

Returns the frozen finite-algebra carrier for the charge bilattice, holding all sides and all four values.

### `ChargeFiniteAlgebraCarrier` — interface

```ts
export interface ChargeFiniteAlgebraCarrier
```

The finite carrier describing the charge bilattice: the enumerated sides and the four enumerated values.

### `ChargePair` — interface

```ts
export interface ChargePair
```

An ordered pair of charge carriers, left and right, used as input to order and aggregation operations.

### `chargeSide` — const

```ts
export const chargeSide = (name: ChargeSideName): ChargeSide => …
```

Constructs a frozen ChargeSide carrier for the given side name.

### `ChargeSide` — interface

```ts
export interface ChargeSide
```

A single side coordinate of a bilattice charge: a frozen carrier tagging "bilattice-charge.side" with an "absent" or "present" name.

### `chargeSideName` — const

```ts
export const chargeSideName = (side: ChargeSide): ChargeSideName => …
```

Returns the name of a charge side.

### `ChargeSideName` — type-alias

```ts
export type ChargeSideName = "absent" | "present"
```

The name of one bilattice charge side coordinate: "absent" or "present".

### `chargeSideNames` — const

```ts
export const chargeSideNames = (): readonly ChargeSideName[] => …
```

Returns the frozen list of all charge side names: "absent" then "present".

### `chargeValue` — function

```ts
export function chargeValue(name: ChargeValueName): ChargeValue
```

Constructs a frozen ChargeValue for the given value name, resolving its truth/falsity side coordinates from the value-to-coordinate table.

### `ChargeValue` — interface

```ts
export interface ChargeValue
```

A named point of the four-element bilattice: tags "bilattice-charge.value" with a value name and the truth/falsity side coordinates it denotes.

### `chargeValueIdentity` — function

```ts
export function chargeValueIdentity(left: ChargeValue, right: ChargeValue): ChargeValueIdentityJudgment
```

Compares two charge values for identity, returning a witness when they name the same value and an obstruction otherwise.

### `ChargeValueIdentityJudgment` — type-alias

```ts
export type ChargeValueIdentityJudgment = ChargeValueIdentityWitness | ChargeValueIdentityObstruction
```

The result of comparing two charge values for identity: either a witness (equal) or an obstruction (differing).

### `ChargeValueIdentityObstruction` — interface

```ts
export interface ChargeValueIdentityObstruction
```

An obstruction to identity of two charge values: records the differing left and right values.

### `ChargeValueIdentityWitness` — interface

```ts
export interface ChargeValueIdentityWitness
```

A witness that two charge values are identical: records the equal left and right values.

### `chargeValueName` — const

```ts
export const chargeValueName = (value: ChargeValue): ChargeValueName => …
```

Returns the name of a charge value.

### `ChargeValueName` — type-alias

```ts
export type ChargeValueName = "absurd" | "potential" | "active" | "stable"
```

The four bilattice charge value names: "absurd" (neither truth nor falsity present), "potential" (truth only), "active" (falsity only), and "stable" (both present).

### `chargeValueNames` — const

```ts
export const chargeValueNames = (): readonly ChargeValueName[] => …
```

Returns the frozen list of all charge value names: "absurd", "potential", "active", "stable".

### `chargeValues` — const

```ts
export const chargeValues = (): readonly ChargeValue[] => …
```

Returns the frozen list of all four charge values, one per value name.

### `charPoly` — function

```ts
export function charPoly(matrix: Matrix): readonly Integer[]
```

The characteristic polynomial of a matrix as integer coefficients in ascending degree: the determinant of (lambda I minus M) expanded over the polynomial ring.

### `checkRelationTransform` — function

```ts
export function checkRelationTransform<SourcePoint, SourceState, TargetPoint, TargetState>( source: RelationCarrier<SourcePoint, SourceState>, target: RelationCarrier<TargetPoint, TargetState>, forward: RelationForward<SourcePoint, TargetPoint>, backward: RelationBackward<TargetState, SourceState>, ): RelationTransformJudgment<SourcePoint, SourceState, TargetPoint, TargetState>
```

Checks whether forward and backward form an adjoint transform from source to target: reports forward/backward domain obstructions first, then per-cell adjointness obstructions, returning a witness only when no failures arise.

### `claim` — function

```ts
export function claim(markCarrier: Mark): Claim
```

Constructs a Claim from the given mark.

### `Claim` — class

```ts
export class Claim
```

A claim: an immutable, frozen right-hand utterance carrier holding a single mark.

### `claimCoincidence` — function

```ts
export function claimCoincidence(left: Claim, right: Claim): ClaimCoincidenceJudgment
```

Compares two claims by their marks and returns a witness when the marks coincide, otherwise an obstruction.

### `claimCoincidenceHolds` — const

```ts
export const claimCoincidenceHolds = (left: Claim, right: Claim): boolean => …
```

Returns true when claimCoincidence of the two claims yields a witness, i.e. their marks coincide.

### `ClaimCoincidenceJudgment` — type-alias

```ts
export type ClaimCoincidenceJudgment = ClaimCoincidenceWitness | ClaimCoincidenceObstruction
```

The result of comparing two claims: either a ClaimCoincidenceWitness or a ClaimCoincidenceObstruction.

### `ClaimCoincidenceObstruction` — interface

```ts
export interface ClaimCoincidenceObstruction
```

An obstruction to claim coincidence: holds the left and right Claim whose marks were found not to coincide.

### `ClaimCoincidenceWitness` — interface

```ts
export interface ClaimCoincidenceWitness
```

A witness that two claims coincide: holds the left and right Claim whose marks were found to coincide.

### `claimIdentity` — function

```ts
export function claimIdentity(left: Claim, right: Claim): ClaimIdentityJudgment
```

Judges whether two claims are identical: returns a witness when their marks coincide, otherwise an obstruction.

### `ClaimIdentityJudgment` — type-alias

```ts
export type ClaimIdentityJudgment = ClaimIdentityWitness | ClaimIdentityObstruction
```

The result of judging two claims identical: either a ClaimIdentityWitness or a ClaimIdentityObstruction.

### `ClaimIdentityObstruction` — interface

```ts
export interface ClaimIdentityObstruction
```

An obstruction to claim identity: holds the left and right Claim found not to coincide.

### `ClaimIdentityWitness` — interface

```ts
export interface ClaimIdentityWitness
```

A witness that two claims are identical: holds the left and right Claim found to coincide.

### `closeSpecialization` — function

```ts
export function closeSpecialization(base: BaseCategory): BaseCategory
```

Returns the base category with its specialization relation transitively closed: repeatedly adds an edge from a domain to a codomain whenever they are connected through an intermediate term.

### `cohere` — function

```ts
export function cohere(predication: PredicationCarrier): CoherenceCarrier
```

Coheres a predication carrier: returns a coherence carrier whose saturated cells are the carrier's cells and whose residue is the carrier with its base specialization transitively closed.

### `CoherenceCarrier` — interface

```ts
export interface CoherenceCarrier
```

The result of cohering a predication: the saturated cell set and the residue carrier whose base has its specialization relation transitively closed.

### `compareKnowledge` — function

```ts
export function compareKnowledge(pair: ChargePair): ChargeCarrier
```

Returns the right charge of a pair when the left is below or equal to it in the knowledge order, throwing a TypeError otherwise.

### `composeTransforms` — function

```ts
export function composeTransforms(left: RelationTransform, right: RelationTransform): RelationTransform
```

Composes two transforms sharing an object (left.target must be right.source): forwards compose left-then-right and backwards compose right-then-left, throwing a TypeError when the objects do not match.

### `conflate` — function

```ts
export function conflate(c: ChargeCarrier): ChargeCarrier
```

Returns the conflation of a charge: complements and swaps both side coordinates while keeping the original evidence.

### `conflateValue` — const

```ts
export const conflateValue = (value: ChargeValue): ChargeValue => …
```

Returns the conflation of a charge value: the value obtained by complementing and swapping its coordinates.

### `determinant` — const

```ts
export const determinant = (matrix: Matrix): Integer => …
```

The exact integer determinant of a matrix, computed by fraction-free Bareiss elimination.

### `divide` — const

```ts
export const divide = (left: Rational, right: Rational): Rational => …
```

Division of rationals: multiplies left by the reciprocal of right.

### `divides` — const

```ts
export const divides = (divisor: Integer, value: Integer): boolean => …
```

Tests whether divisor divides value exactly: true when the remainder of value divided by divisor is zero.

### `dual` — function

```ts
export function dual<Point, State>(carrier: RelationCarrier<Point, State>): RelationCarrier<State, Point>
```

Swaps points and states of a relation and negates every charge value, including the absent value: returns the dual carrier.

### `dualTransform` — function

```ts
export function dualTransform(transform: RelationTransform): RelationTransform
```

The dual of a transform: a transform from the dual of the target to the dual of the source whose forward is the original backward and whose backward is the original forward.

### `Edge` — interface

```ts
export interface Edge<Domain = PredicationBaseObject, Codomain = PredicationBaseObject>
```

A directed edge in the base category from a domain object to a codomain object.

### `entitySet` — function

```ts
export function entitySet<T = PredicationTerm>( entities: Iterable<T>, same: (left: T, right: T) => boolean, ): EntitySet<T>
```

Builds an entity set from an iterable of entities, deduplicating by the given sameness predicate.

### `EntitySet` — interface

```ts
export interface EntitySet<T = PredicationTerm>
```

A deduplicated collection of entity terms appearing as cell subjects or objects.

### `equivalent` — const

```ts
export const equivalent = (left: Integer, right: Integer): boolean => …
```

Value equivalence of integers regardless of balance: true when left.pos + right.neg equals right.pos + left.neg.

### `extensionOf` — const

```ts
export const extensionOf = (n: Natural): StateExtensionCarrier<Natural, MembershipPredicate> => …
```

The state extension of a natural under its single membership predicate: the points charged by membership in n's von Neumann extension.

### `firingPatternSelfDuality` — function

```ts
export function firingPatternSelfDuality(labeling: readonly ChargeValue[], sigma: GaugeElementName): FiringPatternSelfDualityJudgment
```

Tests a labeling for self-duality under a gauge element: returns a witness when every labeled value lies in the gauge element's fixed set, or an obstruction listing the moving values otherwise.

### `FiringPatternSelfDualityJudgment` — type-alias

```ts
export type FiringPatternSelfDualityJudgment = FiringPatternSelfDualityWitness | FiringPatternSelfDualityObstruction
```

The result of testing a labeling for self-duality under a gauge element: either a witness (all values fixed) or an obstruction (some values move).

### `FiringPatternSelfDualityObstruction` — interface

```ts
export interface FiringPatternSelfDualityObstruction
```

An obstruction to self-duality of a labeling under a gauge element: records the labeling, the gauge element, its fixed values, and the moving values - labeled values the gauge element does not fix.

### `FiringPatternSelfDualityWitness` — interface

```ts
export interface FiringPatternSelfDualityWitness
```

A witness that a labeling is self-dual under a gauge element: records the labeling, the gauge element applied, and the gauge element's fixed values, with every labeled value fixed.

### `fixedSet` — const

```ts
export const fixedSet = (sigma: GaugeElementName): readonly ChargeValue[] => …
```

Returns the frozen list of charge values left unchanged by the named gauge element.

### `fromCount` — function

```ts
export function fromCount(count: number): Natural
```

Constructs the natural for a non-negative integer count by applying successor that many times to zero, throwing RangeError on non-integer or negative input.

### `fromInt` — const

```ts
export const fromInt = (value: number): Integer => …
```

Constructs an integer from a native number: a non-negative value becomes a positive integer, a negative value the negation of its magnitude.

### `fromInteger` — const

```ts
export const fromInteger = (z: Integer): Rational => …
```

Embeds an integer as a rational with denominator one.

### `fromInts` — const

```ts
export const fromInts = (rows: readonly (readonly number[])[]): Matrix => …
```

Constructs a Matrix from rows of native numbers, converting each entry with fromInt.

### `fromNatural` — const

```ts
export const fromNatural = (n: Natural): Integer => …
```

Embeds a natural as a non-negative integer, with the natural as the positive part and zero as the negative part.

### `fromRatio` — const

```ts
export const fromRatio = (num: number, den: number): Rational => …
```

Constructs a rational from native numerator and denominator numbers, reduced to canonical form.

### `gauge` — function

```ts
export function gauge(sigma: GaugeElementName, value: ChargeValue): ChargeValue
```

Applies the named gauge element to a charge value: identity for "id", negation, conflation, or their composition for "double".

### `GaugeElementName` — type-alias

```ts
export type GaugeElementName = "id" | "negation" | "conflation" | "double"
```

A name in the gauge group acting on charge values: "id", "negation", "conflation", or "double" (negation composed with conflation).

### `gaugeElementNames` — const

```ts
export const gaugeElementNames = (): readonly GaugeElementName[] => …
```

Returns the frozen list of all gauge element names: "id", "negation", "conflation", "double".

### `gcd` — function

```ts
export function gcd(left: Natural, right: Natural): Natural
```

Greatest common divisor of two naturals by the Euclidean algorithm, iterating on remainders until one operand is zero.

### `idTransform` — function

```ts
export function idTransform<Point, State>(carrier: RelationCarrier<Point, State>): RelationTransform<Point, State, Point, State>
```

The identity transform on a carrier: forward and backward are both the identity map.

### `intAdd` — const

```ts
export const intAdd = (left: Integer, right: Integer): Integer => …
```

Addition of integers: sums the positive parts and the negative parts, then rebalances.

### `intCompare` — const

```ts
export const intCompare = (left: Integer, right: Integer): -1 | 0 | 1 => …
```

Three-way comparison of integers: the sign of left minus right, returning -1, 0, or 1.

### `intDivmod` — function

```ts
export function intDivmod(left: Integer, right: Integer): { readonly quotient: Integer; readonly remainder: Integer }
```

Division of integers: returns quotient and remainder, deriving the quotient sign from the operands and computing the remainder as left minus quotient times right; throws RangeError when right is zero.

### `integer` — const

```ts
export const integer = (pos: Natural, neg: Natural): Integer => …
```

Constructs an integer from a positive and negative natural part, balanced so that one part is zero and the other holds the magnitude.

### `Integer` — interface

```ts
export interface Integer
```

An integer modeled as a difference of two naturals: its value is pos minus neg, kept in balanced form where one of the two parts is zero.

### `intEqual` — const

```ts
export const intEqual = (left: Integer, right: Integer): boolean => …
```

Equality on integers in balanced form: true when both positive parts and both negative parts are equal.

### `intIsZero` — const

```ts
export const intIsZero = (z: Integer): boolean => …
```

Tests whether an integer is zero: true when both its parts are zero.

### `intMultiply` — const

```ts
export const intMultiply = (left: Integer, right: Integer): Integer => …
```

Multiplication of integers via the difference-of-naturals encoding: combines cross products of positive and negative parts, then rebalances.

### `intNegate` — const

```ts
export const intNegate = (z: Integer): Integer => …
```

Negation of an integer: swaps its positive and negative parts.

### `intOne` — variable

```ts
export const intOne: Integer
```

The integer one.

### `intSubtract` — const

```ts
export const intSubtract = (left: Integer, right: Integer): Integer => …
```

Subtraction of integers: adds left to the negation of right.

### `intZero` — variable

```ts
export const intZero: Integer
```

The integer zero.

### `isArticulationCarrier` — function

```ts
export function isArticulationCarrier(value: unknown): value is ArticulationCarrier
```

Type guard: returns true when the value has the articulation shape - an utterance carrier and a polarization whose positive is a Token and negative is a Claim.

### `isBottom` — function

```ts
export function isBottom(c: ChargeCarrier): boolean
```

Returns whether a charge is the bottom: both its truth and falsity sides are absent (the "absurd" value).

### `isCell` — const

```ts
export const isCell = (value: unknown): value is Cell => …
```

Type guard: holds when the value is a non-null object carrying subject, predicate, and object properties.

### `isCharge` — function

```ts
export function isCharge(value: unknown): value is ChargeCarrier
```

Type guard: holds when the input is a ChargeCarrier with the carrier kind tag, a two-side value pair, and an evidence pair of two arrays.

### `isChargeSide` — function

```ts
export function isChargeSide(value: unknown): value is ChargeSide
```

Type guard: holds when the input is a frozen ChargeSide object with the side kind tag and a valid side name.

### `isChargeSideName` — function

```ts
export function isChargeSideName(value: unknown): value is ChargeSideName
```

Type guard: holds when the input is the string "absent" or "present".

### `isChargeValue` — function

```ts
export function isChargeValue(value: unknown): value is ChargeValue
```

Type guard: holds when the input is a ChargeValue object with the value kind tag, a valid value name, and a two-element coordinate pair of valid sides.

### `isChargeValueName` — function

```ts
export function isChargeValueName(value: unknown): value is ChargeValueName
```

Type guard: holds when the input is a string that names one of the four charge values.

### `isMember` — const

```ts
export const isMember = (member: Natural, n: Natural): boolean => …
```

Set membership for naturals: true when member's value is strictly less than n's, i.e. member is one of n's von Neumann elements.

### `isNegative` — const

```ts
export const isNegative = (z: Integer): boolean => …
```

Tests whether an integer is negative: true when its negative part is nonzero.

### `isPositive` — const

```ts
export const isPositive = (z: Integer): boolean => …
```

Tests whether an integer is positive: true when its positive part is nonzero.

### `isRelationCarrier` — function

```ts
export function isRelationCarrier(value: unknown): value is RelationCarrier
```

Type guard for RelationCarrier: true when the value is an object whose kind is "bilattice.relation.carrier".

### `isRelationTransform` — function

```ts
export function isRelationTransform(value: unknown): value is RelationTransform
```

Type guard for RelationTransform: true when the value is an object whose kind is "bilattice.relation.transform".

### `isSpecializationMorphism` — function

```ts
export function isSpecializationMorphism(value: unknown): value is SpecializationMorphism
```

Type guard: holds when the value is a non-null object whose kind is "predication.specialization".

### `isTop` — function

```ts
export function isTop(c: ChargeCarrier): boolean
```

Returns whether a charge is the top: both its truth and falsity sides are present (the "stable" value).

### `joinKnowledge` — function

```ts
export function joinKnowledge(left: ChargeCarrier, right: ChargeCarrier): ChargeCarrier
```

Returns the knowledge-order join of two charges: takes the side-wise join (present if either present) of both coordinates and merges the evidence lists side by side.

### `joinKnowledgeValue` — const

```ts
export const joinKnowledgeValue = (left: ChargeValue, right: ChargeValue): ChargeValue => …
```

Returns the knowledge-order join of two charge values, ignoring evidence.

### `joinTruth` — function

```ts
export function joinTruth(left: ChargeCarrier, right: ChargeCarrier): ChargeCarrier
```

Returns the truth-order join of two charges: joins the truth sides, meets the falsity sides, and merges the evidence lists side by side.

### `joinTruthValue` — const

```ts
export const joinTruthValue = (left: ChargeValue, right: ChargeValue): ChargeValue => …
```

Returns the truth-order join of two charge values, ignoring evidence.

### `knowledgeLeq` — variable

```ts
export const knowledgeLeq
```

Tests whether one charge value is below or equal to another in the knowledge order, witnessed by their knowledge-join coinciding with the right value.

### `leqKnowledge` — function

```ts
export function leqKnowledge(left: ChargeCarrier, right: ChargeCarrier): boolean
```

Returns whether the left charge is below or equal to the right in the knowledge order: every side present on the left is present on the right.

### `leqTruth` — function

```ts
export function leqTruth(left: ChargeCarrier, right: ChargeCarrier): boolean
```

Returns whether the left charge is below or equal to the right in the truth order: truth grows and falsity shrinks from left to right.

### `magnitude` — const

```ts
export const magnitude = (z: Integer): Natural => …
```

The absolute value of an integer as a natural: the positive part when non-negative, otherwise the negative part.

### `mark` — function

```ts
export function mark(value: unknown): Mark
```

Constructs a Mark wrapping the given value.

### `Mark` — class

```ts
export class Mark
```

A mark: an immutable, frozen carrier wrapping a single value. The value must be present (not undefined); marks are the atomic content of tokens and claims.

### `markCoincidence` — function

```ts
export function markCoincidence(left: Mark, right: Mark): MarkCoincidenceJudgment
```

Compares two marks by deep value structure (never by reference) and returns a witness when their values coincide, otherwise an obstruction.

### `markCoincidenceHolds` — const

```ts
export const markCoincidenceHolds = (left: Mark, right: Mark): boolean => …
```

Returns true when markCoincidence of the two marks yields a witness, i.e. their values coincide.

### `MarkCoincidenceJudgment` — type-alias

```ts
export type MarkCoincidenceJudgment = MarkCoincidenceWitness | MarkCoincidenceObstruction
```

The result of comparing two marks: either a MarkCoincidenceWitness or a MarkCoincidenceObstruction.

### `MarkCoincidenceObstruction` — interface

```ts
export interface MarkCoincidenceObstruction
```

An obstruction to mark coincidence: holds the left and right Mark whose values were found not to coincide.

### `MarkCoincidenceWitness` — interface

```ts
export interface MarkCoincidenceWitness
```

A witness that two marks coincide: holds the left and right Mark whose values were found to coincide.

### `markIdentity` — function

```ts
export function markIdentity(left: Mark, right: Mark): MarkIdentityJudgment
```

Judges whether two marks are identical: returns a witness when their values coincide, otherwise an obstruction.

### `MarkIdentityJudgment` — type-alias

```ts
export type MarkIdentityJudgment = MarkIdentityWitness | MarkIdentityObstruction
```

The result of judging two marks identical: either a MarkIdentityWitness or a MarkIdentityObstruction.

### `MarkIdentityObstruction` — interface

```ts
export interface MarkIdentityObstruction
```

An obstruction to mark identity: holds the left and right Mark found not to coincide.

### `MarkIdentityWitness` — interface

```ts
export interface MarkIdentityWitness
```

A witness that two marks are identical: holds the left and right Mark found to coincide.

### `matEqual` — const

```ts
export const matEqual = (left: Matrix, right: Matrix): boolean => …
```

Equality on matrices: true when they have the same shape and equal integer entries.

### `matmul` — const

```ts
export const matmul = (left: Matrix, right: Matrix): Matrix => …
```

The product of two matrices, computed with exact integer addition and multiplication.

### `Matrix` — type-alias

```ts
export type Matrix = readonly (readonly Integer[])[]
```

A matrix of exact integers: a read-only array of read-only rows.

### `matrixEntryReading` — function

```ts
export function matrixEntryReading<Point, State>( matrix: RelationMatrixCarrier<Point, State>, point: Point, state: State, ): RelationMatrixEntryJudgment<Point, State>
```

Looks up the entry at (point, state) in a relation matrix: returns a matrixEntry witness when found, otherwise a matrixEntry obstruction.

### `matTranspose` — const

```ts
export const matTranspose = (matrix: Matrix): Matrix => …
```

The transpose of a matrix: rows become columns and vice versa.

### `meetKnowledge` — function

```ts
export function meetKnowledge(left: ChargeCarrier, right: ChargeCarrier): ChargeCarrier
```

Returns the knowledge-order meet of two charges: takes the side-wise meet (present only if both present) of both coordinates and merges the evidence lists side by side.

### `meetKnowledgeValue` — const

```ts
export const meetKnowledgeValue = (left: ChargeValue, right: ChargeValue): ChargeValue => …
```

Returns the knowledge-order meet of two charge values, ignoring evidence.

### `meetTruth` — function

```ts
export function meetTruth(left: ChargeCarrier, right: ChargeCarrier): ChargeCarrier
```

Returns the truth-order meet of two charges: meets the truth sides, joins the falsity sides, and merges the evidence lists side by side.

### `meetTruthValue` — const

```ts
export const meetTruthValue = (left: ChargeValue, right: ChargeValue): ChargeValue => …
```

Returns the truth-order meet of two charge values, ignoring evidence.

### `members` — const

```ts
export const members = (n: Natural): readonly Natural[] => …
```

The members of a natural: a frozen copy of the naturals strictly less than n.

### `membershipPredicate` — const

```ts
export const membershipPredicate = (): MembershipPredicate => …
```

Constructs the membership predicate: a frozen marker carrying only its kind tag.

### `MembershipPredicate` — interface

```ts
export interface MembershipPredicate
```

The single membership predicate used to express a natural number's von Neumann extension: a tagged marker with no payload, distinguished only by its kind.

### `monus` — function

```ts
export function monus(left: Natural, right: Natural): Natural
```

Truncated subtraction of naturals: peels both down together, yielding zero when left empties first, so the result never goes negative.

### `natAdd` — function

```ts
export function natAdd(left: Natural, right: Natural): Natural
```

Addition of naturals by primitive recursion: peels successors off right and applies them to left, staying within the set construction.

### `natCompare` — const

```ts
export const natCompare = (left: Natural, right: Natural): -1 | 0 | 1 => …
```

Three-way comparison of naturals: returns -1, 0, or 1 as left is less than, equal to, or greater than right.

### `natDivmod` — function

```ts
export function natDivmod(n: Natural, d: Natural): { readonly quotient: Natural; readonly remainder: Natural }
```

Euclidean division of naturals by repeated subtraction: returns the quotient and remainder of n divided by d, throwing RangeError when d is zero.

### `natEqual` — function

```ts
export function natEqual(left: Natural, right: Natural): boolean
```

Equality on naturals: true when both encode the same value, compared by member count.

### `natIsZero` — const

```ts
export const natIsZero = (n: Natural): boolean => …
```

Tests whether a natural is zero: true when it has no members.

### `natLeq` — const

```ts
export const natLeq = (left: Natural, right: Natural): boolean => …
```

Less-than-or-equal on naturals, compared by member count.

### `natLess` — const

```ts
export const natLess = (left: Natural, right: Natural): boolean => …
```

Strict less-than on naturals, compared by member count.

### `natMultiply` — function

```ts
export function natMultiply(left: Natural, right: Natural): Natural
```

Multiplication of naturals: computes the product by routing through the native number representation via toCount and fromCount.

### `natOne` — variable

```ts
export const natOne: Natural
```

The natural number one: the successor of zero.

### `Natural` — interface

```ts
export interface Natural
```

A natural number encoded as a von Neumann ordinal: a frozen set whose members are the canonical (deduped, length-sorted) naturals strictly less than it, so its count is its value.

### `natZero` — variable

```ts
export const natZero: Natural
```

The natural number zero: the von Neumann ordinal with no members.

### `negate` — function

```ts
export function negate(c: ChargeCarrier): ChargeCarrier
```

Returns the negation of a charge: swaps the truth and falsity coordinates and their corresponding evidence lists.

### `negateValue` — const

```ts
export const negateValue = (value: ChargeValue): ChargeValue => …
```

Returns the negation of a charge value: the value obtained by swapping its truth and falsity coordinates.

### `OrderLeqJudgment` — type-alias

```ts
export type OrderLeqJudgment = OrderLeqWitness | OrderLeqObstruction
```

The result of testing the order relation between two charge values: either a witness (join equals right) or an obstruction (join differs from right).

### `OrderLeqObstruction` — interface

```ts
export interface OrderLeqObstruction
```

An obstruction to left being below or equal to right in the named order: records the two values and the join that differs from right.

### `OrderLeqWitness` — interface

```ts
export interface OrderLeqWitness
```

A witness that left is below or equal to right in the named order ("knowledge" or "truth"): records the two values and the join that coincides with right.

### `pointProfile` — function

```ts
export function pointProfile<Point, State>(carrier: RelationCarrier<Point, State>, point: Point): PointProfileCarrier<Point, State>
```

Builds the PointProfileCarrier for a point: its charge value across every state in the carrier.

### `PointProfileCarrier` — interface

```ts
export interface PointProfileCarrier<Point = unknown, State = unknown>
```

The row of a relation for a fixed point: the point, its charge value across every state, and the rank (entry count).

### `PointProfileEntry` — interface

```ts
export interface PointProfileEntry<State = unknown>
```

One cell of a point's profile: a state paired with the charge value the relation assigns it for that point.

### `Potential` — type-alias

```ts
export type Potential = PotentialCarrier | UtterancePotentialCarrier
```

A potential: either a general PotentialCarrier or an UtterancePotentialCarrier.

### `potentialCarrier` — function

```ts
export function potentialCarrier(input: { readonly cells: readonly unknown[] }): PotentialCarrier;
```

_Undocumented._

### `potentialCarrier` — function

```ts
export function potentialCarrier(input: UtteranceCarrier | readonly [Mark, Mark] | { readonly cells: readonly unknown[] }): PotentialCarrier | UtterancePotentialCarrier
```

_Undocumented._

### `potentialCarrier` — function

```ts
export function potentialCarrier(input: UtteranceCarrier | readonly [Mark, Mark]): UtterancePotentialCarrier;
```

Builds a potential carrier from its input: an utterance carrier yields its token and claim as potential, a [left mark, right mark] pair is converted to a token and claim, and a { cells } object yields a copy of its cells. Throws when a pair's elements are not marks.

### `PotentialCarrier` — interface

```ts
export interface PotentialCarrier
```

A potential carrier: holds an arbitrary readonly array of cells as unrealized potential content.

### `predecessor` — const

```ts
export const predecessor = (n: Natural): Natural => …
```

The predecessor of a natural: zero when n is zero, otherwise n's largest member (the one with the most members).

### `predicate` — function

```ts
export function predicate(articulations: readonly ArticulationCarrier[]): PredicationCarrier
```

The transfinite regime: build the relational sites from the articulated givens. A token whose mark reads as a `{ subject, object }` pair articulates the relational cell between the pair's tokens; any other token articulates the diagonal cell. A relational cell whose claim is the specialization concept also installs the specialization edge. The sites carry no charge — `posit` is the first morphism to value them.

### `predicateSet` — function

```ts
export function predicateSet<T = PredicationPredicate>( predicates: Iterable<T>, same: (left: T, right: T) => boolean, ): PredicateSet<T>
```

Builds a predicate set from an iterable of predicates, deduplicating by the given sameness predicate.

### `PredicateSet` — interface

```ts
export interface PredicateSet<T = PredicationPredicate>
```

A deduplicated collection of the predicates appearing in cells.

### `PredicationBaseObject` — type-alias

```ts
export type PredicationBaseObject = PredicationTerm | PredicationPredicate | PredicationNode
```

An object of the base category: a term, a predicate, or a predication node.

### `predicationBaseObjectCoincidence` — function

```ts
export function predicationBaseObjectCoincidence( left: PredicationBaseObject, right: PredicationBaseObject, ): PredicationBaseObjectCoincidenceJudgment
```

Compares two predication base objects by their shape: node against node by node coincidence, term against term by term coincidence; a node compared with a non-node never coincides. Returns a witness when they coincide, otherwise an obstruction.

### `predicationBaseObjectCoincidenceHolds` — const

```ts
export const predicationBaseObjectCoincidenceHolds = (left: PredicationBaseObject, right: PredicationBaseObject): boolean => …
```

Returns true when predicationBaseObjectCoincidence of the two base objects yields a witness.

### `PredicationBaseObjectCoincidenceJudgment` — type-alias

```ts
export type PredicationBaseObjectCoincidenceJudgment = | PredicationBaseObjectCoincidenceWitness | PredicationBaseObjectCoincidenceObstruction
```

The result of comparing two predication base objects: either a PredicationBaseObjectCoincidenceWitness or a PredicationBaseObjectCoincidenceObstruction.

### `PredicationBaseObjectCoincidenceObstruction` — interface

```ts
export interface PredicationBaseObjectCoincidenceObstruction
```

An obstruction to predication-base-object coincidence: holds the left and right PredicationBaseObject found not to coincide.

### `PredicationBaseObjectCoincidenceWitness` — interface

```ts
export interface PredicationBaseObjectCoincidenceWitness
```

A witness that two predication base objects coincide: holds the left and right PredicationBaseObject found to coincide.

### `predicationBaseObjectIdentity` — function

```ts
export function predicationBaseObjectIdentity(left: PredicationBaseObject, right: PredicationBaseObject): PredicationBaseObjectIdentityJudgment
```

Judges whether two base objects coincide, returning a frozen witness when their carrier coincidence holds and an obstruction otherwise.

### `PredicationBaseObjectIdentityJudgment` — type-alias

```ts
export type PredicationBaseObjectIdentityJudgment = PredicationBaseObjectIdentityWitness | PredicationBaseObjectIdentityObstruction
```

The judgment of base-object identity: either a witness of coincidence or an obstruction.

### `PredicationBaseObjectIdentityObstruction` — interface

```ts
export interface PredicationBaseObjectIdentityObstruction
```

Obstruction recording that two base objects do not coincide, tagged "predication.baseObjectIdentity-obstruction" and carrying the two objects.

### `PredicationBaseObjectIdentityWitness` — interface

```ts
export interface PredicationBaseObjectIdentityWitness
```

Witness that two base objects coincide, tagged "predication.baseObjectIdentity:witness" and carrying the two objects.

### `predicationCarrier` — function

```ts
export function predicationCarrier(witnesses: readonly PredicationDatum[]): PredicationCarrier
```

Builds a predication carrier from data: partitions cells and specialization morphisms, forms the cell set, and derives the base category with objects, specialization edges, and converse and projection edges from each cell's node.

### `PredicationCarrier` — interface

```ts
export interface PredicationCarrier
```

A predication carrier: the cell set, the specialization morphisms, and the base category derived from them.

### `predicationCellCoincidence` — function

```ts
export function predicationCellCoincidence(left: Cell, right: Cell): PredicationCellCoincidenceJudgment
```

Compares two predication cells componentwise - subject and object by term coincidence, predicate by predicate coincidence - and returns a witness when all three coincide, otherwise an obstruction.

### `predicationCellCoincidenceHolds` — const

```ts
export const predicationCellCoincidenceHolds = (left: Cell, right: Cell): boolean => …
```

Returns true when predicationCellCoincidence of the two cells yields a witness.

### `PredicationCellCoincidenceJudgment` — type-alias

```ts
export type PredicationCellCoincidenceJudgment = PredicationCellCoincidenceWitness | PredicationCellCoincidenceObstruction
```

The result of comparing two predication cells: either a PredicationCellCoincidenceWitness or a PredicationCellCoincidenceObstruction.

### `PredicationCellCoincidenceObstruction` — interface

```ts
export interface PredicationCellCoincidenceObstruction
```

An obstruction to predication-cell coincidence: holds the left and right Cell found not to coincide.

### `PredicationCellCoincidenceWitness` — interface

```ts
export interface PredicationCellCoincidenceWitness
```

A witness that two predication cells coincide: holds the left and right Cell found to coincide.

### `PredicationDatum` — type-alias

```ts
export type PredicationDatum = Cell | SpecializationMorphism
```

A datum admitted when building a predication carrier: either a cell or a specialization morphism.

### `PredicationNode` — type-alias

```ts
export type PredicationNode = readonly [PredicationTerm, PredicationPredicate, PredicationTerm]
```

A predication node: the immutable subject-predicate-object triple read off a cell.

### `predicationNodeCoincidence` — function

```ts
export function predicationNodeCoincidence(left: PredicationNode, right: PredicationNode): PredicationNodeCoincidenceJudgment
```

Compares two predication nodes positionally - term at index 0 and 2 by term coincidence, predicate at index 1 by predicate coincidence - and returns a witness when all three coincide, otherwise an obstruction.

### `predicationNodeCoincidenceHolds` — const

```ts
export const predicationNodeCoincidenceHolds = (left: PredicationNode, right: PredicationNode): boolean => …
```

Returns true when predicationNodeCoincidence of the two nodes yields a witness.

### `PredicationNodeCoincidenceJudgment` — type-alias

```ts
export type PredicationNodeCoincidenceJudgment = PredicationNodeCoincidenceWitness | PredicationNodeCoincidenceObstruction
```

The result of comparing two predication nodes: either a PredicationNodeCoincidenceWitness or a PredicationNodeCoincidenceObstruction.

### `PredicationNodeCoincidenceObstruction` — interface

```ts
export interface PredicationNodeCoincidenceObstruction
```

An obstruction to predication-node coincidence: holds the left and right PredicationNode found not to coincide.

### `PredicationNodeCoincidenceWitness` — interface

```ts
export interface PredicationNodeCoincidenceWitness
```

A witness that two predication nodes coincide: holds the left and right PredicationNode found to coincide.

### `predicationNodeIdentity` — function

```ts
export function predicationNodeIdentity(left: PredicationNode, right: PredicationNode): PredicationNodeIdentityJudgment
```

Judges whether two predication nodes coincide, returning a frozen witness when their carrier coincidence holds and an obstruction otherwise.

### `PredicationNodeIdentityJudgment` — type-alias

```ts
export type PredicationNodeIdentityJudgment = PredicationNodeIdentityWitness | PredicationNodeIdentityObstruction
```

The judgment of node identity: either a witness of coincidence or an obstruction.

### `PredicationNodeIdentityObstruction` — interface

```ts
export interface PredicationNodeIdentityObstruction
```

Obstruction recording that two predication nodes do not coincide, tagged "predication.nodeIdentity-obstruction" and carrying the two nodes.

### `PredicationNodeIdentityWitness` — interface

```ts
export interface PredicationNodeIdentityWitness
```

Witness that two predication nodes coincide, tagged "predication.nodeIdentity:witness" and carrying the two nodes.

### `PredicationPredicate` — type-alias

```ts
export type PredicationPredicate = Claim
```

A predicate in a predication: the claim that relates a cell's subject to its object.

### `predicationPredicateCoincidence` — function

```ts
export function predicationPredicateCoincidence( left: PredicationPredicate, right: PredicationPredicate, ): PredicationPredicateCoincidenceJudgment
```

Compares two predication predicates by claim coincidence and returns a witness when they coincide, otherwise an obstruction.

### `predicationPredicateCoincidenceHolds` — const

```ts
export const predicationPredicateCoincidenceHolds = (left: PredicationPredicate, right: PredicationPredicate): boolean => …
```

Returns true when predicationPredicateCoincidence of the two predicates yields a witness.

### `PredicationPredicateCoincidenceJudgment` — type-alias

```ts
export type PredicationPredicateCoincidenceJudgment = PredicationPredicateCoincidenceWitness | PredicationPredicateCoincidenceObstruction
```

The result of comparing two predication predicates: either a PredicationPredicateCoincidenceWitness or a PredicationPredicateCoincidenceObstruction.

### `PredicationPredicateCoincidenceObstruction` — interface

```ts
export interface PredicationPredicateCoincidenceObstruction
```

An obstruction to predication-predicate coincidence: holds the left and right PredicationPredicate found not to coincide.

### `PredicationPredicateCoincidenceWitness` — interface

```ts
export interface PredicationPredicateCoincidenceWitness
```

A witness that two predication predicates coincide: holds the left and right PredicationPredicate found to coincide.

### `predicationPredicateIdentity` — function

```ts
export function predicationPredicateIdentity(left: PredicationPredicate, right: PredicationPredicate): PredicationPredicateIdentityJudgment
```

Judges whether two predicates coincide, returning a frozen witness when their carrier coincidence holds and an obstruction otherwise.

### `PredicationPredicateIdentityJudgment` — type-alias

```ts
export type PredicationPredicateIdentityJudgment = PredicationPredicateIdentityWitness | PredicationPredicateIdentityObstruction
```

The judgment of predicate identity: either a witness of coincidence or an obstruction.

### `PredicationPredicateIdentityObstruction` — interface

```ts
export interface PredicationPredicateIdentityObstruction
```

Obstruction recording that two predicates do not coincide, tagged "predication.predicateIdentity-obstruction" and carrying the two predicates.

### `PredicationPredicateIdentityWitness` — interface

```ts
export interface PredicationPredicateIdentityWitness
```

Witness that two predicates coincide, tagged "predication.predicateIdentity:witness" and carrying the two predicates.

### `PredicationTerm` — type-alias

```ts
export type PredicationTerm = Token | Claim
```

A term in a predication: either an atomic token or a nested claim, occupying a subject or object position.

### `predicationTermCoincidence` — function

```ts
export function predicationTermCoincidence(left: PredicationTerm, right: PredicationTerm): PredicationTermCoincidenceJudgment
```

Compares two predication terms of the same hand - left terms by token coincidence, right terms by claim coincidence - and returns a witness when they coincide, otherwise an obstruction; terms of differing hands never coincide.

### `predicationTermCoincidenceHolds` — const

```ts
export const predicationTermCoincidenceHolds = (left: PredicationTerm, right: PredicationTerm): boolean => …
```

Returns true when predicationTermCoincidence of the two terms yields a witness.

### `PredicationTermCoincidenceJudgment` — type-alias

```ts
export type PredicationTermCoincidenceJudgment = PredicationTermCoincidenceWitness | PredicationTermCoincidenceObstruction
```

The result of comparing two predication terms: either a PredicationTermCoincidenceWitness or a PredicationTermCoincidenceObstruction.

### `PredicationTermCoincidenceObstruction` — interface

```ts
export interface PredicationTermCoincidenceObstruction
```

An obstruction to predication-term coincidence: holds the left and right PredicationTerm found not to coincide.

### `PredicationTermCoincidenceWitness` — interface

```ts
export interface PredicationTermCoincidenceWitness
```

A witness that two predication terms coincide: holds the left and right PredicationTerm found to coincide.

### `predicationTermIdentity` — function

```ts
export function predicationTermIdentity(left: PredicationTerm, right: PredicationTerm): PredicationTermIdentityJudgment
```

Judges whether two terms coincide, returning a frozen witness when their carrier coincidence holds and an obstruction otherwise.

### `PredicationTermIdentityJudgment` — type-alias

```ts
export type PredicationTermIdentityJudgment = PredicationTermIdentityWitness | PredicationTermIdentityObstruction
```

The judgment of term identity: either a witness of coincidence or an obstruction.

### `PredicationTermIdentityObstruction` — interface

```ts
export interface PredicationTermIdentityObstruction
```

Obstruction recording that two terms do not coincide, tagged "predication.termIdentity-obstruction" and carrying the two terms.

### `PredicationTermIdentityWitness` — interface

```ts
export interface PredicationTermIdentityWitness
```

Witness that two terms coincide, tagged "predication.termIdentity:witness" and carrying the two terms.

### `present` — const

```ts
export const present = (c: ChargeCarrier): ChargeCoordinates => …
```

Returns the truth/falsity coordinate pair carried by a charge.

### `quotient` — const

```ts
export const quotient = (left: Integer, right: Integer): Integer => …
```

The quotient of dividing two integers, discarding the remainder.

### `rank` — const

```ts
export const rank = (matrix: Matrix): Natural => …
```

The rank of a matrix as a natural: the count of nonzero invariant factors in its Smith normal form.

### `ratAdd` — const

```ts
export const ratAdd = (left: Rational, right: Rational): Rational => …
```

Addition of rationals over a common denominator, returned in canonical form.

### `ratCompare` — const

```ts
export const ratCompare = (left: Rational, right: Rational): -1 | 0 | 1 => …
```

Three-way comparison of rationals: the sign of left minus right, returning -1, 0, or 1.

### `ratEqual` — const

```ts
export const ratEqual = (left: Rational, right: Rational): boolean => …
```

Equality on rationals in canonical form: true when numerators and denominators are respectively equal.

### `ratFromInt` — const

```ts
export const ratFromInt = (value: number): Rational => …
```

Constructs a rational from a native integer value, with denominator one.

### `rational` — const

```ts
export const rational = (num: Integer, den: Integer): Rational => …
```

Constructs a rational from numerator and denominator integers, reduced to canonical form; throws RangeError on a zero denominator.

### `Rational` — interface

```ts
export interface Rational
```

A rational number as a pair of integers: num over den, kept in canonical form (reduced by gcd, sign carried on the numerator, positive denominator).

### `ratIsZero` — const

```ts
export const ratIsZero = (q: Rational): boolean => …
```

Tests whether a rational is zero: true when its numerator is zero.

### `ratMultiply` — const

```ts
export const ratMultiply = (left: Rational, right: Rational): Rational => …
```

Multiplication of rationals: multiplies numerators and denominators, returned in canonical form.

### `ratNegate` — const

```ts
export const ratNegate = (q: Rational): Rational => …
```

Negation of a rational: negates the numerator, leaving the denominator unchanged.

### `ratOne` — variable

```ts
export const ratOne: Rational
```

The rational one.

### `ratSign` — const

```ts
export const ratSign = (q: Rational): -1 | 0 | 1 => …
```

The sign of a rational: the sign of its numerator, since the denominator is always positive.

### `ratSubtract` — const

```ts
export const ratSubtract = (left: Rational, right: Rational): Rational => …
```

Subtraction of rationals: adds left to the negation of right.

### `ratZero` — variable

```ts
export const ratZero: Rational
```

The rational zero.

### `reciprocal` — const

```ts
export const reciprocal = (q: Rational): Rational => …
```

The reciprocal of a rational: swaps numerator and denominator, re-canonicalized.

### `relation` — function

```ts
export function relation<Point, State>( points: EntitySet<Point>, states: PredicateSet<State>, read: RelationReadFunction<Point, State>, options: RelationOptions<Point, State>, ): RelationCarrier<Point, State>
```

Constructs a RelationCarrier over the given points and states from a cell-reading function: reads of out-of-set states yield a read-obstruction with the absent value, and at collapses each cell to its charge value (the absent value when obstructed).

### `RelationBackward` — type-alias

```ts
export type RelationBackward<TargetState = unknown, SourceState = unknown> = (state: TargetState) => SourceState
```

The backward leg of a relation transform: maps a target state to a source state.

### `RelationCarrier` — interface

```ts
export interface RelationCarrier<Point = unknown, State = unknown>
```

A bilattice relation: a matrix of charge values over a set of points and a set of states, with sameness tests, an absent default, a read judging each cell, and at returning each cell's charge value directly.

### `RelationForward` — type-alias

```ts
export type RelationForward<SourcePoint = unknown, TargetPoint = unknown> = (point: SourcePoint) => TargetPoint
```

The forward leg of a relation transform: maps a source point to a target point.

### `relationFromMatrix` — function

```ts
export function relationFromMatrix<Point, State>( matrix: RelationMatrixCarrier<Point, State>, options: { readonly absent?: ChargeValue } = {}, ): RelationCarrier<Point, State>
```

Builds a RelationCarrier backed by a relation matrix: present coordinates read their stored value, missing ones read the absent charge value (defaulting to active).

### `relationMatrix` — function

```ts
export function relationMatrix<Point, State>( points: EntitySet<Point>, states: PredicateSet<State>, entries: Iterable<readonly [point: Point, state: State, value: ChargeValue]>, options: Pick<RelationOptions<Point, State>, "samePoint" | "sameState">, ): RelationMatrixCarrier<Point, State>
```

Builds a RelationMatrixCarrier from an iterable of (point, state, value) entries: duplicate coordinates are knowledge-joined so construction is order-insensitive and conflicting charges settle to stable.

### `RelationMatrixCarrier` — interface

```ts
export interface RelationMatrixCarrier<Point = unknown, State = unknown>
```

A relation in sparse matrix form: its points, states, the list of populated entries, the rank (entry count), and the point/state sameness tests.

### `RelationMatrixEntry` — interface

```ts
export interface RelationMatrixEntry<Point = unknown, State = unknown>
```

A single populated cell of a relation matrix: the point, the state, and the charge value at that coordinate.

### `RelationMatrixEntryJudgment` — type-alias

```ts
export type RelationMatrixEntryJudgment<Point = unknown, State = unknown> = | RelationMatrixEntryWitness<Point, State> | RelationMatrixEntryObstruction<Point, State>
```

The outcome of a matrix lookup: either a RelationMatrixEntryWitness with the entry or a RelationMatrixEntryObstruction.

### `RelationMatrixEntryObstruction` — interface

```ts
export interface RelationMatrixEntryObstruction<Point = unknown, State = unknown>
```

A failed matrix lookup: no entry exists at the queried (point, state) coordinate.

### `RelationMatrixEntryWitness` — interface

```ts
export interface RelationMatrixEntryWitness<Point = unknown, State = unknown>
```

A successful matrix lookup: wraps the RelationMatrixEntry found at a queried (point, state) coordinate.

### `RelationOptions` — interface

```ts
export interface RelationOptions<Point = unknown, State = unknown>
```

Construction options for a relation: the point and state sameness tests and an optional absent charge value used for unread cells.

### `relationRead` — function

```ts
export function relationRead<Point, State>( point: Point, state: State, value: ChargeValue, ): RelationReadWitness<Point, State>
```

Builds a RelationReadWitness for a cell: a successful read of the given charge value at (point, state).

### `relationReadAbsence` — function

```ts
export function relationReadAbsence<Point, State>( point: Point, state: State, absent: ChargeValue, ): RelationReadObstruction<Point, State>
```

Builds a RelationReadObstruction for a cell: a failed read at (point, state) carrying the given absent charge value.

### `RelationReadFunction` — type-alias

```ts
export type RelationReadFunction<Point = unknown, State = unknown> = (point: Point, state: State) => RelationReadJudgment<Point, State>
```

The cell-reading function supplied to relation: yields a RelationReadJudgment for a given (point, state).

### `RelationReadJudgment` — type-alias

```ts
export type RelationReadJudgment<Point = unknown, State = unknown> = | RelationReadWitness<Point, State> | RelationReadObstruction<Point, State>
```

The outcome of reading a relation cell: either a RelationReadWitness with a value or a RelationReadObstruction with an absent value.

### `RelationReadObstruction` — interface

```ts
export interface RelationReadObstruction<Point = unknown, State = unknown>
```

A failed relation read: the (point, state) cell could not be read, carrying the absent charge value used in its place.

### `RelationReadWitness` — interface

```ts
export interface RelationReadWitness<Point = unknown, State = unknown>
```

A successful relation read: records the point, the state, and the charge value the relation assigns to that (point, state) cell.

### `RelationSameness` — type-alias

```ts
export type RelationSameness<T> = (left: T, right: T) => boolean
```

An equivalence test for relation coordinates: returns true when two points (or two states) are the same.

### `relationTransform` — function

```ts
export function relationTransform<SourcePoint, SourceState, TargetPoint, TargetState>( source: RelationCarrier<SourcePoint, SourceState>, target: RelationCarrier<TargetPoint, TargetState>, forward: RelationForward<SourcePoint, TargetPoint>, backward: RelationBackward<TargetState, SourceState>, ): RelationTransform<SourcePoint, SourceState, TargetPoint, TargetState>
```

Constructs a RelationTransform after checking adjointness: throws a TypeError when forward and backward are not adjoint between source and target.

### `RelationTransform` — interface

```ts
export interface RelationTransform<SourcePoint = unknown, SourceState = unknown, TargetPoint = unknown, TargetState = unknown>
```

An adjoint pair between two relations: a source carrier, a target carrier, a forward map on points, and a backward map on states.

### `RelationTransformAdjointnessObstruction` — interface

```ts
export interface RelationTransformAdjointnessObstruction<Point = unknown, State = unknown>
```

A transform failure where adjointness breaks at a cell: the target value at (forward point, state) differs from the source value at (point, backward state), recording both charge values.

### `RelationTransformBackwardDomainObstruction` — interface

```ts
export interface RelationTransformBackwardDomainObstruction<State = unknown, SourceState = unknown>
```

A transform failure where the backward image of a target state falls outside the source's state set: records the state and its out-of-domain mapped value.

### `RelationTransformForwardDomainObstruction` — interface

```ts
export interface RelationTransformForwardDomainObstruction<Point = unknown, TargetPoint = unknown>
```

A transform failure where the forward image of a source point falls outside the target's point set: records the point and its out-of-domain mapped value.

### `RelationTransformJudgment` — type-alias

```ts
export type RelationTransformJudgment<SourcePoint = unknown, SourceState = unknown, TargetPoint = unknown, TargetState = unknown> = | RelationTransformWitness<SourcePoint, SourceState, TargetPoint, TargetState> | RelationTransformObstruction<SourcePoint, SourceState, TargetPoint, TargetState>
```

The outcome of checking a relation transform: either a RelationTransformWitness or a RelationTransformObstruction.

### `RelationTransformObstruction` — interface

```ts
export interface RelationTransformObstruction<SourcePoint = unknown, SourceState = unknown, TargetPoint = unknown, TargetState = unknown>
```

A failed transform check: the source and target carriers, the list of obstruction atoms, and the rank (failure count).

### `RelationTransformObstructionAtom` — type-alias

```ts
export type RelationTransformObstructionAtom<SourcePoint = unknown, SourceState = unknown, TargetPoint = unknown, TargetState = unknown> = | RelationTransformForwardDomainObstruction<SourcePoint, TargetPoint> | RelationTransformBackwardDomainObstruction<TargetState, SourceState> | RelationTransformAdjointnessObstruction<SourcePoint, TargetState>
```

A single transform-check failure: a forward-domain, backward-domain, or adjointness obstruction.

### `RelationTransformWitness` — interface

```ts
export interface RelationTransformWitness<SourcePoint = unknown, SourceState = unknown, TargetPoint = unknown, TargetState = unknown>
```

A successful transform check: the source and target carriers together with the forward and backward maps proven adjoint.

### `sameCharge` — function

```ts
export function sameCharge(left: ChargeCarrier, right: ChargeCarrier): boolean
```

Returns whether two charge carriers denote the same value, comparing the values their coordinates resolve to.

### `sameChargeValue` — const

```ts
export const sameChargeValue = (left: ChargeValue, right: ChargeValue): boolean => …
```

Returns whether two charge values name the same value.

### `sameMembershipPredicate` — const

```ts
export const sameMembershipPredicate = (left: MembershipPredicate, right: MembershipPredicate): boolean => …
```

Equality on membership predicates: true when the two share the same kind tag.

### `settlePointProfile` — function

```ts
export function settlePointProfile( carrier: RelationCarrier<unknown, unknown>, point: unknown, join: (left: ChargeValue, right: ChargeValue) => ChargeValue = joinKnowledgeValue, identity: ChargeValue = chargeValue("absurd"), ): ChargeValue
```

Folds a point's profile to a single charge value by reducing its cell values with the given join (knowledge-join by default) from the given identity (absurd by default).

### `settleStateProfile` — function

```ts
export function settleStateProfile( carrier: RelationCarrier<unknown, unknown>, state: unknown, join: (left: ChargeValue, right: ChargeValue) => ChargeValue = joinKnowledgeValue, identity: ChargeValue = chargeValue("absurd"), ): ChargeValue
```

Folds a state's profile to a single charge value by reducing its cell values with the given join (knowledge-join by default) from the given identity (absurd by default).

### `sign` — const

```ts
export const sign = (z: Integer): -1 | 0 | 1 => …
```

The sign of an integer: 1 if positive, -1 if negative, 0 if zero.

### `smithNormalForm` — function

```ts
export function smithNormalForm(matrix: Matrix): readonly Integer[]
```

The invariant factors of a matrix from its Smith normal form: the diagonal magnitudes produced by integer row and column reduction.

### `specializationClaimValue` — variable

```ts
export const specializationClaimValue
```

The claim concept whose relational cells also install specialization edges in the base: taxonomy is itself claimed, never separately admitted.

### `specializationMorphism` — function

```ts
export function specializationMorphism(specialized: PredicationTerm, general: PredicationTerm): SpecializationMorphism
```

Constructs a frozen specialization morphism whose domain is the general term and codomain the specialized term.

### `SpecializationMorphism` — interface

```ts
export interface SpecializationMorphism extends Edge<PredicationTerm, PredicationTerm>
```

A specialization edge between terms, tagged with kind "predication.specialization": its domain is the general term and its codomain the specialized term.

### `stateExtension` — function

```ts
export function stateExtension<Point, State>(carrier: RelationCarrier<Point, State>, state: State): StateExtensionCarrier<Point, State>
```

Builds the StateExtensionCarrier for a state: the points whose value is potential or stable, that is whose truth coordinate is present.

### `StateExtensionCarrier` — interface

```ts
export interface StateExtensionCarrier<Point = unknown, State = unknown>
```

The extension of a state: the set of points whose truth coordinate is present (charge value potential or stable) for that state, with the rank (point count).

### `stateProfile` — function

```ts
export function stateProfile<Point, State>(carrier: RelationCarrier<Point, State>, state: State): StateProfileCarrier<Point, State>
```

Builds the StateProfileCarrier for a state: its charge value across every point in the carrier.

### `StateProfileCarrier` — interface

```ts
export interface StateProfileCarrier<Point = unknown, State = unknown>
```

The column of a relation for a fixed state: the state, its charge value across every point, and the rank (entry count).

### `StateProfileEntry` — interface

```ts
export interface StateProfileEntry<Point = unknown>
```

One cell of a state's profile: a point paired with the charge value the relation assigns it for that state.

### `successor` — const

```ts
export const successor = (n: Natural): Natural => …
```

The von Neumann successor n union {n}: returns the natural whose members are n's members plus n itself, building the canonical set directly without re-dedup or re-sort.

### `toCount` — const

```ts
export const toCount = (n: Natural): number => …
```

The native-number value of a natural: its member count.

### `toInt` — const

```ts
export const toInt = (z: Integer): number => …
```

The native-number value of an integer: the count of its positive part minus the count of its negative part.

### `token` — function

```ts
export function token(markCarrier: Mark): Token
```

Constructs a Token from the given mark.

### `Token` — class

```ts
export class Token
```

A token: an immutable, frozen left-hand utterance carrier holding a single mark.

### `tokenCoincidence` — function

```ts
export function tokenCoincidence(left: Token, right: Token): TokenCoincidenceJudgment
```

Compares two tokens by their marks and returns a witness when the marks coincide, otherwise an obstruction.

### `tokenCoincidenceHolds` — const

```ts
export const tokenCoincidenceHolds = (left: Token, right: Token): boolean => …
```

Returns true when tokenCoincidence of the two tokens yields a witness, i.e. their marks coincide.

### `TokenCoincidenceJudgment` — type-alias

```ts
export type TokenCoincidenceJudgment = TokenCoincidenceWitness | TokenCoincidenceObstruction
```

The result of comparing two tokens: either a TokenCoincidenceWitness or a TokenCoincidenceObstruction.

### `TokenCoincidenceObstruction` — interface

```ts
export interface TokenCoincidenceObstruction
```

An obstruction to token coincidence: holds the left and right Token whose marks were found not to coincide.

### `TokenCoincidenceWitness` — interface

```ts
export interface TokenCoincidenceWitness
```

A witness that two tokens coincide: holds the left and right Token whose marks were found to coincide.

### `tokenIdentity` — function

```ts
export function tokenIdentity(left: Token, right: Token): TokenIdentityJudgment
```

Judges whether two tokens are identical: returns a witness when their marks coincide, otherwise an obstruction.

### `TokenIdentityJudgment` — type-alias

```ts
export type TokenIdentityJudgment = TokenIdentityWitness | TokenIdentityObstruction
```

The result of judging two tokens identical: either a TokenIdentityWitness or a TokenIdentityObstruction.

### `TokenIdentityObstruction` — interface

```ts
export interface TokenIdentityObstruction
```

An obstruction to token identity: holds the left and right Token found not to coincide.

### `TokenIdentityWitness` — interface

```ts
export interface TokenIdentityWitness
```

A witness that two tokens are identical: holds the left and right Token found to coincide.

### `toNumber` — const

```ts
export const toNumber = (q: Rational): number => …
```

The native floating-point value of a rational: its numerator divided by its denominator.

### `transpose` — function

```ts
export function transpose<Point, State>(carrier: RelationCarrier<Point, State>): RelationCarrier<State, Point>
```

Swaps points and states of a relation: returns a carrier indexed by the original states over the original points, with each cell's charge value preserved.

### `truthLeq` — variable

```ts
export const truthLeq
```

Tests whether one charge value is below or equal to another in the truth order, witnessed by their truth-join coinciding with the right value.

### `unrelatedPairs` — function

```ts
export function unrelatedPairs(predication: PredicationCarrier): UnrelatedPairsCarrier
```

Computes the pairs of entities not connected by the transitively closed specialization relation, returning an edge for each unrelated ordered pair.

### `UnrelatedPairsCarrier` — interface

```ts
export interface UnrelatedPairsCarrier
```

A carrier of entity pairs not connected by specialization, tagged "predication.unrelatedPairs" and holding the unrelated edges.

### `utterance` — function

```ts
export function utterance(left: Mark, right: Mark): UtteranceCarrier
```

Constructs an utterance carrier from two marks: the left mark becomes a token and the right mark becomes a claim.

### `UtteranceCarrier` — interface

```ts
export interface UtteranceCarrier
```

An utterance: a carrier pairing a left-hand token with a right-hand claim.

### `UtterancePotentialCarrier` — interface

```ts
export interface UtterancePotentialCarrier
```

An utterance potential carrier: a potential carrier whose contents are exactly a token and a claim, the unrealized form of an utterance.

### `valueOf` — function

```ts
export function valueOf(c: ChargeCarrier): ChargeValue
```

Returns the ChargeValue named by a carrier's coordinates: "stable" when both sides present, "potential" when only truth, "active" when only falsity, "absurd" when neither.

### `witnessedPotential` — const

```ts
export const witnessedPotential = (witness: unknown): ChargeCarrier => …
```

Returns a "potential" carrier whose truth side carries the given witness as its sole piece of evidence.

## `@emsenn/relationality/analysis`

### `absoluteContinuity` — function

```ts
export function absoluteContinuity( from: ChargeDistributionCarrier, to: ChargeDistributionCarrier, ): AbsoluteContinuityJudgment
```

Support containment of `from` within `to`. The divergence of `from` relative to `to` is finite exactly when the witness exists; an obstruction is an informational horizon — `to` assigns zero where `from` stands.

### `AbsoluteContinuityJudgment` — type-alias

```ts
export type AbsoluteContinuityJudgment = AbsoluteContinuityWitness | AbsoluteContinuityObstruction
```

The result of an absolute-continuity check: either a witness of support containment or an obstruction naming the escaping charge values.

### `AbsoluteContinuityObstruction` — interface

```ts
export interface AbsoluteContinuityObstruction
```

A failure of support containment: the escaping charge values are those `from` stands on that `to` assigns zero, an informational horizon where the divergence diverges.

### `AbsoluteContinuityWitness` — interface

```ts
export interface AbsoluteContinuityWitness
```

Evidence that `from` is supported within `to`: every charge value `from` stands on is also assigned positive mass by `to`, so the divergence of `from` relative to `to` is finite.

### `carrierRelationGraph` — function

```ts
export function carrierRelationGraph(carrier: MemeTopologyCarrier): RelationGraphCarrier
```

The relation graph of a carrier, read at the knowledge-least section.

### `ChargeBin` — interface

```ts
export interface ChargeBin
```

One bin of a charge histogram: a charge value, the count of entries that took it, and its exact probability over the distribution's total.

### `chargeDistribution` — function

```ts
export function chargeDistribution(values: readonly ChargeValue[]): ChargeDistributionCarrier
```

Exact histogram of charge values. An empty collection presents no distribution.

### `ChargeDistributionCarrier` — interface

```ts
export interface ChargeDistributionCarrier
```

An exact charge histogram: the total count and a bin per charge value in canonical order, each carrying its count and rational probability.

### `chargeJoint` — function

```ts
export function chargeJoint( pairs: readonly (readonly [source: ChargeValue, reproduction: ChargeValue])[], ): JointChargeDistributionCarrier
```

Exact joint histogram of (source, reproduction) charge pairs — the observed-channel core.

### `chargeTriple` — function

```ts
export function chargeTriple( triples: readonly (readonly [internal: ChargeValue, boundary: ChargeValue, external: ChargeValue])[], ): TripleChargeDistributionCarrier
```

Exact joint histogram of (internal, boundary, external) charge triples.

### `componentCount` — function

```ts
export function componentCount(graph: RelationGraphCarrier): number
```

The number of connected components — the multiplicity of the zero eigenvalue of L, computed exactly as its rank deficiency over ℤ.

### `control` — function

```ts
export function control(norms: readonly Norm[]): Control
```

Assemble a control object from its norms.

### `Control` — type-alias

```ts
export type Control = Readonly<{ norms: readonly Norm[] }>
```

A control object: the reference catalog of norms.

### `ConvergenceMahlerMeasureObstruction` — interface

```ts
export interface ConvergenceMahlerMeasureObstruction
```

Obstruction to computing a Mahler measure: the polynomial is Pisot but dominant-root power iteration failed, carrying the Pisot witness and the convergence obstruction.

### `coordinateDistortion` — function

```ts
export function coordinateDistortion(left: ChargeValue, right: ChargeValue): Rational
```

Per-side disagreement of two charge coordinates, in {0, 1/2, 1} — the structural distortion the predecessor rate-distortion surface buried under a β-weighted float objective.

### `deviationOf` — function

```ts
export function deviationOf(graph: RelationGraphCarrier, values: readonly number[]): readonly number[]
```

The deviation operator applied to an observable: how each term's value deviates from its relational neighborhood. Exact.

### `dominantRootConvergence` — function

```ts
export function dominantRootConvergence(poly: readonly Integer[], iterations: Natural = fromCount(12)): DominantRootConvergenceJudgment
```

Estimates a monic polynomial's dominant root by power iteration over its companion recurrence for the given number of iterations, returning a DominantRootConvergenceJudgment with a rational estimate or a failure reason.

### `DominantRootConvergenceJudgment` — type-alias

```ts
export type DominantRootConvergenceJudgment = DominantRootConvergenceWitness | DominantRootConvergenceObstruction
```

The result of estimating a polynomial's dominant root by power iteration: either a DominantRootConvergenceWitness or a DominantRootConvergenceObstruction.

### `DominantRootConvergenceObstruction` — interface

```ts
export interface DominantRootConvergenceObstruction
```

Obstruction to estimating a polynomial's dominant root by power iteration: carries the polynomial, the iteration count, and the reason iteration failed.

### `DominantRootConvergenceObstructionReason` — type-alias

```ts
export type DominantRootConvergenceObstructionReason = | "non-positive-degree" | "non-monic-polynomial" | "zero-denominator"
```

The reason dominant-root power iteration could not produce an estimate: degree below one, a non-monic leading coefficient, or a zero denominator in the final ratio.

### `DominantRootConvergenceWitness` — interface

```ts
export interface DominantRootConvergenceWitness
```

Witness for a power-iteration estimate of a monic polynomial's dominant root: carries the polynomial, the iteration count, and the rational estimate of that root.

### `DominantRootMahlerMeasureWitness` — interface

```ts
export interface DominantRootMahlerMeasureWitness
```

Witness that a polynomial's Mahler measure equals its dominant (Pisot) root: carries the Pisot witness, the dominant-root convergence witness, and the resulting rational value.

### `entropyBitsAtBoundary` — function

```ts
export function entropyBitsAtBoundary(distribution: ChargeDistributionCarrier): number
```

Shannon entropy in bits — a float boundary read; the base-2 choice is a slice coordinate. The exact content is the mixedness order.

### `evidenceCoordinates` — function

```ts
export function evidenceCoordinates(distribution: ChargeDistributionCarrier): EvidenceCoordinatesCarrier
```

Expectations of the bedrock charge coordinates, exactly.

### `EvidenceCoordinatesCarrier` — interface

```ts
export interface EvidenceCoordinatesCarrier
```

The expected bedrock charge coordinates of a distribution: expected truth-side and falsity-side presence, their sum as expected knowledge height (0 through 2), and the probability of held conflict (both sides present).

### `evidenceDelta` — function

```ts
export function evidenceDelta( prior: ChargeDistributionCarrier, posterior: ChargeDistributionCarrier, ): EvidenceDeltaCarrier
```

Exact movement of evidence coordinates from a prior to a posterior distribution — the lawful core of a belief-update read.

### `EvidenceDeltaCarrier` — interface

```ts
export interface EvidenceDeltaCarrier
```

The exact movement of evidence coordinates from a prior to a posterior distribution: both coordinate carriers and the per-coordinate differences in truth, falsity, knowledge, and conflict.

### `expectedDistortion` — function

```ts
export function expectedDistortion(joint: JointChargeDistributionCarrier): Rational
```

Expected coordinate distortion of a joint, exactly.

### `finding` — function

```ts
export function finding( norm: Norm, charge: ChargeValueName, message: string, evidence: readonly string[] = [], ): Finding
```

Read a subject against one norm: a charged finding, not a pass/fail.

### `Finding` — type-alias

```ts
export type Finding = Readonly<{ norm: string; charge: ChargeValueName; severity: Severity; message: string; evidence: readonly string[]; }>
```

A per-norm differential reading of a subject against the control.

### `harmonic` — function

```ts
export function harmonic(graph: RelationGraphCarrier, values: readonly number[]): HarmonicJudgment
```

Harmonic judgment: the observable is a harmonic mode exactly when its deviation vanishes at every term.

### `HarmonicJudgment` — type-alias

```ts
export type HarmonicJudgment = HarmonicWitness | HarmonicObstruction
```

The result of judging an observable for harmonicity: either a HarmonicWitness when deviation vanishes everywhere, or a HarmonicObstruction naming the first term where it does not.

### `HarmonicObstruction` — interface

```ts
export interface HarmonicObstruction
```

The obstruction to an observable being harmonic: the first term whose deviation is nonzero, recorded as atTerm together with that deviation, alongside the graph and the observable's values.

### `HarmonicWitness` — interface

```ts
export interface HarmonicWitness
```

The witness that an observable is a harmonic mode of a graph: its deviation vanishes at every term. Carries the graph and the observable's values.

### `independence` — function

```ts
export function independence(joint: JointChargeDistributionCarrier): IndependenceJudgment
```

Exact factorization check of a joint against its marginals. Mutual information vanishes exactly on the witness; how much dependence an obstruction amounts to in bits is a boundary read.

### `IndependenceJudgment` — type-alias

```ts
export type IndependenceJudgment = IndependenceWitness | IndependenceObstruction
```

The result of an independence check: either a witness that the joint factorizes or an obstruction naming the cell where joint and product probability disagree.

### `IndependenceObstruction` — interface

```ts
export interface IndependenceObstruction
```

A failure of factorization at one (source, reproduction) cell: the cell's joint probability differs from the product of its marginals, witnessing dependence.

### `IndependenceWitness` — interface

```ts
export interface IndependenceWitness
```

Evidence that a joint factorizes: every cell's probability equals the product of its source and reproduction marginals, so the mutual information vanishes.

### `informationDistribution` — function

```ts
export function informationDistribution(information: MemeTopologyInformation): ChargeDistributionCarrier
```

The charge histogram of a fixed-point reading's information entries.

### `IntegerPolynomial` — type-alias

```ts
export type IntegerPolynomial = readonly Integer[]
```

A polynomial over the integers: coefficients in ascending degree order, index i holding the coefficient of x^i.

### `inversionSymmetry` — function

```ts
export function inversionSymmetry(poly: readonly Integer[]): PolynomialInversionSymmetry
```

Pairs a polynomial with its reciprocal and the root-intersection judgment between them, returning a PolynomialInversionSymmetry.

### `JointChargeCell` — interface

```ts
export interface JointChargeCell
```

One cell of a joint charge histogram: a (source, reproduction) charge pair, the count of observed pairs that took it, and its exact probability.

### `JointChargeDistributionCarrier` — interface

```ts
export interface JointChargeDistributionCarrier
```

An exact joint histogram of (source, reproduction) charge pairs: the total, all sixteen cells in canonical order, and the source and reproduction marginal distributions.

### `klBitsAtBoundary` — function

```ts
export function klBitsAtBoundary( from: ChargeDistributionCarrier, to: ChargeDistributionCarrier, ): number
```

Divergence of `from` relative to `to` in bits — a float boundary read. Infinite exactly when `absoluteContinuity(from, to)` obstructs.

### `laplacianOf` — function

```ts
export function laplacianOf(graph: RelationGraphCarrier): Matrix
```

The combinatorial Laplacian L = D − W, exact integer entries.

### `mahlerMeasure` — function

```ts
export function mahlerMeasure(poly: readonly Integer[], iterations: Natural = fromCount(12)): MahlerMeasureJudgment
```

Computes a polynomial's Mahler measure: returns one for self-reciprocal polynomials with all roots on the unit circle, otherwise the dominant-root estimate for Pisot polynomials, or an obstruction, as a MahlerMeasureJudgment.

### `MahlerMeasureJudgment` — type-alias

```ts
export type MahlerMeasureJudgment = | UnitMahlerMeasureWitness | DominantRootMahlerMeasureWitness | PisotMahlerMeasureObstruction | ConvergenceMahlerMeasureObstruction
```

The result of computing a polynomial's Mahler measure: a unit witness, a dominant-root witness, or one of the Pisot or convergence obstructions.

### `matrixPisot` — function

```ts
export function matrixPisot(matrix: Matrix): MatrixPisotCarrier
```

Takes a matrix's characteristic polynomial and the Pisot-root judgment on it, returning a MatrixPisotCarrier describing whether the spectrum has a single dominant eigenvalue outside the unit circle.

### `MatrixPisotCarrier` — interface

```ts
export interface MatrixPisotCarrier
```

A matrix's characteristic polynomial paired with the Pisot-root judgment on it, recording whether the matrix's spectrum has a single dominant eigenvalue outside the unit circle.

### `mixedness` — function

```ts
export function mixedness( left: ChargeDistributionCarrier, right: ChargeDistributionCarrier, ): MixednessJudgment
```

The mixedness (majorization) order, exactly. "More mixed" means majorized-by: every Schur-concave uncertainty functional — Shannon entropy in any base among them — weakly increases with mixedness, so this one judgment settles every entropy comparison at once. Genuine incomparability is information the float entropy figure destroys: two incomparable distributions are ranked oppositely by different uncertainty functionals.

### `MixednessComparison` — interface

```ts
export interface MixednessComparison
```

A decided mixedness comparison: the two distributions and the relation placing them in the majorization order.

### `MixednessIncomparability` — interface

```ts
export interface MixednessIncomparability
```

A mixedness comparison with no order: each distribution's descending prefix concentration strictly exceeds the other's at some prefix length, so different Schur-concave functionals rank them oppositely.

### `MixednessJudgment` — type-alias

```ts
export type MixednessJudgment = MixednessComparison | MixednessIncomparability
```

The result of a mixedness check: either a decided comparison in the majorization order or an incomparability witnessed by prefixes that exceed in both directions.

### `MixednessRelation` — type-alias

```ts
export type MixednessRelation = "leftMoreMixed" | "rightMoreMixed" | "equallyMixed"
```

The ordering outcome of a mixedness comparison: the left distribution is more mixed, the right is more mixed, or the two are equally mixed.

### `mobius` — function

```ts
export function mobius(poly: readonly Integer[]): IntegerPolynomial
```

Applies the Mobius transform x -> (1+x)/(1-x) to a polynomial, returning the integer polynomial that maps unit-circle root location to the half-plane.

### `mutualInformationBitsAtBoundary` — function

```ts
export function mutualInformationBitsAtBoundary(joint: JointChargeDistributionCarrier): number
```

Mutual information in bits — a float boundary read. Zero exactly when `independence(joint)` witnesses.

### `Norm` — type-alias

```ts
export type Norm = Readonly<{ id: string; /** the way the norm is measured (a method/probe identifier). */ way: string; severity: Severity; /** the scopes this norm applies to (opaque tags the use case defines). */ scopes: readonly string[]; claim: string; }>
```

One claim the control asserts a good subject satisfies, within some scopes.

### `normsFor` — function

```ts
export function normsFor(control: Control, scope: string): readonly Norm[]
```

The norms of a control that apply within a scope.

### `PisotMahlerMeasureObstruction` — interface

```ts
export interface PisotMahlerMeasureObstruction
```

Obstruction to computing a Mahler measure via the Pisot path: the polynomial lacks single-expanding-root structure, carrying the PisotRootObstruction.

### `pisotRoot` — function

```ts
export function pisotRoot(poly: readonly Integer[]): PisotRootJudgment
```

Tests whether a polynomial has Pisot-style root structure - exactly one root outside the unit circle and none on it - returning a PisotRootJudgment.

### `PisotRootJudgment` — type-alias

```ts
export type PisotRootJudgment = PisotRootWitness | PisotRootObstruction
```

The result of testing a polynomial for Pisot-style root structure: either a PisotRootWitness or a PisotRootObstruction.

### `PisotRootObstruction` — interface

```ts
export interface PisotRootObstruction
```

Obstruction to a polynomial having Pisot-style root structure: carries the polynomial and the root-location judgment that failed the single-expanding-root condition.

### `PisotRootWitness` — interface

```ts
export interface PisotRootWitness
```

Witness that a polynomial has Pisot-style root structure: exactly one root outside the unit circle and none on it, carrying the polynomial and its RootLocationWitness.

### `polyDegree` — const

```ts
export const polyDegree = (poly: readonly Integer[]): Natural => …
```

Returns the degree of a polynomial as a Natural, after dropping trailing zero coefficients.

### `polyFromInts` — const

```ts
export const polyFromInts = (values: readonly number[]): IntegerPolynomial => …
```

Builds a normalized IntegerPolynomial from an array of plain integers given in ascending degree order.

### `polynomialIdentity` — function

```ts
export function polynomialIdentity(left: readonly Integer[], right: readonly Integer[]): PolynomialIdentityJudgment
```

Compares two polynomials for equality after normalization, returning a PolynomialIdentityJudgment that witnesses agreement or records the differing pair.

### `PolynomialIdentityJudgment` — type-alias

```ts
export type PolynomialIdentityJudgment = PolynomialIdentityWitness | PolynomialIdentityObstruction
```

The result of comparing two polynomials for equality: either a PolynomialIdentityWitness or a PolynomialIdentityObstruction.

### `PolynomialIdentityObstruction` — interface

```ts
export interface PolynomialIdentityObstruction
```

Obstruction to two polynomials being equal: carries the normalized left and right polynomials that differ.

### `PolynomialIdentityWitness` — interface

```ts
export interface PolynomialIdentityWitness
```

Witness that two polynomials are equal after normalization: carries the normalized left and right polynomials.

### `PolynomialInversionSymmetry` — interface

```ts
export interface PolynomialInversionSymmetry
```

A polynomial paired with its reciprocal (coefficients reversed) and the root-intersection judgment between them, recording whether the polynomial shares roots with its reciprocal.

### `PolynomialRootIntersectionJudgment` — type-alias

```ts
export type PolynomialRootIntersectionJudgment = PolynomialRootIntersectionWitness | PolynomialRootIntersectionObstruction
```

The result of testing two polynomials for a shared root via the resultant: either a PolynomialRootIntersectionWitness or a PolynomialRootIntersectionObstruction.

### `PolynomialRootIntersectionObstruction` — interface

```ts
export interface PolynomialRootIntersectionObstruction
```

Obstruction to two polynomials sharing a common root: carries both polynomials and their nonzero resultant.

### `PolynomialRootIntersectionWitness` — interface

```ts
export interface PolynomialRootIntersectionWitness
```

Witness that two polynomials share a common root: carries both polynomials and their resultant, which is zero.

### `polyReciprocal` — const

```ts
export const polyReciprocal = (poly: readonly Integer[]): IntegerPolynomial => …
```

Returns the reciprocal of a polynomial: its normalized coefficients reversed, mapping x to 1/x scaled by the degree.

### `polyToInts` — const

```ts
export const polyToInts = (poly: readonly Integer[]): readonly number[] => …
```

Converts a polynomial's integer coefficients to plain numbers in ascending degree order.

### `RationalPolynomial` — type-alias

```ts
export type RationalPolynomial = readonly Rational[]
```

A polynomial over the rationals: coefficients in ascending degree order, index i holding the coefficient of x^i.

### `relationGraph` — function

```ts
export function relationGraph(section: SectionCarrier): RelationGraphCarrier
```

The relation graph of a section: distinct terms, weighted adjacency.

### `RelationGraphCarrier` — interface

```ts
export interface RelationGraphCarrier
```

The relation graph of a section: the distinct terms as vertices, and a weighted adjacency matrix where weights[i][j] is the number of cells relating terms i and j (i != j). Reflexive cells are not edges; entries are exact small integers.

### `resultant` — const

```ts
export const resultant = (left: readonly Integer[], right: readonly Integer[]): Integer => …
```

Returns the resultant of two polynomials as the determinant of their Sylvester matrix; zero exactly when they share a common root.

### `RightHalfPlaneRootJudgment` — type-alias

```ts
export type RightHalfPlaneRootJudgment = RightHalfPlaneRootWitness | RightHalfPlaneRootObstruction
```

The result of counting a polynomial's right-half-plane roots: either a RightHalfPlaneRootWitness or a RightHalfPlaneRootObstruction.

### `RightHalfPlaneRootObstruction` — interface

```ts
export interface RightHalfPlaneRootObstruction
```

Obstruction to counting right-half-plane roots: records the Routh-test reason the count could not be completed.

### `RightHalfPlaneRootObstructionReason` — type-alias

```ts
export type RightHalfPlaneRootObstructionReason = "routh-row-has-zero-pivot" | "routh-first-column-has-zero-entry"
```

The reason a Routh-Hurwitz right-half-plane root count failed: either a zero pivot in a Routh row or a zero entry in the first column.

### `rightHalfPlaneRoots` — function

```ts
export function rightHalfPlaneRoots(poly: RationalPolynomial): RightHalfPlaneRootJudgment
```

Counts a rational polynomial's roots in the open right half-plane by building the Routh-Hurwitz array and counting first-column sign changes, returning a RightHalfPlaneRootJudgment.

### `RightHalfPlaneRootWitness` — interface

```ts
export interface RightHalfPlaneRootWitness
```

Witness for the number of polynomial roots in the open right half-plane: rhp holds the sign-change count from the Routh-Hurwitz first column.

### `rootIntersection` — function

```ts
export function rootIntersection(left: readonly Integer[], right: readonly Integer[]): PolynomialRootIntersectionJudgment
```

Tests whether two polynomials share a common root by computing their resultant, returning a PolynomialRootIntersectionJudgment witnessing a zero resultant or recording the nonzero value.

### `rootLocation` — function

```ts
export function rootLocation(poly: readonly Integer[]): RootLocationJudgment
```

Locates a polynomial's roots relative to the unit circle: applies the Mobius transform and the Routh test to count expanding, contracting, and neutral roots, returning a RootLocationJudgment.

### `RootLocationJudgment` — type-alias

```ts
export type RootLocationJudgment = RootLocationWitness | RootLocationObstruction
```

The result of locating a polynomial's roots relative to the unit circle: either a RootLocationWitness or a RootLocationObstruction.

### `RootLocationObstruction` — interface

```ts
export interface RootLocationObstruction
```

Obstruction to locating a polynomial's roots: records the polynomial together with the Routh-test reason and the underlying right-half-plane obstruction that blocked the count.

### `RootLocationWitness` — interface

```ts
export interface RootLocationWitness
```

Witness for the location of a polynomial's roots relative to the unit circle: counts of roots outside (expanding), inside (contracting), and on (neutral) the unit circle.

### `screeningOff` — function

```ts
export function screeningOff(triple: TripleChargeDistributionCarrier): ScreeningOffJudgment
```

The lawful core of a boundary claim: internal and external are conditionally independent given the boundary — p(i,b,e)·p(b) = p(i,b)·p(b,e) at every cell, exactly, with no tolerance knob. An obstruction exhibits a cell where information passes around the boundary.

### `ScreeningOffJudgment` — type-alias

```ts
export type ScreeningOffJudgment = ScreeningOffWitness | ScreeningOffObstruction
```

The result of a screening-off check: either a witness that the boundary conditionally separates internal from external or an obstruction naming the cell where information passes around it.

### `ScreeningOffObstruction` — interface

```ts
export interface ScreeningOffObstruction
```

A failure of screening-off at one (internal, boundary, external) cell: the through-boundary product p(i,b,e)*p(b) differs from the around-boundary product p(i,b)*p(b,e), a leak of information around the boundary.

### `ScreeningOffWitness` — interface

```ts
export interface ScreeningOffWitness
```

Evidence that the boundary screens off internal from external: internal and external are conditionally independent given the boundary at every cell of the triple.

### `selfReciprocity` — const

```ts
export const selfReciprocity = (poly: readonly Integer[]): PolynomialIdentityJudgment => …
```

Tests whether a polynomial equals its own reciprocal, returning the PolynomialIdentityJudgment between the polynomial and its reversal.

### `Severity` — type-alias

```ts
export type Severity = "error" | "warning" | "info"
```

The weight of a norm: error, warning, or info - carried onto every finding read against that norm.

### `spectrumPolynomial` — function

```ts
export function spectrumPolynomial(graph: RelationGraphCarrier): readonly Integer[]
```

The characteristic polynomial of L, lowest degree first, exact integer coefficients — the entire exact content of the spectrum. Its numeric roots are the eigenvalues; reading them is a boundary question.

### `treeCount` — function

```ts
export function treeCount(graph: RelationGraphCarrier): Integer
```

The weighted spanning-tree count: the determinant of the Laplacian with one term struck (Matrix-Tree). Zero exactly when the graph is disconnected. A graph on one term has the empty tree: one.

### `TripleChargeCell` — interface

```ts
export interface TripleChargeCell
```

One cell of a triple charge histogram: an (internal, boundary, external) charge triple, the count of observed triples that took it, and its exact probability.

### `TripleChargeDistributionCarrier` — interface

```ts
export interface TripleChargeDistributionCarrier
```

An exact joint histogram of (internal, boundary, external) charge triples: the total and all sixty-four cells in canonical order.

### `UnitMahlerMeasureWitness` — interface

```ts
export interface UnitMahlerMeasureWitness
```

Witness that a polynomial has Mahler measure one: holds when the polynomial is self-reciprocal with no roots off the unit circle, carrying the self-reciprocity witness, the root-location obstruction, and the value one.

## `@emsenn/relationality/codecs`

### `address` — function

```ts
export function address(root: string, term: AddressTerm, type: unknown): string
```

The typed filepath for a term under a root: joins the root with each sanitized term segment and appends a leaf file named after the last segment with the given type as its extension. Throws on an empty term or missing type.

### `addressNested` — function

```ts
export function addressNested(root: string, parts: unknown | readonly unknown[], type: unknown): string
```

The typed filepath for a term given as already-split parts: coerces each part to a string, sanitizes it as a segment, and builds the address under the root the same way as address. A single non-array part is treated as a one-element list.

### `AddressTerm` — type-alias

```ts
export type AddressTerm = string | readonly unknown[]
```

An addressable term: either a slash-separated string path or a readonly array of path parts.

### `composeTerm` — function

```ts
export function composeTerm(namespace: unknown, parts: unknown | readonly unknown[] = []): string
```

A slash-separated term built from a namespace and optional parts: sanitizes the namespace and each part as a segment and joins them with "/". A single non-array part is treated as a one-element list.

### `decomposeTerm` — function

```ts
export function decomposeTerm(term: unknown): Readonly<{ readonly namespace: string; readonly parts: readonly string[] }>
```

The frozen decomposition of a slash-separated term: its first segment desanitized into the namespace and the remaining segments desanitized into parts. The empty term yields an empty namespace and no parts. Inverse of composeTerm.

### `desanitizeSegment` — function

```ts
export function desanitizeSegment(segmentText: string): string
```

Decodes a path segment produced by sanitizeSegment back into its original string, reversing the "~hh" hex escapes. Throws on malformed escapes or disallowed raw bytes.

### `logPath` — const

```ts
export const logPath = (root: string, term: AddressTerm): string => …
```

The address of a term's append-only log under a root: its typed filepath with the "jsonl" type.

### `namespaceOf` — function

```ts
export function namespaceOf(term: unknown): string
```

The namespace of a slash-separated term: its first segment desanitized, or the empty string when the term has no segments.

### `sanitizeSegment` — function

```ts
export function sanitizeSegment(value: string): string
```

Encodes a string into a single filesystem-safe path segment: keeps ASCII alphanumerics and "._-", percent-style escapes everything else as "~hh" hex bytes, and special-cases the empty string, ".", "..", and a leading ".".

### `segment` — const

```ts
export const segment = (term: unknown): string => …
```

Converts a term into a single filesystem-safe path segment: the term's canonical key passed through sanitizeSegment.

### `termKey` — function

```ts
export function termKey(term: unknown): string
```

The canonical key for a term: returns plain strings unchanged (escaping any that collide with the reserved prefixes), and serializes non-strings to a stable JSON form with object keys sorted. Throws for undefined, functions, symbols, bigints, and non-finite numbers.

### `termOf` — function

```ts
export function termOf(root: string, path: string): string
```

The slash-separated term recovered from a filepath under a root: strips the root prefix and the leaf filename, desanitizes the remaining segments, and joins them with "/". Inverse of address for the directory portion.

### `termOfNested` — function

```ts
export function termOfNested(root: string, path: string): string[]
```

The term parts recovered from a filepath under a root: the desanitized path segments as an array, without joining them. Inverse of addressNested for the directory portion.

### `withinNamespace` — function

```ts
export function withinNamespace(term: unknown, namespace: unknown): boolean
```

Whether a term belongs to a namespace: true when the term's first segment equals the sanitized namespace.

## `@emsenn/relationality/codecs/html`

### `address` — function

```ts
export function address(content: string): string
```

A deterministic content-address (FNV-1a, 64-bit, hex). Pure; no I/O.

### `calmChargeOf` — function

```ts
export function calmChargeOf(charge: ChargeCarrier, projection: "supported" | "negated" = "supported"): ChargeValueName
```

A contested (stable/both) charge projected to one side: supported→potential, negated→active.

### `cellKey` — function

```ts
export function cellKey(cell: Partial<ShpCell>): string
```

The canonical identity of a cell: its [entity, attribute, value] coordinates.

### `ChargedCell` — type-alias

```ts
export type ChargedCell = { cell: ShpCell; charge: ChargeCarrier; }
```

A claim paired with its charge: an `ShpCell` and the `ChargeCarrier` carrying its truth/falsity content over the bilattice.

### `chargeMark` — function

```ts
export function chargeMark(charge: ChargeCarrier): "t" | "f" | "⊥" | "⊤"
```

A compact glyph for a charge: ⊤ both, ⊥ neither, t truth-only, f falsity-only.

### `chargeValueOf` — const

```ts
export const chargeValueOf = (charge: ChargeCarrier): ChargeValueName => …
```

The bilattice value-name of a charge — relationality's four-valued naming, no SHP-local re-derivation.

### `DataformOptions` — type-alias

```ts
export type DataformOptions = { title?: string; observer?: unknown; metadata?: Record<string, unknown>; mode?: "calm" | "audit"; projection?: "supported" | "negated"; }
```

The optional rendering settings carried onto a dataform: `title`, `observer`, `metadata`, the `mode` ("calm" or "audit"), and the `projection` ("supported" or "negated").

### `defaultMorphisms` — function

```ts
export function defaultMorphisms(): MorphismRegistry
```

The default registry: class = slug(predicate). The inverse is lossy (slug is not injective), so it returns the class itself as the recoverable identity.

### `DetectFinding` — type-alias

```ts
export type DetectFinding = { span: DetectSpan; rule: DetectRule; charge: ChargeCarrier; }
```

A single detector finding: the matched `span`, the `rule` that fired, and the `ChargeCarrier` for the match.

### `DetectReport` — type-alias

```ts
export type DetectReport = { cells?: readonly DetectFinding[]; }
```

A detector report: an optional list of `DetectFinding` `cells`.

### `DetectRule` — type-alias

```ts
export type DetectRule = { text: unknown; severity: unknown; }
```

A detector rule that matched: its descriptive `text` and its `severity`.

### `DetectSpan` — type-alias

```ts
export type DetectSpan = { tier: unknown; start: unknown; end: unknown; }
```

A located region from a detector report: its `tier` and its `start`/`end` offsets.

### `escapeAttr` — function

```ts
export function escapeAttr(value: unknown): string
```

Escapes a value for use in a quoted HTML attribute: applies escapeText then additionally replaces " and ' with their entity references.

### `escapeText` — function

```ts
export function escapeText(value: unknown): string
```

Escapes a value for use in HTML text content: stringifies it and replaces &, <, and > with their entity references.

### `fromCells` — function

```ts
export function fromCells(subject: unknown, cells: readonly ChargedCell[] = [], opts: DataformOptions = {}): ShpDataform
```

Builds an `ShpDataform` from a subject and a list of already-charged cells, carrying the options through.

### `fromDetect` — function

```ts
export function fromDetect(report: DetectReport, opts: DataformOptions & { subject?: unknown } = {}): ShpDataform
```

Normalizes a `DetectReport` into an `ShpDataform`: maps each finding to a charged cell whose subject is the span id (`tier@start-end`), predicate the rule text, and object the rule severity, defaulting the dataform subject to "document".

### `fromSection` — function

```ts
export function fromSection(section: Section, opts: DataformOptions & { subject?: unknown } = {}): ShpDataform
```

Normalizes a `Section` into an `ShpDataform`: charges each affirmed/contradicted/denied entry into a `ChargedCell`, infers the subject from `opts.subject` or the section's first cell subject, and carries the options through.

### `htmlProjector` — variable

```ts
export const htmlProjector: Projector<ChargedCell>
```

The html codec as a holography projector over `ChargedCell`: scoped to type "shp.html", it recognizes resources whose content carries the `semantic-hypertext-packet` class, reads HTML into cells via `markup`, and writes cells back to HTML via `project` of a "packet" assembled by `fromCells`. This makes the html codec composable in a restriction lattice alongside other holography nodes.

### `isContested` — function

```ts
export function isContested(charge: ChargeCarrier): boolean
```

A charge is contested when truth and falsity are both present (stable).

### `lint` — function

```ts
export function lint(html: string): LintReport
```

Lints an HTML string against the SHP packet-safety and RFC 7992 inhabitant rules: checks the doctype, lang, and charset declarations, rejects scripts, styles, external stylesheets, external src references, and inline event handlers, and verifies the article.semantic-hypertext-packet root plus per-span predicate classes and e/a carrier attributes. Returns a LintReport collecting every violation found.

### `LintReport` — type-alias

```ts
export type LintReport = { violations: readonly LintViolation[]; }
```

The result of linting an SHP HTML packet: a list of rule violations, each describing the rule, its severity, and a human-readable message. An empty list means the packet satisfies every packet-safety and inhabitant rule.

### `LintViolation` — type-alias

```ts
export type LintViolation = { rule: string; severity: "error" | "warning"; message: string; }
```

codecs/html/lint — packet-safety obligations for an SHP HTML packet: it must be self-contained (no script, no external resource, no inline handler) and carry its structural identities (the packet root, predicate classes, e/a carrier coordinates). These are the "recover packet semantics without executing anything" rules from the SHP spec; the rfc7992.* rules are the RFC 7992 inhabitant constraints, surfaced as one profile.

### `markup` — function

```ts
export function markup(html: string): ChargedCell[]
```

Decodes an SHP HTML packet into the charged cells it projects: scans every <span> with data-e/data-a carrier coordinates, recovers each cell's subject/predicate/object from data-e/data-a/data-v, reconstructs its bilattice charge value from data-positive/data-negative, and gathers witness evidence from the span's witnesses-positive/witnesses-negative lists. Spans lacking e/a carrier coordinates are skipped; the inverse of project for the carrier coordinates.

### `Morphism` — interface

```ts
export interface Morphism
```

A class-to-predicate binding: pairs a packet `className` with the carrier `predicate` it identifies in the registry.

### `morphismRegistry` — function

```ts
export function morphismRegistry(morphisms: readonly Morphism[]): MorphismRegistry
```

A registry over an explicit class↔predicate vocabulary (e.g. RFC 7992's structural classes). Predicates not listed fall back to the slug default.

### `MorphismRegistry` — interface

```ts
export interface MorphismRegistry
```

The correspondence between carrier predicates and packet classes: maps a predicate to the class that identifies its morphism, and a class back to the predicate it identifies.

### `pack` — function

```ts
export function pack(dataform: ShpDataform, decl: PackDeclaration): ShpPacket
```

Projects a dataform into an ShpPacket: renders the HTML carrier via the declared morphism registry, derives the frontier from the dataform cell keys, and computes a deterministic content-address over the projection id, frontier, and html. Returns a frozen packet.

### `PackDeclaration` — interface

```ts
export interface PackDeclaration
```

The inputs to pack: the source carrier the packet projects, plus optional settlement evidence, projection evidence, projection morphism id, and morphism registry used to drive the HTML projection.

### `Profile` — interface

```ts
export interface Profile
```

An inhabitant profile: constrains an SHP packet to a concrete HTML shape and a structural-class vocabulary. `name` identifies the profile, `classes` is the structural class vocabulary recognized as morphism identities, and `lint` applies packet-safety plus profile constraints over an HTML packet.

### `project` — function

```ts
export function project(dataform: ShpDataform, morphisms: MorphismRegistry = defaultMorphisms()): string
```

Projects a settled `ShpDataform` into a finite HTML semantic-hypertext packet: validates the dataform and its subject, groups cells by entity into `<section class="subject">` blocks, renders each cell as a charged `<span>`, emits `<meta>` tags from metadata, and wraps everything in an `<article class="semantic-hypertext-packet">` document. Deterministic for a fixed dataform and morphism registry; returns the complete HTML string.

### `RFC7992_CLASSES` — variable

```ts
export const RFC7992_CLASSES
```

RFC 7992 structural classes — its <span class> morphism identities.

### `Rfc7992Class` — type-alias

```ts
export type Rfc7992Class = (typeof RFC7992_CLASSES)[number]
```

The union of RFC 7992 structural class names: one element of `RFC7992_CLASSES`.

### `rfc7992Profile` — variable

```ts
export const rfc7992Profile: Profile
```

The RFC 7992 inhabitant profile.

### `Section` — type-alias

```ts
export type Section = { affirmed?: readonly SectionEntry[]; denied?: readonly SectionEntry[]; contradicted?: readonly SectionEntry[]; }
```

A read grouped by stance: `affirmed`, `denied`, and `contradicted` lists of section entries, each list mapping to a charge value when normalized into cells.

### `SectionEntry` — type-alias

```ts
export type SectionEntry = ChargedCell | { predicate?: unknown; object?: unknown; citation?: unknown; affirmedBy?: unknown; deniedBy?: unknown; }
```

One entry within a section: either an already-built `ChargedCell`, or a raw record (predicate, optional object, and witness lists `citation`/`affirmedBy`/`deniedBy`) from which a charge is derived.

### `shp` — variable

```ts
export const shp
```

The SHP projection. `shp` is the historical name for `project`.

### `ShpCell` — type-alias

```ts
export type ShpCell = { subject: unknown; predicate: unknown; object?: unknown; }
```

A single subject-predicate-object claim: the triple before any charge is attached. `object` is optional, leaving a bare subject-predicate pair.

### `ShpDataform` — type-alias

```ts
export type ShpDataform = DataformOptions & { subject: unknown; cells: readonly ChargedCell[]; }
```

The normalized form the projector renders: a `subject`, its list of `ChargedCell`s, plus the optional `DataformOptions` settings.

### `ShpPacket` — interface

```ts
export interface ShpPacket
```

The SHP packet object: a finite, content-addressed projection witness. Declares the source carrier, the finite frontier (the cell keys settled), settlement and projection evidence, the projection morphism id, the HTML carrier, and a deterministic content-derived identity.

### `slug` — function

```ts
export function slug(value: unknown): string
```

A URL/id-safe slug derived from a value: trimmed, lowercased, non-alphanumeric runs collapsed to hyphens with leading/trailing hyphens stripped, falling back to "cell" when the result is empty.

### `unmark` — function

```ts
export function unmark(value: unknown): unknown
```

Unwraps a marked value: returns the inner `const` property when value is a non-null object carrying one, otherwise returns the value unchanged.

## `@emsenn/relationality/codecs/resource`

### `canonical` — function

```ts
export function canonical(value: JsonValue): string
```

Canonical serialization: object keys sorted, no insignificant whitespace.

### `Cell` — type-alias

```ts
export type Cell = { readonly subject: JsonValue; readonly predicate: JsonValue; readonly object: JsonValue }
```

A predication cell at the serialization boundary: entity × attribute × value.

### `cellToDatoms` — function

```ts
export function cellToDatoms(charged: ChargedCell): Datom[]
```

A charged cell → its datoms: one per present-side witness. The absent side is never a datom — you do not witness an absence; falsity is derived, not claimed.

### `ChargedCell` — type-alias

```ts
export type ChargedCell = { readonly cell: Cell; readonly charge: ChargeCarrier }
```

A cell with the charge derived from its witnesses — the carrier a datom document carries.

### `classifyResource` — const

```ts
export const classifyResource = (resource: Resource): Projector<ChargedCell> | null => …
```

Classify a resource to its most specific type in the lattice (null if none).

### `datom` — variable

```ts
export const datom
```

Restriction of `jsonl` to content whose lines are all datom-shaped: a carrier-bearing leaf that reads the document into charged cells (parsing datoms, then datomToCell) and writes charged cells back as serialized datoms.

### `Datom` — type-alias

```ts
export type Datom = readonly [entity: JsonValue, attribute: JsonValue, value: JsonValue, time: JsonValue]
```

A datom: `[entity, attribute, value, time]` — a cell witnessed at a time.

### `datomToCell` — function

```ts
export function datomToCell(d: Datom): ChargedCell
```

A datom → the cell it witnesses, charged with its witnessed potential. The value is derived from present-side evidence; nothing negative is admitted.

### `eavt` — variable

```ts
export const eavt
```

Restriction of `datom` to content whose datoms are sorted in eavt order: inherits the datom read and writes charged cells back as datoms sorted by eavtOrder.

### `eavtOrder` — function

```ts
export function eavtOrder(x: Datom, y: Datom): number
```

The E-A-V-T order: compare canonical-json keys component by component, e then a then v then t.

### `file` — variable

```ts
export const file
```

Restriction of `path` to resources that carry string `content`: a file. Recognize-only.

### `flatfile` — variable

```ts
export const flatfile
```

Restriction of `regularFile` to content containing no space character: a flatfile. Recognize-only.

### `isDatomShape` — function

```ts
export function isDatomShape(value: JsonValue): boolean
```

Whether a json value is shaped like a datom: a 4-tuple [entity, attribute, value, time].

### `isPathname` — const

```ts
export const isPathname = (value: unknown): value is string => …
```

Type guard recognizing a value as a POSIX pathname: true iff it is a string matching POSIX_PATHNAME_PATTERN.

### `json` — variable

```ts
export const json
```

Restriction of `flatfile` to json-bearing content: either the whole content parses as one json value, or every non-blank line parses as a json value. Recognize-only.

### `jsonl` — variable

```ts
export const jsonl
```

Restriction of `json` to content where every non-blank line parses as its own json value: json lines. Recognize-only.

### `JsonValue` — type-alias

```ts
export type JsonValue = | null | boolean | number | string | readonly JsonValue[] | { readonly [key: string]: JsonValue }
```

codecs/resource/json — JSON values, canonical (deterministic) serialization, and the jsonl line codec the record formats (datom, eavt) write through. Equal values → equal bytes (sorted keys, no insignificant whitespace).

### `markdown` — variable

```ts
export const markdown
```

Restriction of `flatfile` to paths with a ".md" or ".markdown" extension: a markdown file. Recognize-only.

### `nonBlankLines` — const

```ts
export const nonBlankLines = (content: string): string[] => …
```

The non-blank lines of a document.

### `parse` — const

```ts
export const parse = (content: string): Datom[] => …
```

Parse a datom document: jsonl lines, each narrowed to a datom.

### `parse` — const

```ts
export const parse = (text: string): JsonValue => …
```

Parse one JSON document.

### `parseLines` — const

```ts
export const parseLines = (content: string): JsonValue[] => …
```

Parse a jsonl document into its values: one json value per non-blank line.

### `path` — variable

```ts
export const path: Projector<ChargedCell>
```

The lattice root: a projector recognizing any resource whose `path` is a POSIX pathname. The most general node, recognize-only.

### `POSIX_PATHNAME_PATTERN` — variable

```ts
export const POSIX_PATHNAME_PATTERN
```

A POSIX pathname: non-empty, slash-separated, no NUL.

### `regularFile` — variable

```ts
export const regularFile
```

Restriction of `file` to paths that are not directories (do not end in "/"): a regular file. Recognize-only.

### `RESOURCE_LATTICE` — variable

```ts
export const RESOURCE_LATTICE: readonly Projector<ChargedCell>[]
```

The lattice as a catalog, for `classify`.

### `schema` — variable

```ts
export const schema
```

Restriction of `json` to paths whose basename ends in ".schema.json": a json schema file. Recognize-only.

### `serialize` — const

```ts
export const serialize = (datoms: readonly Datom[]): string => …
```

Serialize datoms to a datom document.

### `serializeLines` — const

```ts
export const serializeLines = (values: readonly JsonValue[]): string => …
```

Serialize values to a jsonl document: one canonical value per newline-terminated line.

### `toDatom` — function

```ts
export function toDatom(value: JsonValue): Datom
```

Narrow a json value to a datom. Throws if it is not a 4-tuple.

## `@emsenn/relationality/geometry`

### `acceptanceWindow` — const

```ts
export const acceptanceWindow = (lower: QuadraticRational, upper: QuadraticRational): AcceptanceWindow => …
```

Constructs a half-open acceptance window [lower, upper): throws if the bounds live in different quadratic fields or if lower is not strictly below upper.

### `AcceptanceWindow` — interface

```ts
export interface AcceptanceWindow
```

Half-open interval [lower, upper) in internal space.

### `AperiodicityJudgment` — type-alias

```ts
export type AperiodicityJudgment = AperiodicityWitness | AperiodicityObstruction
```

The result of attempting to refute a period: an AperiodicityWitness when a mismatch is found, otherwise an AperiodicityObstruction.

### `AperiodicityObstruction` — interface

```ts
export interface AperiodicityObstruction
```

The negative outcome of a period refutation: records the period that was not refuted over the sampled stretch of the gap word.

### `AperiodicityWitness` — interface

```ts
export interface AperiodicityWitness
```

The positive outcome of a period refutation: records the tested period and the index in the gap word where the word disagrees with itself shifted by that period.

### `causalCone` — function

```ts
export function causalCone(order: CausalOrderCarrier, apex: Cell): CausalConeJudgment
```

The cone at a cell: everything causally before and after it.

### `CausalConeCarrier` — interface

```ts
export interface CausalConeCarrier
```

The causal cone at an event: apex is that event, past holds the events causally before it, and future holds the events causally after it.

### `CausalConeJudgment` — type-alias

```ts
export type CausalConeJudgment = CausalConeCarrier | CausalConeObstruction
```

The result of causalCone: a cone carrier, or an obstruction when the apex cell never fired.

### `CausalConeObstruction` — interface

```ts
export interface CausalConeObstruction
```

A cell supplied as a cone apex that never fired and so is not an event: missing names that cell.

### `causalOrder` — function

```ts
export function causalOrder(settling: SettlingCarrier): CausalOrderCarrier
```

The causal order: transitive closure of stage-increasing term adjacency over the firing events.

### `CausalOrderCarrier` — interface

```ts
export interface CausalOrderCarrier
```

The causal order over a settling's firing events: events is the indexed event list, and precedes[i] holds the indices strictly causally after event i (the transitive closure of stage-increasing term adjacency).

### `causalSeparation` — function

```ts
export function causalSeparation(order: CausalOrderCarrier, left: Cell, right: Cell): CausalSeparation
```

Separation of two cells under the causal order. A cell that never fired is not an event — that is an obstruction, not a spacelike claim.

### `CausalSeparation` — type-alias

```ts
export type CausalSeparation = TimelikeSeparation | SpacelikeSeparation | CausalSeparationObstruction
```

The result of causalSeparation: a timelike separation, a spacelike separation, or an obstruction when a cell never fired.

### `CausalSeparationObstruction` — interface

```ts
export interface CausalSeparationObstruction
```

A cell supplied to causalSeparation that never fired and so is not an event: missing names that cell. Distinct from a spacelike claim.

### `cutProjectScheme` — const

```ts
export const cutProjectScheme = (slope: QuadraticRational): CutProjectScheme => …
```

Constructs a cut-and-project scheme from a slope: throws if the slope is rational, since a rational cut is periodic rather than aperiodic.

### `CutProjectScheme` — interface

```ts
export interface CutProjectScheme
```

A one-dimensional cut-and-project scheme: an irrational quadratic slope from which physical and internal projections of lattice sites are derived.

### `FiringEvent` — interface

```ts
export interface FiringEvent
```

A cell paired with the stage at which it first fired: cell is the predication cell, stageIndex is the zero-based settling stage of its first firing.

### `firingEvents` — function

```ts
export function firingEvents(settling: SettlingCarrier): readonly FiringEvent[]
```

Each designated cell paired with the index of the stage at which it first fires — the event list of the settling.

### `gapSpectrum` — function

```ts
export function gapSpectrum(carrier: ModelSetCarrier): GapSpectrumCarrier
```

Successive gaps of the model set, read as a word over the distinct gap lengths (ascending; `word[i]` indexes `distinct`). The size of the spectrum is structural content: an interval window yields finitely many distinct gaps, and how many is a theorem about the scheme, not a choice.

### `GapSpectrumCarrier` — interface

```ts
export interface GapSpectrumCarrier
```

The gap structure of a model set: the successive gaps, the distinct gap lengths in ascending order, and the word over those distinct lengths recording the gap sequence.

### `internalProjection` — const

```ts
export const internalProjection = (scheme: CutProjectScheme, site: LatticeSite): QuadraticRational => …
```

Internal space: (m, n) ↦ m + nᾱ, the conjugate of the cut. Conjugation fixes ℚ, so this is exactly the conjugate of the physical projection.

### `latticeSite` — const

```ts
export const latticeSite = (unit: number, slopeCount: number): LatticeSite => …
```

Constructs a lattice site from integer coordinates unit and slopeCount, converting each to an Integer.

### `LatticeSite` — interface

```ts
export interface LatticeSite
```

A site of the integer lattice ℤ²: integer coordinates (unit, slopeCount) standing for m + nα where m is unit and n is slopeCount.

### `modelSet` — function

```ts
export function modelSet(scheme: CutProjectScheme, window: AcceptanceWindow, radius: number): ModelSetCarrier
```

All sites with |coordinates| ≤ radius the window admits, ordered by physical coordinate. The radius is an honest finite horizon on the lattice, not on the window — gaps near the physical extremes can be horizon artifacts; restrict before reading them.

### `ModelSetCarrier` — interface

```ts
export interface ModelSetCarrier
```

A model set: the scheme, the window, and the accepted acceptance witnesses ordered by physical coordinate.

### `orderingFraction` — function

```ts
export function orderingFraction(order: CausalOrderCarrier): OrderingFractionJudgment
```

Comparable pairs over all pairs, exactly. Fewer than two events cannot present a fraction. What dimension a fraction corresponds to is a correspondence question at a locus, deliberately not computed here.

### `OrderingFractionCarrier` — interface

```ts
export interface OrderingFractionCarrier
```

The ordering fraction over a causal order: comparablePairs is the count of causally ordered event pairs, totalPairs is the count of all event pairs, and fraction is their exact rational quotient.

### `OrderingFractionJudgment` — type-alias

```ts
export type OrderingFractionJudgment = OrderingFractionCarrier | OrderingFractionObstruction
```

The result of orderingFraction: a fraction carrier, or an obstruction when there are fewer than two events.

### `OrderingFractionObstruction` — interface

```ts
export interface OrderingFractionObstruction
```

Fewer than two events, so no fraction can be presented: eventCount is the number of events available.

### `physicalProjection` — const

```ts
export const physicalProjection = (scheme: CutProjectScheme, site: LatticeSite): QuadraticRational => …
```

The cut: (m, n) ↦ m + nα.

### `quadraticAdd` — const

```ts
export const quadraticAdd = (left: QuadraticRational, right: QuadraticRational): QuadraticRational => …
```

Adds two QuadraticRationals componentwise over a shared radicand: throws if the radicands differ.

### `quadraticAddRational` — const

```ts
export const quadraticAddRational = (value: QuadraticRational, scalar: Rational): QuadraticRational => …
```

value + q for rational q, staying in value's field.

### `quadraticCompare` — const

```ts
export const quadraticCompare = (left: QuadraticRational, right: QuadraticRational): -1 | 0 | 1 => …
```

Exact three-way comparison of two QuadraticRationals, returning -1, 0, or 1 as the left is less than, equal to, or greater than the right: computed as the sign of their difference.

### `quadraticConjugate` — const

```ts
export const quadraticConjugate = (value: QuadraticRational): QuadraticRational => …
```

Galois conjugation √d ↦ −√d — the physical/internal swap.

### `quadraticEqual` — const

```ts
export const quadraticEqual = (left: QuadraticRational, right: QuadraticRational): boolean => …
```

Tests exact equality of two QuadraticRationals: true when they share a radicand and both unit and root coefficients are equal.

### `quadraticFromInts` — const

```ts
export const quadraticFromInts = (radicand: number, unit: number, root: number): QuadraticRational => …
```

Constructs a QuadraticRational from integer unit and root coefficients over the given radicand: a convenience wrapper that lifts the integers to rationals.

### `quadraticFromRational` — const

```ts
export const quadraticFromRational = (radicand: number, value: Rational): QuadraticRational => …
```

Lifts a plain rational into Q(sqrt(radicand)) as its unit part with a zero root coefficient: the embedding of Q into the quadratic field.

### `quadraticIsRational` — const

```ts
export const quadraticIsRational = (value: QuadraticRational): boolean => …
```

Tests whether a QuadraticRational is a plain rational, i.e. its root coefficient is zero.

### `quadraticLeq` — const

```ts
export const quadraticLeq = (left: QuadraticRational, right: QuadraticRational): boolean => …
```

Tests whether the left QuadraticRational is less than or equal to the right.

### `quadraticLess` — const

```ts
export const quadraticLess = (left: QuadraticRational, right: QuadraticRational): boolean => …
```

Tests whether the left QuadraticRational is strictly less than the right.

### `quadraticMultiply` — const

```ts
export const quadraticMultiply = (left: QuadraticRational, right: QuadraticRational): QuadraticRational => …
```

(a + b√d)(c + e√d) = (ac + bed) + (ae + bc)√d.

### `quadraticNegate` — const

```ts
export const quadraticNegate = (value: QuadraticRational): QuadraticRational => …
```

Negates a QuadraticRational by negating both its unit and root coefficients.

### `quadraticRational` — const

```ts
export const quadraticRational = (radicand: number, unit: Rational, root: Rational): QuadraticRational => …
```

Constructs a QuadraticRational from a radicand and rational unit/root coefficients: throws if the radicand is not a nonsquare integer in [2, MAX_RADICAND]. Returns a frozen element of Q(sqrt(radicand)).

### `QuadraticRational` — interface

```ts
export interface QuadraticRational
```

An element of a real quadratic field Q(sqrt(d)): `unit` and `root` are exact rational coefficients of 1 and sqrt(d), and `radicand` is the nonsquare integer d labelling which field the element lives in.

### `quadraticScale` — const

```ts
export const quadraticScale = (value: QuadraticRational, scalar: Rational): QuadraticRational => …
```

Scales a QuadraticRational by a plain rational, multiplying both unit and root coefficients: the field's scalar multiplication by Q.

### `quadraticSign` — const

```ts
export const quadraticSign = (value: QuadraticRational): -1 | 0 | 1 => …
```

Exact sign of t + s√d. Mixed-sign cases are decided by t² − ds², which cannot vanish away from zero because √d is irrational.

### `quadraticSubtract` — const

```ts
export const quadraticSubtract = (left: QuadraticRational, right: QuadraticRational): QuadraticRational => …
```

Subtracts the right QuadraticRational from the left componentwise over a shared radicand: throws if the radicands differ.

### `quadraticToNumber` — const

```ts
export const quadraticToNumber = (value: QuadraticRational): number => …
```

Boundary read only — exactness ends here.

### `refutePeriod` — function

```ts
export function refutePeriod(spectrum: GapSpectrumCarrier, period: number): AperiodicityJudgment
```

Witnesses that the gap word is not periodic with the given period over the sampled stretch — a finite, honest read: it refutes one period, it does not prove global aperiodicity.

### `restrictModelSet` — function

```ts
export function restrictModelSet( carrier: ModelSetCarrier, lower: QuadraticRational, upper: QuadraticRational, ): ModelSetCarrier
```

The model set restricted to physical coordinates in [lower, upper] — the interior read that discards horizon artifacts.

### `sameRadicand` — const

```ts
export const sameRadicand = (left: QuadraticRational, right: QuadraticRational): boolean => …
```

Tests whether two QuadraticRationals share the same radicand, i.e. live in the same field Q(sqrt(d)).

### `SpacelikeSeparation` — interface

```ts
export interface SpacelikeSeparation
```

Two events the causal order does not relate in either direction: left and right are unordered. One outcome of causalSeparation.

### `TimelikeSeparation` — interface

```ts
export interface TimelikeSeparation
```

Two events ordered by the causal order: earlier strictly precedes later. One outcome of causalSeparation.

### `translateSite` — const

```ts
export const translateSite = (site: LatticeSite, unit: number, slopeCount: number): LatticeSite => …
```

Translates a lattice site by adding the integer offsets unit and slopeCount to its respective coordinates, returning a new site.

### `windowAcceptance` — function

```ts
export function windowAcceptance( scheme: CutProjectScheme, site: LatticeSite, window: AcceptanceWindow, ): WindowAcceptanceJudgment
```

Judges whether a site is accepted by a window: returns a witness when the site's internal projection falls in [lower, upper), otherwise an obstruction; throws if scheme and window live in different fields.

### `WindowAcceptanceJudgment` — type-alias

```ts
export type WindowAcceptanceJudgment = WindowAcceptanceWitness | WindowAcceptanceObstruction
```

The result of testing a site against a window: either a WindowAcceptanceWitness when the internal projection lies in the window or a WindowAcceptanceObstruction when it does not.

### `WindowAcceptanceObstruction` — interface

```ts
export interface WindowAcceptanceObstruction
```

The negative outcome of a window acceptance judgment: records the rejected site, its internal projection, and the window that excluded it.

### `WindowAcceptanceWitness` — interface

```ts
export interface WindowAcceptanceWitness
```

The positive outcome of a window acceptance judgment: records the accepted site together with its physical and internal projections.

## `@emsenn/relationality/holography`

### `classify` — function

```ts
export function classify<T>(resource: Resource, catalog: readonly Projector<T>[]): Projector<T> | null
```

Derive a resource's most specific type: the deepest projector in the catalog that recognizes it (null if none).

### `define` — function

```ts
export function define<T>(spec: RootSpec<T>): Projector<T>
```

Define a root projector (no parent).

### `entails` — function

```ts
export function entails<T>(projector: Projector<T>): Projector<T>[]
```

The entailment chain of a projector: itself, then everything it restricts, root last.

### `Projector` — interface

```ts
export interface Projector<T>
```

A holographic projector — a node in the restriction lattice, defined by its morphisms, carrying items of type `T`.

### `Resource` — interface

```ts
export interface Resource
```

A boundary resource presented to a projector: its address and its content.

### `restrict` — function

```ts
export function restrict<T>(parent: Projector<T>, spec: RestrictSpec<T>): Projector<T>
```

Restrict a parent into a child: recognition is conjoined (child ⊢ parent); read/write inherit unless overridden.

### `RestrictSpec` — interface

```ts
export interface RestrictSpec<T>
```

A restriction spec: the ADDED constraint and any overridden morphisms; the parent's are implied.

### `RootSpec` — interface

```ts
export interface RootSpec<T>
```

The root spec: the most general type, recognized on its own terms.

## `@emsenn/relationality/logic`

### `atomicPredicateWords` — function

```ts
export function atomicPredicateWords(input: PredicateWordCarrier): PredicateWordCarrier
```

Filters a predicate word carrier down to its atomic arrows, those whose word has length one.

### `cellOf` — const

```ts
export const cellOf = (subject: PredicationTerm, predicate: PredicationPredicate, object: PredicationTerm): Cell => …
```

Builds a predication cell from a subject term, predicate, and object term.

### `chargeConsistency` — function

```ts
export function chargeConsistency(value: ChargeValue): ChargeConsistencyJudgment
```

Checks whether a charge value is consistent: returns a witness when its truth and falsity sides are not both present, otherwise an obstruction.

### `ChargeConsistencyJudgment` — type-alias

```ts
export type ChargeConsistencyJudgment = ChargeConsistencyWitness | ChargeConsistencyObstruction
```

The result of a charge-consistency check: either a ChargeConsistencyWitness or a ChargeConsistencyObstruction.

### `ChargeConsistencyObstruction` — interface

```ts
export interface ChargeConsistencyObstruction
```

The negative judgment that a charge value is inconsistent: carries the value whose truth and falsity sides are both present.

### `ChargeConsistencyWitness` — interface

```ts
export interface ChargeConsistencyWitness
```

The positive judgment that a charge value is consistent: carries the value whose truth and falsity sides are not both present.

### `composeInferenceRules` — function

```ts
export function composeInferenceRules(rules: readonly InferenceRule[]): readonly InferenceRule[]
```

Closes a set of inference rules under one round of composition: appends each composite of two rules whose codomain meets the next rule's domain, skipping composites with a domain/codomain pair already present.

### `composePredicateWordPotential` — function

```ts
export function composePredicateWordPotential(input: PredicateWordPotential): PredicateWordPotential
```

Composes the arrows of a predicate word potential and returns the composed arrows as a new potential.

### `composePredicateWords` — function

```ts
export function composePredicateWords(input: PredicateWordCarrier): PredicateWordCarrier
```

Closes a predicate word carrier under composition: appends the concatenated word arrow for each ordered pair whose left object coincides with the right subject, skipping duplicates.

### `consistentChargeValues` — const

```ts
export const consistentChargeValues = (): readonly ChargeValue[] => …
```

The frozen list of charge values treated as consistent for the linear logic: "absurd", "potential", and "active".

### `converseInferenceMorphism` — const

```ts
export const converseInferenceMorphism = (): ConverseInferenceMorphism => …
```

Constructs a frozen converse inference morphism.

### `ConverseInferenceMorphism` — interface

```ts
export interface ConverseInferenceMorphism
```

An inference morphism that swaps the subject and object of a predication cell: tagged with kind "typedTheory.inferenceMorphism.converse".

### `Derivation` — interface

```ts
export interface Derivation
```

A derivation within a theory from a premise base object to a conclusion: carries the ordered steps and their count as length.

### `DerivationCheckJudgment` — type-alias

```ts
export type DerivationCheckJudgment = DerivationCheckWitness | DerivationObstruction
```

The result of checking a derivation against a theory: either a validity witness or a derivation obstruction.

### `DerivationCheckWitness` — interface

```ts
export interface DerivationCheckWitness
```

A witness that a derivation is valid against a theory: carries the theory and the checked derivation.

### `derivationClosure` — function

```ts
export function derivationClosure(theory: TypedTheoryCarrier): DerivationClosure
```

Computes the composition closure of a theory's rules by iterating composition to a fixed point: returns the closed theory, the generated rule set with its rank, and the residual rules absent from the original theory with their rank.

### `DerivationClosure` — interface

```ts
export interface DerivationClosure
```

The composition closure of a theory's inference rules: carries the generated rule set with its rank and the residual rules not present in the original theory with their rank.

### `derivationIdentity` — function

```ts
export function derivationIdentity(left: Derivation, right: Derivation): DerivationIdentityJudgment
```

Compares two derivations, returning a witness when their premises, conclusions, and step-by-step rules and conclusions coincide and an obstruction otherwise.

### `DerivationIdentityJudgment` — type-alias

```ts
export type DerivationIdentityJudgment = DerivationIdentityWitness | DerivationIdentityObstruction
```

The result of comparing two derivations for identity: either a witness of coincidence or an obstruction.

### `DerivationIdentityObstruction` — interface

```ts
export interface DerivationIdentityObstruction
```

An obstruction recording that two derivations differ: carries the left and right derivations compared.

### `DerivationIdentityWitness` — interface

```ts
export interface DerivationIdentityWitness
```

A witness that two derivations coincide: carries the left and right derivations compared.

### `DerivationObstruction` — interface

```ts
export interface DerivationObstruction
```

An obstruction recording that a derivation step is not justified by the theory: carries the base object at which checking failed and the offending step.

### `DerivationSearchJudgment` — type-alias

```ts
export type DerivationSearchJudgment = DerivationSearchWitness | DerivationSearchObstruction
```

The outcome of a derivation search: either a witness carrying a found derivation or an obstruction over the explored frontier.

### `DerivationSearchObstruction` — interface

```ts
export interface DerivationSearchObstruction
```

An obstruction recording that no derivation from premise to conclusion was found: carries the base objects explored and their count as rank.

### `DerivationSearchWitness` — interface

```ts
export interface DerivationSearchWitness
```

A witness that a search found a derivation from premise to conclusion in a theory: carries that derivation.

### `DerivationStep` — interface

```ts
export interface DerivationStep
```

A single step in a derivation: applies one inference rule to a premise base object to reach a conclusion base object.

### `derivationValidity` — function

```ts
export function derivationValidity(theory: TypedTheoryCarrier, derivation: Derivation): DerivationCheckJudgment
```

Checks that each step of a derivation is justified by a theory rule whose domain, codomain, and trace match the running base object and step: returns a check witness on success, or a derivation obstruction at the first unjustified step.

### `derive` — function

```ts
export function derive(theory: TypedTheoryCarrier, premise: PredicationBaseObject, conclusion: PredicationBaseObject): DerivationSearchJudgment
```

Searches a theory for a derivation from premise to conclusion via breadth-first application of inference rules: returns a search witness with the found derivation, or an obstruction listing the base objects explored.

### `deriveInBase` — function

```ts
export function deriveInBase(base: BaseCategory, premise: PredicationBaseObject, conclusion: PredicationBaseObject): DerivationSearchJudgment
```

Searches for a derivation from premise to conclusion in the theory built from a base category.

### `InferenceMorphism` — type-alias

```ts
export type InferenceMorphism = | SpecializationInferenceMorphism | ConverseInferenceMorphism | SubjectProjectionInferenceMorphism | ObjectProjectionInferenceMorphism
```

The discriminated union of inference morphism kinds: specialization, converse, subject projection, and object projection.

### `inferenceMorphismIdentity` — function

```ts
export function inferenceMorphismIdentity(left: InferenceMorphism, right: InferenceMorphism): InferenceMorphismIdentityJudgment
```

Compares two inference morphisms, returning a witness when they share the same kind and an obstruction otherwise.

### `InferenceMorphismIdentityJudgment` — type-alias

```ts
export type InferenceMorphismIdentityJudgment = InferenceMorphismIdentityWitness | InferenceMorphismIdentityObstruction
```

The result of comparing two inference morphisms for identity: either a witness of coincidence or an obstruction.

### `InferenceMorphismIdentityObstruction` — interface

```ts
export interface InferenceMorphismIdentityObstruction
```

An obstruction recording that two inference morphisms differ: carries the left and right morphisms compared.

### `InferenceMorphismIdentityWitness` — interface

```ts
export interface InferenceMorphismIdentityWitness
```

A witness that two inference morphisms coincide: carries the left and right morphisms compared.

### `InferenceRule` — interface

```ts
export interface InferenceRule
```

An inference rule mapping a domain predication base object to a codomain via a trace of inference morphisms.

### `inferenceRuleIdentity` — function

```ts
export function inferenceRuleIdentity(left: InferenceRule, right: InferenceRule): InferenceRuleIdentityJudgment
```

Compares two inference rules, returning a witness when their domains, codomains, and traces coincide and an obstruction otherwise.

### `InferenceRuleIdentityJudgment` — type-alias

```ts
export type InferenceRuleIdentityJudgment = InferenceRuleIdentityWitness | InferenceRuleIdentityObstruction
```

The result of comparing two inference rules for identity: either a witness of coincidence or an obstruction.

### `InferenceRuleIdentityObstruction` — interface

```ts
export interface InferenceRuleIdentityObstruction
```

An obstruction recording that two inference rules differ: carries the left and right rules compared.

### `InferenceRuleIdentityWitness` — interface

```ts
export interface InferenceRuleIdentityWitness
```

A witness that two inference rules coincide: carries the left and right rules compared.

### `inferenceRules` — function

```ts
export function inferenceRules(witnesses: readonly PredicationDatum[]): readonly InferenceRule[]
```

Derives inference rules from predication data: each specialization morphism yields one specialization rule, and each cell yields converse, subject projection, and object projection rules.

### `inferenceTrace` — function

```ts
export function inferenceTrace(morphisms: readonly InferenceMorphism[]): InferenceTraceCarrier
```

Builds a frozen inference trace carrier from a sequence of inference morphisms.

### `InferenceTraceCarrier` — interface

```ts
export interface InferenceTraceCarrier
```

A trace of inference morphisms composed in order: the morphisms field holds the sequence applied to derive a rule.

### `linearFusionValue` — function

```ts
export function linearFusionValue(left: ChargeValue, right: ChargeValue): ChargeValue
```

The multiplicative conjunction (tensor) of two charge values: combines their truth/falsity coordinates by side product and implication to yield the fused charge value.

### `linearMultiplicativeUnit` — const

```ts
export const linearMultiplicativeUnit = (): ChargeValue => …
```

The multiplicative unit of the linear logic over charge values: the "stable" charge value.

### `linearNegationValue` — function

```ts
export function linearNegationValue(value: ChargeValue): ChargeValue
```

The linear negation of a charge value: the residuum of the value against the multiplicative unit.

### `linearParValue` — function

```ts
export function linearParValue(left: ChargeValue, right: ChargeValue): ChargeValue
```

The multiplicative disjunction (par) of two charge values: the De Morgan dual of fusion, computed as the negation of the fusion of the negated operands.

### `linearResiduumValue` — function

```ts
export function linearResiduumValue(left: ChargeValue, right: ChargeValue): ChargeValue
```

The linear implication (residuum) of two charge values: combines left and right coordinates by side implication and product to yield the residual charge value.

### `objectProjectionInferenceMorphism` — const

```ts
export const objectProjectionInferenceMorphism = (): ObjectProjectionInferenceMorphism => …
```

Constructs a frozen object projection inference morphism.

### `ObjectProjectionInferenceMorphism` — interface

```ts
export interface ObjectProjectionInferenceMorphism
```

An inference morphism that projects a predication cell onto its object term: tagged with kind "typedTheory.inferenceMorphism.objectProjection".

### `PredicateWord` — type-alias

```ts
export type PredicateWord = readonly PredicationPredicate[]
```

A predicate word: an ordered sequence of predication predicates, modeling the composition of predicates along a path.

### `predicateWordArrow` — function

```ts
export function predicateWordArrow(subject: PredicationTerm, predicate: PredicationPredicate, object: PredicationTerm): PredicateWordArrow
```

Builds a predicate word arrow from a subject term to an object term whose word is the single given predicate.

### `PredicateWordArrow` — interface

```ts
export interface PredicateWordArrow
```

An arrow from a subject term to an object term labeled by a predicate word: the word records the predicates composed along the arrow.

### `PredicateWordCarrier` — interface

```ts
export interface PredicateWordCarrier
```

A collection of predicate word arrows.

### `PredicateWordPotential` — interface

```ts
export interface PredicateWordPotential
```

A potential set of predicate word arrows pending composition: carries the candidate arrows in its potential field.

### `predicateWordResidue` — function

```ts
export function predicateWordResidue(input: { readonly arrows: readonly PredicateWordArrow[] }): PredicateWordResidue
```

Computes the predicate word residue of a set of arrows: saturates them under composition, extracts the atomic arrows, and lists the composite words of length greater than one.

### `PredicateWordResidue` — interface

```ts
export interface PredicateWordResidue
```

The residue of composing predicate words: carries the composition-saturated carrier, the atomic (length-one) arrows it contains, and the composite predicate words of length greater than one.

### `specializationInferenceMorphism` — const

```ts
export const specializationInferenceMorphism = (): SpecializationInferenceMorphism => …
```

Constructs a frozen specialization inference morphism.

### `SpecializationInferenceMorphism` — interface

```ts
export interface SpecializationInferenceMorphism
```

An inference morphism that specializes a predication base object along a specialization edge: tagged with kind "typedTheory.inferenceMorphism.specialization".

### `subjectProjectionInferenceMorphism` — const

```ts
export const subjectProjectionInferenceMorphism = (): SubjectProjectionInferenceMorphism => …
```

Constructs a frozen subject projection inference morphism.

### `SubjectProjectionInferenceMorphism` — interface

```ts
export interface SubjectProjectionInferenceMorphism
```

An inference morphism that projects a predication cell onto its subject term: tagged with kind "typedTheory.inferenceMorphism.subjectProjection".

### `theoryOfBase` — function

```ts
export function theoryOfBase(base: BaseCategory): TypedTheoryCarrier
```

Builds a typed theory from a base category: its objects become the theory's objects and its specialization, converse, subject projection, and object projection edges become inference rules.

### `theoryOfData` — function

```ts
export function theoryOfData(data: readonly PredicationDatum[]): TypedTheoryCarrier
```

Builds a typed theory from predication data: derives the inference rules and collects the distinct domain and codomain base objects they reference as the theory's objects.

### `truthOrderResiduation` — function

```ts
export function truthOrderResiduation(left: ChargeValue, right: ChargeValue, bound: ChargeValue): TruthOrderResiduationJudgment
```

Checks the fusion/residuation adjunction at left, right, and bound in the truth order: returns a witness when "left fused with right is below bound" agrees with "left is below the residuum of right and bound", otherwise an obstruction, carrying the computed fusionBound and residualBound either way.

### `TruthOrderResiduationJudgment` — type-alias

```ts
export type TruthOrderResiduationJudgment = TruthOrderResiduationWitness | TruthOrderResiduationObstruction
```

The result of a truth-order residuation check: either a TruthOrderResiduationWitness or a TruthOrderResiduationObstruction.

### `TruthOrderResiduationObstruction` — interface

```ts
export interface TruthOrderResiduationObstruction
```

The negative judgment that fusion and residuation fail to be adjoint at the given left, right, and bound: records the inputs together with the computed fusionBound and residualBound.

### `TruthOrderResiduationWitness` — interface

```ts
export interface TruthOrderResiduationWitness
```

The positive judgment that fusion and residuation are adjoint at the given left, right, and bound: records the inputs together with the computed fusionBound and residualBound.

### `TypedTheoryCarrier` — interface

```ts
export interface TypedTheoryCarrier
```

A typed theory: a collection of predication base objects together with the inference rules generating arrows between them.

### `typedTheoryProofCarrier` — function

```ts
export function typedTheoryProofCarrier(theory: TypedTheoryCarrier): TypedTheoryProofCarrier
```

Builds a proof carrier for a theory: takes its derivation closure, computes a typing judgment for every generated rule, and collects those judgments, the obstruction subset, and the judgment count as rank.

### `TypedTheoryProofCarrier` — interface

```ts
export interface TypedTheoryProofCarrier
```

A proof carrier for a typed theory: pairs the theory and its derivation closure with the typing judgments for every generated rule, the subset that are obstructions, and the judgment count as rank.

### `typing` — function

```ts
export function typing(theory: TypedTheoryCarrier, premise: PredicationBaseObject, conclusion: PredicationBaseObject): TypingJudgment
```

Judges whether a conclusion is derivable from a premise in a theory: returns a typing witness carrying the derivation on success, or a typing obstruction wrapping the failed search.

### `TypingJudgment` — type-alias

```ts
export type TypingJudgment = TypingJudgmentWitness | TypingJudgmentObstruction
```

The result of asking whether a conclusion is derivable from a premise in a theory: either a typing witness or an obstruction.

### `TypingJudgmentObstruction` — interface

```ts
export interface TypingJudgmentObstruction
```

An obstruction recording that a conclusion is not derivable from a premise in a theory: carries the underlying derivation search obstruction.

### `TypingJudgmentWitness` — interface

```ts
export interface TypingJudgmentWitness
```

A witness that a conclusion is derivable from a premise in a theory: carries the deriving derivation.

## `@emsenn/relationality/topology`

### `abelianize` — function

```ts
export function abelianize(rule: SubstitutionRule, alphabet: readonly SubstitutionSymbol[]): SubstitutionIncidenceMatrix
```

Computes the incidence matrix of a substitution over an alphabet: entry (target, source) counts occurrences of the target letter in the source letter's rule image.

### `AboveRankComparison` — interface

```ts
export interface AboveRankComparison
```

Comparison recording that the left rank is strictly greater than the right: carries both ranks under the rankComparison.above kind.

### `absurdFiringType` — const

```ts
export const absurdFiringType = (): AbsurdFiringTypeCarrier => …
```

Constructs a frozen absurd firing-type carrier.

### `AbsurdFiringTypeCarrier` — interface

```ts
export interface AbsurdFiringTypeCarrier
```

Carrier marking a firing whose truth and falsity sides are both absent: the absurd firing type.

### `allCells` — function

```ts
export function allCells(entities: EntitySet<PredicationTerm>): readonly PredicateFiberCell[]
```

The full grid of predicate fiber cells over an entity set: every ordered subject/object pair drawn from the entities.

### `aperiodicClosureRegime` — const

```ts
export const aperiodicClosureRegime = (): AperiodicClosureRegime => …
```

Constructs the aperiodic closure regime value.

### `AperiodicClosureRegime` — interface

```ts
export interface AperiodicClosureRegime
```

The aperiodic closure regime: the closure does not stabilize within any countable bound, entering only as declared cofinality.

### `BelowRankComparison` — interface

```ts
export interface BelowRankComparison
```

Comparison recording that the left rank is strictly less than the right: carries both ranks under the rankComparison.below kind.

### `BoundName` — type-alias

```ts
export type BoundName = "least" | "greatest"
```

The two extremal bounds of a fixed-point computation: "least" for the least fixed point and "greatest" for the greatest.

### `chargeAt` — function

```ts
export function chargeAt(valuation: Valuation, cell: Cell): ChargeCarrier
```

The charge carrier a valuation assigns to a cell: the charge of the first matching assignment across its fibers, or bottom when none coincides.

### `chargeAtValues` — function

```ts
export function chargeAtValues(section: SectionCarrier, subject: TermInput, predicate: TermInput, object?: TermInput): ChargeCarrier
```

Absence is data, never a throw: an unmatched cell reads the `absurd` charge.

### `charPolyOver` — const

```ts
export const charPolyOver = (matrix: Matrix): readonly Integer[] => …
```

Returns the characteristic polynomial of a matrix as its coefficient list.

### `classifyFiring` — function

```ts
export function classifyFiring(value: ChargeValue): FiringTypeCarrier
```

Classifies a charge value as stable, truth-only, falsity-only, or absurd by which of its truth and falsity sides are present.

### `classifyFiringOrbit` — function

```ts
export function classifyFiringOrbit(values: readonly ChargeValue[]): FiringOrbitClassification
```

Classifies the firing orbit of a list of charge values: self-dual singleton when no one-sided firings are present, a pair (truth-only, falsity-only, or exchange-mixed) when no stable or absurd firings are present, otherwise a mixed orbit of variable cardinality; carries the multiplicities, self-duality judgment, and negated values.

### `classifySettling` — function

```ts
export function classifySettling(carrier: SettlingCarrier): SettlingClassification
```

The sole mint site of the aperiodic regime. Aperiodicity (κ ≥ ω₁) is only ever declared into the system through the carrier's cofinality witness — same epistemic standing as an attestation; bounded iteration can witness only the stabilizing regimes, and its exhaustion is an obstruction.

### `closeOrdinalProcess` — function

```ts
export function closeOrdinalProcess<T>(process: ClosureProcessCarrier<T>): ClosureCarrier<T>
```

Runs the bounded stabilization search over a process: iterates the finite block recording the orbit, then probes each search block, returning a closure carrier whose search is a witness if it stabilizes within the horizon or an obstruction if it does not.

### `closePredicationValuationClosure` — function

```ts
export function closePredicationValuationClosure(process: PredicationValuationClosureProcessCarrier): PredicationValuationClosureCarrier
```

Closes a valuation closure process: runs the ordinal process to its fixed point and packages the process, the closure carrier, and the sheaf built from the fixed-point valuation.

### `closureApproximant` — const

```ts
export const closureApproximant = <T>(process: ClosureProcessCarrier<T>, ordinal: Ordinal): T => …
```

Computes the closure approximant of a process at an ordinal stage: bottom at zero, the endomorphism applied at a successor, and the lattice supremum of the fundamental sequence at a limit.

### `ClosureCarrier` — interface

```ts
export interface ClosureCarrier<T>
```

The regime judgment lives on `search`: a witness carries its stabilizing regime; an obstruction carries no regime claim at all — exhausting the bounded horizon witnesses nothing about κ beyond `searchedThrough`.

### `closureOrbitOfProcess` — function

```ts
export function* closureOrbitOfProcess<T>(process: ClosureProcessCarrier<T>): Generator<ClosureOrbitPoint<T>>
```

Generates the closure orbit of a process: the infinite sequence of orbit points obtained by iterating the endomorphism from bottom, stage by stage.

### `ClosureOrbitPoint` — interface

```ts
export interface ClosureOrbitPoint<T>
```

A point on the closure orbit: the ordinal stage paired with the approximant value reached at that stage.

### `closureProcess` — const

```ts
export const closureProcess = <T>(lattice: Lattice<T>, endomorphism: (value: T) => T, horizon: ClosureStabilizationSearchHorizon = closureStabilizationSearchHorizon(fromCount(64), fromCount(4))): ClosureProcessCarrier<T> => …
```

Constructs a closure process from a lattice and an endomorphism, defaulting the horizon to 64 finite stages over 4 limit blocks.

### `ClosureProcessCarrier` — interface

```ts
export interface ClosureProcessCarrier<T>
```

A closure process: a lattice, a monotone endomorphism over it, and the search horizon bounding the stabilization search.

### `ClosureRegime` — type-alias

```ts
export type ClosureRegime = StabilizingClosureRegime | AperiodicClosureRegime
```

A closure regime: either a stabilizing regime (finite, Scott, transfinite) or the aperiodic regime.

### `closureRegimeOfOrdinal` — function

```ts
export function closureRegimeOfOrdinal(ordinal: Ordinal): StabilizingClosureRegime
```

Classifies the stabilizing regime of an ordinal: finite for a finite ordinal, Scott for a limit whose fundamental sequence is finite, otherwise transfinite.

### `closureSearchBlock` — const

```ts
export const closureSearchBlock = (base: Ordinal, finiteStages: Natural): ClosureSearchBlock => …
```

Constructs a search block from a base ordinal and a count of finite stages to probe above it.

### `ClosureSearchBlock` — interface

```ts
export interface ClosureSearchBlock
```

One block of the stabilization search: a base ordinal and the count of finite stages to probe above it.

### `closureSearchBlocks` — function

```ts
export function closureSearchBlocks(horizon: ClosureStabilizationSearchHorizon): readonly ClosureSearchBlock[]
```

Builds the ordered search blocks for a horizon: a finite block based at zero, then one block based at each omega multiple up to the limit-block count.

### `closureStabilizationAt` — function

```ts
export function closureStabilizationAt<T>( process: ClosureProcessCarrier<T>, ordinal: Ordinal, ): ClosureStabilizationJudgment<T>
```

Tests whether a process stabilizes at an ordinal: compares the approximant there to its successor approximant, returning a stabilization witness when equal and an obstruction otherwise.

### `ClosureStabilizationJudgment` — type-alias

```ts
export type ClosureStabilizationJudgment<T> = ClosureStabilizationWitness<T> | ClosureStabilizationObstruction<T>
```

The result of testing stabilization at one ordinal: a stabilization witness or an obstruction.

### `ClosureStabilizationObstruction` — interface

```ts
export interface ClosureStabilizationObstruction<T>
```

Obstruction to closure stabilization: the ordinal searched through plus the still-differing value and successor value at that bound.

### `closureStabilizationSearchHorizon` — const

```ts
export const closureStabilizationSearchHorizon = (finiteStages: Natural, limitBlocks: Natural): ClosureStabilizationSearchHorizon => …
```

Constructs a stabilization search horizon from a count of finite stages and a count of limit blocks.

### `ClosureStabilizationSearchHorizon` — interface

```ts
export interface ClosureStabilizationSearchHorizon
```

The bound on the stabilization search: the number of finite stages probed per block and the number of limit blocks searched.

### `ClosureStabilizationSearchJudgment` — type-alias

```ts
export type ClosureStabilizationSearchJudgment<T> = | ClosureStabilizationSearchWitness<T> | ClosureStabilizationSearchObstruction<T>
```

The result of the bounded stabilization search: a search witness carrying a regime, or a search obstruction.

### `ClosureStabilizationSearchObstruction` — interface

```ts
export interface ClosureStabilizationSearchObstruction<T>
```

Obstruction from the bounded search: the ordinal searched through and the stabilization obstruction at the horizon, claiming no regime.

### `ClosureStabilizationSearchWitness` — interface

```ts
export interface ClosureStabilizationSearchWitness<T>
```

Witness that the bounded search found stabilization: the stabilizing ordinal, its classified regime, and the underlying stabilization witness.

### `ClosureStabilizationWitness` — interface

```ts
export interface ClosureStabilizationWitness<T>
```

Witness that the closure stabilizes at an ordinal: the ordinal, the approximant value there, and its equal successor value.

### `cohomology` — function

```ts
export function cohomology(sheaf: SheafCarrier): CohomologyCarrier
```

Computes the CohomologyCarrier of a sheaf carrier by taking the cohomology of its section valuation.

### `CohomologyCarrier` — interface

```ts
export interface CohomologyCarrier
```

The full cohomology of a predication complex: bundles the entity terms, cells, the zeroCoboundary incidence carrier, and the zeroth and first cohomology carriers.

### `cohomologyLaplacian` — function

```ts
export function cohomologyLaplacian(cohomologyCarrier: CohomologyCarrier): PredicationCohomologyLaplacian
```

Builds the PredicationCohomologyLaplacian of a cohomology carrier: forms the entity Laplacian from the incidence matrix, computes its characteristic polynomial and the incidence and Laplacian ranks, and checks that the zeroth- and first-cohomology ranks match the kernel and cokernel ranks of the incidence map.

### `cohomologyLaplacianOfCells` — function

```ts
export function cohomologyLaplacianOfCells(cells: readonly Cell[]): PredicationCohomologyLaplacian
```

Computes the PredicationCohomologyLaplacian of a list of cells by taking the cohomology of the cells and then its Laplacian.

### `cohomologyOfCells` — function

```ts
export function cohomologyOfCells(cells: readonly Cell[]): CohomologyCarrier
```

Computes the CohomologyCarrier of a list of cells by wrapping them in a single-fiber valuation with potential charges and taking its cohomology.

### `cohomologyOfValuation` — function

```ts
export function cohomologyOfValuation(valuation: Valuation): CohomologyCarrier
```

Computes the CohomologyCarrier of a valuation: collects the cells from its fibers, derives the entity set, builds the zeroth coboundary incidence matrix, and uses a union-find over entities to count components and cycle rank for the zeroth and first cohomology.

### `ColimitDualityJudgment` — type-alias

```ts
export type ColimitDualityJudgment = ColimitDualityWitness | ColimitDualityObstruction
```

The result of comparing sheaf and cosheaf colimit structures: either a duality witness or an obstruction.

### `ColimitDualityObstruction` — interface

```ts
export interface ColimitDualityObstruction
```

Evidence that the sheaf and cosheaf colimit structures disagree: holds both differing colimit structures.

### `ColimitDualityWitness` — interface

```ts
export interface ColimitDualityWitness
```

Evidence that the sheaf and cosheaf colimit structures agree: holds both matching colimit structures.

### `colimStructure` — function

```ts
export function colimStructure(matrix: Matrix): ColimStructure
```

Computes the colimit structure of a matrix: derives the stable rank from the first nonzero characteristic-polynomial coefficient, the determinant, the Smith normal form, the stable determinant, and the localized integer module.

### `ColimStructure` — interface

```ts
export interface ColimStructure
```

The colimit invariants of a substitution matrix: the stable rank, determinant, Smith normal form factors, the stable determinant, and the resulting localized integer module.

### `commutate` — function

```ts
export function commutate(p: PresheafCarrier): CommutationCarrier
```

Commutates a presheaf into a commutation carrier: keeps the presheaf as the saturated component and exposes its traces as the residue.

### `CommutationCarrier` — interface

```ts
export interface CommutationCarrier
```

The result of commutating a presheaf: holds the saturated presheaf together with the residue of valuations left over from gluing its traces.

### `composeFibers` — function

```ts
export function composeFibers(memes: readonly Meme[], base: PredicationCarrier["base"]): Valuation
```

Folds a list of memes into a valuation over the given base: groups memes by predicate, and combines memes on coincident cells by knowledge join, yielding one fiber algebra per predicate.

### `consistentValuationSubcarrier` — const

```ts
export const consistentValuationSubcarrier = (valuation: Valuation, assignments: ValuationConsistentAssignmentsCarrier): ConsistentValuationSubcarrier => …
```

Builds a consistent-valuation subcarrier by restricting the valuation's fibers to the assignments named in the given consistent-assignments carrier.

### `ConsistentValuationSubcarrier` — interface

```ts
export interface ConsistentValuationSubcarrier
```

Subcarrier restricting a valuation to its consistent assignments: pairs the restricted valuation with the consistent-assignments carrier it was built from.

### `contradictoryValuationSubcarrier` — const

```ts
export const contradictoryValuationSubcarrier = (valuation: Valuation, assignments: ValuationContradictoryAssignmentsCarrier): ContradictoryValuationSubcarrier => …
```

Builds a contradictory-valuation subcarrier by restricting the valuation's fibers to the assignments named in the given contradictory-assignments carrier.

### `ContradictoryValuationSubcarrier` — interface

```ts
export interface ContradictoryValuationSubcarrier
```

Subcarrier restricting a valuation to its contradictory assignments: pairs the restricted valuation with the contradictory-assignments carrier it was built from.

### `converse` — function

```ts
export function converse(entities: EntitySet): FiberGenerator
```

The converse generator over an entity set: swaps subject and object at each cell. Its pullback, exists, and forall all read the source fiber transposed.

### `countableSettlingCofinality` — const

```ts
export const countableSettlingCofinality = (): CountableSettlingCofinalityCarrier => …
```

Constructs the countable cofinality witness for a settling.

### `CountableSettlingCofinalityCarrier` — interface

```ts
export interface CountableSettlingCofinalityCarrier
```

Cofinality witness marking the settling sequence as having countable cofinality.

### `dehydrateUtterances` — function

```ts
export function dehydrateUtterances(utterances: readonly UtteranceCarrier[]): JsonValue
```

Utterance-log persistence: carriers never cross the wire; re-`induce` on the far side. Mark values must themselves be JSON values; anything else is a TypeError. Marks are values, so the rehydrated log coincides with the dehydrated one.

### `designatedCells` — function

```ts
export function designatedCells(valuation: Valuation): readonly Cell[]
```

The cells designated by a valuation: every cell whose charge value is potential or stable, collected across all fibers; stable is retained so the held contradiction is not collapsed to falsity.

### `exchangeMixedFiringOrbitType` — const

```ts
export const exchangeMixedFiringOrbitType = (): ExchangeMixedFiringOrbitTypeCarrier => …
```

Constructs a frozen exchange-mixed firing orbit-type carrier.

### `ExchangeMixedFiringOrbitTypeCarrier` — interface

```ts
export interface ExchangeMixedFiringOrbitTypeCarrier
```

Carrier marking a firing orbit holding both truth-only and falsity-only firings but no stable or absurd ones: the exchange-mixed orbit type.

### `extend` — function

```ts
export function extend(carrier: MemeTopologyCarrier, delta: readonly SingleUtteranceInput[]): MemeTopologyCarrier
```

Evidence is monotone: `extend(induce(a), b)` agrees with `induce([...a, ...b])`.

### `falsityOnlyFiringOrbitType` — const

```ts
export const falsityOnlyFiringOrbitType = (): FalsityOnlyFiringOrbitTypeCarrier => …
```

Constructs a frozen falsity-only firing orbit-type carrier.

### `FalsityOnlyFiringOrbitTypeCarrier` — interface

```ts
export interface FalsityOnlyFiringOrbitTypeCarrier
```

Carrier marking a firing orbit composed only of falsity-only firings: the falsity-only orbit type.

### `falsityOnlyFiringType` — const

```ts
export const falsityOnlyFiringType = (): FalsityOnlyFiringTypeCarrier => …
```

Constructs a frozen falsity-only firing-type carrier.

### `FalsityOnlyFiringTypeCarrier` — interface

```ts
export interface FalsityOnlyFiringTypeCarrier
```

Carrier marking a firing whose falsity side is present and truth side absent: the falsity-only firing type.

### `FiberAlgebra` — interface

```ts
export interface FiberAlgebra
```

The fiber over one predicate: its label, the entity set ranged over by subject and object terms, and the list of charged cell assignments (memes) for that predicate.

### `FiberCarrier` — interface

```ts
export interface FiberCarrier
```

A predication carrier paired with its fibered valuation.

### `fiberFromAlgebra` — function

```ts
export function fiberFromAlgebra(algebra: FiberAlgebra): PredicateFiber
```

Projects a fiber algebra into a predicate fiber, reading each cell's charge from the algebra's assignments and falling back to "absurd" for unassigned cells.

### `FiberGenerator` — interface

```ts
export interface FiberGenerator
```

A morphism between predicate fibers: its generator kind, domain and codomain cell sets, and the pullback, exists, and forall transforms that move a fiber along it.

### `finiteClosureRegime` — const

```ts
export const finiteClosureRegime = (): FiniteClosureRegime => …
```

Constructs the finite closure regime value.

### `FiniteClosureRegime` — interface

```ts
export interface FiniteClosureRegime
```

The finite closure regime: the stabilization ordinal is a finite ordinal.

### `finiteOrdinal` — const

```ts
export const finiteOrdinal = (n: Natural): Ordinal => …
```

Builds the finite ordinal of value n by applying successor to zero n times.

### `finiteOrdinalJudgment` — function

```ts
export function finiteOrdinalJudgment(ordinal: Ordinal): FiniteOrdinalJudgment
```

Tests whether an ordinal is finite by stripping its successor chain: returns a witness with the counted value if it reaches zero, otherwise an obstruction carrying the non-zero residue.

### `FiniteOrdinalJudgment` — type-alias

```ts
export type FiniteOrdinalJudgment = FiniteOrdinalWitness | FiniteOrdinalObstruction
```

The result of testing whether an ordinal is finite: a finite-ordinal witness or an obstruction.

### `FiniteOrdinalObstruction` — interface

```ts
export interface FiniteOrdinalObstruction
```

Obstruction to an ordinal being finite: pairs the ordinal with the non-zero residue reached after stripping its successor prefix.

### `FiniteOrdinalWitness` — interface

```ts
export interface FiniteOrdinalWitness
```

Witness that an ordinal is finite: pairs the ordinal with the natural number value obtained by counting its successor chain to zero.

### `FiringCohomologyGenerator` — interface

```ts
export interface FiringCohomologyGenerator
```

A firing generator placed in cohomology: its settling stage ordinal, charge value, and the underlying firing generator.

### `FiringCohomologyModule` — interface

```ts
export interface FiringCohomologyModule
```

The free module on a set of firing cohomology generators: its basis and the basis cardinality as rank.

### `FiringCohomologyShadow` — interface

```ts
export interface FiringCohomologyShadow
```

Two-sided shadow of firing cohomology: the truth-side and falsity-side modules together with the multiplicities lPlus and lMinus they carry.

### `FiringCohomologySideCarrier` — type-alias

```ts
export type FiringCohomologySideCarrier = | FiringTruthCohomologySideCarrier | FiringFalsityCohomologySideCarrier
```

Union of the firing cohomology side carriers: the truth side or the falsity side.

### `firingConeConsistency` — function

```ts
export function firingConeConsistency(value: ChargeValue, lPlus: Natural, lMinus: Natural): FiringConeConsistencyJudgment
```

Judges cone consistency for a charge value with multiplicities lPlus and lMinus: an obstruction when both are nonzero, otherwise a witness.

### `FiringConeConsistencyJudgment` — type-alias

```ts
export type FiringConeConsistencyJudgment = FiringConeConsistencyWitness | FiringConeConsistencyObstruction
```

Judgment of a firing's cone consistency: either a witness or an obstruction.

### `FiringConeConsistencyObstruction` — interface

```ts
export interface FiringConeConsistencyObstruction
```

Obstruction to a firing's cone consistency: a charge value whose truth multiplicity lPlus and falsity multiplicity lMinus are both nonzero.

### `FiringConeConsistencyWitness` — interface

```ts
export interface FiringConeConsistencyWitness
```

Witness that a firing's cone consistency holds: a charge value with its truth multiplicity lPlus and falsity multiplicity lMinus, not both nonzero.

### `firingFalsityCohomologySide` — const

```ts
export const firingFalsityCohomologySide = (): FiringFalsityCohomologySideCarrier => …
```

Constructs a frozen falsity-side firing cohomology carrier.

### `FiringFalsityCohomologySideCarrier` — interface

```ts
export interface FiringFalsityCohomologySideCarrier
```

Carrier marking the falsity side of firing cohomology.

### `firingFirstCohomology` — function

```ts
export function firingFirstCohomology(valuedFirings: readonly ValuedFiring[]): FiringFirstCohomology
```

Computes the first cohomology of a list of valued firings: a cohomology generator per firing, their module with rank equal to the generator count, and the counts lPlus and lMinus of generators with nonzero truth and falsity multiplicities.

### `FiringFirstCohomology` — interface

```ts
export interface FiringFirstCohomology
```

First cohomology of a family of firings: the cohomology generators, their module, the module rank, and the counts lPlus and lMinus of generators with nonzero truth and falsity multiplicities.

### `firingGenerator` — function

```ts
export function firingGenerator(value: ChargeValue): FiringGenerator
```

Computes the firing generator of a charge value: its firing type, multiplicities lPlus and lMinus from the grade, its cone consistency judgment, and its totality carrier.

### `FiringGenerator` — interface

```ts
export interface FiringGenerator
```

Generator record for a firing: its charge value, firing type, truth and falsity multiplicities lPlus and lMinus, its cone consistency judgment, and its totality carrier.

### `firingGrade` — function

```ts
export function firingGrade(value: ChargeValue): FiringGrade
```

Computes the firing grade of a charge value: its firing type, the truth and falsity multiplicities lPlus and lMinus (one when the side is present, zero otherwise), and its singleton-pair consistency judgment.

### `FiringGrade` — interface

```ts
export interface FiringGrade
```

Graded record of a single firing: its charge value, firing type, truth and falsity multiplicities lPlus and lMinus, and its singleton-pair consistency judgment.

### `firingGradeCohomology` — function

```ts
export function firingGradeCohomology(values: readonly ChargeValue[], abRank: Natural = fromCount(values.length)): FiringGradeCohomology
```

Computes the graded cohomology of a list of charge values: per-firing grades, firing-type multiplicities, the abelian rank abRank (defaulting to the value count) compared against the value count, the two-sided shadow over multiplicities lPlus and lMinus, and the shadow rank-identity judgment.

### `FiringGradeCohomology` — interface

```ts
export interface FiringGradeCohomology
```

Graded cohomology of a family of charge values: the values, their per-firing grades, firing-type multiplicities, an abelian rank abRank with its comparison against the value count, the two-sided cohomology shadow, and the shadow rank-identity judgment.

### `firingGrades` — function

```ts
export function firingGrades(values: readonly ChargeValue[]): readonly FiringGrade[]
```

Maps a list of charge values to their firing grades, returning a frozen array.

### `firingGradeShadow` — function

```ts
export function firingGradeShadow(valuedFirings: readonly ValuedFiring[]): FiringCohomologyShadow
```

Computes the two-sided cohomology shadow of a list of valued firings from their first cohomology: truth- and falsity-side modules carrying the multiplicities lPlus and lMinus.

### `firingIndependence` — function

```ts
export function firingIndependence(valuedFirings: readonly ValuedFiring[]): FiringIndependenceJudgment
```

Judges whether a list of valued firings is independent: an obstruction naming the first pair that share a settling stage ordinal, otherwise a witness over all the firings.

### `FiringIndependenceJudgment` — type-alias

```ts
export type FiringIndependenceJudgment = FiringIndependenceWitness | FiringIndependenceObstruction
```

Judgment of a valued-firing family's independence: either a witness or an obstruction.

### `FiringIndependenceObstruction` — interface

```ts
export interface FiringIndependenceObstruction
```

Obstruction to firing independence: the shared settling stage and the two valued firings that collide on it.

### `FiringIndependenceWitness` — interface

```ts
export interface FiringIndependenceWitness
```

Witness that a family of valued firings is independent: no two share a settling stage. Carries the firings.

### `FiringOrbitCardinality` — type-alias

```ts
export type FiringOrbitCardinality = FiringOrbitSingletonCardinality | FiringOrbitPairCardinality | FiringOrbitVariableCardinality
```

Union of the firing orbit cardinality carriers: singleton, pair, or variable.

### `FiringOrbitClassification` — interface

```ts
export interface FiringOrbitClassification
```

Classification of a firing orbit: its firing-type multiplicities, orbit type, cardinality, self-duality judgment, and the negated charge values.

### `FiringOrbitDualityJudgment` — type-alias

```ts
export type FiringOrbitDualityJudgment = FiringOrbitDualityWitness | FiringOrbitDualityObstruction
```

Judgment of a firing orbit's self-duality: either a witness or an obstruction.

### `FiringOrbitDualityObstruction` — interface

```ts
export interface FiringOrbitDualityObstruction
```

Obstruction to a firing orbit being self-dual: carries the orbit type that fails self-duality.

### `FiringOrbitDualityWitness` — interface

```ts
export interface FiringOrbitDualityWitness
```

Witness that a firing orbit is self-dual under negation.

### `FiringOrbitPairCardinality` — interface

```ts
export interface FiringOrbitPairCardinality
```

Cardinality carrier for a firing orbit of size two: a pair with rank two.

### `FiringOrbitSingletonCardinality` — interface

```ts
export interface FiringOrbitSingletonCardinality
```

Cardinality carrier for a firing orbit of size one: a singleton with rank one.

### `FiringOrbitTypeCarrier` — type-alias

```ts
export type FiringOrbitTypeCarrier = | SelfDualFiringOrbitTypeCarrier | TruthOnlyFiringOrbitTypeCarrier | FalsityOnlyFiringOrbitTypeCarrier | ExchangeMixedFiringOrbitTypeCarrier | MixedFiringOrbitTypeCarrier
```

Union of the firing orbit-type carriers: self-dual, truth-only, falsity-only, exchange-mixed, and mixed.

### `FiringOrbitVariableCardinality` — interface

```ts
export interface FiringOrbitVariableCardinality
```

Cardinality carrier for a firing orbit of variable size: carries the support rank over the underlying values.

### `firingSelfDuality` — function

```ts
export function firingSelfDuality(values: readonly ChargeValue[]): FiringSelfDuality
```

Computes the self-duality record of a list of charge values: the orbit duality judgment, a symmetry judgment (witnessed when every value is stable or absurd), a negation judgment (witnessed when every value equals its own negation), and a coherence judgment combining all three.

### `FiringSelfDuality` — interface

```ts
export interface FiringSelfDuality
```

Self-duality record for a firing family: its orbit duality, symmetry, and negation judgments together with the combined coherence judgment.

### `FiringSelfDualityCoherenceJudgment` — type-alias

```ts
export type FiringSelfDualityCoherenceJudgment = FiringSelfDualityCoherenceWitness | FiringSelfDualityCoherenceObstruction
```

Judgment of firing self-duality coherence: either a witness or an obstruction.

### `FiringSelfDualityCoherenceObstruction` — interface

```ts
export interface FiringSelfDualityCoherenceObstruction
```

Obstruction to firing self-duality coherence: carries the orbit duality, symmetry, and negation judgments not all witnessing.

### `FiringSelfDualityCoherenceWitness` — interface

```ts
export interface FiringSelfDualityCoherenceWitness
```

Witness that a firing family's orbit duality, symmetry, and negation all hold coherently.

### `firingSideContribution` — const

```ts
export const firingSideContribution = (value: ChargeValue): readonly [truth: ChargeSide, falsity: ChargeSide] => …
```

Returns the truth and falsity charge sides of a charge value as a tuple, taken from its charge.

### `firingSideModule` — const

```ts
export const firingSideModule = (side: FiringCohomologySideCarrier, moduleRank: Natural): FiringSideModule => …
```

Constructs a frozen one-sided firing cohomology module from a side carrier and a rank.

### `FiringSideModule` — interface

```ts
export interface FiringSideModule
```

A one-sided firing cohomology module: the side it represents and the rank carried on that side.

### `firingSingletonPairConsistency` — function

```ts
export function firingSingletonPairConsistency(value: ChargeValue, lPlus: Natural, lMinus: Natural): FiringSingletonPairConsistencyJudgment
```

Judges singleton-pair consistency for a charge value with multiplicities lPlus and lMinus: an obstruction when both are nonzero, otherwise a witness.

### `FiringSingletonPairConsistencyJudgment` — type-alias

```ts
export type FiringSingletonPairConsistencyJudgment = FiringSingletonPairConsistencyWitness | FiringSingletonPairConsistencyObstruction
```

Judgment of a firing's singleton-pair consistency: either a witness or an obstruction.

### `FiringSingletonPairConsistencyObstruction` — interface

```ts
export interface FiringSingletonPairConsistencyObstruction
```

Obstruction to a firing's singleton-pair consistency: a charge value whose truth multiplicity lPlus and falsity multiplicity lMinus are both nonzero.

### `FiringSingletonPairConsistencyWitness` — interface

```ts
export interface FiringSingletonPairConsistencyWitness
```

Witness that a firing's singleton-pair consistency holds: a charge value with its truth multiplicity lPlus and falsity multiplicity lMinus, not both nonzero.

### `FiringSymmetryJudgment` — type-alias

```ts
export type FiringSymmetryJudgment = FiringSymmetryWitness | FiringSymmetryObstruction
```

Judgment of a firing family's symmetry: either a witness or an obstruction.

### `FiringSymmetryObstruction` — interface

```ts
export interface FiringSymmetryObstruction
```

Obstruction to a firing family's symmetry: carries the charge values that violate it.

### `FiringSymmetryWitness` — interface

```ts
export interface FiringSymmetryWitness
```

Witness that a firing family satisfies a symmetry condition.

### `firingTotality` — const

```ts
export const firingTotality = (value: ChargeValue): FiringTotalityCarrier => …
```

Constructs a frozen firing totality carrier wrapping the given charge value.

### `FiringTotalityCarrier` — interface

```ts
export interface FiringTotalityCarrier
```

Carrier recording the charge value of a firing as its totality datum.

### `firingTruthCohomologySide` — const

```ts
export const firingTruthCohomologySide = (): FiringTruthCohomologySideCarrier => …
```

Constructs a frozen truth-side firing cohomology carrier.

### `FiringTruthCohomologySideCarrier` — interface

```ts
export interface FiringTruthCohomologySideCarrier
```

Carrier marking the truth side of firing cohomology.

### `FiringTypeCarrier` — type-alias

```ts
export type FiringTypeCarrier = | TruthOnlyFiringTypeCarrier | FalsityOnlyFiringTypeCarrier | StableFiringTypeCarrier | AbsurdFiringTypeCarrier
```

Union of the four firing-type carriers - truth-only, falsity-only, stable, and absurd - classifying a charge value by which of its two sides are present.

### `firingTypeMultiplicities` — function

```ts
export function firingTypeMultiplicities(values: readonly ChargeValue[]): FiringTypeMultiplicityCarrier
```

Counts charge values by firing type, returning a carrier of the truth-only, falsity-only, stable, and absurd totals.

### `FiringTypeMultiplicityCarrier` — interface

```ts
export interface FiringTypeMultiplicityCarrier
```

Carrier counting firings by type: how many are truth-only, falsity-only, stable, and absurd.

### `FirstCohomologyCarrier` — interface

```ts
export interface FirstCohomologyCarrier
```

The first cohomology of a predication complex: its rank is the cycle rank (cells minus entities plus components), and vanishing is the rankVanishing judgment recording whether that rank is zero.

### `fixedPointBoundName` — const

```ts
export const fixedPointBoundName = (bound: FixedPointBoundObject): BoundName => …
```

The bound name ("least" or "greatest") of a fixed-point bound object.

### `fixedPointBoundObject` — const

```ts
export const fixedPointBoundObject = (name: BoundName): FixedPointBoundObject => …
```

Builds a fixed-point bound object carrying the given bound name.

### `FixedPointBoundObject` — interface

```ts
export interface FixedPointBoundObject
```

The bound object selecting which extremal fixed point to compute, carrying its name ("least" or "greatest").

### `FixedPointCarrier` — interface

```ts
export interface FixedPointCarrier
```

The full fixed-point structure of a presheaf: the least/greatest extrema in both the knowledge and truth orders, together with the gap carriers measuring the spread between least and greatest in each order.

### `fixedPointClosure` — function

```ts
export function fixedPointClosure(rule: SubstitutionRule, seed: SubstitutionWord): SubstitutionClosureCarrier
```

Builds the fixed-point closure of a substitution from a seed: a lattice over infinite words ordered by the prefix relation, with the substitution map phi and a supremum that converges to the fixed point.

### `FixedPointExtremum` — interface

```ts
export interface FixedPointExtremum
```

A computed extremal fixed point: the seed, the resulting ordinal closure, the fixed-point judgment (witness or obstruction), and the sheaf of the closure's value, for a given order and bound.

### `fixedPointGap` — function

```ts
export function fixedPointGap(input: FixedPointGapInput): FixedPointGapCarrier
```

Computes the gap between an order's least and greatest fixed-point extrema: for each least-extremum cell assignment it finds the coincident greatest charge and emits a closure witness when the values match, an opening obstruction when they differ, or a missing-greatest obstruction when no greatest cell coincides, then assembles all partitioned carriers, the obstruction rank, and the vanishing judgment into a FixedPointGapCarrier.

### `FixedPointGapCarrier` — interface

```ts
export interface FixedPointGapCarrier
```

The full result of the fixed-point gap computation: the underlying order and fixed-point order, the least and greatest extrema, every cell reading partitioned into closures, openings, missing-greatest cells, and combined obstructions, plus the obstruction rank and the vanishing judgment.

### `fixedPointGapCellClosures` — const

```ts
export const fixedPointGapCellClosures = (readings: readonly FixedPointGapCellReading[]): FixedPointGapCellClosuresCarrier => …
```

Selects the closure witnesses from the given cell readings and returns them in a frozen closures carrier ranked by their count.

### `FixedPointGapCellClosuresCarrier` — interface

```ts
export interface FixedPointGapCellClosuresCarrier
```

Carrier holding only the closure witnesses among the cell readings, with rank counting the cells where the gap closes.

### `FixedPointGapCellClosureWitness` — interface

```ts
export interface FixedPointGapCellClosureWitness
```

Witness that a cell coincides between the least and greatest fixed-point extrema: the cell's least and greatest charges carry the same value, so the gap closes at this cell.

### `FixedPointGapCellMissingGreatestObstruction` — interface

```ts
export interface FixedPointGapCellMissingGreatestObstruction
```

Obstruction recording a cell present in the least extremum that has no coincident counterpart in the greatest extremum: the least charge is held with no greatest to compare against.

### `FixedPointGapCellObstruction` — type-alias

```ts
export type FixedPointGapCellObstruction = | FixedPointGapCellOpeningObstruction | FixedPointGapCellMissingGreatestObstruction
```

The obstructing subset of cell readings: either an opening obstruction or a missing-greatest obstruction, excluding closure witnesses.

### `fixedPointGapCellObstructions` — const

```ts
export const fixedPointGapCellObstructions = (openings: FixedPointGapCellOpeningsCarrier, missingGreatest: FixedPointGapMissingGreatestCellsCarrier): FixedPointGapCellObstructionsCarrier => …
```

Combines the openings and missing-greatest carriers into a single frozen obstructions carrier: concatenated readings, the two sub-carriers, and a rank totalling both.

### `FixedPointGapCellObstructionsCarrier` — interface

```ts
export interface FixedPointGapCellObstructionsCarrier
```

Carrier collecting all obstructing readings - openings together with missing-greatest cells - exposing each grouped sub-carrier and a rank counting the total obstructions.

### `FixedPointGapCellOpeningObstruction` — interface

```ts
export interface FixedPointGapCellOpeningObstruction
```

Obstruction recording a cell whose least and greatest fixed-point charges differ in value: the gap stays open at this cell, retaining both charges.

### `fixedPointGapCellOpenings` — const

```ts
export const fixedPointGapCellOpenings = (readings: readonly FixedPointGapCellReading[]): FixedPointGapCellOpeningsCarrier => …
```

Selects the opening obstructions from the given cell readings and returns them in a frozen openings carrier ranked by their count.

### `FixedPointGapCellOpeningsCarrier` — interface

```ts
export interface FixedPointGapCellOpeningsCarrier
```

Carrier holding only the opening obstructions among the cell readings, with rank counting the cells where least and greatest charges differ.

### `FixedPointGapCellReading` — type-alias

```ts
export type FixedPointGapCellReading = | FixedPointGapCellClosureWitness | FixedPointGapCellOpeningObstruction | FixedPointGapCellMissingGreatestObstruction
```

The per-cell outcome of comparing the least and greatest extrema: a closure witness, an opening obstruction, or a missing-greatest obstruction.

### `fixedPointGapCellReadings` — const

```ts
export const fixedPointGapCellReadings = (readings: readonly FixedPointGapCellReading[]): FixedPointGapCellReadingsCarrier => …
```

Wraps a list of cell readings in a frozen readings carrier, setting rank to the reading count.

### `FixedPointGapCellReadingsCarrier` — interface

```ts
export interface FixedPointGapCellReadingsCarrier
```

Carrier holding every per-cell reading produced by the gap comparison, with rank counting the readings.

### `fixedPointGapInput` — function

```ts
export function fixedPointGapInput(order: FixedPointOrderCarrier): FixedPointGapInput
```

Builds a frozen FixedPointGapInput wrapping the given fixed-point order carrier.

### `FixedPointGapInput` — interface

```ts
export interface FixedPointGapInput
```

Input to the gap computation: the fixed-point order carrier whose least and greatest extrema are compared.

### `fixedPointGapMissingGreatestCells` — const

```ts
export const fixedPointGapMissingGreatestCells = (readings: readonly FixedPointGapCellReading[]): FixedPointGapMissingGreatestCellsCarrier => …
```

Selects the missing-greatest obstructions from the given cell readings and returns them in a frozen carrier ranked by their count.

### `FixedPointGapMissingGreatestCellsCarrier` — interface

```ts
export interface FixedPointGapMissingGreatestCellsCarrier
```

Carrier holding only the missing-greatest obstructions among the cell readings, with rank counting the least cells lacking a greatest counterpart.

### `fixedPointGapVanishing` — const

```ts
export const fixedPointGapVanishing = (obstructions: FixedPointGapCellObstructionsCarrier): FixedPointGapVanishingJudgment => …
```

Judges vanishing from an obstructions carrier: returns a vanishing witness when its rank is zero, otherwise a vanishing obstruction carrying the obstructions.

### `FixedPointGapVanishingJudgment` — type-alias

```ts
export type FixedPointGapVanishingJudgment = FixedPointGapVanishingWitness | FixedPointGapVanishingObstruction
```

The verdict on whether the gap vanishes: a vanishing witness when no obstructions remain, otherwise a vanishing obstruction.

### `FixedPointGapVanishingObstruction` — interface

```ts
export interface FixedPointGapVanishingObstruction
```

Obstruction recording that the gap does not vanish: rank counts the surviving obstructions and the obstructions carrier holds them.

### `FixedPointGapVanishingWitness` — interface

```ts
export interface FixedPointGapVanishingWitness
```

Witness that the gap vanishes: no obstructions remain, so the least and greatest extrema coincide on every cell; rank is zero.

### `FixedPointJudgment` — type-alias

```ts
export type FixedPointJudgment = FixedPointWitness | FixedPointObstruction
```

The outcome of closing toward a fixed point: either a stabilization witness or a non-stabilization obstruction.

### `fixedPointKnowledgeGap` — function

```ts
export function fixedPointKnowledgeGap(p: PresheafCarrier): FixedPointGapCarrier
```

The knowledge-order gap carrier of a presheaf's fixed points, measuring the spread between the knowledge least and greatest fixed points.

### `FixedPointObstruction` — interface

```ts
export interface FixedPointObstruction
```

Obstruction recording that closure did not stabilize to a fixed point: retains the last valuation value reached, with its order and bound.

### `FixedPointOrderCarrier` — interface

```ts
export interface FixedPointOrderCarrier
```

The pair of extremal fixed points for one order: the least and greatest fixed-point extrema taken in the same order object.

### `fixedPointOrderName` — const

```ts
export const fixedPointOrderName = (order: FixedPointOrderObject): OrderName => …
```

The order name (knowledge or truth) of a fixed-point order object, read from its wrapped closure order.

### `fixedPointOrderObject` — const

```ts
export const fixedPointOrderObject = (valuationClosureOrder: PredicationValuationClosureOrderCarrier): FixedPointOrderObject => …
```

Builds a fixed-point order object wrapping the given predication-valuation closure order.

### `FixedPointOrderObject` — interface

```ts
export interface FixedPointOrderObject
```

The order object a fixed point is taken in: wraps the underlying predication-valuation closure order (knowledge or truth) used to drive closure.

### `fixedPointReading` — function

```ts
export function fixedPointReading(extremum: FixedPointExtremum): MemeTopologyFixedPointReading
```

Builds the reading of a single fixed-point extremum: carries the extremum's order and bound, computes the cohomology of the extremum's sheaf, and extracts the information of that sheaf.

### `fixedPointReadings` — function

```ts
export function fixedPointReadings(fixed: FixedPointCarrier): MemeTopologyFixedPointReadings
```

Builds all four readings from a fixed-point carrier: the least and greatest knowledge fixed points and the least and greatest truth fixed points.

### `fixedPoints` — function

```ts
export function fixedPoints(p: PresheafCarrier): FixedPointCarrier
```

Computes the complete fixed-point structure of a presheaf: least and greatest extrema in both the knowledge and truth orders plus the gap carriers for each order.

### `FixedPointSeedCarrier` — interface

```ts
export interface FixedPointSeedCarrier
```

The seed for a fixed-point closure: the valuation the closure process starts from, tagged with the order and bound it is being closed under.

### `fixedPointTruthGap` — function

```ts
export function fixedPointTruthGap(p: PresheafCarrier): FixedPointGapCarrier
```

The truth-order gap carrier of a presheaf's fixed points, measuring the spread between the truth least and greatest fixed points.

### `FixedPointWitness` — interface

```ts
export interface FixedPointWitness
```

Witness that closure stabilized to a fixed point: records the stabilization stage ordinal and the stabilized valuation value, with its order and bound.

### `gaugeImage` — function

```ts
export function gaugeImage(labeling: GaugeLabelingCarrier, sigma: GaugeElementName): GaugeImageCarrier
```

Applies a gauge element to a labeling: returns the image carrier whose values are each labeling value gauged by sigma.

### `GaugeImageCarrier` — interface

```ts
export interface GaugeImageCarrier
```

The image of a gauge labeling under a gauge element: the source labeling, the applied gauge element name sigma, the gauged charge values, and the rank.

### `gaugeLabeling` — function

```ts
export function gaugeLabeling(values: readonly ChargeValue[]): GaugeLabelingCarrier
```

Constructs a gauge labeling from charge values: returns a frozen labeling carrier holding a copy of the values and their count as rank.

### `GaugeLabelingCarrier` — interface

```ts
export interface GaugeLabelingCarrier
```

A gauge labeling: a list of charge values assigned to alphabet positions, together with its rank (the number of values).

### `GaugePermutationEscapingValue` — interface

```ts
export interface GaugePermutationEscapingValue
```

A gauge image value outside the labeling: a gauged charge value that no original labeling value matches.

### `GaugePermutationJudgment` — type-alias

```ts
export type GaugePermutationJudgment = GaugePermutationWitness | GaugePermutationObstruction
```

The result of testing whether a gauge element permutes a labeling: either a permutation witness or an obstruction.

### `GaugePermutationMissingValue` — interface

```ts
export interface GaugePermutationMissingValue
```

A labeling value absent from a gauge image: a charge value in the original labeling that no gauged value reproduces.

### `GaugePermutationObstruction` — interface

```ts
export interface GaugePermutationObstruction
```

Evidence that a gauge element fails to permute a labeling: the labeling, its image, the values missing and escaping, and the rank of the defect.

### `GaugePermutationWitness` — interface

```ts
export interface GaugePermutationWitness
```

Evidence that a gauge element permutes a labeling: the labeling, its gauge image, and the permutation matrix realizing the action.

### `GeneratorKind` — type-alias

```ts
export type GeneratorKind = "specialization" | "converse" | "subject-projection" | "object-projection"
```

The kind of fiber generator: "specialization", "converse", "subject-projection", or "object-projection".

### `generatorPreservesLinearFusion` — function

```ts
export function generatorPreservesLinearFusion(generator: FiberGenerator, left: PredicateFiber, right: PredicateFiber): boolean
```

Tests whether a generator's pullback commutes with linear fusion: true when pulling back the fusion equals the fusion of the pullbacks over the generator's codomain.

### `generatorPreservesLinearResiduum` — function

```ts
export function generatorPreservesLinearResiduum(generator: FiberGenerator, left: PredicateFiber, right: PredicateFiber): boolean
```

Tests whether a generator's pullback commutes with linear residuum: true when pulling back the residuum equals the residuum of the pullbacks over the generator's codomain.

### `generatorSatisfiesLinearFusionFrobenius` — function

```ts
export function generatorSatisfiesLinearFusionFrobenius( generator: FiberGenerator, order: Order, alpha: PredicateFiber, phi: PredicateFiber, ): boolean
```

Tests the Frobenius reciprocity law for a generator over an order: true when exists of the fusion of a pulled-back alpha with phi equals the fusion of alpha with exists of phi, over the generator's domain.

### `gradedGap` — function

```ts
export function gradedGap(carrier: SettlingCarrier): GradedGapCarrier
```

The graded gap of a settling: one loss per cell added at a non-Scott limit-stage firing, with the loss count as a rank.

### `GradedGapCarrier` — interface

```ts
export interface GradedGapCarrier
```

The graded gap of a settling: the list of cells lost at non-Scott limit-stage firings and their count as a rank.

### `GradedGapLoss` — interface

```ts
export interface GradedGapLoss
```

One cell lost across the graded gap: a cell added at a non-Scott limit-stage firing, paired with that source stage.

### `gradedGapSettlingFirstCohomologyRank` — const

```ts
export const gradedGapSettlingFirstCohomologyRank = (carrier: SettlingCarrier): RankIdentityJudgment => …
```

The rank-identity judgment comparing the first cohomology rank against the graded gap rank for a settling.

### `greatestFixedPointBound` — const

```ts
export const greatestFixedPointBound = (): FixedPointBoundObject => …
```

The bound object selecting the greatest fixed point.

### `induce` — function

```ts
export function induce(utterances: readonly SingleUtteranceInput[]): MemeTopologyCarrier
```

The descent, folded: articulate every utterance, predicate the union into the relational sites, posit the measured valuation, and settle it into one frozen carrier. Evidence enters here and only here — there is no verb that admits a charge, a polarity, or an edge directly. A token whose mark value is a `{ subject, object }` pair articulates a relational cell; any other token articulates the diagonal cell.

### `inducedPermutation` — function

```ts
export function inducedPermutation(values: readonly ChargeValue[], sigma: GaugeElementName): GaugePermutationJudgment
```

Tests whether a gauge element permutes a set of charge values: returns a permutation witness with the realizing matrix when every value maps bijectively, or an obstruction listing the missing and escaping values.

### `InfiniteWord` — type-alias

```ts
export type InfiniteWord = { readonly kind: "substitution.dynamics.fixedPoint" } | SubstitutionWord
```

A word in the fixed-point closure: either a finite substitution word or the distinguished infinite fixed-point element.

### `informationOfSheaf` — function

```ts
export function informationOfSheaf(sheaf: SheafCarrier): MemeTopologyInformation
```

Extracts the information of a sheaf: walks every fiber assignment, deduplicating entries by point and state and joining colliding charge values under the knowledge order, then assembles the points, states, relation matrix, derived relation, and valuation consistency.

### `isLimitOrdinal` — const

```ts
export const isLimitOrdinal = (ordinal: Ordinal): ordinal is LimitOrdinal => …
```

Type guard: tests whether an ordinal is a limit ordinal.

### `isMeme` — function

```ts
export function isMeme(value: unknown): value is Meme
```

Type guard for Meme: true when the value carries the meme kind tag and holds a cell and a charge.

### `isSuccessorOrdinal` — const

```ts
export const isSuccessorOrdinal = (ordinal: Ordinal): ordinal is SuccessorOrdinal => …
```

Type guard: tests whether an ordinal is a successor ordinal.

### `isZeroOrdinal` — const

```ts
export const isZeroOrdinal = (ordinal: Ordinal): ordinal is ZeroOrdinal => …
```

Type guard: tests whether an ordinal is the zero ordinal.

### `iterateSubstitution` — function

```ts
export function iterateSubstitution(rule: SubstitutionRule, word: SubstitutionWord, n: Natural): SubstitutionWord
```

Applies a substitution rule n times to a word: returns the word after n iterations of substitution.

### `JsonValue` — type-alias

```ts
export type JsonValue = null | boolean | number | string | readonly JsonValue[] | { readonly [k: string]: JsonValue }
```

The set of values expressible as JSON: null, boolean, number, string, a readonly array of JsonValue, or a string-keyed object of JsonValue. Models the only payloads that may cross the wire in this serialization layer.

### `knowledgeClosureCells` — function

```ts
export function knowledgeClosureCells(p: PresheafCarrier): readonly Cell[]
```

Returns the cells of a presheaf's knowledge closure sheaf: the cell of every assignment across all fibers of the closure section.

### `knowledgeClosureEndomorphism` — const

```ts
export const knowledgeClosureEndomorphism = (valuation: Valuation): Valuation => …
```

The knowledge closure endomorphism: knowledge-raises a valuation then transports it along the predication generators, folding duplicates by the knowledge join.

### `knowledgeClosureSettling` — function

```ts
export function knowledgeClosureSettling(presheafCarrier: PresheafCarrier): SettlingCarrier
```

Builds the settling of a presheaf's knowledge closure: maps each orbit stage to a settling-stage input of its ordinal, designated cells, and shape, then settles the resulting stages.

### `knowledgeClosureSheaf` — function

```ts
export function knowledgeClosureSheaf(p: PresheafCarrier): SheafCarrier
```

Returns the sheaf of a presheaf's knowledge closure.

### `knowledgeClosureTrace` — function

```ts
export function knowledgeClosureTrace(p: PresheafCarrier): PredicationValuationClosureTraceCarrier
```

Returns the trace of a presheaf's knowledge closure.

### `knowledgeGreatestFixedPoint` — function

```ts
export function knowledgeGreatestFixedPoint(p: PresheafCarrier): FixedPointExtremum
```

Computes the greatest fixed point in the knowledge order, seeded from the presheaf's first trace with unevidenced charge sides forced present.

### `knowledgeLeastFixedPoint` — function

```ts
export function knowledgeLeastFixedPoint(p: PresheafCarrier): FixedPointExtremum
```

Computes the least fixed point in the knowledge order, seeded from the presheaf's first trace valuation.

### `knowledgeLeastMemeOfSingleUtterance` — function

```ts
export function knowledgeLeastMemeOfSingleUtterance(input: SingleUtteranceInput): Meme
```

The knowledge-least meme of a single utterance: induces that utterance's topology and returns the first assignment of the first fiber of its knowledge-least fixed-point reading.

### `knowledgeOrder` — function

```ts
export function knowledgeOrder(): Order
```

The knowledge order on charge values: joins and meets by knowledge, with "absurd" as bottom and "stable" as top.

### `knowledgeValuationClosure` — function

```ts
export function knowledgeValuationClosure(p: PresheafCarrier): PredicationValuationClosureCarrier
```

Computes the knowledge closure of a presheaf: closes the knowledge-order process seeded by the presheaf's first valuation.

### `knowledgeValuationClosureLattice` — function

```ts
export function knowledgeValuationClosureLattice(bottom: Valuation): Lattice<Valuation>
```

Builds the knowledge valuation closure lattice with the given bottom: the knowledge-join lattice with leq strengthened to require every left assignment's charge to be below the matching right charge under the knowledge order.

### `knowledgeValuationClosureOrder` — const

```ts
export const knowledgeValuationClosureOrder = (): PredicationValuationClosureOrderCarrier => …
```

Builds the knowledge closure order carrier: names it "knowledge" and binds its endomorphism and lattice.

### `lastValuation` — function

```ts
export function lastValuation(p: PresheafCarrier): Valuation
```

Returns the most recent valuation in a presheaf's trace sequence: the last entry of its traces.

### `Lattice` — interface

```ts
export interface Lattice<T>
```

A lattice over T: carries a bottom element, an order test leq, a binary join, an equality test eq, and a supremum sup over a sequence of elements.

### `leastFixedPointBound` — const

```ts
export const leastFixedPointBound = (): FixedPointBoundObject => …
```

The bound object selecting the least fixed point.

### `leqTruthPredicateFiber` — function

```ts
export function leqTruthPredicateFiber(left: PredicateFiber, right: PredicateFiber, cells: readonly PredicateFiberCell[] = left.cells): boolean
```

Tests whether the left fiber is below the right under the truth order: true when, at every cell, the truth join of the two values equals the right value.

### `limitOrdinal` — const

```ts
export const limitOrdinal = (label: OrdinalLabel, fundamentalSequence: (n: Natural) => Ordinal): LimitOrdinal => …
```

Constructs a limit ordinal from a label and a fundamental sequence of ordinals.

### `LimitOrdinal` — interface

```ts
export interface LimitOrdinal
```

A limit ordinal: a labelled ordinal with a fundamental sequence mapping each natural to an ordinal whose supremum is this limit.

### `localizedIntegerModule` — const

```ts
export const localizedIntegerModule = (moduleRank: Natural, stableDet: Integer): LocalizedIntegerModule => …
```

Constructs a localized integer module of a given rank: inverts the distinct prime factors of the stable determinant, or none when that determinant is one.

### `LocalizedIntegerModule` — interface

```ts
export interface LocalizedIntegerModule
```

A free integer module with certain primes inverted: its rank and the list of distinct primes localized away (the prime factors of the stable determinant).

### `lowerKnowledge` — variable

```ts
export const lowerKnowledge
```

A modal step that folds duplicate cells within each fiber by the knowledge meet, lowering assignments toward lesser knowledge.

### `lowerTruth` — variable

```ts
export const lowerTruth
```

A modal step that folds duplicate cells within each fiber by the truth meet, lowering assignments toward lesser truth.

### `MatrixEquationJudgment` — type-alias

```ts
export type MatrixEquationJudgment = MatrixEquationWitness | MatrixEquationObstruction
```

The result of comparing two matrices for equality: either a witness of equality or an obstruction of inequality.

### `MatrixEquationObstruction` — interface

```ts
export interface MatrixEquationObstruction
```

Evidence that two matrices differ: holds the left and right matrices that failed to coincide.

### `MatrixEquationWitness` — interface

```ts
export interface MatrixEquationWitness
```

Evidence that two matrices are equal: holds the left and right matrices that were compared.

### `meme` — function

```ts
export function meme(cell: Cell, charge: ChargeCarrier): Meme
```

Constructs a meme: a frozen assignment binding a predication cell to a charge carrier.

### `Meme` — interface

```ts
export interface Meme
```

A single charged assignment within a fiber: binds one predication cell to a charge carrier.

### `MemeTopologyCarrier` — interface

```ts
export interface MemeTopologyCarrier
```

The induced state of a meme topology over an utterance log: holds the witness utterances it was derived from, the four fixed points and their readings, the knowledge-closure settling and its first cohomology, and the typed theory of the base together with its proofs.

### `MemeTopologyFixedPointReading` — interface

```ts
export interface MemeTopologyFixedPointReading
```

A reading of one fixed-point extremum of a predication valuation: pairs the extremum's order, bound and itself with the cohomology of its sheaf and the information extracted from that sheaf's section.

### `MemeTopologyFixedPointReadings` — interface

```ts
export interface MemeTopologyFixedPointReadings
```

The four fixed-point readings of a fixed-point carrier: the least and greatest fixed points along the knowledge order and along the truth order.

### `MemeTopologyInformation` — interface

```ts
export interface MemeTopologyInformation
```

The information content of a sheaf section, viewed as a relation: the entity set of points, the predicate set of states, the deduplicated entries, the relation matrix over points and states, the relation derived from it, and the valuation consistency of the section.

### `memeTopologyInformationEntries` — const

```ts
export const memeTopologyInformationEntries = (entries: readonly MemeTopologyInformationEntry[]): MemeTopologyInformationEntriesCarrier => …
```

Constructs a frozen entries carrier from a list of information entries, copying the entries and recording the rank as their natural count.

### `MemeTopologyInformationEntriesCarrier` — interface

```ts
export interface MemeTopologyInformationEntriesCarrier
```

A carrier for a collection of information entries: the frozen list of entries and its rank as the natural count of those entries.

### `memeTopologyInformationEntry` — const

```ts
export const memeTopologyInformationEntry = (point: PredicationTerm, state: PredicationPredicate, value: ChargeValue): MemeTopologyInformationEntry => …
```

Constructs a frozen information entry from a point, a state, and a charge value.

### `MemeTopologyInformationEntry` — interface

```ts
export interface MemeTopologyInformationEntry
```

A single information entry: a point (predication term), a state (predication predicate), and the charge value assigned to that point-state pair.

### `memeTopologyInformationPoints` — const

```ts
export const memeTopologyInformationPoints = (entries: MemeTopologyInformationEntriesCarrier): EntitySet => …
```

Returns the entity set of the points of an entries carrier, coincidence-reduced by predication term coincidence.

### `memeTopologyInformationRelationMatrix` — const

```ts
export const memeTopologyInformationRelationMatrix = (points: EntitySet, states: PredicateSet, entries: MemeTopologyInformationEntriesCarrier): RelationMatrixCarrier<PredicationTerm, PredicationPredicate> => …
```

Builds the relation matrix over the given points and states from an entries carrier, placing each entry's charge value at its point-state cell under term and predicate coincidence.

### `memeTopologyInformationStates` — const

```ts
export const memeTopologyInformationStates = (entries: MemeTopologyInformationEntriesCarrier): PredicateSet => …
```

Returns the predicate set of the states of an entries carrier, coincidence-reduced by predication predicate coincidence.

### `mixedFiringOrbitType` — const

```ts
export const mixedFiringOrbitType = (): MixedFiringOrbitTypeCarrier => …
```

Constructs a frozen mixed firing orbit-type carrier.

### `MixedFiringOrbitTypeCarrier` — interface

```ts
export interface MixedFiringOrbitTypeCarrier
```

Carrier marking a firing orbit holding stable or absurd firings alongside one-sided ones: the mixed orbit type.

### `necessitateKnowledge` — variable

```ts
export const necessitateKnowledge
```

Appends to a presheaf's trace the knowledge-lowered valuation derived from its last entry.

### `necessitateTruth` — variable

```ts
export const necessitateTruth
```

Appends to a presheaf's trace the truth-lowered valuation derived from its last entry.

### `negateFiringGenerator` — function

```ts
export function negateFiringGenerator(generator: FiringGenerator): FiringGenerator
```

Returns the firing generator of the negation of the given generator's charge value.

### `nonScottSettlingFirings` — const

```ts
export const nonScottSettlingFirings = (carrier: SettlingCarrier): NonScottSettlingFiringsCarrier => …
```

The non-Scott firings of a settling: cell-adding increments whose source is a limit stage, with their count as a rank.

### `NonScottSettlingFiringsCarrier` — interface

```ts
export interface NonScottSettlingFiringsCarrier
```

The firings occurring at limit stages: the increments whose source is a limit stage and added cells, with their count as a rank.

### `normalizeUtterance` — function

```ts
export function normalizeUtterance(input: SingleUtteranceInput): UtteranceCarrier
```

Coerces a single utterance input into an utterance carrier: passes a carrier through unchanged, otherwise builds one from a [left mark, right mark] pair, throwing a TypeError on anything else.

### `objectProjection` — function

```ts
export function objectProjection(entities: EntitySet): FiberGenerator
```

The object-projection generator over an entity set: pullback reads the diagonal cell for each object, while exists and forall fold the join or meet over all subjects onto diagonal cells, leaving off-diagonal cells at the order's bottom or top.

### `omegaMultipleOrdinal` — const

```ts
export const omegaMultipleOrdinal = (k: Natural): Ordinal => …
```

Constructs omega times k: zero when k is zero, otherwise the limit whose fundamental sequence adds finite stages to omega times (k - 1).

### `omegaOrdinal` — const

```ts
export const omegaOrdinal = (): Ordinal => …
```

Constructs omega: the limit ordinal whose fundamental sequence enumerates the finite ordinals.

### `omegaSquaredOrdinal` — const

```ts
export const omegaSquaredOrdinal = (): Ordinal => …
```

Constructs omega squared: the limit ordinal whose fundamental sequence enumerates the omega multiples.

### `Order` — interface

```ts
export interface Order
```

A bounded lattice order on charge values: its name, the join and meet operations, and the bottom and top elements under that order.

### `OrderName` — type-alias

```ts
export type OrderName = "knowledge" | "truth"
```

The name of one of the two lattice orders on charge values: "knowledge" or "truth".

### `Ordinal` — type-alias

```ts
export type Ordinal = ZeroOrdinal | SuccessorOrdinal | LimitOrdinal
```

An ordinal in the closure tower: either zero, a successor of another ordinal, or a labelled limit with a fundamental sequence.

### `ordinalLabel` — const

```ts
export const ordinalLabel = (label: Mark): OrdinalLabel => …
```

Constructs an ordinal label wrapping the given mark.

### `OrdinalLabel` — interface

```ts
export interface OrdinalLabel
```

A display label for a limit ordinal: carries a mark naming the limit (for example "omega").

### `ordinalPlusFinite` — const

```ts
export const ordinalPlusFinite = (ordinal: Ordinal, n: Natural): Ordinal => …
```

Returns the ordinal obtained by applying successor to the given ordinal n times.

### `partitionSection` — function

```ts
export function partitionSection(section: SectionCarrier): SectionPartitionCarrier
```

Splits a section's entries into the four charge buckets - potential, active, stable, and absurd - by each entry's charge value name, with anything unrecognized falling to absurd.

### `perronConvergent` — function

```ts
export function perronConvergent(matrix: Matrix, iterations = 4): Rational
```

Approximates the Perron eigenvalue of a matrix by power iteration from the all-ones vector: returns the ratio of total component sums after the given number of iterations.

### `posit` — function

```ts
export function posit(predication: PredicationCarrier): FiberCarrier
```

Posits a fibered valuation from a predication carrier: one fiber algebra per predicate, with each of that predicate's cells assigned the witnessed potential of its subject.

### `possibilizeKnowledge` — variable

```ts
export const possibilizeKnowledge
```

Appends to a presheaf's trace the knowledge-raised valuation derived from its last entry.

### `possibilizeTruth` — variable

```ts
export const possibilizeTruth
```

Appends to a presheaf's trace the truth-raised valuation derived from its last entry.

### `predicateFiber` — function

```ts
export function predicateFiber( label: PredicationPredicate, entities: EntitySet<PredicationTerm>, read: (subject: PredicationTerm, object: PredicationTerm) => ChargeValue, cells: readonly PredicateFiberCell[] = allCells(entities), readCharge?: (subject: PredicationTerm, object: PredicationTerm) => ChargeCarrier, ): PredicateFiber
```

Builds a predicate fiber from a label, entity set, and a charge-value reader, materializing the value at each cell. Defaults to all cells, and attaches the optional charge-carrier reader when one is supplied; the "at" reader returns "absurd" for cells outside the fiber.

### `PredicateFiber` — interface

```ts
export interface PredicateFiber
```

A predicate fiber: a labelled predicate over an entity set, a list of cells, and an "at" reader giving the charge value at each subject/object pair. The optional "chargeAt" reader yields the full charge carrier, present only on fibers projected straight from an algebra.

### `PredicateFiberCell` — type-alias

```ts
export type PredicateFiberCell = readonly [subject: PredicationTerm, object: PredicationTerm]
```

A cell within a predicate fiber: an ordered pair of a subject term and an object term.

### `predicateFiberCellIdentity` — function

```ts
export function predicateFiberCellIdentity(left: PredicateFiberCell, right: PredicateFiberCell): PredicateFiberCellIdentityJudgment
```

Compares two predicate fiber cells by term coincidence: returns a witness when both terms coincide, otherwise an obstruction.

### `PredicateFiberCellIdentityJudgment` — type-alias

```ts
export type PredicateFiberCellIdentityJudgment = PredicateFiberCellIdentityWitness | PredicateFiberCellIdentityObstruction
```

The result of comparing two predicate fiber cells: either a coincidence witness or an obstruction.

### `PredicateFiberCellIdentityObstruction` — interface

```ts
export interface PredicateFiberCellIdentityObstruction
```

Evidence that two predicate fiber cells fail to coincide: holds the two non-coincident cells.

### `PredicateFiberCellIdentityWitness` — interface

```ts
export interface PredicateFiberCellIdentityWitness
```

Evidence that two predicate fiber cells coincide: holds both cells whose subject and object terms are pairwise coincident.

### `PredicationCohomologyLaplacian` — interface

```ts
export interface PredicationCohomologyLaplacian
```

The graph Laplacian view of a predication cohomology: holds the source cohomology, the incidence matrix, the entity Laplacian (transpose of incidence times incidence) and its characteristic polynomial, the incidence and Laplacian ranks, and rankIdentity judgments checking that the zeroth-cohomology rank equals the kernel rank and the first-cohomology rank equals the cokernel rank.

### `predicationFiberLinearFusion` — function

```ts
export function predicationFiberLinearFusion(left: PredicateFiber, right: PredicateFiber, cells: readonly PredicateFiberCell[] = left.cells): PredicateFiber
```

The cellwise linear fusion of two predicate fibers: applies linear fusion to the charge values of the two fibers at each cell.

### `predicationFiberLinearResiduum` — function

```ts
export function predicationFiberLinearResiduum(left: PredicateFiber, right: PredicateFiber, cells: readonly PredicateFiberCell[] = left.cells): PredicateFiber
```

The cellwise linear residuum of two predicate fibers: applies linear residuum to the charge values of the two fibers at each cell.

### `predicationsFor` — function

```ts
export function predicationsFor(section: SectionCarrier, subject: TermInput): readonly SectionEntry[]
```

The section entries whose cell subject coincides with the given term: every predication made about that subject.

### `PredicationValuationClosureCarrier` — interface

```ts
export interface PredicationValuationClosureCarrier
```

The result of closing a valuation closure process: the process, its ordinal closure carrier, and the sheaf built from the fixed-point valuation.

### `predicationValuationClosureFiniteStageJudgment` — function

```ts
export function predicationValuationClosureFiniteStageJudgment( stage: PredicationValuationClosureStageCarrier, ): PredicationValuationClosureFiniteStageJudgment
```

Judges whether a closure stage's ordinal is finite: returns a finite-stage witness carrying its natural value, or an obstruction carrying the failed finite-ordinal reading.

### `PredicationValuationClosureFiniteStageJudgment` — type-alias

```ts
export type PredicationValuationClosureFiniteStageJudgment = | PredicationValuationClosureFiniteStageWitness | PredicationValuationClosureFiniteStageObstruction
```

The judgment on whether a closure stage's ordinal is finite: either a finite-stage witness or an obstruction.

### `PredicationValuationClosureFiniteStageObstruction` — interface

```ts
export interface PredicationValuationClosureFiniteStageObstruction
```

An obstruction showing a closure stage's ordinal is not finite: carries the stage and the finite-ordinal judgment reading that failed.

### `PredicationValuationClosureFiniteStageWitness` — interface

```ts
export interface PredicationValuationClosureFiniteStageWitness
```

A witness that a closure stage's ordinal is finite: carries the stage and the natural number value of its ordinal.

### `PredicationValuationClosureOrderCarrier` — interface

```ts
export interface PredicationValuationClosureOrderCarrier
```

A closure order over valuations: names the order, supplies its closure endomorphism on valuations, and builds the lattice of valuations from a seed.

### `predicationValuationClosureProcess` — function

```ts
export function predicationValuationClosureProcess( order: PredicationValuationClosureOrderCarrier, seed: Valuation, ): PredicationValuationClosureProcessCarrier
```

Builds a valuation closure process from an order and a seed valuation: constructs the ordinal closure process iterating the order's endomorphism over its lattice on the seed.

### `PredicationValuationClosureProcessCarrier` — interface

```ts
export interface PredicationValuationClosureProcessCarrier
```

A valuation closure process: an order, a seed valuation, and the underlying ordinal closure process iterating the order's endomorphism over its lattice.

### `predicationValuationClosureStage` — function

```ts
export function predicationValuationClosureStage(point: ClosureOrbitPoint<Valuation>): PredicationValuationClosureStageCarrier
```

Builds a closure stage carrier from a closure orbit point: pairs the point's stage ordinal with its valuation value.

### `PredicationValuationClosureStageCarrier` — interface

```ts
export interface PredicationValuationClosureStageCarrier
```

A single stage of valuation closure: pairs a stage ordinal with the valuation reached at that point in the orbit.

### `predicationValuationClosureStageOrdinal` — const

```ts
export const predicationValuationClosureStageOrdinal = (ordinal: Ordinal): PredicationValuationClosureStageOrdinalCarrier => …
```

Builds a frozen stage-ordinal carrier wrapping the given ordinal.

### `PredicationValuationClosureStageOrdinalCarrier` — interface

```ts
export interface PredicationValuationClosureStageOrdinalCarrier
```

A stage ordinal in valuation closure: wraps the ordinal index of a stage in the transfinite closure orbit.

### `predicationValuationClosureTrace` — function

```ts
export function predicationValuationClosureTrace(closure: PredicationValuationClosureCarrier): PredicationValuationClosureTraceCarrier
```

Builds a trace from a closure carrier: collects the orbit of stages and the fixed-point stage, taken from the stabilization witness's ordinal and value or, when unstabilized, the ordinal searched through.

### `PredicationValuationClosureTraceCarrier` — interface

```ts
export interface PredicationValuationClosureTraceCarrier
```

A trace of a valuation closure: the closure carrier, its sheaf, the orbit of stages traversed, and the stage at which the fixed point is reached.

### `PredicationValuationConsistencyCarrier` — interface

```ts
export interface PredicationValuationConsistencyCarrier
```

Full consistency analysis of a valuation: bundles the source valuation, all assignment readings, the consistent and contradictory assignment carriers, the contradiction rank, the vanishing judgment, and the consistent and contradictory subvaluations.

### `presheaf` — function

```ts
export function presheaf(fiber: FiberCarrier): PresheafCarrier
```

Constructs a presheaf over a fiber carrier: seeds its trace list with the fiber's valuation.

### `PresheafCarrier` — interface

```ts
export interface PresheafCarrier
```

A presheaf over a predication fiber: holds the fiber carrier together with the list of valuation traces accumulated over it, seeded with the fiber's own valuation.

### `presheafFromValuation` — function

```ts
export function presheafFromValuation(valuation: Valuation): PresheafCarrier
```

Builds a presheaf from a valuation: rebuilds a predication carrier from the cells of all the valuation's assignments, wraps it as a fiber carrier, and presheafs that.

### `PresheafTrace` — interface

```ts
export interface PresheafTrace
```

A trace through a presheaf: an ordered list of the valuations recorded over the fiber.

### `primitiveMatrix` — function

```ts
export function primitiveMatrix(matrix: Matrix): PrimitiveMatrixJudgment
```

Tests whether a matrix is primitive: returns a witness with the exponent of the first strictly positive power, or an obstruction when an entry is negative or no power within the (n-1)^2+1 bound is strictly positive.

### `PrimitiveMatrixJudgment` — type-alias

```ts
export type PrimitiveMatrixJudgment = PrimitiveMatrixWitness | PrimitiveMatrixObstruction
```

The result of testing a matrix for primitivity: either a primitivity witness or an obstruction.

### `PrimitiveMatrixObstruction` — interface

```ts
export interface PrimitiveMatrixObstruction
```

Evidence that a matrix is not primitive: the matrix, the reason for failure, and the power exponent searched through.

### `PrimitiveMatrixObstructionReason` — type-alias

```ts
export type PrimitiveMatrixObstructionReason = "negative-entry" | "positive-power-not-found"
```

Why a matrix fails primitivity: either it has a negative entry or no power up to the search bound is strictly positive.

### `PrimitiveMatrixWitness` — interface

```ts
export interface PrimitiveMatrixWitness
```

Evidence that a matrix is primitive: the matrix and the exponent at which one of its powers became strictly positive.

### `raiseKnowledge` — variable

```ts
export const raiseKnowledge
```

A modal step that folds duplicate cells within each fiber by the knowledge join, raising assignments toward greater knowledge.

### `raiseTruth` — variable

```ts
export const raiseTruth
```

A modal step that folds duplicate cells within each fiber by the truth join, raising assignments toward greater truth.

### `rankComparison` — function

```ts
export function rankComparison(left: Natural, right: Natural): RankComparison
```

Orders two natural ranks and returns a frozen SameRankComparison when equal, a BelowRankComparison when the left is less, or an AboveRankComparison otherwise.

### `RankComparison` — type-alias

```ts
export type RankComparison = BelowRankComparison | SameRankComparison | AboveRankComparison
```

The result of comparing two natural ranks: one of BelowRankComparison, SameRankComparison, or AboveRankComparison.

### `rankIdentity` — function

```ts
export function rankIdentity(left: Natural, right: Natural): RankIdentityJudgment
```

Compares two natural ranks and returns a frozen RankIdentityWitness when they are equal or a RankIdentityObstruction when they differ.

### `RankIdentityJudgment` — type-alias

```ts
export type RankIdentityJudgment = RankIdentityWitness | RankIdentityObstruction
```

The result of a rank-identity check: either a RankIdentityWitness when two ranks are equal or a RankIdentityObstruction when they differ.

### `RankIdentityObstruction` — interface

```ts
export interface RankIdentityObstruction
```

Obstruction recording that two natural ranks differ: carries the unequal left and right ranks under the rankIdentity-obstruction kind.

### `RankIdentityWitness` — interface

```ts
export interface RankIdentityWitness
```

Witness that two natural ranks coincide: carries the equal left and right ranks under the rankIdentity:witness kind.

### `rankVanishing` — function

```ts
export function rankVanishing(rankValue: Natural): RankVanishingJudgment
```

Tests whether a natural rank is zero and returns a frozen RankVanishingWitness when it vanishes or a RankVanishingObstruction otherwise.

### `RankVanishingJudgment` — type-alias

```ts
export type RankVanishingJudgment = RankVanishingWitness | RankVanishingObstruction
```

The result of a rank-vanishing check: a RankVanishingWitness when the rank is zero or a RankVanishingObstruction when it is nonzero.

### `RankVanishingObstruction` — interface

```ts
export interface RankVanishingObstruction
```

Obstruction recording that a natural rank is nonzero: carries the rank under the rankVanishing-obstruction kind.

### `RankVanishingWitness` — interface

```ts
export interface RankVanishingWitness
```

Witness that a natural rank is zero: carries the vanishing rank under the rankVanishing:witness kind.

### `readCharge` — function

```ts
export function readCharge(reading: MemeTopologyFixedPointReading, target: Cell): ReturnType<typeof chargeAt>
```

Returns the charge assigned to a target cell by the reading's extremum sheaf section.

### `rehydrateUtterances` — function

```ts
export function rehydrateUtterances(value: JsonValue): readonly UtteranceCarrier[]
```

Reconstructs an utterance log from its dehydrated JsonValue form: validates the meme-topology.utteranceLog shape and rebuilds each carrier by inducing token and claim marks from their stored values. Returns a frozen array of UtteranceCarrier; throws a TypeError on any malformed input.

### `sameMeme` — function

```ts
export function sameMeme(left: Meme, right: Meme): boolean
```

Tests whether two memes coincide: true when their cells coincide and their charges are the same.

### `sameMemeTopology` — function

```ts
export function sameMemeTopology(left: MemeTopologyCarrier, right: MemeTopologyCarrier): boolean
```

Mathematical parity of two carriers: same utterance log and same four fixed points. Carriers hold per-instance lattice and endomorphism closures, so reference-level deep equality can never hold between separately induced carriers — parity is adjudicated on content, never on identity.

### `SameRankComparison` — interface

```ts
export interface SameRankComparison
```

Comparison recording that the left and right ranks are equal: carries both ranks under the rankComparison.same kind.

### `sameSettlingStageOrdinal` — function

```ts
export function sameSettlingStageOrdinal(left: SettlingStageOrdinalCarrier, right: SettlingStageOrdinalCarrier): boolean
```

Returns whether two stage ordinal carriers are both finite and equal in natural value.

### `sameSubstitutionSymbol` — const

```ts
export const sameSubstitutionSymbol = (left: SubstitutionSymbol, right: SubstitutionSymbol): boolean => …
```

Tests whether two substitution symbols are equal: holds when their marks coincide.

### `sameValuation` — function

```ts
export function sameValuation(left: Valuation, right: Valuation): boolean
```

Tests whether two valuations coincide: true when their base categories are the same and their fibers match as a set under fiber-algebra coincidence.

### `scottClosureRegime` — const

```ts
export const scottClosureRegime = (): ScottClosureRegime => …
```

Constructs the Scott closure regime value.

### `ScottClosureRegime` — interface

```ts
export interface ScottClosureRegime
```

The Scott closure regime: stabilization occurs at a limit ordinal whose fundamental sequence is finite, modelling closure at omega.

### `SectionCarrier` — interface

```ts
export interface SectionCarrier
```

A section of a meme topology under one order/bound extremum: the chosen fixed-point reading flattened into its charged entries, tagged with the order and bound it was read at.

### `SectionEntry` — interface

```ts
export interface SectionEntry
```

One assignment in a section: the cell it covers paired with the charge that fixed-point reading settled on it.

### `sectionOf` — function

```ts
export function sectionOf(carrier: MemeTopologyCarrier, order: OrderName, bound: BoundName): SectionCarrier
```

The section of a carrier at the given order ("knowledge" or "truth") and bound ("least" or "greatest"): selects that fixed-point reading and flattens its sheaf section's fibers into frozen charged entries. Throws if the carrier, order, or bound is invalid.

### `SectionPartitionCarrier` — interface

```ts
export interface SectionPartitionCarrier
```

The section partitioned by the four charge values, under their dynamical names: has-potential, engaged, held contradiction, no evidence either way.

### `selfDualFiringOrbitType` — const

```ts
export const selfDualFiringOrbitType = (): SelfDualFiringOrbitTypeCarrier => …
```

Constructs a frozen self-dual firing orbit-type carrier.

### `SelfDualFiringOrbitTypeCarrier` — interface

```ts
export interface SelfDualFiringOrbitTypeCarrier
```

Carrier marking a firing orbit fixed by negation: the self-dual orbit type.

### `settleOneTraced` — function

```ts
export function settleOneTraced(input: SingleUtteranceInput): SingleSettlingCarrier
```

Settles a single utterance and keeps its trace: articulates and predicates the utterance, runs the knowledge-closure trace over its presheaf, and returns a carrier holding the settled meme and that trace.

### `settling` — function

```ts
export function settling( stages: readonly SettlingStageInputCarrier[], cofinality: SettlingCofinalityCarrier = countableSettlingCofinality(), ): SettlingCarrier
```

Builds a settling carrier from a sequence of stage inputs and an optional cofinality witness, normalizing each into a stage; throws if there are no stages, if stage 0 is not initial, or if any stage drops cells designated by its predecessor.

### `SettlingCarrier` — interface

```ts
export interface SettlingCarrier
```

A complete settling: the normalized sequence of stages together with its declared cofinality witness.

### `SettlingClassification` — interface

```ts
export interface SettlingClassification
```

The classification of a settling: its settling depth, closure regime, cofinality witness, limit stages, and non-Scott firings.

### `settlingClosureEquivalence` — function

```ts
export function settlingClosureEquivalence(left: SettlingCarrier, right: SettlingCarrier): SettlingClosureEquivalenceJudgment
```

Compares two settlings by closure invariant, returning a witness when their non-Scott additions match stage-for-stage and cell-for-cell up to cell coincidence, otherwise an obstruction.

### `SettlingClosureEquivalenceJudgment` — type-alias

```ts
export type SettlingClosureEquivalenceJudgment = SettlingClosureEquivalenceWitness | SettlingClosureEquivalenceObstruction
```

Judgment on whether two settlings share a closure invariant: either a SettlingClosureEquivalenceWitness or a SettlingClosureEquivalenceObstruction.

### `SettlingClosureEquivalenceObstruction` — interface

```ts
export interface SettlingClosureEquivalenceObstruction
```

Obstruction recording that two settlings have differing closure invariants: carries both closure invariants compared.

### `SettlingClosureEquivalenceWitness` — interface

```ts
export interface SettlingClosureEquivalenceWitness
```

Witness that two settlings have equivalent closure invariants: carries both closure invariants compared.

### `settlingClosureInvariant` — function

```ts
export function settlingClosureInvariant(carrier: SettlingCarrier): SettlingClosureInvariant
```

The closure invariant of a settling: one step per non-Scott limit-stage firing recording the source stage and its deduplicated added cells.

### `SettlingClosureInvariant` — interface

```ts
export interface SettlingClosureInvariant
```

The closure invariant of a settling: the sequence of non-Scott additions, one step per non-Scott limit-stage firing.

### `SettlingClosureInvariantStep` — interface

```ts
export interface SettlingClosureInvariantStep
```

One step of the closure invariant: a non-Scott limit stage and the CellSet of cells added at it.

### `SettlingCofinalityCarrier` — type-alias

```ts
export type SettlingCofinalityCarrier = | CountableSettlingCofinalityCarrier | UncountableSettlingCofinalityCarrier
```

The declared cofinality of a settling sequence: either countable or uncountable.

### `settlingDepth` — const

```ts
export const settlingDepth = (carrier: SettlingCarrier): SettlingStageOrdinalCarrier => …
```

The settling depth: the depth field of the settling's classification, i.e. the ordinal of its last firing.

### `settlingDepthFiniteJudgment` — const

```ts
export const settlingDepthFiniteJudgment = (carrier: SettlingCarrier): SettlingFiniteStageJudgment => …
```

The finite-stage judgment applied to a settling's depth: a witness with its natural value when finite, otherwise an obstruction.

### `settlingFiniteStageJudgment` — function

```ts
export function settlingFiniteStageJudgment(stage: SettlingStageOrdinalCarrier | SettlingStage): SettlingFiniteStageJudgment
```

Judges whether the given stage ordinal (or stage) is finite, returning a witness with its natural value or an obstruction carrying the finite-ordinal reading.

### `SettlingFiniteStageJudgment` — type-alias

```ts
export type SettlingFiniteStageJudgment = SettlingFiniteStageWitness | SettlingFiniteStageObstruction
```

Judgment on whether a settling stage ordinal is finite: either a SettlingFiniteStageWitness or a SettlingFiniteStageObstruction.

### `SettlingFiniteStageObstruction` — interface

```ts
export interface SettlingFiniteStageObstruction
```

Obstruction recording that a stage ordinal is not finite: carries the stage ordinal and the finite-ordinal reading that failed to be a witness.

### `SettlingFiniteStageWitness` — interface

```ts
export interface SettlingFiniteStageWitness
```

Witness that a stage ordinal is finite: pairs the stage ordinal carrier with its natural-number value.

### `settlingFirings` — const

```ts
export const settlingFirings = (carrier: SettlingCarrier): readonly SettlingIncrement[] => …
```

The settling increments that actually add cells: the increments whose added CellSet is non-empty.

### `settlingFirstCohomology` — function

```ts
export function settlingFirstCohomology(carrier: SettlingCarrier): SettlingFirstCohomology
```

The degree-1 cohomology of a settling: one generator per cell added at a non-Scott limit-stage firing, the generator count as a rank, and the rank-vanishing judgment on it.

### `SettlingFirstCohomology` — interface

```ts
export interface SettlingFirstCohomology
```

The degree-1 cohomology of a settling: the generators from non-Scott limit-stage firings, their count as a rank, and the rank-vanishing judgment on that rank.

### `SettlingFirstCohomologyGenerator` — interface

```ts
export interface SettlingFirstCohomologyGenerator
```

A generator of the first cohomology of a settling: one cell added at a non-Scott limit-stage firing, paired with that source stage.

### `SettlingIncrement` — interface

```ts
export interface SettlingIncrement
```

The cells gained at one settling stage: the stage ordinal, the source stage, and the CellSet of cells added relative to the previous stage.

### `settlingIncrements` — function

```ts
export function settlingIncrements(carrier: SettlingCarrier): readonly SettlingIncrement[]
```

The per-stage increments of a settling: for each stage, the cells added relative to the previous stage (all designated cells at stage 0).

### `SettlingInitialStage` — interface

```ts
export interface SettlingInitialStage
```

Shape tag for the initial (zero-ordinal) settling stage: carries the stage ordinal carrier.

### `settlingInitialStageInput` — const

```ts
export const settlingInitialStageInput = (designated: readonly Cell[]): SettlingStageInputCarrier => …
```

Constructs the initial stage input from a list of designated cells, using the zero-ordinal carrier and initial shape.

### `settlingInitialStageOrdinal` — const

```ts
export const settlingInitialStageOrdinal = (): SettlingStageOrdinalCarrier => …
```

Constructs the stage ordinal carrier for the initial stage, wrapping the zero ordinal.

### `settlingInitialStageShape` — const

```ts
export const settlingInitialStageShape = (ordinal: SettlingStageOrdinalCarrier): SettlingInitialStage => …
```

Constructs the initial stage shape for the given stage ordinal carrier.

### `SettlingLimitStage` — interface

```ts
export interface SettlingLimitStage
```

Shape tag for a limit settling stage: carries the stage ordinal carrier.

### `SettlingLimitStageCarrier` — type-alias

```ts
export type SettlingLimitStageCarrier = SettlingStage & { readonly shape: SettlingLimitStage }
```

A settling stage refined to limit shape: a SettlingStage whose shape is a SettlingLimitStage.

### `settlingLimitStageInput` — const

```ts
export const settlingLimitStageInput = (ordinal: SettlingStageOrdinalCarrier, designated: readonly Cell[]): SettlingStageInputCarrier => …
```

Constructs a limit stage input at the given ordinal carrier with the supplied designated cells; throws if the ordinal is not a limit ordinal.

### `settlingLimitStageOrdinal` — const

```ts
export const settlingLimitStageOrdinal = (label: OrdinalLabel, fundamentalSequence: (n: Natural) => Ordinal): SettlingStageOrdinalCarrier => …
```

Constructs the stage ordinal carrier for a limit ordinal built from the given label and fundamental sequence.

### `settlingLimitStages` — const

```ts
export const settlingLimitStages = (carrier: SettlingCarrier): SettlingLimitStagesCarrier => …
```

The limit stages of a settling carrier: the limit-shaped stages and their count as a rank.

### `SettlingLimitStagesCarrier` — interface

```ts
export interface SettlingLimitStagesCarrier
```

The limit stages of a settling: the list of limit-shaped stages and their count as a rank.

### `settlingLimitStageShape` — const

```ts
export const settlingLimitStageShape = (ordinal: SettlingStageOrdinalCarrier): SettlingLimitStage => …
```

Constructs the limit stage shape for the given stage ordinal carrier.

### `SettlingStage` — interface

```ts
export interface SettlingStage
```

A normalized settling stage: its ordinal carrier, shape, and the CellSet of cells designated at that stage.

### `settlingStageDesignatedCells` — const

```ts
export const settlingStageDesignatedCells = (designated: readonly Cell[]): SettlingStageDesignatedCellsCarrier => …
```

Constructs a designated-cells carrier from a cell list, deduplicating coincident cells into a CellSet.

### `SettlingStageDesignatedCellsCarrier` — interface

```ts
export interface SettlingStageDesignatedCellsCarrier
```

The designated cells accumulated at a settling stage: a CellSet of the cells whose truth coordinate is present by that stage.

### `settlingStageInput` — const

```ts
export const settlingStageInput = (ordinal: SettlingStageOrdinalCarrier, designated: SettlingStageDesignatedCellsCarrier, shape: SettlingStageShape = settlingStageShape(ordinal)): SettlingStageInputCarrier => …
```

Assembles a stage input from an ordinal carrier, designated-cells carrier, and shape, defaulting the shape to the one derived from the ordinal.

### `SettlingStageInputCarrier` — interface

```ts
export interface SettlingStageInputCarrier
```

Input describing one settling stage before normalization: its ordinal carrier, computed shape, and the designated cells carrier supplied for that stage.

### `settlingStageOrdinal` — const

```ts
export const settlingStageOrdinal = (ordinal: Ordinal): SettlingStageOrdinalCarrier => …
```

Wraps an arbitrary ordinal as a settling stage ordinal carrier.

### `SettlingStageOrdinalCarrier` — interface

```ts
export interface SettlingStageOrdinalCarrier
```

The ordinal index of a settling stage: wraps an Ordinal as the stage coordinate in the transfinite settling sequence.

### `settlingStageOrdinalOfPredicationValuationClosureStage` — const

```ts
export const settlingStageOrdinalOfPredicationValuationClosureStage = (stage: PredicationValuationClosureStageCarrier): SettlingStageOrdinalCarrier => …
```

Maps a closure stage to a settling stage ordinal: extracts the stage's ordinal and wraps it as a settling-stage ordinal carrier.

### `settlingStageShape` — const

```ts
export const settlingStageShape = (ordinal: SettlingStageOrdinalCarrier): SettlingStageShape => …
```

Selects the stage shape from the stage ordinal: initial for zero, limit for a limit ordinal, otherwise successor.

### `SettlingStageShape` — type-alias

```ts
export type SettlingStageShape = SettlingInitialStage | SettlingSuccessorStage | SettlingLimitStage
```

The shape of a settling stage by its ordinal kind: initial, successor, or limit.

### `SettlingSuccessorStage` — interface

```ts
export interface SettlingSuccessorStage
```

Shape tag for a successor settling stage: carries the stage ordinal carrier.

### `settlingSuccessorStageInput` — const

```ts
export const settlingSuccessorStageInput = (previous: SettlingStageInputCarrier | SettlingStage, designated: readonly Cell[]): SettlingStageInputCarrier => …
```

Constructs a successor stage input following the given previous stage, with the successor of its ordinal and the supplied designated cells.

### `settlingSuccessorStageOrdinal` — const

```ts
export const settlingSuccessorStageOrdinal = (stage: SettlingStageOrdinalCarrier): SettlingStageOrdinalCarrier => …
```

Constructs the stage ordinal carrier for the successor of the given stage's ordinal.

### `settlingSuccessorStageShape` — const

```ts
export const settlingSuccessorStageShape = (ordinal: SettlingStageOrdinalCarrier): SettlingSuccessorStage => …
```

Constructs the successor stage shape for the given stage ordinal carrier.

### `SheafCarrier` — interface

```ts
export interface SheafCarrier
```

A sheaf carrier: holds the single global section valuation that the presheaf's traces glue to.

### `sheafFromValuation` — function

```ts
export function sheafFromValuation(section: Valuation): SheafCarrier
```

Builds a sheaf carrier from a valuation: takes the valuation as the sheaf's global section.

### `showOrdinal` — function

```ts
export function showOrdinal(ordinal: Ordinal): string
```

Renders an ordinal as a string: "0" for zero, the label mark for a limit, the counted value for a finite ordinal, otherwise the predecessor's rendering with "+1".

### `SingleSettlingCarrier` — interface

```ts
export interface SingleSettlingCarrier
```

The settling of a single utterance with its derivation kept: the meme it settles to together with the knowledge-closure trace that produced it.

### `SingleUtteranceInput` — type-alias

```ts
export type SingleUtteranceInput = UtteranceCarrier | readonly [left: Mark, right: Mark]
```

A single utterance admitted as evidence: either an already-built utterance carrier or a [left mark, right mark] pair to be promoted into one.

### `singleUtteranceTopology` — function

```ts
export function singleUtteranceTopology(left: Mark, right: Mark): MemeTopologyCarrier
```

Induces the meme topology of a single utterance given as its left and right marks.

### `specialization` — function

```ts
export function specialization( entities: EntitySet, support: readonly PredicateFiberCell[], ambient: readonly PredicateFiberCell[] = allCells(entities), ): FiberGenerator
```

The specialization generator restricting from an ambient cell set to a support subset: pullback reads the source on the support, while exists and forall keep source values on support cells and fill the rest with the order's bottom or top across the ambient cells.

### `StabilizingClosureRegime` — type-alias

```ts
export type StabilizingClosureRegime = | FiniteClosureRegime | ScottClosureRegime | TransfiniteClosureRegime
```

A closure regime in which the process stabilizes: finite, Scott, or transfinite.

### `stabilizingSup` — const

```ts
export const stabilizingSup = <T>(lattice: Pick<Lattice<T>, "eq">) => …
```

Builds a supremum operator from a lattice equality test: returns the first sequence value equal to its predecessor, assuming the sequence eventually stabilizes.

### `stableFiringType` — const

```ts
export const stableFiringType = (): StableFiringTypeCarrier => …
```

Constructs a frozen stable firing-type carrier.

### `StableFiringTypeCarrier` — interface

```ts
export interface StableFiringTypeCarrier
```

Carrier marking a firing whose truth and falsity sides are both present: the stable firing type.

### `stepNInvariant` — const

```ts
export const stepNInvariant = (matrix: Matrix): StepNInvariant => …
```

Computes the step-N invariant of a matrix: pairs its rank with the localized integer module from its colimit structure.

### `StepNInvariant` — interface

```ts
export interface StepNInvariant
```

The step-N invariant of a substitution matrix: its matrix rank and the localized integer module from its colimit structure.

### `subjectProjection` — function

```ts
export function subjectProjection(entities: EntitySet): FiberGenerator
```

The subject-projection generator over an entity set: pullback reads the diagonal cell for each subject, while exists and forall fold the join or meet over all objects onto diagonal cells, leaving off-diagonal cells at the order's bottom or top.

### `subjectsFor` — function

```ts
export function subjectsFor(section: SectionCarrier, predicate: TermInput): readonly SectionEntry[]
```

The section entries whose cell predicate coincides with the given term: every subject that bears that predicate.

### `substitute` — const

```ts
export const substitute = (rule: SubstitutionRule, word: SubstitutionWord): SubstitutionWord => …
```

Applies a substitution rule once to a word: replaces each letter by its rule image, leaving letters with no rule entry unchanged.

### `substitutionCarrier` — function

```ts
export function substitutionCarrier(rule: SubstitutionRule, alphabet: readonly SubstitutionSymbol[] = rule.entries.map((entry) => entry.symbol)): SubstitutionCarrier
```

Constructs a substitution dynamical system from a rule and optional alphabet: defaults the alphabet to the symbols on the left of the rule's entries.

### `SubstitutionCarrier` — interface

```ts
export interface SubstitutionCarrier
```

A substitution dynamical system: a rule together with the alphabet of symbols it acts on.

### `SubstitutionClosureCarrier` — interface

```ts
export interface SubstitutionClosureCarrier
```

The fixed-point closure of a substitution: a lattice over infinite words together with the substitution map phi acting on them.

### `substitutionDual` — function

```ts
export function substitutionDual(matrix: Matrix): SubstitutionDual
```

Computes the dual of a substitution matrix: pairs the sheaf colimit of the transpose with the cosheaf colimit of the matrix and judges whether their rank, determinant, and Smith factors agree.

### `SubstitutionDual` — interface

```ts
export interface SubstitutionDual
```

The dual of a substitution matrix: the sheaf colimit (from the transpose), the cosheaf colimit (from the matrix), and the duality judgment relating them.

### `SubstitutionIncidenceMatrix` — type-alias

```ts
export type SubstitutionIncidenceMatrix = Matrix
```

The incidence (abelianization) matrix of a substitution: a matrix whose entries count letter occurrences in each rule image.

### `substitutionOrbit` — function

```ts
export function* substitutionOrbit(rule: SubstitutionRule, seed: SubstitutionWord): Generator<SubstitutionWord>
```

Generates the orbit of a seed word under a substitution rule: yields the seed, then each successive substitution image, indefinitely.

### `substitutionRule` — function

```ts
export function substitutionRule(entries: readonly SubstitutionRuleEntry[]): SubstitutionRule
```

Constructs a substitution rule from a list of entries: returns a frozen rule with a copied entry list.

### `SubstitutionRule` — interface

```ts
export interface SubstitutionRule
```

A substitution morphism: the collection of rule entries mapping each symbol to its image word.

### `substitutionRuleEntry` — function

```ts
export function substitutionRuleEntry(symbol: SubstitutionSymbol, word: SubstitutionWord): SubstitutionRuleEntry
```

Constructs a rule entry pairing a symbol with its image word: returns a frozen entry with a copied word.

### `SubstitutionRuleEntry` — interface

```ts
export interface SubstitutionRuleEntry
```

One production of a substitution rule: maps a single symbol to the word it expands into.

### `substitutionRuleSelfDual` — function

```ts
export function substitutionRuleSelfDual( matrix: SubstitutionIncidenceMatrix, labeling: readonly ChargeValue[], sigma: GaugeElementName, ): SubstitutionSelfDualityJudgment
```

Tests whether a substitution incidence matrix is self-dual under a gauge: checks that the gauge induces a value permutation, that the permutation matrix commutes with the incidence matrix, and that the permutation is an involution.

### `SubstitutionSelfDualityJudgment` — type-alias

```ts
export type SubstitutionSelfDualityJudgment = SubstitutionSelfDualityWitness | SubstitutionSelfDualityObstruction
```

The result of testing a substitution rule for gauge self-duality: either a self-duality witness or an obstruction.

### `SubstitutionSelfDualityObstruction` — interface

```ts
export interface SubstitutionSelfDualityObstruction
```

Evidence that a substitution rule is not self-dual: the gauge permutation obstruction that prevented the duality check.

### `SubstitutionSelfDualityWitness` — interface

```ts
export interface SubstitutionSelfDualityWitness
```

Evidence that a substitution rule is self-dual under a gauge: the gauge permutation witness, the commutation of incidence matrix with the permutation, and the gauge involution check.

### `substitutionSymbol` — function

```ts
export function substitutionSymbol(mark: Mark): SubstitutionSymbol
```

Constructs a substitution symbol from a mark: returns a frozen dynamics symbol wrapping that mark.

### `SubstitutionSymbol` — interface

```ts
export interface SubstitutionSymbol
```

A single letter of a substitution alphabet: a mark wrapped as a dynamics symbol so symbols compare by mark coincidence.

### `SubstitutionWord` — type-alias

```ts
export type SubstitutionWord = readonly SubstitutionSymbol[]
```

A finite word over the substitution alphabet: a readonly sequence of substitution symbols.

### `successorOrdinal` — const

```ts
export const successorOrdinal = (predecessorOrdinal: Ordinal): SuccessorOrdinal => …
```

Constructs the successor of the given ordinal.

### `SuccessorOrdinal` — interface

```ts
export interface SuccessorOrdinal
```

A successor ordinal: wraps its immediate predecessor, denoting predecessor + 1.

### `TermInput` — type-alias

```ts
export type TermInput = string | Mark
```

Term inputs at the value-level read facade: strings pass through `mark()`.

### `topologyVitals` — function

```ts
export function topologyVitals(carrier: MemeTopologyCarrier): TopologyVitalsCarrier
```

The vitals of a carrier: takes its knowledge-least section, partitions it, and reports cell count, contradiction (stable) count, residue (absurd) count, and the settling regime.

### `TopologyVitalsCarrier` — interface

```ts
export interface TopologyVitalsCarrier
```

A summary of a meme topology's state: total cells, count of held contradictions, count of no-evidence residue, and the settling regime.

### `transfiniteClosureRegime` — const

```ts
export const transfiniteClosureRegime = (): TransfiniteClosureRegime => …
```

Constructs the transfinite closure regime value.

### `TransfiniteClosureRegime` — interface

```ts
export interface TransfiniteClosureRegime
```

The transfinite closure regime: stabilization occurs at a limit ordinal beyond omega.

### `transportValuationAlongPredicationGenerators` — function

```ts
export function transportValuationAlongPredicationGenerators( valuation: Valuation, fold: (left: ChargeCarrier, right: ChargeCarrier) => ChargeCarrier = joinKnowledge, ): Valuation
```

Transports a valuation along the predication generators: closes the base under specialization and recomposes the valuation's memes over it, folding duplicate cells with the given charge fold (knowledge join by default).

### `transposeSubstitutionMatrix` — function

```ts
export function transposeSubstitutionMatrix(matrix: SubstitutionIncidenceMatrix): SubstitutionIncidenceMatrix
```

Returns the transpose of a substitution incidence matrix.

### `truthClosureEndomorphism` — const

```ts
export const truthClosureEndomorphism = (valuation: Valuation): Valuation => …
```

The truth closure endomorphism: truth-raises a valuation then transports it along the predication generators, folding duplicates by the truth join.

### `truthGreatestFixedPoint` — function

```ts
export function truthGreatestFixedPoint(p: PresheafCarrier): FixedPointExtremum
```

Computes the greatest fixed point in the truth order, seeded from the presheaf's first trace with unevidenced falsity sides forced absent.

### `truthLeastFixedPoint` — function

```ts
export function truthLeastFixedPoint(p: PresheafCarrier): FixedPointExtremum
```

Computes the least fixed point in the truth order, seeded from the presheaf's first trace valuation.

### `truthOnlyFiringOrbitType` — const

```ts
export const truthOnlyFiringOrbitType = (): TruthOnlyFiringOrbitTypeCarrier => …
```

Constructs a frozen truth-only firing orbit-type carrier.

### `TruthOnlyFiringOrbitTypeCarrier` — interface

```ts
export interface TruthOnlyFiringOrbitTypeCarrier
```

Carrier marking a firing orbit composed only of truth-only firings: the truth-only orbit type.

### `truthOnlyFiringType` — const

```ts
export const truthOnlyFiringType = (): TruthOnlyFiringTypeCarrier => …
```

Constructs a frozen truth-only firing-type carrier.

### `TruthOnlyFiringTypeCarrier` — interface

```ts
export interface TruthOnlyFiringTypeCarrier
```

Carrier marking a firing whose truth side is present and falsity side absent: the truth-only firing type.

### `truthOrder` — function

```ts
export function truthOrder(): Order
```

The truth order on charge values: joins and meets by truth, with "active" as bottom and "potential" as top.

### `truthValuationClosure` — function

```ts
export function truthValuationClosure(p: PresheafCarrier): PredicationValuationClosureCarrier
```

Computes the truth closure of a presheaf: closes the truth-order process seeded by the presheaf's first valuation.

### `truthValuationClosureLattice` — function

```ts
export function truthValuationClosureLattice(bottom: Valuation): Lattice<Valuation>
```

Builds the valuation closure lattice with the given bottom, joining valuations by folding shared cells with the truth join.

### `truthValuationClosureOrder` — const

```ts
export const truthValuationClosureOrder = (): PredicationValuationClosureOrderCarrier => …
```

Builds the truth closure order carrier: names it "truth" and binds its endomorphism and lattice.

### `uncountableSettlingCofinality` — const

```ts
export const uncountableSettlingCofinality = (): UncountableSettlingCofinalityCarrier => …
```

Constructs the uncountable cofinality witness for a settling.

### `UncountableSettlingCofinalityCarrier` — interface

```ts
export interface UncountableSettlingCofinalityCarrier
```

Cofinality witness marking the settling sequence as having uncountable cofinality (kappa >= omega-1), the standing required for the aperiodic regime.

### `utteranceKnowledgeClosureCohomology` — function

```ts
export function utteranceKnowledgeClosureCohomology(left: Mark, right: Mark): CohomologyCarrier
```

Computes the cohomology of the knowledge closure sheaf of the predicate positing the articulated utterance of two marks.

### `Valuation` — interface

```ts
export interface Valuation
```

A valuation of a predication: the base of the underlying predication carrier together with one fiber algebra per predicate.

### `ValuationAssignmentConsistencyWitness` — interface

```ts
export interface ValuationAssignmentConsistencyWitness
```

Witness that a single valuation assignment is charge-consistent: pairs the assignment meme with its charge value and the underlying charge-consistency judgment that classified it as consistent.

### `ValuationAssignmentContradictionWitness` — interface

```ts
export interface ValuationAssignmentContradictionWitness
```

Witness that a single valuation assignment is charge-contradictory: pairs the assignment meme with its charge value and the underlying charge-consistency judgment that classified it as contradictory.

### `valuationClosureLattice` — function

```ts
export function valuationClosureLattice(bottom: Valuation): Lattice<Valuation>
```

Builds the valuation closure lattice with the given bottom, joining valuations by folding shared cells with the knowledge join.

### `valuationConsistency` — function

```ts
export function valuationConsistency(valuation: Valuation): PredicationValuationConsistencyCarrier
```

Computes the full consistency analysis of a valuation: reads each assignment's charge value through charge-consistency to classify it as consistent or contradictory, partitions the readings, and assembles the carrier with ranks, vanishing judgment, and consistent and contradictory subvaluations.

### `ValuationConsistencyJudgment` — type-alias

```ts
export type ValuationConsistencyJudgment = | ValuationAssignmentConsistencyWitness | ValuationAssignmentContradictionWitness
```

A per-assignment consistency reading: either a consistency witness or a contradiction witness for one valuation assignment.

### `valuationConsistencyReadings` — const

```ts
export const valuationConsistencyReadings = (readings: readonly ValuationConsistencyJudgment[]): ValuationConsistencyReadingsCarrier => …
```

Wraps a list of per-assignment consistency judgments into a readings carrier, setting rank to the number of readings.

### `ValuationConsistencyReadingsCarrier` — interface

```ts
export interface ValuationConsistencyReadingsCarrier
```

Carrier holding all per-assignment consistency readings for a valuation, with rank counting the number of readings.

### `valuationConsistencyVanishing` — const

```ts
export const valuationConsistencyVanishing = (contradictions: ValuationContradictoryAssignmentsCarrier): ValuationConsistencyVanishingJudgment => …
```

Decides the vanishing judgment from a contradictory-assignments carrier: returns a vanishing witness when its rank is zero, otherwise a vanishing obstruction carrying the contradictions.

### `ValuationConsistencyVanishingJudgment` — type-alias

```ts
export type ValuationConsistencyVanishingJudgment = | ValuationConsistencyVanishingWitness | ValuationConsistencyVanishingObstruction
```

Judgment on whether a valuation's contradictions vanish: either a vanishing witness or a vanishing obstruction.

### `ValuationConsistencyVanishingObstruction` — interface

```ts
export interface ValuationConsistencyVanishingObstruction
```

Obstruction to consistency vanishing: carries the nonzero contradiction rank and the contradictory-assignments carrier that prevents vanishing.

### `ValuationConsistencyVanishingWitness` — interface

```ts
export interface ValuationConsistencyVanishingWitness
```

Witness that a valuation's contradiction obstruction vanishes: carries the contradiction rank, which is zero when no contradictory assignments exist.

### `valuationConsistentAssignments` — const

```ts
export const valuationConsistentAssignments = (readings: readonly ValuationConsistencyJudgment[]): ValuationConsistentAssignmentsCarrier => …
```

Filters consistency judgments down to the consistency witnesses and returns them as a consistent-assignments carrier, with rank counting the matches.

### `ValuationConsistentAssignmentsCarrier` — interface

```ts
export interface ValuationConsistentAssignmentsCarrier
```

Carrier holding the consistency witnesses among a valuation's readings, with rank counting the consistent assignments.

### `valuationContradictoryAssignments` — const

```ts
export const valuationContradictoryAssignments = (readings: readonly ValuationConsistencyJudgment[]): ValuationContradictoryAssignmentsCarrier => …
```

Filters consistency judgments down to the contradiction witnesses and returns them as a contradictory-assignments carrier, with rank counting the matches.

### `ValuationContradictoryAssignmentsCarrier` — interface

```ts
export interface ValuationContradictoryAssignmentsCarrier
```

Carrier holding the contradiction witnesses among a valuation's readings, with rank counting the contradictory assignments.

### `valuationFromPredicateFiber` — function

```ts
export function valuationFromPredicateFiber(fiber: PredicateFiber, base: PredicationCarrier["base"]): Valuation
```

Converts a predicate fiber back into a valuation over the given base: one fiber algebra holding a meme per cell, using the fiber's charge-carrier reader when present and otherwise a charge built from its value.

### `ValuedFiring` — interface

```ts
export interface ValuedFiring
```

A firing paired with a value: its settling stage ordinal and the charge value assigned at that stage.

### `valuedFiringsFromSettling` — function

```ts
export function valuedFiringsFromSettling(carrier: SettlingCarrier, values: readonly ChargeValue[]): readonly ValuedFiring[]
```

Pairs the non-Scott firings of a settling carrier with the given charge values in order, returning valued firings; throws RangeError when the value count does not match the firing count.

### `ZeroCoboundaryMatrixCarrier` — interface

```ts
export interface ZeroCoboundaryMatrixCarrier
```

The zeroth coboundary operator of a predication complex: holds the entity terms, the cells, and the incidence matrix whose rows are cells and columns are entities, with +1 on the object and -1 on the subject of each cell.

### `ZeroCohomologyCarrier` — interface

```ts
export interface ZeroCohomologyCarrier
```

The zeroth cohomology of a predication complex: its rank counts the connected components of the entity graph, and cocycleBasis is the matrix of per-component indicator vectors spanning the space of locally constant functions.

### `zeroOrdinal` — const

```ts
export const zeroOrdinal = (): ZeroOrdinal => …
```

Constructs the zero ordinal.

### `ZeroOrdinal` — interface

```ts
export interface ZeroOrdinal
```

The zero ordinal: the base point of the ordinal tower, denoting 0.
