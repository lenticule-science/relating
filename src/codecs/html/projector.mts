/**
 * codecs/html/projector — SHP bound into the holography kernel: a
 * `Projector<ChargedCell>` whose recognition is "this is an SHP packet", whose
 * `read` is `markup` (HTML → cells) and whose `write` is `project` (cells →
 * HTML). This is where the html codec becomes a holography node like any other,
 * composable in a restriction lattice via ../../holography `restrict`.
 */
import { define, type Projector } from "../../holography/index.mjs";
import type { ChargedCell } from "./normalize.mjs";
import { fromCells } from "./normalize.mjs";
import { project } from "./project.mjs";
import { markup } from "./markup.mjs";

export const htmlProjector: Projector<ChargedCell> = define<ChargedCell>({
  type: "shp.html",
  recognize: (resource) => /class="semantic-hypertext-packet"/.test(resource.content),
  read: (resource) => markup(resource.content),
  write: (cells) => project(fromCells("packet", cells)),
});
