/**
 * typing/kernel - the single-source category kernel.
 *
 * A carrier declaration is one TypeBox value. From it, TypeScript reads the
 * static type with `Static<>`, transports read the JSON Schema with its `$id`,
 * and boundaries read the Ajv validator. Morphisms carry carrier objects at
 * their domain and codomain, so composition is the schema identity equation:
 * producer.codomain.$id === consumer.domain.$id.
 */
import { Ajv } from "ajv/dist/ajv.js";
import type { ErrorObject, ValidateFunction } from "ajv";
import { Type, type Static, type TProperties, type TObject, type TSchema } from "@sinclair/typebox";
import type { JsonRecord, JsonValue } from "../codecs/json.mjs";
import type { Tm } from "../expressing/notating/index.mjs";

export type CarrierId = string;

/** A schema-first object of the category. */
export interface Carrier<Schema extends TSchema = TSchema> {
  readonly kind: "relating.carrier";
  readonly id: CarrierId;
  readonly schema: Schema & { readonly $id: CarrierId };
  readonly validate: (value: unknown) => value is Static<Schema>;
  readonly assert: (value: unknown, context?: string) => Static<Schema>;
  readonly errors: (value: unknown) => readonly string[];
}

/** The schema of a carrier declaration itself. */
export const CarrierSchema = Type.Object({
  kind: Type.Literal("relating.carrier"),
  id: Type.String({ minLength: 1 }),
  schema: Type.Any(),
}, {
  $id: "relating/typing/carrier",
  title: "Carrier",
  description: "The schema-of-a-carrier: a category object declared by one TypeBox schema value.",
  additionalProperties: false,
});

export type CarrierCarrier = Static<typeof CarrierSchema>;

/** A serializable morphism face. The executable `run` is intentionally outside this schema. */
export const MorphismSchema = Type.Object({
  kind: Type.Literal("relating.action"),
  verb: Type.String({ minLength: 1 }),
  inputFormat: Type.String(),
  outputFormat: Type.String(),
  options: Type.Array(Type.String()),
  summary: Type.Optional(Type.String()),
  description: Type.Optional(Type.String()),
  domain: Type.Optional(Type.String({ minLength: 1 })),
  codomain: Type.Optional(Type.String({ minLength: 1 })),
  runTerm: Type.Optional(Type.Any()),
}, {
  $id: "relating/typing/morphism",
  title: "Action",
  description: "The schema-of-a-morphism: a boundary action typed by carrier domain and codomain $id.",
  additionalProperties: false,
});

export type MorphismCarrier = Static<typeof MorphismSchema>;
export type ActionCarrier = MorphismCarrier;

export interface ActionIrAuditEntry {
  readonly kind: "relating.action.ir-audit";
  readonly verb: string;
  readonly relation: "morphism" | "boundary";
  readonly hasRunTerm: boolean;
  readonly domain?: string;
  readonly codomain?: string;
  readonly reason?: string;
}

export interface CategoryRegistry {
  readonly registerCarrier: <Schema extends TSchema>(carrier: Carrier<Schema>) => Carrier<Schema>;
  readonly carrier: (id: CarrierId) => Carrier | undefined;
  readonly carriers: () => readonly Carrier[];
  readonly registerAction: <Act extends Action>(action: Act) => Act;
  readonly actions: () => readonly Action[];
}

export interface CarrierOptions {
  readonly title?: string;
  readonly description?: string;
  readonly additionalProperties?: boolean;
}

export interface Action<In extends JsonValue = JsonValue, Out extends JsonValue = JsonValue> {
  readonly kind: "relating.action";
  readonly verb: string;
  readonly inputFormat: string;
  readonly outputFormat: string;
  readonly options: readonly string[];
  readonly summary?: string;
  readonly description?: string;
  readonly domain?: Carrier;
  readonly codomain?: Carrier;
  readonly domainSchema?: JsonRecord;
  readonly codomainSchema?: JsonRecord;
  readonly runTerm?: Tm;
  readonly run: (input: In, args: JsonRecord) => Out;
}

export interface ActionSpec<In extends JsonValue = JsonValue, Out extends JsonValue = JsonValue> {
  readonly verb: string;
  readonly inputFormat?: string;
  readonly outputFormat?: string;
  readonly options?: readonly string[];
  readonly summary?: string;
  readonly description?: string;
  readonly domain?: Carrier;
  readonly codomain?: Carrier;
  readonly domainSchema?: JsonRecord;
  readonly codomainSchema?: JsonRecord;
  readonly runTerm?: Tm;
  readonly run?: (input: In, args: JsonRecord) => Out;
}

