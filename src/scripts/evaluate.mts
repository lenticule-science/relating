#!/usr/bin/env node
/**
 * relationality-evaluate — run the closure endomorphism to its fixed point.
 *
 * Reads an utterance LOG (stdin, or a path argument), folds it through the
 * descent (articulate → predicate → posit → settle) with `induce`, and writes
 * the settled SECTION reading — one `{subject, predicate, object, charge}` per
 * line — to stdout. Charges are DATA, not pass/fail: this always exits 0 when a
 * reading was computed; non-zero is reserved for operational failure.
 *
 *   relationality-evaluate log.jsonl
 *   cat a.jsonl b.jsonl | relationality-evaluate --order=truth --output=table
 *
 * Parameters: --order=knowledge|truth (default knowledge),
 *             --bound=least|greatest (default least),
 *             --output=jsonl|json|table (default jsonl).
 */
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import {
  parseArgs,
  readStdin,
  evaluateLog,
  recordOf,
  formatRecords,
  sectionOf,
  type Args,
  type OrderName,
  type BoundName,
} from "./wire.mjs";

async function main(argv: readonly string[]): Promise<number> {
  const args: Args = parseArgs(argv);
  const order = (args.flags.get("order") ?? "knowledge") as OrderName;
  const bound = (args.flags.get("bound") ?? "least") as BoundName;
  const output = args.flags.get("output") ?? "jsonl";
  const path = args.positionals[0];

  const text = path !== undefined ? await readFile(path, "utf8") : await readStdin();
  const carrier = evaluateLog(text);
  const section = sectionOf(carrier, order, bound);
  process.stdout.write(formatRecords(section.entries.map(recordOf), output));
  return 0;
}

if (process.argv[1] !== undefined && fileURLToPath(import.meta.url) === process.argv[1]) {
  main(process.argv.slice(2))
    .then((code) => process.exit(code))
    .catch((error: unknown) => {
      process.stderr.write(`relationality-evaluate: ${error instanceof Error ? error.message : String(error)}\n`);
      process.exit(1);
    });
}
