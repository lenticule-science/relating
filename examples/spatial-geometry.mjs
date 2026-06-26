import assert from "node:assert/strict";

import { predicating } from "@emsenn/relating/articulating";
import { fromRatio, quadraticToNumber, ratToExactString, toInt } from "@emsenn/relating/writing";

const { spatial } = predicating.geometry;

function exactQuadratic(value) {
  const formatRational = (rational) => {
    const text = ratToExactString(rational);
    return text.endsWith("/1") ? text.slice(0, -2) : text;
  };
  const unit = formatRational(value.unit);
  const root = formatRational(value.root);
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
const origin = spatial.latticeSite(0, 0);
const nextSlopeSite = spatial.latticeSite(0, 1);
const originAcceptance = spatial.windowAcceptance(scheme, origin, window);
const nextSlopeAcceptance = spatial.windowAcceptance(scheme, nextSlopeSite, window);

const sampled = spatial.modelSet(scheme, window, 4);
const restricted = spatial.restrictModelSet(
  sampled,
  spatial.quadraticFromInts(5, -3, 0),
  spatial.quadraticFromInts(5, 3, 0),
);
const spectrum = spatial.gapSpectrum(restricted);
const periodOne = spatial.refutePeriod(spectrum, 1);
const periodTwo = spatial.refutePeriod(spectrum, 2);

assert.equal(exactQuadratic(slope), "1/2 + 1/2sqrt(5)");
assert.equal(originAcceptance.kind, "meme-geometry.cutProject.acceptance:witness");
assert.equal(nextSlopeAcceptance.kind, "meme-geometry.cutProject.acceptance-obstruction");
assert.equal(exactQuadratic(nextSlopeAcceptance.internal), "1/2 - 1/2sqrt(5)");
assert.equal(sampled.accepted.length, 9);
assert.equal(restricted.accepted.length, 3);
assert.deepEqual(spectrum.distinct.map(exactQuadratic), [
  "1/2 + 1/2sqrt(5)",
  "3/2 + 1/2sqrt(5)",
]);
assert.deepEqual(spectrum.word, [0, 1]);
assert.equal(periodOne.kind, "meme-geometry.cutProject.aperiodicity:witness");
assert.equal(periodOne.mismatchIndex, 0);
assert.equal(periodTwo.kind, "meme-geometry.cutProject.aperiodicity-obstruction");

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
  acceptance: {
    origin: {
      kind: originAcceptance.kind,
      physical: exactQuadratic(originAcceptance.physical),
      internal: exactQuadratic(originAcceptance.internal),
    },
    nextSlopeSite: {
      kind: nextSlopeAcceptance.kind,
      internal: exactQuadratic(nextSlopeAcceptance.internal),
      window: [exactQuadratic(window.lower), exactQuadratic(window.upper)],
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
    periodChecks: {
      periodOne: {
        kind: periodOne.kind,
        mismatchIndex: periodOne.mismatchIndex,
      },
      periodTwo: periodTwo.kind,
    },
  },
}, null, 2));
