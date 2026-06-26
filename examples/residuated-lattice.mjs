import assert from "node:assert/strict";

import { evaluateRunTerm, residuatedLattice } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

const receipt = analysis.residuatedLattice.laws(
  analysis.residuatedLattice.twoBooleanResiduatedLattice,
);

assert.equal(receipt.kind, "residuatedLattice.laws:witness");
assert.equal(receipt.residuation, true);
assert.equal(receipt.modusPonens, true);
assert.deepEqual(evaluateRunTerm(residuatedLattice.laws, receipt), receipt);

console.log(JSON.stringify({
  product: "relating.residuated-lattice",
  receipt,
}, null, 2));
