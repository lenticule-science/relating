/**
 * actions — the package's registered operations, each a cocone leg.
 *
 * These are the relating morphisms presented at the boundary. `induceBins` over
 * this list assembles the discovery apex; the `relate` dispatcher runs any of
 * them. None of these files binds stdin or argv — the dispatcher owns that, once.
 *
 * The chain is THIN: each morphism has an actual domain and codomain, and emits a
 * proper categorical carrier consumable as the next morphism's domain —
 *
 *   utter      : Mark × Mark        → Utterance            (the only admission;
 *                                                            the lone injected datum is the Mark)
 *   articulate : Utterance          → ArticulationCell
 *   predicate  : ArticulationCell   → PredicationSite      (Φ = E × Π × E)
 *   posit      : PredicationSite    → PositPresheaf        (fibers of evidence)
 *   settle     : PositPresheaf      → SettlementFiltration (closure to the extrema)
 *
 * so `relate utter | relate articulate | relate predicate | relate posit | relate
 * settle` is the morphism chain as a POSIX pipe. `induce-relation` is the named
 * full descent (settle∘posit∘predicate∘articulate) from an admitted utterance.
 * Only `utter`/`induce-relation` admit a Mark (the `string`/`form`/`json` wires);
 * every interior morphism takes its predecessor's carrier on the `json` wire.
 */
import { Type } from "@sinclair/typebox";
import {
  articulate,
  articulationCellCarrier,
  mark,
  tokenIdentity,
  token,
  utterance,
  utteranceCarrier,
  type UtteranceCarrier,
  type ArticulationCell,
} from "./articulating/index.mjs";
import {
  predicate, presentPredicationSite, freePredicationSite,
  type PredicationSite, type PredicationSiteGenerators,
} from "./articulating/predicating/index.mjs";
import {
  posit, freePositPresheaf,
  type PositPresheaf, type PositPresheafGenerators,
} from "./articulating/predicating/positing/index.mjs";
import {
  settle,
  induceRelation,
  relateRelations,
  readIncrementsOfSettlementFiltration,
  readFiringsOfSettlementFiltration,
  readLimitStagesOfSettlementFiltration,
  readNonScottFiringsOfSettlementFiltration,
  readFirstCohomologyOfSettlementFiltration,
  readClosureInvariantOfSettlementFiltration,
  readGradedGapOfSettlementFiltration,
  readGradedGapFirstCohomologyRankIdentityOfSettlementFiltration,
  readClassificationOfSettlementFiltration,
  readDepthOfSettlementFiltration,
  readDepthFiniteStageJudgmentOfSettlementFiltration,
  readFiringEventsOfSettlementFiltration,
  readCausalOrderOfSettlementFiltration,
} from "./articulating/predicating/positing/settling/index.mjs";
import type { SettlementFiltration } from "./articulating/predicating/positing/settling/index.mjs";
import { jsonResource, type JsonRecord, type JsonValue } from "./codecs/json.mjs";
import { action, type Action } from "./acting/index.mjs";
import { tm, descent } from "./term/index.mjs";
import { carrier, generateDeclaration, schemaCarrier } from "./typing/index.mjs";

export const predicationSiteCarrier = carrier("relating/articulating/predicating/predication-site", {
  kind: Type.Literal("predication.site"),
}, { title: "PredicationSite", description: "The materialized predication site of an articulation cell.", additionalProperties: true });

export const positPresheafCarrier = carrier("relating/articulating/predicating/positing/presheaf", {
  kind: Type.Literal("predication.posit.presheaf"),
}, { title: "PositPresheaf", description: "The presheaf trace valued from a predication site.", additionalProperties: true });

export const settlementFiltrationCarrier = carrier("relating/articulating/predicating/positing/settling/filtration", {
  kind: Type.Literal("predication.settlement.filtration"),
}, { title: "SettlementFiltration", description: "A transfinite paraconsistent fixed-point settlement filtration.", additionalProperties: true });

export const chargeValueNameCarrier = schemaCarrier("relating/articulating/predicating/positing/charge-value-name", Type.Union([
  Type.Literal("absurd"),
  Type.Literal("potential"),
  Type.Literal("active"),
  Type.Literal("stable"),
], {
  $id: "relating/articulating/predicating/positing/charge-value-name",
  title: "ChargeValueName",
  description: "The four named values of Belnap's FOUR charge carrier.",
}) as ReturnType<typeof Type.Union> & { readonly $id: "relating/articulating/predicating/positing/charge-value-name" });

