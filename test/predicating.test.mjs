/**
 * Contract: `predicate` (the predication site Φ = E × Π × E) and the relation
 * carrier (matrix, dual, transpose, state extension). This is how a relation is
 * materialized and read; the bilattice values live on its cells.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  mark, utterance, articulate, predicate,
  presentPredicationSite, freePredicationSite, jsonResource,
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

describe("the predication-site carrier stores GENERATORS; the rest is a free construction", () => {
  it("present keeps only cells+specializations; free re-derives the full site identically", () => {
    const rich = predicate(articulate(utterance(mark("subj"), mark("pred"))));
    const slim = presentPredicationSite(rich);

    // The stored carrier is just the generators — no derived entities/predicates/base.
    assert.deepEqual(Object.keys(slim).sort(), ["cells", "kind", "specializations"]);
    assert.ok(Array.isArray(slim.cells));

    // Materialization is faithful: the free construction is fully recoverable on read.
    assert.deepEqual(jsonResource(freePredicationSite(slim)), jsonResource(rich));

    // And it is genuinely smaller (the redundant free construction is not carried).
    assert.ok(JSON.stringify(jsonResource(slim)).length < JSON.stringify(jsonResource(rich)).length / 3);
  });

  it("free accepts the plain-JSON wire form (the read projection round-trips through bytes)", () => {
    const rich = predicate(articulate(utterance(mark("a"), mark("b"))));
    const wire = JSON.parse(JSON.stringify(presentPredicationSite(rich)));
    assert.deepEqual(jsonResource(freePredicationSite(wire)), jsonResource(rich));
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
