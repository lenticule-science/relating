/**
 * Contract: finite Collatz arithmetic shadows mirror the computable RelMath
 * Collatz modules and expose RMN-normalizable carrier judgments.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { collatz, evaluateRunTerm } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

const C = analysis.collatz;

describe("analysis.collatz: finite Collatz arithmetic shadows", () => {
  it("computes accelerated steps, parity words, and affine trace witnesses", () => {
    const word = C.parityWord(7, 5);
    const trace = C.traceOfWord(word);
    const affine = C.affineTraceParityWord(7, 5);

    assert.equal(C.step(7), 11);
    assert.equal(C.orbit(7, 5), 20);
    assert.deepEqual(word, ["O", "O", "O", "E", "O"]);
    assert.deepEqual(trace, { kind: "collatz.affineTrace", A: 81, B: 32, C: 73 });
    assert.equal(affine.kind, "collatz.affineTraceParityWord:witness");
    assert.equal(affine.lhs, 640);
    assert.equal(affine.rhs, 640);
    assert.equal(affine.holds, true);
    assert.equal(affine.coefficientContracting, false);
    assert.equal(affine.descends, false);
  });

  it("models first-passage words and parent barriers", () => {
    const firstE = C.firstPassageWord(["E"]);
    const firstOE = C.firstPassageWord(["O", "E"]);
    const parentO = C.parentBarrier(["O"]);
    const obstruction = C.firstPassageWord(["O"]);

    assert.equal(firstE.kind, "collatz.firstPassage:witness");
    assert.equal(firstE.endsInE, true);
    assert.deepEqual([firstE.lowerPower, firstE.middlePower, firstE.upperPower], [1, 1, 2]);

    assert.equal(firstOE.kind, "collatz.firstPassage:witness");
    assert.equal(firstOE.trace.A, 3);
    assert.equal(firstOE.trace.B, 4);
    assert.equal(firstOE.trace.C, 1);
    assert.deepEqual([firstOE.lowerPower, firstOE.middlePower, firstOE.upperPower], [2, 3, 4]);

    assert.equal(parentO.kind, "collatz.parentBarrier:witness");
    assert.equal(parentO.appendEFirstPassage, true);
    assert.equal(parentO.D, 1);
    assert.equal(parentO.M, 4);

    assert.equal(obstruction.kind, "collatz.firstPassage-obstruction");
    assert.equal(obstruction.reason, "not-contracting");
  });

  it("models two-adic shortcut depth, reached-set quiescence, residue arithmetic, and Padovan shape", () => {
    const factor = C.twoAdicFactor(40);
    const shortcut = C.shortcutOddPart(5);
    const quiescence = C.reachedQuiescence(1, 2);
    const nonQuiescence = C.reachedQuiescence(7, 10);
    const residue = C.residueCharacterization(1, 1, 4);
    const padovan = C.padovanLeFibSeq(10);

    assert.deepEqual(factor, {
      kind: "collatz.twoAdicFactor:witness",
      value: 40,
      exponent: 3,
      oddPart: 5,
      holds: true,
    });
    assert.equal(shortcut.kind, "collatz.shortcutOddPart:witness");
    assert.equal(shortcut.expanded, 16);
    assert.equal(shortcut.exponent, 4);
    assert.equal(shortcut.oddPart, 1);
    assert.equal(shortcut.nonemptyHalvingRun, true);

    assert.equal(quiescence.kind, "collatz.reachedQuiescence:witness");
    assert.deepEqual(quiescence.reached, [1, 2]);
    assert.equal(quiescence.revisitAt, 0);
    assert.equal(quiescence.terminal, true);
    assert.equal(nonQuiescence.kind, "collatz.reachedQuiescence-obstruction");

    assert.equal(residue.kind, "collatz.residueCharacterization:witness");
    assert.equal(residue.residue, 1);
    assert.equal(residue.semigroupMember, true);
    assert.equal(residue.residueInequality, true);
    assert.equal(residue.equivalent, true);

    assert.equal(padovan.kind, "collatz.padovanLeFibSeq:witness");
    assert.equal(padovan.padovan, 12);
    assert.equal(padovan.fibSeq, 89);
    assert.equal(padovan.holds, true);
  });
});

describe("collatz RMN terms normalize finite Collatz carriers", () => {
  it("normalizes Collatz witness and obstruction carriers", () => {
    const affine = C.affineTraceParityWord(7, 5);
    const first = C.firstPassageWord(["O", "E"]);
    const parent = C.parentBarrier(["O"]);
    const factor = C.twoAdicFactor(40);
    const shortcut = C.shortcutOddPart(5);
    const quiescence = C.reachedQuiescence(1, 2);
    const residue = C.residueCharacterization(1, 1, 4);
    const padovan = C.padovanLeFibSeq(10);

    assert.deepEqual(evaluateRunTerm(collatz.affineTraceParityWord, affine), affine);
    assert.deepEqual(evaluateRunTerm(collatz.firstPassage, first), first);
    assert.deepEqual(evaluateRunTerm(collatz.parentBarrier, parent), parent);
    assert.deepEqual(evaluateRunTerm(collatz.twoAdicFactor, factor), factor);
    assert.deepEqual(evaluateRunTerm(collatz.shortcutOddPart, shortcut), shortcut);
    assert.deepEqual(evaluateRunTerm(collatz.reachedQuiescence, quiescence), quiescence);
    assert.deepEqual(evaluateRunTerm(collatz.residueCharacterization, residue), residue);
    assert.deepEqual(evaluateRunTerm(collatz.padovanLeFibSeq, padovan), padovan);
  });
});
