import {
  predicationBaseObjectCoincidenceHolds,
  predicationCellCoincidenceHolds,
  predicationNodeCoincidenceHolds,
  predicationPredicateCoincidenceHolds,
  predicationTermCoincidenceHolds,
} from "./carrier-coincidence.mjs";
import { mark, token, type ArticulationCarrier, type Claim, type Token } from "./utterance.mjs";

export type PredicationTerm = Token | Claim;
export type PredicationPredicate = Claim;
export type PredicationNode = readonly [PredicationTerm, PredicationPredicate, PredicationTerm];
export type PredicationBaseObject = PredicationTerm | PredicationPredicate | PredicationNode;
export type PredicationDatum = Cell | SpecializationMorphism;

export interface Cell {
  readonly subject: PredicationTerm;
  readonly predicate: PredicationPredicate;
  readonly object: PredicationTerm;
}

export interface Edge<Domain = PredicationBaseObject, Codomain = PredicationBaseObject> {
  readonly domain: Domain;
  readonly codomain: Codomain;
}

export interface SpecializationMorphism extends Edge<PredicationTerm, PredicationTerm> {
  readonly kind: "predication.specialization";
}

export interface EntitySet<T = PredicationTerm> {
  readonly kind: "predication.entitySet";
  readonly entities: readonly T[];
}

export interface PredicateSet<T = PredicationPredicate> {
  readonly kind: "predication.predicateSet";
  readonly predicates: readonly T[];
}

export interface CellSet {
  readonly kind: "predication.cellSet";
  readonly cells: readonly Cell[];
  readonly entities: EntitySet<PredicationTerm>;
  readonly predicates: PredicateSet<PredicationPredicate>;
}

export interface BaseCategory {
  readonly kind: "predication.base";
  readonly objects: readonly PredicationBaseObject[];
  readonly specialization: readonly Edge<PredicationTerm, PredicationTerm>[];
  readonly converse: readonly Edge<PredicationNode, PredicationNode>[];
  readonly subjectProjection: readonly Edge<PredicationNode, PredicationTerm>[];
  readonly objectProjection: readonly Edge<PredicationNode, PredicationTerm>[];
}

export interface PredicationCarrier {
  readonly kind: "predication.carrier";
  readonly cells: CellSet;
  readonly specializations: readonly SpecializationMorphism[];
  readonly base: BaseCategory;
}

export interface CoherenceCarrier {
  readonly kind: "predication.coherence";
  readonly saturated: CellSet;
  readonly residue: PredicationCarrier;
}

export interface PredicationTermIdentityWitness {
  readonly kind: "predication.termIdentity:witness";
  readonly left: PredicationTerm;
  readonly right: PredicationTerm;
}

export interface PredicationTermIdentityObstruction {
  readonly kind: "predication.termIdentity-obstruction";
  readonly left: PredicationTerm;
  readonly right: PredicationTerm;
}

export type PredicationTermIdentityJudgment = PredicationTermIdentityWitness | PredicationTermIdentityObstruction;

export interface PredicationPredicateIdentityWitness {
  readonly kind: "predication.predicateIdentity:witness";
  readonly left: PredicationPredicate;
  readonly right: PredicationPredicate;
}

export interface PredicationPredicateIdentityObstruction {
  readonly kind: "predication.predicateIdentity-obstruction";
  readonly left: PredicationPredicate;
  readonly right: PredicationPredicate;
}

export type PredicationPredicateIdentityJudgment = PredicationPredicateIdentityWitness | PredicationPredicateIdentityObstruction;

export interface CellIdentityWitness {
  readonly kind: "predication.cellIdentity:witness";
  readonly left: Cell;
  readonly right: Cell;
}

export interface CellIdentityObstruction {
  readonly kind: "predication.cellIdentity-obstruction";
  readonly left: Cell;
  readonly right: Cell;
}

export type CellIdentityJudgment = CellIdentityWitness | CellIdentityObstruction;

export interface PredicationNodeIdentityWitness {
  readonly kind: "predication.nodeIdentity:witness";
  readonly left: PredicationNode;
  readonly right: PredicationNode;
}

export interface PredicationNodeIdentityObstruction {
  readonly kind: "predication.nodeIdentity-obstruction";
  readonly left: PredicationNode;
  readonly right: PredicationNode;
}

export type PredicationNodeIdentityJudgment = PredicationNodeIdentityWitness | PredicationNodeIdentityObstruction;

export interface PredicationBaseObjectIdentityWitness {
  readonly kind: "predication.baseObjectIdentity:witness";
  readonly left: PredicationBaseObject;
  readonly right: PredicationBaseObject;
}

export interface PredicationBaseObjectIdentityObstruction {
  readonly kind: "predication.baseObjectIdentity-obstruction";
  readonly left: PredicationBaseObject;
  readonly right: PredicationBaseObject;
}

