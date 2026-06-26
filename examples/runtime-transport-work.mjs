import assert from "node:assert/strict";

import {
  TRANSPORT_WORK,
  claim,
  conflicts,
  determination,
  exchangeClaim,
  judge,
  openSession,
  sessionRegime,
  sessionWork,
  workType,
} from "@emsenn/relating/running";

const transportRows = Object.entries(TRANSPORT_WORK).map(([transport, nuclei]) => ({
  transport,
  nuclei,
  workType: workType(nuclei),
  determination: determination(nuclei),
}));

assert.deepEqual(
  transportRows.map((row) => [row.transport, row.workType]),
  [
    ["request-response", "Procedure"],
    ["event-stream", "Process"],
    ["claim-session", "Derivation"],
    ["open-session", "Inquiry"],
  ],
);
assert.deepEqual(
  new Set(transportRows.map((row) => row.determination)),
  new Set(["potential", "stable", "active", "absurd"]),
);

let session = openSession();
assert.equal(workType(sessionWork(session)), "Derivation");
session = claim(session, "sky", "potential");
assert.equal(judge(session).get("sky"), "potential");
assert.equal(sessionRegime(session), "scott");

const exchanged = exchangeClaim(session, JSON.stringify({ cell: "sky", charge: "active" }));
session = exchanged.session;
const reply = JSON.parse(exchanged.reply);

assert.equal(session.claims.length, 2);
assert.equal(judge(session).get("sky"), "stable");
assert.deepEqual(conflicts(session), ["sky"]);
assert.equal(sessionRegime(session), "transfinite");
assert.equal(workType(sessionWork(session)), "Inquiry");
assert.equal(reply.judgement.sky, "stable");
assert.equal(reply.regime, "transfinite");

console.log(JSON.stringify({
  product: "relating.runtime-transport-work",
  transports: transportRows,
  claimSession: {
    claims: session.claims,
    judgement: Object.fromEntries(judge(session)),
    conflicts: conflicts(session),
    regime: sessionRegime(session),
    liveWorkType: workType(sessionWork(session)),
  },
}, null, 2));
