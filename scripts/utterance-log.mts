import { mark, utterance, type Mark, type UtteranceCarrier } from "../src/index.mjs";
import { type JsonValue, isJsonRecord } from "../src/codecs/path/object/attribute/file/flatfile/serialization/json/index.mjs";

type MutableJsonRecord = { [key: string]: JsonValue };

function asJsonValue(value: Mark["value"], context: string): JsonValue {
  if (value === null || typeof value === "boolean" || typeof value === "string") return value;
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new TypeError(`${context}: non-finite number is not a JSON value`);
    return value;
  }
  if (Array.isArray(value)) return value.map((item, index) => asJsonValue(item, `${context}[${index}]`));
  if (typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype) {
    const out: MutableJsonRecord = {};
    for (const [key, item] of Object.entries(value)) out[key] = asJsonValue(item, `${context}.${key}`);
    return out;
  }
  throw new TypeError(`${context}: not a JSON value`);
}

/** Utterance-log persistence: carriers never cross the wire; re-`induce` on
 *  the far side. This JSON codec can only carry JSON-compatible mark payloads;
 *  arbitrary non-JSON marks need another representation boundary. Rehydration
 *  creates fresh marks, so core predication never treats the round trip as mark
 *  coincidence. */
export function dehydrateUtterances(utterances: readonly UtteranceCarrier[]): JsonValue {
  const encoded: JsonValue[] = utterances.map((carrier, index): JsonValue => {
    const context = `dehydrateUtterances: utterance ${index}`;
    if (typeof carrier !== "object" || carrier === null || carrier.kind !== "utterance.carrier") {
      throw new TypeError(`${context}: expected an utterance carrier`);
    }
    return {
      token: asJsonValue(carrier.token.mark.value, `${context} token mark value`),
      claim: asJsonValue(carrier.claim.mark.value, `${context} claim mark value`),
    };
  });
  return { kind: "meme-topology.utteranceLog", utterances: encoded };
}

/**
 * Reconstructs an utterance log from its dehydrated JsonValue form: validates
 * the meme-topology.utteranceLog shape and rebuilds each carrier by inducing
 * token and claim marks from their stored values. Returns a frozen array of
 * UtteranceCarrier; throws a TypeError on any malformed input.
 */
export function rehydrateUtterances(value: JsonValue): readonly UtteranceCarrier[] {
  if (!isJsonRecord(value)) {
    throw new TypeError("rehydrateUtterances: expected an utterance log object");
  }
  if (value["kind"] !== "meme-topology.utteranceLog" || !Array.isArray(value["utterances"])) {
    throw new TypeError("rehydrateUtterances: expected a meme-topology.utteranceLog carrier");
  }
  const out = value["utterances"].map((entry, index) => {
    const context = `rehydrateUtterances: utterance ${index}`;
    if (!isJsonRecord(entry)) {
      throw new TypeError(`${context}: expected an encoded utterance`);
    }
    if (!("token" in entry) || !("claim" in entry)) {
      throw new TypeError(`${context}: encoded utterance must carry token and claim mark values`);
    }
    return utterance(mark(entry["token"]), mark(entry["claim"]));
  });
  return Object.freeze(out);
}
