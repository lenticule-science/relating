/**
 * Contract: Lean -> TypeScript conformance for computable RelMath FOUR.
 *
 * Golden vectors are emitted by `lean/conformance/ConformanceVectors.lean` through
 * `lake env lean --run`, importing `RelMath.Four`. Property tests below name the
 * Lean theorem they mirror; Lean selects the law, fast-check searches the TS surface.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  charge,
  chargeValue,
  chargeValueNames,
  conflateValue,
  gauge,
  joinKnowledgeValue,
  joinTruthValue,
  leqKnowledge,
  leqTruth,
  meetKnowledgeValue,
  meetTruthValue,
  negateValue,
  sameChargeValue,
  dev as chlDev,
  evaluate as chlEval,
  tmCarrier,
  ty,
  tyCarrier,
} from "@emsenn/relating";

const fc = await import("fast-check").catch(() => {
  const constantFrom = (...values) => ({ values });
  const property = (...args) => {
    const predicate = args.at(-1);
    const arbitraries = args.slice(0, -1);
    return { arbitraries, predicate };
  };
  const tuples = (arbitraries, prefix = []) => {
    if (arbitraries.length === 0) return [prefix];
    const [head, ...tail] = arbitraries;
    return head.values.flatMap((value) => tuples(tail, [...prefix, value]));
  };
  const assertProperty = ({ arbitraries, predicate }) => {
    for (const tuple of tuples(arbitraries)) predicate(...tuple);
  };
  return { constantFrom, property, assert: assertProperty };
});

const here = dirname(fileURLToPath(import.meta.url));
const vectorPath = join(here, "fixtures", "lean-four-golden.jsonl");
const vectors = readFileSync(vectorPath, "utf8").trim().split(/\r?\n/u).map((line) => JSON.parse(line));
const chlVectorPath = join(here, "fixtures", "lean-chl-golden.jsonl");
const chlVectors = readFileSync(chlVectorPath, "utf8").trim().split(/\r?\n/u).map((line) => JSON.parse(line));
const domainVectorPath = join(here, "fixtures", "lean-domain-term-golden.jsonl");
const domainVectors = readFileSync(domainVectorPath, "utf8").trim().split(/\r?\n/u).map((line) => JSON.parse(line));
const chargeName = fc.constantFrom(...chargeValueNames);
const asValue = (name) => chargeValue(name);
const sameName = (left, right) => sameChargeValue(left, right);

const ids = {
  joinK: "relating/articulating/predicating/positing/bilattice-charge/joinKnowledgeValue",
  meetK: "relating/articulating/predicating/positing/bilattice-charge/meetKnowledgeValue",
  joinT: "relating/articulating/predicating/positing/bilattice-charge/joinTruthValue",
  meetT: "relating/articulating/predicating/positing/bilattice-charge/meetTruthValue",
  neg: "relating/articulating/predicating/positing/bilattice-charge/negateValue",
  conf: "relating/articulating/predicating/positing/bilattice-charge/conflateValue",
  double: "relating/articulating/predicating/positing/bilattice-charge/doubleValue",
  leK: "relating/articulating/predicating/positing/bilattice-charge/leqKnowledge",
  leT: "relating/articulating/predicating/positing/bilattice-charge/leqTruth",
};

const operation = {
  [ids.joinK]: ({ left, right }) => joinKnowledgeValue(asValue(left.name), asValue(right.name)),
  [ids.meetK]: ({ left, right }) => meetKnowledgeValue(asValue(left.name), asValue(right.name)),
  [ids.joinT]: ({ left, right }) => joinTruthValue(asValue(left.name), asValue(right.name)),
  [ids.meetT]: ({ left, right }) => meetTruthValue(asValue(left.name), asValue(right.name)),
  [ids.neg]: ({ charge: value }) => negateValue(asValue(value.name)),
  [ids.conf]: ({ charge: value }) => conflateValue(asValue(value.name)),
  [ids.double]: ({ charge: value }) => gauge("double", asValue(value.name)),
  [ids.leK]: ({ left, right }) => leqKnowledge(charge(asValue(left.name)), charge(asValue(right.name))),
  [ids.leT]: ({ left, right }) => leqTruth(charge(asValue(left.name)), charge(asValue(right.name))),
};

const expectedRows = {
  [ids.joinK]: 16,
  [ids.meetK]: 16,
  [ids.joinT]: 16,
  [ids.meetT]: 16,
  [ids.neg]: 4,
  [ids.conf]: 4,
  [ids.double]: 4,
  [ids.leK]: 16,
  [ids.leT]: 16,
};

describe("Lean golden vectors for computable FOUR operations", () => {
  it("are schema-tagged, $id-keyed EAVT rows emitted for the complete finite tables", () => {
    assert.equal(vectors.length, 108);
    for (const [id, count] of Object.entries(expectedRows)) {
      assert.equal(vectors.filter((row) => row.a === id).length, count, id);
    }
    for (const row of vectors) {
      assert.equal(row.$schema, "relating/conformance/golden-vector");
      assert.equal(row.a, row.v.operation.$id);
      assert.ok(row.e.endsWith("ConformanceVectors.lean"));
      assert.equal(typeof row.t, "string");
    }
  });

  it("asserts the whole Lean-computed function graph against the TS implementation", () => {
    for (const row of vectors) {
      const actual = operation[row.a](row.v.input);
      const expected = row.v.output;
      if (typeof expected === "boolean") {
        assert.equal(actual, expected, row.a);
      } else {
        assert.equal(actual.name, expected.name, `${row.a} ${JSON.stringify(row.v.input)}`);
      }
    }
  });
});

describe("Lean theorem properties mirrored in TypeScript", () => {
  it("RelMath.Charge.joinK_assoc", () => fc.assert(fc.property(chargeName, chargeName, chargeName, (a, b, c) => {
    assert.ok(sameName(
      joinKnowledgeValue(joinKnowledgeValue(asValue(a), asValue(b)), asValue(c)),
      joinKnowledgeValue(asValue(a), joinKnowledgeValue(asValue(b), asValue(c))),
    ));
  })));

  it("RelMath.Charge.meetK_assoc", () => fc.assert(fc.property(chargeName, chargeName, chargeName, (a, b, c) => {
    assert.ok(sameName(
      meetKnowledgeValue(meetKnowledgeValue(asValue(a), asValue(b)), asValue(c)),
      meetKnowledgeValue(asValue(a), meetKnowledgeValue(asValue(b), asValue(c))),
    ));
  })));

  it("RelMath.Charge.joinT_assoc", () => fc.assert(fc.property(chargeName, chargeName, chargeName, (a, b, c) => {
    assert.ok(sameName(
      joinTruthValue(joinTruthValue(asValue(a), asValue(b)), asValue(c)),
      joinTruthValue(asValue(a), joinTruthValue(asValue(b), asValue(c))),
    ));
  })));

  it("RelMath.Charge.meetT_assoc", () => fc.assert(fc.property(chargeName, chargeName, chargeName, (a, b, c) => {
    assert.ok(sameName(
      meetTruthValue(meetTruthValue(asValue(a), asValue(b)), asValue(c)),
      meetTruthValue(asValue(a), meetTruthValue(asValue(b), asValue(c))),
    ));
  })));

  it("RelMath.Charge.joinK_idem", () => fc.assert(fc.property(chargeName, (a) => {
    assert.ok(sameName(joinKnowledgeValue(asValue(a), asValue(a)), asValue(a)));
  })));

  it("RelMath.Charge.meetK_idem", () => fc.assert(fc.property(chargeName, (a) => {
    assert.ok(sameName(meetKnowledgeValue(asValue(a), asValue(a)), asValue(a)));
  })));

  it("RelMath.Charge.negate_negate", () => fc.assert(fc.property(chargeName, (a) => {
    assert.ok(sameName(negateValue(negateValue(asValue(a))), asValue(a)));
  })));

  it("RelMath.Charge.conflate_conflate", () => fc.assert(fc.property(chargeName, (a) => {
    assert.ok(sameName(conflateValue(conflateValue(asValue(a))), asValue(a)));
  })));

  it("RelMath.Charge.negate_conflate_comm", () => fc.assert(fc.property(chargeName, (a) => {
    assert.ok(sameName(
      negateValue(conflateValue(asValue(a))),
      conflateValue(negateValue(asValue(a))),
    ));
  })));

  it("RelMath.Charge.negate_leK", () => fc.assert(fc.property(chargeName, chargeName, (a, b) => {
    assert.equal(
      leqKnowledge(charge(negateValue(asValue(a))), charge(negateValue(asValue(b)))),
      leqKnowledge(charge(asValue(a)), charge(asValue(b))),
    );
  })));

  it("RelMath.Charge.negate_leT", () => fc.assert(fc.property(chargeName, chargeName, (a, b) => {
    assert.equal(
      leqTruth(charge(negateValue(asValue(a))), charge(negateValue(asValue(b)))),
      leqTruth(charge(asValue(b)), charge(asValue(a))),
    );
  })));
});

describe("Lean golden vectors for RelMath.CHL.Tm", () => {
  it("declares Ty and Tm as schema-first $id carriers over JSON s-expressions", () => {
    assert.equal(tyCarrier.id, "relating/term/ty");
    assert.equal(tyCarrier.schema.$id, "relating/term/ty");
    assert.equal(tmCarrier.id, "relating/term/tm");
    assert.equal(tmCarrier.schema.$id, "relating/term/tm");

    const sampleTy = ty.arrow(ty.prod(ty.base(), ty.unit()), ty.unit());
    const sampleTm = ["app", ["lam", ["var", 0]], ["star"]];
    assert.equal(tyCarrier.validate(sampleTy), true);
    assert.equal(tmCarrier.validate(sampleTm), true);
    assert.deepEqual(JSON.parse(JSON.stringify(sampleTm)), sampleTm);
  });

  it("asserts Lean-computed dev and normal forms against the TS evaluator", () => {
    assert.equal(chlVectors.length, 6);
    for (const row of chlVectors) {
      assert.equal(row.$schema, "relating/conformance/golden-vector");
      assert.equal(row.a, "relating/term/chl/eval");
      assert.deepEqual(chlDev(row.v.input.term), row.v.output.dev, row.v.input.sample);
      assert.deepEqual(chlEval(row.v.input.term), row.v.output.normal, row.v.input.sample);
    }
  });

  it("the vector oracle catches a deliberately broken fst-projection reduction", () => {
    const brokenDev = (term) => term[0] === "fst" ? ["fst", brokenDev(term[1])] : chlDev(term);
    const caught = chlVectors.filter((row) =>
      JSON.stringify(brokenDev(row.v.input.term)) !== JSON.stringify(row.v.output.dev));
    assert.ok(caught.some((row) => row.v.input.sample === "fst-pair"));
  });
});

describe("Lean golden vectors for domain primitives in RelMath.CHL.Tm", () => {
  it("covers Mark, FOUR constants/generators, complete charge tables, order tables, and settle", () => {
    assert.equal(domainVectors.length, 133);
    const expectedRows = {
      charge: 4,
      mark: 1,
      generator: 4,
      negate: 4,
      conflate: 4,
      negConf: 4,
      joinK: 16,
      meetK: 16,
      joinT: 16,
      meetT: 16,
      leK: 16,
      leT: 16,
      settle: 16,
    };
    for (const [op, count] of Object.entries(expectedRows)) {
      assert.equal(domainVectors.filter((row) => row.v.input.term[0] === op).length, count, op);
    }
    for (const row of domainVectors) {
      assert.equal(row.$schema, "relating/conformance/golden-vector");
      assert.equal(row.a, "relating/term/domain/eval");
      assert.equal(row.a, row.v.operation.$id);
      assert.ok(row.e.endsWith("ConformanceVectors.lean"));
    }
  });

  it("asserts Lean-computed domain primitive reductions against the TS evaluator", () => {
    for (const row of domainVectors) {
      assert.equal(tmCarrier.validate(row.v.input.term), true, row.v.input.sample);
      assert.deepEqual(chlDev(row.v.input.term), row.v.output.dev, row.v.input.sample);
      assert.deepEqual(chlEval(row.v.input.term), row.v.output.normal, row.v.input.sample);
      assert.deepEqual(JSON.parse(JSON.stringify(row.v.output.normal)), row.v.output.normal, row.v.input.sample);
    }
  });

  it("the domain vector oracle catches a deliberately broken conflate reduction", () => {
    const brokenDev = (term) => {
      if (term[0] === "conflate" && term[1][0] === "charge") return term[1];
      return chlDev(term);
    };
    const caught = domainVectors.filter((row) =>
      JSON.stringify(brokenDev(row.v.input.term)) !== JSON.stringify(row.v.output.dev));
    assert.ok(caught.some((row) => row.v.input.sample === "conflate-absurd"));
  });
});