/** A settlement-filtration read action: a SettlementFiltration JSON in, the read's JSON out. */
function settlementRead(verb: string, summary: string, read: (carrier: SettlementFiltration) => unknown): Action {
  return action({
    verb,
    inputFormat: "json",
    outputFormat: "json",
    summary,
    description: "Domain: a SettlementFiltration as JSON. Codomain: the read's result as JSON.",
    domain: settlementFiltrationCarrier,
    run: (input: JsonValue): JsonValue => jsonResource(read(input as unknown as SettlementFiltration), verb),
  });
}

/** The settlement-filtration read bins, each a pure invariant of the settled object. */
export const settlementReadActions: readonly Action[] = Object.freeze([
  settlementRead("read-increments-of-settlement-filtration", "The per-stage cell increments of a settling.", readIncrementsOfSettlementFiltration),
  settlementRead("read-firings-of-settlement-filtration", "The increments that add cells.", readFiringsOfSettlementFiltration),
  settlementRead("read-limit-stages-of-settlement-filtration", "The limit-shaped stages of a settling.", readLimitStagesOfSettlementFiltration),
  settlementRead("read-non-scott-firings-of-settlement-filtration", "The cell-adding firings at limit stages.", readNonScottFiringsOfSettlementFiltration),
  settlementRead("read-first-cohomology-of-settlement-filtration", "The degree-1 cohomology of a settling.", readFirstCohomologyOfSettlementFiltration),
  settlementRead("read-closure-invariant-of-settlement-filtration", "The closure invariant (non-Scott additions).", readClosureInvariantOfSettlementFiltration),
  settlementRead("read-graded-gap-of-settlement-filtration", "The graded gap (cells lost at non-Scott firings).", readGradedGapOfSettlementFiltration),
  settlementRead("read-graded-gap-first-cohomology-rank-identity-of-settlement-filtration", "The graded-gap = H¹-rank identity.", readGradedGapFirstCohomologyRankIdentityOfSettlementFiltration),
  settlementRead("read-classification-of-settlement-filtration", "The regime, depth, and cofinality classification.", readClassificationOfSettlementFiltration),
  settlementRead("read-depth-of-settlement-filtration", "The settling depth (ordinal of the last firing).", readDepthOfSettlementFiltration),
  settlementRead("read-depth-finite-stage-judgment-of-settlement-filtration", "The finite-stage judgment on the depth.", readDepthFiniteStageJudgmentOfSettlementFiltration),
  settlementRead("read-firing-events-of-settlement-filtration", "Each designated cell paired with its first-firing stage.", readFiringEventsOfSettlementFiltration),
  settlementRead("read-causal-order-of-settlement-filtration", "The causal order over the settling's firing events.", readCausalOrderOfSettlementFiltration),
]);
/**
 * Admit the token/claim utterance from the input carrier, however it was wired.
 *
 * An Utterance is one object — a pair of opaque Marks (left=token, right=claim) —
 * with several legitimate boundary encodings, all decoded *into the input
 * carrier* (never the options channel, where token/claim are not parameters but
 * the domain itself):
 *   - the `string` wire: two Mark payloads split on the FIRST newline. Idiomatic
 *     Unix admission of two marks from one stream; the claim, being prose, is the
 *     half allowed to carry further newlines.
 *   - the `form`/`json` wire: a `{ token, claim }` object (so HTTP `?token=&claim=`
 *     and script composition build the same carrier).
 * The morphism is indifferent to which encoding arrived: one Utterance results.
 */
function admitUtterance(input: JsonValue, verb: string): UtteranceCarrier {
  if (typeof input === "string") {
    const newline = input.indexOf("\n");
    if (newline < 0) throw new TypeError(`${verb}: expected a token and claim separated by a newline`);
    return utterance(mark(input.slice(0, newline)), mark(input.slice(newline + 1)));
  }
  if (input !== null && typeof input === "object" && !Array.isArray(input)) {
    const record = input as JsonRecord;
    if ("token" in record && "claim" in record) return utterance(mark(record["token"]), mark(record["claim"]));
  }
  throw new TypeError(`${verb}: expected a "token\\nclaim" string or a { token, claim } object`);
}

/** utter — the admission boundary: get two Marks into the system as an utterance.
 *  The only morphism that injects data (a Mark); everything downstream is carrier
 *  → carrier. The pair arrives on the `string` (token\nclaim), `form`
 *  (?token=&claim=), or `json` ({token,claim}) wire. */
