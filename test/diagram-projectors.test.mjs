/**
 * Contract: SVG, Mermaid, and UML are projectors of one presented-category
 * diagram carrier, with identity-rung reads on the node/edge tier.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  action,
  induceBins,
  mark,
  utterance,
  induceRelation,
  freeSettlementFiltration,
  readFiringsOfSettlementFiltration,
} from "@emsenn/relating";
import { routeRequest } from "@emsenn/relating/running";
import {
  diagramFromCarrierCategory,
  diagramToSvgDataform,
  mermaidProjector,
  plantUmlProjector,
  projectSvg,
  readMermaid,
  readXmi,
  settlementFiltrationStateMachineDiagram,
  svgProjector,
  umlProjector,
  witnessLedgerSequenceDiagram,
  writeMermaid,
  writeXmi,
} from "@emsenn/relating/writing";

const carrierCategory = Object.freeze({
  kind: "jsnode-ick.package-bin-web.carrier-category",
  title: "Example carrier category",
  packageName: "@example/pkg",
  objects: Object.freeze([
    Object.freeze({ id: "package:@example/pkg", kind: "package", label: "@example/pkg", detail: "package root", href: "/objects/package" }),
    Object.freeze({ id: "surface:Example", kind: "surface", label: "Example", detail: "operation surface", href: "/objects/surface" }),
    Object.freeze({ id: "strategy:canonicalize", kind: "strategy", label: "canonicalize", detail: "bin target", href: "/objects/strategy" }),
  ]),
  morphisms: Object.freeze([
    Object.freeze({ id: "morphism:0", from: "package:@example/pkg", to: "surface:Example", kind: "admits", label: "admits surface" }),
    Object.freeze({ id: "morphism:1", from: "surface:Example", to: "strategy:canonicalize", kind: "offers", label: "offers strategy" }),
  ]),
});

describe("the presented-category diagram carrier", () => {
  const diagram = diagramFromCarrierCategory(carrierCategory);

  it("renders a carrier-category identically through the SVG codec path", () => {
    assert.equal(
      svgProjector.write([diagram]),
      projectSvg(diagramToSvgDataform(diagram)),
    );
    assert.match(svgProjector.write([diagram]), /<svg[\s>]/);
    assert.match(svgProjector.write([diagram]), /data-e="package:@example\/pkg"/);
  });

  it("round-trips graph -> Mermaid -> graph at the object/morphism tier", () => {
    const text = writeMermaid(diagram);
    assert.equal(mermaidProjector.recognize({ path: "category.mmd", content: text }), true);
    const parsed = readMermaid(text);
    assert.deepEqual(parsed.objects, diagram.objects);
    assert.deepEqual(parsed.morphisms, diagram.morphisms);
  });

  it("round-trips a carrier-category through the UML XMI metamodel view", () => {
    const xmi = writeXmi(diagram);
    assert.equal(umlProjector.recognize({ path: "category.xmi", content: xmi }), true);
    const parsed = readXmi(xmi);
    assert.deepEqual(parsed.objects, diagram.objects);
    assert.deepEqual(parsed.morphisms, diagram.morphisms);
  });

  it("also emits a PlantUML class diagram over the same carrier", () => {
    const puml = plantUmlProjector.write([diagram]);
    assert.equal(plantUmlProjector.recognize({ path: "category.puml", content: puml }), true);
    assert.match(puml, /@startuml/);
    assert.match(puml, /class "@example\/pkg"/);
  });
});

describe("UML state machine as settlement-filtration reading", () => {
  it("uses stages as states and read-firings-of-settlement-filtration as transitions", () => {
    const filtration = freeSettlementFiltration(induceRelation(utterance(mark("socrates"), mark("is-a"))));
    const diagram = settlementFiltrationStateMachineDiagram(filtration);
    const firings = readFiringsOfSettlementFiltration(filtration);

    assert.equal(diagram.diagramKind, "state-machine");
    assert.equal(diagram.objects.length, filtration.stages.length);
    assert.equal(diagram.morphisms.length, firings.length);
    assert.ok(diagram.objects.every((object) => object.kind === "state"));
    assert.ok(diagram.morphisms.every((morphism) => morphism.kind === "firing"));
  });
});

describe("UML sequence diagram as witness-ledger reading", () => {
  it("uses EAVT rows as time-ordered messages over caller and morphism participants", () => {
    const diagram = witnessLedgerSequenceDiagram([
      { e: "agent:ada", a: "canonicalize {json}", v: { ok: true }, t: "2026-06-26T10:00:01Z" },
      { e: "agent:ada", a: "settle {site}", v: { stages: 2 }, t: "2026-06-26T10:00:02Z" },
    ]);
    const puml = plantUmlProjector.write([diagram]);

    assert.equal(diagram.diagramKind, "sequence");
    assert.equal(diagram.morphisms.length, 2);
    assert.ok(diagram.objects.some((object) => object.id === "entity:\"agent:ada\""));
    assert.match(puml, /participant "agent:ada"/);
    assert.match(puml, /-> .*canonicalize/);
  });
});

describe("diagram projection participates in existing HTTP negotiation", () => {
  it("a diagram-valued action negotiates to image/svg+xml with no serving changes", () => {
    const diagram = diagramFromCarrierCategory(carrierCategory);
    const act = action({
      verb: "diagram",
      inputFormat: "json",
      outputFormat: "xmi",
      codomain: undefined,
      run: () => diagram,
    });
    const induced = induceBins([act], { packageName: "diagram-pkg" });
    const response = routeRequest(induced, {
      method: "POST",
      path: "/diagram",
      query: {},
      body: "{}",
      accept: "image/svg+xml",
    });

    assert.equal(response.status, 200);
    assert.equal(response.type.split(";")[0], "image/svg+xml");
    assert.equal(response.body, svgProjector.write([diagram]));
  });
});
