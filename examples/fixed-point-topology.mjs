import assert from "node:assert/strict";

import {
  articulate,
  mark,
  posit,
  predicate,
  readClassificationOfSettlementFiltration,
  settle,
  utterance,
} from "@emsenn/relating";
import * as settling from "@emsenn/relating/settling";

const naturalToNumber = (value) => value.members.length;

const admitted = utterance(mark("alpha"), mark("supports"));
const posited = posit(predicate(articulate(admitted)));
const settled = settle(posited);
const classification = readClassificationOfSettlementFiltration(settled);

const fixed = settling.fixedPoints(posited);
const readings = settling.fixedPointReadings(fixed);
const knowledgeSection = settling.sectionOf(readings.knowledgeLeast);
const partition = settling.partitionSection(knowledgeSection);
const vitals = settling.topologyVitals(knowledgeSection, classification);

assert.equal(fixed.kind, "predication.valuation.fixedPoint.carrier");
assert.equal(fixed.knowledge.least.fixedPoint.kind, "predication.valuation.fixedPoint:witness");
assert.equal(fixed.knowledge.greatest.fixedPoint.kind, "predication.valuation.fixedPoint:witness");
assert.equal(fixed.truth.least.fixedPoint.kind, "predication.valuation.fixedPoint:witness");
assert.equal(fixed.truth.greatest.fixedPoint.kind, "predication.valuation.fixedPoint:witness");

assert.equal(fixed.knowledge.gap.vanishing.kind, "predication.valuation.fixedPoint.gap.vanishing-obstruction");
assert.equal(fixed.truth.gap.vanishing.kind, "predication.valuation.fixedPoint.gap.vanishing:witness");
assert.equal(readings.kind, "meme-topology.fixedPointReadings");
assert.equal(readings.knowledgeLeast.information.kind, "meme-topology.information");
assert.equal(knowledgeSection.entries.length, 1);
assert.equal(partition.potential.length, 1);
assert.equal(naturalToNumber(vitals.cells), 1);
assert.equal(naturalToNumber(vitals.contradictions), 0);
assert.equal(naturalToNumber(vitals.residue), 0);

console.log(JSON.stringify({
  product: "relating.fixed-point-topology",
  fixedPoints: {
    carrier: fixed.kind,
    knowledge: {
      least: fixed.knowledge.least.fixedPoint.kind,
      greatest: fixed.knowledge.greatest.fixedPoint.kind,
      gap: fixed.knowledge.gap.vanishing.kind,
      gapRank: naturalToNumber(fixed.knowledge.gap.rank),
    },
    truth: {
      least: fixed.truth.least.fixedPoint.kind,
      greatest: fixed.truth.greatest.fixedPoint.kind,
      gap: fixed.truth.gap.vanishing.kind,
      gapRank: naturalToNumber(fixed.truth.gap.rank),
    },
  },
  information: {
    reading: readings.knowledgeLeast.kind,
    entries: naturalToNumber(readings.knowledgeLeast.information.entryCarrier.rank),
    relation: readings.knowledgeLeast.information.relation.kind,
    consistency: readings.knowledgeLeast.information.valuationConsistency.kind,
  },
  section: {
    entries: knowledgeSection.entries.length,
    potential: partition.potential.length,
    active: partition.active.length,
    stable: partition.stable.length,
    absurd: partition.absurd.length,
  },
  vitals: {
    cells: naturalToNumber(vitals.cells),
    contradictions: naturalToNumber(vitals.contradictions),
    residue: naturalToNumber(vitals.residue),
    regime: vitals.regime.kind,
  },
  boundary: "finite fixed-point topology reads over a posit presheaf; not a general Tarski solver",
}, null, 2));
