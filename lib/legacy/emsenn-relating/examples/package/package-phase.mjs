import { actions } from "@emsenn/relating/actions";
import { utteranceCarrier } from "@emsenn/relating/carriers";
import { wireCodec } from "@emsenn/relating/codecs/boundary/wire";
import { mark, utterance } from "@emsenn/relating/articulating";
import { induceBins } from "@emsenn/relating/running";

const admitted = utterance(mark("token"), mark("claim"));
const apex = induceBins(actions, { packageName: "@emsenn/relating" });

console.log(JSON.stringify({
  carrier: {
    id: utteranceCarrier.id,
    validates: utteranceCarrier.validate(admitted),
  },
  actions: {
    count: actions.length,
    firstDescentVerbs: apex.discovery.bins.slice(0, 6).map((bin) => bin.name),
  },
  codecs: {
    jsonMediaType: wireCodec("json").mediaType,
    rmnMediaType: wireCodec("rmn").mediaType,
  },
}, null, 2));
