import { canonical, parse as parseJson, requireJsonValue } from "../src/codecs/path/object/attribute/file/flatfile/serialization/json/index.mjs";
import type { SettlementFiltration } from "../src/articulating/predicating/positing/settling/index.mjs";

export type SettlementFiltrationRead = (carrier: SettlementFiltration) => unknown;

async function readStdin(): Promise<string> {
  let text = "";
  process.stdin.setEncoding("utf8");
  for await (const chunk of process.stdin) text += chunk;
  return text;
}

function jsonResource(value: unknown, label: string) {
  return requireJsonValue(JSON.parse(JSON.stringify(value)), label);
}

export async function runSettlementFiltrationRead(
  scriptName: string,
  label: string,
  read: SettlementFiltrationRead,
): Promise<number> {
  try {
    const text = await readStdin();
    const carrier = parseJson(text) as unknown as SettlementFiltration;
    const resource = read(carrier);
    process.stdout.write(`${canonical(jsonResource(resource, label))}\n`);
    return 0;
  } catch (error) {
    process.stderr.write(`${scriptName}: ${error instanceof Error ? error.message : String(error)}\n`);
    return 1;
  }
}
