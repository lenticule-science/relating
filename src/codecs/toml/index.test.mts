import { test } from "node:test";
import assert from "node:assert/strict";
import { decodeToml, encodeToml } from "./index.mjs";

test("decodes scalars, tables, dotted keys, and arrays", () => {
  const doc = decodeToml(`
# a comment
model = "gpt-5-codex"
approval_policy = "on-request"
count = 3
ratio = 1.5
flags = [true, false]

[mcp_servers.agrodao]
url = "http://127.0.0.1:18806/hub/mcp"

[mcp_servers.local]
command = "npx"
args = ["-y", "some-server"]
`);
  assert.equal(doc["model"], "gpt-5-codex");
  assert.equal(doc["count"], 3);
  assert.equal(doc["ratio"], 1.5);
  assert.deepEqual(doc["flags"], [true, false]);
  const servers = doc["mcp_servers"] as Record<string, Record<string, unknown>>;
  assert.equal(servers["agrodao"]!["url"], "http://127.0.0.1:18806/hub/mcp");
  assert.equal(servers["local"]!["command"], "npx");
  assert.deepEqual(servers["local"]!["args"], ["-y", "some-server"]);
});

test("decodes inline tables and arrays of tables", () => {
  const doc = decodeToml(`
point = { x = 1, y = 2 }

[[bin]]
name = "a"

[[bin]]
name = "b"
`);
  assert.deepEqual(doc["point"], { x: 1, y: 2 });
  assert.deepEqual(doc["bin"], [{ name: "a" }, { name: "b" }]);
});

test("round-trips through encode then decode", () => {
  const original = {
    model: "gpt-5-codex",
    notify: ["notify-send", "codex"],
    mcp_servers: {
      agrodao: { url: "http://127.0.0.1:18806/hub/mcp" },
    },
  };
  const text = encodeToml(original);
  assert.deepEqual(decodeToml(text), original);
});

test("merges a new table without disturbing existing keys", () => {
  const before = decodeToml(`model = "gpt-5"\n\n[mcp_servers.local]\ncommand = "x"\n`);
  (before["mcp_servers"] as Record<string, unknown>)["agrodao"] = { url: "http://h" };
  const after = decodeToml(encodeToml(before));
  const servers = after["mcp_servers"] as Record<string, Record<string, unknown>>;
  assert.equal(servers["local"]!["command"], "x");
  assert.equal(servers["agrodao"]!["url"], "http://h");
  assert.equal(after["model"], "gpt-5");
});
