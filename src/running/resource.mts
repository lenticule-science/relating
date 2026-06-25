/**
 * acting/resource - the addressable-artifact class: a resource is a cocone leg.
 *
 * Where an `action` injects a morphism into the package's call surface, a
 * `resource` injects an addressable artifact: a named, typed document the package
 * already holds or derives, such as a carrier JSON Schema, the discovery carrier,
 * or generated documentation. `induceBins` collects resources alongside actions
 * into the one apex; the MCP transport projects them as `resources/list` and
 * `resources/read`, with no second ontology.
 */
import { mark, utterance, type UtteranceCarrier } from "../../lib/articulating/index.mjs";
import { fact } from "./action.mjs";

/** A resource: a registered addressable artifact over the package carrier. */
export interface ResourceCarrier {
  readonly kind: "relating.resource";
  readonly uri: string;
  readonly name: string;
  readonly mimeType: string;
  readonly description?: string;
  readonly read: () => string;
}

/** The spec admitted by `resource()`. */
export interface ResourceSpec {
  readonly uri: string;
  readonly name: string;
  readonly mimeType?: string;
  readonly description?: string;
  readonly read: () => string;
}

/** The pure metadata of a resource - what `resources/list` returns. */
export interface ResourceDescriptor {
  readonly uri: string;
  readonly name: string;
  readonly mimeType: string;
  readonly description?: string;
}

/** Register a resource. Validates the uri and name. */
export function resource(spec: ResourceSpec): ResourceCarrier {
  if (!spec.uri || spec.uri.trim() === "") throw new TypeError("resource: uri is required");
  if (!spec.name || spec.name.trim() === "") throw new TypeError("resource: name is required");
  if (typeof spec.read !== "function") throw new TypeError("resource: read must be a function");
  return Object.freeze({
    kind: "relating.resource" as const,
    uri: spec.uri,
    name: spec.name,
    mimeType: spec.mimeType ?? "application/json",
    ...(spec.description === undefined ? {} : { description: spec.description }),
    read: spec.read,
  });
}

/** Type guard: a value is a resource carrier. */
export function isResource(value: unknown): value is ResourceCarrier {
  return typeof value === "object" && value !== null && (value as { kind?: unknown }).kind === "relating.resource";
}

/** The pure descriptor of a resource, with no content. */
export function resourceDescriptor(res: ResourceCarrier): ResourceDescriptor {
  return Object.freeze({
    uri: res.uri,
    name: res.name,
    mimeType: res.mimeType,
    ...(res.description === undefined ? {} : { description: res.description }),
  });
}

/** The utterance facts a resource carries about itself - the leg's content. */
export function resourceUtterances(res: ResourceCarrier): readonly UtteranceCarrier[] {
  const term = `relating.resource.${res.uri}`;
  const facts: UtteranceCarrier[] = [
    fact(term, "relating.resource.has-uri", res.uri),
    fact(term, "relating.resource.has-name", res.name),
    fact(term, "relating.resource.has-media-type", res.mimeType),
  ];
  if (res.description !== undefined) facts.push(fact(term, "relating.resource.description", res.description));
  return Object.freeze(facts);
}

/** A literal resource: content fixed at registration. */
export function literalResource(
  uri: string,
  name: string,
  text: string,
  options: { readonly mimeType?: string; readonly description?: string } = {},
): ResourceCarrier {
  return resource({
    uri,
    name,
    ...(options.mimeType === undefined ? {} : { mimeType: options.mimeType }),
    ...(options.description === undefined ? {} : { description: options.description }),
    read: () => text,
  });
}

export { mark, utterance };
