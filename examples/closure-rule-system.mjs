import { closureRule, evaluateRunTerm } from "@emsenn/relating";
import * as analysis from "@emsenn/relating/analysis";

const system = analysis.closureRule.closureRuleSystem(
  ["claim", "reply", "thread"],
  [
    analysis.closureRule.alwaysRule("claim", "potential"),
    analysis.closureRule.closureRule(
      "claim-supports-reply",
      [{ cell: "claim", atLeast: "potential" }],
      { cell: "reply", charge: "active" },
    ),
    analysis.closureRule.closureRule(
      "reply-settles-thread",
      [{ cell: "reply", atLeast: "active" }],
      { cell: "thread", charge: "stable" },
    ),
  ],
);

const receipt = analysis.closureRule.closureRuleReceipt(
  system,
  analysis.closureRule.knowledgeLeastValuation(system.cells),
);

console.log(JSON.stringify({
  kind: receipt.kind,
  closed: receipt.closed.values,
  orbitLength: receipt.orbit.length,
  lfp: evaluateRunTerm(closureRule.receipt, receipt).lfp,
}, null, 2));
