/**
 * @packageDocumentation
 *
 * The package's registered operations, each a cocone leg.
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
 *
 * The list also carries the package's introspection surface. `morphismCarrier`
 * serializes an action declaration without its executable closure; the `inspect`
 * action reads that morphism carrier and reports whether its RMN body is present,
 * closed, how large it is, and which term constructors it uses. That is deliberately
 * a boundary read today: it inspects host-level metadata about the term object
 * rather than claiming to be a pure carrier morphism in RMN.
 *
 * @example
 * ```js
 * import { actions, induceBins, morphismCarrier } from "@emsenn/relating";
 *
 * const apex = induceBins(actions, { packageName: "@emsenn/relating" });
 * const conflate = actions.find((action) => action.verb === "conflate-charge");
 * const report = apex.dispatch(["inspect"], JSON.stringify(morphismCarrier(conflate)));
 * JSON.parse(report.stdout).termUses; // ["conflate", "lam", "var"]
 * ```
 */
import { Type } from "@sinclair/typebox";
import {
  articulate,
  mark,
  tokenIdentity,
  token,
  utterance,
  type UtteranceCarrier,
  type ArticulationCell,
} from "../lib/articulating/index.mjs";
import { utteranceCarrier, articulationCellCarrier } from "./carriers.mjs";
import {
  predicate, presentPredicationSite, freePredicationSite,
  type PredicationSite, type PredicationSiteGenerators,
} from "../lib/articulating/predicating/index.mjs";
import {
  posit, freePositPresheaf,
  type PositPresheaf, type PositPresheafGenerators,
} from "../lib/articulating/predicating/positing/index.mjs";
import {
  settle,
  freeSettlementFiltration,
  induceRelation,
  relateRelations,
  readIncrementsOfSettlementFiltration,
  readFiringsOfSettlementFiltration,
  readFiringEventsOfSettlementFiltration,
  readCausalOrderOfSettlementFiltration,
} from "../lib/articulating/predicating/positing/settling/index.mjs";
import type { SettlementFiltration, SettlementFiltrationGenerators } from "../lib/articulating/predicating/positing/settling/index.mjs";
import { jsonResource, type JsonRecord, type JsonValue } from "./writing/json.mjs";
import { action, type Action } from "./running/index.mjs";
import { tm, type Tm } from "../lib/notating/index.mjs";
import { evaluateRunTerm, isClosed, termSize, termUses } from "./evaluating/index.mjs";
import {
  articulateTerm as _articulate,
  predicateTerm as _predicate,
  positTerm as _posit,
  settleTerm as _settle,
  induceRelationTerm as _induceRelation,
  relateRelationsTerm as _relateRelations,
  coincideTerm as _coincide,
} from "./evaluating/descending/index.mjs";
import {
  readClassification,
  readDepth,
  readDepthFiniteStageJudgment,
  readLimitStages,
  readNonScottFirings,
  readFirstCohomology,
  readGradedGap,
  readGradedGapFirstCohomologyRankIdentity,
  readClosureInvariant,
} from "./evaluating/reading/index.mjs";

const descent = {
  articulate: _articulate,
  predicate: _predicate,
  posit: _posit,
  settle: _settle,
  induceRelation: _induceRelation,
  relateRelations: _relateRelations,
  coincide: _coincide,
} as const;

const measurementReaders = {
  readClassification,
  readDepth,
  readDepthFiniteStageJudgment,
  readLimitStages,
  readNonScottFirings,
  readFirstCohomology,
  readGradedGap,
  readGradedGapFirstCohomologyRankIdentity,
  readClosureInvariant,
} as const;
import { carrier, generateDeclaration, schemaCarrier, type MorphismCarrier } from "./typing/index.mjs";

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
    // Input is the filtration GENERATORS; free the settlement before reading.
    run: (input: unknown): unknown => jsonResource(read(freeSettlementFiltration(input as unknown as SettlementFiltrationGenerators)), verb),
  });
}

/** A settling-read codomain carrier, identified by the read invariant's kind. */
const settlingReadCarrier = (id: string, kind: ReturnType<typeof Type.Literal> | ReturnType<typeof Type.Union>, title: string) =>
  carrier(id, { kind }, { title, description: `The ${title} read of a settlement filtration.`, additionalProperties: true });

