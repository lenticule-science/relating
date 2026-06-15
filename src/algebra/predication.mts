import {
  predicationBaseObjectCoincidenceHolds,
  predicationCellCoincidenceHolds,
  predicationNodeCoincidenceHolds,
  predicationPredicateCoincidenceHolds,
  predicationTermCoincidenceHolds,
} from "./carrier-coincidence.mjs";
import { mark, token, type ArticulationCarrier, type Claim, type Token } from "./utterance.mjs";

/**
 * A term in a predication: either an atomic token or a nested claim, occupying
 * a subject or object position.
 */
export type PredicationTerm = Token | Claim;
/**
 * A predicate in a predication: the claim that relates a cell's subject to its
 * object.
 */
export type PredicationPredicate = Claim;
/**
 * A predication node: the immutable subject-predicate-object triple read off a
 * cell.
 */
export type PredicationNode = readonly [PredicationTerm, PredicationPredicate, PredicationTerm];
/**
 * An object of the base category: a term, a predicate, or a predication node.
 */
export type PredicationBaseObject = PredicationTerm | PredicationPredicate | PredicationNode;
/**
 * A datum admitted when building a predication carrier: either a cell or a
 * specialization morphism.
 */
export type PredicationDatum = Cell | SpecializationMorphism;

/** A relational cell: a subject term, a predicate, and an object term. */
export interface Cell {
  readonly subject: PredicationTerm;
  readonly predicate: PredicationPredicate;
  readonly object: PredicationTerm;
}

/**
 * A directed edge in the base category from a domain object to a codomain
 * object.
 */
export interface Edge<Domain = PredicationBaseObject, Codomain = PredicationBaseObject> {
  readonly domain: Domain;
  readonly codomain: Codomain;
}

/**
 * A specialization edge between terms, tagged with kind
 * "predication.specialization": its domain is the general term and its codomain
 * the specialized term.
 */
export interface SpecializationMorphism extends Edge<PredicationTerm, PredicationTerm> {
  readonly kind: "predication.specialization";
}

/**
 * A deduplicated collection of entity terms appearing as cell subjects or
 * objects.
 */
export interface EntitySet<T = PredicationTerm> {
  readonly kind: "predication.entitySet";
  readonly entities: readonly T[];
}

/** A deduplicated collection of the predicates appearing in cells. */
export interface PredicateSet<T = PredicationPredicate> {
  readonly kind: "predication.predicateSet";
  readonly predicates: readonly T[];
}

/**
 * A deduplicated set of cells together with the entity set of their subjects
 * and objects and the predicate set of their predicates.
 */
export interface CellSet {
  readonly kind: "predication.cellSet";
  readonly cells: readonly Cell[];
  readonly entities: EntitySet<PredicationTerm>;
  readonly predicates: PredicateSet<PredicationPredicate>;
}

/**
 * The base category of a predication: its objects, specialization edges, and
 * the converse, subject-projection, and object-projection edges derived from
 * the cells' nodes.
 */
export interface BaseCategory {
  readonly kind: "predication.base";
  readonly objects: readonly PredicationBaseObject[];
  readonly specialization: readonly Edge<PredicationTerm, PredicationTerm>[];
  readonly converse: readonly Edge<PredicationNode, PredicationNode>[];
  readonly subjectProjection: readonly Edge<PredicationNode, PredicationTerm>[];
  readonly objectProjection: readonly Edge<PredicationNode, PredicationTerm>[];
}

/**
 * A predication carrier: the cell set, the specialization morphisms, and the
 * base category derived from them.
 */
export interface PredicationCarrier {
  readonly kind: "predication.carrier";
  readonly cells: CellSet;
  readonly specializations: readonly SpecializationMorphism[];
  readonly base: BaseCategory;
}

/**
 * The result of cohering a predication: the saturated cell set and the residue
 * carrier whose base has its specialization relation transitively closed.
 */
export interface CoherenceCarrier {
  readonly kind: "predication.coherence";
  readonly saturated: CellSet;
  readonly residue: PredicationCarrier;
}

/**
 * Witness that two terms coincide, tagged "predication.termIdentity:witness"
 * and carrying the two terms.
 */
export interface PredicationTermIdentityWitness {
  readonly kind: "predication.termIdentity:witness";
  readonly left: PredicationTerm;
  readonly right: PredicationTerm;
}

/**
 * Obstruction recording that two terms do not coincide, tagged
 * "predication.termIdentity-obstruction" and carrying the two terms.
 */
export interface PredicationTermIdentityObstruction {
  readonly kind: "predication.termIdentity-obstruction";
  readonly left: PredicationTerm;
  readonly right: PredicationTerm;
}

/**
 * The judgment of term identity: either a witness of coincidence or an
 * obstruction.
 */
