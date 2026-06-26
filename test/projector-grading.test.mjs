/**
 * Contract: every representation boundary carries its two semantic gradings — the
 * Belnap content corner ⟨addressability, assertivity⟩ and the completion rung —
 * and the catalog honors the decidability invariant (no `read` completes at a
 * non-monotone or Turing rung) and the admissible-transcode rule (only along the
 * knowledge order ≤_k; the data↔prose diagonal is not transcodable).
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  stringProjector,
  jsonProjector,
  jsonlProjector,
  eavtProjector,
  markdownProjector,
  schemaProjector,
  pathProjector,
  cornerOf,
  rungOf,
  leqK,
  admitsTranscode,
  readIsDecidable,
  transcode,
  define,
  CORNER_BITS,
  http,
} from "@emsenn/relating/writing";

describe("projector content-commitment corners", () => {
  it("assigns each codec its ⟨addressability, assertivity⟩ corner", () => {
    assert.equal(cornerOf(stringProjector), "bottom"); // ⟨0,0⟩ opaque text
    assert.equal(cornerOf(jsonProjector), "data"); // ⟨1,0⟩ addressable, non-asserting
    assert.equal(cornerOf(eavtProjector), "assertion"); // ⟨1,1⟩ addressable assertion
    assert.equal(cornerOf(markdownProjector), "assertion"); // climbs string → assertion
    assert.equal(cornerOf(pathProjector), "data");
  });

  it("inherits the corner down the restriction lattice", () => {
    assert.equal(cornerOf(jsonlProjector), "data"); // restrict(json)
    assert.equal(cornerOf(schemaProjector), "data"); // restrict(json)
  });

  it("orders the corners by the bilattice knowledge order ≤_k", () => {
    assert.ok(leqK("bottom", "data") && leqK("bottom", "assertion"));
    assert.ok(leqK("data", "assertion") && leqK("prose", "assertion"));
    assert.ok(!leqK("data", "prose") && !leqK("prose", "data")); // the incomparable middles
    assert.deepEqual(CORNER_BITS.assertion, [1, 1]);
  });
});

describe("the decidability invariant", () => {
  it("every reading codec in the catalog completes at a decidable rung", () => {
    const catalog = [
      stringProjector,
      jsonProjector,
      jsonlProjector,
      eavtProjector,
      markdownProjector,
      schemaProjector,
      pathProjector,
    ];
    for (const p of catalog) {
      assert.ok(readIsDecidable(p), `${p.type} reads at a decidable rung`);
      assert.ok(["identity", "scott"].includes(rungOf(p)), `${p.type} is identity or scott`);
    }
  });
});

describe("the admissible-transcode rule", () => {
  it("admits the ≤_k-monotone edges (enrich up, settle down)", () => {
    assert.ok(admitsTranscode("bottom", "data")); // parse: +addressability
    assert.ok(admitsTranscode("data", "assertion")); // JSON-LD: +assertivity
    assert.ok(admitsTranscode("assertion", "data")); // settle down (lossy, sound)
  });

  it("forbids the data↔prose feature-swap diagonal", () => {
    assert.ok(!admitsTranscode("data", "prose"));
    assert.ok(!admitsTranscode("prose", "data"));
  });
});

describe("transcode enforces the ≤_k-edge rule", () => {
  it("transcodes along a comparable edge (string ⊥ → json data)", () => {
    const out = transcode(stringProjector, jsonProjector, { path: "x", content: "hello" });
    assert.equal(out.trim(), '"hello"'); // the text became a JSON string
  });

  it("throws on the incomparable data↔prose diagonal", () => {
    const dataP = define({
      type: "d",
      corner: "data",
      recognize: () => true,
      read: (r) => [r.content],
      write: (i) => String(i[0]),
    });
    const proseP = define({
      type: "p",
      corner: "prose",
      recognize: () => true,
      read: (r) => [r.content],
      write: (i) => String(i[0]),
    });
    assert.throws(() => transcode(dataP, proseP, { path: "x", content: "y" }), /not ≤_k-comparable/);
  });
});

describe("corner-aware negotiation settles down, never fabricates up", () => {
  it("drops offers richer than the value's corner", () => {
    // a `data` value (JSON) may serve json/jsonl, but not turtle (assertion).
    assert.ok(http.representationFits("data", "application/json"));
    assert.ok(!http.representationFits("data", "text/turtle"));
    assert.ok(http.representationFits("assertion", "application/json")); // settle down: sound
  });

  it("negotiates only among admissible representations", () => {
    const offered = ["text/turtle", "application/json", "text/plain"];
    // value is `data`: turtle (assertion) is fabrication and is excluded.
    const chosen = http.negotiateRepresentation(
      "text/turtle;q=1.0, application/json;q=0.8",
      offered,
      "data",
    );
    assert.equal(chosen, "application/json");
    // an `assertion` value may serve turtle.
    assert.equal(http.negotiateRepresentation("text/turtle", offered, "assertion"), "text/turtle");
  });
});
