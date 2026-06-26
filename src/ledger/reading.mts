/**
 * ledger/reading - RWIL coherence kernel.
 *
 * A Reading is an isomorphism between one RWIL witness row and one wire form.
 * Coherence says two readings commute because both round-trip through the shared
 * witness pivot. This generalizes the ActivityPub outbox/log proof without
 * depending on any downstream protocol package.
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

export interface Reading<Wire> extends ReadingDescriptor {
  readonly toWire: (witness: RWILWitness) => Wire;
  readonly fromWire: (wire: Wire) => RWILWitness;
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

export function sameWitness(left: RWILWitness, right: RWILWitness): boolean {
  return canonical(eavtRecord(left) as unknown as JsonValue) === canonical(eavtRecord(right) as unknown as JsonValue);
}

function isIso<Wire>(reading: Reading<Wire>, witness: RWILWitness): boolean {
  return sameWitness(reading.fromWire(reading.toWire(witness)), witness);
}

function hopsLosslessly<FromWire, ToWire>(
  from: Reading<FromWire>,
  to: Reading<ToWire>,
  witness: RWILWitness,
): boolean {
  const pivot = from.fromWire(from.toWire(witness));
  return sameWitness(to.fromWire(to.toWire(pivot)), witness);
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

const registeredReadings = new Map<string, Reading<unknown>>();

export function registerReading<Wire>(reading: Reading<Wire>): Reading<Wire> {
  readingDescriptorCarrier.assert({ id: reading.id }, "reading");
  registeredReadings.set(reading.id, reading as Reading<unknown>);
  return reading;
}

export function readingById(id: string): Reading<unknown> | undefined {
  return registeredReadings.get(id);
}

export function readings(): readonly Reading<unknown>[] {
  return Object.freeze([...registeredReadings.values()]);
}
