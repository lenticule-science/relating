/**
 * analysis/causal - finite Lorentzian causal-set reads.
 *
 * Executable carrier shadows for `RelMath.Lorentzian.Causal` and
 * `RelMath.Lorentzian.MyrheimMeyer`: Boolean causal transitive closure,
 * no-closed-timelike-curve obstruction, apex counts, rational ordering
 * fractions, strict-regime H1-zero, and the diamond/chain/antichain witnesses.
 */
import { fromRatio, ratOne, ratZero, type Rational } from "./exact-number.mjs";

export interface CausalLink {
  readonly from: string;
  readonly to: string;
}

export interface CausalSetCarrier {
  readonly kind: "lorentzian.causalSet";
  readonly events: readonly string[];
  readonly links: readonly CausalLink[];
}

export interface CausalSettlementWitness {
  readonly kind: "lorentzian.causalSettle:witness";
  readonly events: readonly string[];
  readonly directLinks: readonly CausalLink[];
  readonly closure: readonly CausalLink[];
  readonly apexCount: number;
  readonly orderedPairCount: number;
  readonly orderingFraction: Rational;
  readonly nscCount: 0;
  readonly eulerCharacteristic: number;
  readonly regime: "ordinal.closure.regime.finite";
  readonly h1Vanishes: true;
}

export interface CausalSettlementObstruction {
  readonly kind: "lorentzian.causalSettle-obstruction";
  readonly reason: "duplicate-event" | "unknown-event" | "closed-timelike-curve";
  readonly events: readonly string[];
  readonly directLinks: readonly CausalLink[];
  readonly closure: readonly CausalLink[];
  readonly offending?: CausalLink;
}

export type CausalSettlementJudgment = CausalSettlementWitness | CausalSettlementObstruction;

const linkKey = (link: CausalLink): string => `${link.from}\u0000${link.to}`;

const sortedLinks = (links: Iterable<CausalLink>): readonly CausalLink[] =>
  Object.freeze([...links].sort((left, right) => linkKey(left).localeCompare(linkKey(right))).map((link) => Object.freeze({ ...link })));

function duplicateEvent(events: readonly string[]): string | undefined {
  const seen = new Set<string>();
  for (const event of events) {
    if (seen.has(event)) return event;
    seen.add(event);
  }
  return undefined;
}

function directLinkSet(links: readonly CausalLink[]): Set<string> {
  return new Set(links.map(linkKey));
}

/** One Boolean causal closure step: `v(a,c) or exists b. v(a,b) and v(b,c)`. */
export function causalStep(events: readonly string[], links: readonly CausalLink[]): readonly CausalLink[] {
  const relation = directLinkSet(links);
  const next = new Map<string, CausalLink>();
  for (const link of links) next.set(linkKey(link), link);
  for (const from of events) {
    for (const middle of events) {
      if (!relation.has(linkKey({ from, to: middle }))) continue;
      for (const to of events) {
        if (!relation.has(linkKey({ from: middle, to }))) continue;
        const link = Object.freeze({ from, to });
        next.set(linkKey(link), link);
      }
    }
  }
  return sortedLinks(next.values());
}

/** The finite fixed point of repeated Boolean causal closure. */
export function causalClosure(events: readonly string[], links: readonly CausalLink[]): readonly CausalLink[] {
  let current = sortedLinks(links);
  for (;;) {
    const next = causalStep(events, current);
    if (next.length === current.length) return current;
    current = next;
  }
}

/** Count strictly-causally-ordered pairs, i.e. apex pairs off the diagonal. */
export function apexCount(events: readonly string[], links: readonly CausalLink[]): number {
  const relation = directLinkSet(links);
  let count = 0;
  for (const from of events) {
    for (const to of events) {
      if (from !== to && relation.has(linkKey({ from, to }))) count += 1;
    }
  }
  return count;
}

/** The ordered off-diagonal pair count `N * (N - 1)`. */
export function orderedPairCount(eventCount: number): number {
  if (!Number.isSafeInteger(eventCount) || eventCount < 0) throw new RangeError("orderedPairCount: expected a non-negative safe integer");
  return eventCount * Math.max(0, eventCount - 1);
}

/** The rational Myrheim-Meyer input `2|Apex| / (N(N-1))`. */
export function orderingFraction(events: readonly string[], links: readonly CausalLink[]): Rational {
  const denominator = orderedPairCount(events.length);
  if (denominator === 0) return ratZero;
  return fromRatio(2 * apexCount(events, links), denominator);
}