export const utterAction: Action = action({
  verb: "utter",
  inputFormat: "string",
  outputFormat: "json",
  summary: "Admit two Marks as an utterance (token and claim).",
  description: "Domain: a token Mark and a claim Mark, wired as `token\\nclaim` (string), `?token=&claim=` (form), or `{token,claim}` (JSON). Codomain: the UtteranceCarrier as JSON.",
  // Codomain carrier referenced by its schema $id (the carrier's identity). The
  // matching $ref on `articulate`'s domainSchema is the producer→consumer edge.
  codomain: utteranceCarrier,
  run: (input: JsonValue): JsonValue => jsonResource(admitUtterance(input, "utter"), "utterance"),
});

/** articulate — Utterance → ArticulationCell: open the articulation category at
 *  the potential cell of an already-admitted utterance carrier. */
export const articulateAction: Action = action({
  verb: "articulate",
  inputFormat: "json",
  outputFormat: "json",
  summary: "Open the articulation category at the potential cell of an utterance.",
  description: "Domain: an UtteranceCarrier as JSON (the codomain of `utter`). Codomain: the ArticulationCell as JSON.",
  // Domain carrier referenced by the same $id `utter` emits — this shared `$ref`
  // is the wiring-graph edge `utter → articulate` (roadmap Phase 2 §2).
  domain: utteranceCarrier,
  codomain: articulationCellCarrier,
  // Body: a faithful IR composition (opens the potential cell with empty slots).
  // Byte-identical to the prior TS run `jsonResource(articulate(input))`.
  runTerm: descent.articulate,
});

/** canonicalize — a JSON carrier to its canonical form: the identity endomorphism
 *  on the JSON wire, witnessing idempotence and representation-independence. */
export const canonicalizeAction: Action = action({
  verb: "canonicalize",
  inputFormat: "json",
  outputFormat: "json",
  summary: "Re-encode a JSON carrier in canonical form (identity on the JSON wire).",
  runTerm: tm.lam(tm.var(0)),
});

/** conflate-charge — apply the FOUR conflation primitive to a charge value. */
export const conflateChargeAction: Action = action({
  verb: "conflate-charge",
  inputFormat: "json",
  outputFormat: "json",
  summary: "Conflate one value of Belnap's FOUR charge carrier.",
  description: "Domain and codomain: the four charge values. Body: the CHL domain primitive `conflate`.",
  domain: chargeValueNameCarrier,
  codomain: chargeValueNameCarrier,
  runTerm: tm.lam(tm.conflate(tm.var(0))),
});

/** coincide — judge whether two Mark payloads coincide as tokens. Domain: a JSON
 *  object `{ left, right }`. Codomain: the coincidence judgment as JSON. */
export const coincideAction: Action = action({
  verb: "coincide",
  inputFormat: "json",
  outputFormat: "json",
  summary: "Judge whether two Mark payloads coincide as token carriers.",
  run: (input: JsonValue): JsonValue => {
    if (input === null || typeof input !== "object" || Array.isArray(input)) {
      throw new TypeError("coincide: expected a JSON object { left, right }");
    }
    const record = input as JsonRecord;
    if (!("left" in record) || !("right" in record)) throw new TypeError("coincide: requires left and right");
    return jsonResource(tokenIdentity(token(mark(record["left"])), token(mark(record["right"]))), "coincidence judgment");
  },
});

/** realize — the forgetful functor as a boundary morphism: a JSON Schema in,
 *  its TypeScript declaration out. `--name` sets the root type name. */
export const realizeAction: Action = action({
  verb: "realize",
  inputFormat: "json",
  outputFormat: "string",
  options: ["name"],
  summary: "Generate a TypeScript declaration from a JSON Schema (realize: Sub(J) → StructuralTypes).",
  description: "Domain: a JSON Schema document. Codomain: TypeScript declaration text; refinements are forgotten and remain the schema's runtime law.",
  run: (input: JsonValue, args: JsonRecord): JsonValue => {
    const name = typeof args["name"] === "string" ? args["name"] : "Root";
    return generateDeclaration(input, name);
  },
});

