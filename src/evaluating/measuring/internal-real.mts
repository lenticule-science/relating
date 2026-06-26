/**
 * evaluating/measuring/internal-real — RMN normalizers for internal-real witnesses.
 *
 * The exact arithmetic lives in `settling/analysis/internal-real`. These RMN
 * terms normalize the witness/obstruction carrier shape, so downstream actions
 * can carry the proof-reading as inspectable Relation Model Notation instead of
 * opaque callback-only behavior.
 */
import { tm, type Tm } from "../../../lib/notating/index.mjs";
import { objectTerm, stringTerm } from "../projecting/index.mjs";

const field = (key: string): Tm => tm.field(key, tm.var(0));

const scalarCancellationWitness = objectTerm([
  ["conclusionHolds", field("conclusionHolds")],
  ["kind", stringTerm("internalReal.scalarCancellation:witness")],
  ["left", field("left")],
  ["m", field("m")],
  ["premiseHolds", field("premiseHolds")],
  ["positive", field("positive")],
  ["right", field("right")],
  ["scaledLeft", field("scaledLeft")],
  ["scaledRight", field("scaledRight")],
]);

const scalarCancellationObstruction = (reason: string): Tm => objectTerm([
  ["conclusionHolds", field("conclusionHolds")],
  ["kind", stringTerm("internalReal.scalarCancellation-obstruction")],
  ["left", field("left")],
  ["m", field("m")],
  ["premiseHolds", field("premiseHolds")],
  ["positive", field("positive")],
  ["reason", stringTerm(reason)],
  ["right", field("right")],
  ["scaledLeft", field("scaledLeft")],
  ["scaledRight", field("scaledRight")],
]);

/** Normalize a scalar-cancellation model carrier into its witness/obstruction judgment. */
export const scalarCancellationTerm: Tm = tm.lam(
  tm.cond(
    field("positive"),
    tm.cond(
      field("premiseHolds"),
      tm.cond(
        field("conclusionHolds"),
        scalarCancellationWitness,
        scalarCancellationObstruction("conclusion"),
      ),
      scalarCancellationObstruction("scaled-order-premise"),
    ),
    scalarCancellationObstruction("positive-scalar"),
  ),
);

const logStepBoundWitness = objectTerm([
  ["admissible", field("admissible")],
  ["base", field("base")],
  ["holds", field("holds")],
  ["k", field("k")],
  ["kind", stringTerm("internalReal.logStepBound:witness")],
  ["lhs", field("lhs")],
  ["M", field("M")],
  ["rhs", field("rhs")],
]);

const logStepBoundObstruction = (reason: string): Tm => objectTerm([
  ["admissible", field("admissible")],
  ["base", field("base")],
  ["holds", field("holds")],
  ["k", field("k")],
  ["kind", stringTerm("internalReal.logStepBound-obstruction")],
  ["lhs", field("lhs")],
  ["M", field("M")],
  ["reason", stringTerm(reason)],
  ["rhs", field("rhs")],
]);

/** Normalize the finite carrier model of `RelMath.InternalReals.logNat_step_bound`. */
export const logStepBoundTerm: Tm = tm.lam(
  tm.cond(
    field("admissible"),
    tm.cond(field("holds"), logStepBoundWitness, logStepBoundObstruction("bound")),
    logStepBoundObstruction("domain"),
  ),
);

const logMonotoneWitness = objectTerm([
  ["admissible", field("admissible")],
  ["base", field("base")],
  ["holds", field("holds")],
  ["k", field("k")],
  ["kind", stringTerm("internalReal.logMonotone:witness")],
  ["lower", field("lower")],
  ["lowerApprox", field("lowerApprox")],
  ["upper", field("upper")],
  ["upperApprox", field("upperApprox")],
]);

const logMonotoneObstruction = (reason: string): Tm => objectTerm([
  ["admissible", field("admissible")],
  ["base", field("base")],
  ["holds", field("holds")],
  ["k", field("k")],
  ["kind", stringTerm("internalReal.logMonotone-obstruction")],
  ["lower", field("lower")],
  ["lowerApprox", field("lowerApprox")],
  ["reason", stringTerm(reason)],
  ["upper", field("upper")],
  ["upperApprox", field("upperApprox")],
]);

/** Normalize the finite carrier model of `RelMath.InternalReals.logNat_mono`. */
export const logMonotoneTerm: Tm = tm.lam(
  tm.cond(
    field("admissible"),
    tm.cond(field("holds"), logMonotoneWitness, logMonotoneObstruction("order")),
    logMonotoneObstruction("domain"),
  ),
);
