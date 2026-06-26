import assert from "node:assert/strict";

import * as settling from "@emsenn/relating/settling";

const admit = (scottContinuous, finiteBase, countableCofinality) => {
  const judgment = settling.closureRegimeData(scottContinuous, finiteBase, countableCofinality);
  assert.equal(judgment.kind, "settling.closureRegimeData:witness");
  return judgment.data;
};

const strict = admit(true, true, true);
const scott = admit(true, false, true);
const transfinite = admit(false, false, true);
const aperiodic = admit(false, false, false);

const depths = [strict, scott, transfinite, aperiodic].map(settling.learningDepthOfRegimeData);

assert.deepEqual(depths.map((depth) => depth.name), [
  "rote",
  "automatization",
  "conceptual-change",
  "adaptive-expertise",
]);

assert.deepEqual(depths.map((depth) => depth.closureOrdinalRegime), [
  "finite",
  "scott",
  "transfinite",
  "aperiodic",
]);

assert.equal(settling.learningDepthOfRegime(settling.finiteClosureRegime).name, "rote");
assert.equal(settling.learningDepthOfRegime(settling.scottClosureRegime).name, "automatization");
assert.equal(settling.learningDepthOfRegime(settling.transfiniteClosureRegime).name, "conceptual-change");
assert.equal(settling.learningDepthOfRegime(settling.aperiodicClosureRegime).name, "adaptive-expertise");

console.log(JSON.stringify({
  product: "relating.learning-depth",
  depths: depths.map((depth) => ({
    name: depth.name,
    regime: depth.regime.kind,
    closureOrdinalRegime: depth.closureOrdinalRegime,
    learningReading: depth.learningReading,
  })),
  boundary: "learning depth is a read over admitted closure-regime data; not a learning-cycle engine",
}, null, 2));

