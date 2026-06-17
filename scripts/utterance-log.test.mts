import assert from "node:assert/strict";
import test from "node:test";

import { mark, utterance } from "../src/algebra/index.mjs";
import { canonical, parse as parseJson } from "../src/codecs/path/object/attribute/file/flatfile/serialization/json/index.mjs";
import { dehydrateUtterances, rehydrateUtterances } from "./utterance-log.mjs";

test("the utterance-log codec witnesses JSON representation without preserving carrier identity", () => {
  const log = [
    utterance(mark({ subject: "socrates", object: "truth" }), mark("speaks")),
    utterance(mark({ subject: "socrates", object: "human" }), mark("specializes")),
    utterance(mark("socrates"), mark("errs")),
  ];
  const dehydrated = dehydrateUtterances(log);
  const rehydrated = rehydrateUtterances(parseJson(canonical(dehydrated)));

  assert.equal(rehydrated.length, log.length);
  assert.equal(rehydrated[0]!.token === log[0]!.token, false);
  assert.equal(rehydrated[0]!.token.mark === log[0]!.token.mark, false);
  assert.throws(() => dehydrateUtterances([utterance(mark(Symbol("opaque")), mark("speaks"))]), TypeError);
  assert.throws(() => rehydrateUtterances({ kind: "wrong" }), TypeError);
  assert.throws(() => rehydrateUtterances({ kind: "meme-topology.utteranceLog", utterances: ["loose"] }), /expected an encoded utterance/);
  assert.throws(() => rehydrateUtterances({ kind: "meme-topology.utteranceLog", utterances: [{ token: "x" }] }), /must carry token and claim/);
});
