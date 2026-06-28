/**
 * Contract: RelMath.Gaming.VerificationTournament's finite certificate layer is
 * exposed as structural transcript obligations plus survivor correspondence.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { evaluateRunTerm, verificationTournament } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

describe("analysis.verificationTournament: finite tournament certificates", () => {
  it("derives operational witnesses from structural transcript counts", () => {
    const receipt = analysis.verificationTournament.receipt();

    assert.equal(receipt.operational.dialecticaObjectMap, true);
    assert.equal(receipt.operational.transportRosterWitnessed, true);
    assert.equal(receipt.operational.matchmakingOnceOnly, true);
    assert.equal(receipt.operational.strategyPlayWitnessed, true);
    assert.equal(receipt.structural.transcriptMessages, 5);
    assert.equal(receipt.structural.pairwiseStreams, receipt.structural.plays);
  });

  it("derives Nash and survivor correspondence from the survivor reading", () => {
    const survivor = analysis.verificationTournament.survivorReading({
      settledStrategy: 4,
      survivingClaim: 4,
      settledRole: "claim",
      fixedPoint: true,
      pure: true,
      allRefutationsAnswered: true,
      noDominantRefutation: true,
    });
    const witness = analysis.verificationTournament.survivorCorrespondenceOfUniqueDominantClaim(survivor);

    assert.equal(witness.nashNoDeviation, true);
    assert.equal(witness.dialecticaWitnessSurvives, true);
    assert.equal(witness.equilibriumMatchesSurvivor, true);
    assert.throws(
      () => analysis.verificationTournament.survivorCorrespondenceOfUniqueDominantClaim({
        ...survivor,
        survivingClaim: 5,
      }),
      /unique dominant claim/u,
    );
  });

  it("uses the FOUR closure no-periodic-orbit read for settled verdicts", () => {
    const receipt = analysis.verificationTournament.receipt();

    assert.equal(receipt.verdict.cycleReturns, true);
    assert.equal(receipt.verdict.fixedPoint, true);
    assert.equal(receipt.verdict.stableForSeed, true);
    assert.equal(receipt.verdict.correspondsToSurvivor, true);
    assert.equal(receipt.verdict.seed, "stable");
  });

  it("normalizes the verification-tournament receipt as RMN data", () => {
    const receipt = analysis.verificationTournament.receipt();

    assert.equal(receipt.kind, "verificationTournament.receipt:witness");
    assert.deepEqual(evaluateRunTerm(verificationTournament.receipt, receipt), receipt);
  });
});
