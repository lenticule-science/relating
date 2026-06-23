/**
 * Contract: the boundary — `action`, `induceBins`, `dispatch`, and the four
 * transports projected from the one apex (OpenAPI / MCP / HTTP / web). This is the
 * surface every faculty builds its own package on, so these promises matter most:
 * register an operation once, reach it from every transport, witness scripted plays.
 *
 * Self-cleaning: every test that writes a ledger uses a temp dir removed in `after`.
 */
import { describe, it, after } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import {
  action, isAction, induceBins, actions, parseJson, tm, evaluateRunTerm, carrierToTerm, termToCarrier,
  chargeValue, conflateValue, descent, utterance, mark, articulate, jsonResource, canonical,
  predicate, presentPredicationSite, freePredicationSite, posit, presentPositPresheaf,
  settle, freeSettlementFiltration, relateRelations, induceRelation,
  tokenIdentity, token,
} from "@emsenn/relating";
import {
  routeRequest, actionOpenApi, actionMcpHandle, tileManifold, wireCodec, WIRE_CODEC_NAMES, composes,
} from "@emsenn/relating/acting";

const tempRoots = [];
const tempRoot = () => { const r = mkdtempSync(path.join(tmpdir(), "rel-test-")); tempRoots.push(r); return r; };
after(() => { for (const r of tempRoots) rmSync(r, { recursive: true, force: true }); });

describe("action registration", () => {
  it("a well-formed action is recognized; an unknown wire codec is rejected at registration", () => {
    const a = action({ verb: "echo", inputFormat: "json", outputFormat: "json", run: (v) => v });
    assert.equal(isAction(a), true);
    assert.equal(a.verb, "echo");
    assert.throws(() => action({ verb: "x", inputFormat: "yaml", run: (v) => v }), /unknown wire codec/);
  });
  it("the wire codec vocabulary is closed and each codec round-trips its own format", () => {
    assert.ok(WIRE_CODEC_NAMES.includes("json") && WIRE_CODEC_NAMES.includes("string"));
    const json = wireCodec("json");
    assert.equal(json.encode(json.decode('{"b":2,"a":1}')).trim(), '{"a":1,"b":2}');
  });
});

describe("induceBins assembles one apex", () => {
  it("the discovery carrier has exactly one bin per action, including the named descent verbs", () => {
    const { discovery } = induceBins(actions, { basePath: "/relate" });
    assert.equal(discovery.bins.length, actions.length);
    const names = discovery.bins.map((b) => b.name);
    for (const verb of ["utter", "articulate", "predicate", "posit", "settle", "induce-relation"]) {
      assert.ok(names.includes(verb), `discovery missing ${verb}`);
    }
  });
});

describe("morphism composition is carrier $id equality", () => {
  it("accepts a real producer-consumer edge and rejects a mismatch", () => {
    const utter = actions.find((act) => act.verb === "utter");
    const articulate = actions.find((act) => act.verb === "articulate");
    const settle = actions.find((act) => act.verb === "settle");
    assert.equal(composes(utter, articulate), true);
    assert.equal(composes(utter, settle), false);
  });
});

describe("dispatch runs any verb and is total", () => {
  it("routes a verb, decodes by its codec, and returns code 0 with the encoded result", () => {
    const { dispatch } = induceBins(actions);
    const ok = dispatch(["canonicalize"], '{"b":2,"a":1}');
    assert.equal(ok.code, 0);
    assert.equal(ok.stdout.trim(), '{"a":1,"b":2}');
  });
  it("refuses an unknown verb at the boundary (code 2, not a throw)", () => {
    const { dispatch } = induceBins(actions);
    assert.equal(dispatch(["nope"], "").code, 2);
  });
});