export type PredicationTermIdentityJudgment = PredicationTermIdentityWitness | PredicationTermIdentityObstruction;

/**
 * Witness that two predicates coincide, tagged
 * "predication.predicateIdentity:witness" and carrying the two predicates.
 */
export interface PredicationPredicateIdentityWitness {
  readonly kind: "predication.predicateIdentity:witness";
  readonly left: PredicationPredicate;
  readonly right: PredicationPredicate;
}

/**
 * Obstruction recording that two predicates do not coincide, tagged
 * "predication.predicateIdentity-obstruction" and carrying the two predicates.
 */
export interface PredicationPredicateIdentityObstruction {
  readonly kind: "predication.predicateIdentity-obstruction";
  readonly left: PredicationPredicate;
  readonly right: PredicationPredicate;
}

/**
 * The judgment of predicate identity: either a witness of coincidence or an
 * obstruction.
 */
export type PredicationPredicateIdentityJudgment = PredicationPredicateIdentityWitness | PredicationPredicateIdentityObstruction;

/**
 * Witness that two cells coincide, tagged "predication.cellIdentity:witness"
 * and carrying the two cells.
 */
export interface CellIdentityWitness {
  readonly kind: "predication.cellIdentity:witness";
  readonly left: Cell;
  readonly right: Cell;
}

/**
 * Obstruction recording that two cells do not coincide, tagged
 * "predication.cellIdentity-obstruction" and carrying the two cells.
 */
export interface CellIdentityObstruction {
  readonly kind: "predication.cellIdentity-obstruction";
  readonly left: Cell;
  readonly right: Cell;
}

/**
 * The judgment of cell identity: either a witness of coincidence or an
 * obstruction.
 */
export type CellIdentityJudgment = CellIdentityWitness | CellIdentityObstruction;

/**
 * Witness that two predication nodes coincide, tagged
 * "predication.nodeIdentity:witness" and carrying the two nodes.
 */
export interface PredicationNodeIdentityWitness {
  readonly kind: "predication.nodeIdentity:witness";
  readonly left: PredicationNode;
  readonly right: PredicationNode;
}

/**
 * Obstruction recording that two predication nodes do not coincide, tagged
 * "predication.nodeIdentity-obstruction" and carrying the two nodes.
 */
export interface PredicationNodeIdentityObstruction {
  readonly kind: "predication.nodeIdentity-obstruction";
  readonly left: PredicationNode;
  readonly right: PredicationNode;
}

/**
 * The judgment of node identity: either a witness of coincidence or an
 * obstruction.
 */
export type PredicationNodeIdentityJudgment = PredicationNodeIdentityWitness | PredicationNodeIdentityObstruction;

/**
 * Witness that two base objects coincide, tagged
 * "predication.baseObjectIdentity:witness" and carrying the two objects.
 */
export interface PredicationBaseObjectIdentityWitness {
  readonly kind: "predication.baseObjectIdentity:witness";
  readonly left: PredicationBaseObject;
  readonly right: PredicationBaseObject;
}

/**
 * Obstruction recording that two base objects do not coincide, tagged
 * "predication.baseObjectIdentity-obstruction" and carrying the two objects.
 */
export interface PredicationBaseObjectIdentityObstruction {
  readonly kind: "predication.baseObjectIdentity-obstruction";
  readonly left: PredicationBaseObject;
  readonly right: PredicationBaseObject;
}

/**
 * The judgment of base-object identity: either a witness of coincidence or an
 * obstruction.
 */
export type PredicationBaseObjectIdentityJudgment = PredicationBaseObjectIdentityWitness | PredicationBaseObjectIdentityObstruction;

/**
 * Judges whether two terms coincide, returning a frozen witness when their
 * carrier coincidence holds and an obstruction otherwise.
 */
export function predicationTermIdentity(left: PredicationTerm, right: PredicationTerm): PredicationTermIdentityJudgment {
  return predicationTermCoincidenceHolds(left, right)
    ? Object.freeze({ kind: "predication.termIdentity:witness" as const, left, right })
    : Object.freeze({ kind: "predication.termIdentity-obstruction" as const, left, right });
}

/**
 * Judges whether two predicates coincide, returning a frozen witness when their
 * carrier coincidence holds and an obstruction otherwise.
 */
export function predicationPredicateIdentity(left: PredicationPredicate, right: PredicationPredicate): PredicationPredicateIdentityJudgment {
  return predicationPredicateCoincidenceHolds(left, right)
    ? Object.freeze({ kind: "predication.predicateIdentity:witness" as const, left, right })
    : Object.freeze({ kind: "predication.predicateIdentity-obstruction" as const, left, right });
}

/**
 * Judges whether two cells coincide, returning a frozen witness when their
 * carrier coincidence holds and an obstruction otherwise.
 */
