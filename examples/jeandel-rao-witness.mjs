import { evaluateRunTerm, jeandelRaoWitness } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

const receipt = analysis.jeandelRaoWitness.receipt();
const normalized = evaluateRunTerm(jeandelRaoWitness.receipt, receipt);

console.log(JSON.stringify({
  product: "relating.jeandel-rao-witness",
  decoratedPhi: {
    edges: normalized.decoratedPhi.complex.edges.length,
    faces: normalized.decoratedPhi.complex.faces.length,
    delta1: normalized.decoratedPhi.delta1,
    nonzeroEdge: normalized.decoratedPhi.nonzeroEdge,
    h1Rank: normalized.decoratedPhi.h1Rank.members.length,
  },
  markerRingB3: {
    edges: normalized.markerRingB3.complex.edges.length,
    faces: normalized.markerRingB3.complex.faces.length,
    delta1: normalized.markerRingB3.delta1,
    nonzeroEdge: normalized.markerRingB3.nonzeroEdge,
    h1Rank: normalized.markerRingB3.h1Rank.members.length,
    rankMatchesLeanClaim: normalized.markerRingB3.h1RankMatchesLeanClaim,
  },
  boundaries: {
    pullback: normalized.decoratedPullbackBoundary,
    persistence: normalized.persistenceBoundary,
  },
}, null, 2));