export type PredicationBaseObjectIdentityJudgment = PredicationBaseObjectIdentityWitness | PredicationBaseObjectIdentityObstruction;

export function predicationTermIdentity(left: PredicationTerm, right: PredicationTerm): PredicationTermIdentityJudgment {
  return predicationTermCoincidenceHolds(left, right)
    ? Object.freeze({ kind: "predication.termIdentity:witness" as const, left, right })
    : Object.freeze({ kind: "predication.termIdentity-obstruction" as const, left, right });
}

export function predicationPredicateIdentity(left: PredicationPredicate, right: PredicationPredicate): PredicationPredicateIdentityJudgment {
  return predicationPredicateCoincidenceHolds(left, right)
    ? Object.freeze({ kind: "predication.predicateIdentity:witness" as const, left, right })
    : Object.freeze({ kind: "predication.predicateIdentity-obstruction" as const, left, right });
}

export function cellIdentity(left: Cell, right: Cell): CellIdentityJudgment {
  return predicationCellCoincidenceHolds(left, right)
    ? Object.freeze({ kind: "predication.cellIdentity:witness" as const, left, right })
    : Object.freeze({ kind: "predication.cellIdentity-obstruction" as const, left, right });
}

export function predicationNodeIdentity(left: PredicationNode, right: PredicationNode): PredicationNodeIdentityJudgment {
  return predicationNodeCoincidenceHolds(left, right)
    ? Object.freeze({ kind: "predication.nodeIdentity:witness" as const, left, right })
    : Object.freeze({ kind: "predication.nodeIdentity-obstruction" as const, left, right });
}

export function predicationBaseObjectIdentity(left: PredicationBaseObject, right: PredicationBaseObject): PredicationBaseObjectIdentityJudgment {
  return predicationBaseObjectCoincidenceHolds(left, right)
    ? Object.freeze({ kind: "predication.baseObjectIdentity:witness" as const, left, right })
    : Object.freeze({ kind: "predication.baseObjectIdentity-obstruction" as const, left, right });
}

function uniqueBy<T>(values: Iterable<T>, same: (left: T, right: T) => boolean): readonly T[] {
  const out: T[] = [];
  for (const value of values) if (!out.some((item) => same(item, value))) out.push(value);
  return Object.freeze(out);
}

export function entitySet<T = PredicationTerm>(
  entities: Iterable<T>,
  same: (left: T, right: T) => boolean,
): EntitySet<T> {
  return Object.freeze({
    kind: "predication.entitySet" as const,
    entities: uniqueBy([...entities], same),
  });
}

export function predicateSet<T = PredicationPredicate>(
  predicates: Iterable<T>,
  same: (left: T, right: T) => boolean,
): PredicateSet<T> {
  return Object.freeze({
    kind: "predication.predicateSet" as const,
    predicates: uniqueBy([...predicates], same),
  });
}

export function cellSet(cells: readonly Cell[]): CellSet {
  const witnessedCells = uniqueBy(cells, predicationCellCoincidenceHolds);
  return Object.freeze({
    kind: "predication.cellSet" as const,
    cells: Object.freeze(witnessedCells),
    entities: entitySet(witnessedCells.flatMap((c) => [c.subject, c.object]), predicationTermCoincidenceHolds),
    predicates: predicateSet(witnessedCells.map((c) => c.predicate), predicationPredicateCoincidenceHolds),
  });
}

export function cell(subject: PredicationTerm, predicate: PredicationPredicate, object: PredicationTerm): Cell {
  if (subject === undefined || predicate === undefined || object === undefined || object === null) {
    throw new TypeError("cell: subject, predicate, and non-null object must be present");
  }
  return Object.freeze({ subject, predicate, object });
}

export const isCell = (value: unknown): value is Cell =>
  typeof value === "object" && value !== null && "subject" in value && "predicate" in value && "object" in value;

export function specializationMorphism(specialized: PredicationTerm, general: PredicationTerm): SpecializationMorphism {
  return Object.freeze({
    kind: "predication.specialization" as const,
    domain: general,
    codomain: specialized,
  });
}

export function isSpecializationMorphism(value: unknown): value is SpecializationMorphism {
  return typeof value === "object" && value !== null && (value as SpecializationMorphism).kind === "predication.specialization";
}

