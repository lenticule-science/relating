import { chargeValue, sameChargeValue, valueOf } from "../../../../articulating/carriers.mjs";
import type { Cell } from "../../../../articulating/carriers.mjs";
import type { Valuation } from "../fiber.mjs";

/**
 * The cells designated by a valuation: every cell whose charge value is
 * potential or stable, collected across all fibers; stable is retained so the
 * held contradiction is not collapsed to falsity.
 */
export function designatedCells(valuation: Valuation): readonly Cell[] {
  // Designated = truth coordinate present: potential AND stable. Excluding
  // stable would resolve the held contradiction to the falsity side — the
  // classical collapse the bilattice exists to refuse.
  return Object.freeze(valuation.fibers.flatMap((fiber) =>
    fiber.assignments
      .filter((assignment) => {
        const value = valueOf(assignment.charge);
        return sameChargeValue(value, chargeValue("potential")) || sameChargeValue(value, chargeValue("stable"));
      })
      .map((assignment) => assignment.cell)));
}
