#!/usr/bin/env node
/**
 * relating-read — project and filter a settled section reading.
 *
 * A pure filter over `evaluate`'s output: reads settled EAVT, Datom, or section
 * records (stdin, or a path), keeps those matching the parameters, and writes
 * them back in the chosen format. It does not re-induce — settling is
 * `evaluate`'s job, viewing is this one's, so `evaluate | read` is the whole
 * Unix pipeline.
 *
 *   eval-relation log.jsonl | relating-read --subject=alice
 *   eval-relation log.jsonl | relating-read --charge=stable --output=table
 *
 * Parameters: --subject=, --predicate=, --object= (match a term's canonical
 *             value), --charge=potential|active|stable|absurd (keep one bin),
 *             --time=JSON|string (default current ISO time),
 *             --output=eavt|datom|jsonl|json|table (default eavt).
 */
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import {
  parseArgs,
  readStdin,
  parseJsonFlag,
  parseChargeValueName,
  type Args,
} from "./wire.mjs";
import { readText } from "./internal.mjs";

async function main(argv: readonly string[]): Promise<number> {
  const args: Args = parseArgs(argv);
  const subject = args.flags.get("subject");
  const predicate = args.flags.get("predicate");
  const object = args.flags.get("object");
  const charge = parseChargeValueName(args.flags.get("charge"));
  const output = args.flags.get("output") ?? "eavt";
  const time = args.flags.has("time")
    ? parseJsonFlag(args.flags.get("time")!)
    : new Date(Date.now()).toISOString();
  const path = args.positionals[0];

  const text = path !== undefined ? await readFile(path, "utf8") : await readStdin();
  process.stdout.write(readText(text, { subject, predicate, object, charge, output, time }));
  return 0;
}

if (process.argv[1] !== undefined && fileURLToPath(import.meta.url) === process.argv[1]) {
  main(process.argv.slice(2))
    .then((code) => process.exit(code))
    .catch((error) => {
      process.stderr.write(`relating-read: ${error instanceof Error ? error.message : String(error)}\n`);
      process.exit(1);
    });
}
