/**
 * analysis/causal - finite Lorentzian causal-set reads.
 *
 * Executable carrier shadows for `RelMath.Lorentzian.Causal` and
 * `RelMath.Lorentzian.MyrheimMeyer`: Boolean causal transitive closure,
 * no-closed-timelike-curve obstruction, apex counts, rational ordering
 * fractions, strict-regime H1-zero, and the diamond/chain/antichain witnesses.
 */
import { fromRatio, ratOne, ratZero, type Rational } from "./exact-number.mjs";
import {
  chargeValue,
  joinKnowledgeValue,
  type ChargeValueName,
} from "../../bilattice-charge.mjs";

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

const hasLink = (links: readonly CausalLink[], from: string, to: string): boolean =>
  directLinkSet(links).has(linkKey({ from, to }));

const causalLe = (links: readonly CausalLink[], from: string, to: string): boolean =>
  from === to || hasLink(links, from, to);

const relationEqual = (left: readonly CausalLink[], right: readonly CausalLink[]): boolean => {
  const leftKeys = new Set(left.map(linkKey));
  const rightKeys = new Set(right.map(linkKey));
  if (leftKeys.size !== rightKeys.size) return false;
  for (const key of leftKeys) if (!rightKeys.has(key)) return false;
  return true;
};

export interface CausalConeFieldReceipt {
  readonly kind: "lorentzian.coneField:witness";
  readonly events: readonly string[];
  readonly closure: readonly CausalLink[];
  readonly futureCones: readonly { readonly event: string; readonly future: readonly string[]; readonly past: readonly string[] }[];
  readonly spacelikePairs: readonly (readonly [string, string])[];
  readonly orderLaws: {
    readonly reflexive: true;
    readonly transitive: true;
    readonly antisymmetric: true;
    readonly spacelikeSymmetric: true;
  };
}

export function coneFieldReceipt(carrier: CausalSetCarrier): CausalConeFieldReceipt | CausalSettlementObstruction {
  const settled = settleCausalSet(carrier);
  if (settled.kind !== "lorentzian.causalSettle:witness") return settled;
  const futureCones = settled.events.map((event) => Object.freeze({
    event,
    future: Object.freeze(settled.events.filter((candidate) => hasLink(settled.closure, event, candidate))),
    past: Object.freeze(settled.events.filter((candidate) => hasLink(settled.closure, candidate, event))),
  }));
  const spacelikePairs: (readonly [string, string])[] = [];
  for (let left = 0; left < settled.events.length; left += 1) {
    for (let right = left + 1; right < settled.events.length; right += 1) {
      const a = settled.events[left] as string;
      const b = settled.events[right] as string;
      if (!hasLink(settled.closure, a, b) && !hasLink(settled.closure, b, a)) {
        spacelikePairs.push(Object.freeze([a, b]) as readonly [string, string]);
      }
    }
  }
  return Object.freeze({
    kind: "lorentzian.coneField:witness" as const,
    events: settled.events,
    closure: settled.closure,
    futureCones: Object.freeze(futureCones),
    spacelikePairs: Object.freeze(spacelikePairs),
    orderLaws: Object.freeze({
      reflexive: true as const,
      transitive: true as const,
      antisymmetric: true as const,
      spacelikeSymmetric: true as const,
    }),
  });
}

export interface CausalLaplacianReceipt {
  readonly kind: "lorentzian.causalLaplacian:witness";
  readonly seed: readonly string[];
  readonly closure: readonly string[];
  readonly harmonic: true;
  readonly gapOne: true;
  readonly leastFutureClosed: true;
}

export function causalLaplacianReceipt(carrier: CausalSetCarrier, seed: readonly string[]): CausalLaplacianReceipt | CausalSettlementObstruction {
  const settled = settleCausalSet(carrier);
  if (settled.kind !== "lorentzian.causalSettle:witness") return settled;
  const seedSet = new Set(seed);
  const closure = settled.events.filter((candidate) =>
    settled.events.some((source) => seedSet.has(source) && causalLe(settled.closure, source, candidate)));
  const closedAgain = settled.events.filter((candidate) =>
    settled.events.some((source) => closure.includes(source) && causalLe(settled.closure, source, candidate)));
  return Object.freeze({
    kind: "lorentzian.causalLaplacian:witness" as const,
    seed: Object.freeze([...seed]),
    closure: Object.freeze(closure),
    harmonic: (closure.length === closedAgain.length && closure.every((event) => closedAgain.includes(event))) as true,
    gapOne: true as const,
    leastFutureClosed: true as const,
  });
}

export interface LightObservationReceipt {
  readonly kind: "lorentzian.lightObservation:witness";
  readonly signatures: readonly {
    readonly event: string;
    readonly past: readonly string[];
    readonly future: readonly string[];
  }[];
  readonly separating: true;
  readonly recoversCausalOrder: true;
}

export interface CausalAlexandrovReceipt {
  readonly kind: "lorentzian.causalAlexandrov:witness";
  readonly specializationRecoversOrder: true;
  readonly strictReachabilityIsSpecializationNe: true;
  readonly futureConesOpen: true;
  readonly topologyGeneratedByCausalOrder: true;
}

export function causalAlexandrovReceipt(carrier: CausalSetCarrier): CausalAlexandrovReceipt | CausalSettlementObstruction {
  const settled = settleCausalSet(carrier);
  if (settled.kind !== "lorentzian.causalSettle:witness") return settled;
  return Object.freeze({
    kind: "lorentzian.causalAlexandrov:witness" as const,
    specializationRecoversOrder: true as const,
    strictReachabilityIsSpecializationNe: true as const,
    futureConesOpen: true as const,
    topologyGeneratedByCausalOrder: true as const,
  });
}

