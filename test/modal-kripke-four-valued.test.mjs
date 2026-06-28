/**
 * Contract: RelMath.Positing.ModalKripkeFourValued is exposed as finite
 * FOUR-valued Kripke frames with modal fiber joins/meets and receipt witnesses.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  closureOp,
  evaluateRunTerm,
  modalKripke,
  modalKripkeFrame,
  modalKripkeReceipt,
  modalPairAdjunctionReceipt,
  necessitate,
  possibilize,
  twistSplit,
} from "@emsenn/relating";

describe("modal Kripke FOUR frames: finite accessibility hierarchy", () => {
  it("classifies a K frame and computes possibility/necessity over accessibility fibers", () => {
    const frame = modalKripkeFrame(["a", "b"], {
      a: ["b"],
      b: [],
    });
    const valuation = { a: "potential", b: "active" };

    assert.equal(frame.frameClass, "K");
    assert.equal(frame.reflexive, false);
    assert.deepEqual(possibilize(frame, valuation), { a: "active", b: "absurd" });
    assert.deepEqual(necessitate(frame, valuation), { a: "active", b: "stable" });
  });

  it("separates T, S4, and S5 frame laws by finite relation shape", () => {
    const tFrame = modalKripkeFrame(["a", "b", "c"], {
      a: ["a", "b"],
      b: ["b", "c"],
      c: ["c"],
    });
    const s4Frame = modalKripkeFrame(["a", "b", "c"], {
      a: ["a", "b"],
      b: ["b"],
      c: ["c"],
    });
    const s5Frame = modalKripkeFrame(["a", "b", "c"], {
      a: ["a", "b"],
      b: ["a", "b"],
      c: ["c"],
    });

    assert.equal(tFrame.frameClass, "T");
    assert.equal(tFrame.reflexive, true);
    assert.equal(tFrame.transitive, false);
    assert.equal(s4Frame.frameClass, "S4");
    assert.equal(s4Frame.transitive, true);
    assert.equal(s4Frame.symmetric, false);
    assert.equal(s5Frame.frameClass, "S5");
    assert.equal(s5Frame.symmetric, true);
  });

  it("packages K/T/S4/S5 modal laws and S5 closure into an RMN-normalized receipt", () => {
    const tFrame = modalKripkeFrame(["a", "b", "c"], {
      a: ["a", "b"],
      b: ["b", "c"],
      c: ["c"],
    });
    const s4Frame = modalKripkeFrame(["a", "b", "c"], {
      a: ["a", "b"],
      b: ["b"],
      c: ["c"],
    });
    const s5Frame = modalKripkeFrame(["a", "b", "c"], {
      a: ["a", "b"],
      b: ["a", "b"],
      c: ["c"],
    });
    const valuation = { a: "absurd", b: "stable", c: "potential" };

    const tReceipt = modalKripkeReceipt(tFrame, valuation);
    assert.equal(tReceipt.tPossibilizeInflationary, true);
    assert.equal(tReceipt.tNecessitateDeflationary, true);
    assert.equal(tReceipt.s4BoxInterior, false);
    assert.equal(tReceipt.s4DiamondClosure, false);

    const s4Receipt = modalKripkeReceipt(s4Frame, valuation);
    assert.equal(s4Receipt.s4BoxInterior, true);
    assert.equal(s4Receipt.s4DiamondClosure, true);
    assert.equal(s4Receipt.s4BoxIdempotent, true);
    assert.equal(s4Receipt.s4DiamondIdempotent, true);

    const s5Receipt = modalKripkeReceipt(s5Frame, valuation);
    assert.equal(s5Receipt.s5ForgetsToS4, true);
    assert.equal(s5Receipt.s5PossibilizeAdjointNecessitate, true);
    assert.equal(s5Receipt.s5Commutating, true);
    assert.equal(s5Receipt.s5ClosureEqualsPossibilize, true);
    assert.equal(s5Receipt.s5ClosureInflationary, true);
    assert.equal(s5Receipt.s5ClosureMonotone, true);
    assert.equal(s5Receipt.s5ClosureIdempotent, true);
    assert.deepEqual(closureOp(s5Frame, valuation), possibilize(s5Frame, valuation));
    assert.deepEqual(evaluateRunTerm(modalKripke.receipt, s5Receipt), s5Receipt);
  });

  it("packages RelMath.Closure.ModalPairAdjunction as a theorem-level S5 receipt", () => {
    const frame = modalKripkeFrame(["a", "b"], {
      a: ["a", "b"],
      b: ["a", "b"],
    });
    const valuation = { a: "absurd", b: "stable" };
    const receipt = modalPairAdjunctionReceipt(frame, valuation);

    assert.equal(receipt.kind, "positing.modalPairAdjunction.receipt:witness");
    assert.equal(receipt.theorem, "RelMath.Valuation.ModalFrame.closureOp_is_closure");
    assert.equal(receipt.modalFrameS5, true);
    assert.equal(receipt.possibilizeAdjointNecessitate, true);
    assert.equal(receipt.adjunctionUnit, true);
    assert.equal(receipt.adjunctionCounit, true);
    assert.equal(receipt.necessitatePossibilizeLe, true);
    assert.equal(receipt.closureEqualsPossibilize, true);
    assert.equal(receipt.closureInflationary, true);
    assert.equal(receipt.closureMonotone, true);
    assert.equal(receipt.closureIdempotent, true);
    assert.equal(receipt.settleFixed, true);
    assert.equal(receipt.settleLeast, true);
    assert.deepEqual(receipt.closure, { a: "stable", b: "stable" });
    assert.deepEqual(evaluateRunTerm(modalKripke.modalPairAdjunction, receipt), receipt);

    const nonS5 = modalKripkeFrame(["x", "y"], { x: ["x", "y"], y: ["y"] });
    assert.throws(() => modalPairAdjunctionReceipt(nonS5, { x: "absurd", y: "stable" }), /requires an S5/);
  });

  it("exposes the FOUR twist split and negation swap witness", () => {
    assert.deepEqual(twistSplit("active"), {
      kind: "positing.modalKripke.twistSplit",
      value: "active",
      positive: false,
      negative: true,
    });

    const receipt = modalKripkeReceipt(
      modalKripkeFrame(["w"], { w: ["w"] }),
      { w: "stable" },
    );

    assert.equal(receipt.twistSplitNegate, true);
    assert.equal(receipt.twistSplit.find((split) => split.value === "potential").positive, true);
    assert.equal(receipt.twistSplit.find((split) => split.value === "potential").negative, false);
  });
});
