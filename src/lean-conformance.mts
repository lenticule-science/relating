import { carrierFrom, type FromSchema } from "./typing/carrier.mjs";

const idSchema = { type: "string", minLength: 1 } as const;

export const LeanGoldenVectorSchema = {
  $id: "relating/conformance/golden-vector",
  title: "LeanGoldenVector",
  description: "A Lean-emitted EAVT conformance row for a finite RelMath surface.",
  type: "object",
  required: ["$schema", "e", "a", "v", "t"],
  additionalProperties: false,
  properties: {
    $schema: { const: "relating/conformance/golden-vector" },
    e: idSchema,
    a: idSchema,
    v: {},
    t: idSchema,
  },
} as const;

export type LeanGoldenVector = FromSchema<typeof LeanGoldenVectorSchema>;
export const leanGoldenVectorCarrier = carrierFrom(LeanGoldenVectorSchema);

export function decodeLeanGoldenVectorLine(line: string, label = "Lean golden vector"): LeanGoldenVector {
  const parsed = JSON.parse(line.replace(/^\uFEFF/u, "")) as unknown;
  return leanGoldenVectorCarrier.assert(parsed, label) as LeanGoldenVector;
}

export function decodeLeanGoldenVectorJsonl(text: string, label = "Lean golden vector JSONL"): readonly LeanGoldenVector[] {
  return Object.freeze(text
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line, index) => decodeLeanGoldenVectorLine(line, `${label}:${index + 1}`)));
}

export function encodeLeanGoldenVectorJsonl(rows: readonly LeanGoldenVector[]): string {
  return `${rows.map((row) => JSON.stringify(leanGoldenVectorCarrier.assert(row))).join("\n")}\n`;
}

export function leanGoldenVectorsByAction(rows: readonly LeanGoldenVector[]): ReadonlyMap<string, readonly LeanGoldenVector[]> {
  const grouped = new Map<string, LeanGoldenVector[]>();
  for (const row of rows) {
    const next = grouped.get(row.a) ?? [];
    next.push(row);
    grouped.set(row.a, next);
  }
  return new Map([...grouped.entries()].sort((left, right) => left[0].localeCompare(right[0]))
    .map(([action, actionRows]) => [action, Object.freeze(actionRows)]));
}
