import {
  compareText,
  readText,
  settleText,
  type EvaluateOptions,
  type PackageExports,
} from "./internal.mjs";

export type { EvaluateOptions, PackageExports } from "./internal.mjs";

export type ScriptAction = "scripts.settle" | "scripts.read" | "scripts.compare";
/** A decoded POSIX/API/MCP boundary document, not a relational Mark payload. */
export type BoundaryDocument = string;
export type ScriptMorphism = (
  tokenDocument: BoundaryDocument,
  claimDocument: BoundaryDocument | undefined,
  options: EvaluateOptions,
) => BoundaryDocument;
export type ScriptMorphismRegistry = { readonly [action in ScriptAction]: ScriptMorphism };

export const scriptActions: readonly ScriptAction[] = Object.freeze([
  "scripts.settle",
  "scripts.read",
  "scripts.compare",
]);

export const scriptMorphisms = Object.freeze({
  "scripts.settle": (tokenDocument, _claimDocument, options) => settleText(tokenDocument, options),
  "scripts.read": (tokenDocument, _claimDocument, options) => readText(tokenDocument, options),
  "scripts.compare": (tokenDocument, claimDocument, options) => {
    if (claimDocument === undefined) throw new TypeError("eval-relation: scripts.compare requires a claim input");
    return compareText(tokenDocument, claimDocument, options);
  },
} satisfies ScriptMorphismRegistry);

function isScriptAction(action: string): action is ScriptAction {
  return Object.prototype.hasOwnProperty.call(scriptMorphisms, action);
}

function scriptAction(value: string | undefined): ScriptAction {
  const action = value ?? "scripts.settle";
  if (isScriptAction(action)) return action;
  throw new TypeError(`eval-relation: unsupported action ${JSON.stringify(action)} (expected ${scriptActions.join(", ")})`);
}

function assertExportedAction(action: ScriptAction, exportsMap: PackageExports | undefined): void {
  if (exportsMap === undefined) return;
  const [root] = action.split(".");
  const subpath = root === "scripts" ? "./scripts" : `./${root}`;
  if (!(subpath in exportsMap)) {
    throw new TypeError(`eval-relation: action ${action} is not under an exported package subpath (${subpath})`);
  }
}

export function evalRelation(
  tokenDocument: BoundaryDocument,
  claimDocument: BoundaryDocument | undefined,
  options: EvaluateOptions,
): BoundaryDocument {
  const action = scriptAction(options.action);
  assertExportedAction(action, options.exports);
  return scriptMorphisms[action](tokenDocument, claimDocument, options);
}
