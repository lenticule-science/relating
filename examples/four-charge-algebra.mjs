import {
  charge,
  chargeValue,
  chargeValueName,
  conflateValue,
  fixedSet,
  gauge,
  joinKnowledge,
  joinKnowledgeValue,
  joinTruthValue,
  leqKnowledge,
  leqTruth,
  mark,
  meetKnowledgeValue,
  meetTruthValue,
  negateValue,
  valueOf,
} from "@emsenn/relating";

const name = (value) => chargeValueName(value);
const value = (name) => chargeValue(name);

const supported = charge(value("potential"), [[mark("source:A")], []]);
const contradicted = charge(value("active"), [[], [mark("source:B")]]);
const merged = joinKnowledge(supported, contradicted);

const pairs = [
  ["absurd", "potential"],
  ["absurd", "active"],
  ["potential", "stable"],
  ["active", "stable"],
  ["potential", "active"],
];

console.log(JSON.stringify({
  product: "relating.four-charge-algebra",
  values: ["absurd", "potential", "active", "stable"],
  contradiction: {
    positiveEvidence: supported.evidence[0].map((witness) => witness.value),
    negativeEvidence: contradicted.evidence[1].map((witness) => witness.value),
    knowledgeJoin: name(valueOf(merged)),
    heldAsTop: name(valueOf(merged)) === "stable",
    mergedEvidence: {
      positive: merged.evidence[0].map((witness) => witness.value),
      negative: merged.evidence[1].map((witness) => witness.value),
    },
  },
  orders: Object.fromEntries(pairs.map(([left, right]) => [
    `${left}->${right}`,
    {
      knowledge: leqKnowledge(charge(value(left)), charge(value(right))),
      truth: leqTruth(charge(value(left)), charge(value(right))),
    },
  ])),
  tables: {
    knowledgeJoin: {
      "potential join active": name(joinKnowledgeValue(value("potential"), value("active"))),
      "potential meet active": name(meetKnowledgeValue(value("potential"), value("active"))),
    },
    truthJoin: {
      "active join potential": name(joinTruthValue(value("active"), value("potential"))),
      "active meet potential": name(meetTruthValue(value("active"), value("potential"))),
    },
  },
  gauge: {
    "negate potential": name(negateValue(value("potential"))),
    "conflate stable": name(conflateValue(value("stable"))),
    "double absurd": name(gauge("double", value("absurd"))),
    "negation fixed": fixedSet("negation").map(name),
  },
}, null, 2));
