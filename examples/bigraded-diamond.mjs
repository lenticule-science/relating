import assert from "node:assert/strict";

import { bigradedDiamond, evaluateRunTerm } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

const receipt = analysis.bigradedDiamond.receipt();
const tower = analysis.bigradedDiamond.towerReceipt();
const trueFiber = receipt.family.fibers.true;
const falseFiber = receipt.family.fibers.false;

assert.equal(receipt.heyting.implicationAdjunction, true);
assert.equal(trueFiber.piAction.absurd, "stable");
assert.equal(falseFiber.left.action.absurd, "stable");
assert.equal(tower.axesIndependent, true);
assert.equal(tower.crossOrderForbidsCoNucleus.knowledgeInflationary, false);
assert.deepEqual(evaluateRunTerm(bigradedDiamond.receipt, receipt), receipt);
assert.deepEqual(evaluateRunTerm(bigradedDiamond.tower, tower), tower);

console.log(JSON.stringify({
  product: "relating.bigraded-diamond",
  trueFiber: {
    leftPole: trueFiber.leftPole,
    rightPole: trueFiber.rightPole,
    jointFixed: trueFiber.jointFixed,
  },
  falseFiber: {
    leftPole: falseFiber.leftPole,
    rightPole: falseFiber.rightPole,
    jointFixed: falseFiber.jointFixed,
  },
  variation: receipt.family.witness,
  tower: {
    grades: tower.grades.map((grade) => ({
      grade: grade.grade,
      axes: grade.fourCorner,
      corner: grade.corner,
      poles: [grade.leftPole, grade.rightPole],
    })),
    crossOrderForbidsCoNucleus: tower.crossOrderForbidsCoNucleus.knowledgeInflationary === false,
  },
}, null, 2));