/** predicate — ArticulationCell → PredicationSite: materialize Φ = E × Π × E. */
export const predicateAction: Action = action({
  verb: "predicate",
  inputFormat: "json",
  outputFormat: "json",
  summary: "Materialize the predication site of an articulation cell (Φ = E × Π × E).",
  description: "Domain: an ArticulationCell as JSON (the codomain of `articulate`). Codomain: the PredicationSite as JSON.",
  domain: articulationCellCarrier,
  codomain: predicationSiteCarrier,
  // Body: a faithful IR composition building the predication-site GENERATORS (one
  // reflexive cell over the carrier's token/claim). Byte-identical to the prior TS
  // run jsonResource(presentPredicationSite(predicate(input))); the derived
  // entities/predicates/base are re-derived on read by freePredicationSite.
  runTerm: descent.predicate,
});

/** posit — PredicationSite → PositPresheaf: value the predication as fibers of
 *  evidence, the presheaf settlement closes over. */
export const positAction: Action = action({
  verb: "posit",
  inputFormat: "json",
  outputFormat: "json",
  summary: "Value a predication site as fibers of evidence (the posit presheaf).",
  description: "Domain: a PredicationSite as JSON (the codomain of `predicate`). Codomain: the PositPresheaf as JSON.",
  domain: predicationSiteCarrier,
  codomain: positPresheafCarrier,
  // Body: a faithful IR re-tag — the bare presheaf adds no essential data over the
  // predication generators (fiber/valuation/traces are a free construction), so it
  // carries the generators forward under the presheaf kind; the full presheaf is
  // re-derived on read by freePositPresheaf.
  runTerm: descent.posit,
});

/** settle — PositPresheaf → SettlementFiltration: close the presheaf to its
 *  extrema, the transfinite paraconsistent fixed-point filtration. */
export const settleAction: Action = action({
  verb: "settle",
  inputFormat: "json",
  outputFormat: "json",
  summary: "Close a posit presheaf to its settlement filtration (the extrema).",
  description: "Domain: a PositPresheaf as JSON (the codomain of `posit`). Codomain: the SettlementFiltration as JSON.",
  domain: positPresheafCarrier,
  codomain: settlementFiltrationCarrier,
  // Input is the posit-presheaf GENERATORS; materialize the free construction on read.
  run: (input: JsonValue): JsonValue =>
    jsonResource(settle(freePositPresheaf(input as unknown as PositPresheafGenerators)), "settlement filtration"),
});

/** induce-relation — the named full descent settle∘posit∘predicate∘articulate
 *  from an admitted utterance: a Mark pair to the settled relation in one play. */
export const induceRelationAction: Action = action({
  verb: "induce-relation",
  inputFormat: "string",
  outputFormat: "json",
  summary: "Induce the settlement filtration of an utterance (the full relation descent).",
  description: "Domain: an utterance (a token Mark and a claim Mark) wired as `token\\nclaim` (string), `?token=&claim=` (form), or `{token,claim}` (JSON). Codomain: the SettlementFiltration as JSON.",
  codomain: settlementFiltrationCarrier,
  run: (input: JsonValue): JsonValue =>
    jsonResource(induceRelation(admitUtterance(input, "induce-relation")), "settlement filtration"),
});

/** relate-relations — relate two settled relations: a JSON object `{ left, right }`
 *  of settlement filtrations, uttered against each other and re-induced. */
export const relateRelationsAction: Action = action({
  verb: "relate-relations",
  inputFormat: "json",
  outputFormat: "json",
  summary: "Relate two settlement filtrations by uttering them against each other.",
  description: "Domain: a JSON object { left, right } of two settlement filtrations. Codomain: the combined SettlementFiltration as JSON.",
  codomain: settlementFiltrationCarrier,
  run: (input: JsonValue): JsonValue => {
    if (input === null || typeof input !== "object" || Array.isArray(input)) {
      throw new TypeError("relate-relations: expected a JSON object { left, right }");
    }
    const record = input as JsonRecord;
    if (!("left" in record) || !("right" in record)) throw new TypeError("relate-relations: requires left and right");
    return jsonResource(relateRelations(record["left"] as unknown as SettlementFiltration, record["right"] as unknown as SettlementFiltration), "settlement filtration");
  },
});

/** The package's actions — the source `induceBins` reads. */
export const actions: readonly Action[] = Object.freeze([
  utterAction,
  articulateAction,
  predicateAction,
  positAction,
  settleAction,
  induceRelationAction,
  relateRelationsAction,
  coincideAction,
  canonicalizeAction,
  conflateChargeAction,
  ...settlementReadActions,
  realizeAction,
]);
