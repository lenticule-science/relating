import assert from "node:assert/strict";

import { predicating } from "@emsenn/relating/articulating";
import { fromRatio, quadraticToNumber, ratToExactString, toInt } from "@emsenn/relating/codecs";

const { spatial } = predicating.geometry;

function exactQuadratic(value) {
  const unit = ratToExactString(value.unit);
  const root = ratToExactString(value.root);
  if (root === "0") return unit;
  if (unit === "0") return `${root}sqrt(${value.radicand})`;
  const sign = root.startsWith("-") ? " - " : " + ";
  const magnitude = root.startsWith("-") ? root.slice(1) : root;
  return `${unit}${sign}${magnitude}sqrt(${value.radicand})`;
}

const slope = spatial.quadraticRational(5, fromRatio(1, 2), fromRatio(1, 2));
const scheme = spatial.cutProjectScheme(slope);
const zero = spatial.quadraticFromInts(5, 0, 0);
const one = spatial.quadraticFromInts(5, 1, 0);
const window = spatial.acceptanceWindow(zero, one);

const sampled = spatial.modelSet(scheme, window, 4);
const restricted = spatial.restrictModelSet(
  sampled,
  spatial.quadraticFromInts(5, -3, 0),
  spatial.quadraticFromInts(5, 3, 0),
);
const spectrum = spatial.gapSpectrum(restricted);
const periodOne = spatial.refutePeriod(spectrum, 1);

assert.equal(exactQuadratic(slope), "1/2 + 1/2sqrt(5)");
assert.equal(sampled.accepted.length, 9);
assert.equal(restricted.accepted.length, 3);
assert.deepEqual(spectrum.distinct.map(exactQuadratic), [
  "1/2 + 1/2sqrt(5)",
  "3/2 + 1/2sqrt(5)",
]);
assert.deepEqual(spectrum.word, [0, 1]);
assert.equal(periodOne.kind, "meme-geometry.cutProject.aperiodicity:witness");
assert.equal(periodOne.mismatchIndex, 0);

console.log(JSON.stringify({
  product: "relating.spatial-geometry",
  scheme: {
    slope: exactQuadratic(scheme.slope),
    approximateSlope: Number(quadraticToNumber(scheme.slope).toFixed(12)),
    window: {
      lower: exactQuadratic(window.lower),
      upper: exactQuadratic(window.upper),
    },
  },
  modelSet: {
    sampledRadius: 4,
    accepted: sampled.accepted.length,
    restrictedPhysicalWindow: ["-3", "3"],
    restrictedAccepted: restricted.accepted.map((witness) => ({
      site: [toInt(witness.site.unit), toInt(witness.site.slopeCount)],
      physical: exactQuadratic(witness.physical),
      internal: exactQuadratic(witness.internal),
    })),
  },
  gaps: {
    distinct: spectrum.distinct.map((gap) => ({
      exact: exactQuadratic(gap),
      approximate: Number(quadraticToNumber(gap).toFixed(12)),
    })),
    word: spectrum.word,
    refutePeriodOne: periodOne.kind,
  },
}, null, 2));
