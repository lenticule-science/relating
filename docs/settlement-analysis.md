# Settlement Analysis

The `analysis` surface contains exact analytical reads downstream of settlement.
It is exported two ways:

- root namespace: `analysis`
- subpath: `@emsenn/relating/analysis`

The modules here do not define the primitive relation carriers. They read
settled or relation-shaped material into exact arithmetic, graded quantities,
Laplacian graphs, spectral judgments, evidence distributions, differential
findings, and conservation witnesses.

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
```

For a runnable version, see
[`examples/settlement-analysis.mjs`](../examples/settlement-analysis.mjs).

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

## Boundary

This surface is not a general numerical computing package. It uses exact
carriers and finite algorithms already implemented in `lib/relating`; it does
not provide floating-point linear algebra, arbitrary symbolic simplification, or
Lean-emitted golden vectors for every analysis function.
