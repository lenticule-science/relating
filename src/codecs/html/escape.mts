/**
 * codecs/html/escape — HTML-safe text/attribute escaping and charge marks for
 * the Semantic Hypertext Packet (SHP) codec.
 *
 * The charge vocabulary here is relationality's OWN bilattice value naming
 * (absurd | potential | active | stable). The former SHP-local `memeChargeOf`
 * (which re-derived the four values from a raw [positive, negative] pair) is
 * gone: value names come straight from `valueOf`/`chargeValueName` in
 * ../../algebra. The coordinate→name mapping is identical
 * (potential = truth-only, active = falsity-only, stable = both, absurd =
 * neither), so this is a faithful de-duplication, not a behavior change.
 */
import { valueOf, chargeValueName, type ChargeCarrier, type ChargeValueName } from "../../algebra/index.mjs";

export function escapeText(value: unknown): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function escapeAttr(value: unknown): string {
  return escapeText(value)
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function slug(value: unknown): string {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "cell";
}

export function unmark(value: unknown): unknown {
  return value !== null && typeof value === "object" && "const" in value
    ? (value as { const: unknown }).const
    : value;
}

/** The bilattice value-name of a charge — relationality's four-valued naming, no
 *  SHP-local re-derivation. */
export const chargeValueOf = (charge: ChargeCarrier): ChargeValueName =>
  chargeValueName(valueOf(charge));

/** A compact glyph for a charge: ⊤ both, ⊥ neither, t truth-only, f falsity-only. */
export function chargeMark(charge: ChargeCarrier): "t" | "f" | "⊥" | "⊤" {
  const value = chargeValueOf(charge);
  if (value === "stable") return "⊤";
  if (value === "absurd") return "⊥";
  return value === "potential" ? "t" : "f";
}

/** A contested (stable/both) charge projected to one side: supported→potential, negated→active. */
export function calmChargeOf(charge: ChargeCarrier, projection: "supported" | "negated" = "supported"): ChargeValueName {
  const value = chargeValueOf(charge);
  if (value !== "stable") return value;
  return projection === "negated" ? "active" : "potential";
}

/** A charge is contested when truth and falsity are both present (stable). */
export function isContested(charge: ChargeCarrier): boolean {
  return chargeValueOf(charge) === "stable";
}
