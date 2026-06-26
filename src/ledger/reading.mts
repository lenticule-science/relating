/**
 * ledger/reading - RWIL coherence kernel.
 *
 * A Reading is an isomorphism between one RWIL witness row and one wire form.
 * A LogReading is the same law over an ordered witness log: the higher-block /
 * sliding-window case. Coherence says two readings commute because both
 * round-trip through the shared witness pivot. This generalizes the ActivityPub
 * outbox/log proof without depending on any downstream protocol package.
 */
import { carrierFrom, type FromSchema } from "../typing/carrier.mjs";
import { eavtRecord, type EAVTRecord } from "../writing/eavt.mjs";
import { canonical, type JsonValue } from "../writing/json.mjs";

export const readingDescriptorSchema = {
  $id: "relating/ledger/reading",
  title: "RWIL Reading",
  description: "A named isomorphism between one RWIL witness row and one wire form.",
  type: "object",
  required: ["id"],
  properties: {
    id: { type: "string", minLength: 1 },
  },
  additionalProperties: false,
} as const;

export type ReadingDescriptor = FromSchema<typeof readingDescriptorSchema>;
export const readingDescriptorCarrier = carrierFrom(readingDescriptorSchema);

export type RWILWitness = EAVTRecord;
export type RWILWitnessLog = readonly RWILWitness[];

export interface Reading<Wire> extends ReadingDescriptor {
  readonly toWire: (witness: RWILWitness) => Wire;
  readonly fromWire: (wire: Wire) => RWILWitness;
}

export const logReadingDescriptorSchema = {
  $id: "relating/ledger/log-reading",
  title: "RWIL Log Reading",
  description: "A named isomorphism between an ordered RWIL witness log and one wire form.",
  type: "object",
  required: ["id"],
  properties: {
    id: { type: "string", minLength: 1 },
  },
  additionalProperties: false,
} as const;

export type LogReadingDescriptor = FromSchema<typeof logReadingDescriptorSchema>;
export const logReadingDescriptorCarrier = carrierFrom(logReadingDescriptorSchema);

export interface LogReading<Wire> extends LogReadingDescriptor {
  readonly toWire: (witnessLog: RWILWitnessLog) => Wire;
  readonly fromWire: (wire: Wire) => RWILWitnessLog;
}

export const coherenceReportSchema = {
  $id: "relating/ledger/coherence-report",
  title: "RWIL Coherence Report",
  description: "The law report for two RWIL readings checked against one witness pivot.",
  type: "object",
  required: ["kind", "left", "right", "witness", "leftIso", "rightIso", "leftToRight", "rightToLeft", "ok"],
  properties: {
    kind: { const: "relating.ledger.coherence" },
    left: { type: "string", minLength: 1 },
    right: { type: "string", minLength: 1 },
    witness: {},
    leftIso: { type: "boolean" },
    rightIso: { type: "boolean" },
    leftToRight: { type: "boolean" },
    rightToLeft: { type: "boolean" },
    ok: { type: "boolean" },
  },
  additionalProperties: false,
} as const;

export type CoherenceReport = Omit<FromSchema<typeof coherenceReportSchema>, "witness"> & {
  readonly witness: JsonValue;
};
export const coherenceReportCarrier = carrierFrom(coherenceReportSchema);

export const logCoherenceReportSchema = {
  $id: "relating/ledger/log-coherence-report",
  title: "RWIL Log Coherence Report",
  description: "The law report for two RWIL log readings checked against one ordered witness-log pivot.",
  type: "object",
  required: ["kind", "left", "right", "witnessLog", "leftIso", "rightIso", "leftToRight", "rightToLeft", "ok"],
  properties: {
    kind: { const: "relating.ledger.log-coherence" },
    left: { type: "string", minLength: 1 },
    right: { type: "string", minLength: 1 },
    witnessLog: { type: "array", items: { type: "object" } },
    leftIso: { type: "boolean" },
    rightIso: { type: "boolean" },
    leftToRight: { type: "boolean" },
    rightToLeft: { type: "boolean" },
    ok: { type: "boolean" },
  },
  additionalProperties: false,
} as const;

export type LogCoherenceReport = Omit<FromSchema<typeof logCoherenceReportSchema>, "witnessLog"> & {
  readonly witnessLog: readonly JsonValue[];
};
export const logCoherenceReportCarrier = carrierFrom(logCoherenceReportSchema);

function witnessLogRecord(log: RWILWitnessLog): RWILWitnessLog {
  return Object.freeze(log.map((row) => eavtRecord(row)));
}

export function sameWitness(left: RWILWitness, right: RWILWitness): boolean {
  return canonical(eavtRecord(left) as unknown as JsonValue) === canonical(eavtRecord(right) as unknown as JsonValue);
}

export function sameWitnessLog(left: RWILWitnessLog, right: RWILWitnessLog): boolean {
  return canonical(witnessLogRecord(left) as unknown as JsonValue) === canonical(witnessLogRecord(right) as unknown as JsonValue);
}

function isIso<Wire>(reading: Reading<Wire>, witness: RWILWitness): boolean {
  return sameWitness(reading.fromWire(reading.toWire(witness)), witness);
}

function isLogIso<Wire>(reading: LogReading<Wire>, witnessLog: RWILWitnessLog): boolean {
  return sameWitnessLog(reading.fromWire(reading.toWire(witnessLog)), witnessLog);
}

