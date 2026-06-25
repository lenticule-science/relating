/**
 * Contract: the representation codecs — JSON canonicalization, the EAVT/datom
 * paraconsistent fold, the triple projection, TOML, and the RDF/markup escapers.
 * Codecs are representation boundaries; their promise is faithful, canonical,
 * round-tripping translation — stated here as intrinsic laws, no reference oracle.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  canonical, parseJson, datom, triple,
  decodeToml, encodeToml, iriRef, turtleLiteral, escapeText, slug,
  projectRadial, radialProjector, segmentOfMeme, chargePalette,
} from "@emsenn/relating/writing";
import { charge, chargeValue } from "@emsenn/relating";

describe("canonical JSON", () => {
  it("is representation-independent: key order does not change the bytes", () => {
    assert.equal(canonical({ b: 2, a: 1 }), canonical({ a: 1, b: 2 }));
    assert.equal(canonical({ b: 2, a: 1 }), '{"a":1,"b":2}');
  });
  it("is idempotent: canonicalizing a parsed canonical form is a fixed point", () => {
    const once = canonical({ z: [3, 1], a: 1 });
    assert.equal(canonical(parseJson(once)), once);
  });
});

describe("the paraconsistent datom fold", () => {
  it("an assert then a retract of the same cell folds to a held contradiction (stable), not erasure", () => {
    const log = [datom.assertDatomFact("k", "a", 1, "t1"), datom.retractDatomFact("k", "a", 1, "t2")];
    const section = datom.foldObjectDatoms(log);
    assert.equal(section.cells[0].value, "stable");
  });
});

describe("the triple projection", () => {
  it("projects an EAVT row to a subject-predicate-object triple, dropping time", () => {
    assert.deepEqual(triple.tripleFromEavt({ e: "s", a: "p", v: "o", t: "t" }), { s: "s", p: "p", o: "o" });
  });
});

describe("TOML round-trips a document", () => {
  it("decode ∘ encode is the identity on a small table", () => {
    assert.deepEqual(decodeToml(encodeToml({ a: 1, t: { b: "x" } })), { a: 1, t: { b: "x" } });
  });
});

describe("RDF/markup escapers", () => {
  it("turtle writes a bare typed literal and an angle-bracketed IRI ref", () => {
    assert.equal(turtleLiteral(42), "42");
    assert.equal(iriRef("http://x/y"), "<http://x/y>");
  });
  it("text escaping neutralizes markup metacharacters; slug normalizes a label", () => {
    assert.equal(escapeText("<b>&"), "&lt;b&gt;&amp;");
    assert.equal(slug("Hello World!"), "hello-world");
  });
});

describe("the radial codec", () => {
  const chargedOf = (name) => charge(chargeValue(name));
  const seg = (e, name, orbit) => ({ e, orbit, charge: chargedOf(name) });
  const twoRings = {
    rings: [
      { ordinal: 0, segments: [seg("a", "potential", "diagonal"), seg("b", "active", "off-diagonal")] },
      { ordinal: 1, segments: [seg("c", "stable", "off-diagonal"), seg("d", "absurd", "diagonal")] },
    ],
  };

  it("projects a self-describing SVG the radial projector recognizes, and only that", () => {
    const svg = projectRadial(twoRings);
    assert.match(svg, /<svg[\s>]/);
    assert.match(svg, /data-codec="radial"/);
    assert.equal(radialProjector.recognize({ content: svg }), true);
    assert.equal(radialProjector.recognize({ content: "<svg></svg>" }), false);
  });

  it("fills each of the FOUR charges with its own color", () => {
    for (const name of ["absurd", "potential", "active", "stable"]) {
      const svg = projectRadial({ rings: [{ ordinal: 0, segments: [seg("x", name, "diagonal")] }] });
      assert.ok(svg.includes(`fill="${chargePalette[name]}"`), `${name} -> ${chargePalette[name]}`);
    }
  });

  it("is deterministic: segment input order does not change the bytes", () => {
    const reversed = {
      rings: twoRings.rings.map((ring) => ({ ...ring, segments: [...ring.segments].reverse() })),
    };
    assert.equal(projectRadial(twoRings), projectRadial(reversed));
  });

  it("distinguishes diagonal (Δ) from off-diagonal (Δᶜ) orbits", () => {
    const svg = projectRadial(twoRings);
    assert.match(svg, /data-orbit="diagonal"/);
    assert.match(svg, /data-orbit="off-diagonal"/);
  });

  it("seats ordinal 0 differently at the apex than at the base", () => {
    assert.notEqual(projectRadial(twoRings, { center: "apex" }), projectRadial(twoRings, { center: "base" }));
  });

  it("reads a cell's orbit from subject↔object identity (self-pair is diagonal)", () => {
    const term = (value) => ({ mark: { value } });
    const predicate = (value) => ({ claim: { mark: { value } } });
    const meme = (s, p, o) => ({
      kind: "predication.fiber.meme",
      cell: { subject: term(s), predicate: predicate(p), object: term(o) },
      charge: chargedOf("potential"),
    });
    assert.equal(segmentOfMeme(meme("deer", "is", "deer")).orbit, "diagonal");
    assert.equal(segmentOfMeme(meme("deer", "eats", "grass")).orbit, "off-diagonal");
  });
});
