/**
 * Contract: `predicate` (the predication site Φ = E × Π × E) and the relation
 * carrier (matrix, dual, transpose, state extension). This is how a relation is
 * materialized and read; the bilattice values live on its cells.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  mark, utterance, articulate, predicate,
  relationMatrix, relationFromMatrix, dual, transpose, stateExtension,
  chargeValue, cellIdentity, predicationTermIdentity,
} from "@emsenn/relating";

const same = (a, b) => a === b;
const entitySet = (...entities) => ({ kind: "predication.entitySet", entities });
const predicateSet = (...predicates) => ({ kind: "predication.predicateSet", predicates });

describe("predicate materializes Φ = E × Π × E", () => {
  it("one entity and one predicate yield exactly one reflexive cell", () => {
    const site = predicate(articulate(utterance(mark("socrates"), mark("is-a"))));
    assert.equal(site.kind, "predication.site");
    assert.equal(site.cells.entities.entities.length, 1);     // |E| = 1
    assert.equal(site.cells.predicates.predicates.length, 1); // |Π| = 1
    assert.equal(site.cells.cells.length, 1);                 // |E|² · |Π| = 1
    const [cell] = site.cells.cells;
    assert.equal(cell.subject.mark.value, "socrates");
    assert.equal(cell.object.mark.value, "socrates"); // reflexive: the token is both ends
    assert.equal(cell.predicate.mark.value, "is-a");
  });

  it("identity judgments witness a term/cell against itself", () => {
    const site = predicate(articulate(utterance(mark("s"), mark("p"))));
    const [cell] = site.cells.cells;
    const [term] = site.cells.entities.entities;
    assert.equal(cellIdentity(cell, cell).kind, "predication.identity:witness");
    assert.equal(predicationTermIdentity(term, term).kind, "predication.identity:witness");
  });
});

describe("the relation carrier reads charge at a coordinate and transforms", () => {
  // points {p,q} related to state {s}: p is potential, q is active
  const m = relationMatrix(
    entitySet("p", "q"),
    predicateSet("s"),
    [["p", "s", chargeValue("potential")], ["q", "s", chargeValue("active")]],
    { samePoint: same, sameState: same },
  );
  const rel = relationFromMatrix(m);

  it("at(point, state) reads the charge value there", () => {
    assert.equal(rel.at("p", "s").name, "potential");
    assert.equal(rel.at("q", "s").name, "active");
  });

  it("state extension is the points charged present (potential or stable)", () => {
    assert.deepEqual(stateExtension(rel, "s").points.entities, ["p"]);
  });

  it("dual is transpose-and-negate; transpose preserves the value at the swapped coordinate", () => {
    assert.equal(dual(rel).at("s", "p").name, "active");      // negate(potential) = active
    assert.equal(transpose(rel).at("s", "p").name, "potential");
  });
});
