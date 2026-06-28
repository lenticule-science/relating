import test from "node:test";
import assert from "node:assert/strict";

import { causalSetCarrier } from "@emsenn/relating";
import { canonical, http } from "@emsenn/relating/writing";

test("relating CausalSet canonicalizes and re-admits", () => {
  const causalSet = {
    kind: "relating.causal-set",
    events: [
      { id: "commit:a", mediaType: "application/vnd.git.commit-graph+json" },
      { id: "build:b", mediaType: "application/vnd.git.causal-set+json", witness: { sha: "b" } },
    ],
    links: [{ from: "commit:a", to: "build:b", relation: "builds-before" }],
    linearizations: [["commit:a", "build:b"]],
    closedTimelikeObstructions: [],
    h1: 0,
  };

  const admitted = causalSetCarrier.assert(causalSet);
  const parsed = JSON.parse(canonical(admitted));
  assert.deepEqual(causalSetCarrier.assert(parsed), admitted);
});

test("npm, pnpm, and git vendor media types are assertion-corner representations", () => {
  for (const mediaType of [
    "application/vnd.npm.manifest+json",
    "application/vnd.npm.bin-surface+json",
    "application/vnd.npm.export-surface+json",
    "application/vnd.npm.type-graph+json",
    "application/vnd.pnpm.workspace+json",
    "application/vnd.pnpm.dependency-graph+json",
    "application/vnd.pnpm.cover+json",
    "application/vnd.pnpm.resolution+json",
    "application/vnd.git.commit-graph+json",
    "application/vnd.git.causal-set+json",
  ]) {
    assert.equal(http.mediaTypeCorner(mediaType), "assertion", mediaType);
    assert.ok(http.representationFits("assertion", mediaType), mediaType);
  }
  assert.equal(http.mediaTypeCorner("application/vnd.npm.package-lock+json"), "assertion");
  assert.equal(http.mediaTypeCorner("application/vnd.pnpm.lock+yaml"), "assertion");
  assert.equal(http.mediaTypeCorner("application/vnd.git.commit+json"), "assertion");
});
