/**
 * Contract: web rendering is admitted only as a carrier/valuation/profile fiber
 * over a settled relational document.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  articulate,
  documentOfFixedPoint,
  fixedPoints,
  mark,
  posit,
  predicate,
  utterance,
} from "@emsenn/relating";
import { completeGraphWeights } from "@emsenn/relating/analysis";
import {
  css_classes_are_factor_maps,
  css_settles_to_valuation,
  htmlCarrierOf,
  profile_forms_render_fiber,
} from "@emsenn/relating/writing";

describe("settled document -> HTML carrier -> CSS valuation -> render profile", () => {
  it("keeps documenthood in the fixed point and admits HTML/CSS only by witnesses", () => {
    const fixed = fixedPoints(posit(predicate(articulate(utterance(mark("document"), mark("has-title"))))));
    const document = documentOfFixedPoint(fixed);

    assert.equal(document.kind, "settledDocument.fixedPoint");
    assert.equal(document.fixedPoint.kind, "predication.valuation.fixedPoint:witness");

    const nodes = document.addresses.map((address, index) => Object.freeze({
      kind: "rendering.htmlCarrier.node",
      nodeId: `n${index}`,
      element: "span",
      semanticAddress: address.key,
      valuationSite: address.key,
    }));
    const carrier = htmlCarrierOf(document, nodes);

    assert.equal(carrier.kind, "rendering.htmlCarrier");
    assert.equal(carrier.carrierNotDocument.kind, "settledDocument.html_is_carrier_not_document:witness");
    assert.equal(carrier.carrierNotDocument.distinct, true);

    const classFactorMap = Object.freeze({
      kind: "rendering.css.classFactorMap",
      constraintGraph: completeGraphWeights(nodes.length),
      nodeIds: nodes.map((node) => node.nodeId),
      classes: nodes.map((_node, index) => index),
      alphabet: nodes.map((_node, index) => `c${index}`),
    });
    const classWitness = css_classes_are_factor_maps(classFactorMap);
    assert.equal(classWitness.kind, "rendering.css_classes_are_factor_maps:witness");

    const system = Object.freeze({
      kind: "rendering.css.system",
      carrier,
      completionRegime: "ordinal.closure.regime.finite",
      declarations: Object.freeze([
        Object.freeze({
          kind: "rendering.css.declaration",
          nodeId: nodes[0].nodeId,
          property: "color",
          value: "red",
          sourceOrder: 0,
        }),
        Object.freeze({
          kind: "rendering.css.declaration",
          nodeId: nodes[0].nodeId,
          property: "color",
          value: "blue",
          sourceOrder: 1,
        }),
      ]),
      classFactorMap,
    });
    const settledCss = css_settles_to_valuation(system);

    assert.equal(settledCss.kind, "rendering.css_settles_to_valuation:witness");
    assert.equal(settledCss.valuation.sites[0].value, "blue");

    const profile = Object.freeze({
      kind: "rendering.profile",
      name: "article-html",
      allowedElements: Object.freeze(["span"]),
      allowedStyleBehavior: Object.freeze(["static"]),
      allowedCompletionRegimes: Object.freeze(["ordinal.closure.regime.finite"]),
      obligations: Object.freeze(["archive-stable"]),
      preservationLaws: Object.freeze([
        "preserve-addresses",
        "preserve-order",
        "preserve-references",
        "preserve-valuation-sites",
        "carrier-not-document",
        "css-settles",
      ]),
    });
    const fiber = profile_forms_render_fiber(profile, carrier, system, "static");

    assert.equal(fiber.kind, "rendering.profile_forms_render_fiber:witness");
    assert.equal(fiber.fiber.profile.name, "article-html");
    assert.equal(fiber.fiber.valuation.kind, "rendering.css.visualValuation");
  });
});
