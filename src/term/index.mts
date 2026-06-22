/**
 * term - JSON s-expression shadow of RelMath.CHL.Tm.
 *
 * This is the pure Curry-Howard-Lambek term layer proven in
 * `lean/RelMath/CurryHowardLambekQuartet.lean`: de-Bruijn STLC terms with
 * products and unit. It intentionally has no domain primitives.
 */
import { Type, type Static, type TSchema } from "@sinclair/typebox";
import { schemaCarrier } from "../typing/index.mjs";

export type Ty =
  | readonly ["base"]
  | readonly ["arrow", Ty, Ty]
  | readonly ["prod", Ty, Ty]
  | readonly ["unit"];

export type Tm =
  | readonly ["var", number]
  | readonly ["lam", Tm]
  | readonly ["app", Tm, Tm]
  | readonly ["pair", Tm, Tm]
  | readonly ["fst", Tm]
  | readonly ["snd", Tm]
  | readonly ["star"];

export const TySchema = Type.Unsafe<Ty>({
  $id: "relating/term/ty",
  title: "CHL Ty",
  description: "RelMath.CHL.Ty as a recursive JSON s-expression: base, arrow, prod, unit.",
  anyOf: [
    { type: "array", items: [{ const: "base" }], minItems: 1, maxItems: 1, additionalItems: false },
    { type: "array", items: [{ const: "arrow" }, { $ref: "#" }, { $ref: "#" }], minItems: 3, maxItems: 3, additionalItems: false },
    { type: "array", items: [{ const: "prod" }, { $ref: "#" }, { $ref: "#" }], minItems: 3, maxItems: 3, additionalItems: false },
    { type: "array", items: [{ const: "unit" }], minItems: 1, maxItems: 1, additionalItems: false },
  ],
}) as TSchema & { readonly $id: "relating/term/ty" };

export const TmSchema = Type.Unsafe<Tm>({
  $id: "relating/term/tm",
  title: "CHL Tm",
  description: "RelMath.CHL.Tm as a recursive de-Bruijn JSON s-expression.",
  anyOf: [
    { type: "array", items: [{ const: "var" }, { type: "integer", minimum: 0 }], minItems: 2, maxItems: 2, additionalItems: false },
    { type: "array", items: [{ const: "lam" }, { $ref: "#" }], minItems: 2, maxItems: 2, additionalItems: false },
    { type: "array", items: [{ const: "app" }, { $ref: "#" }, { $ref: "#" }], minItems: 3, maxItems: 3, additionalItems: false },
    { type: "array", items: [{ const: "pair" }, { $ref: "#" }, { $ref: "#" }], minItems: 3, maxItems: 3, additionalItems: false },
    { type: "array", items: [{ const: "fst" }, { $ref: "#" }], minItems: 2, maxItems: 2, additionalItems: false },
    { type: "array", items: [{ const: "snd" }, { $ref: "#" }], minItems: 2, maxItems: 2, additionalItems: false },
    { type: "array", items: [{ const: "star" }], minItems: 1, maxItems: 1, additionalItems: false },
  ],
}) as TSchema & { readonly $id: "relating/term/tm" };

export const tyCarrier = schemaCarrier("relating/term/ty", TySchema);
export const tmCarrier = schemaCarrier("relating/term/tm", TmSchema);

export type TyCarrier = Static<typeof tyCarrier.schema>;
export type TmCarrier = Static<typeof tmCarrier.schema>;

export const ty = {
  base: (): Ty => Object.freeze(["base"] as const),
  arrow: (domain: Ty, codomain: Ty): Ty => Object.freeze(["arrow", domain, codomain] as const),
  prod: (left: Ty, right: Ty): Ty => Object.freeze(["prod", left, right] as const),
  unit: (): Ty => Object.freeze(["unit"] as const),
} as const;

export const tm = {
  var: (index: number): Tm => {
    if (!Number.isInteger(index) || index < 0) throw new TypeError(`tm.var: de-Bruijn index must be a natural number: ${index}`);
    return Object.freeze(["var", index] as const);
  },
  lam: (body: Tm): Tm => Object.freeze(["lam", body] as const),
  app: (fn: Tm, arg: Tm): Tm => Object.freeze(["app", fn, arg] as const),
  pair: (left: Tm, right: Tm): Tm => Object.freeze(["pair", left, right] as const),
  fst: (value: Tm): Tm => Object.freeze(["fst", value] as const),
  snd: (value: Tm): Tm => Object.freeze(["snd", value] as const),
  star: (): Tm => Object.freeze(["star"] as const),
} as const;

