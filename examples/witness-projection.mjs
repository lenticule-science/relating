import { mkdirSync, readFileSync, rmSync } from "node:fs";
import { relative, resolve, sep } from "node:path";

import {
  ensureStoreDirs,
  projectFeedContent,
  projectFeedState,
  readWitnessLog,
  witnessObservation,
} from "@emsenn/relating/holography/projecting";

const root = resolve(".tmp", "examples", "witness-projection");
rmSync(root, { recursive: true, force: true });
mkdirSync(root, { recursive: true });

const store = Object.freeze({
  logDir: resolve(root, "log"),
  stateDir: resolve(root, "state"),
  recordDir: resolve(root, "record"),
  contentDir: resolve(root, "content"),
});
ensureStoreDirs(store);

const claimFeed = Object.freeze({
  name: "claims",
  functional: Object.freeze(["title", "status", "body"]),
  cellize(observation, at) {
    const entity = observation.id;
    return [
      { e: entity, a: "title", v: observation.title, t: at },
      { e: entity, a: "status", v: observation.status, t: at },
      { e: entity, a: "source", v: observation.source, t: at },
      { e: entity, a: "body", v: observation.body, t: at },
    ];
  },
});

const first = witnessObservation(store, claimFeed, {
  id: "claim/relating-substrate",
  title: "Relating is a settling substrate",
  status: "supported",
  source: "triage/settling-substrate-unification",
  body: "A package can keep one witness field and project ordinary tool views.",
}, "2026-06-24T12:00:00Z");

const duplicate = witnessObservation(store, claimFeed, {
  id: "claim/relating-substrate",
  title: "Relating is a settling substrate",
  status: "supported",
  source: "triage/settling-substrate-unification",
  body: "A package can keep one witness field and project ordinary tool views.",
}, "2026-06-24T12:00:00Z");

const update = witnessObservation(store, claimFeed, {
  id: "claim/relating-substrate",
  title: "Relating is a settling substrate",
  status: "contested",
  source: "review/product-shape",
  body: "The stronger claim is product framing; the implemented surface is witness log, state view, and content cut.",
}, "2026-06-24T13:00:00Z");

const view = projectFeedState(store, claimFeed);
const written = projectFeedContent(store, claimFeed, {
  view,
  projection: {
    type: "md",
    accept: (_entity, entityView) => typeof entityView.body === "string",
    render(entity, entityView) {
      const id = JSON.parse(entity);
      const sources = Array.isArray(entityView.source) ? entityView.source : [];
      return [
        "---",
        `title: ${JSON.stringify(entityView.title)}`,
        `status: ${JSON.stringify(entityView.status)}`,
        `sources: ${JSON.stringify(sources)}`,
        "---",
        "",
        `# ${entityView.title}`,
        "",
        String(entityView.body),
        "",
        `Entity: \`${id}\``,
        "",
      ].join("\n");
    },
  },
});

const stateEntity = view[JSON.stringify("claim/relating-substrate")];
const contentPreview = readFileSync(written[0], "utf8").split("\n").slice(0, 8);
const rel = (path) => relative(root, path).split(sep).join("/");

console.log(JSON.stringify({
  product: "relating.witness-projection",
  feed: claimFeed.name,
  appended: {
    first: first.appended,
    duplicate: duplicate.appended,
    update: update.appended,
    totalRows: readWitnessLog(store, claimFeed.name).length,
  },
  state: {
    entities: Object.keys(view).length,
    status: stateEntity?.status,
    sources: stateEntity?.source,
  },
  content: {
    written: written.map(rel),
    preview: contentPreview,
  },
}, null, 2));
