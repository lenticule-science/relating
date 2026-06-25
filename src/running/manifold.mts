/**
 * acting/manifold — the operations manifold projected from an induced package.
 *
 * An operations manifold is not owned by an operations site. It is the runtime
 * shape every induced package already has: one action apex, its carrier-slot
 * extrema, and the producer/consumer edges implied by equal `$ref`s.
 */
import type { UtteranceCarrier } from "../../lib/articulating/index.mjs";
import { fact } from "./action.mjs";
import type { ActionDiscovery, ActionEndpoint } from "./induce.mjs";
import { resource, type ResourceCarrier } from "./resource.mjs";
import { slotRef } from "./serving.mjs";

/** A carrier slot where package actions meet the outside category. */
export interface OperationManifoldExtremum {
  /** Carrier `$id` consumed or produced at this extremum. */
  readonly carrier: string;
  /** Action verbs touching this extremum. */
  readonly actions: readonly string[];
}

/** A local edge whose producer codomain is another action's domain. */
export interface OperationManifoldEdge {
  /** The producing action verb. */
  readonly from: string;
  /** The consuming action verb. */
  readonly to: string;
  /** The carrier `$id` that makes the codomain/domain composition lawful. */
  readonly carrier: string;
  /** Runtime relation witnessed by this edge. */
  readonly relation: "codomain-domain";
}

/** The apex summary whose projections define this package's operation surface. */
export interface OperationManifoldApex {
  readonly kind: ActionDiscovery["kind"];
  readonly package: string;
  readonly protocol: ActionDiscovery["protocol"];
  readonly bins: readonly string[];
  readonly resources: readonly string[];
  readonly prompts: readonly string[];
}

/** The package-level operations manifold induced from one action discovery. */
export interface PackageOperationsManifold {
  readonly kind: "relating.operations-manifold";
  readonly package: string;
  readonly protocol: ActionDiscovery["protocol"];
  readonly apex: OperationManifoldApex;
  readonly extrema: {
    /** Domain carrier extrema: carriers the package consumes. */
    readonly domains: readonly OperationManifoldExtremum[];
    /** Codomain carrier extrema: carriers the package produces. */
    readonly codomains: readonly OperationManifoldExtremum[];
    /** Domain extrema with no local producer; likely an upstream apex. */
    readonly incoming: readonly OperationManifoldExtremum[];
    /** Codomain extrema with no local consumer; likely a downstream domain. */
    readonly outgoing: readonly OperationManifoldExtremum[];
    /** Local edges where a final codomain is another action's first domain. */
    readonly edges: readonly OperationManifoldEdge[];
  };
  /** RMN utterances that make the manifold inspectable as relational data. */
  readonly utterances: readonly UtteranceCarrier[];
}

export interface OperationsManifoldGraphNode {
  readonly package: string;
  readonly protocol: ActionDiscovery["protocol"];
  readonly bins: readonly string[];
  readonly domains: readonly string[];
  readonly codomains: readonly string[];
}

export interface OperationsManifoldGraphEdge {
  readonly fromPackage: string;
  readonly from: string;
  readonly toPackage: string;
  readonly to: string;
  readonly carrier: string;
  readonly relation: "codomain-domain";
}

export interface OperationsManifoldGraphFrontier {
  readonly package: string;
  readonly carrier: string;
  readonly actions: readonly string[];
}

export interface OperationsManifoldGraph {
  readonly kind: "relating.operations-manifold.graph";
  readonly packages: readonly OperationsManifoldGraphNode[];
  readonly edges: readonly OperationsManifoldGraphEdge[];
  readonly frontier: {
    readonly incoming: readonly OperationsManifoldGraphFrontier[];
    readonly outgoing: readonly OperationsManifoldGraphFrontier[];
  };
  readonly utterances: readonly UtteranceCarrier[];
}

function endpointsBySlot(
  endpoints: readonly ActionEndpoint[],
  side: "domain" | "codomain",
): ReadonlyMap<string, readonly string[]> {
  const byCarrier = new Map<string, string[]>();
  for (const endpoint of endpoints) {
    const carrier = slotRef(side === "domain" ? endpoint.domainSchema : endpoint.codomainSchema);
    if (carrier === undefined) continue;
    const verbs = byCarrier.get(carrier);
    if (verbs === undefined) byCarrier.set(carrier, [endpoint.name]);
    else verbs.push(endpoint.name);
  }
  return new Map([...byCarrier.entries()].map(([carrier, verbs]) => [carrier, Object.freeze([...verbs].sort())]));
}

