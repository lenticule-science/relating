/**
 * Contract: finite spacetime fingerprints mirror
 * RelMath.Lorentzian.Hauptvermutung's testable content.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { evaluateRunTerm, hauptvermutung } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

describe("analysis.hauptvermutung: spacetime fingerprints", () => {
  it("reads the diamond fingerprint from relation count and action", () => {
    const value = analysis.hauptvermutung.fingerprint(analysis.causal.diamondCausalSet);
    const receipt = analysis.hauptvermutung.hauptvermutungReceipt();

    assert.deepEqual(value, {
      kind: "lorentzian.spacetimeFingerprint",
      relations: 5,
      action: 1,
    });
    assert.deepEqual(receipt.diamondFingerprint, value);
    assert.equal(receipt.orderIntrinsic, true);
    assert.equal(receipt.manifoldFree, true);
    assert.equal(receipt.continuumUniquenessBoundary, "faithful embedding uniqueness remains frontier");
  });

  it("normalizes the Hauptvermutung fingerprint receipt as RMN data", () => {
    const receipt = analysis.hauptvermutung.hauptvermutungReceipt();

    assert.deepEqual(evaluateRunTerm(hauptvermutung.receipt, receipt), receipt);
  });
});
