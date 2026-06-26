import assert from "node:assert/strict";

import { causal, evaluateRunTerm } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

const cone = analysis.causal.coneFieldReceipt(analysis.causal.diamondCausalSet);
const alexandrov = analysis.causal.causalAlexandrovReceipt(analysis.causal.diamondCausalSet);
const laplacian = analysis.causal.causalLaplacianReceipt(analysis.causal.diamondCausalSet, ["a"]);
const observation = analysis.causal.lightObservationReceipt(analysis.causal.diamondCausalSet);
const portrait = analysis.causal.diamondSpectralPortraitReceipt();
const report = analysis.causal.paraconsistentConeReportReceipt();
const microlocal = analysis.causal.microlocalSupportReceipt(analysis.causal.diamondCausalSet, ["a"]);
const shadow = analysis.causal.myrheimMeyerRealShadowReceipt();

assert.equal(cone.kind, "lorentzian.coneField:witness");
assert.equal(alexandrov.kind, "lorentzian.causalAlexandrov:witness");
assert.equal(laplacian.kind, "lorentzian.causalLaplacian:witness");
assert.equal(observation.kind, "lorentzian.lightObservation:witness");
assert.equal(portrait.kind, "lorentzian.diamondSpectralPortrait:witness");
assert.equal(report.kind, "lorentzian.paraconsistentConeReport:witness");
assert.equal(microlocal.kind, "lorentzian.microlocalSupport:witness");
assert.equal(shadow.dimensionInverse, "documented-boundary");
assert.deepEqual(evaluateRunTerm(causal.coneField, cone), cone);

console.log(JSON.stringify({
  product: "relating.causal-lorentzian-extensions",
  cone,
  alexandrov,
  laplacian,
  observation,
  portrait,
  report,
  microlocal,
  shadow,
}, null, 2));
