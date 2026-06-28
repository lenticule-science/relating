import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  chargeValue,
  classifyRegime,
  dev,
  decodeLeanGoldenVectorJsonl,
  evaluateRunTerm,
  joinKnowledgeValue,
  measurement,
} from "@emsenn/relating";

const readRows = (name) => readFileSync(
  new URL(`../test/fixtures/${name}`, import.meta.url),
  "utf8",
);

const fourRows = decodeLeanGoldenVectorJsonl(readRows("lean-four-golden.jsonl"), "lean-four-golden.jsonl");
const chlRows = decodeLeanGoldenVectorJsonl(readRows("lean-chl-golden.jsonl"), "lean-chl-golden.jsonl");
const domainRows = decodeLeanGoldenVectorJsonl(readRows("lean-domain-term-golden.jsonl"), "lean-domain-term-golden.jsonl");
const measurementRows = decodeLeanGoldenVectorJsonl(readRows("lean-measurement-golden.jsonl"), "lean-measurement-golden.jsonl");

const joinRow = fourRows.find((row) =>
  row.a.endsWith("/joinKnowledgeValue")
  && row.v.input.left.name === "potential"
  && row.v.input.right.name === "active");
const chlRow = chlRows.find((row) => row.v.input.sample === "fst-pair");
const classifyRow = measurementRows.find((row) =>
  row.a === "relating/term/measurement/classifyRegime"
  && row.v.input.finiteBase === true);

if (joinRow === undefined || chlRow === undefined || classifyRow === undefined) {
  throw new Error("lean conformance example fixture lookup failed");
}

const joinActual = joinKnowledgeValue(
  chargeValue(joinRow.v.input.left.name),
  chargeValue(joinRow.v.input.right.name),
);
const chlActual = dev(chlRow.v.input.term);
const classifyActual = evaluateRunTerm(measurement.classifyRegime, classifyRow.v.input);
const classifyTsActual = classifyRegime(classifyRow.v.input);

assert.equal(fourRows.length, 108);
assert.equal(chlRows.length, 6);
assert.equal(domainRows.length, 133);
assert.equal(measurementRows.length, 9);
assert.equal(joinActual.name, joinRow.v.output.name);
assert.deepEqual(chlActual, chlRow.v.output.dev);
assert.equal(classifyActual.kind, classifyRow.v.output.kind);
assert.equal(classifyTsActual.kind, classifyRow.v.output.kind);

console.log(JSON.stringify({
  product: "relating.lean-conformance",
  fixtures: {
    four: fourRows.length,
    chl: chlRows.length,
    domainPrimitives: domainRows.length,
    measurement: measurementRows.length,
  },
  checks: {
    fourKnowledgeJoin: {
      input: [joinRow.v.input.left.name, joinRow.v.input.right.name],
      lean: joinRow.v.output.name,
      node: joinActual.name,
      agrees: joinActual.name === joinRow.v.output.name,
    },
    chlDevelopment: {
      sample: chlRow.v.input.sample,
      agrees: JSON.stringify(chlActual) === JSON.stringify(chlRow.v.output.dev),
    },
    measurementClassifier: {
      input: classifyRow.v.input,
      lean: classifyRow.v.output.kind,
      rmn: classifyActual.kind,
      typescript: classifyTsActual.kind,
    },
  },
  boundary: {
    leanBacked: [
      "FOUR operation tables",
      "CHL term development samples",
      "domain primitive reduction tables",
      "closure-regime measurement cores",
    ],
    differentialAgainstTypescript: [
      "carrier-specific descent morphisms",
      "settlement reader carrier serialization",
    ],
  },
}, null, 2));
