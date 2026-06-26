/**
 * writing — the representation boundaries of relating.
 *
 * Writers/codecs witness that a value can cross a representation (string, JSON, EAVT)
 * and reject what cannot inhabit it. They are transport witnesses, never the
 * category's ontology. Each is a holography `Projector`, so they share one
 * restriction lattice and one classifier.
 *
 * Every projector also carries two semantic gradings: its content-commitment
 * `Corner` ⟨addressability, assertivity⟩ — the carrier of the Belnap bilattice 4,
 * grouping the catalog as `bottom` (string/text), `data` (json, jsonl, xml, path),
 * and `assertion` (eavt, turtle, markdown, html, svg) — and its completion `Rung`.
 * Most codecs here read at the decidable `identity` rung; RMN is the explicit
 * `scott` exception, admitting closed well-typed term bodies rather than arbitrary
 * host execution. Non-monotone and Turing rungs are never incurred by package
 * reads, so `readIsDecidable` holds across the catalog by construction.
 * `transcode` converts between codecs only along the knowledge order ≤_k, and
 * `negotiateRepresentation` (under `http`) settles a value down a corner but never
 * fabricates a richer one.
 *
 * Import this surface when you need the package's representation products:
 * canonical JSON, EAVT/JSONL rows, schema and markdown projection, HTTP field
 * codecs, XML/SVG writers, radial SVG projection, stable path terms, and the
 * projector lattice operations that classify, grade, and restrict those boundaries.
 *
 * @packageDocumentation
 */
export {
  type JsonValue,
  type JsonRecord,
  isJsonValue,
  isJsonRecord,
  requireJsonValue,
  parse as parseJson,
  jsonResource,
  canonical,
  parseLines,
  serializeLines,
  jsonProjector,
  jsonlProjector,
} from "./json.mjs";

export {
  EAVT_JSONL,
  type EAVT,
  type EAVTRecord,
  type Datom,
  type Cell,
  type ChargedCell,
  type EAVTTriple,
  isEavtShape,
  eavtRecord,
  eavtId,
  eavtTriple,
  eavtToCell,
  cellToEavt,
  eavtOrder,
  parse as parseEavt,
  serialize as serializeEavt,
  serializeDatoms,
  eavtProjector,
} from "./eavt.mjs";

export {
  nonBlankLines,
  parseLines as parseJsonlLines,
  serializeLines as serializeJsonlLines,
} from "./json.mjs";

export {
  datom as datomRow,
  parse as parseDatoms,
} from "./datom.mjs";

// Projector-kernel functions the writing catalog re-exposes (a path is a
// holography Projector; classification/entailment/restriction act on it).
export { classify, entails, restrict, define } from "./projector.mjs";

// The two semantic gradings every representation carries: its Belnap content
// corner ⟨addressability, assertivity⟩ and its completion-closure rung, plus the
// knowledge order, the decidability invariant, and the admissible-transcode rule.
export {
  type Corner,
  type Rung,
  CORNER_BITS,
  DECIDABLE_RUNGS,
  leqK,
  isDecidable,
  cornerOf,
  rungOf,
  readIsDecidable,
  admitsTranscode,
  transcode,
} from "./projector.mjs";

export { stringProjector } from "./text.mjs";

export {
  toCount, fromCount, toInt, fromInt, ratFromInt, fromRatio, toNumber, fromInts,
  integerToDecimalString, ratToExactString, parseDecimal, fromDecimalString, toDecimalString,
} from "./exact-number.mjs";

export * as datom from "./datom.mjs";
export * as triple from "./triple.mjs";

export { decodeToml, encodeToml, type TomlValue, type TomlTable } from "./toml.mjs";
export { iriRef, turtleLiteral } from "./turtle.mjs";

export {
  toEavt, mergeEavtLogs, unfoldJson, foldJson,
} from "./eavt.mjs";

export * as schema from "./schema.mjs";
export {
  JSON_SCHEMA_DIALECT, schemaProjector, unfoldSchema, foldSchema,
  projectSchemaAssertions, resolveJsonPointer,
  type JsonSchema, type SchemaAssertion,
} from "./schema.mjs";

export * as markdown from "./markdown.mjs";
export {
  markdownProjector, markdownDataform, createMarkdown, markdownDocumentSchemaFragment,
  documentTypeDefinitions, documentTypeFragment, documentTypeAssertions, allDocumentTypeAssertions,
  type MarkdownDataform, type DocumentTypeDefinition, type CreateMarkdownOptions,
} from "./markdown.mjs";

export * as html from "./html.mjs";
export { escapeText, escapeAttr, slug, type HtmlValue } from "./html.mjs";

// RMN — the decidable executable codec. Closed, well-typed term bodies sit at
// the `scott` rung (not Turing JS); the HTML gate admits only RMN scripts that
// pass the package's term admission check.
export * as rmn from "./rmn.mjs";
export {
  RMN_JSON,
  rmnProjector,
  isRelationalTerm,
  parseRmn,
  settleRmn,
  extractRelationalScripts,
  htmlIsRelational,
  settleRelationalHtml,
  sessionIsRelational,
  settleRelationalSession,
} from "./rmn.mjs";

export * as http from "./http/index.mjs";

export * as xml from "./xml/index.mjs";
export { escapeXmlText, escapeXmlAttr, isXmlName, type XmlNode } from "./xml/index.mjs";

export * as svg from "./xml/svg/index.mjs";
export { projectSvg, svgProjector, type SvgDataform } from "./xml/svg/index.mjs";

export * as radial from "./xml/svg/radial/index.mjs";
export {
  projectRadial, radialProjector, radialFromValuation, radialFromClosureStages,
  segmentOfMeme, chargePalette,
  type RadialDataform, type RadialRing, type RadialSegment, type ChargePalette, type Orbit,
} from "./xml/svg/radial/index.mjs";

export * as path from "./path.mjs";
export {
  address, logPath, eavtLogPaths, termKey, segment, sanitizeSegment, desanitizeSegment,
  composeTerm, decomposeTerm, namespaceOf, withinNamespace, termOf, termOfNested, addressNested,
  dehydrateUtterances, rehydrateUtterances,
  normalizePath, pathParent, pathBasename, pathPoint, pathOfPoint, isPathname, validPath,
  pathProjector, type AddressTerm,
} from "./path.mjs";

export * as evidence from "./evidence.mjs";
export * as spectral from "./spectral.mjs";

export { quadraticToNumber } from "./quadratic.mjs";

// ── carrier objects + the schema → structural-type → TS-source representation pipeline ──
// The OBJECT half of the single-source category kernel (the morphism half lives in
// src/running/category). A carrier is a category object: one schema value yields its
// FromSchema type, JSON Schema with bare $id, and validator.
export {
  CarrierSchema,
  carrierFrom,
  registerCarrier,
  carrierById,
  carriers as registeredCarriers,
  carriersById,
  type Carrier,
  type CarrierCarrier,
  type CarrierId,
  type FromSchema,
  type DataCarrier,
} from "../typing/carrier.mjs";

export {
  type StructuralType,
  type StructuralField,
  unknownType,
  neverType,
  primitive,
  literal,
  array,
  tuple,
  ref,
  objectType,
  union,
  intersection,
} from "../typing/structural.mjs";

export { realize, realizeDefs } from "../typing/realize.mjs";
export { printType, generateDeclaration } from "./print.mjs";
export { schemaRegistry, schemaId, type SchemaRegistry } from "../typing/registry.mjs";