function hopsLosslessly<FromWire, ToWire>(
  from: Reading<FromWire>,
  to: Reading<ToWire>,
  witness: RWILWitness,
): boolean {
  const pivot = from.fromWire(from.toWire(witness));
  return sameWitness(to.fromWire(to.toWire(pivot)), witness);
}

function logHopsLosslessly<FromWire, ToWire>(
  from: LogReading<FromWire>,
  to: LogReading<ToWire>,
  witnessLog: RWILWitnessLog,
): boolean {
  const pivot = from.fromWire(from.toWire(witnessLog));
  return sameWitnessLog(to.fromWire(to.toWire(pivot)), witnessLog);
}

/**
 * Check that two readings are isomorphisms on `witness`, and that each route
 * through the shared witness pivot returns to the same row.
 */
export function cohere<LeftWire, RightWire>(
  left: Reading<LeftWire>,
  right: Reading<RightWire>,
  witness: RWILWitness,
): CoherenceReport {
  readingDescriptorCarrier.assert({ id: left.id }, "left reading");
  readingDescriptorCarrier.assert({ id: right.id }, "right reading");
  const leftIso = isIso(left, witness);
  const rightIso = isIso(right, witness);
  const leftToRight = hopsLosslessly(left, right, witness);
  const rightToLeft = hopsLosslessly(right, left, witness);
  return coherenceReportCarrier.assert(Object.freeze({
    kind: "relating.ledger.coherence" as const,
    left: left.id,
    right: right.id,
    witness: eavtRecord(witness) as unknown as JsonValue,
    leftIso,
    rightIso,
    leftToRight,
    rightToLeft,
    ok: leftIso && rightIso && leftToRight && rightToLeft,
  }), "coherence report") as CoherenceReport;
}

/**
 * Check that two higher-block readings are isomorphisms on an ordered witness
 * log, and that each route through the shared log pivot returns to the same log.
 */
export function cohereLog<LeftWire, RightWire>(
  left: LogReading<LeftWire>,
  right: LogReading<RightWire>,
  witnessLog: RWILWitnessLog,
): LogCoherenceReport {
  logReadingDescriptorCarrier.assert({ id: left.id }, "left log reading");
  logReadingDescriptorCarrier.assert({ id: right.id }, "right log reading");
  const admittedLog = witnessLogRecord(witnessLog);
  const leftIso = isLogIso(left, admittedLog);
  const rightIso = isLogIso(right, admittedLog);
  const leftToRight = logHopsLosslessly(left, right, admittedLog);
  const rightToLeft = logHopsLosslessly(right, left, admittedLog);
  return logCoherenceReportCarrier.assert(Object.freeze({
    kind: "relating.ledger.log-coherence" as const,
    left: left.id,
    right: right.id,
    witnessLog: admittedLog as unknown as readonly JsonValue[],
    leftIso,
    rightIso,
    leftToRight,
    rightToLeft,
    ok: leftIso && rightIso && leftToRight && rightToLeft,
  }), "log coherence report") as LogCoherenceReport;
}

export function assertCoherent<LeftWire, RightWire>(
  left: Reading<LeftWire>,
  right: Reading<RightWire>,
  witness: RWILWitness,
): CoherenceReport {
  const report = cohere(left, right, witness);
  if (!report.ok) {
    throw new Error(`RWIL readings do not cohere: ${left.id} <-> ${right.id}`);
  }
  return report;
}

export function assertLogCoherent<LeftWire, RightWire>(
  left: LogReading<LeftWire>,
  right: LogReading<RightWire>,
  witnessLog: RWILWitnessLog,
): LogCoherenceReport {
  const report = cohereLog(left, right, witnessLog);
  if (!report.ok) {
    throw new Error(`RWIL log readings do not cohere: ${left.id} <-> ${right.id}`);
  }
  return report;
}

/**
 * Lift a one-row Reading into the degenerate 1-block LogReading case.
 */
export function readingAsLogReading<Wire>(reading: Reading<Wire>): LogReading<Wire> {
  return Object.freeze({
    id: reading.id,
    toWire: (witnessLog: RWILWitnessLog): Wire => {
      if (witnessLog.length !== 1) throw new TypeError(`${reading.id}: 1-block reading requires exactly one witness row`);
      return reading.toWire(witnessLog[0]!);
    },
    fromWire: (wire: Wire): RWILWitnessLog => Object.freeze([reading.fromWire(wire)]),
  });
}

const registeredReadings = new Map<string, Reading<unknown>>();
const registeredLogReadings = new Map<string, LogReading<unknown>>();

export function registerReading<Wire>(reading: Reading<Wire>): Reading<Wire> {
  readingDescriptorCarrier.assert({ id: reading.id }, "reading");
  registeredReadings.set(reading.id, reading as Reading<unknown>);
  return reading;
}

export function registerLogReading<Wire>(reading: LogReading<Wire>): LogReading<Wire> {
  logReadingDescriptorCarrier.assert({ id: reading.id }, "log reading");
  registeredLogReadings.set(reading.id, reading as LogReading<unknown>);
  return reading;
}

export function readingById(id: string): Reading<unknown> | undefined {
  return registeredReadings.get(id);
}

export function logReadingById(id: string): LogReading<unknown> | undefined {
  return registeredLogReadings.get(id);
}

export function readings(): readonly Reading<unknown>[] {
  return Object.freeze([...registeredReadings.values()]);
}

export function logReadings(): readonly LogReading<unknown>[] {
  return Object.freeze([...registeredLogReadings.values()]);
}
