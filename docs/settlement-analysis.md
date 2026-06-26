# Settlement Analysis

The `analysis` surface contains exact analytical reads downstream of settlement.
It is exported two ways:

- root namespace: `analysis`
- subpath: `@emsenn/relating/analysis`

The modules here do not define the primitive relation carriers. They read
settled or relation-shaped material into exact arithmetic, graded quantities,
Laplacian graphs, spectral judgments, evidence distributions, differential
findings, conservation witnesses, and finite internal-real/logarithm witnesses.

For the smaller root-level read that splits a FOUR census into truth and
contradiction rows, see
[Bigraded settling cohomology](bigraded-settling-cohomology.md).

## Example

```js
import * as analysis from "@emsenn/relating/analysis";
import { chargeValue } from "@emsenn/relating";

const count = analysis.count(["alpha", "beta", "gamma"]);
count.kind; // "exactNumber.natural"

const distribution = analysis.chargeDistribution([
  chargeValue("potential"),
  chargeValue("active"),
  chargeValue("stable"),
  chargeValue("stable"),
]);

const coordinates = analysis.evidenceCoordinates(distribution);
coordinates.kind; // "meme-analysis.evidence.coordinates"

const bound = analysis.internalReal.logStepBound(8, 2);
bound.kind; // "internalReal.logStepBound:witness"
```

For a runnable version, see
[`examples/settlement-analysis.mjs`](../examples/settlement-analysis.mjs).

That runnable example also builds a tiny settled section, reads its finite
relation graph, computes the exact combinatorial Laplacian, checks the
Fibonacci characteristic polynomial for Pisot-style spectral shape, and checks
one constant observable as harmonic while returning an obstruction for a sloped
observable. It also reads an oriented flow network, distinguishes a conserved
circulation from a leaking flow, completes one missing edge value, and reports a
small charged control finding.

## What It Contains

- exact numbers: von Neumann naturals, balanced integers, canonical rationals,
  integer matrices, determinants, characteristic polynomials, Smith normal form,
  and rank
- graded rationals: exact values scoped to opaque sectors where addition is only
  defined within a grade
- Laplacian reads: relation graphs, exact Laplacians, harmonic judgments,
  component counts, spectrum polynomials, and spanning-tree counts
- spectral reads: polynomial identity, reciprocal symmetry, resultants,
  unit-circle root-location judgments, Pisot judgments, and Mahler-measure
  judgments
- evidence reads: exact FOUR charge histograms, evidence-coordinate
  expectations, majorization/mixedness, joint distributions, independence, and
  screening-off
- internal-real/logarithm reads: exact rational `natLog`/`logSeq`
  approximants, positive scalar-cancellation witnesses, finite per-step
  log-Lipschitz bound judgments, and log-monotonicity witnesses
- conservation and differential reads: boundary/divergence checks, graded
  conservation, and charged control findings

## Product Reading

This is the package's exact analysis bench. Ordinary Node libraries tend to
leave this material as ad hoc numbers, booleans, or reports. Here, the result is
still carrier-shaped: a rank is a `Natural`, a harmonic check is a witness or
obstruction, and an evidence distribution is a FOUR-valued exact histogram.

That makes analysis compatible with the rest of the package's style: relations
settle first; analytical reads then return typed data that can be witnessed,
serialized, projected, or used by RMN differential tests.

The graph/Laplacian path is deliberately finite and exact. `relationGraph`
reads a `SectionCarrier` into weighted term adjacency, `laplacianOf` derives
`L = D - W` over integer carriers, and `harmonic` judges rational observables by
exact zero deviation. This sits beside the Lean Lawvere/Tarski Laplacian story
where harmonic means fixed/global/settled state; the Node surface is the
executable finite graph read, not a claim to be the whole enriched sheaf
Laplacian.

The spectral-polynomial path is also exact at the carrier level. It can compare
integer polynomials after normalization, reverse them into reciprocal
polynomials, compute resultants, locate roots relative to the unit circle by a
rational Routh-Hurwitz read, judge Pisot-style root structure, and run bounded
rational dominant-root iteration. For the Fibonacci matrix the package derives
`[-1, -1, 1]`, the same golden-ratio/Pisot minimal-polynomial handle used in the
RelMath step-N recurrence spine. It does not solve arbitrary real eigenvalues or
perform floating-point spectral analysis.

The conservation path is the first-order read under that graph story:
`flowNetwork` keeps the orientation that the undirected Laplacian forgets,
`divergence` computes net accumulation at each term, and `conserved` returns a
witness or obstruction for whether the boundary vanishes. The completion helpers
solve only the finite elided-edge or one-sector residual cases they can actually
compute. The `differential` namespace is smaller still: it is a charged control
finding vocabulary, not a rules engine.

The `internalReal` namespace is the executable finite shadow of the green Lean
`RelMath.Real.InternalReals`, `RelMath.Real.Logarithm`, and
`RelMath.Real.LogLipschitz` modules. It works over exact rational approximants:
`natLog`, `logSeq`, `invNatP`, and `nsmulRational` supply the carrier arithmetic,
while `scalarCancellation`, `logStepBound`, and `logMonotone` return
witness/obstruction carriers. Root-level `internalReal` exports RMN terms that
normalize those carriers, so downstream actions can carry this proof-reading as
inspectable data.

## Boundary

This surface is not a general numerical computing package. It uses exact
carriers and finite algorithms already implemented in `lib/relating`; it does
not provide floating-point linear algebra, arbitrary symbolic simplification, or
Lean-emitted golden vectors for every analysis function. The internal-real layer
does not claim to materialize arbitrary Bishop reals in Node; it exposes the
finite exact approximants and proof-shaped judgments that the package can
actually compute.
