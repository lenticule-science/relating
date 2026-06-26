import assert from "node:assert/strict";

import {
  bigradedCohomology,
  bigradedCohomologyOfCharges,
  bigradedRow,
} from "@emsenn/relating/settling";
import { chargeValue, fourCensusOfNames, knowledgeAggregateOfCensus } from "@emsenn/relating";

const consistent = fourCensusOfNames(["potential", "active", "potential"]);
const collapsed = bigradedCohomology(consistent);

const contestedValues = [
  chargeValue("potential"),
  chargeValue("active"),
  chargeValue("stable"),
  chargeValue("absurd"),
];
const obstructed = bigradedCohomologyOfCharges(contestedValues);

assert.equal(knowledgeAggregateOfCensus(consistent), "stable");
assert.equal(collapsed.truth, 3);
assert.equal(collapsed.contradiction, 0);
assert.equal(collapsed.collapse.kind, "predication.bigradedCohomology.collapse:witness");
assert.equal(obstructed.truth, 2);
assert.equal(obstructed.contradiction, 1);
assert.equal(obstructed.collapse.kind, "predication.bigradedCohomology.collapse-obstruction");
assert.deepEqual(contestedValues.map(bigradedRow), ["truth", "truth", "contradiction", "absurd"]);

console.log(JSON.stringify({
  product: "relating.bigraded-settling-cohomology",
  consistent: {
    census: consistent,
    knowledgeAggregate: knowledgeAggregateOfCensus(consistent),
    truthRow: collapsed.truth,
    contradictionRow: collapsed.contradiction,
    collapse: collapsed.collapse.kind,
  },
  contested: {
    rows: contestedValues.map(bigradedRow),
    truthRow: obstructed.truth,
    contradictionRow: obstructed.contradiction,
    collapse: obstructed.collapse.kind,
  },
}, null, 2));