export function predicationCarrier(witnesses: readonly PredicationDatum[]): PredicationCarrier {
  const cells = witnesses.filter(isCell);
  const specializations = witnesses.filter(isSpecializationMorphism);
  const cellCarrier = cellSet(cells);
  const nodeOf = (c: Cell): PredicationNode => Object.freeze([c.subject, c.predicate, c.object] as const);
  const base = Object.freeze({
    kind: "predication.base" as const,
    objects: uniqueBy([...cellCarrier.entities.entities, ...cellCarrier.predicates.predicates], predicationBaseObjectCoincidenceHolds),
    specialization: Object.freeze(specializations),
    converse: Object.freeze(cellCarrier.cells.map((c) => Object.freeze({ domain: nodeOf(c), codomain: Object.freeze([c.object, c.predicate, c.subject] as const) }))),
    subjectProjection: Object.freeze(cellCarrier.cells.map((c) => Object.freeze({ domain: nodeOf(c), codomain: c.subject }))),
    objectProjection: Object.freeze(cellCarrier.cells.map((c) => Object.freeze({ domain: nodeOf(c), codomain: c.object }))),
  });
  return Object.freeze({
    kind: "predication.carrier" as const,
    cells: cellCarrier,
    specializations: Object.freeze(specializations),
    base,
  });
}

/** The claim concept whose relational cells also install specialization
 *  edges in the base: taxonomy is itself claimed, never separately admitted. */
export const specializationClaimValue = "specializes";

/** Read a token's mark for relational structure. A mark value shaped exactly
 *  `{ subject, object }` is the pair a relational cell spans; any other value
 *  is an atomic token. Marks are rich structures — this read is the
 *  transfinite regime's "read the object/concept off the given". */
const relationalReading = (value: unknown): { readonly subject: unknown; readonly object: unknown } | undefined => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return undefined;
  const record = value as { readonly subject?: unknown; readonly object?: unknown };
  if (Object.keys(record).length !== 2 || record.subject === undefined || record.object === undefined) return undefined;
  return record as { readonly subject: unknown; readonly object: unknown };
};

/** The transfinite regime: build the relational sites from the articulated
 *  givens. A token whose mark reads as a `{ subject, object }` pair
 *  articulates the relational cell between the pair's tokens; any other token
 *  articulates the diagonal cell. A relational cell whose claim is the
 *  specialization concept also installs the specialization edge. The sites
 *  carry no charge — `posit` is the first morphism to value them. */
export function predicate(articulations: readonly ArticulationCarrier[]): PredicationCarrier {
  const data: PredicationDatum[] = [];
  for (const articulation of articulations) {
    const given = articulation.polarization.positive;
    const predicator = articulation.polarization.negative;
    const pair = relationalReading(given.mark.value);
    if (pair === undefined) {
      data.push(cell(given, predicator, given));
      continue;
    }
    const subject = token(mark(pair.subject));
    const object = token(mark(pair.object));
    data.push(cell(subject, predicator, object));
    if (predicator.mark.value === specializationClaimValue) data.push(specializationMorphism(subject, object));
  }
  return predicationCarrier(data);
}

export function closeSpecialization(base: BaseCategory): BaseCategory {
  const edges = base.specialization.map((edge) => [edge.domain, edge.codomain] as const);
  const has = (domain: PredicationTerm, codomain: PredicationTerm): boolean =>
    edges.some(([d, c]) => predicationTermCoincidenceHolds(d, domain) && predicationTermCoincidenceHolds(c, codomain));
  let changed = true;
  while (changed) {
    changed = false;
    for (const [leftDomain, leftCodomain] of [...edges]) {
      for (const [rightDomain, rightCodomain] of [...edges]) {
        if (predicationTermCoincidenceHolds(leftCodomain, rightDomain) && !has(leftDomain, rightCodomain)) {
          edges.push([leftDomain, rightCodomain] as const);
          changed = true;
        }
      }
    }
  }
  return Object.freeze({
    ...base,
    specialization: Object.freeze(edges.map(([domain, codomain]) => Object.freeze({ domain, codomain }))),
  });
}

export function cohere(predication: PredicationCarrier): CoherenceCarrier {
  return Object.freeze({
    kind: "predication.coherence" as const,
    saturated: predication.cells,
    residue: Object.freeze({
      kind: "predication.carrier" as const,
      cells: predication.cells,
      specializations: predication.specializations,
      base: closeSpecialization(predication.base),
    }),
  });
}

export interface UnrelatedPairsCarrier {
  readonly kind: "predication.unrelatedPairs";
  readonly edges: readonly Edge[];
}

export function unrelatedPairs(predication: PredicationCarrier): UnrelatedPairsCarrier {
  const closed = closeSpecialization(predication.base);
  const related = (domain: PredicationTerm, codomain: PredicationTerm): boolean =>
    closed.specialization.some((edge) => predicationTermCoincidenceHolds(edge.domain, domain) && predicationTermCoincidenceHolds(edge.codomain, codomain));
  const edges: Edge[] = [];
  for (const domain of predication.cells.entities.entities) {
    for (const codomain of predication.cells.entities.entities) {
      if (!related(domain, codomain)) edges.push(Object.freeze({ domain, codomain }));
    }
  }
  return Object.freeze({ kind: "predication.unrelatedPairs" as const, edges: Object.freeze(edges) });
}
