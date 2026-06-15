/**
 * codecs/html/markup — the markup (read) direction: an SHP HTML packet → the
 * charged cells it projects. The inverse of `project` for the carrier
 * coordinates: each <span> carries data-e/a/v and data-positive/negative, from
 * which the cell and its bilattice charge value are recovered exactly; witness
 * evidence is recovered from the <details class="why"> lists when present.
 *
 * Deterministic and total: spans without e/a carrier coordinates are skipped.
 */
import { charge, chargeValue, type ChargeValueName } from "../../algebra/index.mjs";
import type { ChargedCell } from "./normalize.mjs";

const attr = (tag: string, name: string): string | null => {
  const m = tag.match(new RegExp(`\\s${name}="([^"]*)"`, "i"));
  return m ? unescapeHtml(m[1] ?? "") : null;
};

const valueName = (positive: boolean, negative: boolean): ChargeValueName =>
  positive && negative ? "stable" : positive ? "potential" : negative ? "active" : "absurd";

export function markup(html: string): ChargedCell[] {
  const src = String(html);
  const cells: ChargedCell[] = [];
  const spanRe = /<span\b([^>]*)>([\s\S]*?)<\/span>/gi;
  let m: RegExpExecArray | null;
  while ((m = spanRe.exec(src)) !== null) {
    const tag = m[1] ?? "";
    const e = attr(tag, "data-e");
    const a = attr(tag, "data-a");
    if (e === null || a === null) continue; // not a carrier span
    const v = attr(tag, "data-v");
    const positive = attr(tag, "data-positive") === "true";
    const negative = attr(tag, "data-negative") === "true";
    const cell = v === null ? { subject: e, predicate: a } : { subject: e, predicate: a, object: v };
    const [pos, neg] = witnessesOf(m[0] ?? "");
    cells.push({ cell, charge: charge(chargeValue(valueName(positive, negative)), [pos, neg]) });
  }
  return cells;
}

function witnessesOf(spanHtml: string): [unknown[], unknown[]] {
  const side = (cls: string): unknown[] => {
    const block = spanHtml.match(new RegExp(`<ul class="${cls}"[^>]*>([\\s\\S]*?)</ul>`, "i"));
    if (!block) return [];
    return [...(block[1] ?? "").matchAll(/<li>([\s\S]*?)<\/li>/gi)].map((x) => unescapeHtml(x[1] ?? ""));
  };
  return [side("witnesses-positive"), side("witnesses-negative")];
}

function unescapeHtml(s: string): string {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}
