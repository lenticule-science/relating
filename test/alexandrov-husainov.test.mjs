/**
 * Contract: the Alexandrov/Husainov surface exposes finite poset up-set
 * topology, specialization-order recovery, continuous-monotone equivalence,
 * the Cech-side Husainov boundary receipt, and RMN normalization.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  alexandrovHusainov,
  evaluateRunTerm,
} from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

describe("analysis.alexandrovHusainov: finite Alexandrov receipts", () => {
  it("enumerates the finite up-set topology and recovers the specialization order", () => {
    const receipt = analysis.alexandrovHusainov.topologyReceipt();

    assert.equal(receipt.kind, "alexandrovHusainov.topology:witness");
    assert.equal(receipt.opens.length, 6);
    assert.equal(receipt.emptyOpen, true);
    assert.equal(receipt.universeOpen, true);
    assert.equal(receipt.binaryIntersectionOpen, true);
    assert.equal(receipt.binaryUnionOpen, true);
    assert.equal(receipt.arbitraryFiniteIntersectionOpen, true);
    assert.equal(receipt.arbitraryFiniteUnionOpen, true);
    assert.equal(receipt.principalUpSetsOpen, true);
    assert.equal(receipt.specializationRecoversOrder, true);
    assert.deepEqual(analysis.alexandrovHusainov.principalUpSet(receipt.poset, "seed").points, [
      "branch-a",
      "branch-b",
      "seed",
      "top",
    ]);
    assert.equal(analysis.alexandrovHusainov.specializes(receipt.poset, "seed", "top"), true);
    assert.equal(analysis.alexandrovHusainov.specializes(receipt.poset, "branch-a", "branch-b"), false);
  });

  it("checks that finite Alexandrov continuity is monotonicity", () => {
    const map = analysis.alexandrovHusainov.monotoneMap(
      analysis.alexandrovHusainov.defaultPoset,
      analysis.alexandrovHusainov.defaultPoset,
      {
        seed: "seed",
        "branch-a": "top",
        "branch-b": "top",
        top: "top",
      },
    );
    const receipt = analysis.alexandrovHusainov.continuousMonotoneReceipt(
      analysis.alexandrovHusainov.defaultPoset,
      analysis.alexandrovHusainov.defaultPoset,
      map.map,
    );

    assert.equal(receipt.kind, "alexandrovHusainov.continuousMonotone:witness");
    assert.equal(receipt.monotone, true);
    assert.equal(receipt.preimagesOfOpensAreOpen, true);
    assert.equal(receipt.continuousIffMonotoneOnFiniteMaps, true);
  });

  it("rejects non-monotone maps between Alexandrov posets", () => {
    assert.throws(() => analysis.alexandrovHusainov.monotoneMap(
      analysis.alexandrovHusainov.defaultPoset,
      analysis.alexandrovHusainov.defaultPoset,
      {
        seed: "top",
        "branch-a": "branch-a",
        "branch-b": "branch-b",
        top: "top",
      },
    ), /not monotone/u);
  });

  it("exposes the Husainov Cech boundary and proof frontier", () => {
    const receipt = analysis.alexandrovHusainov.husainovBoundaryReceipt();

    assert.equal(receipt.kind, "alexandrovHusainov.husainovBoundary:documented");
    assert.equal(receipt.cechH1VanishesOnBoundedSites, true);
    assert.equal(receipt.derivedFunctorComparisonImplemented, false);
    assert.equal(receipt.obstruction.length, 3);
  });

  it("normalizes the combined Alexandrov/Husainov receipt as RMN data", () => {
    const receipt = analysis.alexandrovHusainov.receipt();

    assert.equal(receipt.kind, "alexandrovHusainov.receipt:witness");
    assert.equal(receipt.topology.specializationRecoversOrder, true);
    assert.equal(receipt.continuousMonotone.continuousIffMonotoneOnFiniteMaps, true);
    assert.equal(receipt.husainov.derivedFunctorComparisonImplemented, false);
    assert.deepEqual(evaluateRunTerm(alexandrovHusainov.receipt, receipt), receipt);
  });
});
