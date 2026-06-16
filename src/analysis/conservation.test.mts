import test from "node:test";
import assert from "node:assert/strict";
import type { SectionCarrier } from "../topology/index.mjs";
import { ratFromInt, toNumber } from "../codecs/index.mjs";
import { cell, charge as chargeCarrier, chargeValue, claim, graded, gradedEqual, gradedNegate, mark, predicateOfClaim, token, type Cell } from "../algebra/index.mjs";
import {
  complete,
  conserved,
  divergence,
  flowNetwork,
  gradedComplete,
  gradedConserved,
  gradedResidual,
} from "./conservation.mjs";

const tm = (value: string) => token(mark(value));
const pr = (value: string) => predicateOfClaim(claim(mark(value)));
const related = (subject: ReturnType<typeof tm>, predicate: string, object: ReturnType<typeof tm>) =>
  cell(subject, pr(predicate), object);
const section = (cells: readonly Cell[]): SectionCarrier => Object.freeze({
  kind: "meme-topology.section.carrier" as const,
  order: "knowledge" as const,
  bound: "least" as const,
  entries: Object.freeze(cells.map((c) => Object.freeze({
    kind: "meme-topology.section.entry" as const,
    cell: c,
    charge: chargeCarrier(chargeValue("potential")),
  }))),
});

// A consistent directed 3-cycle a → b → c → a.
const cycleNetwork = () => {
  const a = tm("a");
  const b = tm("b");
  const c = tm("c");
  return flowNetwork(section([
    related(a, "flows-to", b),
    related(b, "flows-to", c),
    related(c, "flows-to", a),
  ]));
};

// An open path a → b → c — a source and a sink, no cycle to absorb them.
const pathNetwork = () => {
  const a = tm("a");
  const b = tm("b");
  const c = tm("c");
  return flowNetwork(section([
    related(a, "flows-to", b),
    related(b, "flows-to", c),
  ]));
};

const uniform = (count: number) =>
  Array.from({ length: count }, () => ratFromInt(1));

test("the flow network keeps each non-reflexive cell as one oriented edge", () => {
  const cycle = cycleNetwork();
  assert.equal(cycle.terms.length, 3);
  assert.equal(cycle.edges.length, 3);
  for (const edge of cycle.edges) assert.notEqual(edge.fromIndex, edge.toIndex);

  // A reflexive cell relates a term to itself: no oriented edge, no transfer.
  const a = tm("a");
  const reflexive = flowNetwork(section([related(a, "is", a)]));
  assert.equal(reflexive.edges.length, 0);
});

test("∂ vanishes on a circulation: a uniform flow around a cycle is conserved", () => {
  const cycle = cycleNetwork();
  const circulation = uniform(cycle.edges.length);
  assert.deepEqual(divergence(cycle, circulation).map(toNumber), [0, 0, 0]);
  assert.equal(conserved(cycle, circulation).kind, "meme-analysis.conservation.conserved:witness");
});

test("∂ detects and locates a leak: a path has a source and a sink", () => {
  const path = pathNetwork();
  const flow = uniform(path.edges.length);
  const divergences = divergence(path, flow).map(toNumber);

  // One term sheds a unit (source, −1), one absorbs it (sink, +1), one balances.
  assert.deepEqual([...divergences].sort((left, right) => left - right), [-1, 0, 1]);
  // The deep identity: ∂ sums to zero even when the flow does not balance —
  // every edge adds at its head exactly what it removes at its tail. The global
  // total is conserved while local conservation fails.
  assert.equal(divergences.reduce((sum, value) => sum + value, 0), 0);

  const judgment = conserved(path, flow);
  assert.equal(judgment.kind, "meme-analysis.conservation.conserved-obstruction");
  if (judgment.kind === "meme-analysis.conservation.conserved-obstruction") {
    // The residual is the syndrome: the named term is off by exactly one unit.
    assert.equal(Math.abs(toNumber(judgment.residual)), 1);
  }
});

test("completion fills the elided leg exactly: the missing entry closes the cycle", () => {
  const cycle = cycleNetwork();
  // Two legs carry one unit; the third is elided. The flow that conserves is
  // the circulation, so the missing leg must also be one unit.
  const partial = cycle.edges.map((_edge, index) => (index === 0 ? ratFromInt(0) : ratFromInt(1)));
  const completion = complete(cycle, partial, 0);
  assert.equal(completion.kind, "meme-analysis.conservation.completion:witness");
  if (completion.kind === "meme-analysis.conservation.completion:witness") {
    assert.equal(toNumber(completion.inferred), 1);
    // The completed flow genuinely conserves — verified, not asserted.
    assert.equal(conserved(cycle, completion.flow).kind, "meme-analysis.conservation.conserved:witness");
  }
});

test("completion is honest: an imbalance off the missing leg cannot be closed", () => {
  const path = pathNetwork();
  // A path has no cycle: eliding either leg leaves a leak no single edge can
  // repair, because the imbalance is not confined to that leg's endpoints.
  const partial = path.edges.map((_edge, index) => (index === 0 ? ratFromInt(0) : ratFromInt(1)));
  const completion = complete(path, partial, 0);
  assert.equal(completion.kind, "meme-analysis.conservation.completion-obstruction");
});

const charge = (n: number) => graded(ratFromInt(n), "charge");
const color = (n: number) => graded(ratFromInt(n), "color");

test("graded conservation balances each sector independently (superselection)", () => {
  // A conserved sector: +100 and −100 of charge net to nothing.
  assert.equal(gradedConserved([charge(100), charge(-100)]).kind, "meme-analysis.conservation.graded:witness");
  assert.deepEqual(gradedResidual([charge(100), charge(-100)]), []);

  // An unconserved one: the residual names the sector and the leftover (syndrome).
  const judgment = gradedConserved([charge(100), charge(-40)]);
  assert.equal(judgment.kind, "meme-analysis.conservation.graded-obstruction");
  if (judgment.kind === "meme-analysis.conservation.graded-obstruction") {
    assert.equal(judgment.residual.length, 1);
    assert.ok(gradedEqual(judgment.residual[0]!, charge(60)));
  }
});

test("graded completion infers the missing quantity, and refuses when it is ambiguous", () => {
  // One sector outstanding: the missing quantity is its negation.
  const single = gradedComplete([charge(100)]);
  assert.equal(single.kind, "meme-analysis.conservation.graded-completion:witness");
  if (single.kind === "meme-analysis.conservation.graded-completion:witness") {
    assert.ok(gradedEqual(single.inferred, gradedNegate(charge(100))));
  }

  // Already conserved: nothing to infer.
  assert.equal(gradedComplete([charge(100), charge(-100)]).kind, "meme-analysis.conservation.graded-completion-obstruction");

  // Two sectors outstanding: no single quantity can close it.
  const ambiguous = gradedComplete([charge(100), color(50)]);
  assert.equal(ambiguous.kind, "meme-analysis.conservation.graded-completion-obstruction");
  if (ambiguous.kind === "meme-analysis.conservation.graded-completion-obstruction") {
    assert.equal(ambiguous.reason, "ambiguous");
  }
});
