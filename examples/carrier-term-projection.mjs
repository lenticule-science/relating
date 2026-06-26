import assert from "node:assert/strict";

import {
  evaluate,
  evaluateRunTerm,
  isClosed,
  tm,
  termSize,
  termUses,
} from "@emsenn/relating";
import {
  arrayTerm,
  carrierToTerm,
  objectTerm,
  stringTerm,
  termToCarrier,
} from "@emsenn/relating/evaluating/projecting";

const note = {
  kind: "example.carrier-term.note",
  title: "Carrier term bridge",
  status: "potential",
  tags: ["ir", "carrier"],
  meta: {
    count: 2,
    ready: true,
  },
};

const noteTerm = carrierToTerm(note);
const titleTerm = evaluate(tm.field("title", noteTerm));
const statusTerm = evaluate(tm.field("status", noteTerm));
const appendedTags = evaluate(
  tm.append(carrierToTerm(["ir"]), carrierToTerm(["carrier"])),
);
const runTermTitle = evaluateRunTerm(
  tm.lam(tm.field("title", tm.var(0))),
  note,
);

const manualTerm = objectTerm([
  ["kind", stringTerm("example.carrier-term.manual")],
  ["tags", arrayTerm([stringTerm("manual"), stringTerm("bridge")])],
]);
const manualCarrier = {
  kind: "example.carrier-term.manual",
  tags: ["manual", "bridge"],
};

assert.equal(isClosed(noteTerm), true);
assert.deepEqual(termToCarrier(noteTerm), note);
assert.deepEqual(titleTerm, stringTerm("Carrier term bridge"));
assert.deepEqual(statusTerm, tm.charge("potential"));
assert.deepEqual(termToCarrier(appendedTags), ["ir", "carrier"]);
assert.equal(runTermTitle, "Carrier term bridge");
assert.deepEqual(termToCarrier(manualTerm), manualCarrier);

console.log(JSON.stringify({
  product: "relating.carrier-term-projection",
  bridge: {
    inputKind: note.kind,
    closed: isClosed(noteTerm),
    size: termSize(noteTerm),
    uses: termUses(noteTerm),
    roundTrip: termToCarrier(noteTerm),
  },
  reductions: {
    title: termToCarrier(titleTerm),
    statusNormalForm: statusTerm,
    appendedTags: termToCarrier(appendedTags),
    runTermTitle,
  },
  manualBuilder: {
    encodedUses: termUses(manualTerm),
    roundTrip: termToCarrier(manualTerm),
  },
}, null, 2));
