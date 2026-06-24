/**
 * acting/action - the boundary-morphism class: an action is a cocone leg.
 *
 * The typing kernel owns the morphism carrier and registry. This module adds the
 * acting boundary's codec checks and utterance facts, so existing transports keep
 * reading the same action shape while domain/codomain refs now derive from
 * carrier objects.
 */
import { mark, utterance, type UtteranceCarrier } from "../articulating/index.mjs";
import type { JsonValue } from "../codecs/json.mjs";
import { evaluateRunTerm } from "../expressing/evaluating/index.mjs";
import { tm } from "../expressing/notating/index.mjs";
import { action as kernelAction, composes, type Action, type ActionSpec } from "../typing/index.mjs";
import { wireCodec } from "./codecs.mjs";

export type { Action, ActionSpec };
export { composes };

/** Register an action. Validates the verb and witnesses the wire codec names. */
export function action<In extends JsonValue = JsonValue, Out extends JsonValue = JsonValue>(
  spec: ActionSpec<In, Out>,
): Action<In, Out> {
  if (!spec.verb || spec.verb.trim() === "") throw new TypeError("action: verb is required");
  if (spec.run === undefined && spec.runTerm === undefined) throw new TypeError(`action ${spec.verb}: run or runTerm is required`);
  const inName = spec.inputFormat ?? "json";
  const outName = spec.outputFormat ?? "json";
  wireCodec(inName);
  wireCodec(outName);
  const run = spec.run ?? ((input: In): Out =>
    evaluateRunTerm(spec.runTerm as NonNullable<typeof spec.runTerm>, input as JsonValue) as Out);
  return kernelAction({ ...spec, inputFormat: inName, outputFormat: outName, run });
}

/** Type guard: a value is an action carrier. */
export function isAction(value: unknown): value is Action {
  return typeof value === "object" && value !== null && (value as { kind?: unknown }).kind === "relating.action";
}

/** A relational fact as an utterance: token mark = {subject, object}, claim mark = predicate. */
export function fact(subject: JsonValue, predicate: string, object: JsonValue): UtteranceCarrier {
  return utterance(mark({ subject, object }), mark(predicate));
}

/** Compose two morphisms: `consumer ∘ producer`. Both must compose categorically
 *  (`producer.codomain.$id === consumer.domain.$id`) and each must have a `runTerm`.
 *  The synthesized `run` evaluates the composed CHL application. */
export function compose(producer: Action, consumer: Action, verb: string): Action {
  if (!composes(producer, consumer)) {
    throw new TypeError(`compose: ${producer.verb}.codomain ≠ ${consumer.verb}.domain`);
  }
  if (producer.runTerm === undefined) throw new TypeError(`compose: ${producer.verb} has no runTerm`);
  if (consumer.runTerm === undefined) throw new TypeError(`compose: ${consumer.verb} has no runTerm`);
  return action({
    verb,
    inputFormat: producer.inputFormat,
    outputFormat: consumer.outputFormat,
    ...(producer.domain === undefined ? {} : { domain: producer.domain }),
    ...(consumer.codomain === undefined ? {} : { codomain: consumer.codomain }),
    runTerm: tm.app(consumer.runTerm, producer.runTerm),
  });
}

/** The utterance facts an action carries about itself - the leg's content. */
export function actionUtterances(act: Action): readonly UtteranceCarrier[] {
  const term = `relating.action.${act.verb}`;
  const facts: UtteranceCarrier[] = [
    fact(term, "relating.action.has-verb", act.verb),
    fact(term, "relating.action.accepts-codec", act.inputFormat),
    fact(term, "relating.action.emits-codec", act.outputFormat),
  ];
  if (act.summary !== undefined) facts.push(fact(term, "relating.action.summary", act.summary));
  if (act.description !== undefined) facts.push(fact(term, "relating.action.description", act.description));
  if (act.domain !== undefined) facts.push(fact(term, "relating.action.domain", act.domain.id));
  if (act.codomain !== undefined) facts.push(fact(term, "relating.action.codomain", act.codomain.id));
  if (act.runTerm !== undefined) facts.push(fact(term, "relating.action.run-term", act.runTerm));
  return Object.freeze(facts);
}
