/**
 * Contract: the witness boundary — `log → state → record → content`. Every
 * scripted play appends an EAVT row (append-only, deduped); the state view projects
 * the latest value of a functional attribute; and the markdown content tier is a
 * holographic adjoint whose counit recovers the cells a document was projected from.
 *
 * Self-cleaning: the filesystem test uses a temp dir removed in `after`.
 */
import { describe, it, after } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { canonical, createMarkdown, markdownDataform, markdown } from "@emsenn/relating/codecs";
import {
  appendWitnesses, projectStateView, projectContentDocuments, markdownContent,
  projectFeedContent, ensureStoreDirs,
} from "@emsenn/relating/holography/projecting";

const tempRoots = [];
const tempRoot = () => { const r = mkdtempSync(join(tmpdir(), "rel-holo-")); tempRoots.push(r); return r; };
after(() => { for (const r of tempRoots) rmSync(r, { recursive: true, force: true }); });

const VIEW = Object.freeze({ name: "Foo", description: "a thing", tags: Object.freeze(["x", "y"]), body: "# Body\n\ntext\n" });

describe("the append-only witness log", () => {
  it("dedupes a byte-identical row to zero cost (append is idempotent on content)", () => {
    const root = tempRoot();
    const store = { logDir: root, stateDir: root, recordDir: root };
    const row = { e: "k", a: "author", v: "ada", t: "2026-01-01" };
    assert.equal(appendWitnesses(store, "f", [row]).appended, 1);
    assert.equal(appendWitnesses(store, "f", [row]).appended, 0);
  });

  it("the state view keeps the latest witness of a functional attribute", () => {
    const log = [
      { e: "acct", a: "stake", v: 1, t: "2026-01-01" },
      { e: "acct", a: "stake", v: 7, t: "2026-02-01" },
    ];
    const view = projectStateView(log, new Set(["stake"]));
    assert.equal(view[canonical("acct")].stake, 7);
  });
});

describe("the markdown content adjoint", () => {
  it("createMarkdown round-trips frontmatter and body through parseMarkdown", () => {
    const parsed = markdown.parseMarkdown(createMarkdown(VIEW));
    assert.deepEqual(parsed.frontmatter, { name: "Foo", description: "a thing", tags: ["x", "y"] });
    assert.equal(parsed.body, VIEW.body);
  });

  it("counit: markdownDataform(createMarkdown(view)) recovers the projected cells", () => {
    const dataform = markdownDataform(createMarkdown(VIEW), { witness: "w" });
    const got = new Set(dataform.assertions.map((a) => `${a.a}=${JSON.stringify(a.v)}`));
    for (const expected of ['name="Foo"', 'description="a thing"', 'tags="x"', 'tags="y"', `body=${JSON.stringify(VIEW.body)}`]) {
      assert.ok(got.has(expected), `missing ${expected}`);
    }
  });

  it("quotes scalars that would drift type, leaves others plain", () => {
    const fm = markdown.parseMarkdown(createMarkdown({ flag: "true", count: "3", n: 7, b: false })).frontmatter;
    assert.equal(fm.flag, "true"); // a string, not the boolean true
    assert.equal(fm.count, "3");   // a string, not the number 3
    assert.equal(fm.n, 7);
    assert.equal(fm.b, false);
  });
});

describe("content projection", () => {
  it("takes exactly the cut the projection accepts", () => {
    const view = { a: { kind: "keep" }, b: { kind: "drop" }, c: { kind: "keep" } };
    assert.deepEqual(projectContentDocuments(view, markdownContent).map((d) => d.entity), ["a", "b", "c"]);
    const cut = projectContentDocuments(view, { ...markdownContent, accept: (_e, v) => v.kind === "keep" });
    assert.deepEqual(cut.map((d) => d.entity), ["a", "c"]);
  });

  it("projectFeedContent writes one term-addressed markdown file per entity from the witnessed log", () => {
    const root = tempRoot();
    const store = Object.freeze({ logDir: join(root, "log"), stateDir: join(root, "state"), recordDir: join(root, "record"), contentDir: join(root, "content") });
    ensureStoreDirs(store);
    const feed = Object.freeze({ name: "things", cellize: () => [], functional: Object.freeze(["name", "description", "body"]) });
    appendWitnesses(store, feed.name, [
      { e: "foo", a: "name", v: "Foo", t: "2026-06-21T00:00:00Z" },
      { e: "foo", a: "description", v: "a thing", t: "2026-06-21T00:00:00Z" },
      { e: "foo", a: "tags", v: "x", t: "2026-06-21T00:00:00Z" },
      { e: "foo", a: "tags", v: "y", t: "2026-06-21T00:00:00Z" },
      { e: "foo", a: "body", v: "# Foo\n", t: "2026-06-21T00:00:00Z" },
    ]);
    const written = projectFeedContent(store, feed);
    assert.equal(written.length, 1);
    assert.match(written[0], /content[\\/]foo[\\/]foo\.md$/);
    const parsed = markdown.parseMarkdown(readFileSync(written[0], "utf8"));
    assert.deepEqual(parsed.frontmatter, { name: "Foo", description: "a thing", tags: ["x", "y"] });
    assert.equal(parsed.body, "# Foo\n");
  });
});
