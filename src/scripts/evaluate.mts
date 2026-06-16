#!/usr/bin/env node
/**
 * eval-relation — dispatch a relating script morphism.
 *
 * Reads a token input (stdin, or a path argument), optionally reads a claim
 * input (`--claim=PATH`), validates the action namespace against package.json
 * `exports`, and dispatches the requested script morphism. The default action
 * folds an utterance log through the descent and writes settled EAVT rows.
 *
 *   eval-relation --action=scripts.settle log.jsonl
 *   eval-relation --action=scripts.read --subject=alice settled.eavt
 *   eval-relation --action=scripts.compare subject.jsonl --claim=control.jsonl
 *   cat a.jsonl b.jsonl | eval-relation --order=truth --output=table
 *
 * Parameters: --action=scripts.settle|scripts.read|scripts.compare,
 *             --claim=PATH (optional claim input),
 *             --order=knowledge|truth (default knowledge),
 *             --bound=least|greatest (default least),
 *             --time=JSON|string (default current ISO time),
 *             --output=eavt|datom|jsonl|json|table (default eavt).
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
import { evalRelation, type PackageExports } from "./api.mjs";
import { isJsonRecord, parse as parseJson } from "../codecs/resource/json.mjs";

async function packageExports(): Promise<PackageExports> {
  const text = await readFile(new URL("../../package.json", import.meta.url), "utf8");
  const parsed = parseJson(text);
  if (!isJsonRecord(parsed)) throw new TypeError("package.json: expected a JSON object");
  const exportsValue = parsed["exports"];
  if (exportsValue === undefined) return {};
  if (!isJsonRecord(exportsValue)) throw new TypeError("package.json: expected exports to be a JSON object");
  return exportsValue;
}

async function main(argv: readonly string[]): Promise<number> {
  const args: Args = parseArgs(argv);
  const order = parseOrderName(args.flags.get("order"));
  const bound = parseBoundName(args.flags.get("bound"));
  const action = args.flags.get("action") ?? "scripts.settle";
  const output = args.flags.get("output") ?? "eavt";
  const time = args.flags.has("time")
    ? parseJsonFlag(args.flags.get("time")!)
    : new Date(Date.now()).toISOString();
  const path = args.positionals[0];
  const claimPath = args.flags.get("claim");

  const tokenDocument = path !== undefined ? await readFile(path, "utf8") : await readStdin();
  const claimDocument = claimPath === undefined || claimPath === "" ? undefined : await readFile(claimPath, "utf8");
  process.stdout.write(evalRelation(tokenDocument, claimDocument, {
    action,
    order,
    bound,
    output,
    time,
    exports: await packageExports(),
    subject: args.flags.get("subject"),
    predicate: args.flags.get("predicate"),
    object: args.flags.get("object"),
    charge: parseChargeValueName(args.flags.get("charge")),
  }));
  return 0;
}

if (process.argv[1] !== undefined && fileURLToPath(import.meta.url) === process.argv[1]) {
  main(process.argv.slice(2))
    .then((code) => process.exit(code))
    .catch((error) => {
      process.stderr.write(`eval-relation: ${error instanceof Error ? error.message : String(error)}\n`);
      process.exit(1);
    });
}
