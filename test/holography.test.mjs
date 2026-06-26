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
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  canonical, createMarkdown, markdownDataform, markdown,
  otlpFromWitnesses, witnessesFromOtlp, spanFromWitness, witnessFromSpan, otlpBulkCells,
} from "@emsenn/relating/writing";
import {
  appendWitnesses, projectStateView, projectContentDocuments, markdownContent,
  projectFeedContent, ensureStoreDirs, writeFileAtomic,
} from "@emsenn/relating/ledger";

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

describe("OTLP is an RWIL channel-code", () => {
  it("round-trips witnessed invocations as spans without losing E/A/V/T", () => {
    const rows = [
      {
        e: { transport: "test", actor: "caller" },
        a: { verb: "coincide", args: { left: "x", right: "x" } },
        v: { kind: "utterance.coincidence:witness" },
        t: "2026-06-26T00:00:00.000Z",
      },
      {
        e: { transport: "test", actor: "caller" },
        a: { verb: "coincide", args: { left: "x", right: "x" } },
        v: { kind: "utterance.coincidence:witness" },
        t: "2026-06-26T00:00:01.000Z",
      },
      {
        e: { transport: "test", actor: "caller" },
        a: { verb: "canonicalize", args: { input: { b: 2, a: 1 } } },
        v: { a: 1, b: 2 },
        t: "2026-06-26T00:00:02.000Z",
      },
    ];

    assert.deepEqual(rows.map((row) => witnessFromSpan(spanFromWitness(row))), rows);

    const traces = otlpFromWitnesses(rows);
    const decoded = witnessesFromOtlp(traces);
    assert.deepEqual(decoded, rows);
    assert.deepEqual(projectStateView(decoded, new Set()), projectStateView(rows, new Set()));
  });

  it("the OTLP bulk is the same time-forgotten statistic and cannot exceed the log", () => {
    const rows = [
      { e: "caller", a: { verb: "ask", args: { q: "same" } }, v: "ok", t: "2026-06-26T00:00:00.000Z" },
      { e: "caller", a: { verb: "ask", args: { q: "same" } }, v: "ok", t: "2026-06-26T00:00:01.000Z" },
      { e: "caller", a: { verb: "ask", args: { q: "other" } }, v: "ok", t: "2026-06-26T00:00:02.000Z" },
    ];
    const sourceBulk = [...new Set(rows.map((row) => canonical({ e: row.e, a: row.a, v: row.v })))].sort();
    const traces = otlpFromWitnesses(rows);

    assert.deepEqual(otlpBulkCells(traces), sourceBulk);
    assert.ok(otlpBulkCells(traces).length <= rows.length);
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

describe("the filesystem store boundary", () => {
  it("does not strand a temporary sibling when an atomic write cannot rename", () => {
    const root = tempRoot();
    const target = join(root, "state.json");
    mkdirSync(target);
    assert.throws(() => writeFileAtomic(target, "{}\n"));
    assert.deepEqual(readdirSync(root).sort(), ["state.json"]);
  });
});

describe("the content-tier reader: the inverse of writeContentDocument", async () => {
  const { mkdirSync, writeFileSync } = await import("node:fs");
  const { confine, readContentResource, listContentEntries, readContentTree } =
    await import("@emsenn/relating/ledger");

  const roots = [];
  const tree = () => {
    const root = mkdtempSync(join(tmpdir(), "rel-content-"));
    roots.push(root);
    mkdirSync(join(root, "mark", "utterance"), { recursive: true });
    mkdirSync(join(root, ".git"), { recursive: true });
    writeFileSync(join(root, "mark", "mark.md"), "# mark\n");
    writeFileSync(join(root, "mark", "utterance", "utterance.md"), "# utterance\n");
    writeFileSync(join(root, "mark", "notes.txt"), "ignored: not markdown");
    writeFileSync(join(root, ".git", "config.md"), "# should be ignored");
    return root;
  };
  after(() => { for (const r of roots) rmSync(r, { recursive: true, force: true }); });

  it("readContentTree walks the region, keeping only .md, eliding VCS/dep dirs, bounded", () => {
    const root = tree();
    const all = readContentTree(root, "");
    assert.deepEqual(all.map((r) => r.path).sort(), ["mark/mark.md", "mark/utterance/utterance.md"]);
    assert.equal(all.find((r) => r.path === "mark/mark.md").content, "# mark\n");
    assert.equal(readContentTree(root, "", { limit: 1 }).length, 1); // bound respected
    assert.deepEqual(readContentTree(root, "mark/utterance").map((r) => r.path), ["mark/utterance/utterance.md"]);
  });

  it("listContentEntries lists immediate entries sorted, eliding VCS/dep dirs", () => {
    const root = tree();
    assert.deepEqual(listContentEntries(root, ""), [{ name: "mark", kind: "directory" }]);
    assert.deepEqual(
      listContentEntries(root, "mark").map((e) => `${e.name}:${e.kind}`),
      ["mark.md:file", "notes.txt:file", "utterance:directory"],
    );
  });

  it("readContentResource reads one resource at a confined address; confine guards escapes", () => {
    const root = tree();
    const resource = readContentResource(root, "mark/mark.md");
    assert.deepEqual(resource, { path: "mark/mark.md", content: "# mark\n" });
    assert.throws(() => confine(root, "../escape"), /escapes the root/);
    assert.throws(() => readContentResource(root, "../../etc/passwd"), /escapes the root/);
  });
});