const ajv = new Ajv({ allErrors: true, strict: false, validateSchema: false });
const carriersById = new Map<CarrierId, Carrier>();
const actionsByVerb = new Map<string, Action>();

function formatErrors(errors: readonly ErrorObject[] | null | undefined): readonly string[] {
  return Object.freeze((errors ?? []).map((error) => {
    const at = error.instancePath === "" ? "/" : error.instancePath;
    return `${at} ${error.message ?? "is invalid"}`;
  }));
}

function compile<Schema extends TSchema>(schema: Schema & { readonly $id: CarrierId }): ValidateFunction<Static<Schema>> {
  const existing = ajv.getSchema<Static<Schema>>(schema.$id);
  if (existing !== undefined) return existing;
  return ajv.compile<Static<Schema>>(schema);
}

/** The live relating category registry. Downstream faculties populate this by declaring carriers and actions. */
export const registeredCategory: CategoryRegistry = Object.freeze({
  registerCarrier: <Schema extends TSchema>(value: Carrier<Schema>): Carrier<Schema> => {
    carriersById.set(value.id, value as Carrier);
    return value;
  },
  carrier: (id: CarrierId): Carrier | undefined => carriersById.get(id),
  carriers: (): readonly Carrier[] => Object.freeze([...carriersById.values()]),
  registerAction: <Act extends Action>(value: Act): Act => {
    actionsByVerb.set(value.verb, value);
    return value;
  },
  actions: (): readonly Action[] => Object.freeze([...actionsByVerb.values()]),
});

/** Declare a carrier once: TypeBox schema, Static<> type source, JSON Schema, and Ajv validator. */
export function schemaCarrier<const Id extends string, const Schema extends TSchema>(
  id: Id,
  schema: Schema & { readonly $id: Id },
): Carrier<Schema & { readonly $id: Id }> {
  const validator = compile(schema);
  const value: Carrier<Schema & { readonly $id: Id }> = Object.freeze({
    kind: "relating.carrier" as const,
    id,
    schema,
    validate: (candidate: unknown): candidate is Static<Schema> => validator(candidate),
    assert: (candidate: unknown, context: string = id): Static<Schema> => {
      if (validator(candidate)) return candidate;
      throw new TypeError(`${context}: ${formatErrors(validator.errors).join("; ")}`);
    },
    errors: (candidate: unknown): readonly string[] => {
      validator(candidate);
      return formatErrors(validator.errors);
    },
  });
  return registeredCategory.registerCarrier(value);
}

/** Declare an object-shaped carrier once: TypeBox schema, Static<> type source, JSON Schema, and Ajv validator. */
export function carrier<const Id extends string, const Shape extends TProperties>(
  id: Id,
  shape: Shape,
  options: CarrierOptions = {},
): Carrier<TObject<Shape>> {
  const schemaOptions: { $id: Id; title?: string; description?: string; additionalProperties: boolean } = {
    $id: id,
    additionalProperties: options.additionalProperties ?? false,
    ...(options.title === undefined ? {} : { title: options.title }),
    ...(options.description === undefined ? {} : { description: options.description }),
  };
  const schema = Type.Object(shape, schemaOptions) as TObject<Shape> & { readonly $id: Id };
  return schemaCarrier(id, schema);
}

