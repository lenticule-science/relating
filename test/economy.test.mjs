/**
 * Contract: exact graded economic value and conservation readings.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  addMoney,
  balanceOf,
  commodityOf,
  inferElidedMoney,
  isZeroMoney,
  moneyFromParts,
  parseDecimalMoney,
  subMoney,
  toDecimalString,
  toExactString,
} from "@emsenn/relating/economy";
import {
  cell,
  claim,
  mark,
  token,
  predicateOfClaim,
  charge,
  chargeValue,
} from "@emsenn/relating";

describe("exact graded value", () => {
  it("parses decimals into exact graded values without float loss", () => {
    const value = parseDecimalMoney("1.250", "USD");
    assert.equal(commodityOf(value), "USD");
    assert.equal(toExactString(value), "5/4 USD");
    assert.equal(toDecimalString(value), "1.25");
  });

  it("adds within a grade and refuses to mix grades", () => {
    const usd = moneyFromParts(1n, 2n, "USD");
    const moreUsd = moneyFromParts(3n, 2n, "USD");
    assert.equal(toExactString(addMoney(usd, moreUsd)), "2/1 USD");
    assert.throws(() => addMoney(usd, moneyFromParts(1n, 1n, "HIVE")), /grade mismatch/);
  });
});

describe("double-entry conservation", () => {
  it("balances opposite graded postings and infers the elided residual", () => {
    const debit = moneyFromParts(5n, 1n, "USD");
    const credit = moneyFromParts(-5n, 1n, "USD");
    assert.equal(isZeroMoney(addMoney(debit, credit)), true);

    const inferred = inferElidedMoney([debit]);
    assert.equal(inferred.kind, "meme-analysis.conservation.graded-completion:witness");
    assert.equal(toExactString(inferred.inferred), "-5/1 USD");
  });

  it("judges a section flow as conserved through the boundary operator", () => {
    const source = token(mark("source"));
    const target = token(mark("target"));
    const transfer = predicateOfClaim(claim(mark("transfers")));
    const sec = {
      kind: "meme-topology.section.carrier",
      order: "knowledge",
      bound: "least",
      entries: [
        {
          kind: "meme-topology.section.entry",
          cell: cell(source, transfer, target),
          charge: charge(chargeValue("potential")),
        },
      ],
    };
    const flow = [moneyFromParts(1n, 1n, "USD").value];
    assert.equal(balanceOf(sec, flow).kind, "meme-analysis.conservation.conserved-obstruction");
    assert.equal(balanceOf(sec, [subMoney(moneyFromParts(1n, 1n, "USD"), moneyFromParts(1n, 1n, "USD")).value]).kind, "meme-analysis.conservation.conserved:witness");
  });
});