describe("IR-term action runs", () => {
  it("admits carriers as structured terms and reduces FOUR primitives over them", () => {
    assert.deepEqual(carrierToTerm("stable"), tm.charge("stable"));
    assert.equal(evaluateRunTerm(tm.lam(tm.conflate(tm.var(0))), "stable"), "absurd");

    for (const value of [
      null,
      true,
      false,
      "opaque mark",
      "stable",
      3,
      ["potential", "opaque mark", false],
      { right: "active", left: ["stable", 1] },
    ]) {
      assert.deepEqual(termToCarrier(carrierToTerm(value)), value);
    }
  });

  it("canonicalize is carried as an IR term and reproduces its prior identity body byte-for-byte", () => {
    const canonicalize = actions.find((act) => act.verb === "canonicalize");
    assert.deepEqual(canonicalize.runTerm, tm.lam(tm.var(0)));
    assert.deepEqual(canonicalize.run({ b: 2, a: 1 }, {}), { a: 1, b: 2 });

    const { dispatch } = induceBins(actions);
    assert.equal(dispatch(["canonicalize"], '{"b":2,"a":1}').stdout.trim(), '{"a":1,"b":2}');
  });

  it("conflate-charge runs as an IR term through dispatch and matches its prior TS body byte-for-byte", () => {
    const conflateCharge = actions.find((act) => act.verb === "conflate-charge");
    assert.deepEqual(conflateCharge.runTerm, tm.lam(tm.conflate(tm.var(0))));

    const input = "stable";
    const priorTsOutput = conflateValue(chargeValue(input)).name;
    assert.equal(conflateCharge.run(input, {}), priorTsOutput);

    const { dispatch } = induceBins(actions);
    assert.equal(dispatch(["conflate-charge"], '"stable"').stdout.trim(), JSON.stringify(priorTsOutput));
  });

  it("the conflate-charge differential check bites when the run-term is wrong", () => {
    const input = "stable";
    const priorTsOutput = conflateValue(chargeValue(input)).name;
    const brokenRunTermOutput = evaluateRunTerm(tm.lam(tm.negate(tm.var(0))), input);
    assert.notDeepEqual(brokenRunTermOutput, priorTsOutput);
  });

  it("articulate is a faithful IR composition over the REAL utterance carrier (not toy data)", () => {
    const articulateAction = actions.find((act) => act.verb === "articulate");
    assert.deepEqual(articulateAction.runTerm, descent.articulate);

    // A genuine utterance carrier — a deep object, not a (token, claim) toy pair.
    const input = jsonResource(utterance(mark("subj"), mark("pred")), "utterance");
    const priorTsOutput = jsonResource(articulate(input), "articulation cell");
    const irOutput = evaluateRunTerm(descent.articulate, input);

    assert.deepEqual(irOutput, priorTsOutput);                    // value-faithful
    assert.equal(canonical(irOutput), canonical(priorTsOutput));  // byte-identical on the wire
    const { dispatch } = induceBins(actions);
    assert.equal(dispatch(["articulate"], JSON.stringify(input)).stdout.trim(), canonical(priorTsOutput));
  });

  it("the articulate differential check bites when the run-term is wrong", () => {
    const input = jsonResource(utterance(mark("subj"), mark("pred")), "utterance");
    const priorTsOutput = jsonResource(articulate(input), "articulation cell");
    const brokenRunTermOutput = evaluateRunTerm(tm.lam(tm.var(0)), input); // identity, not the cell
    assert.notDeepEqual(brokenRunTermOutput, priorTsOutput);
  });

  it("predicate is a faithful IR composition over the SLIMMED predication carrier", () => {
    const predicateAction = actions.find((act) => act.verb === "predicate");
    assert.deepEqual(predicateAction.runTerm, descent.predicate);

    const input = jsonResource(articulate(utterance(mark("socrates"), mark("is-a"))), "articulation cell");
    const priorTsOutput = jsonResource(presentPredicationSite(predicate(input)), "predication site");
    const irOutput = evaluateRunTerm(descent.predicate, input);

    assert.deepEqual(irOutput, priorTsOutput);                    // value-faithful (the right math)
    assert.equal(canonical(irOutput), canonical(priorTsOutput));  // byte-identical on the wire
    const { dispatch } = induceBins(actions);
    assert.equal(dispatch(["predicate"], JSON.stringify(input)).stdout.trim(), canonical(priorTsOutput));
  });

  it("the predicate differential check bites when the run-term is wrong", () => {
    const input = jsonResource(articulate(utterance(mark("a"), mark("b"))), "articulation cell");
    const priorTsOutput = jsonResource(presentPredicationSite(predicate(input)), "predication site");
    const brokenOutput = evaluateRunTerm(tm.lam(tm.var(0)), input); // identity, not the site
    assert.notDeepEqual(brokenOutput, priorTsOutput);
  });

  it("posit is a faithful IR re-tag over the slimmed presheaf carrier", () => {
    const positAction = actions.find((act) => act.verb === "posit");
    assert.deepEqual(positAction.runTerm, descent.posit);

    // Input is the predication-site generators (what the predicate action now emits).
    const input = jsonResource(presentPredicationSite(predicate(articulate(utterance(mark("s"), mark("p"))))), "predication site");
    const priorTsOutput = jsonResource(presentPositPresheaf(posit(freePredicationSite(input))), "posit presheaf");
    const irOutput = evaluateRunTerm(descent.posit, input);

    assert.deepEqual(irOutput, priorTsOutput);                    // value-faithful (the right math)
    assert.equal(canonical(irOutput), canonical(priorTsOutput));  // byte-identical on the wire
    const { dispatch } = induceBins(actions);
    assert.equal(dispatch(["posit"], JSON.stringify(input)).stdout.trim(), canonical(priorTsOutput));
  });

  it("the posit differential check bites when the run-term is wrong", () => {
    const input = jsonResource(presentPredicationSite(predicate(articulate(utterance(mark("a"), mark("b"))))), "predication site");
    const priorTsOutput = jsonResource(presentPositPresheaf(posit(freePredicationSite(input))), "posit presheaf");
    const brokenOutput = evaluateRunTerm(tm.lam(tm.var(0)), input); // keeps the site kind, not the presheaf
    assert.notDeepEqual(brokenOutput, priorTsOutput);
  });

  it("settle is a faithful IR re-tag; free re-derives the TERMINAL filtration", () => {
    const settleAction = actions.find((act) => act.verb === "settle");
    assert.deepEqual(settleAction.runTerm, descent.settle);

    // Input is the posit-presheaf generators (what the posit action emits).
    const u = utterance(mark("s"), mark("p"));
    const input = jsonResource({ ...presentPredicationSite(predicate(articulate(u))), kind: "predication.posit.presheaf" }, "posit presheaf");
    const irOutput = evaluateRunTerm(descent.settle, input);
    assert.equal(irOutput.kind, "predication.settlement.filtration");

    // The terminal carrier is free-only: free reconstructs the real settlement.
    assert.deepEqual(jsonResource(freeSettlementFiltration(irOutput)), jsonResource(settle(posit(predicate(articulate(u))))));
    // And the whole descent spine runs all-IR through dispatch.
    const { dispatch } = induceBins(actions);
    const a = dispatch(["articulate"], JSON.stringify(jsonResource(u))).stdout.trim();
    const p = dispatch(["predicate"], a).stdout.trim();
    const po = dispatch(["posit"], p).stdout.trim();
    assert.equal(dispatch(["settle"], po).stdout.trim(), canonical(irOutput));
  });

  it("coincide is a faithful IR judgment — structural equality branching to witness/obstruction", () => {
    const coincideAction = actions.find((act) => act.verb === "coincide");
    assert.deepEqual(coincideAction.runTerm, descent.coincide);

    const tsCoincide = (l, r) => jsonResource(tokenIdentity(token(mark(l)), token(mark(r))), "coincidence judgment");
    const { dispatch } = induceBins(actions);
    for (const [l, r, verdict] of [["foo", "foo", "witness"], ["foo", "bar", "obstruction"]]) {
      const ir = evaluateRunTerm(descent.coincide, { left: l, right: r });
      assert.deepEqual(ir, tsCoincide(l, r));                       // value-faithful (the right verdict)
      assert.ok(ir.kind.includes(verdict));
      assert.equal(dispatch(["coincide"], JSON.stringify({ left: l, right: r })).stdout.trim(), canonical(tsCoincide(l, r)));
    }
  });

  it("relate-relations is a faithful IR generator-union (append), an associative monoid", () => {
    const relateAction = actions.find((act) => act.verb === "relate-relations");
    assert.deepEqual(relateAction.runTerm, descent.relateRelations);

    const left = induceRelation(utterance(mark("socrates"), mark("is-a")));
    const right = induceRelation(utterance(mark("plato"), mark("teaches")));
    const input = jsonResource({ left, right });
    const priorTsOutput = jsonResource(relateRelations(left, right), "settlement filtration");
    const irOutput = evaluateRunTerm(descent.relateRelations, input);

    assert.deepEqual(irOutput, priorTsOutput);                    // value-faithful (the right math)
    assert.equal(canonical(irOutput), canonical(priorTsOutput));  // byte-identical on the wire
    assert.equal(irOutput.cells.length, left.cells.length + right.cells.length); // union, not opacify
    const { dispatch } = induceBins(actions);
    assert.equal(dispatch(["relate-relations"], JSON.stringify(input)).stdout.trim(), canonical(priorTsOutput));
  });
});

