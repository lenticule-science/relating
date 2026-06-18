import assert from "node:assert/strict";
import test from "node:test";

import { mark, utterance } from "../../../../../index.mjs";
import { induceRelation } from "../index.mjs";
import { temporal } from "./index.mjs";

test("settling geometry reads temporal structure from an induced relation", () => {
  const filtration = induceRelation(utterance(mark("alpha"), mark("beta")));
  const events = temporal.readFiringEventsOfSettlementFiltration(filtration);
  const order = temporal.readCausalOrderOfSettlementFiltration(filtration);
  const fraction = temporal.orderingFraction(order);

  assert.equal(events[0]?.kind, "meme-geometry.temporal.firingEvent");
  assert.equal(order.kind, "meme-geometry.temporal.order");
  assert.deepEqual(order.events, events);
  assert.equal(order.precedes.length, events.length);
  assert.equal(
    fraction.kind,
    events.length < 2
      ? "meme-geometry.temporal.orderingFraction-obstruction"
      : "meme-geometry.temporal.orderingFraction",
  );
});
