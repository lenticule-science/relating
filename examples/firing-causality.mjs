import assert from "node:assert/strict";

import {
  causalCone,
  causalSeparation,
  cell,
  chargeValue,
  claim,
  classifyFiringOrbit,
  firingGradeCohomology,
  firingIndependence,
  firingSelfDuality,
  initialSettlingStageInput,
  mark,
  orderingFraction,
  predicateOfClaim,
  readCausalOrderOfSettlementFiltration,
  readFiringEventsOfSettlementFiltration,
  settlementFiltration,
  successorSettlingStageInput,
  token,
} from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

const naturalToNumber = (value) => value.members.length;
const integerToNumber = (value) => naturalToNumber(value.pos) - naturalToNumber(value.neg);
const rationalToString = (value) => {
  const numerator = integerToNumber(value.num);
  const denominator = integerToNumber(value.den);
  return `${numerator}/${denominator}`;
};

const term = (name) => token(mark(name));
const predicate = (name) => predicateOfClaim(claim(mark(name)));

const alpha = term("alpha");
const beta = term("beta");
const gamma = term("gamma");
const delta = term("delta");
const epsilon = term("epsilon");
const supports = predicate("supports");
const witnesses = predicate("witnesses");

const alphaSupportsBeta = cell(alpha, supports, beta);
const betaSupportsGamma = cell(beta, supports, gamma);
const deltaWitnessesEpsilon = cell(delta, witnesses, epsilon);

const stage0 = initialSettlingStageInput([alphaSupportsBeta]);
const stage1 = successorSettlingStageInput(stage0, [alphaSupportsBeta, betaSupportsGamma]);
const stage2 = successorSettlingStageInput(stage1, [alphaSupportsBeta, betaSupportsGamma, deltaWitnessesEpsilon]);
const settling = settlementFiltration([stage0, stage1, stage2]);

const events = readFiringEventsOfSettlementFiltration(settling);
const order = readCausalOrderOfSettlementFiltration(settling);
const timelike = causalSeparation(order, alphaSupportsBeta, betaSupportsGamma);
const spacelike = causalSeparation(order, alphaSupportsBeta, deltaWitnessesEpsilon);
const cone = causalCone(order, alphaSupportsBeta);
const fraction = orderingFraction(order);
const diamond = analysis.causal.settleCausalSet(analysis.causal.diamondCausalSet);
const chain = analysis.causal.settleCausalSet(analysis.causal.chainCausalSet);
const antichain = analysis.causal.settleCausalSet(analysis.causal.antichainCausalSet);
const geometryTopology = analysis.causal.geometryIndependentOfTopology;

assert.equal(events.length, 3);
assert.equal(timelike.kind, "meme-geometry.temporal.separation.timelike");
assert.equal(spacelike.kind, "meme-geometry.temporal.separation.spacelike");
assert.equal(cone.kind, "meme-geometry.temporal.cone");
assert.equal(cone.future.length, 1);
assert.equal(fraction.kind, "meme-geometry.temporal.orderingFraction");
assert.equal(fraction.comparablePairs, 1);
assert.equal(fraction.totalPairs, 3);
assert.equal(rationalToString(fraction.fraction), "1/3");
assert.equal(diamond.kind, "lorentzian.causalSettle:witness");
assert.equal(diamond.apexCount, 5);
assert.equal(rationalToString(diamond.orderingFraction), "5/6");
assert.equal(chain.kind, "lorentzian.causalSettle:witness");
assert.equal(rationalToString(chain.orderingFraction), "1/1");
assert.equal(antichain.kind, "lorentzian.causalSettle:witness");
assert.equal(rationalToString(antichain.orderingFraction), "0/1");
assert.equal(geometryTopology.kind, "lorentzian.myrheimMeyer.geometryIndependentOfTopology:witness");

const values = [
  chargeValue("potential"),
  chargeValue("active"),
  chargeValue("stable"),
  chargeValue("absurd"),
];
const cohomology = firingGradeCohomology(values);
const orbit = classifyFiringOrbit(values);
const selfDual = firingSelfDuality([chargeValue("stable"), chargeValue("absurd")]);
const independence = firingIndependence([
  { stage: stage0.ordinal, value: chargeValue("potential") },
  { stage: stage1.ordinal, value: chargeValue("active") },
]);

assert.equal(naturalToNumber(cohomology.abRank), 4);
assert.equal(naturalToNumber(cohomology.shadow.lPlus), 2);
assert.equal(naturalToNumber(cohomology.shadow.lMinus), 2);
assert.equal(orbit.orbitType.kind, "predication.firing.orbitType.mixed");
assert.equal(selfDual.coherence.kind, "predication.firing.selfDualityCoherence:witness");
assert.equal(independence.kind, "predication.firing.independence:witness");

console.log(JSON.stringify({
  product: "relating.firing-causality",
  temporal: {
    events: events.length,
    orderedPairs: order.precedes.reduce((sum, row) => sum + row.length, 0),
    alphaToBetaSupport: timelike.kind,
    alphaToDeltaWitness: spacelike.kind,
    alphaConeFuture: cone.kind === "meme-geometry.temporal.cone" ? cone.future.length : 0,
    orderingFraction: fraction.kind === "meme-geometry.temporal.orderingFraction"
      ? {
          comparablePairs: fraction.comparablePairs,
          totalPairs: fraction.totalPairs,
          exact: rationalToString(fraction.fraction),
        }
      : fraction.kind,
    myrheimMeyer: {
      diamond: {
        apexCount: diamond.apexCount,
        orderingFraction: rationalToString(diamond.orderingFraction),
        eulerCharacteristic: diamond.eulerCharacteristic,
      },
      chainOrderingFraction: rationalToString(chain.orderingFraction),
      antichainOrderingFraction: rationalToString(antichain.orderingFraction),
      independence: geometryTopology.kind,
    },
  },
  firing: {
    rank: naturalToNumber(cohomology.abRank),
    truthSideRank: naturalToNumber(cohomology.shadow.lPlus),
    falsitySideRank: naturalToNumber(cohomology.shadow.lMinus),
    orbit: orbit.orbitType.kind,
    selfDualCoherence: selfDual.coherence.kind,
    independence: independence.kind,
  },
  boundary: "finite settling-event causal order and charge-valued firing reads; not continuum spacetime or transfinite proof search",
}, null, 2));
