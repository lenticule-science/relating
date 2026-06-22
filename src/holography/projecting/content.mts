// holography/projecting/content — the content tier: a per-entity cut of the bulk.
//
//   log → state → record → CONTENT
//
// The fourth projection of the same boundary. Where state/record project the
// whole bulk into one file, content projects a *cut*: each accepted entity of a
// view becomes its own term-addressed document, rendered by a content
// projection (default: markdown with YAML frontmatter, the inverse of the
// markdown codec's `markdownDataform`). The cut is an explicit acceptance
// judgment — a window over the entities of the view — not a hidden filter, in
// the sense of geometry/spatial/cut-and-project. Pure: ./store does the I/O.

import { createMarkdown } from "../../codecs/markdown.mjs";
import type { EntityView, StateView } from "./state.mjs";

/** One projected content document: an entity, its file type, and its content. */
export interface ContentDocument {
  readonly entity: string;
  readonly type: string;
  readonly content: string;
}

/** How a view becomes content: the file type, the per-entity renderer, and the
 *  optional cut (the acceptance window over entities; default accepts all). */
export interface ContentProjection {
  readonly type: string;
  readonly render: (entity: string, view: EntityView) => string;
  readonly accept?: (entity: string, view: EntityView) => boolean;
}

/** The default content projection: markdown with YAML frontmatter, all entities. */
export const markdownContent: ContentProjection = Object.freeze({
  type: "md",
  render: (_entity: string, view: EntityView) => createMarkdown(view),
});

/** Project a view into per-entity content documents, keeping only the accepted
 *  cut. Order follows the view's entity order. */
export function projectContentDocuments(
  view: StateView,
  projection: ContentProjection = markdownContent,
): readonly ContentDocument[] {
  const accept = projection.accept ?? (() => true);
  const documents: ContentDocument[] = [];
  for (const [entity, entityView] of Object.entries(view)) {
    if (!accept(entity, entityView)) continue;
    documents.push(Object.freeze({ entity, type: projection.type, content: projection.render(entity, entityView) }));
  }
  return Object.freeze(documents);
}