describe("dispatch witnesses a scripted play as one EAVT row; a direct run does not", () => {
  it("writes E=caller, A=verb+args, V=return, T=timestamp to the package's dated ledger", () => {
    const root = tempRoot();
    const { dispatch } = induceBins(actions, { packageName: "test-pkg" });
    dispatch(["coincide"], '{"left":"x","right":"x"}', {
      dataRoot: root, caller: { transport: "test" }, now: () => "2026-06-20T00:00:00.000Z",
    });
    const file = path.join(root, "log", "2026", "06", "20", "2026-06-20-test-pkg-log.jsonl");
    const rows = readFileSync(file, "utf8").trim().split("\n").map((l) => parseJson(l));
    assert.equal(rows.length, 1);
    assert.deepEqual(rows[0].e, { transport: "test" });
    assert.equal(rows[0].a.verb, "coincide");
    assert.equal(rows[0].t, "2026-06-20T00:00:00.000Z");
    assert.equal(rows[0].v.kind, "utterance.coincidence:witness");

    // a direct in-process run is not a scripted play and writes nothing new
    actions.find((act) => act.verb === "coincide").run({ left: "x", right: "x" }, {});
    assert.equal(readdirSync(path.join(root, "log", "2026", "06", "20")).length, 1);
  });
});

