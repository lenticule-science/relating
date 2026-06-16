import { canonical, type JsonValue } from "../codecs/resource/index.mjs";
import {
  cellKey,
  evaluateLog,
  formatRecords,
  readRecords,
  recordOf,
  sectionOf,
  type BoundName,
  type ChargeValueName,
  type OrderName,
  type SectionRecord,
} from "./wire.mjs";

export interface EvaluateOptions {
  readonly action?: string | undefined;
  readonly order?: OrderName | undefined;
  readonly bound?: BoundName | undefined;
  readonly output?: string | undefined;
  readonly time: JsonValue;
  readonly exports?: PackageExports | undefined;
  readonly subject?: string | undefined;
  readonly predicate?: string | undefined;
  readonly object?: string | undefined;
  readonly charge?: ChargeValueName | undefined;
}

export interface ReadOptions {
  readonly subject?: string | undefined;
  readonly predicate?: string | undefined;
  readonly object?: string | undefined;
  readonly charge?: ChargeValueName | undefined;
  readonly output?: string | undefined;
  readonly time: JsonValue;
}

export interface CompareOptions {
  readonly order?: OrderName | undefined;
  readonly bound?: BoundName | undefined;
  readonly output?: string | undefined;
  readonly time: JsonValue;
}

export interface DifferenceRecord {
  readonly subject: SectionRecord["subject"];
  readonly predicate: SectionRecord["predicate"];
  readonly object: SectionRecord["object"];
  readonly subjectCharge: ChargeValueName;
  readonly controlCharge: ChargeValueName;
  readonly charge: ChargeValueName;
}

export type PackageExports = { readonly [subpath: string]: JsonValue };

const matches = (value: SectionRecord["subject"], want: string | undefined): boolean =>
  want === undefined || canonical(value) === want || String(value) === want;

const differ = (a: ChargeValueName, b: ChargeValueName): ChargeValueName =>
  a === b ? (a === "absurd" ? "absurd" : "potential") : "active";

function recordsOf(text: string, order: OrderName, bound: BoundName): Map<string, SectionRecord> {
  const section = sectionOf(evaluateLog(text), order, bound);
  const map = new Map<string, SectionRecord>();
  for (const entry of section.entries) {
    const record = recordOf(entry);
    map.set(cellKey(record), record);
  }
  return map;
}

const differenceValue = (d: DifferenceRecord) => ({
  object: d.object,
  subjectCharge: d.subjectCharge,
  controlCharge: d.controlCharge,
  charge: d.charge,
});

export function settleText(text: string, options: EvaluateOptions): string {
  const order = options.order ?? "knowledge";
  const bound = options.bound ?? "least";
  const output = options.output ?? "eavt";
  const section = sectionOf(evaluateLog(text), order, bound);
  return formatRecords(section.entries.map(recordOf), output, options.time);
}

export function formatDifferences(differences: readonly DifferenceRecord[], output: string, time: JsonValue): string {
  switch (output) {
    case "eavt":
    case "":
      return differences
        .map((d) => canonical([d.subject, d.predicate, differenceValue(d), time]))
        .join("\n") + (differences.length ? "\n" : "");
    case "datom":
      return differences
        .map((d) => canonical([d.subject, d.predicate, d.object, time, {
          subjectCharge: d.subjectCharge,
          controlCharge: d.controlCharge,
          charge: d.charge,
        }]))
        .join("\n") + (differences.length ? "\n" : "");
    case "json":
      return JSON.stringify(differences) + "\n";
    case "table":
      return ["subject\tpredicate\tobject\tsubject\tcontrol\tcharge"]
        .concat(differences.map((d) => [d.subject, d.predicate, d.object, d.subjectCharge, d.controlCharge, d.charge].map(String).join("\t")))
        .join("\n") + "\n";
    case "jsonl":
      return differences.map((d) => JSON.stringify(d)).join("\n") + (differences.length ? "\n" : "");
    default:
      throw new Error(`unrecognized --output=${output} (expected eavt, datom, jsonl, json, or table)`);
  }
}

export function readText(text: string, options: ReadOptions): string {
  const output = options.output ?? "eavt";
  const kept = readRecords(text).filter((record) =>
    matches(record.subject, options.subject)
    && matches(record.predicate, options.predicate)
    && matches(record.object, options.object)
    && (options.charge === undefined || record.charge === options.charge));
  return formatRecords(kept, output, options.time);
}

export function compareText(subjectText: string, controlText: string, options: CompareOptions): string {
  return formatDifferences(compareRecords(subjectText, controlText, options), options.output ?? "eavt", options.time);
}

export function compareRecords(subjectText: string, controlText: string, options: Pick<CompareOptions, "order" | "bound"> = {}): DifferenceRecord[] {
  const order = options.order ?? "knowledge";
  const bound = options.bound ?? "least";
  const subject = recordsOf(subjectText, order, bound);
  const control = recordsOf(controlText, order, bound);

  const absurd: ChargeValueName = "absurd";
  const differences: DifferenceRecord[] = [];
  for (const key of new Set([...subject.keys(), ...control.keys()])) {
    const s = subject.get(key);
    const c = control.get(key);
    const witness = s ?? c!;
    const sc = s?.charge ?? absurd;
    const cc = c?.charge ?? absurd;
    differences.push({
      subject: witness.subject,
      predicate: witness.predicate,
      object: witness.object,
      subjectCharge: sc,
      controlCharge: cc,
      charge: differ(sc, cc),
    });
  }
  return differences;
}