function extremaFrom(byCarrier: ReadonlyMap<string, readonly string[]>): readonly OperationManifoldExtremum[] {
  return Object.freeze([...byCarrier.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([carrier, verbs]) => Object.freeze({ carrier, actions: verbs })));
}

function filterExtrema(
  extrema: readonly OperationManifoldExtremum[],
  absentFrom: ReadonlyMap<string, readonly string[]>,
): readonly OperationManifoldExtremum[] {
  return Object.freeze(extrema.filter((extremum) => !absentFrom.has(extremum.carrier)));
}

function edgesFrom(
  domains: ReadonlyMap<string, readonly string[]>,
  codomains: ReadonlyMap<string, readonly string[]>,
): readonly OperationManifoldEdge[] {
  const edges: OperationManifoldEdge[] = [];
  for (const [carrier, froms] of codomains) {
    const tos = domains.get(carrier);
    if (tos === undefined) continue;
    for (const from of froms) {
      for (const to of tos) edges.push(Object.freeze({ from, to, carrier, relation: "codomain-domain" as const }));
    }
  }
  return Object.freeze(edges.sort((left, right) =>
    left.carrier.localeCompare(right.carrier)
    || left.from.localeCompare(right.from)
    || left.to.localeCompare(right.to)));
}

function manifoldUtterances(
  discovery: ActionDiscovery,
  domains: readonly OperationManifoldExtremum[],
  codomains: readonly OperationManifoldExtremum[],
  edges: readonly OperationManifoldEdge[],
): readonly UtteranceCarrier[] {
  const term = `relating.operations-manifold.${discovery.package}`;
  const utterances: UtteranceCarrier[] = [
    fact(term, "relating.operations-manifold.of-package", discovery.package),
    fact(term, "relating.operations-manifold.has-apex", `relating://${encodeURIComponent(discovery.package)}/discovery`),
  ];
  for (const extremum of domains) {
    utterances.push(fact(term, "relating.operations-manifold.has-domain-extremum", extremum.carrier));
  }
  for (const extremum of codomains) {
    utterances.push(fact(term, "relating.operations-manifold.has-codomain-extremum", extremum.carrier));
  }
  for (const edge of edges) {
    const edgeTerm = `${term}.${edge.from}.${edge.to}`;
    utterances.push(fact(edgeTerm, "relating.operations-manifold.composes-through", edge.carrier));
  }
  return Object.freeze(utterances);
}

/** Project an action discovery carrier into its package operations manifold. */
export function operationsManifoldOf(discovery: ActionDiscovery): PackageOperationsManifold {
  const domainMap = endpointsBySlot(discovery.bins, "domain");
  const codomainMap = endpointsBySlot(discovery.bins, "codomain");
  const domains = extremaFrom(domainMap);
  const codomains = extremaFrom(codomainMap);
  const edges = edgesFrom(domainMap, codomainMap);

  return Object.freeze({
    kind: "relating.operations-manifold" as const,
    package: discovery.package,
    protocol: discovery.protocol,
    apex: Object.freeze({
      kind: discovery.kind,
      package: discovery.package,
      protocol: discovery.protocol,
      bins: Object.freeze(discovery.bins.map((bin) => bin.name).sort()),
      resources: Object.freeze(discovery.resources.map((res) => res.uri).sort()),
      prompts: Object.freeze(discovery.prompts.map((prompt) => prompt.name).sort()),
    }),
    extrema: Object.freeze({
      domains,
      codomains,
      incoming: filterExtrema(domains, codomainMap),
      outgoing: filterExtrema(codomains, domainMap),
      edges,
    }),
    utterances: manifoldUtterances(discovery, domains, codomains, edges),
  });
}

function graphNodeOf(manifold: PackageOperationsManifold): OperationsManifoldGraphNode {
  return Object.freeze({
    package: manifold.package,
    protocol: manifold.protocol,
    bins: manifold.apex.bins,
    domains: Object.freeze(manifold.extrema.domains.map((extremum) => extremum.carrier).sort()),
    codomains: Object.freeze(manifold.extrema.codomains.map((extremum) => extremum.carrier).sort()),
  });
}

