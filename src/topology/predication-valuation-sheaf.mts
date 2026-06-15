import type { FiberCarrier, Valuation } from "./predication-fiber.mjs";
import { predicationCarrier } from "../algebra/index.mjs";

/**
 * A presheaf over a predication fiber: holds the fiber carrier together with
 * the list of valuation traces accumulated over it, seeded with the fiber's own
 * valuation.
 */
export interface PresheafCarrier {
  readonly kind: "predication.valuation.sheaf.presheaf";
  readonly fiber: FiberCarrier;
  readonly traces: readonly Valuation[];
}

/**
 * A trace through a presheaf: an ordered list of the valuations recorded over
 * the fiber.
 */
export interface PresheafTrace {
  readonly kind: "predication.valuation.sheaf.trace";
  readonly valuations: readonly Valuation[];
}

/**
 * A sheaf carrier: holds the single global section valuation that the
 * presheaf's traces glue to.
 */
export interface SheafCarrier {
  readonly kind: "predication.valuation.sheaf.carrier";
  readonly section: Valuation;
}

/**
 * The result of commutating a presheaf: holds the saturated presheaf together
 * with the residue of valuations left over from gluing its traces.
 */
export interface CommutationCarrier {
  readonly kind: "predication.valuation.sheaf.commutation";
  readonly saturated: PresheafCarrier;
  readonly residue: readonly Valuation[];
}

/**
 * Constructs a presheaf over a fiber carrier: seeds its trace list with the
 * fiber's valuation.
 */
export function presheaf(fiber: FiberCarrier): PresheafCarrier {
  return Object.freeze({ kind: "predication.valuation.sheaf.presheaf" as const, fiber, traces: Object.freeze([fiber.valuation]) });
}

/**
 * Builds a presheaf from a valuation: rebuilds a predication carrier from the
 * cells of all the valuation's assignments, wraps it as a fiber carrier, and
 * presheafs that.
 */
export function presheafFromValuation(valuation: Valuation): PresheafCarrier {
  const cells = valuation.fibers.flatMap((fiber) => fiber.assignments.map((assignment) => assignment.cell));
  const predication = predicationCarrier(cells);
  return presheaf(Object.freeze({ kind: "predication.fiber.carrier" as const, predication, valuation }));
}

/**
 * Builds a sheaf carrier from a valuation: takes the valuation as the sheaf's
 * global section.
 */
export function sheafFromValuation(section: Valuation): SheafCarrier {
  return Object.freeze({ kind: "predication.valuation.sheaf.carrier" as const, section });
}

/**
 * Commutates a presheaf into a commutation carrier: keeps the presheaf as the
 * saturated component and exposes its traces as the residue.
 */
export function commutate(p: PresheafCarrier): CommutationCarrier {
  return Object.freeze({
    kind: "predication.valuation.sheaf.commutation" as const,
    saturated: p,
    residue: p.traces,
  });
}
