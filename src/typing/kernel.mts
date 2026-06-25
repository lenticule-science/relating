/**
 * @packageDocumentation
 *
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
import type { JsonRecord } from "../writing/json.mjs";
import type { Tm } from "../../lib/notating/index.mjs";

export type CarrierId = string;

/** A schema-first object of the category. */
export interface Carrier<Schema extends TSchema = TSchema> {
  /** Runtime tag for carrier declarations. */
  readonly kind: "relating.carrier";
  /** Bare, package-rooted carrier identity. This is the composition address. */
  readonly id: CarrierId;
  /** The authored TypeBox schema, carrying the same `$id` as `id`. */
  readonly schema: Schema & { readonly $id: CarrierId };
  /** Runtime validator projected from the schema. */
  readonly validate: (value: unknown) => value is Static<Schema>;
  /** Runtime assertion projected from the schema, with useful error context. */
  readonly assert: (value: unknown, context?: string) => Static<Schema>;
  /** Validation errors projected without throwing. */
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
export type MaybePromise<T> = T | Promise<T>;

export interface ActionIrAuditEntry {
  /** Runtime tag for an action IR audit row. */
  readonly kind: "relating.action.ir-audit";
  /** Action verb being audited. */
  readonly verb: string;
  /** True carrier-to-carrier arrows are morphisms; admissions/transports are boundaries. */
  readonly relation: "morphism" | "boundary";
  /** Whether this action carries its executable behavior as RMN. */
  readonly hasRunTerm: boolean;
  /** Domain carrier id when one is admitted. */
  readonly domain?: string;
  /** Codomain carrier id when one is admitted. */
  readonly codomain?: string;
  /** Computable reason a boundary action is not required to carry RMN. */
  readonly reason?: string;
}

/** The live category registry populated by carrier and action declarations. */
export interface CategoryRegistry {
  /** Register a carrier declaration in the live category. */
  readonly registerCarrier: <Schema extends TSchema>(carrier: Carrier<Schema>) => Carrier<Schema>;
  /** Resolve a carrier by bare `$id`. */
  readonly carrier: (id: CarrierId) => Carrier | undefined;
  /** List the carriers visible in this process. */
  readonly carriers: () => readonly Carrier[];
  /** Register a morphism or boundary action in the live category. */
  readonly registerAction: <Act extends Action>(action: Act) => Act;
  /** List the actions visible in this process. */
  readonly actions: () => readonly Action[];
}

/** Options for object-shaped carrier declarations. */
export interface CarrierOptions {
  /** JSON Schema title for the carrier document. */
  readonly title?: string;
  /** JSON Schema description for the carrier document. */
  readonly description?: string;
  /** Whether object-shaped carriers admit properties outside the declared shape. */
  readonly additionalProperties?: boolean;
}

/** A registered operation at the relating boundary. */
export interface Action {
  /** Runtime tag for action declarations. */
  readonly kind: "relating.action";
  /** Stable verb used by dispatch, CLI, HTTP, MCP, OpenAPI, and web forms. */
  readonly verb: string;
  /** Default wire codec used to decode boundary input. */
  readonly inputFormat: string;
  /** Default wire codec used to encode boundary output. */
  readonly outputFormat: string;
  /** Named valued CLI/dispatch options this action accepts. */
  readonly options: readonly string[];
  /** Short human-facing action summary. */
  readonly summary?: string;
  /** Longer human-facing action description. */
  readonly description?: string;
  /** Carrier consumed by a true morphism. Undefined for raw admission boundaries. */
  readonly domain?: Carrier;
  /** Carrier produced by a true morphism. Undefined for transport or untyped boundaries. */
  readonly codomain?: Carrier;
  /** JSON Schema reference projected from `domain`, or a legacy explicit schema ref. */
  readonly domainSchema?: JsonRecord;
  /** JSON Schema reference projected from `codomain`, or a legacy explicit schema ref. */
  readonly codomainSchema?: JsonRecord;
  /** Optional RMN body. Carrier-to-carrier morphisms should carry this when possible. */
  readonly runTerm?: Tm;
  /** Executable boundary body. For RMN actions this is the evaluator applied to `runTerm`. */
  readonly run: (input: unknown, args: Record<string, unknown>) => MaybePromise<unknown>;
}

/** Input to `action(...)`: the authored form before defaults and schema refs are projected. */
export interface ActionSpec {
  /** Stable verb used by every projected boundary face. */
  readonly verb: string;
  /** Default input wire codec; defaults to `json`. */
  readonly inputFormat?: string;
  /** Default output wire codec; defaults to `json`. */
  readonly outputFormat?: string;
  /** Named valued CLI/dispatch options this action accepts. */
  readonly options?: readonly string[];
  /** Short human-facing action summary. */
  readonly summary?: string;
  /** Longer human-facing action description. */
  readonly description?: string;
  /** Carrier consumed by this operation when it is a true morphism. */
  readonly domain?: Carrier;
  /** Carrier produced by this operation when it is a true morphism. */
  readonly codomain?: Carrier;
  /** Explicit domain schema ref for migration or boundary surfaces. Prefer `domain`. */
  readonly domainSchema?: JsonRecord;
  /** Explicit codomain schema ref for migration or boundary surfaces. Prefer `codomain`. */
  readonly codomainSchema?: JsonRecord;
  /** RMN body for behavior-as-data. The acting wrapper can derive `run` from this. */
  readonly runTerm?: Tm;
  /** Host-language executable body. Required at the kernel layer. */
  readonly run?: (input: unknown, args: Record<string, unknown>) => MaybePromise<unknown>;
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

/**
 * Declare a carrier once: TypeBox schema, Static<> type source, JSON Schema, and Ajv validator.
 *
 * @example
 * ```ts
 * import { Type, schemaCarrier } from "@emsenn/relating/typing";
 *
 * const summary = schemaCarrier(
 *   "example/summary",
 *   Type.String({ $id: "example/summary" }),
 * );
 * summary.validate("settled"); // true
 * ```
 */
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

/**
 * Declare an object-shaped carrier once: TypeBox schema, Static<> type source, JSON Schema, and Ajv validator.
 *
 * @example
 * ```ts
 * import { Type, carrier } from "@emsenn/relating/typing";
 *
 * const note = carrier("example/note", {
 *   kind: Type.Literal("example.note"),
 *   body: Type.String({ minLength: 1 }),
 * });
 * note.schema.$id; // "example/note"
 * note.validate({ kind: "example.note", body: "hi" }); // true
 * ```
 */
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

/**
 * Register a morphism or boundary action.
 *
 * Carrier objects are the preferred source of domain/codomain schema refs. This
 * function is the kernel-level constructor, so it requires an executable `run`.
 * The public acting wrapper can supply that `run` by evaluating a `runTerm`.
 */
export function action(spec: ActionSpec): Action {
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
  }) satisfies Action;
  return registeredCategory.registerAction(value);
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

/**
 * Classify actions for the IR migration.
 *
 * Carrier-to-carrier morphisms should be carried as `runTerm`; boundary actions
 * are admissions, codecs, or transports. This is intentionally computed from the
 * declared domain/codomain rather than maintained as a curated list.
 */
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

/**
 * The serializable TypeBox-backed morphism carrier for an action.
 *
 * This is the shape that durable logs can store: the executable closure is
 * excluded, while the typed domain/codomain ids and optional IR `runTerm` remain
 * as data.
 *
 * @example
 * ```ts
 * import { morphismCarrier } from "@emsenn/relating/typing";
 *
 * const serializable = morphismCarrier(someAction);
 * Object.hasOwn(serializable, "run"); // false
 * ```
 */
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