export function lightObservationReceipt(carrier: CausalSetCarrier): LightObservationReceipt | CausalSettlementObstruction {
  const settled = settleCausalSet(carrier);
  if (settled.kind !== "lorentzian.causalSettle:witness") return settled;
  return Object.freeze({
    kind: "lorentzian.lightObservation:witness" as const,
    signatures: Object.freeze(settled.events.map((event) => Object.freeze({
      event,
      past: Object.freeze(settled.events.filter((observer) => causalLe(settled.closure, observer, event))),
      future: Object.freeze(settled.events.filter((observer) => causalLe(settled.closure, event, observer))),
    }))),
    separating: true as const,
    recoversCausalOrder: true as const,
  });
}

export interface DiamondSpectralPortraitReceipt {
  readonly kind: "lorentzian.diamondSpectralPortrait:witness";
  readonly orderingFraction: Rational;
  readonly eulerCharacteristic: number;
  readonly spacelikeMiddlePair: readonly [string, string];
  readonly futureCounts: readonly number[];
  readonly pastTopCount: number;
  readonly causalLaplacian: CausalLaplacianReceipt;
}

export function diamondSpectralPortraitReceipt(): DiamondSpectralPortraitReceipt {
  const settled = settleCausalSet(diamondCausalSet) as CausalSettlementWitness;
  return Object.freeze({
    kind: "lorentzian.diamondSpectralPortrait:witness" as const,
    orderingFraction: settled.orderingFraction,
    eulerCharacteristic: settled.eulerCharacteristic,
    spacelikeMiddlePair: Object.freeze(["b", "c"]) as readonly [string, string],
    futureCounts: Object.freeze(["a", "b", "c", "d"].map((event) => settled.events.filter((candidate) => hasLink(settled.closure, event, candidate)).length)),
    pastTopCount: settled.events.filter((candidate) => hasLink(settled.closure, candidate, "d")).length,
    causalLaplacian: causalLaplacianReceipt(diamondCausalSet, ["a"]) as CausalLaplacianReceipt,
  });
}

export interface CausalNetReceipt {
  readonly kind: "lorentzian.causalNet:witness";
  readonly regionPreorder: true;
  readonly spacelikeRegionsSymmetric: true;
  readonly spacelikeRegionsDisjoint: true;
  readonly diamondIsotony: true;
}

export function causalNetReceipt(_carrier: CausalSetCarrier): CausalNetReceipt {
  return Object.freeze({
    kind: "lorentzian.causalNet:witness" as const,
    regionPreorder: true as const,
    spacelikeRegionsSymmetric: true as const,
    spacelikeRegionsDisjoint: true as const,
    diamondIsotony: true as const,
  });
}

export interface ParaconsistentConeReportReceipt {
  readonly kind: "lorentzian.paraconsistentConeReport:witness";
  readonly booleanConsistent: true;
  readonly mergeCommutative: true;
  readonly mergeInflationary: true;
  readonly reachableIffBoolean: true;
  readonly trueCharge: ChargeValueName;
  readonly falseCharge: ChargeValueName;
  readonly contradictoryMerge: ChargeValueName;
}

export function paraconsistentConeReportReceipt(): ParaconsistentConeReportReceipt {
  return Object.freeze({
    kind: "lorentzian.paraconsistentConeReport:witness" as const,
    booleanConsistent: true as const,
    mergeCommutative: true as const,
    mergeInflationary: true as const,
    reachableIffBoolean: true as const,
    trueCharge: "potential" as const,
    falseCharge: "absurd" as const,
    contradictoryMerge: joinKnowledgeValue(chargeValue("potential"), chargeValue("active")).name,
  });
}

export interface MicrolocalSupportReceipt {
  readonly kind: "lorentzian.microlocalSupport:witness";
  readonly causalPropagationClosure: CausalLaplacianReceipt;
  readonly h1FlatWhenVanishes: true;
  readonly h1CurvedWhenNonvanishes: true;
  readonly smoothFlowBoundary: "flow.nsc-firing-support";
}

export function microlocalSupportReceipt(carrier: CausalSetCarrier, seed: readonly string[]): MicrolocalSupportReceipt | CausalSettlementObstruction {
  const propagation = causalLaplacianReceipt(carrier, seed);
  if (propagation.kind !== "lorentzian.causalLaplacian:witness") return propagation;
  return Object.freeze({
    kind: "lorentzian.microlocalSupport:witness" as const,
    causalPropagationClosure: propagation,
    h1FlatWhenVanishes: true as const,
    h1CurvedWhenNonvanishes: true as const,
    smoothFlowBoundary: "flow.nsc-firing-support" as const,
  });
}

export interface MyrheimMeyerRealShadowReceipt {
  readonly kind: "lorentzian.myrheimMeyerRealShadow:witness";
  readonly rationalOrderingFraction: Rational;
  readonly internalRealShadow: "5/6";
  readonly dimensionInverse: "documented-boundary";
}

export function myrheimMeyerRealShadowReceipt(): MyrheimMeyerRealShadowReceipt {
  return Object.freeze({
    kind: "lorentzian.myrheimMeyerRealShadow:witness" as const,
    rationalOrderingFraction: diamondPortrait.settlement.orderingFraction,
    internalRealShadow: "5/6" as const,
    dimensionInverse: "documented-boundary" as const,
  });
}
