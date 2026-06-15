/**
 * codecs/html/morphism — the class-as-morphism registry. In SHP an HTML `class`
 * names a morphism identity (a predicate), not a styling hint. The registry is
 * the correspondence between a carrier predicate and its packet class.
 */
import { slug } from "./escape.mjs";

export interface Morphism {
  readonly className: string;
  readonly predicate: unknown;
}

export interface MorphismRegistry {
  /** the class that identifies this predicate's morphism in the packet. */
  className(predicate: unknown): string;
  /** the predicate a class identifies (the class itself when unknown). */
  predicate(className: string): unknown;
}

const keyOf = (predicate: unknown): string =>
  typeof predicate === "string" ? predicate : JSON.stringify(predicate ?? null);

/** The default registry: class = slug(predicate). The inverse is lossy (slug is
 *  not injective), so it returns the class itself as the recoverable identity. */
export function defaultMorphisms(): MorphismRegistry {
  return {
    className: (predicate) => slug(predicate),
    predicate: (className) => className,
  };
}

/** A registry over an explicit class↔predicate vocabulary (e.g. RFC 7992's
 *  structural classes). Predicates not listed fall back to the slug default. */
export function morphismRegistry(morphisms: readonly Morphism[]): MorphismRegistry {
  const byPredicate = new Map<string, string>();
  const byClass = new Map<string, unknown>();
  for (const m of morphisms) {
    byPredicate.set(keyOf(m.predicate), m.className);
    byClass.set(m.className, m.predicate);
  }
  return {
    className: (predicate) => byPredicate.get(keyOf(predicate)) ?? slug(predicate),
    predicate: (className) => (byClass.has(className) ? byClass.get(className) : className),
  };
}
