import assert from "node:assert/strict";
import test from "node:test";
import { frontmatterConformance, markdownDataform, markdownProjector, parseMarkdown } from "./index.mjs";

test("markdown dataform projects YAML frontmatter arrays and body into EAVT assertions", () => {
  const text = [
    "---",
    "name: \"Hello World\"",
    "description: \"a first post\"",
    "slug: hello",
    "tags:",
    "  - intro",
    "  - demo",
    "draft: false",
    "---",
    "# Heading",
    "",
    "Prose.",
    "",
  ].join("\n");

  const dataform = markdownDataform(text, { witness: "post.md" });
  assert.equal(dataform.subject, "hello");
  assert.equal(dataform.format, "yaml");
  assert.equal(dataform.conformant, true);
  assert.deepEqual(dataform.verdict.charges.map((charge) => [charge.predicate, charge.modality, charge.value]), [
    ["has-frontmatter", "MUST", "potential"],
    ["yaml-frontmatter", "SHOULD", "potential"],
    ["toml-frontmatter", "MAY", "absurd"],
  ]);
  assert.deepEqual(dataform.assertions.filter((assertion) => assertion.a === "tags").map((assertion) => assertion.v), ["intro", "demo"]);
  assert.deepEqual(dataform.assertions.filter((assertion) => assertion.a === "draft").map((assertion) => assertion.v), [false]);
  assert.deepEqual(dataform.assertions.filter((assertion) => assertion.a === "body").map((assertion) => assertion.v), ["# Heading\n\nProse.\n"]);
  assert.equal(dataform.cells.length, dataform.assertions.length);
});

test("markdown dataform parses nested YAML and preserves TOML as unparsed frontmatter", () => {
  const yaml = [
    "---",
    "slug: nested-note",
    "metadata:",
    "  source: victor",
    "  rank: 2",
    "links:",
    "  - href: /a",
    "    label: A",
    "---",
    "Body",
    "",
  ].join("\n");
  const yamlDataform = markdownDataform(yaml, { witness: "nested.md" });
  assert.deepEqual(yamlDataform.frontmatter["metadata"], { source: "victor", rank: 2 });
  assert.deepEqual(yamlDataform.assertions.filter((assertion) => assertion.a === "metadata").map((assertion) => assertion.v), [
    "{\"rank\":2,\"source\":\"victor\"}",
  ]);
  assert.deepEqual(yamlDataform.assertions.filter((assertion) => assertion.a === "links").map((assertion) => assertion.v), [
    "{\"href\":\"/a\",\"label\":\"A\"}",
  ]);

  const tomlDataform = markdownDataform("+++\ntitle = \"Hello\"\n+++\nTOML body\n", { witness: "toml.md" });
  assert.equal(tomlDataform.format, "toml");
  assert.deepEqual(tomlDataform.frontmatter, {});
  assert.deepEqual(tomlDataform.assertions.map((assertion) => [assertion.a, assertion.v]), [["body", "TOML body\n"]]);
  assert.deepEqual(tomlDataform.verdict.notes, ["SHOULD yaml-frontmatter (depth 1)"]);
});

test("frontmatter conformance reads modal markdown charges", () => {
  const yaml = frontmatterConformance("---\nname: Hi\n---\nbody\n", { witness: "doc.md" });
  assert.equal(yaml.conformant, true);
  assert.equal(yaml.format, "yaml");
  assert.deepEqual(yaml.notes, []);

  const toml = frontmatterConformance("+++\ntitle = \"Hi\"\n+++\nbody\n", { witness: "doc.md" });
  assert.equal(toml.conformant, true);
  assert.equal(toml.format, "toml");
  assert.deepEqual(toml.charges.map((charge) => [charge.predicate, charge.value]), [
    ["has-frontmatter", "potential"],
    ["yaml-frontmatter", "active"],
    ["toml-frontmatter", "potential"],
  ]);

  const absent = frontmatterConformance("# body\n", { witness: "doc.md" });
  assert.equal(absent.conformant, false);
  assert.deepEqual(parseMarkdown("# body\n"), { frontmatter: null, format: null, body: "# body\n" });
});

test("markdown projector restricts text flatfiles by markdown filename", () => {
  assert.equal(markdownProjector.recognize({ path: "README.md", content: "# Hello\n" }), true);
  assert.equal(markdownProjector.recognize({ path: "notes.markdown", content: "# Hello\n" }), true);
  assert.equal(markdownProjector.recognize({ path: "notes.txt", content: "# Hello\n" }), false);
  assert.equal(markdownProjector.recognize({ path: "README.md", content: "bad\0text" }), false);
  assert.equal(markdownProjector.parent?.type, "text");
});
