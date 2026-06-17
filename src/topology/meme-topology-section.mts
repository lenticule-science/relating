import type { Cell, PredicationTerm, PredicationPredicate } from "../algebra/index.mjs";
import { predicationPredicateCoincidenceHolds, predicationTermCoincidenceHolds } from "../algebra/index.mjs";
import { bottom, joinKnowledge, valueOf, type ChargeCarrier } from "../algebra/index.mjs";
import type { OrderName } from "./predication-fiber.mjs";
import type { BoundName } from "./predication-valuation-fixed-point.mjs";
import { classifySettling, type SettlingClassification } from "./predication-settling.mjs";
import { count, type Natural } from "../algebra/index.mjs";
import type { MemeTopologyFixedPointReading } from "./meme-topology-fixed-point-reading.mjs";
import type { MemeTopologyCarrier, PredicateInput, SubjectInput } from "./meme-topology.mjs";

/**
 * One assignment in a section: the cell it covers paired with the charge that
 * fixed-point reading settled on it.
 */
export interface SectionEntry {
  readonly kind: "meme-topology.section.entry";
  readonly cell: Cell;
  readonly charge: ChargeCarrier;
}

/**
 * A section of a meme topology under one order/bound extremum: the chosen
 * fixed-point reading flattened into its charged entries, tagged with the order
 * and bound it was read at.
 */
export interface SectionCarrier {
  readonly kind: "meme-topology.section.carrier";
  readonly order: OrderName;
  readonly bound: BoundName;
  readonly entries: readonly SectionEntry[];
}

/** The section partitioned by the four charge values, under their dynamical
 *  names: has-potential, engaged, held contradiction, no evidence either way. */
export interface SectionPartitionCarrier {
  readonly kind: "meme-topology.section.partition";
  /** Truth-order top: token given, claim not yet made good. */
  readonly potential: readonly SectionEntry[];
  /** Truth-order bottom: potential spent — derived, never admitted. */
  readonly active: readonly SectionEntry[];
  /** Knowledge-order top: the held contradiction, rendered, never thrown. */
  readonly stable: readonly SectionEntry[];
  /** Knowledge-order bottom: no evidence either way. */
  readonly absurd: readonly SectionEntry[];
}

/**
 * A summary of a meme topology's state: total cells, count of held
 * contradictions, count of no-evidence residue, and the settling regime.
 */
export interface TopologyVitalsCarrier {
  readonly kind: "meme-topology.vitals";
  readonly cells: Natural;
  readonly contradictions: Natural;
  readonly residue: Natural;
  readonly regime: SettlingClassification["regime"];
}

const readingFor = (carrier: MemeTopologyCarrier, order: OrderName, bound: BoundName): MemeTopologyFixedPointReading => {
  if (order !== "knowledge" && order !== "truth") {
    throw new TypeError(`sectionOf: order must be "knowledge" or "truth", got ${JSON.stringify(order)}`);
  }
  if (bound !== "least" && bound !== "greatest") {
    throw new TypeError(`sectionOf: bound must be "least" or "greatest", got ${JSON.stringify(bound)}`);
  }
  if (order === "knowledge") {
    return bound === "least" ? carrier.fixedPointReadings.knowledgeLeast : carrier.fixedPointReadings.knowledgeGreatest;
  }
  return bound === "least" ? carrier.fixedPointReadings.truthLeast : carrier.fixedPointReadings.truthGreatest;
};

/**
 * The section of a carrier at the given order ("knowledge" or "truth") and
 * bound ("least" or "greatest"): selects that fixed-point reading and flattens
 * its sheaf section's fibers into frozen charged entries. Throws if the
 * carrier, order, or bound is invalid.
 */
export function sectionOf(carrier: MemeTopologyCarrier, order: OrderName, bound: BoundName): SectionCarrier {
  if (typeof carrier !== "object" || carrier === null || carrier.kind !== "meme-topology.carrier") {
    throw new TypeError("sectionOf: expected a meme-topology carrier");
  }
  const reading = readingFor(carrier, order, bound);
  const entries = reading.extremum.sheaf.section.fibers.flatMap((fiber) =>
    fiber.assignments.map((assignment) => Object.freeze({
      kind: "meme-topology.section.entry" as const,
      cell: assignment.cell,
      charge: assignment.charge,
    })));
  return Object.freeze({
    kind: "meme-topology.section.carrier" as const,
    order,
    bound,
    entries: Object.freeze(entries),
  });
}

/**
 * The section entries whose cell subject coincides with the given term: every
 * predication made about that subject.
 */
export function predicationsFor(section: SectionCarrier, subject: SubjectInput): readonly SectionEntry[] {
  return Object.freeze(section.entries.filter((entry) => predicationTermCoincidenceHolds(entry.cell.subject, subject)));
}

/**
 * The section entries whose cell predicate coincides with the given term: every
 * subject that bears that predicate.
 */
export function subjectsFor(section: SectionCarrier, predicate: PredicateInput): readonly SectionEntry[] {
  return Object.freeze(section.entries.filter((entry) => predicationPredicateCoincidenceHolds(entry.cell.predicate, predicate)));
}

/** Absence is data, never a throw: an unmatched cell reads the `absurd` charge. */
export function chargeAtValues(section: SectionCarrier, subject: SubjectInput, predicate: PredicateInput, object?: SubjectInput): ChargeCarrier {
  const objectInput = object ?? subject;
  return section.entries
    .filter((entry) =>
      predicationTermCoincidenceHolds(entry.cell.subject, subject)
      && predicationPredicateCoincidenceHolds(entry.cell.predicate, predicate)
      && predicationTermCoincidenceHolds(entry.cell.object, objectInput))
    .reduce((acc, entry) => joinKnowledge(acc, entry.charge), bottom);
}

/**
 * Splits a section's entries into the four charge buckets - potential, active,
 * stable, and absurd - by each entry's charge value name, with anything
 * unrecognized falling to absurd.
 */
export function partitionSection(section: SectionCarrier): SectionPartitionCarrier {
  const potential: SectionEntry[] = [];
  const active: SectionEntry[] = [];
  const stable: SectionEntry[] = [];
  const absurd: SectionEntry[] = [];
  for (const entry of section.entries) {
    const name = valueOf(entry.charge).name;
    if (name === "potential") potential.push(entry);
    else if (name === "active") active.push(entry);
    else if (name === "stable") stable.push(entry);
    else absurd.push(entry);
  }
  return Object.freeze({
    kind: "meme-topology.section.partition" as const,
    potential: Object.freeze(potential),
    active: Object.freeze(active),
    stable: Object.freeze(stable),
    absurd: Object.freeze(absurd),
  });
}

/**
 * The vitals of a carrier: takes its knowledge-least section, partitions it,
 * and reports cell count, contradiction (stable) count, residue (absurd) count,
 * and the settling regime.
 */
export function topologyVitals(carrier: MemeTopologyCarrier): TopologyVitalsCarrier {
  const section = sectionOf(carrier, "knowledge", "least");
  const partition = partitionSection(section);
  return Object.freeze({
    kind: "meme-topology.vitals" as const,
    cells: count(section.entries),
    contradictions: count(partition.stable),
    residue: count(partition.absurd),
    regime: classifySettling(carrier.settling).regime,
  });
}