function graphFrontierOf(
  manifolds: readonly PackageOperationsManifold[],
  side: "domains" | "codomains",
  absentFrom: ReadonlySet<string>,
): readonly OperationsManifoldGraphFrontier[] {
  const frontier: OperationsManifoldGraphFrontier[] = [];
  for (const manifold of manifolds) {
    for (const extremum of manifold.extrema[side]) {
      if (absentFrom.has(extremum.carrier)) continue;
      frontier.push(Object.freeze({ package: manifold.package, carrier: extremum.carrier, actions: extremum.actions }));
    }
  }
  return Object.freeze(frontier.sort((left, right) =>
    left.carrier.localeCompare(right.carrier) || left.package.localeCompare(right.package)));
}

function graphUtterances(
  manifolds: readonly PackageOperationsManifold[],
  edges: readonly OperationsManifoldGraphEdge[],
): readonly UtteranceCarrier[] {
  const term = "relating.operations-manifold.graph";
  const utterances: UtteranceCarrier[] = [];
  for (const manifold of manifolds) utterances.push(fact(term, "relating.operations-manifold.graph.has-package", manifold.package));
  for (const edge of edges) {
    const edgeTerm = `${term}.${edge.fromPackage}.${edge.from}.${edge.toPackage}.${edge.to}`;
    utterances.push(fact(edgeTerm, "relating.operations-manifold.graph.composes-through", edge.carrier));
  }
  return Object.freeze(utterances);
}

export function operationsManifoldGraphOf(
  manifolds: readonly PackageOperationsManifold[],
): OperationsManifoldGraph {
  const domainCarriers = new Set<string>();
  const codomainCarriers = new Set<string>();
  for (const manifold of manifolds) {
    for (const extremum of manifold.extrema.domains) domainCarriers.add(extremum.carrier);
    for (const extremum of manifold.extrema.codomains) codomainCarriers.add(extremum.carrier);
  }

  const edges: OperationsManifoldGraphEdge[] = [];
  for (const source of manifolds) {
    for (const produced of source.extrema.codomains) {
      for (const target of manifolds) {
        if (source.package === target.package) continue;
        const consumed = target.extrema.domains.find((extremum) => extremum.carrier === produced.carrier);
        if (consumed === undefined) continue;
        for (const from of produced.actions) {
          for (const to of consumed.actions) {
            edges.push(Object.freeze({
              fromPackage: source.package,
              from,
              toPackage: target.package,
              to,
              carrier: produced.carrier,
              relation: "codomain-domain" as const,
            }));
          }
        }
      }
    }
  }
  edges.sort((left, right) =>
    left.carrier.localeCompare(right.carrier)
    || left.fromPackage.localeCompare(right.fromPackage)
    || left.from.localeCompare(right.from)
    || left.toPackage.localeCompare(right.toPackage)
    || left.to.localeCompare(right.to));

  return Object.freeze({
    kind: "relating.operations-manifold.graph" as const,
    packages: Object.freeze(manifolds.map(graphNodeOf).sort((left, right) => left.package.localeCompare(right.package))),
    edges: Object.freeze(edges),
    frontier: Object.freeze({
      incoming: graphFrontierOf(manifolds, "domains", codomainCarriers),
      outgoing: graphFrontierOf(manifolds, "codomains", domainCarriers),
    }),
    utterances: graphUtterances(manifolds, edges),
  });
}

/** The stable MCP resource URI for a package's operations manifold. */
export function operationsManifoldUri(packageName: string): string {
  return `relating://${encodeURIComponent(packageName)}/operations-manifold`;
}

/** Publish the package operations manifold as an MCP resource. */
export function operationsManifoldResource(
  packageName: string,
  discovery: () => ActionDiscovery,
): ResourceCarrier {
  return resource({
    uri: operationsManifoldUri(packageName),
    name: `${packageName} operations manifold`,
    description: "The package's runtime operations manifold: apex, carrier extrema, and codomain-domain edges.",
    read: () => `${JSON.stringify(operationsManifoldOf(discovery()), null, 2)}\n`,
  });
}