describe("the four transports are functorial images of the one apex", () => {
  const induced = induceBins(actions, { packageName: "test-pkg" });

  it("OpenAPI: one POST path per action, advertised as OpenAPI 3.1.1", () => {
    const openapi = actionOpenApi(induced);
    assert.equal(openapi.openapi, "3.1.1");
    assert.equal(Object.keys(openapi.paths).length, actions.length);
    assert.equal(openapi.components.schemas["relating/articulating/utterance"].$id, "relating/articulating/utterance");
  });

  it("MCP: tools/list has one tool per action; tools/call runs the morphism; initialize advertises the vault surface", () => {
    const list = actionMcpHandle(induced, { jsonrpc: "2.0", id: 1, method: "tools/list" }, {});
    assert.equal(list.result.tools.length, actions.length);
    const call = actionMcpHandle(induced, { jsonrpc: "2.0", id: 2, method: "tools/call", params: { name: "canonicalize", arguments: { input: { b: 2, a: 1 } } } }, {});
    assert.equal(call.result.content[0].text, '{"a":1,"b":2}');
    const init = actionMcpHandle(induced, { jsonrpc: "2.0", id: 3, method: "initialize" }, {});
    assert.deepEqual(Object.keys(init.result.capabilities).sort(), ["prompts", "resources", "tools"]);
    const resources = actionMcpHandle(induced, { jsonrpc: "2.0", id: 4, method: "resources/list" }, {});
    assert.ok(resources.result.resources.some((resource) => resource.uri === "relating/articulating/utterance.json"));
  });

  it("HTTP: POST /:verb runs the morphism; web UX serves an index and a per-verb form; unknown verb → 404", () => {
    const post = routeRequest(induced, { method: "POST", path: "/canonicalize", query: {}, body: '{"b":2,"a":1}' });
    assert.equal(post.status, 200);
    assert.equal(post.body.trim(), '{"a":1,"b":2}');
    assert.match(routeRequest(induced, { method: "GET", path: "/", query: {}, body: "" }).body, /<ol>/);
    assert.match(routeRequest(induced, { method: "GET", path: "/articulate", query: {}, body: "" }).body, /<form method="post"/);
    assert.equal(routeRequest(induced, { method: "POST", path: "/nope", query: {}, body: "" }).status, 404);
  });

  it("an HTTP POST is itself a witnessed scripted play (one EAVT row written through routeRequest)", () => {
    const root = tempRoot();
    routeRequest(induced, { method: "POST", path: "/coincide", query: {}, body: '{"left":"x","right":"x"}' },
      { dataRoot: root, caller: { transport: "http" }, now: () => "2026-06-20T00:00:00.000Z" });
    assert.equal(readdirSync(path.join(root, "log", "2026", "06", "20")).length, 1);
  });
});

describe("manifold tiling: a consumer mounts at the tail of its domain carrier's producer", () => {
  it("the URL path spells the data-flow composition", () => {
    const carrierId = "demo/widget";
    const make = action({ verb: "make", inputFormat: "string", outputFormat: "json", codomainSchema: { $ref: carrierId }, run: (x) => ({ made: String(x) }) });
    const use = action({ verb: "use", inputFormat: "json", outputFormat: "json", domainSchema: { $ref: carrierId }, run: (x) => x });
    const paths = tileManifold([
      { name: "maker", induced: induceBins([make], { packageName: "maker" }) },
      { name: "user", induced: induceBins([use], { packageName: "user" }) },
    ]);
    assert.equal(paths.get("maker"), "/maker");        // producer mounts at the root
    assert.equal(paths.get("user"), "/maker/user");    // consumer tiles under its producer
  });
});
