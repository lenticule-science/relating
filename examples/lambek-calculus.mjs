import assert from "node:assert/strict";

import { evaluateRunTerm, lambek } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

const trivial = analysis.lambek.laws(analysis.lambek.trivialLambekAlgebra);
const bool = analysis.lambek.laws(analysis.lambek.booleanCommutativeLambekAlgebra);

assert.equal(trivial.kind, "lambek.laws:witness");
assert.equal(bool.kind, "lambek.laws:witness");
assert.equal(bool.commutative, true);
assert.equal(bool.singleImplicationWhenCommutative, true);
assert.deepEqual(evaluateRunTerm(lambek.laws, bool), bool);

console.log(JSON.stringify({
  product: "relating.lambek-calculus",
  trivial,
  boolean: bool,
}, null, 2));
