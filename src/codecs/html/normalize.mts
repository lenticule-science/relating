/**
 * codecs/html/normalize — settle assorted inputs (a section read, a bare cell
 * list, a detector report) into the `ShpDataform` the projector renders.
 *
 * Charges are constructed through relationality's own algebra: the former raw
 * `{ value: [true, false], evidence }` literals (the deprecated meme Charge
 * shape) are replaced by `charge(chargeValue(name), evidence)` over
 * `ChargeCarrier`. The naming is exact: affirmed → potential (truth-only),
 * denied → active (falsity-only), contradicted → stable (both).
 */
import { charge, chargeValue, negate, joinKnowledge, type ChargeCarrier } from "../../algebra/index.mjs";
import { unmark } from "./escape.mjs";

/**
 * A single subject-predicate-object claim: the triple before any charge is
 * attached. `object` is optional, leaving a bare subject-predicate pair.
 */
export type ShpCell = {
  subject: unknown;
  predicate: unknown;
  object?: unknown;
};

/**
 * A claim paired with its charge: an `ShpCell` and the `ChargeCarrier` carrying
 * its truth/falsity content over the bilattice.
 */
export type ChargedCell = {
  cell: ShpCell;
  charge: ChargeCarrier;
};

/**
 * One entry within a section: either an already-built `ChargedCell`, or a raw
 * record (predicate, optional object, and witness lists
 * `citation`/`affirmedBy`/`deniedBy`) from which a charge is derived.
 */
export type SectionEntry = ChargedCell | {
  predicate?: unknown;
  object?: unknown;
  citation?: unknown;
  affirmedBy?: unknown;
  deniedBy?: unknown;
};

/**
 * A read grouped by stance: `affirmed`, `denied`, and `contradicted` lists of
 * section entries, each list mapping to a charge value when normalized into
 * cells.
 */
export type Section = {
  affirmed?: readonly SectionEntry[];
  denied?: readonly SectionEntry[];
  contradicted?: readonly SectionEntry[];
};

/**
 * The optional rendering settings carried onto a dataform: `title`, `observer`,
 * `metadata`, the `mode` ("calm" or "audit"), and the `projection` ("supported"
 * or "negated").
 */
export type DataformOptions = {
  title?: string;
  observer?: unknown;
  metadata?: Record<string, unknown>;
  mode?: "calm" | "audit";
  projection?: "supported" | "negated";
};

/**
 * The normalized form the projector renders: a `subject`, its list of
 * `ChargedCell`s, plus the optional `DataformOptions` settings.
 */
export type ShpDataform = DataformOptions & {
  subject: unknown;
  cells: readonly ChargedCell[];
};

/**
 * A located region from a detector report: its `tier` and its `start`/`end`
 * offsets.
 */
export type DetectSpan = {
  tier: unknown;
  start: unknown;
  end: unknown;
};

/** A detector rule that matched: its descriptive `text` and its `severity`. */
export type DetectRule = {
  text: unknown;
  severity: unknown;
};

/**
 * A single detector finding: the matched `span`, the `rule` that fired, and the
 * `ChargeCarrier` for the match.
 */
export type DetectFinding = {
  span: DetectSpan;
  rule: DetectRule;
  charge: ChargeCarrier;
};

/** A detector report: an optional list of `DetectFinding` `cells`. */
export type DetectReport = {
  cells?: readonly DetectFinding[];
};

/**
 * Normalizes a `Section` into an `ShpDataform`: charges each
 * affirmed/contradicted/denied entry into a `ChargedCell`, infers the subject
 * from `opts.subject` or the section's first cell subject, and carries the
 * options through.
 */
export function fromSection(section: Section, opts: DataformOptions & { subject?: unknown } = {}): ShpDataform {
  const subjectHint = opts.subject ?? unmark(firstCellSubject(section)) ?? "section";
  const cells: ChargedCell[] = [];
  for (const entry of section?.affirmed ?? []) cells.push(toCharged(entry, subjectHint, "affirmed"));
  for (const entry of section?.contradicted ?? []) cells.push(toCharged(entry, subjectHint, "contradicted"));
  for (const entry of section?.denied ?? []) cells.push(toCharged(entry, subjectHint, "denied"));
  return carryOpts({ subject: opts.subject ?? subjectHint, cells }, opts);
}

/**
 * Builds an `ShpDataform` from a subject and a list of already-charged cells,
 * carrying the options through.
 */
export function fromCells(subject: unknown, cells: readonly ChargedCell[] = [], opts: DataformOptions = {}): ShpDataform {
  return carryOpts({ subject, cells }, opts);
}

/**
 * Normalizes a `DetectReport` into an `ShpDataform`: maps each finding to a
 * charged cell whose subject is the span id (`tier@start-end`), predicate the
 * rule text, and object the rule severity, defaulting the dataform subject to
 * "document".
 */
export function fromDetect(report: DetectReport, opts: DataformOptions & { subject?: unknown } = {}): ShpDataform {
  const cells = (report.cells ?? []).map(({ span, rule, charge: c }) => ({
    cell: { subject: spanId(span), predicate: rule.text, object: rule.severity },
    charge: c,
  }));
  return carryOpts({ subject: opts.subject ?? "document", cells }, opts);
}

function carryOpts<T extends ShpDataform>(dataform: T, opts: DataformOptions): T {
  if (opts.title !== undefined) dataform.title = opts.title;
  if (opts.observer !== undefined) dataform.observer = opts.observer;
  if (opts.metadata !== undefined) dataform.metadata = opts.metadata;
  if (opts.mode !== undefined) dataform.mode = opts.mode;
  if (opts.projection !== undefined) dataform.projection = opts.projection;
  return dataform;
}

function firstCellSubject(section: Section): unknown {
  for (const list of [section?.affirmed, section?.contradicted, section?.denied]) {
    for (const entry of list ?? []) {
      if (isChargedCell(entry) && entry.cell.subject !== undefined) return entry.cell.subject;
    }
  }
  return undefined;
}

/** A positive claim: present-side witnesses. Every claim is an affirmation —
 *  affirming is the only admission. Negatives are never named here; they are
 *  derived from affirmations through the bilattice morphisms below. */
const affirm = (witnessList: readonly unknown[]): ChargeCarrier => charge(chargeValue("potential"), [witnessList, []]);

function toCharged(entry: SectionEntry, subject: unknown, section: "affirmed" | "denied" | "contradicted"): ChargedCell {
  if (isChargedCell(entry)) return entry;
  const cell = entry.object === undefined
    ? { subject, predicate: entry.predicate }
    : { subject, predicate: entry.predicate, object: entry.object };
  if (section === "affirmed") {
    return { cell, charge: affirm(witnesses(entry.citation)) };
  }
  if (section === "denied") {
    // a denial is the negation morphism applied to the denier's affirmation —
    // the charge value (active) is derived by `valueOf`, never named at the boundary.
    return { cell, charge: negate(affirm(witnesses(entry.citation))) };
  }
  // a held contradiction is the knowledge-join of an affirmation and a denial —
  // the value (stable, the ≤_k-top) is derived, never named.
  return {
    cell,
    charge: joinKnowledge(affirm(witnesses(entry.affirmedBy)), negate(affirm(witnesses(entry.deniedBy)))),
  };
}

function isChargedCell(value: unknown): value is ChargedCell {
  return !!value && typeof value === "object" && "cell" in value && "charge" in value;
}

function witnesses(value: unknown): unknown[] {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

function spanId(span: DetectSpan): string {
  return `${span.tier}@${span.start}-${span.end}`;
}
