/**
 * @emsenn/relating — the relational substrate.
 *
 * The root surface is the callable script morphism surface over
 * `(action, token, ?claim)`. Carrier, domain, codomain, and
 * representation-boundary classes live on explicit package subpaths.
 */
export {
  evalRelation,
  scriptActions,
  scriptMorphisms,
  type BoundaryDocument,
  type EvaluateOptions,
  type PackageExports,
  type ScriptAction,
  type ScriptMorphism,
  type ScriptMorphismRegistry,
} from "./scripts/api.mjs";
