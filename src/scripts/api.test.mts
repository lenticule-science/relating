import assert from "node:assert/strict";
import test from "node:test";

import { evalRelation, scriptActions, scriptMorphisms, type PackageExports } from "./api.mjs";
import { compareRecords, compareText, readText, settleText } from "./internal.mjs";

const time = "2026-06-16T00:00:00.000Z";
const log = `{"token":"alice","claim":"knows"}\n`;
const exportsMap: PackageExports = { "./scripts": { import: "./dist/scripts/api.mjs", types: "./dist/scripts/api.d.ts" } };

test("programmatic settling emits the same EAVT shape as the bin", () => {
  assert.equal(
    settleText(log, { time }),
    `["alice","knows",{"charge":"potential","object":"alice"},"${time}"]\n`,
  );
});

test("programmatic read filters EAVT and emits EAVT", () => {
  const evaluated = settleText(log, { time });
  assert.equal(readText(evaluated, { subject: "alice", time }), evaluated);
  assert.equal(readText(evaluated, { subject: "bob", time }), "");
});

test("programmatic compare returns differential records and EAVT", () => {
  const records = compareRecords(log, "", {});
  assert.equal(records.length, 1);
  assert.equal(records[0]!.charge, "active");
  assert.equal(
    compareText(log, "", { time }),
    `["alice","knows",{"charge":"active","controlCharge":"absurd","object":"alice","subjectCharge":"potential"},"${time}"]\n`,
  );
});

test("script action dispatch is constrained by package exports", () => {
  const evaluated = evalRelation(log, undefined, { action: "scripts.settle", exports: exportsMap, time });
  assert.equal(evaluated, `["alice","knows",{"charge":"potential","object":"alice"},"${time}"]\n`);
  assert.throws(
    () => evalRelation(log, undefined, { action: "topology.induce", exports: exportsMap, time }),
    /unsupported action/,
  );
  assert.throws(
    () => evalRelation(log, undefined, { action: "scripts.read", exports: {}, time }),
    /not under an exported package subpath/,
  );
});

test("script action dispatch routes token plus optional claim", () => {
  const evaluated = evalRelation(log, undefined, { action: "scripts.settle", exports: exportsMap, time });
  assert.equal(evalRelation(evaluated, undefined, { action: "scripts.read", subject: "alice", exports: exportsMap, time }), evaluated);
  assert.equal(
    evalRelation(log, "", { action: "scripts.compare", exports: exportsMap, time }),
    `["alice","knows",{"charge":"active","controlCharge":"absurd","object":"alice","subjectCharge":"potential"},"${time}"]\n`,
  );
});

test("script actions are a finite morphism registry over token and optional claim boundary documents", () => {
  assert.deepEqual(scriptActions, ["scripts.settle", "scripts.read", "scripts.compare"]);
  for (const action of scriptActions) {
    assert.equal(typeof scriptMorphisms[action], "function");
  }
  assert.equal(scriptMorphisms["scripts.settle"](log, undefined, { time }), settleText(log, { time }));
  assert.throws(
    () => scriptMorphisms["scripts.compare"](log, undefined, { time }),
    /requires a claim input/,
  );
});
