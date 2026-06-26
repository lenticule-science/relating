import { evaluateRunTerm, scottCoalgebra } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

const receipt = analysis.scottCoalgebra.receipt();
const normalized = evaluateRunTerm(scottCoalgebra.receipt, receipt);

console.log(JSON.stringify({
  product: "relating.scott-coalgebra",
  scott: {
    familySup: normalized.scott.family.sup,
    left: normalized.scott.left,
    right: normalized.scott.right,
    commutes: normalized.scott.commutesWithDirectedJoin,
  },
  finiteAntecedent: {
    firesOnJoinIffFiresOnMember: normalized.finiteAntecedent.firesOnJoinIffFiresOnMember,
    result: normalized.finiteAntecedent.left,
  },
  coalgebra: {
    orbitLength: normalized.coalgebra.orbit.length,
    limitLeastUpperBound: normalized.coalgebra.orbitLimit.leastUpperBound,
    finiteKzShadow: normalized.coalgebra.finiteKzShadow.kzIffStrict,
  },
  boundary: normalized.coalgebra.higherCategoricalBoundary,
}, null, 2));
