import assert from "node:assert/strict";
import {
  chargeValueName,
  chargeValueOfDiataxisMode,
  diataxisApplication,
  diataxisAntipode,
  diataxisCognition,
  diataxisDoingDual,
  diataxisLookupDual,
  diataxisModeOfCharge,
  diataxisModes,
  diataxisReading,
} from "@emsenn/relating";

assert.equal(chargeValueName(chargeValueOfDiataxisMode("tutorial")), "absurd");
assert.equal(chargeValueName(chargeValueOfDiataxisMode("how-to")), "potential");
assert.equal(chargeValueName(chargeValueOfDiataxisMode("explanation")), "active");
assert.equal(chargeValueName(chargeValueOfDiataxisMode("reference")), "stable");

assert.equal(diataxisLookupDual("tutorial").name, "reference");
assert.equal(diataxisLookupDual("reference").name, "tutorial");
assert.equal(diataxisLookupDual("how-to").name, "how-to");
assert.equal(diataxisLookupDual("explanation").name, "explanation");

assert.equal(diataxisDoingDual("how-to").name, "explanation");
assert.equal(diataxisDoingDual("explanation").name, "how-to");
assert.equal(diataxisDoingDual("tutorial").name, "tutorial");
assert.equal(diataxisDoingDual("reference").name, "reference");

assert.equal(diataxisApplication("tutorial"), false);
assert.equal(diataxisApplication("how-to"), true);
assert.equal(diataxisApplication("explanation"), false);
assert.equal(diataxisApplication("reference"), true);

assert.equal(diataxisCognition("tutorial"), false);
assert.equal(diataxisCognition("how-to"), false);
assert.equal(diataxisCognition("explanation"), true);
assert.equal(diataxisCognition("reference"), true);

assert.equal(diataxisAntipode("tutorial").name, "reference");
assert.equal(diataxisAntipode("how-to").name, "explanation");
assert.equal(diataxisModeOfCharge(chargeValueOfDiataxisMode("reference")).name, "reference");

const reading = diataxisReading();

const table = diataxisModes.map((mode) => ({
  mode: mode.name,
  charge: chargeValueName(mode.charge),
  application: mode.application,
  cognition: mode.cognition,
  lookupDual: diataxisLookupDual(mode).name,
  doingDual: diataxisDoingDual(mode).name,
  antipode: diataxisAntipode(mode).name,
}));

console.log(JSON.stringify({
  product: "relating.diataxis-four",
  boundary: "Diataxis as a value-level read over package FOUR charge values, not a learning-cycle engine.",
  modes: table,
  dualityEdges: {
    lookup: reading.lookupDual.length,
    doing: reading.doingDual.length,
    antipode: reading.antipode.length,
  },
}, null, 2));
