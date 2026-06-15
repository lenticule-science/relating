#!/usr/bin/env node
/**
 * relationality-compare — the differential: measure one relationality against
 * another, cell by cell, valued in charges (not pass/fail).
 *
 * Induces a SUBJECT log (stdin, or a path) and a control log (`--against`),
 * settles both at the same section, and for every cell in their union reads a
 * differential charge: `potential` = the two agree, `active` = they diverge,
 * `absurd` = neither settled the cell. The control is descriptive — the object
 * we measure divergence *from* — never enforced; so this exits 0 whenever a
 * reading was computed. Use `--fail-on=active` to gate (CI), like
 * `git diff --exit-code`.
 *
 *   relationality-compare subject.jsonl --against=control.jsonl
 *   relationality-compare s.jsonl --against=c.jsonl --fail-on=active && echo conformant
 *
 * Parameters: --against=PATH (required, the control log),
 *             --order=, --bound= (the section both are read at),
 *             --output=jsonl|json|table, --fail-on=active|stable.
 */
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import {
  parseArgs,
  readStdin,
  evaluateLog,
  recordOf,
  cellKey,
  sectionOf,
  type Args,
  type OrderName,
  type BoundName,
  type SectionRecord,
  type ChargeValueName,
} from "./wire.mjs";

interface Difference {
  readonly subject: SectionRecord["subject"];
  readonly predicate: SectionRecord["predicate"];
  readonly object: SectionRecord["object"];
  readonly subjectCharge: ChargeValueName;
  readonly controlCharge: ChargeValueName;
  /** The differential reading: potential = agree, active = diverge, absurd = neither. */
  readonly charge: ChargeValueName;
}

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

async function main(argv: readonly string[]): Promise<number> {
  const args: Args = parseArgs(argv);
  const against = args.flags.get("against");
  if (against === undefined || against === "") {
    process.stderr.write("relationality-compare: --against=PATH (the control log) is required\n");
    return 2;
  }
  const order = (args.flags.get("order") ?? "knowledge") as OrderName;
  const bound = (args.flags.get("bound") ?? "least") as BoundName;
  const output = args.flags.get("output") ?? "jsonl";
  const failOn = args.flags.get("fail-on") as ChargeValueName | undefined;
  const path = args.positionals[0];

  const subjectText = path !== undefined ? await readFile(path, "utf8") : await readStdin();
  const controlText = await readFile(against, "utf8");
  const subject = recordsOf(subjectText, order, bound);
  const control = recordsOf(controlText, order, bound);

  const absurd: ChargeValueName = "absurd";
  const differences: Difference[] = [];
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

  if (output === "json") {
    process.stdout.write(JSON.stringify(differences) + "\n");
  } else if (output === "table") {
    process.stdout.write(
      ["subject\tpredicate\tobject\tsubject\tcontrol\tcharge"]
        .concat(differences.map((d) => [d.subject, d.predicate, d.object, d.subjectCharge, d.controlCharge, d.charge].map(String).join("\t")))
        .join("\n") + "\n",
    );
  } else {
    process.stdout.write(differences.map((d) => JSON.stringify(d)).join("\n") + (differences.length ? "\n" : ""));
  }

  if (failOn !== undefined && differences.some((d) => d.charge === failOn)) return 1;
  return 0;
}

if (process.argv[1] !== undefined && fileURLToPath(import.meta.url) === process.argv[1]) {
  main(process.argv.slice(2))
    .then((code) => process.exit(code))
    .catch((error: unknown) => {
      process.stderr.write(`relationality-compare: ${error instanceof Error ? error.message : String(error)}\n`);
      process.exit(1);
    });
}
