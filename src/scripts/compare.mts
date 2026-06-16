#!/usr/bin/env node
/**
 * relating-compare — the differential: measure one relating against
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
 *   relating-compare subject.jsonl --against=control.jsonl
 *   relating-compare s.jsonl --against=c.jsonl --fail-on=active && echo conformant
 *
 * Parameters: --against=PATH (required, the control log),
 *             --order=, --bound= (the section both are read at),
 *             --time=JSON|string (default current ISO time),
 *             --output=eavt|datom|jsonl|json|table (default eavt),
 *             --fail-on=active|stable.
 */
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import {
  parseArgs,
  readStdin,
  parseJsonFlag,
  parseOrderName,
  parseBoundName,
  parseChargeValueName,
  type Args,
} from "./wire.mjs";
import { compareRecords, compareText } from "./internal.mjs";

async function main(argv: readonly string[]): Promise<number> {
  const args: Args = parseArgs(argv);
  const against = args.flags.get("against");
  if (against === undefined || against === "") {
    process.stderr.write("relating-compare: --against=PATH (the control log) is required\n");
    return 2;
  }
  const order = parseOrderName(args.flags.get("order"));
  const bound = parseBoundName(args.flags.get("bound"));
  const output = args.flags.get("output") ?? "eavt";
  const time = args.flags.has("time")
    ? parseJsonFlag(args.flags.get("time")!)
    : new Date(Date.now()).toISOString();
  const failOn = parseChargeValueName(args.flags.get("fail-on"));
  const path = args.positionals[0];

  const subjectText = path !== undefined ? await readFile(path, "utf8") : await readStdin();
  const controlText = await readFile(against, "utf8");
  const differences = compareRecords(subjectText, controlText, { order, bound });

  process.stdout.write(compareText(subjectText, controlText, { order, bound, output, time }));

  if (failOn !== undefined && differences.some((d) => d.charge === failOn)) return 1;
  return 0;
}

if (process.argv[1] !== undefined && fileURLToPath(import.meta.url) === process.argv[1]) {
  main(process.argv.slice(2))
    .then((code) => process.exit(code))
    .catch((error) => {
      process.stderr.write(`relating-compare: ${error instanceof Error ? error.message : String(error)}\n`);
      process.exit(1);
    });
}
