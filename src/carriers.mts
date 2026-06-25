/**
 * carriers — the package's validating carrier objects.
 *
 * The library (`lib/`) declares each carrier as a pure TypeBox schema with a bare
 * `$id` — data, no machinery. Here the runtime kernel wraps those schemas into
 * Carrier objects: it compiles the Ajv validator and registers them in the live
 * category, so downstream faculties get `.validate`/`.assert` and can type their
 * actions by these domains and codomains. This module is the seam between the
 * static declarations and the machinery that runs claims against them.
 */
import { schemaCarrier } from "./typing/index.mjs";
import { utteranceSchema, articulationCellSchema } from "../lib/articulating/utterance.mjs";
import { memeSchema } from "../lib/articulating/predicating/positing/fiber.mjs";
import { TySchema, TmSchema } from "../lib/notating/index.mjs";

/** The base admission carrier: a token and a claim, each carrying a Mark. */
export const utteranceCarrier = schemaCarrier(utteranceSchema.$id, utteranceSchema);

/** An utterance opened at its potential aperiodic articulation cell. */
export const articulationCellCarrier = schemaCarrier(articulationCellSchema.$id, articulationCellSchema);

/** A predication cell bound to a bilattice charge — the minimal meaning-with-evidence unit. */
export const memeCarrier = schemaCarrier(memeSchema.$id, memeSchema);

/** The RMN type-language carrier (`Ty`). */
export const tyCarrier = schemaCarrier(TySchema.$id, TySchema);

/** The RMN term-language carrier (`Tm`). */
export const tmCarrier = schemaCarrier(TmSchema.$id, TmSchema);
