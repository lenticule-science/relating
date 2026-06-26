/**
 * Contract: external witness-ledger standards are record-tier readings of RWIL.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { canonical } from "@emsenn/relating/writing";
import {
  anchoredTimeMonotone,
  anchorWitnessTime,
  attestationLinkFromDatom,
  attestationLinkToDatom,
  createAttestationLink,
  mementoProjectionMonotone,
  mementoStateResponse,
  projectStateAt,
  provenanceOrder,
  readMementoState,
  timeMap,
  verifyAttestationDatom,
  verifyAttestationLink,
  verifyTimestampedWitness,
} from "@emsenn/relating/ledger";

describe("in-toto/SLSA/Sigstore as RWIL provenance", () => {
  it("round-trips an attestation as a record-tier provenance Datom", () => {
    const link = createAttestationLink({
      name: "build",
      subject: "pkg:emsenn/relating",
      predicateType: "https://slsa.dev/provenance/v1",
      predicate: { builder: "codex", command: "pnpm --filter @emsenn/relating run check" },
      products: ["dist"],
      t: "2026-06-26T01:00:00.000Z",
      signer: "did:web:dev.emsenn.net:agent:codex",
    });
    const datom = attestationLinkToDatom(link);
    const roundTrip = attestationLinkFromDatom(datom);

    assert.equal(verifyAttestationDatom(datom), true);
    assert.equal(canonical(roundTrip), canonical(link));
    assert.equal(datom[4].kind, "relating.ledger.provenance.reading");
    assert.equal(datom[4].verified, true);
  });

  it("rejects a tampered attestation link", () => {
    const link = createAttestationLink({
      name: "test",
      subject: "pkg:emsenn/relating",
      predicateType: "https://slsa.dev/provenance/v1",
      predicate: { command: "pnpm --filter @emsenn/relating run test" },
      products: ["test-report"],
      t: "2026-06-26T01:05:00.000Z",
      signer: "did:web:dev.emsenn.net:agent:codex",
    });
    const tampered = { ...link, predicate: { command: "skip tests" } };

    assert.equal(verifyAttestationLink(tampered), false);
    assert.equal(verifyAttestationDatom(attestationLinkToDatom(tampered)), false);
  });

  it("reads the supply-chain DAG as the witness log provenance order", () => {
    const source = createAttestationLink({
      name: "source",
      subject: "git:relating",
      predicateType: "https://slsa.dev/source/v1",
      predicate: { revision: "abc123" },
      products: ["source-tree"],
      t: "2026-06-26T01:00:00.000Z",
      signer: "builder",
    });
    const build = createAttestationLink({
      name: "build",
      subject: "pkg:relating",
      predicateType: "https://slsa.dev/provenance/v1",
      predicate: { builder: "tsc" },
      materials: ["source-tree"],
      products: ["dist"],
      t: "2026-06-26T01:01:00.000Z",
      signer: "builder",
    });
    const test = createAttestationLink({
      name: "test",
      subject: "pkg:relating",
      predicateType: "https://slsa.dev/provenance/v1",
      predicate: { suite: "node --test" },
      materials: ["dist"],
      products: ["green-report"],
      t: "2026-06-26T01:02:00.000Z",
      signer: "builder",
    });

    assert.deepEqual(provenanceOrder([test, build, source]).map((link) => link.name), ["source", "build", "test"]);
  });
});

describe("OpenTimestamps/RFC-3161 as RWIL time anchors", () => {
  it("verifies a timestamped witness against its anchor", () => {
    const row = { e: "artifact", a: "digest", v: "sha256:abc", t: "2026-06-26T02:00:00.000Z" };
    const timestamped = anchorWitnessTime(row, {
      calendar: "https://calendar.opentimestamps.org",
      authority: "tsa:example",
      attestedTime: "2026-06-26T02:00:05.000Z",
    });

    assert.equal(verifyTimestampedWitness(timestamped), true);
  });

  it("rejects a forged external time", () => {
    const row = { e: "artifact", a: "digest", v: "sha256:abc", t: "2026-06-26T02:00:00.000Z" };
    const timestamped = anchorWitnessTime(row, {
      calendar: "https://calendar.opentimestamps.org",
      authority: "tsa:example",
      attestedTime: "2026-06-26T02:00:05.000Z",
    });
    const forged = {
      ...timestamped,
      anchor: { ...timestamped.anchor, attestedTime: "2026-06-26T01:59:59.000Z" },
    };

    assert.equal(verifyTimestampedWitness(forged), false);
  });

  it("keeps anchored T monotone with log order", () => {
    const first = anchorWitnessTime(
      { e: "artifact", a: "step", v: "source", t: "2026-06-26T02:00:00.000Z" },
      { calendar: "cal", authority: "tsa", attestedTime: "2026-06-26T02:00:02.000Z" },
    );
    const second = anchorWitnessTime(
      { e: "artifact", a: "step", v: "build", t: "2026-06-26T02:00:10.000Z" },
      { calendar: "cal", authority: "tsa", attestedTime: "2026-06-26T02:00:12.000Z" },
    );

    assert.equal(anchoredTimeMonotone([first, second]), true);
    assert.equal(anchoredTimeMonotone([second, first]), false);
  });
});

describe("Memento as state@T over the witness ledger", () => {
  const log = [
    { e: "doc", a: "title", v: "First", t: "2026-06-26T03:00:00.000Z" },
    { e: "doc", a: "tag", v: "draft", t: "2026-06-26T03:00:00.000Z" },
    { e: "doc", a: "title", v: "Second", t: "2026-06-26T03:10:00.000Z" },
    { e: "doc", a: "tag", v: "reviewed", t: "2026-06-26T03:20:00.000Z" },
  ];
  const functional = new Set(["title"]);

  it("returns settled state as of an Accept-Datetime request", () => {
    const snapshot = readMementoState(log, functional, {
      acceptDatetime: "2026-06-26T03:15:00.000Z",
      original: "/doc",
    });

    assert.equal(snapshot.datetime, "2026-06-26T03:10:00.000Z");
    assert.equal(snapshot.state[canonical("doc")].title, "Second");
    assert.deepEqual(snapshot.state[canonical("doc")].tag, ["draft"]);

    const response = mementoStateResponse(log, functional, {
      acceptDatetime: "2026-06-26T03:15:00.000Z",
      original: "/doc",
      timegate: "/doc/timegate",
      timemap: "/doc/timemap",
    });
    assert.equal(response.status, 200);
    assert.equal(response.headers["Memento-Datetime"], "2026-06-26T03:10:00.000Z");
  });

  it("lists available record snapshots in a TimeMap", () => {
    const map = timeMap(log, "/doc");

    assert.deepEqual(map.snapshots.map((snapshot) => snapshot.datetime), [
      "2026-06-26T03:00:00.000Z",
      "2026-06-26T03:10:00.000Z",
      "2026-06-26T03:20:00.000Z",
    ]);
    assert.deepEqual(map.snapshots.map((snapshot) => snapshot.witnesses), [2, 3, 4]);
  });

  it("keeps the projection prefix-monotone in T", () => {
    const early = projectStateAt(log, functional, "2026-06-26T03:00:00.000Z");
    const late = projectStateAt(log, functional, "2026-06-26T03:20:00.000Z");

    assert.equal(early.state[canonical("doc")].title, "First");
    assert.equal(late.state[canonical("doc")].title, "Second");
    assert.equal(mementoProjectionMonotone(log, timeMap(log).snapshots.map((snapshot) => snapshot.datetime)), true);
  });
});