export function cellIdentity(left: Cell, right: Cell): CellIdentityJudgment {
  return predicationCellCoincidenceHolds(left, right)
    ? Object.freeze({ kind: "predication.cellIdentity:witness" as const, left, right })
    : Object.freeze({ kind: "predication.cellIdentity-obstruction" as const, left, right });
}

/**
 * Judges whether two predication nodes coincide, returning a frozen witness
 * when their carrier coincidence holds and an obstruction otherwise.
 */
export function predicationNodeIdentity(left: PredicationNode, right: PredicationNode): PredicationNodeIdentityJudgment {
  return predicationNodeCoincidenceHolds(left, right)
    ? Object.freeze({ kind: "predication.nodeIdentity:witness" as const, left, right })
    : Object.freeze({ kind: "predication.nodeIdentity-obstruction" as const, left, right });
}

/**
 * Judges whether two base objects coincide, returning a frozen witness when
 * their carrier coincidence holds and an obstruction otherwise.
 */
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

/**
 * Builds an entity set from an iterable of entities, deduplicating by the given
 * sameness predicate.
 */
export function entitySet<T = PredicationTerm>(
  entities: Iterable<T>,
  same: (left: T, right: T) => boolean,
): EntitySet<T> {
  return Object.freeze({
    kind: "predication.entitySet" as const,
    entities: uniqueBy([...entities], same),
  });
}

/**
 * Builds a predicate set from an iterable of predicates, deduplicating by the
 * given sameness predicate.
 */
export function predicateSet<T = PredicationPredicate>(
  predicates: Iterable<T>,
  same: (left: T, right: T) => boolean,
): PredicateSet<T> {
  return Object.freeze({
    kind: "predication.predicateSet" as const,
    predicates: uniqueBy([...predicates], same),
  });
}

/**
 * Builds a cell set from cells, deduplicating by cell coincidence and deriving
 * the entity set of subjects and objects and the predicate set of predicates.
 */
export function cellSet(cells: readonly Cell[]): CellSet {
  const witnessedCells = uniqueBy(cells, predicationCellCoincidenceHolds);
  return Object.freeze({
    kind: "predication.cellSet" as const,
    cells: Object.freeze(witnessedCells),
    entities: entitySet(witnessedCells.flatMap((c) => [c.subject, c.object]), predicationTermCoincidenceHolds),
    predicates: predicateSet(witnessedCells.map((c) => c.predicate), predicationPredicateCoincidenceHolds),
  });
}

/**
 * Constructs a frozen cell from a subject, predicate, and object, throwing a
 * TypeError if any is missing or the object is null.
 */
export function cell(subject: PredicationTerm, predicate: PredicationPredicate, object: PredicationTerm): Cell {
  if (subject === undefined || predicate === undefined || object === undefined || object === null) {
    throw new TypeError("cell: subject, predicate, and non-null object must be present");
  }
  return Object.freeze({ subject, predicate, object });
}

/**
 * Type guard: holds when the value is a non-null object carrying subject,
 * predicate, and object properties.
 */
export const isCell = (value: unknown): value is Cell =>
  typeof value === "object" && value !== null && "subject" in value && "predicate" in value && "object" in value;

/**
 * Constructs a frozen specialization morphism whose domain is the general term
 * and codomain the specialized term.
 */
export function specializationMorphism(specialized: PredicationTerm, general: PredicationTerm): SpecializationMorphism {
  return Object.freeze({
    kind: "predication.specialization" as const,
    domain: general,
    codomain: specialized,
  });
}

/**
 * Type guard: holds when the value is a non-null object whose kind is
 * "predication.specialization".
 */
export function isSpecializationMorphism(value: unknown): value is SpecializationMorphism {
  return typeof value === "object" && value !== null && (value as SpecializationMorphism).kind === "predication.specialization";
}

/**
 * Builds a predication carrier from data: partitions cells and specialization
 * morphisms, forms the cell set, and derives the base category with objects,
 * specialization edges, and converse and projection edges from each cell's
 * node.
 */
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

/**
 * Returns the base category with its specialization relation transitively
 * closed: repeatedly adds an edge from a domain to a codomain whenever they are
 * connected through an intermediate term.
 */
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

/**
 * Coheres a predication carrier: returns a coherence carrier whose saturated
 * cells are the carrier's cells and whose residue is the carrier with its base
 * specialization transitively closed.
 */
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

/**
 * A carrier of entity pairs not connected by specialization, tagged
 * "predication.unrelatedPairs" and holding the unrelated edges.
 */
export interface UnrelatedPairsCarrier {
  readonly kind: "predication.unrelatedPairs";
  readonly edges: readonly Edge[];
}

/**
 * Computes the pairs of entities not connected by the transitively closed
 * specialization relation, returning an edge for each unrelated ordered pair.
 */
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