export function settleCausalSet(carrier: CausalSetCarrier): CausalSettlementJudgment {
  const duplicated = duplicateEvent(carrier.events);
  if (duplicated !== undefined) {
    return Object.freeze({
      kind: "lorentzian.causalSettle-obstruction" as const,
      reason: "duplicate-event" as const,
      events: Object.freeze([...carrier.events]),
      directLinks: sortedLinks(carrier.links),
      closure: Object.freeze([]),
      offending: Object.freeze({ from: duplicated, to: duplicated }),
    });
  }
  const eventSet = new Set(carrier.events);
  const unknown = carrier.links.find((link) => !eventSet.has(link.from) || !eventSet.has(link.to));
  if (unknown !== undefined) {
    return Object.freeze({
      kind: "lorentzian.causalSettle-obstruction" as const,
      reason: "unknown-event" as const,
      events: Object.freeze([...carrier.events]),
      directLinks: sortedLinks(carrier.links),
      closure: Object.freeze([]),
      offending: Object.freeze({ ...unknown }),
    });
  }
  const closure = causalClosure(carrier.events, carrier.links);
  const cycle = closure.find((link) => link.from === link.to);
  if (cycle !== undefined) {
    return Object.freeze({
      kind: "lorentzian.causalSettle-obstruction" as const,
      reason: "closed-timelike-curve" as const,
      events: Object.freeze([...carrier.events]),
      directLinks: sortedLinks(carrier.links),
      closure,
      offending: cycle,
    });
  }
  const apex = apexCount(carrier.events, closure);
  return Object.freeze({
    kind: "lorentzian.causalSettle:witness" as const,
    events: Object.freeze([...carrier.events]),
    directLinks: sortedLinks(carrier.links),
    closure,
    apexCount: apex,
    orderedPairCount: orderedPairCount(carrier.events.length),
    orderingFraction: orderingFraction(carrier.events, closure),
    nscCount: 0 as const,
    eulerCharacteristic: apex,
    regime: "ordinal.closure.regime.finite" as const,
    h1Vanishes: true as const,
  });
}

export const diamondCausalSet: CausalSetCarrier = Object.freeze({
  kind: "lorentzian.causalSet" as const,
  events: Object.freeze(["a", "b", "c", "d"]),
  links: Object.freeze([
    Object.freeze({ from: "a", to: "b" }),
    Object.freeze({ from: "a", to: "c" }),
    Object.freeze({ from: "a", to: "d" }),
    Object.freeze({ from: "b", to: "d" }),
    Object.freeze({ from: "c", to: "d" }),
  ]),
});

export const chainCausalSet: CausalSetCarrier = Object.freeze({
  kind: "lorentzian.causalSet" as const,
  events: Object.freeze(["a", "b", "c", "d"]),
  links: Object.freeze([
    Object.freeze({ from: "a", to: "b" }),
    Object.freeze({ from: "a", to: "c" }),
    Object.freeze({ from: "a", to: "d" }),
    Object.freeze({ from: "b", to: "c" }),
    Object.freeze({ from: "b", to: "d" }),
    Object.freeze({ from: "c", to: "d" }),
  ]),
});

export const antichainCausalSet: CausalSetCarrier = Object.freeze({
  kind: "lorentzian.causalSet" as const,
  events: Object.freeze(["a", "b", "c", "d"]),
  links: Object.freeze([]),
});

export const diamondPortrait = Object.freeze({
  kind: "lorentzian.myrheimMeyer.diamondPortrait" as const,
  settlement: settleCausalSet(diamondCausalSet) as CausalSettlementWitness,
});

export const chainPortrait = Object.freeze({
  kind: "lorentzian.myrheimMeyer.chainPortrait" as const,
  settlement: settleCausalSet(chainCausalSet) as CausalSettlementWitness,
});

export const antichainPortrait = Object.freeze({
  kind: "lorentzian.myrheimMeyer.antichainPortrait" as const,
  settlement: settleCausalSet(antichainCausalSet) as CausalSettlementWitness,
});

export const geometryIndependentOfTopology = Object.freeze({
  kind: "lorentzian.myrheimMeyer.geometryIndependentOfTopology:witness" as const,
  sharedClassifying: Object.freeze({
    regime: "ordinal.closure.regime.finite" as const,
    h1Vanishes: true as const,
    nscCount: 0 as const,
    classifyingInvariant: 0,
  }),
  diamondOrderingFraction: diamondPortrait.settlement.orderingFraction,
  chainOrderingFraction: ratOne,
  antichainOrderingFraction: ratZero,
});
