import { count } from "../../../../articulating/carriers.mjs";
import { rankVanishing } from "./cohomology.mjs";
import { nonScottSettlingFirings } from "./limit.mjs";
import type { SettlementFiltration, SettlingFirstCohomology } from "./object.mjs";

/**
 * The degree-1 cohomology of a settling: one generator per cell added at a
 * non-Scott limit-stage firing, the generator count as a rank, and the
 * rank-vanishing judgment on it.
 */
export function settlingFirstCohomology(carrier: SettlementFiltration): SettlingFirstCohomology {
  const generators = Object.freeze(nonScottSettlingFirings(carrier).firings.flatMap((increment) =>
    increment.added.cells.map((cell) => Object.freeze({
      kind: "predication.settling.firstCohomologyGenerator" as const,
      stage: increment.source,
      cell,
    }))));
  return Object.freeze({
    kind: "predication.settling.firstCohomology" as const,
    generators,
    rank: count(generators),
    degree: 1 as const,
    vanishing: rankVanishing(count(generators)),
  });
}