export const settlingClassificationCarrier = settlingReadCarrier("relating/articulating/predicating/positing/settling/classification", Type.Literal("predication.settling.classification"), "SettlingClassification");
export const settlingStageOrdinalCarrier = settlingReadCarrier("relating/articulating/predicating/positing/settling/stage-ordinal", Type.Literal("predication.settling.stageOrdinal"), "SettlingStageOrdinal");
export const settlingFiniteStageJudgmentCarrier = settlingReadCarrier("relating/articulating/predicating/positing/settling/finite-stage-judgment", Type.Union([Type.Literal("predication.settling.finiteStage:witness"), Type.Literal("predication.settling.finiteStage-obstruction")]), "SettlingFiniteStageJudgment");
export const settlingLimitStagesCarrier = settlingReadCarrier("relating/articulating/predicating/positing/settling/limit-stages", Type.Literal("predication.settling.limitStages"), "SettlingLimitStages");
export const settlingNonScottFiringsCarrier = settlingReadCarrier("relating/articulating/predicating/positing/settling/non-scott-firings", Type.Literal("predication.settling.nonScottFirings"), "NonScottSettlingFirings");
export const settlingFirstCohomologyCarrier = settlingReadCarrier("relating/articulating/predicating/positing/settling/first-cohomology", Type.Literal("predication.settling.firstCohomology"), "SettlingFirstCohomology");
export const settlingGradedGapCarrier = settlingReadCarrier("relating/articulating/predicating/positing/settling/graded-gap", Type.Literal("predication.settling.gradedGap"), "GradedGap");
export const settlingRankIdentityCarrier = settlingReadCarrier("relating/articulating/predicating/positing/settling/rank-identity", Type.Union([Type.Literal("predication.cohomology.rankIdentity:witness"), Type.Literal("predication.cohomology.rankIdentity-obstruction")]), "RankIdentityJudgment");
export const settlingClosureInvariantCarrier = settlingReadCarrier("relating/articulating/predicating/positing/settling/closure-invariant", Type.Literal("predication.settling.closureInvariant"), "SettlingClosureInvariant");

/** A measurement read action: a true morphism (SettlementFiltration → invariant carrier)
 *  whose body is the IR reader term `read ∘ free`. The arrow/boundary gate requires these
 *  to be IR; the runTerm satisfies it. */
function measurementRead(verb: string, summary: string, codomain: ReturnType<typeof carrier>, runTerm: typeof descent.articulate): Action {
  return action({
    verb,
    inputFormat: "json",
    outputFormat: "json",
    summary,
    description: "Domain: a SettlementFiltration (its generators) as JSON. Codomain: the read invariant as JSON.",
    domain: settlementFiltrationCarrier,
    codomain,
    runTerm,
  });
}

/** The settlement-filtration read bins, each a pure invariant of the settled object. The
 *  nine measurement reads are true morphisms carried as IR terms (`read ∘ free`); the four
 *  structural reads (increments, firings, firing-events, causal order) remain boundary
 *  projections pending their own codomain carriers + IR terms. */
