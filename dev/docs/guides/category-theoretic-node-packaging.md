# Category-Theoretic Node Package Modularization Rules

The keywords **MUST**, **SHOULD**, and **MAY** are normative.

## 1. Package = Category

A package **MUST** be treated as a category.

The package root **MUST** define the package's public callable surface.

The package root **MUST NOT** be treated as a namespace bag.

## 2. Modules = Objects or Subcategories

A top-level module **MUST** correspond to a real object, subcategory, or theoretical boundary.

A top-level module **MUST NOT** exist only for naming convenience, import shortening, or loose grouping.

## 3. Nesting = Containment

If `B` is defined inside `A`, `B` **MUST** be placed at `A/B`.

Implementations **MUST NOT** flatten contained structures for shorter imports.

Import paths **SHOULD** preserve the containment relation they expose.

## 4. Exports = Commitments

A public export **MUST** be one of the following:

- an object or carrier
- a morphism
- a domain or codomain surface
- an apex, extremum, closure, limit, or related universal construction
- a representation boundary
- a lawful finite vocabulary

A symbol **MUST NOT** be exported publicly unless it satisfies one of these roles.

## 5. Functions = Morphisms

Every exported function **MUST** have a domain.

Every exported function **MUST** have a codomain.

Every exported function **MUST** have a stated law, preservation condition, role, or transformation meaning.

If a function cannot be described as a morphism, it **MUST** remain private.

## 6. Constructors Admit; Readers Derive

Constructors **MUST** admit minimal principled objects.

Public input APIs **MUST NOT** require callers to declare derived structure as if it were primitive.

Readers **SHOULD** derive downstream structure from admitted objects.

Derived structure **SHOULD** be computed rather than accepted as authoritative input.

## 7. Keep the Base Object Opaque

Core code **MUST NOT** inspect carriers such as `Mark` as ordinary JavaScript data.

Only representation boundaries **MAY** inspect carrier payloads.

A representation boundary that inspects a payload **MUST** do so only to prove membership, admission, or rejection.

## 8. Boundaries Are Not Ontology

Transport forms such as JSON, CLI text, HTTP bodies, files, HTML, RDF, and similar representations **MUST** be treated as transport witnesses.

Transport forms **MUST NOT** be treated as category objects.

Representation boundaries **MAY** translate, witness, admit, reject, encode, or decode.

Representation boundaries **MUST NOT** define the ontology of the package.

## 9. Root Import = Universal Call Surface

The TypeScript root import **MUST** expose the same universal call surface expected by shell, API, and MCP users.

If shell, API, and MCP users call `(action, token, ?claim)`, root TypeScript importers **SHOULD** see the same surface.

Rich internal structure **MUST** live on explicit subpaths.

## 10. Internal Barrels Are Not Contracts

Internal barrel modules **MAY** export broadly within a package.

Internal barrel modules **MUST NOT** be treated as public contracts.

External symbols **MUST** be promoted only to real categorical surfaces.

A public module **MUST NOT** export everything merely because the symbols are locally convenient.

## 11. Moves Need Domain/Codomain Evidence

A symbol **MUST NOT** be moved only for naming taste, shorter imports, or perceived tidiness.

A symbol **MAY** be moved only when its domain, codomain, and containment relation identify the target module.

A move **SHOULD** make the package's categorical structure clearer.

## 12. Tests State Laws

Tests for public surfaces **MUST** state categorical claims.

A test **SHOULD** read as one of the following forms:

- this morphism preserves `X`
- this boundary refuses `Y`
- this constructor admits `Z`
- this reader derives `B` from `A`
- this representation witnesses `C`
- this closure, limit, apex, or extremum satisfies its stated role

Tests **MUST NOT** merely assert incidental implementation behavior when a public law is at stake.

## 13. Dependencies Follow Construction

Imports **SHOULD** flow in the following direction:

```text
base objects
-> morphisms
-> closures / limits
-> geometry
-> analysis
-> codecs / adapters
```

A lower construction layer **MUST NOT** depend on a higher derived layer unless the dependency is explicitly justified as a boundary.

Codecs and adapters **MUST NOT** define base objects.

Analysis **MUST NOT** define the primitive carriers it analyzes.

## 14. Correctness Beats Compatibility During Realignment

During categorical realignment, correctness **MUST** take precedence over backward compatibility.

If an old export preserves a false boundary, maintainers **MAY** deprecate it.

If deprecation is insufficient, maintainers **MAY** break compatibility.

A breaking change **MUST** be accompanied by tests or documentation stating the new law, boundary, or containment relation.

## 15. Docs Include the Category Map

Every package **MUST** document its category map.

The category map **MUST** relate package, module, and submodule paths to their corresponding category, object, morphism, boundary, vocabulary, or construction role.

Contributors **SHOULD** be able to determine placement from the documented category map.

Contributors **MUST NOT** invent local house style when the category map already determines placement.