/** Register a morphism. Carrier objects are the source of domain/codomain schema refs. */
export function action<In extends JsonValue = JsonValue, Out extends JsonValue = JsonValue>(
  spec: ActionSpec<In, Out>,
): Action<In, Out> {
  if (!spec.verb || spec.verb.trim() === "") throw new TypeError("action: verb is required");
  if (spec.run === undefined) throw new TypeError(`action ${spec.verb}: run is required at the kernel boundary`);
  const inName = spec.inputFormat ?? "json";
  const outName = spec.outputFormat ?? "json";
  const value = Object.freeze({
    kind: "relating.action" as const,
    verb: spec.verb,
    inputFormat: inName,
    outputFormat: outName,
    options: Object.freeze([...(spec.options ?? [])]),
    ...(spec.summary === undefined ? {} : { summary: spec.summary }),
    ...(spec.description === undefined ? {} : { description: spec.description }),
    ...(spec.domain === undefined ? {} : { domain: spec.domain, domainSchema: { $ref: spec.domain.id } }),
    ...(spec.codomain === undefined ? {} : { codomain: spec.codomain, codomainSchema: { $ref: spec.codomain.id } }),
    ...(spec.domain !== undefined || spec.domainSchema === undefined ? {} : { domainSchema: spec.domainSchema }),
    ...(spec.codomain !== undefined || spec.codomainSchema === undefined ? {} : { codomainSchema: spec.codomainSchema }),
    ...(spec.runTerm === undefined ? {} : { runTerm: spec.runTerm }),
    run: spec.run,
  }) satisfies Action<In, Out>;
  return registeredCategory.registerAction(value as unknown as Action) as unknown as Action<In, Out>;
}

function slotId(carrier: Carrier | undefined, schema: JsonRecord | undefined): string | undefined {
  if (carrier !== undefined) return carrier.id;
  const ref = schema?.["$ref"];
  return typeof ref === "string" ? ref : undefined;
}

/** Two morphisms compose exactly when the producer's codomain carrier id equals the consumer's domain carrier id. */
export function composes(producer: Action, consumer: Action): boolean {
  const produced = slotId(producer.codomain, producer.codomainSchema);
  const consumed = slotId(consumer.domain, consumer.domainSchema);
  return produced !== undefined && consumed !== undefined && produced === consumed;
}

/** Classify actions for the IR migration. Carrier-to-carrier morphisms must be
 * carried as `runTerm`; boundary actions are admissions, codecs, or transports. */
export function actionIrAudit(actions: readonly Action[]): readonly ActionIrAuditEntry[] {
  return Object.freeze(actions.map((action): ActionIrAuditEntry => {
    const domain = slotId(action.domain, action.domainSchema);
    const codomain = slotId(action.codomain, action.codomainSchema);
    const relation = domain !== undefined && codomain !== undefined ? "morphism" : "boundary";
    const reason = relation === "morphism"
      ? undefined
      : domain === undefined && codomain === undefined
        ? "untyped boundary"
        : domain === undefined
          ? "admission boundary"
          : "transport boundary";
    return Object.freeze({
      kind: "relating.action.ir-audit" as const,
      verb: action.verb,
      relation,
      hasRunTerm: action.runTerm !== undefined,
      ...(domain === undefined ? {} : { domain }),
      ...(codomain === undefined ? {} : { codomain }),
      ...(reason === undefined ? {} : { reason }),
    });
  }));
}

/** The remaining carrier morphisms whose executable body is still free TS. */
export function freeTsActions(actions: readonly Action[]): readonly ActionIrAuditEntry[] {
  return Object.freeze(actionIrAudit(actions).filter((entry) =>
    entry.relation === "morphism" && !entry.hasRunTerm));
}

/** The serializable TypeBox-backed morphism carrier for an action. This is the
 * shape that durable logs can store: the executable closure is excluded, while
 * the typed domain/codomain ids and optional IR `runTerm` remain as data. */
export function morphismCarrier(action: Action): MorphismCarrier {
  const domain = slotId(action.domain, action.domainSchema);
  const codomain = slotId(action.codomain, action.codomainSchema);
  return Object.freeze({
    kind: "relating.action" as const,
    verb: action.verb,
    inputFormat: action.inputFormat,
    outputFormat: action.outputFormat,
    options: [...action.options],
    ...(action.summary === undefined ? {} : { summary: action.summary }),
    ...(action.description === undefined ? {} : { description: action.description }),
    ...(domain === undefined ? {} : { domain }),
    ...(codomain === undefined ? {} : { codomain }),
    ...(action.runTerm === undefined ? {} : { runTerm: action.runTerm }),
  });
}

ajv.addSchema(CarrierSchema, CarrierSchema.$id);
ajv.addSchema(MorphismSchema, MorphismSchema.$id);

/** The morphism schema as a registered carrier — so `domain:` annotations can
 *  reference it and the registry lists it alongside other carriers. */
export const morphismSchemaCarrier = schemaCarrier(
  MorphismSchema.$id as "relating/typing/morphism",
  MorphismSchema as typeof MorphismSchema & { readonly $id: "relating/typing/morphism" },
);
