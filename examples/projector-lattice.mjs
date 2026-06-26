import assert from "node:assert/strict";

import { charge, chargeValue } from "@emsenn/relating";
import {
  admitsTranscode,
  classify,
  cornerOf,
  eavtProjector,
  entails,
  http,
  jsonProjector,
  projectRadial,
  radialProjector,
  readIsDecidable,
  rungOf,
  stringProjector,
  svgProjector,
  transcode,
  xml,
} from "@emsenn/relating/writing";
import { define, restrict } from "@emsenn/relating/writing/projector";

const chargedOf = (name) => charge(chargeValue(name));

const radialSvg = projectRadial({
  title: "Projector lattice sample",
  rings: [{
    ordinal: 0,
    segments: [
      { e: "xml", a: "restricts-to", v: "svg", orbit: "diagonal", charge: chargedOf("potential") },
      { e: "svg", a: "restricts-to", v: "radial", orbit: "off-diagonal", charge: chargedOf("stable") },
    ],
  }],
});

const radialResource = { path: "projector.svg", content: radialSvg };
const builtInCatalog = [xml.xmlProjector, svgProjector, radialProjector];
const radialClass = classify(radialResource, builtInCatalog);

assert.equal(xml.xmlProjector.recognize(radialResource), true);
assert.equal(svgProjector.recognize(radialResource), true);
assert.equal(radialProjector.recognize(radialResource), true);
assert.equal(radialClass?.type, "svg.radial");
assert.deepEqual(entails(radialClass).map((projector) => projector.type), ["svg.radial", "svg.xml", "xml"]);

const plainSvg = { path: "plain.svg", content: "<svg role=\"img\"></svg>" };
const plainXml = { path: "plain.xml", content: "<note>stable</note>" };
const plainText = { path: "plain.txt", content: "stable" };

assert.equal(classify(plainSvg, builtInCatalog)?.type, "svg.xml");
assert.equal(classify(plainXml, builtInCatalog)?.type, "xml");
assert.equal(classify(plainText, builtInCatalog), null);

const lineProjector = define({
  type: "text.lines",
  recognize: (resource) => typeof resource.content === "string",
  read: (resource) => resource.content.trimEnd().split(/\r?\n/),
  write: (lines) => lines.join("\n"),
});
const noteLineProjector = restrict(lineProjector, {
  type: "text.lines.note",
  recognize: (resource) => resource.path.endsWith(".note") && resource.content.startsWith("note:"),
});
const noteResource = { path: "sample.note", content: "note: alpha\nnote: beta\n" };

assert.equal(classify(noteResource, [lineProjector, noteLineProjector])?.type, "text.lines.note");
assert.deepEqual(entails(noteLineProjector).map((projector) => projector.type), ["text.lines.note", "text.lines"]);
assert.deepEqual(noteLineProjector.read?.(noteResource), ["note: alpha", "note: beta"]);
assert.equal(noteLineProjector.write?.(["note: gamma"]), "note: gamma");

// The two semantic gradings: each codec's content corner ⟨addressability,
// assertivity⟩ and its completion rung. Every codec reads at the decidable
// `identity` rung, so the decidability invariant holds across the catalog.
const gradedCatalog = [stringProjector, jsonProjector, eavtProjector];
const gradings = gradedCatalog.map((p) => ({ type: p.type, corner: cornerOf(p), rung: rungOf(p) }));
assert.deepEqual(gradings.map((g) => g.corner), ["bottom", "data", "assertion"]);
assert.ok(gradedCatalog.every(readIsDecidable));

// `transcode` only crosses a representation along the knowledge order ≤_k.
const transcoded = transcode(stringProjector, jsonProjector, { path: "n", content: "delta" });
assert.equal(transcoded.trim(), '"delta"'); // ⊥ string enriched to `data` json
assert.ok(admitsTranscode("data", "assertion")); // the JSON-LD edge
assert.ok(!admitsTranscode("data", "prose")); // the forbidden feature-swap diagonal

// Corner-aware negotiation settles a value down, never fabricates up: a `data`
// value cannot be served as turtle (an `assertion` form).
const offered = ["text/turtle", "application/json"];
const dataChoice = http.negotiateRepresentation("text/turtle, application/json;q=0.9", offered, "data");
const assertionChoice = http.negotiateRepresentation("text/turtle", offered, "assertion");
assert.equal(dataChoice, "application/json");
assert.equal(assertionChoice, "text/turtle");

console.log(JSON.stringify({
  product: "relating.projector-lattice",
  gradings: {
    catalog: gradings,
    transcodeStringToJson: transcoded.trim(),
    jsonLdEdgeAdmitted: admitsTranscode("data", "assertion"),
    dataProseDiagonalForbidden: !admitsTranscode("data", "prose"),
    negotiation: { dataValue: dataChoice, assertionValue: assertionChoice },
  },
  builtIn: {
    radialClass: radialClass?.type,
    radialEntails: entails(radialClass).map((projector) => projector.type),
    plainSvgClass: classify(plainSvg, builtInCatalog)?.type,
    plainXmlClass: classify(plainXml, builtInCatalog)?.type,
    plainTextClass: classify(plainText, builtInCatalog)?.type ?? null,
  },
  authored: {
    noteClass: classify(noteResource, [lineProjector, noteLineProjector])?.type,
    noteEntails: entails(noteLineProjector).map((projector) => projector.type),
    inheritedReadRows: noteLineProjector.read?.(noteResource).length,
    inheritedWrite: noteLineProjector.write?.(["note: gamma"]),
  },
  boundary: "resource recognition and carried read/write lattice; not filesystem routing or a runtime action dispatcher",
}, null, 2));
