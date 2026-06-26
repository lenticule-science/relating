import assert from "node:assert/strict";

import {
  cornerOf,
  rungOf,
  readIsDecidable,
  rmnProjector,
  htmlIsRelational,
  extractRelationalScripts,
  settleRelationalHtml,
} from "@emsenn/relating/writing";

// An HTML document that carries a relational program: its only script is RMN
// (the JSON s-expression IR for the CHL term calculus). The package admits the
// script because it is a closed, well-typed term; arbitrary JavaScript remains
// outside this read boundary. The document carries its markup, data, and
// morphism; only the interpreter (relating itself) is not in the file.
const program = JSON.stringify(["pair", ["star"], ["star"]]); // closed term : prod unit unit
const relationalDoc = `<!doctype html>
<main>
  <h1>a relational document</h1>
  <script type="application/rmn+json">${program}</script>
</main>`;

// The same document but with a JavaScript script: completion becomes Turing —
// undecidable — so the gate rejects it.
const turingDoc = `<main><script>while (true) {}</script></main>`;

assert.equal(cornerOf(rmnProjector), "assertion");
assert.equal(rungOf(rmnProjector), "scott");
assert.ok(readIsDecidable(rmnProjector)); // RMN stays off the Turing rung

assert.ok(htmlIsRelational(relationalDoc)); // every script is admitted RMN
assert.ok(!htmlIsRelational(turingDoc)); // a JS script fails the gate

const settled = settleRelationalHtml(relationalDoc);
assert.deepEqual(settled, [["pair", ["star"], ["star"]]]);

console.log(
  JSON.stringify(
    {
      product: "relating.relational-html",
      codec: { type: rmnProjector.type, corner: cornerOf(rmnProjector), rung: rungOf(rmnProjector) },
      relationalDocAdmitted: htmlIsRelational(relationalDoc),
      turingDocRejected: !htmlIsRelational(turingDoc),
      embeddedScripts: extractRelationalScripts(relationalDoc),
      settled,
      boundary:
        "an HTML document carries data + markup + an admitted RMN morphism; only the interpreter (relating src/) is not in the file",
    },
    null,
    2,
  ),
);
