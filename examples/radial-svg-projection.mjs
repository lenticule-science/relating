import assert from "node:assert/strict";

import { mark, token, claim, predicating } from "@emsenn/relating/articulating";
import {
  chargePalette,
  projectRadial,
  radialFromValuation,
  radialProjector,
} from "@emsenn/relating/writing";

const { positing } = predicating;

const alpha = token(mark("alpha"));
const beta = token(mark("beta"));
const supports = predicating.predicateOfClaim(claim(mark("supports")));
const entities = predicating.entitySet([alpha, beta], predicating.termCoincides);

const sameTerm = predicating.termCoincides;
const isAlpha = (term) => sameTerm(term, alpha);
const isBeta = (term) => sameTerm(term, beta);

const supportFiber = positing.predicateFiber(supports, entities, (subject, object) => {
  if (isAlpha(subject) && isAlpha(object)) return positing.chargeValue("potential");
  if (isAlpha(subject) && isBeta(object)) return positing.chargeValue("active");
  if (isBeta(subject) && isAlpha(object)) return positing.chargeValue("stable");
  return positing.chargeValue("absurd");
});

const site = predicating.predicationSite(
  supportFiber.cells.map(([subject, object]) => predicating.cell(subject, supports, object)),
);
const valuation = positing.valuationFromPredicateFiber(supportFiber, site.base);
const radial = radialFromValuation(valuation, {
  title: "Support fiber",
  desc: "A finite FOUR-valued predicate fiber projected as a radial SVG.",
});
const svg = projectRadial(radial, { center: "base" });

assert.equal(valuation.kind, "predication.fiber.valuation");
assert.equal(radial.rings.length, 1);
assert.equal(radial.rings[0].segments.length, 4);
assert.equal(radial.rings[0].segments.filter((segment) => segment.orbit === "diagonal").length, 2);
assert.equal(radialProjector.recognize({ path: "support.svg", content: svg }), true);
assert.match(svg, /data-codec="radial"/);
assert.match(svg, new RegExp(`fill="${chargePalette.stable}"`));

console.log(JSON.stringify({
  product: "relating.radial-svg-projection",
  input: {
    valuation: valuation.kind,
    fibers: valuation.fibers.length,
    assignments: valuation.fibers[0].assignments.length,
  },
  radial: {
    rings: radial.rings.length,
    segments: radial.rings[0].segments.length,
    diagonal: radial.rings[0].segments.filter((segment) => segment.orbit === "diagonal").length,
    offDiagonal: radial.rings[0].segments.filter((segment) => segment.orbit === "off-diagonal").length,
  },
  svg: {
    recognized: radialProjector.recognize({ path: "support.svg", content: svg }),
    bytes: svg.length,
    hasCodecMark: svg.includes("data-codec=\"radial\""),
    palette: {
      potential: chargePalette.potential,
      active: chargePalette.active,
      stable: chargePalette.stable,
      absurd: chargePalette.absurd,
    },
  },
  boundary: "charged predication valuation to deterministic SVG bytes; not a graph layout engine",
}, null, 2));
