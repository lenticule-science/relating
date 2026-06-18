import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  articulate,
  mark,
  posit,
  predicate,
  readClassificationOfSettlementFiltration,
  readClosureInvariantOfSettlementFiltration,
  readDepthFiniteStageJudgmentOfSettlementFiltration,
  readDepthOfSettlementFiltration,
  readFiringsOfSettlementFiltration,
  readFirstCohomologyOfSettlementFiltration,
  readGradedGapFirstCohomologyRankIdentityOfSettlementFiltration,
  readGradedGapOfSettlementFiltration,
  readIncrementsOfSettlementFiltration,
  readLimitStagesOfSettlementFiltration,
  readNonScottFiringsOfSettlementFiltration,
  settle,
  utterance,
  type SettlementFiltration,
} from "../src/index.mjs";
import {
  readCausalOrderOfSettlementFiltration,
  readFiringEventsOfSettlementFiltration,
} from "../src/articulating/predicating/positing/settling/geometry/temporal.mjs";
import { canonical, requireJsonValue } from "../src/codecs/path/object/attribute/file/flatfile/serialization/json/index.mjs";

type Read = (carrier: SettlementFiltration) => unknown;

interface ReadScriptCase {
  readonly name: string;
  readonly label: string;
  readonly read: Read;
}

const scriptCases: readonly ReadScriptCase[] = [
  { name: "read-increments-of-settlement-filtration", label: "settlement filtration increments", read: readIncrementsOfSettlementFiltration },
  { name: "read-firings-of-settlement-filtration", label: "settlement filtration firings", read: readFiringsOfSettlementFiltration },
  { name: "read-limit-stages-of-settlement-filtration", label: "settlement filtration limit stages", read: readLimitStagesOfSettlementFiltration },
  { name: "read-non-scott-firings-of-settlement-filtration", label: "settlement filtration non-Scott firings", read: readNonScottFiringsOfSettlementFiltration },
  { name: "read-first-cohomology-of-settlement-filtration", label: "settlement filtration first cohomology", read: readFirstCohomologyOfSettlementFiltration },
  { name: "read-closure-invariant-of-settlement-filtration", label: "settlement filtration closure invariant", read: readClosureInvariantOfSettlementFiltration },
  { name: "read-graded-gap-of-settlement-filtration", label: "settlement filtration graded gap", read: readGradedGapOfSettlementFiltration },
  {
    name: "read-graded-gap-first-cohomology-rank-identity-of-settlement-filtration",
    label: "settlement filtration graded-gap first-cohomology rank identity",
    read: readGradedGapFirstCohomologyRankIdentityOfSettlementFiltration,
  },
  { name: "read-classification-of-settlement-filtration", label: "settlement filtration classification", read: readClassificationOfSettlementFiltration },
  { name: "read-depth-of-settlement-filtration", label: "settlement filtration depth", read: readDepthOfSettlementFiltration },
  { name: "read-depth-finite-stage-judgment-of-settlement-filtration", label: "settlement filtration depth finite-stage judgment", read: readDepthFiniteStageJudgmentOfSettlementFiltration },
  { name: "read-firing-events-of-settlement-filtration", label: "settlement filtration firing events", read: readFiringEventsOfSettlementFiltration },
  { name: "read-causal-order-of-settlement-filtration", label: "settlement filtration causal order", read: readCausalOrderOfSettlementFiltration },
];

function run(scriptName: string, input: string) {
  const script = fileURLToPath(new URL(`./${scriptName}.mjs`, import.meta.url));
  return spawnSync(process.execPath, [script], {
    input,
    encoding: "utf8",
  });
}

function scriptJson(value: unknown, label: string) {
  return requireJsonValue(JSON.parse(JSON.stringify(value)), label);
}

function settlementFiltrationResource(): SettlementFiltration {
  const articulated = articulate(utterance(mark("alpha"), mark("beta")));
  const carrier = settle(posit(predicate(scriptJson(articulated, "articulation cell") as never)));
  return scriptJson(carrier, "settlement filtration") as unknown as SettlementFiltration;
}

test("settlement-filtration read scripts pipe one filtration into its named read", () => {
  const carrier = settlementFiltrationResource();
  const input = `${canonical(scriptJson(carrier, "settlement filtration"))}\n`;

  for (const scriptCase of scriptCases) {
    const result = run(scriptCase.name, input);
    assert.equal(result.status, 0, scriptCase.name);
    assert.equal(result.stderr, "", scriptCase.name);
    assert.equal(
      result.stdout,
      `${canonical(scriptJson(scriptCase.read(carrier), scriptCase.label))}\n`,
      scriptCase.name,
    );
  }
});

test("settlement-filtration read scripts reject non-filtration JSON resources", () => {
  const result = run("read-increments-of-settlement-filtration", "{\"kind\":\"wrong\"}\n");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /^read-increments-of-settlement-filtration:/);
  assert.equal(result.stdout, "");
});