export const settlementReadActions: readonly Action[] = Object.freeze([
  settlementRead("read-increments-of-settlement-filtration", "The per-stage cell increments of a settling.", readIncrementsOfSettlementFiltration),
  settlementRead("read-firings-of-settlement-filtration", "The increments that add cells.", readFiringsOfSettlementFiltration),
  measurementRead("read-limit-stages-of-settlement-filtration", "The limit-shaped stages of a settling.", settlingLimitStagesCarrier, measurementReaders.readLimitStages),
  measurementRead("read-non-scott-firings-of-settlement-filtration", "The cell-adding firings at limit stages.", settlingNonScottFiringsCarrier, measurementReaders.readNonScottFirings),
  measurementRead("read-first-cohomology-of-settlement-filtration", "The degree-1 cohomology of a settling.", settlingFirstCohomologyCarrier, measurementReaders.readFirstCohomology),
  measurementRead("read-closure-invariant-of-settlement-filtration", "The closure invariant (non-Scott additions).", settlingClosureInvariantCarrier, measurementReaders.readClosureInvariant),
  measurementRead("read-graded-gap-of-settlement-filtration", "The graded gap (cells lost at non-Scott firings).", settlingGradedGapCarrier, measurementReaders.readGradedGap),
  measurementRead("read-graded-gap-first-cohomology-rank-identity-of-settlement-filtration", "The graded-gap = H¹-rank identity.", settlingRankIdentityCarrier, measurementReaders.readGradedGapFirstCohomologyRankIdentity),
  measurementRead("read-classification-of-settlement-filtration", "The regime, depth, and cofinality classification.", settlingClassificationCarrier, measurementReaders.readClassification),
  measurementRead("read-depth-of-settlement-filtration", "The settling depth (ordinal of the last firing).", settlingStageOrdinalCarrier, measurementReaders.readDepth),
  measurementRead("read-depth-finite-stage-judgment-of-settlement-filtration", "The finite-stage judgment on the depth.", settlingFiniteStageJudgmentCarrier, measurementReaders.readDepthFiniteStageJudgment),
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
  run: (input: unknown): unknown => jsonResource(admitUtterance(input as JsonValue, "utter"), "utterance"),
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
  // Body: a faithful IR term — build a token for each payload, compare them by
  // structural coincidence, and branch to a witness/obstruction judgment.
  // Byte-identical to tokenIdentity(token(mark(left)), token(mark(right))).
  runTerm: descent.coincide,
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
  run: (input: unknown, args: Record<string, unknown>): unknown => {
    const name = typeof args["name"] === "string" ? args["name"] : "Root";
    return generateDeclaration(input as JsonValue, name);
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
  // Body: a faithful IR re-tag — the settlement is the terminal free construction
  // over the predication generators, so it carries them forward under the
  // filtration kind; the read-* actions free it on read.
  runTerm: descent.settle,
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
  // The whole descent as ONE IR composite (settle ∘ posit ∘ predicate ∘ articulate)
  // over the admitted utterance; emits the same slim filtration as the piped
  // articulate|predicate|posit|settle chain.
  run: (input: unknown): unknown =>
    evaluateRunTerm(descent.induceRelation, jsonResource(admitUtterance(input as JsonValue, "induce-relation"))),
});

/** relate-relations — relate two settled relations: a JSON object `{ left, right }`
 *  of settlement filtrations, uttered against each other and re-induced. */
export const relateRelationsAction: Action = action({
  verb: "relate-relations",
  inputFormat: "json",
  outputFormat: "json",
  summary: "Relate two relations by the union of their generators.",
  description: "Domain: a JSON object { left, right } of two settlement filtrations (their generators). Codomain: the combined SettlementFiltration generators as JSON.",
  codomain: settlementFiltrationCarrier,
  // Body: a faithful IR term — the union (append) of the two relations' cell and
  // specialization generators (an associative monoid), matching relateRelations.
  runTerm: descent.relateRelations,
});

export const inspectionReportCarrier = carrier("relating.action.inspection", {
  kind: Type.Literal("relating.action.inspection"),
  verb: Type.String({ minLength: 1 }),
  hasRunTerm: Type.Boolean(),
  domain: Type.Optional(Type.String()),
  codomain: Type.Optional(Type.String()),
  termClosed: Type.Optional(Type.Boolean()),
  termSize: Type.Optional(Type.Number()),
  termUses: Type.Optional(Type.Array(Type.String())),
}, { title: "ActionInspection", description: "RMN inspection report for a morphism carrier." });

/** inspect — boundary introspection over a morphism carrier.
 *
 *  Input: the JSON produced by `morphismCarrier(action)`. Output: an inspection
 *  report. This deliberately remains an untyped boundary action until RMN grows
 *  structural metadata primitives for `isClosed`, `termSize`, and `termUses`.
 */
export const inspectAction: Action = action({
  verb: "inspect",
  inputFormat: "json",
  outputFormat: "json",
  summary: "Inspect a morphism carrier: report its domain, codomain, and RMN body structure.",
  description: "Boundary introspection: input is a MorphismCarrier JSON (the output of morphismCarrier()). Output is an ActionInspection report. This is not yet an IR morphism because term metadata reads are host-level.",
  run: (input: unknown): unknown => {
    const mc = input as MorphismCarrier;
    const report: Record<string, JsonValue> = {
      kind: "relating.action.inspection",
      verb: mc.verb,
      hasRunTerm: mc.runTerm !== undefined,
    };
    if (mc.domain !== undefined) report["domain"] = mc.domain;
    if (mc.codomain !== undefined) report["codomain"] = mc.codomain;
    if (mc.runTerm !== undefined) {
      try {
        const t = mc.runTerm as Tm;
        report["termClosed"] = isClosed(t);
        report["termSize"] = termSize(t);
        report["termUses"] = [...termUses(t)] as JsonValue;
      } catch {
        // runTerm present but structurally malformed — report hasRunTerm only
      }
    }
    return report;
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
  inspectAction,
]);
