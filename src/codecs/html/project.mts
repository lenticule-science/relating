/**
 * codecs/html/project — the projection (write) direction: a settled `ShpDataform`
 * → a finite HTML packet. Deterministic for a fixed dataform + morphism
 * registry; monotone (later cells append, the historical packet is not mutated
 * in place). `class` names a morphism identity (via the registry); `data-e/a/v`
 * carry the cell's entity/attribute/value coordinates; `data-positive/negative`
 * the bilattice sides; a contested or audited cell carries its `<details
 * class="why">` witness evidence.
 *
 * The charge reads route through relationality's algebra: a side is "present"
 * (not a boolean), and the value/mark/calm names come from ./escape, which is
 * relationality's own four-valued naming.
 */
import { escapeAttr, escapeText, unmark, chargeValueOf, chargeMark, calmChargeOf, isContested } from "./escape.mjs";
import type { ChargeCarrier } from "../../algebra/index.mjs";
import type { ChargedCell, ShpDataform } from "./normalize.mjs";
import { defaultMorphisms, type MorphismRegistry } from "./morphism.mjs";

const present = (charge: ChargeCarrier, side: 0 | 1): boolean => charge.value[side].name === "present";

/**
 * Projects a settled `ShpDataform` into a finite HTML semantic-hypertext
 * packet: validates the dataform and its subject, groups cells by entity into
 * `<section class="subject">` blocks, renders each cell as a charged `<span>`,
 * emits `<meta>` tags from metadata, and wraps everything in an `<article
 * class="semantic-hypertext-packet">` document. Deterministic for a fixed
 * dataform and morphism registry; returns the complete HTML string.
 */
export function project(dataform: ShpDataform, morphisms: MorphismRegistry = defaultMorphisms()): string {
  if (!dataform || typeof dataform !== "object") {
    throw new TypeError("project: dataform must be an object");
  }
  const subject = unmark(dataform.subject);
  if (subject === undefined || subject === null) {
    throw new TypeError("project: dataform.subject is required");
  }
  const cells = Array.isArray(dataform.cells) ? dataform.cells : [];
  const title = dataform.title ?? String(subject);
  const mode = dataform.mode === "audit" ? "audit" : "calm";
  const projection = dataform.projection === "negated" ? "negated" : "supported";

  const groups = new Map<unknown, ChargedCell[]>();
  for (const entry of cells) {
    if (!entry || !entry.cell) {
      throw new TypeError("project: each cell must be { cell: { subject, predicate, object? }, charge }");
    }
    const key = unmark(entry.cell.subject);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(entry);
  }

  const sections = [...groups.entries()]
    .map(([entity, entries]) =>
      `    <section class="subject" data-e="${escapeAttr(entity)}">\n` +
      entries.map((entry) => renderSpan(entry, mode, projection, morphisms)).join("\n") +
      `\n    </section>`)
    .join("\n");

  const metaTags = Object.entries(dataform.metadata ?? {})
    .map(([key, value]) => `    <meta name="${escapeAttr(key)}" content="${escapeAttr(value)}">`)
    .join("\n");

  const articleAttrs = [
    `class="semantic-hypertext-packet"`,
    `data-subject="${escapeAttr(subject)}"`,
    dataform.observer == null ? null : `data-observer="${escapeAttr(dataform.observer)}"`,
    `data-cells="${cells.length}"`,
    `data-mode="${escapeAttr(mode)}"`,
  ].filter(Boolean).join(" ");

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>${escapeText(title)}</title>${metaTags ? "\n" + metaTags : ""}
</head>
<body>
  <article ${articleAttrs}>
${sections}
  </article>
</body>
</html>
`;
}

/** The SHP projection. `shp` is the historical name for `project`. */
export const shp = project;
export default project;

function renderSpan(entry: ChargedCell, mode: "calm" | "audit", projection: "supported" | "negated", morphisms: MorphismRegistry): string {
  const { cell, charge } = entry;
  if (!charge || !Array.isArray(charge.value)) {
    throw new TypeError("project: each cell needs a charge carrier");
  }
  const subject = unmark(cell.subject);
  const predicate = unmark(cell.predicate);
  const object = unmark(cell.object);
  const hasObject = object !== undefined && object !== null && object !== "";
  const text = hasObject ? `${String(predicate)} ${String(object)}` : String(predicate);
  const value = chargeValueOf(charge);
  const calm = calmChargeOf(charge, projection);
  const mark = chargeMark(charge);
  const contested = isContested(charge);
  const attrs = [
    `class="${escapeAttr(morphisms.className(predicate))}"`,
    `data-e="${escapeAttr(subject)}"`,
    `data-a="${escapeAttr(predicate)}"`,
    hasObject ? `data-v="${escapeAttr(object)}"` : null,
    `data-positive="${present(charge, 0)}"`,
    `data-negative="${present(charge, 1)}"`,
    `data-value="${escapeAttr(value)}"`,
    `data-calm="${escapeAttr(calm)}"`,
    `data-mark="${escapeAttr(mark)}"`,
    contested ? `data-contested="true"` : null,
  ].filter(Boolean).join(" ");
  const why = contested || mode === "audit" ? renderWhy(charge, mark) : "";
  return `      <span ${attrs}>${escapeText(text)}${why}</span>`;
}

function renderWhy(charge: ChargeCarrier, mark: string): string {
  const evidence = Array.isArray(charge.evidence) ? charge.evidence : [[], []];
  const positive = (Array.isArray(evidence[0]) ? evidence[0] : []).map(unmark).filter((item) => item != null);
  const negative = (Array.isArray(evidence[1]) ? evidence[1] : []).map(unmark).filter((item) => item != null);
  const list = (witnesses: readonly unknown[]): string =>
    witnesses.length === 0 ? "<em>none recorded</em>" : witnesses.map((witness) => `<li>${escapeText(witness)}</li>`).join("");
  return `<details class="why" data-held="${escapeAttr(mark)}">` +
    `<summary>why ${escapeText(mark)}</summary>` +
    `<ul class="witnesses-positive" data-side="positive">${list(positive)}</ul>` +
    `<ul class="witnesses-negative" data-side="negative">${list(negative)}</ul>` +
    `</details>`;
}
