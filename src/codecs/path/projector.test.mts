import test from "node:test";
import assert from "node:assert/strict";

import {
  normalizePath,
  pathBasename,
  pathOfPoint,
  pathParent,
  pathPoint,
  validPath,
} from "./projector.mjs";

test("POSIX path lexical projection normalizes without touching the filesystem", () => {
  assert.equal(normalizePath("/a/./b/../c"), "/a/c");
  assert.equal(normalizePath("a/b/../../../x"), "../x");
  assert.equal(normalizePath("/"), "/");
  assert.equal(normalizePath("."), ".");
  assert.equal(pathParent("/a/b"), "/a");
  assert.equal(pathParent("/"), null);
  assert.equal(pathParent("trace.jsonl"), ".");
  assert.equal(pathBasename("/a/b.txt"), "b.txt");
  assert.equal(pathPoint("notes/../trace.jsonl"), "path:trace.jsonl");
  assert.equal(pathOfPoint("path:/a/c"), "/a/c");
  assert.equal(pathOfPoint("fd:3"), null);
  assert.equal(validPath("a\0b"), false);
  assert.throws(() => normalizePath(""), /non-empty string without NUL/);
  assert.throws(() => normalizePath("a\0b"), /non-empty string without NUL/);
});
