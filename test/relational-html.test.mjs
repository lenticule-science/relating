/**
 * Contract: RMN is the decidable executable codec. A closed, well-typed RMN term
 * sits at corner `assertion`, rung `scott`, and satisfies the package
 * decidability invariant. An HTML document is admitted at this boundary iff
 * EVERY script is RMN and every RMN body passes term admission; a single
 * JavaScript script is rejected.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  rmnProjector,
  isRelationalTerm,
  parseRmn,
  settleRmn,
  htmlIsRelational,
  extractRelationalScripts,
  settleRelationalHtml,
  sessionIsRelational,
  settleRelationalSession,
  cornerOf,
  rungOf,
  readIsDecidable,
  http,
} from "@emsenn/relating/writing";

// An admitted RMN program: the unit term `["star"]` type-checks to `["unit"]`.
const UNIT = JSON.stringify(["star"]);
// A product of units: `["pair", ["star"], ["star"]]` — also admitted.
const PAIR = JSON.stringify(["pair", ["star"], ["star"]]);

describe("the RMN codec is decidable-executable", () => {
  it("recognizes a closed well-typed term and rejects plain data", () => {
    assert.ok(isRelationalTerm(["star"]));
    assert.ok(isRelationalTerm(["pair", ["star"], ["star"]]));
    assert.ok(!isRelationalTerm({ a: 1 })); // plain JSON object is `data`, not a morphism
    assert.ok(!isRelationalTerm(["var", 0])); // open term (free variable) is not closed
  });

  it("sits at corner `assertion`, rung `scott`, and reads decidably", () => {
    assert.equal(cornerOf(rmnProjector), "assertion");
    assert.equal(rungOf(rmnProjector), "scott");
    assert.ok(readIsDecidable(rmnProjector)); // scott is decidable — unlike Turing JS
  });

  it("recognizes RMN source as a resource and settles it", () => {
    assert.ok(rmnProjector.recognize({ path: "t.rmn", content: UNIT }));
    assert.ok(!rmnProjector.recognize({ path: "d.json", content: '{"a":1}' }));
    assert.deepEqual(settleRmn(parseRmn(PAIR)), ["pair", ["star"], ["star"]]);
  });

  it("maps the rmn media type to the assertion corner", () => {
    assert.equal(http.mediaTypeCorner("application/rmn+json"), "assertion");
  });
});

describe("the HTML relational-script gate", () => {
  const withRmn = `<main><script type="application/rmn+json">${UNIT}</script></main>`;
  const withTwoRmn = `<script type="application/rmn+json">${UNIT}</script><script type="application/rmn+json">${PAIR}</script>`;
  const withBadRmn = `<script type="application/rmn+json">{"a":1}</script>`;
  const withJs = `<script>while(true){}</script>`;
  const withMixed = `<script type="application/rmn+json">${UNIT}</script><script type="text/javascript">x()</script>`;
  const staticDoc = `<h1>no scripts here</h1>`;

  it("admits a document whose every script is an admitted RMN term", () => {
    assert.ok(htmlIsRelational(withRmn));
    assert.ok(htmlIsRelational(withTwoRmn));
    assert.ok(htmlIsRelational(staticDoc)); // no scripts ⇒ trivially relational
  });

  it("rejects RMN script bodies that are plain data or open terms", () => {
    assert.ok(!htmlIsRelational(withBadRmn));
    assert.ok(!htmlIsRelational(`<script type="application/rmn+json">${JSON.stringify(["var", 0])}</script>`));
  });

  it("rejects any JavaScript script (Turing — undecidable completion)", () => {
    assert.ok(!htmlIsRelational(withJs));
    assert.ok(!htmlIsRelational(withMixed));
  });

  it("extracts and settles the embedded RMN morphisms", () => {
    assert.deepEqual(extractRelationalScripts(withTwoRmn), [UNIT, PAIR]);
    const settled = settleRelationalHtml(withTwoRmn);
    assert.equal(settled.length, 2);
    assert.deepEqual(settled[0], ["star"]);
    assert.throws(() => settleRelationalHtml(withMixed), /non-relational/);
  });
});

describe("the session relational-message gate (safe open sessions)", () => {
  it("admits a session whose every message is an admitted RMN term", () => {
    assert.ok(sessionIsRelational([["star"], ["pair", ["star"], ["star"]]]));
    assert.ok(sessionIsRelational([])); // a fresh session is trivially safe
  });

  it("rejects a session containing any non-RMN (Turing) message", () => {
    assert.ok(!sessionIsRelational([["star"], { run: "while(true){}" }]));
    assert.ok(!sessionIsRelational([["var", 0]])); // open term — not closed
  });

  it("settles every message of a relational session; throws on a Turing message", () => {
    const settled = settleRelationalSession([["star"], ["pair", ["star"], ["star"]]]);
    assert.deepEqual(settled, [["star"], ["pair", ["star"], ["star"]]]);
    assert.throws(() => settleRelationalSession([["star"], { x: 1 }]), /non-relational/);
  });
});
