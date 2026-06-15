#!/usr/bin/env node
/**
 * relationality-read — project and filter a settled section reading.
 *
 * A pure filter over `evaluate`'s output: reads `{subject, predicate, object,
 * charge}` records (stdin, or a path), keeps those matching the parameters, and
 * writes them back in the chosen format. It does not re-induce — settling is
 * `evaluate`'s job, viewing is this one's, so `evaluate | read` is the whole
 * Unix pipeline.
 *
 *   relationality-evaluate log.jsonl | relationality-read --subject=alice
 *   relationality-evaluate log.jsonl | relationality-read --charge=stable --output=table
 *
 * Parameters: --subject=, --predicate=, --object= (match a term's canonical
 *             value), --charge=potential|active|stable|absurd (keep one bin),
 *             --output=jsonl|json|table (default jsonl).
 */
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import { canonical } from "../codecs/resource/json.mjs";
import {
  parseArgs,
  readStdin,
  readRecords,
  formatRecords,
  type Args,
  type SectionRecord,
  type ChargeValueName,
} from "./wire.mjs";

const matches = (value: unknown, want: string | undefined): boolean =>
  want === undefined || canonical(value as never) === want || String(value) === want;

async function main(argv: readonly string[]): Promise<number> {
  const args: Args = parseArgs(argv);
  const subject = args.flags.get("subject");
  const predicate = args.flags.get("predicate");
  const object = args.flags.get("object");
  const charge = args.flags.get("charge") as ChargeValueName | undefined;
  const output = args.flags.get("output") ?? "jsonl";
  const path = args.positionals[0];

  const text = path !== undefined ? await readFile(path, "utf8") : await readStdin();
  const kept: SectionRecord[] = readRecords(text).filter((record) =>
    matches(record.subject, subject)
    && matches(record.predicate, predicate)
    && matches(record.object, object)
    && (charge === undefined || record.charge === charge));

  process.stdout.write(formatRecords(kept, output));
  return 0;
}

if (process.argv[1] !== undefined && fileURLToPath(import.meta.url) === process.argv[1]) {
  main(process.argv.slice(2))
    .then((code) => process.exit(code))
    .catch((error: unknown) => {
      process.stderr.write(`relationality-read: ${error instanceof Error ? error.message : String(error)}\n`);
      process.exit(1);
    });
}