export function rename(rho: (index: number) => number, term: Tm): Tm {
  switch (term[0]) {
    case "var":
      return tm.var(rho(term[1]));
    case "lam":
      return tm.lam(rename((index) => index === 0 ? 0 : rho(index - 1) + 1, term[1]));
    case "app":
      return tm.app(rename(rho, term[1]), rename(rho, term[2]));
    case "pair":
      return tm.pair(rename(rho, term[1]), rename(rho, term[2]));
    case "fst":
      return tm.fst(rename(rho, term[1]));
    case "snd":
      return tm.snd(rename(rho, term[1]));
    case "star":
      return tm.star();
  }
}

export function subst(sigma: (index: number) => Tm, term: Tm): Tm {
  switch (term[0]) {
    case "var":
      return sigma(term[1]);
    case "lam":
      return tm.lam(subst((index) => index === 0 ? tm.var(0) : rename((n) => n + 1, sigma(index - 1)), term[1]));
    case "app":
      return tm.app(subst(sigma, term[1]), subst(sigma, term[2]));
    case "pair":
      return tm.pair(subst(sigma, term[1]), subst(sigma, term[2]));
    case "fst":
      return tm.fst(subst(sigma, term[1]));
    case "snd":
      return tm.snd(subst(sigma, term[1]));
    case "star":
      return tm.star();
  }
}

export function inst(body: Tm, value: Tm): Tm {
  return subst((index) => index === 0 ? value : tm.var(index - 1), body);
}

function dedupe(terms: readonly Tm[]): readonly Tm[] {
  const seen = new Set<string>();
  const out: Tm[] = [];
  for (const term of terms) {
    const key = JSON.stringify(term);
    if (!seen.has(key)) {
      seen.add(key);
      out.push(term);
    }
  }
  return Object.freeze(out);
}

/** All one-step reducts admitted by RelMath.CHL.step. */
export function step(term: Tm): readonly Tm[] {
  switch (term[0]) {
    case "var":
    case "star":
      return Object.freeze([]);
    case "lam":
      return dedupe(step(term[1]).map((body) => tm.lam(body)));
    case "app": {
      const top = term[1][0] === "lam" ? [inst(term[1][1], term[2])] : [];
      return dedupe([
        ...top,
        ...step(term[1]).map((fn) => tm.app(fn, term[2])),
        ...step(term[2]).map((arg) => tm.app(term[1], arg)),
      ]);
    }
    case "pair":
      return dedupe([
        ...step(term[1]).map((left) => tm.pair(left, term[2])),
        ...step(term[2]).map((right) => tm.pair(term[1], right)),
      ]);
    case "fst": {
      const top = term[1][0] === "pair" ? [term[1][1]] : [];
      return dedupe([...top, ...step(term[1]).map((value) => tm.fst(value))]);
    }
    case "snd": {
      const top = term[1][0] === "pair" ? [term[1][2]] : [];
      return dedupe([...top, ...step(term[1]).map((value) => tm.snd(value))]);
    }
  }
}

/** Takahashi complete development, matching RelMath.CHL.dev. */
export function dev(term: Tm): Tm {
  switch (term[0]) {
    case "var":
      return tm.var(term[1]);
    case "star":
      return tm.star();
    case "lam":
      return tm.lam(dev(term[1]));
    case "app":
      return term[1][0] === "lam"
        ? inst(dev(term[1][1]), dev(term[2]))
        : tm.app(dev(term[1]), dev(term[2]));
    case "pair":
      return tm.pair(dev(term[1]), dev(term[2]));
    case "fst":
      return term[1][0] === "pair" ? dev(term[1][1]) : tm.fst(dev(term[1]));
    case "snd":
      return term[1][0] === "pair" ? dev(term[1][2]) : tm.snd(dev(term[1]));
  }
}

export function evaluate(term: Tm): Tm {
  let current = term;
  for (let fuel = 0; fuel < 10_000; fuel += 1) {
    const next = dev(current);
    if (JSON.stringify(next) === JSON.stringify(current)) return next;
    current = next;
  }
  throw new Error("eval: development did not reach a fixed point within 10000 iterations");
}

export { evaluate as eval };
